import { Database } from "./api/database/database";
import { ServerTCP } from "./server/server";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./service/user.service";
import { ClientHandler } from "./client/clientHandler";
import { FileManager } from "./app/filemanager.app";

process.loadEnvFile();

function main() {

    const env = {
        DB_PATH: process.env.DB_PATH!,
        PORT: process.env.PORT ? Number(process.env.PORT) : 3000, 
        HOST: process.env.HOST!
    }

    const db = new Database(env.DB_PATH); // Database API
    const userRepo: UserRepository = new UserRepository(db); // Handle persistant datas
    const serverTCP = new ServerTCP(() => { // Handle sockets
        const fileManager: FileManager = new FileManager(); // Gerencia o diretório dos usuários
        const userService: UserService = new UserService(userRepo, fileManager); // Handle app logics
        return new ClientHandler(userService, fileManager); // Handle messages
    });

    serverTCP.start(env.PORT, env.HOST);
}

main();