import path from "node:path";
import { User } from "../api/database/schemas";
import { FileManager } from "../app/filemanager.app";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    public constructor(
        private repo: UserRepository,
        private fm: FileManager
    ) {

    }

    public async login(user: User): Promise<string> {

        const userFound = await this.repo.findByName(user.user);

        if (user.password != userFound?.password) {
            throw new Error("Senha inválida.");
        }

        // Joga usuário para dentro do seu diretório.
        // O ideal seria criar esse serviço dentro de FileManager, mas por enquanto fica aqui mesmo.
        const result = await this.fm.chdir(path.resolve(this.fm.get_curr_path(), userFound.user));
        console.log(result);

        return "SUCCESS";
    }

    public async findByName(userName: string): Promise<User> {
        const user = await this.repo.findByName(userName);
        console.log(user);
        if (!user) {
            throw new Error(`Usuário do nome '${userName}' não encontrado.`);
        }

        return user;
    }

    public async registerNewUser(user: User): Promise<void> {

        const userValid = await this.repo.findByName(user.user);
        if (userValid) {
            throw new Error(`Usuário do nome ${user.user} já existe`);
        }

        this.repo.registerNewUser(user);
    }
}