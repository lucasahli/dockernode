export class FullName {
    private readonly value: string;

    constructor(fullName: string) {
        if (!FullName.isValid(fullName)) {
            throw new Error("Invalid full name format");
        }

        this.value = fullName;
    }

    getValue() {
        return this.value;
    }

    // Full name validation rules (customize as needed)
    static isValid(fullName: string): boolean {
        // Example: Full name must contain at least one space character
        const containsSpaceCharacter = fullName.trim().includes(" ");
        return fullName.length > 1;
    }
}