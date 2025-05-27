import { error } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";
import { invalidateAll } from "$app/navigation";

// Helper to refresh token
async function refreshTokenF() {
    const res = await fetch(`/api/refresh`, {
        method: "POST",
    });

    if (res.ok) {
        const { accessToken, refreshToken } = await res.json();

        return { accessToken, refreshToken };
    }

    return null;
}

export const send = async ({ method, path, data, token, retry = true }) => {
    const opts = {
        method,
        headers: {},
    };

    if (data) {
        opts.headers["Content-Type"] = "application/json";
        opts.body = JSON.stringify(data);
    }

    if (token) {
        opts.headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(PUBLIC_API_URL + path, opts);

    if (res.status === 401 && retry) {
        const { accessToken, refreshToken } = await refreshTokenF();

        if (accessToken) {
            await invalidateAll();
            return send({
                method,
                path,
                data,
                token: accessToken,
                retry: false,
            });
        }

        // If refresh failed, bubble the error
        error(401, "Unauthorized (token refresh failed)");
    }

    if (res.ok || res.status === 422) {
        const text = await res.text();
        return text ? JSON.parse(text) : {};
    }

    error(res.status);
};

export function get(path, token) {
    return send({ method: "GET", path, token });
}

export function del(path, token) {
    return send({ method: "DELETE", path, token });
}

export function post(path, data, token) {
    return send({ method: "POST", path, data, token });
}

export function put(path, data, token) {
    return send({ method: "PUT", path, data, token });
}
