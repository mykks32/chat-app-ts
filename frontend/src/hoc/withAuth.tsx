import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

const withAuth = <P extends Record<string, unknown>>(
    WrappedComponent: React.ComponentType<P>
  ): React.FC<P> => {
    const WithAuthComponent: React.FC<P> = (props) => {
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
