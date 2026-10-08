import * as fs from 'fs/promises';
import path from 'path';

/*
    O objetivo dessa classe é simular o comportamento de uma API de Banco de dados.
    Essa classe deve ser totalmente desacoplada, isto é, não deve conhecer os tipos de dados que estão sendo gravados
    nem em qual lugar eles estão. Todos os dados concretos devem ser passados por parâmetros.
    Sua principal função é escrever e recuperar dados escritos no próprio sistema de arquivos do SO.
    Os dados serão armazenados em um diretório 'database_path' no formato JSON.
    Cada arquivo JSON representa uma tabela do BD.
    Dentro do arquivo terá um array contendo os itens. Cada item representa uma linha (registro) da tabela.
*/

export class Database {

    private database_path: string = "";

    public constructor(database_path: string) {
        this.database_path = database_path || path.resolve(__dirname);
    }

    public async findOne<T extends Object>(tableName: string, predicate: (item: T) => boolean): Promise<T | null> {
        
        const table = `${tableName}.json`;

        // path.join previne problemas de caminhos/barras entre SOs
        const file = path.join(this.database_path, table);
        
        try {

            // Verifica se o arquivo existe
            if (!(await this.fileExists(table))) {
                return null;
            }

            // Verifica se o arquivo está preenchido
            const fileData = await fs.readFile(file, 'utf-8');
            if (!fileData.trim()) {
                return null;
            }

            const records = JSON.parse(fileData) as T[];

            const item = records.find(predicate);

            // if ternário. Se for false, retorna o valor seguinte, no caso 'null'
            return item ?? null;

        } catch (error) {
            throw Error(`Erro ao buscar o registro no arquivo ${tableName}: ${error}`);
        }
    }

    public async save<T extends Object>(tableName: string, obj: T): Promise<void> {

        const table = `${tableName}.json`;

        // path.join previne problemas de caminhos/barras entre SOs
        const file = path.join(this.database_path, table);

        try {
            let records: T[] = [];
            
            // Tratamento caso o arquivo já exista
            if (await this.fileExists(table)) {
                const fileData = await fs.readFile(file, 'utf-8');

                // Caso ele exista mas está vazio
                if (fileData.trim().length > 0) {
                    records = JSON.parse(fileData) as T[];
                }
            }

            // Add o novo registro na lista
            records.push(obj);

            const content = JSON.stringify(records, null, 2);
            
            // Grava o conteudo no arquivo
            await fs.writeFile(file, content);

            console.log(`File '${table}' written successfully.`);

        } catch (error) {
            throw Error("Erro ao salvar registro: " + error);
        }
    }

    public async fileExists(file: string): Promise<boolean> {
        try {
            const filePath = path.join(this.database_path, file);
            await fs.access(filePath); // Tenta acessar o arquivo, se não conseguir, gera erro e retorna false.
            return true;
        } catch {
            return false;
        }
    }
}