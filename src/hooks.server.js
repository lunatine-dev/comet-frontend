import jwt from "jsonwebtoken";
import { JWT_SECRET } from "$env/static/private";

export const handle = async ({ event, resolve }) => {
    const token = event.cookies.get("accessToken");

    try {
        event.locals.user = token ? jwt.verify(token, JWT_SECRET) : null;
    } catch {
        event.locals.user = null;
    }

    return resolve(event);
};
