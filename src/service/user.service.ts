import { User } from "../api/database/schemas";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    public constructor(
        private repo: UserRepository
    ) {

    }

    public async login(user: User): Promise<string> {

        try {
            const userFound = await this.repo.findByName(user.user)

            if (user.password != userFound?.password) {
                throw Error("ERROR");
            }

            return "SUCCESS";

        } catch(error) {
            return "ERROR";
        }
    }

    public async findByName(userName: string): Promise<User> {
        const user = await this.repo.findByName(userName);
        console.log(user);
        if (!user) {
            throw Error(`Usuário do nome '${userName}' não encontrado.`);
        }

        return user;
    }

    public async registerNewUser(user: User): Promise<void> {

        const userValid = await this.repo.findByName(user.user);
        if (userValid) {
            throw Error(`Usuário do nome ${user.user} já existe`);
        }

        this.repo.registerNewUser(user);
    }
}