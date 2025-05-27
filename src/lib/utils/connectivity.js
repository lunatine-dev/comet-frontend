import { PUBLIC_API_URL } from "$env/static/public";

export async function pingBackend() {
    try {
        const res = await fetch(PUBLIC_API_URL + "/ping");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        return { ok: true, data };
    } catch (err) {
        console.error("Failed to ping backend:", err);
        return { ok: false, error: err };
    }
}
