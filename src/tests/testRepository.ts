import { Database } from "../api/database/database";
import { UserRepository } from "../repositories/user.repository";
import { User } from "../api/database/schemas"

async function testRepository() {

    const db = new Database("/home/razevedo/utfpr/sistemas-distribuidos/programacao-sockets/sockets-programming-typescript/database");
    const userRepo = new UserRepository(db);

    const user1: User = {
        user: "Repos",
        password: "repos123"
    };

    //userRepo.registerNewUser(user1);
    console.log(await userRepo.findByName("admin"));

}

testRepository();