import {
    BriefcaseIcon,
    CalendarIcon,
    CheckBadgeIcon,
    DocumentIcon,
    EnvelopeIcon,
    UserIcon
} from "@heroicons/react/20/solid";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Button, { ButtonSize, ButtonType } from "../../../components/button";
import Layout from "../../../components/layout";
import { useState } from "react";
import { useCandidacy } from "../../../hooks/api-candidacy";
import Link from "next/link";
import { AuthorizationRole, useAuth } from "../../../context/AuthContext";
import { fetchApi, FetchMethod } from "../../../utils/fetch";
import { NotificationStatus, useNotification } from "../../../context/NotificationContext";

const CandidacyPage: NextPage = () => {
    const router = useRouter();
    const { user, hasPermission, token } = useAuth({ requiredRole: AuthorizationRole.AnyUser })
    const { addNotification } = useNotification();

    const candidacyId = router.query.candidacyId;
    const candidacyFetch = useCandidacy(+candidacyId!);
    const candidacy = candidacyFetch.candidacy!;

    const [statusLoading, setStatusLoading] = useState(false);
    const changeCandidacyStatus = async (status: "accepted" | "rejected") => {
        setStatusLoading(true);
        const response = await fetchApi(
            `/candidacies`,
            FetchMethod.PATCH,
            token,
            {
                id: candidacy.id,
                status: status
            },
        )
        setStatusLoading(false)
        if (!response || response.statusCode !== 200) {
            addNotification(
                NotificationStatus.Error,
                "Une erreur est survenue lors de la modification du statut de la candidature."
            );
        } else {
            addNotification(NotificationStatus.Success, "Candidature mise à jour avec succès");
            await candidacyFetch.mutate();
        }
    }

    return (
        <Layout
            breadcrumbs={[
                { label: "Candidatures", href: "/candidacies" },
                { label: candidacyFetch.isLoading || candidacyFetch.isError ? "Candidature ..." : `Candidature ${candidacy.offer_title}`, href: `/candidacies/${candidacyId}` }
            ]}
        >
            {!candidacyFetch.isLoading && !candidacyFetch.isError ? (
                <>
                    <div className="grid grid-cols-6 gap-4">
                        {/* Offer title and description */}
                        <div className="col-span-4 rounded-lg bg-white p-8 shadow">
                            <div className="text-2xl font-semibold text-indigo-700">{candidacy.offer_title} - {candidacy.company_name}</div>
                            <div className="my-3">{candidacy.offer_description}</div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {candidacy.skills.map((skill, skillIdx) => (
                                    <div
                                        key={skillIdx}
                                        className="rounded-2xl border border-gray-400 px-2 py-0.5 text-gray-500"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <Link href={`/offers/${candidacy.offer_id}`}>
                                    <div className="mt-6 font-semibold text-indigo-600 cursor-pointer hover:underline">Voir l'annonce...</div>
                                </Link>
                            </div>
                        </div>
                        <div className="col-span-2 rounded-lg bg-white p-8 shadow">
                            <div className="text-2xl font-semibold text-indigo-700">Détails</div>
                            <div className="mt-4 space-y-2">
                                <div className="mt-0.5 flex items-center text-gray-800">
                                    <BriefcaseIcon className="mr-1 h-5 w-5" />
                                    <div className="font-medium">Statut</div>
                                    <div className="grow"></div>
                                    {candidacy.status === "pending" ? (
                                        <div className="ml-2 px-2 py-0.5 rounded-md bg-gray-100 text-gray-800">
                                            En attente
                                        </div>) : candidacy.status === "accepted" ? (
                                            <div className="ml-2 px-2 py-0.5 rounded-md bg-green-100 text-green-800">
                                                Acceptée
                                            </div>) : (
                                        <div className="ml-2 px-2 py-0.5 rounded-md bg-red-100 text-red-800">
                                            Refusée
                                        </div>)}
                                </div>
                                {[
                                    { icon: UserIcon, label: "Candidat", value: candidacy.candidate_name },
                                    { icon: EnvelopeIcon, label: "Courriel", value: candidacy.candidate_email },
                                    {
                                        icon: CalendarIcon,
                                        label: "Date de candidature",
                                        value: new Date(candidacy.created_at).toLocaleDateString()
                                    },
                                    { icon: DocumentIcon, label: `CV de ${candidacy.candidate_name}`, value: candidacy.resume_url, isLink: true },
                                    { icon: EnvelopeIcon, label: "Lettre de motivation", value: candidacy.cover_letter_url, isLink: true },
                                ].map((field) => (
                                    <div className="mt-0.5 flex items-center text-gray-800">
                                        <field.icon className="mr-1 h-5 w-5" />
                                        {field.isLink && field.value ? (
                                            <div className="font-medium hover:underline">
                                                <a href={field.value}>{field.label}</a>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="font-medium">{field.label}</div>
                                                <div className="flex-1 text-end text-gray-600">{field.value}</div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {hasPermission(AuthorizationRole.Company) && (
                                <div className="mt-6 flex justify-center">
                                    <Button
                                        type={ButtonType.SUCCESS}
                                        size={ButtonSize.XL}
                                        label="Accepter"
                                        rightIcon={CheckBadgeIcon}
                                        className="flex-auto mr-1"
                                        loading={statusLoading}
                                        onClick={async () => await changeCandidacyStatus("accepted")}
                                    />
                                    <Button
                                        type={ButtonType.DANGER}
                                        size={ButtonSize.XL}
                                        label="Refuser"
                                        rightIcon={CheckBadgeIcon}
                                        className="flex-auto ml-1"
                                        loading={statusLoading}
                                        onClick={async () => await changeCandidacyStatus("rejected")}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : candidacyFetch.isError ? (
                <div className="bg-white p-8 shadow rounded-lg text-center text-indigo-700">
                    <div className="font-bold">ERREUR</div>
                    <div className="">Candidature inconnue ou inaccessible.</div>
                </div>
            ) : (
                <div className="text-center text-white">Chargement...</div>
            )}
        </Layout>
    );
};

export default CandidacyPage;
