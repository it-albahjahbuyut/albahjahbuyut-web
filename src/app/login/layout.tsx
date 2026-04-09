import { AuthProviders } from "@/components/providers";

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProviders>{children}</AuthProviders>;
}
