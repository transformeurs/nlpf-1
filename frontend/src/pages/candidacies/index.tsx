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
import CandidacyPanel from "../../components/candidacy-panel";

const Home: NextPage = () => {
    const { candidacies, isLoading, isError } = useCandidacy();
    const { hasPermission } = useAuth({ requiredRole: AuthorizationRole.AnyUser });
    const router = useRouter();

    const isCompany = hasPermission(AuthorizationRole.Company);

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
                        Une erreur est survenue lors du chargement des candidatures.
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
                            candidateName={isCompany ? candidacy.candidate_name : undefined}
                            candidateEmail={isCompany ? candidacy.candidate_email : undefined}
                            companyName={!isCompany ? candidacy.company_name : undefined}
                            companyEmail={!isCompany ? candidacy.company_email : undefined}
                            skills={candidacy.skills}
                            status={candidacy.status}
                        />
                    ))}
            </div>
        </Layout>
    );
};

export default Home;
