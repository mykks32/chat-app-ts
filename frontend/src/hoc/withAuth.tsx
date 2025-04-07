import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

interface WithAuthProps {
    [key: string]: unknown;
}

const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        const user = useAuthStore((state) => state.user);
        const loading = useAuthStore((state) => state.loading);
        const router = useRouter();

        useEffect(() => {
            if (!user && !loading) {
                router.push("/login");
            }
        }, [user, loading, router]);

        if (loading) {
            return <div>Loading...</div>;
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    }

    return WithAuthComponent;
};

export default withAuth;
