import { FileManager } from "../app/filemanager.app";
import { Command } from "../app/command";
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

        const type = input.type as MessageType;
        const args = input.args;

        switch (type) {
            case MessageType.CONNECT:
                return await this.connect(args);
            case MessageType.REGISTER:
                return await this.register(args);
            case MessageType.CHDIR:
                return await this.chdir(args);
            case MessageType.PWD:
                return await this.fm.pwd();
            case MessageType.GETFILES:
                return await this.fm.getfiles();
            default:
                throw new Error("Comando não reconhecido.");
        }

        if (type == MessageType.CONNECT) return await this.connect(args);
        if (type == MessageType.REGISTER) return await this.register(args);

        const cmd: Command = {
            commandType: type,
            args
        }

        const result = await this.fm.write_cmd(cmd);
        return result;
    }

    public close(): void {
        this.fm.close();
    }

    private async connect(args: string[]): Promise<string> {
        if (!args[0] || !args[1]) {
            throw new Error("Argumentos obrigatórios faltando.");
        }

        const result = await this.userService.login({ user: args[0], password: args[1] });
        return result;
    }

    private async register(args: string[]): Promise<string> {
        if (!args[0] || !args[1]) {
            throw new Error("Argumentos obrigatórios faltando.");
        }

        await this.userService.registerNewUser({ user: args[0], password: args[1] });
        return "SUCCESS";
    }

    private async chdir(args: string[]): Promise<string> {
        return await this.fm.chdir(args[0]);
    }
}