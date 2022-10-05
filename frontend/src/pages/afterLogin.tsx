import { NextPage } from "next";
import Button, { ButtonSize, ButtonType } from "../components/button";
import Layout from "../components/layout";
import { useAuth, AuthorizationRole } from "../context/AuthContext";


const AfterLogin: NextPage = () => {
    const { user, disconnect } = useAuth({ requiredRole: AuthorizationRole.AnyUser, redirectUrl: "/" });

    return (
        <Layout>
            <h1 className="text-white">You're connected {user?.name}, as a {user?.role}</h1>
            <Button
                type={ButtonType.PRIMARY}
                size={ButtonSize.MD}
                label={"Déconnexion"}
                className={"mt-4"}
                onClick={() => disconnect()}
            />
        </Layout>
    );
};

export default AfterLogin;
