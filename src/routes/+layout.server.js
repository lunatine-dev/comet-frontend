import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";

export async function load({ locals, cookies, fetch, url }) {
    if (!locals.user && cookies.get("refreshToken")) {
        // Try refreshing
        const refreshRes = await fetch(PUBLIC_API_URL + "/tokens/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken: cookies.get("refreshToken") }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (refreshRes.ok) {
            // Reload to re-run layout load with new access token set
            //reset cookies
            const { accessToken, refreshToken } = await refreshRes.json();
            cookies.set("accessToken", accessToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 1800 * 2,
            });
            cookies.set("refreshToken", refreshToken, {
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 2_592_000,
            });

            throw redirect(307, url.pathname);
        }
    }
}
