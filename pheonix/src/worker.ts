import * as fs from 'fs';
import * as crypto from 'crypto';
import * as path from 'path';

interface Config {
    debug: boolean;
    useAesKey: boolean;
    useCeaserCipher: boolean;
    useFileTypes?: boolean;
    fileTypes?: string[];
    useFileRegexs?: boolean;
    fileRegexs?: string[];
}

interface FileHashes {
    [key: string]: string;
}

interface FileContents {
    [key: string]: string;
}

class JohnsWorker {
    private config: Config;
    private fileHashes: FileHashes;
    private fileContents: FileContents;
    private cipherKey: string;
    private shuffledKey: string;
    private aesKey: Buffer;
    private loaded: boolean;

    constructor(config: Config, fileList: string[], chunks: any, cipherKey: string, shuffledKey: string, aesKey: Buffer, loaded: boolean, fileHashes?: FileHashes, fileContents?: FileContents) {
        this.config = config;
        this.loaded = loaded;
        this.fileHashes = fileHashes || {};
        this.fileContents = fileContents || {};
        this.cipherKey = cipherKey;
        this.shuffledKey = shuffledKey;
        this.aesKey = aesKey;
        this.processFiles(fileList, chunks);
    }

    private log(...args: any[]) {
        if (this.config.debug) {
            console.log(...args);
        }
    }

    private encrypt(text: string): string {
        this.log('Encrypting text...');
        const caesarEncrypted = text.split('').map(char => {
            const index = this.cipherKey.indexOf(char);
            return index === -1 ? char : this.shuffledKey[index];
        }).join('');

        if (this.config.useAesKey && this.aesKey) {
            const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, Buffer.alloc(16, 0));
            let encrypted = cipher.update(caesarEncrypted, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            this.log('Encrypted text with AES:', encrypted);
            return encrypted;
        }

        this.log('Encrypted text with Caesar cipher:', caesarEncrypted);
        return caesarEncrypted;
    }

    private decrypt(text: string): string {
        this.log('Decrypting text...');
        let decrypted = text;

        if (this.config.useAesKey && this.aesKey) {
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, Buffer.alloc(16, 0));
            decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }

        const caesarDecrypted = decrypted.split('').map(char => {
            const index = this.shuffledKey.indexOf(char);
            return index === -1 ? char : this.cipherKey[index];
        }).join('');

        this.log('Decrypted text with Caesar cipher:', caesarDecrypted);
        return caesarDecrypted;
    }

    public processFiles(fileList: string[], chunks: any): Promise<{ fileHashes: FileHashes; fileContents: FileContents; }> {
        return new Promise((resolve, reject) => {
            try {
                this.log('Processing files...');
                fileList.forEach(filePath => {
                    this.processFile(filePath, chunks);
                });
                resolve({
                    fileHashes: this.fileHashes,
                    fileContents: this.fileContents
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private processFile(filePath: string, chunks: any) {
        this.log('Processing file:', filePath);
        if (this.shouldProcessFile(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

            const storedHash = this.config.useCeaserCipher ? this.decrypt(this.fileHashes[filePath]) : this.fileHashes[filePath];
            const storedContent = this.config.useCeaserCipher ? this.decrypt(this.fileContents[filePath]) : this.fileContents[filePath];

            if (!storedHash) {
                this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
            } else if (storedHash !== fileHash) {
                this.log(`File hash mismatch for ${filePath}. Replacing content with stored content.`);
                fs.writeFileSync(filePath, storedContent, 'utf-8');
                this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
            }
        }
    }

    private shouldProcessFile(filePath: string): boolean {
        this.log('Checking if file should be processed:', filePath);
        if (this.config.useFileTypes) {
            const fileExtension = path.extname(filePath);
            if (!this.config.fileTypes?.includes(fileExtension)) {
                return false;
            }
        }

        if (this.config.useFileRegexs) {
            const fileName = path.basename(filePath);
            if (!this.config.fileRegexs?.some(regex => new RegExp(regex).test(fileName))) {
                return false;
            }
        }

        return true;
    }

    public terminate() {
        // Implementation of worker termination
        console.log('Worker terminating...');
        process.exit(0);
        console.log('Worker terminated');
    }
}
export default JohnsWorker;