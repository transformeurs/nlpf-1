import * as React from "react";
import { FC, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { NotificationStatus, useNotification } from "./NotificationContext";

type User = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
};

const AuthContext = React.createContext<
    | {
          user: User | null;
          setToken: (token: string) => void;
          hasPermission: (permission: AuthorizationRole) => boolean;
          disconnect: () => void;
      }
    | undefined
>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<null | User>(null);
    const { addNotification } = useNotification();

    const setToken = (token: string) => {
        localStorage.setItem("token", token);
        const newUser = jwt_decode(token) as User;
        setUser(newUser);
        addNotification(NotificationStatus.Success, `Connecté en tant que ${newUser.name}`);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setUser(jwt_decode(token));
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setToken,
                hasPermission: (role: AuthorizationRole) => {
                    switch (role) {
                        case AuthorizationRole.SuperAdmin:
                            return ["superadmin"].includes(user?.role ?? "");
                        case AuthorizationRole.Admin:
                            return ["superadmin", "admin"].includes(user?.role ?? "");
                        case AuthorizationRole.User:
                            return ["superadmin", "admin", "user"].includes(user?.role ?? "");
                        case AuthorizationRole.Visitor:
                            return user === null;
                        case AuthorizationRole.All:
                            return true;
                    }
                },
                disconnect: () => {
                    localStorage.removeItem("token");
                    setUser(null);
                    addNotification(NotificationStatus.Info, "Vous avez été déconnecté");
                }
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export enum AuthorizationRole {
    SuperAdmin,
    Admin,
    User,
    Visitor,
    All
}

function useAuth(options: { requiredRole: AuthorizationRole; redirectUrl?: string }) {
    const router = useRouter();
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthContext");
    }

    useEffect(() => {
        if (!context.hasPermission(options.requiredRole)) {
            router.push(options.redirectUrl ?? "/");
        }
    }, [context]);

    return context;
}

export { AuthProvider, useAuth };
