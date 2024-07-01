interface IUser {
    name: string;
    email: string;
    password: string;
    role: number
    verificationCode: string;
    forgotPasswordCode: string;
    isVerified: boolean
}

export { IUser }