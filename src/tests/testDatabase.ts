import { Database } from "../api/database/database";
import { User } from "../api/database/schemas";

async function saveTest() {
    const newUser: User = {
        user: "admin",
        password: "admin123"
    };

    const db = new Database("/home/razevedo/utfpr/sistemas-distribuidos/programacao-sockets/sockets-programming-typescript/database");
    //db.save<User>("user", newUser);

    const data = await db.findOne<User>('user', (u) => u.user === "admin");
    console.log(data);
}

saveTest();