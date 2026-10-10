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

    // Database API
    const db = new Database(env.DB_PATH);

    // Handle persistant datas
    const userRepo: UserRepository = new UserRepository(db);

    // Gerencia o diretório dos usuários
    const file_manager: FileManager = new FileManager();

    // Handle app logics
    const userService: UserService = new UserService(userRepo, file_manager);

    // Handle messages
    const controller: ClientHandler = new ClientHandler(userService, file_manager);

    // Handle sockets
    const serverTCP: ServerTCP = new ServerTCP(controller);

    serverTCP.start(env.PORT, env.HOST);
}

main();