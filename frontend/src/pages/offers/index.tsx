import { BuildingOfficeIcon, CalendarIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import Layout from "../../components/layout";
import LoadingIcon from "../../components/loadingIcon";
import { useOffer } from "../../hooks/api-offer";
import { FC } from "react";
import { AuthorizationRole, useAuth } from "../../context/AuthContext";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

export interface OfferPanelProps {
    title: string;
    createdAt: Date;
    description: string;
    author: string;
    contact: string;
    skills: string[];
    responseTime: number;
}

const OfferPanel: FC<OfferPanelProps> = ({
    title,
    createdAt,
    description,
    author,
    contact,
    skills,
    responseTime
}) => {
    return (
        <div className="flex rounded bg-white p-6 shadow-lg">
            {/* Box content */}
            <div className="w-full">
                <div className="text-xl font-semibold text-indigo-700">{title}</div>

                <div className="mt-0.5 flex items-center text-sm text-gray-600">
                    <CalendarIcon className="mr-1 h-5 w-5" />
                    {createdAt.toDateString()}
                </div>
                <div className="my-3">{description}</div>
                <div className="flex items-center font-medium text-gray-600">
                    <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                    {author} <EnvelopeIcon className="mr-1 ml-5 h-5 w-5" />
                    {contact}
                </div>
                <div className="mt-4 flex space-x-2">
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

            {/* Right content */}
            <div className="flex flex-col">
                <div>
                    <Button
                        type={ButtonType.PRIMARY}
                        size={ButtonSize.XL}
                        label={"Postuler"}
                        rightIcon={CursorArrowRaysIcon}
                        className="w-full"
                    />
                </div>
                <div>
                    <div className="mt-2 whitespace-nowrap text-sm text-gray-600">
                        {responseTime}% de taux de réponse
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home: NextPage = () => {
    const { hasPermission } = useAuth({
        requiredRole: AuthorizationRole.AnyUser,
        redirectUrl: "/"
    });
    const router = useRouter();
    const { offers, isLoading, isError } = useOffer();

    return (
        <Layout breadcrumbs={[{ label: "Offres", href: "/offers" }]}>
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
                {hasPermission(AuthorizationRole.Company) && (
                    <div className="flex flex-col items-center justify-center rounded bg-white p-6 shadow-lg">
                        <div className="mb-2 flex items-center font-medium text-gray-800">
                            <BriefcaseIcon className="mr-1 h-8 w-8" /> Vous souhaitez faire
                            apparaître votre offre ici ?
                        </div>
                        <Button
                            type={ButtonType.PRIMARY}
                            size={ButtonSize.LG}
                            label="Publier une offre"
                            onClick={() => router.push("/offers/create")}
                        />
                    </div>
                )}
                {offers &&
                    offers.map((offer, offerIdx) => (
                        <OfferPanel
                            key={offerIdx}
                            title={offer.title}
                            createdAt={new Date(offer.created_at)}
                            description={offer.description}
                            author={offer.author}
                            contact={offer.contact}
                            skills={offer.skills}
                            responseTime={offer.response_time}
                        />
                    ))}
            </div>
        </Layout>
    );
};

export default Home;
