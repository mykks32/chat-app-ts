"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    const WithAuthComponent = (props: any) => {
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
