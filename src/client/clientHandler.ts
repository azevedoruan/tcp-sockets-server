import { Input, MessageType } from "../server/server";
import { UserService } from "../service/user.service";

export class ClientHandler {
    public constructor(
        private userService: UserService
    ) {

    }

    public async handle(input: Input): Promise<string> {
        //TODO handkle the message types
        const { type, args } = input;

        switch (type) {
            case MessageType.CONNECT:
                return await this.connect(args);
            case MessageType.PWD:
                return this.pwd();
            case MessageType.CHDIR:
                return this.chdir(args);
            case MessageType.GETFILES:
                return this.getfiles();
            case MessageType.GETDIRS:
                return this.getdirs();
            case MessageType.EXIT:
                return this.exit();
            default:
                return `Tipo de mensagem inválido. Tipo: ${type}`;
        }
    }

    private async connect(args: string[]): Promise<string> {

        try {
            if (!args[0] || !args[1]) {
                throw Error("ERROR");
            }

            // TODO verify is password in hash

            const result = await this.userService.login({ user: args[0], password: args[1] });
            return result;

        } catch(e) {
            if (e instanceof Error) {
                return e.message;
            }

            return "ERROR";
        }
    }

    private pwd(): string {
        return "comando 'pwd' pressioando";
    }

    private chdir(args: string[]): string {
        return "comando 'chdir' pressioando";
    }

    private getfiles(): string {
        return "comando 'getfiles' pressioando";
    }

    private getdirs(): string {
        return "comando 'getdirs' pressioando";
    }
    
    private exit(): string {
        return "comando 'exit' pressioando";
    }
}