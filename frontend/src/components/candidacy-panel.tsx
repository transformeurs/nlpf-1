import { FC } from "react";
import {
    BuildingOfficeIcon,
    CalendarIcon,
    CheckBadgeIcon,
    EnvelopeIcon,
    QuestionMarkCircleIcon,
    UserIcon,
    XCircleIcon
} from "@heroicons/react/20/solid";
import Link from "next/link";
import Button, { ButtonSize, ButtonType } from "./button";
import { useRouter } from "next/router";

export interface CandidacyPanelProps {
    candidacyId: number;
    title: string;
    createdAt: Date;
    description: string;
    candidateName?: string;
    candidateEmail?: string;
    candidateAge?: number;
    companyName?: string;
    companyEmail?: string;
    skills: string[];
    status: string;
}

const CandidacyPanel: FC<CandidacyPanelProps> = ({
    candidacyId,
    title,
    createdAt,
    description,
    candidateName,
    candidateEmail,
    candidateAge,
    companyName,
    companyEmail,
    skills,
    status
}) => {
    const router = useRouter();

    return (
        <div className="flex rounded bg-white p-6 shadow-lg">
            {/* Box content */}
            <div className="w-full">
                <Link href={`/candidacies/${candidacyId}`}>
                    <div className="cursor-pointer text-xl font-semibold text-indigo-700">
                        {title}
                    </div>
                </Link>

                <div className="mt-0.5 flex items-center text-sm text-gray-600">
                    <CalendarIcon className="mr-1 h-5 w-5" />
                    {createdAt.toDateString()}
                </div>
                <div className="my-3">{description}</div>
                <div className="flex items-center space-x-4 font-medium text-gray-600">
                    {companyName && (
                        <div className="flex items-center">
                            <BuildingOfficeIcon className="mr-1 h-5 w-5" />
                            {companyName}
                        </div>
                    )}
                    {companyEmail && (
                        <div className="flex items-center">
                            <EnvelopeIcon className="mr-1 h-5 w-5" />
                            {companyEmail}
                        </div>
                    )}
                    {candidateName && (
                        <div className="flex items-center">
                            <UserIcon className="mr-1 h-5 w-5" />
                            {candidateName}
                        </div>
                    )}
                    {candidateEmail && (
                        <div className="flex items-center">
                            <EnvelopeIcon className="mr-1 h-5 w-5" />
                            {candidateEmail}
                        </div>
                    )}
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
                        type={
                            status == "pending"
                                ? ButtonType.PRIMARY
                                : status == "accepted"
                                ? ButtonType.SUCCESS
                                : ButtonType.DANGER
                        }
                        size={ButtonSize.XL}
                        label={
                            status == "pending"
                                ? "En attente"
                                : status == "accepted"
                                ? "Acceptée"
                                : "Refusée"
                        }
                        rightIcon={
                            status == "pending"
                                ? QuestionMarkCircleIcon
                                : status == "accepted"
                                ? CheckBadgeIcon
                                : XCircleIcon
                        }
                        className="w-full"
                        onClick={() => {
                            router.push(`/candidacies/${candidacyId}`);
                        }}
                    />
                </div>
                <div>
                    <div className="mt-2 whitespace-nowrap text-sm text-gray-600">
                        Candidature envoyée le {createdAt.toLocaleDateString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidacyPanel;
