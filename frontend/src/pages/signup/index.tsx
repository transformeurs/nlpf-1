import { BuildingOfficeIcon, CakeIcon, EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/20/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import FileInput from "../../components/file-input";
import Input, { InputType } from "../../components/input";
import Layout from "../../components/layout";
import TextArea from "../../components/textarea";
import { NotificationStatus, useNotification } from "../../context/NotificationContext";
import { fetchApi, FetchMethod, uploadFormImage } from "../../utils/fetch";

interface SignUpPayload {
    name: string;
    age: number;
    email: string;
    password: string;
    description?: string;
    pronouns?: string;
    photo_url?: string;
}

const SignUpForm: FC = () => {
    const router = useRouter();
    const { addNotification } = useNotification();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [userRole, setUserRole] = useState("candidates"); // Candidate by default
    const handleUserRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserRole(event.target.value);
    };

    // Create a reference to the hidden file input element
    const photoFileInput = React.useRef<HTMLInputElement>(null);

    // Handles the submit event on form submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevents the default behavior of the form (submitting and refreshing the page)
        event.preventDefault();
        const data: SignUpPayload = {
            name: event.currentTarget.username.value,
            age: event.currentTarget.age.value,
            email: event.currentTarget.email.value,
            password: event.currentTarget.password.value,
            description: event.currentTarget.description.value,
            pronouns: userRole === "candidates" ? event.currentTarget.pronouns.value : null
        };

        setButtonLoading(true);

        // First we submit the photo to the API through a FormData object
        if (photoFileInput.current !== null && photoFileInput.current.files!.length > 0) {
            const formData = new FormData();
            formData.append("file", photoFileInput.current!.files![0] as File);
            const uploadResponse = await uploadFormImage(`/${userRole}/uploadImage`, formData);

            if (!uploadResponse || uploadResponse.statusCode !== 200) {
                addNotification(
                    NotificationStatus.Error,
                    "Une erreur est survenue lors de l'envoi de votre photo."
                );
                setButtonLoading(false);
                return;
            } else {
                data.photo_url = uploadResponse.data.filename;
            }
        }

        const response = await fetchApi(`/${userRole}`, FetchMethod.POST, null, data);

        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, veuillez vérifier votre connexion internet."
            );
        } else if (response.statusCode === 400) {
            addNotification(NotificationStatus.Error, "Addresse courriel déjà prise.");
        } else if (response.statusCode === 200) {
            router.push("/signup/success");
        } else {
            addNotification(NotificationStatus.Error, "Une erreur inconnue est survenue.");
        }
        setButtonLoading(false);
    };

    return (
        <div className="flex justify-center">
            <div className="w-full rounded-lg bg-white shadow lg:w-1/2">
                <div className="px-4 py-8 sm:px-10">
                    <div className="text-center text-lg font-semibold">Inscription</div>
                    <div className="mt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid items-center justify-center">
                                <div className="mb-2 text-center italic">Qui êtes-vous ?</div>
                                <div>
                                    <input
                                        type="radio"
                                        value="candidates"
                                        id="candidateRole"
                                        onChange={handleUserRoleChange}
                                        checked={userRole === "candidates"}
                                    />
                                    <label htmlFor="candidateRole" className="ml-2 mr-5">
                                        Candidat·e
                                    </label>
                                    <input
                                        type="radio"
                                        value="companies"
                                        id="companyRole"
                                        onChange={handleUserRoleChange}
                                        checked={userRole === "companies"}
                                    />
                                    <label htmlFor="companyRole" className="ml-2">
                                        Entreprise
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="username" className="sr-only">
                                    Name
                                </label>
                                <Input
                                    type={InputType.TEXT}
                                    name={"username"}
                                    id={"username"}
                                    autoComplete={"name"}
                                    placeholder={
                                        userRole === "candidates"
                                            ? "Votre nom"
                                            : "Nom de l'entreprise"
                                    }
                                    leftIcon={
                                        userRole === "candidates" ? UserIcon : BuildingOfficeIcon
                                    }
                                    required
                                />
                            </div>

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
                                    leftIcon={EnvelopeIcon}
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
                                    autoComplete={"new-password"}
                                    placeholder={"Mot de passe"}
                                    leftIcon={KeyIcon}
                                    required
                                />
                            </div>

                            {userRole == "candidates" && (
                                <div>
                                    <label htmlFor="age" className="sr-only">
                                        Âge
                                    </label>
                                    <Input
                                        type={InputType.TEXT}
                                        name={"age"}
                                        id={"age"}
                                        placeholder={
                                            "Âge"
                                        }
                                        leftIcon={CakeIcon}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <div>
                                    <TextArea
                                        name="description"
                                        id="description"
                                        rows={5}
                                        placeholder={
                                            userRole === "candidates"
                                                ? "Décrivez vous en quelques mots..."
                                                : "Décrivez votre entreprise..."
                                        }
                                    />
                                </div>
                            </div>

                            {userRole == "candidates" && (
                                <div>
                                    <label htmlFor="pronouns">Vos pronoms</label>
                                    <Input
                                        type={InputType.TEXT}
                                        name={"pronouns"}
                                        id={"pronouns"}
                                        placeholder={
                                            "il/lui, elle/elle, ils/leur, elles/leur, etc..."
                                        }
                                    />
                                </div>
                            )}

                            <div>
                                Photo de profil
                                <FileInput ref={photoFileInput} className="mt-3" />
                            </div>

                            <div>
                                <Button
                                    type={ButtonType.PRIMARY}
                                    size={ButtonSize.MD}
                                    isSubmit={true}
                                    loading={buttonLoading}
                                    label={"S'inscrire"}
                                    className="w-full"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignUp: NextPage = () => {
    return (
        <Layout>
            <SignUpForm />
        </Layout>
    );
};

export default SignUp;
