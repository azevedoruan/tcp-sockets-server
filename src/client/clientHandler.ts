import { Command, FileManager } from "../app/filemanager.app";
import { Input } from "../schemas/input";
import { UserService } from "../service/user.service";
import { MessageType } from "../schemas/messagetype";

export class ClientHandler {
    public constructor(
        private userService: UserService,
        private fm: FileManager
    ) {

    }

    public async handle(input: Input): Promise<string> {

        const { type, args } = input;

        if (type == MessageType.CONNECT) return await this.connect(args);
        // if (type == MessageType.REGISTER) return await this.register(args);

        const cmd: Command = {
            commandType: type,
            args
        }

        const result = await this.fm.write_cmd(cmd);
        return result;
    }

    private async connect(args: string[]): Promise<string> {
        if (!args[0] || !args[1]) {
            throw new Error("Argumentos obrigatórios faltando.");
        }

        const result = await this.userService.login({ user: args[0], password: args[1] });
        return result;
    }
}