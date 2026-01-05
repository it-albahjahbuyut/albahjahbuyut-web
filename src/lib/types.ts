import { Decimal } from "@prisma/client/runtime/client";

// Serializable types for passing from Server to Client Components
// Prisma Decimal is converted to number for JSON serialization

export interface SerializedDonation {
    id: string;
    title: string;
    slug: string;
    description: string;
    image: string | null;
    targetAmount: number;
    currentAmount: number;
    bankName: string;
    accountNumber: string;
    accountName: string | null;
    isActive: boolean;
    isFeatured: boolean;
    startDate: Date;
    endDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

// Helper function to serialize a Prisma DonationProgram
export function serializeDonation<T extends {
    targetAmount: Decimal | number;
    currentAmount: Decimal | number;
}>(donation: T): Omit<T, 'targetAmount' | 'currentAmount'> & {
    targetAmount: number;
    currentAmount: number;
} {
    return {
        ...donation,
        targetAmount: Number(donation.targetAmount),
        currentAmount: Number(donation.currentAmount),
    };
}

// Helper to serialize an array of donations
export function serializeDonations<T extends {
    targetAmount: Decimal | number;
    currentAmount: Decimal | number;
}>(donations: T[]): (Omit<T, 'targetAmount' | 'currentAmount'> & {
    targetAmount: number;
    currentAmount: number;
})[] {
    return donations.map(serializeDonation);
}
