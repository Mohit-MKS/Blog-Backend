import jwt from "jsonwebtoken";

import config from "../config/config";

const generateToken = (user) => {
    const token = jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        config.JWT_SECRET,
        {
            expiresIn: '7d'
        }
    )
    return token;
}

export { generateToken }