import {SecretStore} from "../../core/portsAndInterfaces/interfaces/SecretStore.js";
// import vault from 'node-vault';



export class VaultSecretStore implements SecretStore {
    constructor() {
        const hcpApiToken = process.env.HCP_API_TOKEN;

        if (!hcpApiToken) {
            throw new Error('HCP_API_TOKEN is not set');
        }
    }
    // private vaultClient = vault({
    //     apiVersion: 'v1',
    //     endpoint: 'https://api.cloud.hashicorp.com/secrets/2023-06-13/organizations/0cf8f694-8355-416b-a72d-e7efba19b7b2/projects/2bdc7259-f750-4523-bf43-9a02a08decbc/apps/reminder-app/open', // Vault server URL
    //     token: `${process.env.HCP_API_TOKEN}`, // Vault token
    // });

    readSecret(secretAlias: string): Promise<string> {
        this.getSecrets();
        return Promise.resolve("");
    }

    private async getSecrets() {
        try {
            // const secretData = await this.vaultClient.read('secret/myproject');
            console.log("secretData.data");
            // Use secretData.data to access your secrets
        } catch (error) {
            console.error('Error reading from Vault:', error);
        }
    }

}