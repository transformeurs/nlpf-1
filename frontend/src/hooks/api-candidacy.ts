import useSWR from "swr";
import { AuthorizationRole, useAuth } from "../context/AuthContext";

export interface GetCandidacyResponse extends Array<GetCandidacyResponse> {
    id: number;
    offer_id: number;
    candidate_id: number;
    candidate_name: string;
    candidate_email: string;
    company_name: string;
    company_email: string;
    created_at: string;
    skills: string[];
    status: string;
    resume_url: string;
    cover_letter_url: string;
    offer_title: string;
    offer_description: string;
}

export function useCandidacy(id?: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.All });

    const { data, error, mutate } = useSWR<GetCandidacyResponse>([
        `/candidacies${id ? `/${id}` : ""}`,
        token
    ]);

    return {
        candidacies: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}
