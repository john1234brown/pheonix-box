/*
 * Author: Johnathan Edward Brown
 * Purpose: Worker class for the PheonixBox Class Object for the CLI Pheonix application.
 * Last Modified: 2024-10-14
 * License: X11 License
 * Version: 1.0.0
 */
/************************************************************************************************************************
 * Author: Johnathan Edward Brown                                                                                       *
 * Purpose: Worker class for the PheonixBox Class Object for the CLI Pheonix application.                               *
 * Last Modified: 2024-10-14                                                                                            *
 * License: X11 License                                                                                                 *
 * Version: 1.0.0                                                                                                       *
 ************************************************************************************************************************/
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
    excludePaths?: string[];
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
            if (index === -1) {
                return char;
            }
            return this.shuffledKey[index];
        }).join('');

        if (this.config.useAesKey && this.aesKey) {
            const iv = crypto.randomBytes(16); // Initialization vector
            const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.aesKey), iv);
            let encrypted = cipher.update(caesarEncrypted, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const encryptedWithIv = iv.toString('hex') + ':' + encrypted;
            this.log('Encrypted text with AES:', encryptedWithIv);
            return encryptedWithIv;
        }

        this.log('Encrypted text with Caesar cipher:', caesarEncrypted);
        return caesarEncrypted;
    }

    private decrypt(text: string): string {
        this.log('Decrypting text...');
        let decrypted = text;
    
        if (this.config.useAesKey && this.aesKey) {
            const textParts = text.split(':');
            if (textParts.length < 2) {
                throw new Error('Invalid encrypted text format');
            }
    
            const iv = Buffer.from(textParts.shift()!, 'hex');
            if (iv.length !== 16) { // AES-256-CBC requires a 16-byte IV
                throw new Error('Invalid initialization vector length');
            }
    
            const encryptedText = textParts.join(':');
            const key = this.config.useCeaserCipher ? Buffer.from(this.aesKey) : this.aesKey;  
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }
    
        const caesarDecrypted = decrypted.split('').map(char => {
            const index = this.shuffledKey.indexOf(char);
            if (index === -1) {
                return char;
            }
            return this.cipherKey[index];
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
            if (this.fileHashes[filePath] !== undefined && this.fileContents[filePath] !== undefined) {
                const storedHash = this.config.useCeaserCipher ? this.decrypt(this.fileHashes[filePath]) : this.fileHashes[filePath];
                const storedContent = this.config.useCeaserCipher ? this.decrypt(this.fileContents[filePath]) : this.fileContents[filePath];
                if (!storedHash) {
                    this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                    this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
                } else if (storedHash !== fileHash) {
                    this.log(`File hash mismatch for ${filePath}. Replacing content with stored content. , ${storedContent} \n, ${fileContent}`);
                    fs.writeFileSync(filePath, storedContent, 'utf-8');
                }
            }else{
                this.fileHashes[filePath] = this.config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.fileContents[filePath] = this.config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
            }
        }
    }

    private shouldProcessFile(filePath: string): boolean {
        this.log('Checking if file should be processed:', filePath);

        if (this.config.excludePaths?.some(excludePath => filePath.startsWith(excludePath))) {
            this.log(`File ${filePath} is excluded from processing.`);
            return false;
        }

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