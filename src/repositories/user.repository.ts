import { Database } from "../api/database/database";
import { User } from "../api/database/schemas";

export class UserRepository {

    public constructor(private db: Database) {
    }

    public async findByName(name: string): Promise<User | null> {
        return this.db.findOne<User>('user', (u) => u.user === name);
    }

    public registerNewUser(user: User): void {
        this.db.save<User>('user', user);
    }
}