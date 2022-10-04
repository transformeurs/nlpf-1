import { UserIcon, KeyIcon, DocumentTextIcon, EnvelopeIcon, BuildingOfficeIcon } from "@heroicons/react/20/solid";
import { NextPage } from "next";
import React from "react";
import { FC, useState } from "react";
import Button, { ButtonType, ButtonSize } from "../components/button";
import Input, { InputType } from "../components/input";
import Layout from "../components/layout";
import { useNotification, NotificationStatus } from "../context/NotificationContext";
import { fetchApi, FetchMethod } from "../utils/fetch";


const SignUpForm: FC = () => {
    const { addNotification } = useNotification();
    const [buttonLoading, setButtonLoading] = useState(false);

    const [userRole, setUserRole] = useState("candidates"); // Candidate by default
    const handleUserRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserRole(event.target.value);
    };

    // Create a reference to the hidden file input element
    const hiddenFileInput = React.useRef<HTMLInputElement>(null);
    const fileName = React.useRef<HTMLSpanElement>(null);

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleFileClick = () => {
        hiddenFileInput.current?.click();
    };

    // Update the text for the file input
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileUploaded = event.target.files?.[0];
        fileName.current!.textContent = fileUploaded?.name || "";
    };

    // Handles the submit event on form submit
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        // Prevents the default behavior of the form (submitting and refreshing the page)
        event.preventDefault();

        setButtonLoading(true);
        // const response = await fetchApi("/account/login", FetchMethod.POST, {
        //     email: event.currentTarget.email.value,
        //     password: event.currentTarget.password.value
        // });
        // setButtonLoading(false);

        // if (!response) {
        //     addNotification(
        //         NotificationStatus.Error,
        //         "Le serveur ne répond pas, veuillez vérifier votre connexion internet."
        //     );
        // } else if (response.statusCode === 401) {
        //     addNotification(NotificationStatus.Error, "Courriel ou mot de passe incorrect.");
        //     (event.target as HTMLFormElement).reset(); // Clear the form
        // } else if (response.statusCode === 200) {
        //     setToken(response.data.access_token);
        // }
    };

    return (
        <div className="flex justify-center">
            <div className="w-full lg:w-1/2 rounded-lg bg-white shadow">
                <div className="px-4 py-8 sm:px-10">
                    <div className="text-center text-lg font-semibold">Inscription</div>
                    <div className="mt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <div>Qui êtes-vous ?</div>
                                <input type="radio" value="candidates" id="candidateRole" onChange={handleUserRoleChange} checked={userRole == "candidates"} />
                                <label htmlFor="candidateRole" className="ml-2">Candidat</label>
                                <input type="radio" value="companies" id="companyRole" onChange={handleUserRoleChange} checked={userRole == "companies"} />
                                <label htmlFor="companyRole" className="ml-2">Entreprise</label>
                            </div>

                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Name
                                </label>
                                <Input
                                    type={InputType.TEXT}
                                    name={"name"}
                                    id={"name"}
                                    autoComplete={true}
                                    placeholder={userRole == "candidates" ? "Votre nom" : "Nom de l'entreprise"}
                                    leftIcon={userRole == "candidates" ? UserIcon : BuildingOfficeIcon}
                                />
                                {/* autoComplete="email"
                                required */}
                            </div>

                            <div>
                                <label htmlFor="email" className="sr-only">
                                    E-mail
                                </label>
                                <Input
                                    type={InputType.EMAIL}
                                    name={"email"}
                                    id={"email"}
                                    autoComplete={true}
                                    placeholder={"Adresse de courriel"}
                                    leftIcon={EnvelopeIcon}
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
                                {/* required */}
                            </div>

                            <div>
                                <label htmlFor="passwordConfirm" className="sr-only">
                                    Password Confirmation
                                </label>
                                <Input
                                    type={InputType.PASSWORD}
                                    name={"passwordConfirm"}
                                    id={"passwordConfirm"}
                                    autoComplete={true}
                                    placeholder={"Confirmer le mot de passe"}
                                    leftIcon={KeyIcon}
                                />
                                {/* required */}
                            </div>

                            <div>
                                <label htmlFor="description">
                                    Description
                                </label>

                                <div>
                                    <textarea name="description" id="description" placeholder={
                                        userRole == "candidates" ? "Parlez-nous de vous..." : "Décrivez votre entreprise..."
                                    }></textarea>
                                </div>
                            </div>

                            {userRole == "candidates" && (
                                <div>
                                    <label htmlFor="pronouns">
                                        Pronouns
                                    </label>
                                    <Input
                                        type={InputType.TEXT}
                                        name={"pronouns"}
                                        id={"pronouns"}
                                        autoComplete={true}
                                        placeholder={"il/lui, elle/elle, ils/leur, elles/leur, etc..."}
                                    />
                                    {/* required */}
                                </div>
                            )}

                            <div>
                                Photo de profil
                                <div>
                                    <Button
                                        type={ButtonType.SECONDARY}
                                        size={ButtonSize.MD}
                                        label={"Choisir une photo"}
                                        onClick={handleFileClick}
                                    />
                                    <span ref={fileName}>Aucun fichier choisi</span>
                                </div>
                                <input type="file" id="photo" name="photo" ref={hiddenFileInput} style={{ display: 'none' }} onChange={handleFileChange} />
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