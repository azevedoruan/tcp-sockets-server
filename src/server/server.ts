import net from 'net';
import { MessageType } from '../schemas/messagetype';
import { Input } from '../schemas/input';
import { ClientHandlerFactory } from '../client/clienthandler-factory';

export class ServerTCP {

    public constructor(
        private createHandler: ClientHandlerFactory
    ) {

    }

    public start(port: number, host: string): void {

        /*
            Node.js roda seu JS em um único thread com um event loop. O callback de net.createServer((socket) => ...)
            já roda uma vez por conexão, e todo I/O (sockets, exec, banco) é assíncrono e não bloqueia o evento.
            Ou seja: vários clientes já são atendidos concorrentemente, intercalados pelo event loop. Trocar para
            threads aqui só adicionaria complexidade sem ganho (e quebraria o estado em memória do pg-mem, que
            não é compartilhado entre threads).

            Importante mencionar que net.createServer já configura e espera por uma conexão, socket.bind(...) e
            socket.accept().
        */
        const server = net.createServer((socket: net.Socket) => {
            const handler = this.createHandler(); // Cria os handlers isolado por sessão
            socket.setEncoding("utf-8"); // Define o enconding de leitura dos bytes.
            socket.write("Client connected!" + "\r\n");

            // Quando é recebido um dado de entrada. Equivzale à função 'receive(clientSocket)' no diagrama de sequencia.
            socket.on("data", async (data: string) => {
                try {
                    const input = this.getInputMessages(data);
                    const output = await handler.handle(input);

                    if (output === "EXIT") {
                        socket.end(() => console.log("Conexão encerrada pelo usuário."));
                        return;
                    }

                    socket.write(output + "\r\n");
                } catch(error) {
                    if (error instanceof Error) console.log(`ERROR: ${error.message}`);
                    socket.write("ERROR" + "\r\n");
                }
            });
            socket.on("close", (hadError) => {
                if (hadError) {
                    console.error("Error uccurred when close the server connection.");
                }
                handler.close();
                socket.end(() => {
                    console.log("Server connection closed.");
                });
            })
        });

        server.listen(port, host, () => {
            console.log(`TCP server running on PORT ${port}`);
        });
    }

    // Trata mensagem recebida obtendo o tipo e os argumentos.
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