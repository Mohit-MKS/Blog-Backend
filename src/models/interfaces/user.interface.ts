interface IUser {
    _id?:string;
    name: string;
    email: string;
    password: string;
    role: number
    verificationCode: string | null;
    forgotPasswordCode: string | null;
    isVerified: boolean
}

export { IUser }