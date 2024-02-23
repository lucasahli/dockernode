
export interface SecretStore {
    readSecret(secretAlias: string): Promise<string>
}