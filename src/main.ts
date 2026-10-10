import { Database } from "./api/database/database";
import { ServerTCP } from "./server/server";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./service/user.service";
import { ClientHandler } from "./client/clientHandler";
import { FileManager } from "./app/filemanager.app";

function main() {

    // Database API
    const db = new Database("/home/ruanazevedo/workspace/UTFPR/SD/tcp-sockets-server/database");

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

    serverTCP.start(3000, '127.0.0.1');
}

main();