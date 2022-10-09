import {
    BuildingOfficeIcon,
    CalendarIcon,
    CheckBadgeIcon,
    EnvelopeIcon,
    QuestionMarkCircleIcon,
    XCircleIcon
} from "@heroicons/react/20/solid";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import Layout from "../../components/layout";
import LoadingIcon from "../../components/loadingIcon";
import { AuthorizationRole, useAuth } from "../../context/AuthContext";
import { useCandidacy } from "../../hooks/api-candidacy";

const Home: NextPage = () => {
    const { candidacies, isLoading, isError } = useCandidacy();
    const auth = useAuth({ requiredRole: AuthorizationRole.AnyUser })
    const router = useRouter();

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
                    candidacies.map((candidacy, candidacyIdx) => (
                        <div key={candidacyIdx} className="flex rounded bg-white p-6 shadow-lg">
                            {/* Box content */}
                            <div className="w-full">
                                <Link href={`/candidacies/${candidacy.id}`}>
                                    <div className="text-xl font-semibold text-indigo-700 cursor-pointer">
                                        {candidacy.offer_title}
                                    </div>
                                </Link>

                                <div className="mt-0.5 flex items-center text-sm text-gray-600">
                                    <CalendarIcon className="mr-1 h-5 w-5" />
                                    {new Date(candidacy.created_at).toDateString()}
                                </div>
                                <div className="my-3">{candidacy.offer_description}</div>
                                <div className="flex items-center font-medium text-gray-600">
                                    <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                                    {candidacy.company_name}
                                    <EnvelopeIcon className="mr-1 ml-5 h-5 w-5" />
                                    {candidacy.company_email}
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    {candidacy.skills.map((skill, skillIdx) => (
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
                                            candidacy.status == "pending"
                                                ? ButtonType.PRIMARY
                                                : candidacy.status == "accepted"
                                                    ? ButtonType.SUCCESS
                                                    : ButtonType.DANGER
                                        }
                                        size={ButtonSize.XL}
                                        label={
                                            candidacy.status == "pending"
                                                ? "En attente"
                                                : candidacy.status == "accepted"
                                                    ? "Acceptée"
                                                    : "Refusée"
                                        }
                                        rightIcon={
                                            candidacy.status == "pending"
                                                ? QuestionMarkCircleIcon
                                                : candidacy.status == "accepted"
                                                    ? CheckBadgeIcon
                                                    : XCircleIcon
                                        }
                                        className="w-full"
                                        onClick={() => {
                                            router.push(`/candidacies/${candidacy.id}`);
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="mt-2 whitespace-nowrap text-sm text-gray-600">
                                        Candidature envoyée le{" "}
                                        {new Date(candidacy.created_at).toDateString()}
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
