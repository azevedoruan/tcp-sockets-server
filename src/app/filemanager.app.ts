
import { exec } from 'node:child_process';
import { readdir, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import { Command } from './command';

// Ideal usar 'path' para lidar com caminhos em diferentes SOs.
// No caso de '\' para windows e '/' para linux por exemplo.
import path from 'node:path';

const execAsync = promisify(exec);

/*
    Mapeamento seguro: nome lógico do comando -> comando de shell fixo.
    Nada que vem do cliente é concatenado no shell, evitando command injection.
*/
const COMMAND_MAP: Record<string, string> = {
    PWD: 'pwd',
    GETFILES: "ls -p | grep -v /",
    GETDIRS: "ls -d */ 2>/dev/null"
};

/*
    Essa classe gerencia as funcionalidades do app de gerenciamento de arquivo.
*/
export class FileManager {
    private readonly root_path: string;
    private curr_path: string;

    public constructor(curr_path?: string) {

        // Define valor padrão caso parâmetro venha vazio
        this.curr_path = curr_path?.trim() ? curr_path : 'root';

        this.curr_path = path.resolve(process.cwd(), this.curr_path);
        this.root_path = this.curr_path;
    }

    public get_curr_path(): string {
        return this.curr_path;
    }

    public async write_cmd(command: Command): Promise<string> {

        // Recebe o comando e seus argumentos por destruturação
        const { commandType, args } = command;
        const commandName = (commandType ?? '').toUpperCase();

        // Verifica se está mudando de diretório
        if (commandName === 'CHDIR') {
            return this.chdir(args[0] ?? '');
        }

        // Obtem o comando de acordo com o mapeamento
        const shellCommand = COMMAND_MAP[commandName];
        if (!shellCommand) {
            throw new Error('Comando não reconhecido.');
        }

        // Executa o comando no prompt
        const { stdout } = await execAsync(shellCommand, {
            cwd: this.curr_path
        });

        return stdout;
    }

    public async chdir(target: string): Promise<string> {
        const newPath = path.resolve(this.curr_path, target || '.');

        // Verifica se esta na pasta 'root'
        const insideRoot = newPath === this.root_path || newPath.startsWith(this.root_path + path.sep);
        if (!insideRoot) {
            throw new Error(`Acesso negado: '${target}' está fora do diretório permitido.`);
        }

        // Verifica a existencia do novo caminho do diretório
        const info = await stat(newPath).catch(() => null);
        if (!info?.isDirectory()) {
            throw new Error(`Diretório não encontrado: '${target}'`);
        }

        // Atualiza o caminho atual
        this.curr_path = newPath;
        return this.curr_path;
    }

    public async pwd(): Promise<string> {

        if (this.validateLogedUser()) throw new Error('Nenhum usuário logado.');

        const shellCommand = "pwd";
        const stdout = await this.executeCommand(shellCommand);

        return stdout;
    }

    public async getfiles(): Promise<string> {

        if (this.validateLogedUser()) throw new Error('Nenhum usuário logado.');

        const dirEntities = await readdir(this.curr_path, { withFileTypes: true });
        const files = dirEntities.filter(d => d.isFile()).map(d => d.name);
        const fileCount = files.length;

        return `${fileCount}\n${files.join('\n')}`;
    }

    public async getdirs(): Promise<string> {

        if (this.validateLogedUser()) throw new Error('Nenhum usuário logado.');

        const dirEntities = await readdir(this.curr_path, { withFileTypes: true });
        const dirs = dirEntities.filter(d => d.isDirectory()).map(d => d.name);
        const dirsCount = dirs.length;

        return `${dirsCount}\n${dirs.join('\n')}`;
    }

    public concat_paths(source: string, new_path: string): string {
        return path.resolve(source, new_path);
    }

    public async create_dir(name: string): Promise<string> {
        const dir_path = path.resolve(this.root_path, name);

        // Executa o comando no prompt
        const { stderr } = await execAsync(`mkdir ${dir_path}`);
        if (stderr) {
            throw new Error(stderr);
        }

        return dir_path;
    }

    public close(): void {
        this.curr_path = this.root_path;
    }

    // Verifica se usuário esta logado
    private validateLogedUser(): boolean {
        return this.curr_path.endsWith("root");
    }

    // Executa o comando no prompt
    private async executeCommand(shellCommand: string): Promise<string> {
        const { stdout } = await execAsync(shellCommand, {
            cwd: this.curr_path
        });

        return stdout;
    }
}
