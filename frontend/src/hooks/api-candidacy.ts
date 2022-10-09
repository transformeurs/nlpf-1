import useSWR from "swr";
import { AuthorizationRole, useAuth } from "../context/AuthContext";

export interface GetCandidacyResponse extends Array<GetCandidacyResponse> {
    author: string;
    contact: string;
    created_at: string;
    description: string;
    id: number;
    location: string;
    response_time: number;
    salary: number;
    skills: string[];
    start_time: string;
    time: string;
    title: string;
}

export function useCandidacy(id?: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.All });

    const { data, error, mutate } = useSWR<GetCandidacyResponse>([
        `/candidacies${id ? `?id=${id}` : ""}`,
        token
    ]);

    return {
        candidacies: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}
