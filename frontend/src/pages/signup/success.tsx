import { NextPage } from "next";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import Layout from "../../components/layout";

const SignUpSuccess: NextPage = () => {
    const router = useRouter();

    return (
        <Layout>
            <div className="flex justify-center">
                <div className="w-full lg:w-8/12 rounded-lg bg-white shadow">
                    <div className="grid grid-cols-1 px-4 py-8 sm:px-10">
                        <div className="text-center text-lg font-semibold">Félicitations !</div>
                        <div className="text-center italic mt-5">
                            Votre inscription est confirmée.
                        </div>
                        <Button
                            type={ButtonType.PRIMARY}
                            size={ButtonSize.MD}
                            isSubmit={false}
                            label={"Se connecter"}
                            className="w-1/2 md:w-1/4 lg:w-1/4 mx-auto mt-5"
                            onClick={() => {
                                router.push("/");
                            }}
                        />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SignUpSuccess;
