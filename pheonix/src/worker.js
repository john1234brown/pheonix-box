const workerpool = require('workerpool');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// worker.js

class Worker {
    #config;
    #fileHashes;
    #fileContents;
    #cipherKey;
    #shuffledKey;
    #aesKey;
    #loaded;

    constructor(config, fileList, chunks, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents) {
        this.#config = config;
        this.#loaded = loaded;
        this.#fileHashes = fileHashes || {};
        this.#fileContents = fileContents || {};
        console.log('Worker: This Loaded:', loaded);
        if (!this.#loaded) {
            this.#cipherKey = cipherKey || this.generateCipherKey();
            this.#shuffledKey = shuffledKey || this.shuffleKey(this.#cipherKey);
            this.#aesKey = aesKey || (this.#config.useAesKey ? crypto.randomBytes(32) : null);
        } else {
            this.#cipherKey = cipherKey;
            this.#shuffledKey = shuffledKey;
            this.#aesKey = aesKey;
        }
        this.processFiles(fileList, chunks);
    }

    log(...args) {
        if (this.#config.debug) {
            console.log(...args);
        }
    }

    generateCipherKey() {
        this.log('Generating cipher key...');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = alphabet.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        const cipherKey = array.join('');
        this.log('Generated cipher key:', cipherKey);
        return cipherKey;
    }

    shuffleKey(key) {
        this.log('Shuffling key...');
        const array = key.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        const shuffledKey = array.join('');
        this.log('Shuffled key:', shuffledKey);
        return shuffledKey;
    }

    encrypt(text) {
        this.log('Encrypting text...');
        const caesarEncrypted = text.split('').map(char => {
            const index = this.#cipherKey.indexOf(char);
            return index === -1 ? char : this.#shuffledKey[index];
        }).join('');

        if (this.#config.useAesKey && this.#aesKey) {
            const cipher = crypto.createCipheriv('aes-256-cbc', this.#aesKey, Buffer.alloc(16, 0));
            let encrypted = cipher.update(caesarEncrypted, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            this.log('Encrypted text with AES:', encrypted);
            return encrypted;
        }

        this.log('Encrypted text with Caesar cipher:', caesarEncrypted);
        return caesarEncrypted;
    }

    decrypt(text) {
        this.log('Decrypting text...');
        let decrypted = text;

        if (this.#config.useAesKey && this.#aesKey) {
            const decipher = crypto.createDecipheriv('aes-256-cbc', this.#aesKey, Buffer.alloc(16, 0));
            decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
        }

        const caesarDecrypted = decrypted.split('').map(char => {
            const index = this.#shuffledKey.indexOf(char);
            return index === -1 ? char : this.#cipherKey[index];
        }).join('');

        this.log('Decrypted text with Caesar cipher:', caesarDecrypted);
        return caesarDecrypted;
    }

    processFiles(fileList, chunks) {
        this.log('Processing files...');
        fileList.forEach(filePath => {
            this.processFile(filePath, chunks);
        });
        return {
            fileHashes: this.#fileHashes,
            fileContents: this.#fileContents
        };
    }

    processFile(filePath, chunks) {
        this.log('Processing file:', filePath);
        if (this.shouldProcessFile(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

            const storedHash = this.#config.useCeaserCipher ? this.decrypt(this.#fileHashes[filePath]) : this.#fileHashes[filePath];
            const storedContent = this.#config.useCeaserCipher ? this.decrypt(this.#fileContents[filePath]) : this.#fileContents[filePath];

            if (!storedHash) {
                this.#fileHashes[filePath] = this.#config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.#fileContents[filePath] = this.#config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
            } else if (storedHash !== fileHash) {
                this.#fileHashes[filePath] = this.#config.useCeaserCipher ? this.encrypt(fileHash) : fileHash;
                this.#fileContents[filePath] = this.#config.useCeaserCipher ? this.encrypt(fileContent) : fileContent;
            }
        }
    }

    shouldProcessFile(filePath) {
        this.log('Checking if file should be processed:', filePath);
        if (this.#config.useFileTypes) {
            const fileExtension = path.extname(filePath);
            if (!this.#config.fileTypes.includes(fileExtension)) {
                return false;
            }
        }

        if (this.#config.useFileRegexs) {
            const fileName = path.basename(filePath);
            if (!this.#config.fileRegexs.some(regex => new RegExp(regex).test(fileName))) {
                return false;
            }
        }

        return true;
    }
}

workerpool.worker({
    processFiles: (config, fileList, chunks, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents) => {
        const worker = new Worker(config, fileList, chunks, cipherKey, shuffledKey, aesKey, loaded, fileHashes, fileContents);
        return worker.processFiles(fileList, chunks);
    }
});