"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { donationSchema, type DonationInput } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { serializeDonation, serializeDonations } from "@/lib/types";

export async function getDonations(options?: {
    isActive?: boolean;
    limit?: number;
}) {
    try {
        const where: Record<string, unknown> = {};

        if (options?.isActive !== undefined) {
            where.isActive = options.isActive;
        }

        const donations = await db.donationProgram.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: options?.limit || 50,
        });

        return { success: true, data: serializeDonations(donations) };
    } catch (error) {
        console.error("Failed to fetch donations:", error);
        return { success: false, error: "Gagal mengambil data donasi" };
    }
}

export async function getDonation(id: string) {
    try {
        const donation = await db.donationProgram.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { order: "asc" }
                }
            }
        });

        if (!donation) {
            return { success: false, error: "Program donasi tidak ditemukan" };
        }

        return { success: true, data: serializeDonation(donation) };
    } catch (error) {
        console.error("Failed to fetch donation:", error);
        return { success: false, error: "Gagal mengambil data donasi" };
    }
}

export async function createDonation(data: DonationInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = donationSchema.parse(data);
        const { galleryImages, ...donationData } = validated;

        const donation = await db.donationProgram.create({
            data: {
                ...donationData,
                categoryLabel: donationData.categoryLabel,
                targetAmount: donationData.targetAmount,
                currentAmount: donationData.currentAmount || 0,
                // Create gallery images if provided
                images: galleryImages && galleryImages.length > 0 ? {
                    create: galleryImages.map((url, index) => ({
                        imageUrl: url,
                        order: index,
                    })),
                } : undefined,
            },
        });

        revalidatePath("/admin/donations");
        revalidatePath("/donasi");
        revalidatePath("/infaq");

        return { success: true, data: serializeDonation(donation) };
    } catch (error) {
        console.error("Failed to create donation:", error);
        return { success: false, error: "Gagal membuat program donasi" };
    }
}

export async function updateDonation(id: string, data: DonationInput) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const validated = donationSchema.parse(data);
        const { galleryImages, ...donationData } = validated;

        // Delete existing gallery images and create new ones in a transaction
        const donation = await db.$transaction(async (tx) => {
            // Delete existing gallery images
            await tx.donationProgramImage.deleteMany({
                where: { programId: id },
            });

            // Update donation with new gallery images
            return tx.donationProgram.update({
                where: { id },
                data: {
                    ...donationData,
                    categoryLabel: donationData.categoryLabel,
                    targetAmount: donationData.targetAmount,
                    currentAmount: donationData.currentAmount || 0,
                    updatedAt: new Date(),
                    // Create new gallery images if provided
                    images: galleryImages && galleryImages.length > 0 ? {
                        create: galleryImages.map((url, index) => ({
                            imageUrl: url,
                            order: index,
                        })),
                    } : undefined,
                },
            });
        });

        revalidatePath("/admin/donations");
        revalidatePath(`/admin/donations/${id}`);
        revalidatePath(`/donasi/${donation.slug}`);
        revalidatePath(`/infaq/${donation.slug}`);
        revalidatePath("/infaq");

        return { success: true, data: serializeDonation(donation) };
    } catch (error) {
        console.error("Failed to update donation:", error);
        return { success: false, error: "Gagal memperbarui program donasi" };
    }
}

export async function deleteDonation(id: string) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        await db.donationProgram.delete({ where: { id } });

        revalidatePath("/admin/donations");
        revalidatePath("/donasi");

        return { success: true };
    } catch (error) {
        console.error("Failed to delete donation:", error);
        return { success: false, error: "Gagal menghapus program donasi" };
    }
}

export async function updateDonationAmount(id: string, amount: number) {
    try {
        const session = await auth();
        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const donation = await db.donationProgram.update({
            where: { id },
            data: {
                currentAmount: amount,
                updatedAt: new Date(),
            },
        });

        revalidatePath("/admin/donations");
        revalidatePath(`/donasi/${donation.slug}`);

        return { success: true, data: serializeDonation(donation) };
    } catch (error) {
        console.error("Failed to update donation amount:", error);
        return { success: false, error: "Gagal memperbarui jumlah donasi" };
    }
}
