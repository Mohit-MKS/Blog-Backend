import { RegexService } from "./regexService"

const validateEmail = (email: string) => {
    return email.match(RegexService.emailRegex)
}

export default { validateEmail }