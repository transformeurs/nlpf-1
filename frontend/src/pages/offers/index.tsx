import {
    BriefcaseIcon as BriefcaseIconSolid,
    BuildingOfficeIcon,
    CalendarIcon,
    EnvelopeIcon,
    TrashIcon,
    WrenchIcon
} from "@heroicons/react/20/solid";
import { CursorArrowRaysIcon } from "@heroicons/react/24/solid";
import type { NextPage } from "next";
import Button, { ButtonSize, ButtonType } from "../../components/button";
import Layout from "../../components/layout";
import LoadingIcon from "../../components/loadingIcon";
import { useOffer } from "../../hooks/api-offer";
import { FC, useState } from "react";
import { AuthorizationRole, useAuth } from "../../context/AuthContext";
import { BriefcaseIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { fetchApi, FetchMethod } from "../../utils/fetch";
import { NotificationStatus, useNotification } from "../../context/NotificationContext";
import Link from "next/link";
import classNames from "../../utils/classNames";

export interface OfferPanelProps {
    offerId: number;
    title: string;
    createdAt: Date;
    time: string;
    description: string;
    author: string;
    contact: string;
    skills: string[];
    responseTime: number;
    isCompany: boolean;
}

const OfferPanel: FC<OfferPanelProps> = ({
    offerId,
    title,
    createdAt,
    time,
    description,
    author,
    contact,
    skills,
    responseTime,
    isCompany = false
}) => {
    const router = useRouter();
    const { token } = useAuth({ requiredRole: AuthorizationRole.AnyUser });
    const { mutate } = useOffer(isCompany);
    const { addNotification } = useNotification();
    const [deleteLoading, setDeleteLoading] = useState(false);

    return (
        <div className="flex rounded bg-white p-6 shadow-lg">
            {/* Box content */}
            <div className="w-full">
                <Link href={`/offers/${offerId}`}>
                    <div className="cursor-pointer text-xl font-semibold text-indigo-700">
                        {title}
                    </div>
                </Link>

                <div className="mt-0.5 flex items-center text-sm text-gray-600">
                    <div className="flex">
                        <CalendarIcon className="mr-1 h-5 w-5" />
                        {createdAt.toDateString()}
                    </div>
                    <div className="ml-2 flex">
                        <BriefcaseIconSolid className="mr-1 h-5 w-5" />
                        {time}
                    </div>
                </div>
                <div className="my-3">{description}</div>
                <div className="flex items-center font-medium text-gray-600">
                    <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                    {author}
                    <EnvelopeIcon className="mr-1 ml-5 h-5 w-5" />
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
                <div className="space-y-1">
                    {isCompany && (
                        <Button
                            type={ButtonType.DANGER}
                            size={ButtonSize.XL}
                            label={"Supprimer"}
                            rightIcon={TrashIcon}
                            className="w-full"
                            loading={deleteLoading}
                            onClick={async () => {
                                await setDeleteLoading(true);
                                const response = await fetchApi(
                                    `/offers/${offerId}`,
                                    FetchMethod.DELETE,
                                    token
                                );
                                await setDeleteLoading(false);
                                if (!response) {
                                    addNotification(
                                        NotificationStatus.Error,
                                        "Le serveur ne répond pas, vérifiez votre connexion internet."
                                    );
                                } else if (response.statusCode === 200) {
                                    addNotification(
                                        NotificationStatus.Success,
                                        "L'offre a bien été supprimée."
                                    );
                                    await mutate();
                                } else {
                                    addNotification(
                                        NotificationStatus.Error,
                                        "Une erreur est survenue lors de la suppression de l'offre."
                                    );
                                }
                            }}
                        />
                    )}
                    <Button
                        type={ButtonType.PRIMARY}
                        size={ButtonSize.XL}
                        label={isCompany ? "Consulter" : "Postuler"}
                        rightIcon={isCompany ? WrenchIcon : CursorArrowRaysIcon}
                        className="w-full"
                        onClick={() => router.push(`/offers/${offerId}`)}
                    />
                </div>
                <div>
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
    const isCompany = hasPermission(AuthorizationRole.Company);
    const { offers, isLoading, isError } = useOffer(isCompany);
    const [currentFilter, setCurrentFilter] = useState("Toutes");
    const [currentSort, setCurrentSort] = useState("Les plus récentes");

    const filters = [
        "Toutes",
        "Contrat à durée indéterminée",
        "Contrat à durée déterminée",
        "Stage"
    ];

    const sorts = ["Les plus récentes", "Les plus anciennes"];

    if (offers) {
        offers.forEach(element => {
            console.log(new Date(element.created_at));
        });
    }

    // @ts-ignore
    // @ts-ignore
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
                {isCompany && (
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
                <div className="flex space-x-2 rounded bg-white p-6 shadow-lg">
                    {filters.map((filter, filterIdx) => (
                        <button
                            key={filterIdx}
                            className={classNames(
                                "rounded-2xl px-2 py-0.5",
                                filter === currentFilter
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "border border-gray-400 text-gray-500 hover:bg-gray-100"
                            )}
                            onClick={() => setCurrentFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                    <div className="grow"></div>
                    {sorts.map((sort, sortIdx) => (
                        <button
                            key={sortIdx}
                            className={classNames(
                                "rounded-2xl px-2 py-0.5",
                                sort === currentSort
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                    : "border border-gray-400 text-gray-500 hover:bg-gray-100"
                            )}
                            onClick={() => setCurrentSort(sort)}
                        >
                            {sort}
                        </button>
                    ))}
                </div>
                {offers &&
                    offers
                        .filter(
                            (offer) => currentFilter === "Toutes" || offer.time === currentFilter
                        )
                        .map((offer, offerIdx) => ({
                            ...offer,
                            createdAt: new Date(offer.created_at)
                        }))
                        .sort((a, b) =>
                            currentSort === "Les plus récentes"
                                ? // @ts-ignore
                                b.createdAt - a.createdAt
                                : // @ts-ignore
                                a.createdAt - b.createdAt
                        )
                        .map((offer, offerIdx) => (
                            <OfferPanel
                                key={offer.id}
                                offerId={offer.id}
                                title={offer.title}
                                createdAt={new Date(offer.created_at)}
                                time={offer.time}
                                description={offer.description}
                                author={offer.author}
                                contact={offer.contact}
                                skills={offer.skills}
                                responseTime={offer.response_time}
                                isCompany={isCompany}
                            />
                        ))}
            </div>
        </Layout>
    );
};

export default Home;
