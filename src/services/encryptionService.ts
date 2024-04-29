import bcrypt from 'bcryptjs';

const hashPassword = (password) => {
    return new Promise<string>((resolve, rejects) => {
        bcrypt.genSalt(12, (error, salt) => {
            if (error) {
                return rejects(error);
            }

            bcrypt.hash(password, salt, (error, hash) => {
                if (error) {
                    return rejects(error);
                }
                resolve(hash);
            })
        })
    })
}

const comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

export { hashPassword, comparePassword }