import jwt from "jsonwebtoken";
import config from "../config/config";

const isAuth = (req, res, next) => {
    try {
        const authorization = req.headers.authorization ? req.headers.authorization.split(' ') : null;
        const token = authorization.length > 1 ? authorization[1] : null;

        if (token) {
            const payload: any = jwt.verify(token, config.JWT_SECRET);
            if (payload) {
                res.user = {
                    _id: payload._id,
                    role: payload.role,
                    name: payload.name,
                    email: payload.email
                }
                next();
            } else {
                res.code = 401;
                throw new Error("Unauthorized");
            }

        }
        else {
            res.code = 400;
            throw new Error("Token is required")
        }

    } catch (error) {
        next(error)

    }
}

export { isAuth }