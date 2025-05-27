import { redirect } from "@sveltejs/kit";
import { JWT_SECRET } from "$env/static/private";
import jwt from "jsonwebtoken";
import { send } from "$lib/utils/api";

export const load = async ({ params, locals, cookies }) => {
    const accessToken = cookies.get("accessToken");

    try {
        jwt.verify(accessToken, JWT_SECRET);

        //check if repo exists
        const repo = await send({
            method: "GET",
            path: "/repos/live/" + params.repo,
            token: accessToken,
            retry: false,
        });

        return {
            repo: params.repo,
        };
    } catch (err) {
        console.log(err);
        throw redirect(307, "/app/manager/");
    }
};
