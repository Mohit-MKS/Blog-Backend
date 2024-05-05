import { validationResult } from "express-validator";

const validateErrors = (req, res, next) => {
    const errors = validationResult(req);
    const errorsObj = {}
    if (errors.isEmpty())
        return next();


    errors.array().map((error: any) => {
        if (!errorsObj[error.path])
            errorsObj[error.path] = error.msg;
    })

    return res.status(400).json({ message: errorsObj })
}

export { validateErrors }