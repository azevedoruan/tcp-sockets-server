import net from "net";
import * as readline from 'readline/promises'

class ClientTCP {

    private clientSocket: net.Socket;
    private rl: readline.Interface;

    public constructor() {
        this.clientSocket = new net.Socket();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    public startConnection(port: number, host: string): void {

        this.clientSocket.connect(port, host, () => {
            this.clientSocket.setEncoding("utf-8");
            //this.clientSocket.write("Server connected!" + "\r\n");
            this.clientSocket.on("data", (data: string) => this.connection(data));
            this.clientSocket.on("close", () => console.log("Connection closed by server!"));
            this.clientSocket.on("error", (err) => console.error("Client socket error: ", err));
        });

        if (this.clientSocket.closed) {
            this.clientSocket.destroy();
        }
    }

    private async connection(data: string): Promise<void> {
        console.log(data);
        let message: string = await this.rl.question('>>> ');
        this.clientSocket.write(message + "\r\n");
    }
}

const client: ClientTCP = new ClientTCP();
client.startConnection(3000, '127.0.0.1');