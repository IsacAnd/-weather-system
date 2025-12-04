const BASE_URL = import.meta.env.VITE_BACKEND_URL;

console.log(BASE_URL)

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(BASE_URL + url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || `Erro ${res.status}`);
    }

    return res.json();
}

export const api = {
    get: <T>(url: string) =>
        request<T>(url, { method: "GET" }),

    post: <T>(url: string, body?: any) =>
        request<T>(url, {
            method: "POST",
            body: JSON.stringify(body)
        }),

    patch: <T>(url: string, body?: any) =>
        request<T>(url, {
            method: "PATCH",
            body: JSON.stringify(body)
        }),

    put: <T>(url: string, body?: any) =>
        request<T>(url, {
            method: "PUT",
            body: JSON.stringify(body)
        }),

    delete: <T>(url: string) =>
        request<T>(url, { method: "DELETE" }),
};
