import { redirect, error } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";

export async function GET({ url, cookies, locals }) {
    const code = url.searchParams.get("user");

    if (!code) {
        throw error(400, "Bad Request");
    }

    const res = await fetch(`${PUBLIC_API_URL}/oauth/github/finalize`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
    });

    if (res.ok) {
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

        throw redirect(303, "/app");
    } else {
        throw error(res.status, "Bad Request");
    }
}
