import * as React from "react";
import { FC, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { NotificationStatus, useNotification } from "./NotificationContext";

type User = {
    name: string;
    email: string;
    role: string;
    avatarUrl: string;
};

export const AuthContext = React.createContext<
    | {
          user: User | null;
          token: string | null;
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
    const [token, setToken] = useState<string | null>(null);
    const { addNotification } = useNotification();

    useEffect(() => {
        if (!token) {
            setUser(null);
        } else {
            localStorage.setItem("token", token);
            const newUser = jwt_decode(token) as User;
            setUser(newUser);
            addNotification(NotificationStatus.Success, `Connecté en tant que ${newUser.name}`);
        }
    }, [token]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) setToken(token);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                setToken,
                hasPermission: (role: AuthorizationRole) => {
                    switch (role) {
                        case AuthorizationRole.AnyUser:
                            return ["company", "candidate"].includes(user?.role ?? "");
                        case AuthorizationRole.Company:
                            return ["company"].includes(user?.role ?? "");
                        case AuthorizationRole.Candidate:
                            return ["candidate"].includes(user?.role ?? "");
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
    Candidate,
    Company,
    AnyUser,
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
