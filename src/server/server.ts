import net from 'net';
import { ClientHandler } from '../client/clientHandler';
import { UserService } from '../service/user.service';

export type Input = {
    type: string,
    args: string[]
}

export type MessageType = "CONNECT" | "PWD" | "CHDIR" | "GETFILES" | "GETDIRS" | "EXIT";
export const MessageType = {
    CONNECT: "CONNECT" as MessageType,
    PWD: "PWD" as MessageType,
    CHDIR: "CHDIR" as MessageType,
    GETFILES: "GETFILES" as MessageType,
    GETDIRS: "GETDIRS" as MessageType,
    EXIT: "EXIT" as MessageType
} as const;

export type MessageResponse = "SUCCESS" | "ERROR";
export const MessageResponse = {
    SUCCESS: "SUCCESS" as MessageResponse,
    ERROR: "ERROR" as MessageResponse
} as const;

export class ServerTCP {

    public constructor(
        private clientHandler: ClientHandler
    ) {

    }

    public start(port: number, host: string): void {

        const server = net.createServer((socket: net.Socket) => {
            socket.setEncoding("utf-8");
            socket.write("Client connected!" + "\r\n");
            socket.on("data", async (data: string) => {
                // TODO tratamento dos dados TYPE ...args
                const input = this.getInputMessages(data);
                const output = await this.clientHandler.handle(input);
                socket.write(output + "\r\n");
            });
        });

        server.listen(port, host, () => {
            console.log(`TCP server running on PORT ${port}`);
        });
    }

    private getInputMessages(data: string): Input {

        const args = data
            .trim()
            .split(/[\s,]+/) // Regex para capturar qualquer combinação de espaços e vírgulas.
            .filter(Boolean); // Remove elementos vazios no caso de separadores nas pontas.
        
        const messageType = (args.shift() ?? '') as MessageType;

        const input: Input = {
            type: messageType,
            args: args
        }

        return input;
    }
}