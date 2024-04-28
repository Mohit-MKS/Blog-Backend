
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



const generateCode = (codeLength) => {
    const number = String(Math.random()).split(".")[1].slice(0, codeLength || 4);
    return number;
}


export { generateToken, generateCode }
