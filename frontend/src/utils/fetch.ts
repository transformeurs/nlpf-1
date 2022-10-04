const REQUEST_TIMEOUT = 10000;

export type FetchResponse = {
	statusCode: number;
	data: any;
};

export function fetchFun(resource: string, init?: RequestInit) {
	return fetch(`${process.env.NEXT_PUBLIC_API_URL}${resource}`, init).then(async (res) => ({
		statusCode: res.status,
		data: await res.json()
	}));
}

export enum FetchMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	PATCH = "PATCH",
	DELETE = "DELETE"
}

export function fetchApi(
	resource: string,
	method: FetchMethod,
	body?: Object
): Promise<FetchResponse | null> {
	const init: RequestInit = {};

	if (body && ![FetchMethod.POST, FetchMethod.PUT, FetchMethod.PATCH].includes(method)) {
		throw new Error("Body is only allowed for POST, PUT and PATCH");
	}

	init.method = method;
	if (body) {
		init.body = JSON.stringify(body);
		init.headers = {
			"Content-Type": "application/json"
		};
	}

	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
	init.signal = controller.signal;

	return new Promise((resolve, reject) => {
		fetchFun(resource, init)
			.then((res) => {
				clearTimeout(id);
				resolve(res);
			})
			.catch(() => {
				clearTimeout(id);
				resolve(null);
			});
	});
}
