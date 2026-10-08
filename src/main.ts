import { Database } from "./api/database/database";
import { ServerTCP } from "./server/server";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./service/user.service";
import { ClientHandler } from "./client/clientHandler";

function main() {

    // Database API
    const db = new Database("/home/razevedo/utfpr/sistemas-distribuidos/programacao-sockets-tcp/sockets-programming-typescript/database");

    // Handle persistant datas
    const userRepo: UserRepository = new UserRepository(db);

    // Handle app logics
    const userService: UserService = new UserService(userRepo);

    // Handle messages
    const controller: ClientHandler = new ClientHandler(userService);
    
    // Handle sockets
    const serverTCP: ServerTCP = new ServerTCP(controller);
    
    serverTCP.start(3000, '127.0.0.1');
}

main();