import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCaption, type GenerateCaptionParams } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { title, imageUrl, type, category } = body as GenerateCaptionParams;

        // Validate required fields
        if (!title || !type) {
            return NextResponse.json(
                { error: "Title and type are required" },
                { status: 400 }
            );
        }

        // Validate type
        if (!["post", "donation", "gallery"].includes(type)) {
            return NextResponse.json(
                { error: "Invalid type. Must be one of: post, donation, gallery" },
                { status: 400 }
            );
        }

        // Generate caption using Gemini AI
        const result = await generateCaption({
            title,
            imageUrl,
            type,
            category,
        });

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("AI Caption generation error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to generate caption",
            },
            { status: 500 }
        );
    }
}
