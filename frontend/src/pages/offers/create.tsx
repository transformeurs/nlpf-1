import type { NextPage } from "next";
import Layout from "../../components/layout";
import { AuthorizationRole, useAuth } from "../../context/AuthContext";
import Input, { InputType } from "../../components/input";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import {
    BanknotesIcon,
    BriefcaseIcon,
    GlobeEuropeAfricaIcon,
    TagIcon
} from "@heroicons/react/20/solid";
import TextArea from "../../components/textarea";
import { FormEvent, useState } from "react";
import { fetchApi, FetchMethod } from "../../utils/fetch";
import { NotificationStatus, useNotification } from "../../context/NotificationContext";
import Modal, { ModalIcon, ModalType } from "../../components/modal";
import { useRouter } from "next/router";
import ComboBox from "../../components/combobox";

const Home: NextPage = () => {
    const { token } = useAuth({ requiredRole: AuthorizationRole.Company });
    const { addNotification } = useNotification();
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState<string>("");

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const response = await fetchApi("/offers", FetchMethod.POST, token, {
            // @ts-ignore
            title: e.currentTarget.title.value,
            location: e.currentTarget.location.value,
            // skills: e.currentTarget.skills.value.split(",").map((skill) => skill.trim()),
            salary: e.currentTarget.salary.value,
            time: e.currentTarget.time.value,
            skills: skills,
            description: e.currentTarget.description.value
        });

        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, vérifiez votre connexion internet."
            );
        } else if (response.statusCode === 200) {
            setShowModal(true);
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
                        <ComboBox
                            id="time"
                            name="time"
                            values={[
                                {
                                    key: "cdi",
                                    label: "Contrat à durée indéterminée",
                                    subLabel: "CDI"
                                },
                                {
                                    key: "cdd",
                                    label: "Contrat à durée déterminée",
                                    subLabel: "CDD"
                                },
                                { key: "stage", label: "Stage" }
                            ]}
                            placeholder="Type de contrat"
                        />
                        <Input
                            type={InputType.TEXT}
                            name="salary"
                            id="salary"
                            placeholder="Salaire"
                            leftIcon={BanknotesIcon}
                        />
                        <div>
                            <div className="flex space-x-2">
                                <div className="w-full">
                                    <Input
                                        type={InputType.TEXT}
                                        name="skill"
                                        id="skill"
                                        placeholder="Compétence"
                                        leftIcon={TagIcon}
                                        onChange={(value) => {
                                            console.log("add", value);
                                            setSkillInput(value ?? "");
                                        }}
                                    />
                                </div>
                                <Button
                                    type={ButtonType.SECONDARY}
                                    size={ButtonSize.MD}
                                    label={"Ajouter"}
                                    className="mt-1"
                                    onClick={() => {
                                        if (skillInput) setSkills([...skills, skillInput]);
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex space-x-1">
                                {skills.map((skill, skillIdx) => (
                                    <div
                                        key={skillIdx}
                                        className="cursor-pointer rounded-2xl border border-gray-400 px-2 py-0.5 text-gray-500 hover:bg-red-200"
                                        onClick={() => {
                                            setSkills(skills.filter((_, idx) => idx !== skillIdx));
                                        }}
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
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
            <Modal
                type={ModalType.CENTERED}
                open={showModal}
                setOpen={setShowModal}
                icon={ModalIcon.SUCCESS}
                title="Offre créée"
                buttons={[
                    {
                        type: ButtonType.PRIMARY,
                        label: "Fermer",
                        onClick: () => {
                            setShowModal(false);
                            router.push("/offers");
                        }
                    }
                ]}
            >
                <p className="text-center text-sm text-gray-600">
                    L'offre a été créée avec succès.
                </p>
            </Modal>
        </Layout>
    );
};

export default Home;
