"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isSuperAdmin } from "@/lib/permissions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

/**
 * Get all users (SUPER_ADMIN only)
 */
export async function getUsers() {
    const session = await auth();

    if (!session?.user || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return users;
}

/**
 * Create a new user (SUPER_ADMIN only)
 */
export async function createUser(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}) {
    const session = await auth();

    if (!session?.user || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized");
    }

    // Validate email uniqueness
    const existing = await db.user.findUnique({
        where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
        throw new Error("Email sudah digunakan");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await db.user.create({
        data: {
            name: data.name,
            email: data.email.toLowerCase().trim(),
            password: hashedPassword,
            role: data.role,
        },
    });

    revalidatePath("/admin/users");
    return user;
}

/**
 * Update a user (SUPER_ADMIN only)
 */
export async function updateUser(
    id: string,
    data: {
        name?: string;
        email?: string;
        role?: UserRole;
        password?: string;
    }
) {
    const session = await auth();

    if (!session?.user || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized");
    }

    // Prevent self-demotion from SUPER_ADMIN
    if (session.user.id === id && data.role && data.role !== "SUPER_ADMIN") {
        throw new Error("Tidak bisa mengubah role sendiri");
    }

    // If email is being changed, check uniqueness
    if (data.email) {
        const existing = await db.user.findFirst({
            where: {
                email: data.email.toLowerCase().trim(),
                NOT: { id },
            },
        });

        if (existing) {
            throw new Error("Email sudah digunakan");
        }
    }

    // Build update data
    const updateData: {
        name?: string;
        email?: string;
        role?: UserRole;
        password?: string;
    } = {};

    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase().trim();
    if (data.role) updateData.role = data.role;
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await db.user.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/admin/users");
    return user;
}

/**
 * Delete a user (SUPER_ADMIN only)
 */
export async function deleteUser(id: string) {
    const session = await auth();

    if (!session?.user || !isSuperAdmin(session.user.role)) {
        throw new Error("Unauthorized");
    }

    // Prevent self-deletion
    if (session.user.id === id) {
        throw new Error("Tidak bisa menghapus akun sendiri");
    }

    await db.user.delete({
        where: { id },
    });

    revalidatePath("/admin/users");
    return { success: true };
}
