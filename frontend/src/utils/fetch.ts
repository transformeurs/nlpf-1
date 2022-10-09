const REQUEST_TIMEOUT = 10000;

// Fetch with baseUrl and timeout
export function fetchFun(resource: string, init: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    init.signal = controller.signal;

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}${resource}`, init)
            .then((res) => {
                clearTimeout(id);
                resolve(res);
            })
            .catch(() => {
                clearTimeout(id);
                reject("timeout");
            });
    });
}

export class HttpError extends Error {
    constructor(public status: number, public data: any) {
        super(`HTTP Error ${status}`);
    }
}

export async function fetchSwr(resource: string, token?: string) {
    const headers: HeadersInit = {};
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const result = await fetchFun(resource, {
        headers
    });

    if (!result.ok) throw new HttpError(result.status, await result.json());

    return await result.json();
}

export enum FetchMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE"
}

export type FetchResponse = {
    statusCode: number;
    data: any;
};

export function fetchApi(
    resource: string,
    method: FetchMethod,
    token?: string | null,
    body?: Object
): Promise<FetchResponse | null> {
    const init: RequestInit = { headers: {} };

    if (body && ![FetchMethod.POST, FetchMethod.PUT, FetchMethod.PATCH].includes(method)) {
        throw new Error("Body is only allowed for POST, PUT and PATCH");
    }

    init.method = method;
    if (body) {
        init.body = JSON.stringify(body);
        init.headers = {
            ...init.headers,
            "Content-Type": "application/json"
        };
    }

    if (token) {
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token}`
        };
    }

    return new Promise((resolve, reject) => {
        fetchFun(resource, init)
            .then(async (res) => {
                resolve({
                    statusCode: res.status,
                    data: await res.json()
                });
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function uploadFormImage(
    resource: string,
    formData: FormData
): Promise<FetchResponse | null> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    return new Promise((resolve, reject) => {
        fetchFun(resource, {
            method: FetchMethod.POST,
            body: formData,
            signal: controller.signal
        })
            .then(async (res) => {
                clearTimeout(id);
                resolve({
                    statusCode: res.status,
                    data: await res.json()
                });
            })
            .catch(() => {
                clearTimeout(id);
                resolve(null);
            });
    });
}
