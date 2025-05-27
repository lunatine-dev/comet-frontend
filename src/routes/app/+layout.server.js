import { redirect } from "@sveltejs/kit";
import { PUBLIC_API_URL } from "$env/static/public";

export async function load({ locals, cookies, fetch, url }) {
    if (!locals?.user) {
        throw redirect(303, "/");
    }

    // Either user is present or refresh failed
    return { user: locals.user, accessToken: cookies.get("accessToken") };
}
