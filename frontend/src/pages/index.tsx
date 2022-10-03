import { ChevronRightIcon } from "@heroicons/react/24/outline";
import type { NextPage } from "next";
import Layout from "../components/layout";
import LoginForm from "../components/loginForm";

const Home: NextPage = () => {
    return (
        <Layout>
            <div className="grid grid-cols-4 gap-x-4 gap-y-4">
                <div className="col-span-3 rounded-lg bg-white bg-home bg-cover shadow">
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
