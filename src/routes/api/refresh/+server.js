// src/routes/api/refresh/+server.ts
import { json } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";

export async function POST({ locals, cookies }) {
    const refresh_token = cookies.get("refreshToken");

    if (!refresh_token) {
        return new Response("Missing token", { status: 401 });
    }

    // Call Fastify backend to refresh
    const res = await fetch(PUBLIC_API_URL + "/tokens/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: refresh_token }),
    });

    if (!res.ok) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { accessToken, refreshToken } = await res.json();

    cookies.set("accessToken", accessToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 1800,
    });
    cookies.set("refreshToken", refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 2_592_000,
    });

    return json({ accessToken, refreshToken });
}
