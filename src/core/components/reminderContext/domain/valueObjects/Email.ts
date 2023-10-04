export class Email {
    private readonly email: string;

    constructor(email: string) {
        if (!Email.isValid(email)) {
            throw new Error("Invalid email format");
        }
        this.email = email;
    }

    toString() {
        return this.email;
    }

    static isValid(email: string): boolean {
        // Basic email format validation using a regular expression
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
}
