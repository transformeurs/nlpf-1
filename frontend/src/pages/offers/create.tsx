import type { NextPage } from "next";
import Layout from "../../components/layout";
import { AuthorizationRole, useAuth } from "../../context/AuthContext";
import Input, { InputType } from "../../components/input";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import { BanknotesIcon, BriefcaseIcon, GlobeEuropeAfricaIcon } from "@heroicons/react/20/solid";
import TextArea from "../../components/textarea";
import { FormEvent } from "react";
import { fetchApi, FetchMethod } from "../../utils/fetch";
import { NotificationStatus, useNotification } from "../../context/NotificationContext";

const Home: NextPage = () => {
    const { token } = useAuth({ requiredRole: AuthorizationRole.Company });
    const { addNotification } = useNotification();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const response = await fetchApi("/offers", FetchMethod.POST, token, {
            title: e.currentTarget.title.value,
            location: e.currentTarget.location.value,
            // skills: e.currentTarget.skills.value.split(",").map((skill) => skill.trim()),
            salary: e.currentTarget.salary.value,
            time: e.currentTarget.time.value,
            description: e.currentTarget.description.value
        });

        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, vérifiez votre connexion internet."
            );
        } else if (response.statusCode === 200) {
            addNotification(NotificationStatus.Success, "L'offre a été créée avec succès.");
        }
    }

    return (
        <Layout
            breadcrumbs={[
                { label: "Offres", href: "/offers" },
                { label: "Création d'offre", href: "/offers/create" }
            ]}
        >
            <div className="flex w-full justify-center">
                <div className="w-1/2 rounded bg-white p-6 shadow-lg">
                    <div className="text-center text-xl font-semibold text-gray-800">
                        Formulaire de création d'offre
                    </div>
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                        <Input
                            type={InputType.TEXT}
                            name="title"
                            id="title"
                            placeholder="Titre"
                            leftIcon={BriefcaseIcon}
                        />
                        <Input
                            type={InputType.TEXT}
                            name="location"
                            id="location"
                            placeholder="Localisation"
                            leftIcon={GlobeEuropeAfricaIcon}
                        />
                        <Input
                            type={InputType.TEXT}
                            name="salary"
                            id="salary"
                            placeholder="Salaire"
                            leftIcon={BanknotesIcon}
                        />
                        <TextArea name="description" id="description" placeholder="Description" />
                        <Button
                            type={ButtonType.PRIMARY}
                            size={ButtonSize.LG}
                            isSubmit={true}
                            label="Créer l'offre"
                            className="w-full"
                        />
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Home;
