import { NextPage } from "next";
import Link from "next/link";
import Layout from "../../components/layout";

const SignUpSuccess: NextPage = () => {
    return (
        <Layout>
            <Link href="/">
                <div className="cursor-pointer font-medium text-white hover:text-indigo-100">
                    Se connecter !
                </div>
            </Link>
        </Layout>
    );
};

export default SignUpSuccess;
