import { KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import { FC, useState } from "react";
import { NotificationStatus, useNotification } from "../context/NotificationContext";
import { fetchApi, FetchMethod } from "../utils/fetch";
import Button, { ButtonSize, ButtonType } from "./button";
import Input, { InputType } from "./input";

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LoginForm: FC = () => {
    const { addNotification } = useNotification();
    const [buttonLoading, setButtonLoading] = useState(false);

    // Handles the submit event on form submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevents the default behavior of the form (submitting and refreshing the page)
        event.preventDefault();

        setButtonLoading(true);
        const response = await fetchApi("/account/login", FetchMethod.POST, {
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value
        });
        setButtonLoading(false);

        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, vérifiez votre connexion internet."
            );
        } else if (response.statusCode === 401) {
            addNotification(NotificationStatus.Error, "Email ou mot de passe incorrect.");
        } else if (response.statusCode === 200) {
            // TODO: Remove this, will be replaced with storing the token in the browser's local storage
            alert(`Your token is ${response.data.access_token}`);

            // TODO:
            // - Redirect to home page if authenticated
            // - Display error message if auth failed
        }
    };

    return (
        <div className="rounded-lg bg-white shadow">
            <div className="px-4 py-8 sm:px-10">
                <div className="text-center text-lg font-semibold">Se connecter</div>
                <div className="mt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Mobile number or email
                            </label>
                            <Input
                                type={InputType.EMAIL}
                                name={"email"}
                                id={"email"}
                                autoComplete={true}
                                placeholder={"Adresse e-mail"}
                                leftIcon={UserIcon}
                            />
                            {/* autoComplete="email"
                                required */}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <Input
                                type={InputType.PASSWORD}
                                name={"password"}
                                id={"password"}
                                autoComplete={true}
                                placeholder={"Mot de passe"}
                                leftIcon={KeyIcon}
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
                    </form>
                </div>
            </div>
            <div className="rounded-b-lg border-t-2 border-gray-300 bg-gray-100 px-4 py-6 sm:px-10">
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

export default LoginForm;
