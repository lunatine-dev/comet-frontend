import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // Assuming you have `locals.user` set in hooks.server.js when logged in
    if (locals.user) {
        throw redirect(302, "/app"); // redirect to logged-in area
    }
}
