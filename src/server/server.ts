import net from 'net';
import { ClientHandler } from '../client/clientHandler';
import { MessageType } from '../schemas/messagetype';
import { Input } from '../schemas/input';

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
                try {
                    const input = this.getInputMessages(data);
                    const output = await this.clientHandler.handle(input);
                    socket.write(output + "\r\n");
                } catch(error) {
                    if (error instanceof Error) console.log(`ERROR: ${error.message}`);
                    socket.write("ERROR" + "\r\n");
                }
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