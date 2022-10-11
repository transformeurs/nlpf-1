import useSWR from "swr";
import { AuthorizationRole, useAuth } from "../context/AuthContext";

export interface GetCandidacyResponse {
    id: number;
    offer_id: number;
    candidate_id: number;
    candidate_name: string;
    candidate_email: string;
    candidate_age: number;
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

export interface GetCandidaciesResponse extends Array<GetCandidacyResponse> { }

export function useCandidacy(id?: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.All });

    if (id) {
        const { data, error, mutate } = useSWR<GetCandidacyResponse>([
            `/candidacies/${id}`,
            token
        ]);

        return {
            candidacy: data,
            isLoading: !error && !data,
            isError: error,
            mutate
        };
    } else {
        const { data, error, mutate } = useSWR<GetCandidaciesResponse>([
            `/candidacies`,
            token
        ]);

        return {
            candidacies: data,
            isLoading: !error && !data,
            isError: error,
            mutate
        };
    }
}

export function useOfferCandidacies(offerId: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.Company });

    const { data, error, mutate } = useSWR<GetCandidaciesResponse>([
        `/offers/${offerId}/candidacies`,
        token
    ]);

    return {
        candidacies: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}
