export class Password {
    private readonly value: string;

    constructor(password: string) {
        if (!Password.isValid(password)) {
            throw new Error("Invalid password format");
        }
        this.value = password;
    }

    getValue() {
        return this.value;
    }

    // Password validation rules (customize as needed)
    static isValid(password: string): boolean {
        // Example: Password must be at least 8 characters long
        return password.length >= 8;
    }
}