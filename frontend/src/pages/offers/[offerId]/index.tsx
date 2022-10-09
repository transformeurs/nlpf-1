import {
    BanknotesIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    ChevronDoubleRightIcon,
    PencilIcon,
    EnvelopeIcon,
    FlagIcon,
    HomeIcon
} from "@heroicons/react/20/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../../components/button";
import Layout from "../../../components/layout";
import Input, { InputType } from "../../../components/input";
import { AuthorizationRole, useAuth } from "../../../context/AuthContext";
import { FC, useState } from "react";
import { getOffer } from "../../../hooks/api-offer";
import FileInput from "../../../components/file-input";
import { NotificationStatus, useNotification } from "../../../context/NotificationContext";

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
    startTime
}) => {
    const router = useRouter();
    const { token } = useAuth({ requiredRole: AuthorizationRole.AnyUser });
    const { addNotification } = useNotification();
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: number }>({});

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

    const questions = [
        {
            question: "Quel temps fait-il dehors ?",
            answers: ["réponse possible 1", "réponse possible 2", "réponse possible 3"]
        },
        {
            question: "Ceci est une seconde question !",
            answers: ["réponse possible 1", "réponse possible 2", "réponse possible 3"]
        }
    ];

    return (
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
            <div className="col-span-4 col-start-2 rounded-lg bg-white p-8 shadow">
                <div className="text-2xl font-semibold text-indigo-700">Candidater</div>

                <form className="mt-8 space-y-12">
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-2">
                            <div className="text-lg font-medium text-gray-800">Documents</div>
                            <div className="text-sm text-gray-600">
                                Téléchargez votre CV et votre lettre de motivation pour postuler
                                à l'offre.
                            </div>
                        </div>
                        <div className="grid grid-cols-4">
                            <div className="col-span-1 flex items-center font-medium text-gray-700">
                                C.V.
                            </div>
                            <FileInput className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4">
                            <div className="col-span-1 flex items-center font-medium text-gray-700">
                                Lettre de motivation
                            </div>
                            <FileInput className="col-span-3" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="border-b border-gray-200 pb-2">
                            <div className="text-lg font-medium text-gray-800">
                                Questionnaire
                            </div>
                            <div className="text-sm text-gray-600">
                                Répondez au questionnaire afin de donner une idée au recruteur
                                de votre niveau d'expertise.
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
                            label={"Envoyer"}
                        />
                    </div>
                </form>
            </div>
        </div>
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
    const { offer, isLoading, isError } = getOffer(offerId as unknown as number);

    return (
        <Layout
            breadcrumbs={[
                { label: "Offres", href: "/offers" },
                { label: `Offre ${offer ? offer.title : "#1" }`, href: `/offers/${offerId}` }
            ]}
        >
            <div className="space-y-10">
                {offer &&
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
                    />
                }
            </div>
        </Layout>
    );
};

export default OfferPage;
