import { KeyIcon, UserIcon } from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Link from "next/link";
import { FC, useState } from "react";
import Button, { ButtonType, ButtonSize } from "../components/button";
import Input, { InputType } from "../components/input";
import Layout from "../components/layout";
import { AuthorizationRole, useAuth } from "../context/AuthContext";
import { NotificationStatus, useNotification } from "../context/NotificationContext";
import { fetchApi, FetchMethod } from "../utils/fetch";

const LoginForm: FC = () => {
    const { setToken } = useAuth({
        requiredRole: AuthorizationRole.Visitor,
        redirectUrl: "/offers"
    });
    const { addNotification } = useNotification();
    const [buttonLoading, setButtonLoading] = useState(false);

    // Handles the submit event on form submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevents the default behavior of the form (submitting and refreshing the page)
        event.preventDefault();

        setButtonLoading(true);
        const response = await fetchApi("/account/login", FetchMethod.POST, null, {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value
        });
        setButtonLoading(false);

        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, veuillez vérifier votre connexion internet."
            );
        } else if (response.statusCode === 401) {
            addNotification(NotificationStatus.Error, "Courriel ou mot de passe incorrect.");
            (event.target as HTMLFormElement).reset(); // Clear the form
        } else if (response.statusCode === 200) {
            setToken(response.data.access_token);
        } else {
            addNotification(NotificationStatus.Error, "Une erreur inconnue est survenue.");
        }
    };

    return (
        <div className="col-span-4 rounded-lg bg-white shadow lg:col-span-1">
            <div className="px-4 py-8 sm:px-10">
                <div className="text-center text-lg font-semibold">Se connecter</div>
                <div className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                E-mail
                            </label>
                            <Input
                                type={InputType.EMAIL}
                                name={"email"}
                                id={"email"}
                                autoComplete={"email"}
                                placeholder={"Adresse de courriel"}
                                leftIcon={UserIcon}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <Input
                                type={InputType.PASSWORD}
                                name={"password"}
                                id={"password"}
                                autoComplete={"current-password"}
                                placeholder={"Mot de passe"}
                                leftIcon={KeyIcon}
                                required
                            />
                        </div>

                        <div>
                            <Button
                                type={ButtonType.PRIMARY}
                                size={ButtonSize.MD}
                                isSubmit={true}
                                loading={buttonLoading}
                                label={"Se connecter"}
                                className="w-full"
                            />
                        </div>

                        <p className="text-center text-xs leading-5 text-gray-500">
                            Pas de compte ?{" "}
                            <Link href="/signup">
                                <span className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
                                    Inscrivez-vous !
                                </span>
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <div className="rounded-b-lg border-t-2 border-gray-300 bg-gray-100 px-4 py-4 sm:px-6 sm:py-6">
                <p className="text-xs leading-5 text-gray-500">
                    En vous inscrivant, vous acceptez le{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        droit du travail russe
                    </a>
                    , la{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        convention de Genève
                    </a>{" "}
                    et la{" "}
                    <a href="#" className="font-medium text-gray-900 hover:underline">
                        réforme de l'OCM viti-vinicole
                    </a>
                    .
                </p>
            </div>
        </div>
    );
};

const Home: NextPage = () => {
    return (
        <Layout>
            <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                {/* Banner */}
                <div className="col-span-4 rounded-lg bg-white bg-home bg-cover shadow lg:col-span-3">
                    <div
                        className="h-full w-full rounded-lg"
                        style={{ backgroundColor: "hsla(0, 100%, 100%, .6" }}
                    >
                        <div
                            className="h-full w-full rounded-lg"
                            style={{ backgroundColor: "hsla(224, 62%, 65%, .5" }}
                        >
                            <div className="mx-auto h-full max-w-7xl">
                                <div className="flex h-full flex-col items-center p-4 sm:p-16">
                                    <h1 className="mt-4 text-2xl font-bold text-gray-800 sm:text-4xl md:text-5xl">
                                        <div>
                                            Contactez les meilleurs{" "}
                                            <span className="text-indigo-800">recruteurs</span>.
                                        </div>
                                        <div>
                                            Recrutez les meilleurs{" "}
                                            <span className="text-indigo-800">profils</span>.
                                        </div>
                                    </h1>
                                    <p className="mt-3 font-medium text-gray-700 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                                        <div>
                                            Recrutez les candidats de demain grâce à notre outil de
                                            recrutement basé sur le matching, en partenariat avec
                                            Tinder
                                        </div>
                                        <div className="mt-2">
                                            Trouvez un emploi facilement en candidatant à plus de 50
                                            000 offres qui vous correspondent
                                        </div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <LoginForm />

                {/* Numbers */}
                <div className="col-span-4 mt-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-4xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Plus de <span className="text-indigo-700">30 000</span> entreprises
                                nous font confiance
                            </h2>
                            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                                Vous aussi, faites confiance à JobBoard pour votre avenir ❤️
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 pb-12 sm:pb-16">
                        <div className="relative">
                            <div className="absolute inset-0 h-1/2" />
                            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="mx-auto max-w-4xl">
                                    <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                                        <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                                            <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                                                Distance Terre-Lune
                                            </dt>
                                            <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                                                8cm
                                            </dd>
                                        </div>
                                        <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                                            <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                                                Nombre de personnes sur Terre
                                            </dt>
                                            <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                                                90%
                                            </dd>
                                        </div>
                                        <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                                            <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500">
                                                Utilisateurs
                                            </dt>
                                            <dd className="order-1 text-5xl font-bold tracking-tight text-indigo-600">
                                                300k
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
