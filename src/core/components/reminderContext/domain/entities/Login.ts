
export class Login {
    id: string;
    email: string;
    password: string;
    associatedUserIds: string[];

    constructor(id: string, email: string, password: string, associatedUserIds: string[]) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.associatedUserIds = associatedUserIds;
    }



    // Single source of truth for fetching
    // static async generate(viewer, id): Promise<User | null> {
    //     console.log("Generate a user...")
    //     const data = await models.User.findByPk(id); // Nullable // or: const data = await Redis.get("u:" + id); // Nullable
    //     if(data === null) return null;
    //     const canSee = User.checkCanSee(viewer, data);
    //     return canSee ? new User(data) : null;
    // }

    // private static checkCanSee(viewer, data: any) {
    //     return false;
    // }
}