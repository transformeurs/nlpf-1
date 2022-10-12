import {
    BanknotesIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ChevronDoubleRightIcon,
    EnvelopeIcon,
    FlagIcon,
    HomeIcon,
    PencilIcon,
    UserGroupIcon
} from "@heroicons/react/20/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../../components/button";
import Layout from "../../../components/layout";
import { AuthorizationRole, useAuth } from "../../../context/AuthContext";
import React, { FC, useEffect, useState } from "react";
import { getOffer, useOffer } from "../../../hooks/api-offer";
import FileInput from "../../../components/file-input";
import { NotificationStatus, useNotification } from "../../../context/NotificationContext";
import { fetchApi, FetchMethod, uploadFormImage } from "../../../utils/fetch";
import Modal, { ModalIcon, ModalType } from "../../../components/modal";
import CandidacyPanel from "../../../components/candidacy-panel";
import { useCandidacy } from "../../../hooks/api-candidacy";
import LoadingIcon from "../../../components/loadingIcon";
import { CakeIcon, ChartBarIcon, ChartPieIcon, EyeDropperIcon, EyeIcon, FaceSmileIcon, KeyIcon } from "@heroicons/react/24/solid";

interface CandidacyCreate {
    offer_id: number;
    resume_url?: string;
    cover_letter_url?: string;
}

export interface OfferDetailsProps {
    offerId: number;
    title: string;
    createdAt: Date;
    time: string;
    description: string;
    author: string;
    contact: string;
    location: string;
    salary: number;
    skills: string[];
    startTime: string;
    isCompany: boolean;
}

const OfferDetails: FC<OfferDetailsProps> = ({
    offerId,
    title,
    createdAt,
    time,
    description,
    author,
    contact,
    location,
    salary,
    skills,
    startTime,
    isCompany
}) => {
    const router = useRouter();
    const { token } = useAuth({ requiredRole: AuthorizationRole.AnyUser });
    const { addNotification } = useNotification();
    const [buttonLoading, setButtonLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: number }>({});
    const { offer } = getOffer(offerId);
    const { candidacies, isLoading, isError } = useCandidacy();

    // Compute the average candidate age
    const averageAge = candidacies && candidacies.reduce((acc, curr) => acc + curr.candidate_age, 0) / candidacies.length;

    // Count as a view if the user is a candidate
    useEffect(() => {
        !isCompany && fetchApi(`/offers/${offerId}/views`, FetchMethod.POST, token);
    }, []);

    const fields = [
        {
            icon: CalendarIcon,
            label: "Date de création",
            value: createdAt.toLocaleDateString()
        },
        { icon: BuildingOfficeIcon, label: "Entreprise", value: author },
        { icon: EnvelopeIcon, label: "Contact", value: contact },
        { icon: HomeIcon, label: "Localisation", value: location },
        {
            icon: BanknotesIcon,
            label: "Salaire",
            value: (salary as number).toLocaleString() + " €"
        },
        { icon: FlagIcon, label: "Début", value: startTime },
        { icon: PencilIcon, label: "Contrat", value: time }
    ];

    const stats = [
        {
            icon: CakeIcon,
            label: "Âge moyen des candidats :",
            value: averageAge ? (averageAge + " ans") : "N/A"
        },
        {
            icon: UserGroupIcon,
            label: "Nombre de candidatures :",
            value: candidacies ? candidacies.length : "N/A"
        },
        {
            icon: EyeIcon,
            label: "Nombre de vues :",
            value: offer ? offer.views : "N/A"
        },
        {
            icon: ChartPieIcon,
            label: "Taux de conversion :",
            value: candidacies && offer ? ((candidacies.length / offer.views) * 100).toFixed(2) + "%" : "N/A"
        }
    ]

    const questions = [
        {
            question: "Quel temps fait-il dehors ?",
            answers: ["Beau", "Gris", "Pluvieux"]
        },
        {
            question: "En quelle année sommes-nous ?",
            answers: ["2002", "1922", "2022"]
        }
    ];

    const upload_file = async (file: File, path: string): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadFormImage(path, formData, token);
        if (!response || response.statusCode !== 200) {
            addNotification(
                NotificationStatus.Error,
                "Une erreur est survenue lors de l'envoi de votre candidature (fichier)."
            );
            setButtonLoading(false);
            return null;
        } else {
            return response.data.filename;
        }
    };

    const cvInputRef = React.useRef<HTMLInputElement>(null);
    const coverLetterInputRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data: CandidacyCreate = {
            offer_id: offerId
        };

        // First we submit the CV and Cover Letter to the API
        if (!cvInputRef.current || cvInputRef.current.files!.length === 0) {
            setShowErrorModal(true);
            return;
        }

        setButtonLoading(true);
        const resume_url = await upload_file(
            cvInputRef.current!.files![0] as File,
            "/candidacies/upload_resume"
        );
        if (resume_url) {
            data.resume_url = resume_url;
        }

        if (coverLetterInputRef.current !== null && coverLetterInputRef.current.files!.length > 0) {
            const cover_letter_url = await upload_file(
                coverLetterInputRef.current!.files![0] as File,
                "/candidacies/upload_cover_letter"
            );
            if (cover_letter_url) {
                data.cover_letter_url = cover_letter_url;
            }
        }

        const response = await fetchApi(`/candidacies`, FetchMethod.POST, token, data);
        if (!response) {
            addNotification(
                NotificationStatus.Error,
                "Le serveur ne répond pas, veuillez vérifier votre connexion internet."
            );
        } else if (response.statusCode === 400) {
            addNotification(NotificationStatus.Error, "Vous avez déjà postulé à cette offre.");
        } else if (response.statusCode === 200) {
            setShowModal(true);
        } else {
            addNotification(NotificationStatus.Error, "Une erreur inconnue est survenue.");
        }
        setButtonLoading(false);
    };

    return (
        <>
            <div className="grid grid-cols-6 gap-4">
                {/* Offer title and description */}
                <div className="col-span-4 rounded-lg bg-white p-8 shadow">
                    <div className="text-2xl font-semibold text-indigo-700">{title}</div>
                    <div className="my-3">{description}</div>
                </div>

                {/* Offer fields */}
                <div className="col-span-2 rounded-lg bg-white p-8 shadow">
                    <div className="text-2xl font-semibold text-indigo-700">Informations</div>

                    <div className="mt-4 space-y-2">
                        {fields.map((field, fieldIdx) => (
                            <div key={fieldIdx} className="mt-0.5 flex items-center text-gray-800">
                                <field.icon className="mr-1 h-5 w-5" />
                                <div className="font-medium">{field.label}</div>
                                <div className="flex-1 text-end text-gray-600">{field.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {skills.map((skill, skillIdx) => (
                            <div
                                key={skillIdx}
                                className="rounded-2xl border border-gray-400 px-2 py-0.5 text-gray-500"
                            >
                                {skill}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Offer form */}
                {!isCompany && (
                    <div className="col-span-4 col-start-2 rounded-lg bg-white p-8 shadow">
                        <div className="text-2xl font-semibold text-indigo-700">Candidater</div>

                        <form className="mt-8 space-y-12" onSubmit={handleSubmit}>
                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-2">
                                    <div className="text-lg font-medium text-gray-800">
                                        Documents
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Téléchargez votre CV et votre lettre de motivation pour
                                        postuler à l'offre.
                                    </div>
                                </div>
                                <div className="grid grid-cols-4">
                                    <div className="col-span-1 flex items-center font-medium text-gray-700">
                                        C.V.
                                    </div>
                                    <FileInput
                                        ref={cvInputRef}
                                        className="col-span-3"
                                        accept=".pdf"
                                    />
                                </div>
                                <div className="grid grid-cols-4">
                                    <div className="col-span-1 flex items-center font-medium text-gray-700">
                                        Lettre de motivation
                                    </div>
                                    <FileInput
                                        ref={coverLetterInputRef}
                                        className="col-span-3"
                                        accept=".pdf"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-2">
                                    <div className="text-lg font-medium text-gray-800">
                                        Questionnaire
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Répondez au questionnaire afin de donner une idée au
                                        recruteur de votre niveau d'expertise.
                                    </div>
                                </div>
                            </div>
                            {questions.map((question, questionIdx) => (
                                <div key={questionIdx}>
                                    <div className="flex items-center font-medium text-gray-700">
                                        <ChevronDoubleRightIcon className="mr-1 h-5 w-5" />
                                        {question.question}
                                    </div>
                                    <div className="mt-1 space-x-2">
                                        {question.answers.map((answer, answerIdx) => (
                                            <Button
                                                key={answerIdx}
                                                type={
                                                    selectedAnswers[questionIdx] === answerIdx
                                                        ? ButtonType.PRIMARY
                                                        : ButtonType.SECONDARY
                                                }
                                                size={ButtonSize.MD}
                                                label={answer}
                                                onClick={() =>
                                                    setSelectedAnswers({
                                                        ...selectedAnswers,
                                                        [questionIdx]: answerIdx
                                                    })
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-end">
                                <div className="mr-2 text-gray-700">
                                    Prêt à rejoindre l'aventure ? ✨
                                </div>
                                <Button
                                    type={ButtonType.PRIMARY}
                                    size={ButtonSize.LG}
                                    loading={buttonLoading}
                                    label={"Envoyer"}
                                    isSubmit={true}
                                />
                            </div>
                        </form>
                    </div>
                )}

                {/* Statistiques */}
                {isCompany && (
                    <div className="col-span-6 mt-6 space-y-10 bg">
                        <div className="text-2xl font-semibold text-indigo-700">Statistiques</div>
                        <div className="w-full">
                            {isLoading && (
                                <div className="flex justify-center font-medium text-white">
                                    <LoadingIcon className="mr-2 h-6 w-6" /> Chargement...
                                </div>
                            )}
                            {candidacies &&
                                <div className="flex rounded bg-white p-6 shadow-lg">
                                    {/* Box content */}
                                    <div className="mt-4 space-y-2 gap-x-2">
                                        {stats.map((stat, statIdx) => (
                                            <div key={statIdx} className="mt-0.5 flex items-center text-gray-800">
                                                <stat.icon className="mr-1 h-5 w-5" />
                                                <div className="font-medium">{stat.label}&nbsp;</div>
                                                <div className="flex-1 text-gray-600">{stat.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                )}

                {/* Offer current candidacies */}
                {isCompany && (
                    <div className="col-span-6 mt-6 space-y-10">
                        <div className="text-2xl font-semibold text-indigo-700">Candidatures</div>
                        <div className="w-full">
                            {isLoading && (
                                <div className="flex justify-center font-medium text-white">
                                    <LoadingIcon className="mr-2 h-6 w-6" /> Chargement...
                                </div>
                            )}
                            {candidacies &&
                                candidacies.map((candidacy, candidacyIdx) => (
                                    <CandidacyPanel
                                        key={candidacyIdx}
                                        candidacyId={candidacy.id}
                                        title={candidacy.offer_title}
                                        createdAt={new Date(candidacy.created_at)}
                                        description={candidacy.offer_description}
                                        candidateName={candidacy.candidate_name}
                                        candidateEmail={candidacy.candidate_email}
                                        skills={candidacy.skills}
                                        status={candidacy.status}
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
            <Modal
                type={ModalType.CENTERED}
                open={showModal}
                setOpen={setShowModal}
                icon={ModalIcon.SUCCESS}
                title="Candidature postée"
                buttons={[
                    {
                        type: ButtonType.PRIMARY,
                        label: "Fermer",
                        onClick: () => {
                            setShowModal(false);
                            router.push("/candidacies");
                        }
                    }
                ]}
            >
                <p className="text-center text-sm text-gray-600">
                    La candidature a été postée avec succès.
                </p>
            </Modal>
            <Modal
                type={ModalType.CENTERED}
                open={showErrorModal}
                setOpen={setShowErrorModal}
                icon={ModalIcon.ERROR}
                title="Candidature incomplète"
                buttons={[
                    {
                        type: ButtonType.PRIMARY,
                        label: "Fermer",
                        onClick: () => {
                            setShowErrorModal(false);
                        }
                    }
                ]}
            >
                <p className="text-center text-sm text-gray-600">
                    Un CV nécessaire pour postuler à cette annonce.
                </p>
            </Modal>
        </>
    );
};

const OfferPage: NextPage = () => {
    const { hasPermission } = useAuth({
        requiredRole: AuthorizationRole.AnyUser,
        redirectUrl: "/"
    });
    const router = useRouter();
    const offerId = router.query.offerId;
    const isCompany = hasPermission(AuthorizationRole.Company);
    const { offer, isLoading, isError } = getOffer(+offerId!);

    return (
        <Layout
            breadcrumbs={[
                { label: "Offres", href: "/offers" },
                { label: `Offre ${offer ? offer.title : "#1"}`, href: `/offers/${offerId}` }
            ]}
        >
            <div className="space-y-10">
                {offer && (
                    <OfferDetails
                        offerId={offer.id}
                        title={offer.title}
                        createdAt={new Date(offer.created_at)}
                        time={offer.time}
                        salary={offer.salary}
                        location={offer.location}
                        startTime={offer.start_time}
                        description={offer.description}
                        author={offer.author}
                        contact={offer.contact}
                        skills={offer.skills}
                        isCompany={isCompany}
                    />
                )}
            </div>
        </Layout>
    );
};

export default OfferPage;
