import { Command, FileManager } from "../app/filemanager.app";
import { Input, MessageType } from "../server/server";
import { UserService } from "../service/user.service";

export class ClientHandler {
    public constructor(
        private userService: UserService,
        private fm: FileManager
    ) {

    }

    public async handle(input: Input): Promise<string> {
        //TODO handkle the message types
        const { type, args } = input;

        try {
            switch (type) {
                case MessageType.CONNECT:
                    return await this.connect(args);
                case MessageType.PWD:
                    return await this.pwd();
                case MessageType.CHDIR:
                    return await this.chdir(args);
                case MessageType.GETFILES:
                    return await this.getfiles();
                case MessageType.GETDIRS:
                    return await this.getdirs();
                case MessageType.EXIT:
                    return await this.exit();
                default:
                    throw new Error(`Tipo de mensagem inválido. Tipo: ${type}`);
            }
        } catch (error) {
            if (error instanceof Error) console.log(`ERROR: ${error.message}`);
            return "ERROR";
        }
    }

    private async connect(args: string[]): Promise<string> {
        if (!args[0] || !args[1]) {
            throw new Error("Argumentos obrigatórios faltando.");
        }

        const result = await this.userService.login({ user: args[0], password: args[1] });
        return result;
    }

    private async pwd(): Promise<string> {
        const cmd: Command = {
            commandType: MessageType.PWD as string,
            args: []
        }

        const result = await this.fm.write_cmd(cmd);
        return result;
    }

    private async chdir(args: string[]): Promise<string> {
        const cmd: Command = {
            commandType: MessageType.CHDIR as string,
            args
        }

        const result = await this.fm.write_cmd(cmd);
        return result;
    }

    private async getfiles(): Promise<string> {
        const cmd: Command = {
            commandType: MessageType.GETFILES as string,
            args: []
        }

        const result = await this.fm.write_cmd(cmd);
        return result;
    }

    private getdirs(): string {
        return "comando 'getdirs' pressioando";
    }

    private exit(): string {
        return "comando 'exit' pressioando";
    }
}