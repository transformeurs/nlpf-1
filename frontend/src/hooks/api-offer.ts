import useSWR from "swr";
import { AuthorizationRole, useAuth } from "../context/AuthContext";

export interface GetOfferResponse {
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

export interface GetOffersResponse extends Array<GetOfferResponse> { }

export function getOffer(id: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.All });

    const { data, error, mutate } = useSWR<GetOfferResponse>([
        `/offers/${id}`,
        token
    ]);

    return {
        offer: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}

export function useOffer(ownOffer?: boolean, id?: number) {
    const { token } = useAuth({ requiredRole: AuthorizationRole.All });

    const { data, error, mutate } = useSWR<GetOffersResponse>([
        ownOffer ? "/companies/myoffers/" : `/offers${id ? `/${id}` : ""}`,
        token
    ]);

    return {
        offers: data,
        isLoading: !error && !data,
        isError: error,
        mutate
    };
}
