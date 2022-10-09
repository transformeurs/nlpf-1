import {
    BuildingOfficeIcon,
    CalendarIcon,
    CheckBadgeIcon,
    EnvelopeIcon,
    QuestionMarkCircleIcon,
    XCircleIcon
} from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Button, { ButtonSize, ButtonType } from "../components/button";
import Layout from "../components/layout";
import LoadingIcon from "../components/loadingIcon";
import { useCandidacy } from "../hooks/api-candidacy";

const Home: NextPage = () => {
    const { candidacies, isLoading, isError } = useCandidacy();

    // const candidacies = [
    //     {
    //         createdAt: new Date(),
    //         title: "Ingénieur QA",
    //         description: "Nous recherchons un ingénieur QA pour notre équipe de développement.",
    //         author: "Société Générale",
    //         contact: "rh@sg.fr",
    //         skills: ["Stage", "Agile", "Typescript", "React"],
    //         status: "En attente"
    //     },
    //     {
    //         createdAt: new Date(),
    //         title: "Developper FullStack",
    //         description:
    //             "Nous recherchons un développeur FullStack pour notre équipe de développement.",
    //         author: "SAP",
    //         contact: "rh@sap-les-meilleurs.com",
    //         skills: ["CDD", "Agile", "Python", "JavaScript", "Vue"],
    //         status: "Acceptée"
    {
        /*    },*/
    }
    //     {
    //         createdAt: new Date(),
    //         title: "Developper Backend",
    //         description:
    //             "Nous recherchons un développeur Backend pour notre équipe de développement.",
    //         author: "HPE",
    //         contact: "recrutement@hpe.fr",
    //         skills: ["CDI", "Agile", "PHP", "Typescript", "Symfony"],
    //         status: "Refusée"
    //     }
    // ];

    return (
        <Layout breadcrumbs={[{ label: "Candidatures", href: "/candidacies" }]}>
            <div className="space-y-10">
                {isLoading && (
                    <div className="flex justify-center font-medium text-white">
                        <LoadingIcon className="mr-2 h-6 w-6" /> Chargement...
                    </div>
                )}
                {isError && (
                    <div className="flex justify-center font-medium text-white">
                        Une erreur est survenue lors du chargement des offres.
                    </div>
                )}
                {candidacies &&
                    candidacies.map((offer, offerIdx) => (
                        <div key={offerIdx} className="flex rounded bg-white p-6 shadow-lg">
                            {/* Box content */}
                            <div className="w-full">
                                <div className="text-xl font-semibold text-indigo-700">
                                    {offer.title}
                                </div>

                                <div className="mt-0.5 flex items-center text-sm text-gray-600">
                                    <CalendarIcon className="mr-1 h-5 w-5" />
                                    {offer.createdAt.toDateString()}
                                </div>
                                <div className="my-3">{offer.description}</div>
                                <div className="flex items-center font-medium text-gray-600">
                                    <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                                    {offer.author} <EnvelopeIcon className="mr-1 ml-5 h-5 w-5" />
                                    {offer.contact}
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    {offer.skills.map((skill, skillIdx) => (
                                        <div
                                            key={skillIdx}
                                            className="rounded-2xl border border-gray-400 px-2 py-0.5 text-gray-500"
                                        >
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right content */}
                            <div className="flex flex-col">
                                <div>
                                    <Button
                                        type={
                                            offer.status == "En attente"
                                                ? ButtonType.PRIMARY
                                                : offer.status == "Acceptée"
                                                ? ButtonType.SUCCESS
                                                : ButtonType.DANGER
                                        }
                                        size={ButtonSize.XL}
                                        label={
                                            offer.status == "En attente"
                                                ? "En attente"
                                                : offer.status == "Acceptée"
                                                ? "Acceptée"
                                                : "Refusée"
                                        }
                                        rightIcon={
                                            offer.status == "En attente"
                                                ? QuestionMarkCircleIcon
                                                : offer.status == "Acceptée"
                                                ? CheckBadgeIcon
                                                : XCircleIcon
                                        }
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <div className="mt-2 whitespace-nowrap text-sm text-gray-600">
                                        Candidature envoyée le{" "}
                                        {offer.createdAt.toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </Layout>
    );
};

export default Home;
