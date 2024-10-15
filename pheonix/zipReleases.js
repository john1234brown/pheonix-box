const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const { Compilation } = require('webpack');

function getPackageVersion() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return packageJson.version;
}

class ZipReleasesPlugin {
    constructor(options) {
        this.files = options.files || [];
        this.releaseType = options.releaseType || 'default';
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync('ZipReleasesPlugin', (compilation, callback) => {
            const version = getPackageVersion();
            const outputPath = compilation.options.output.path;

            if (this.files.length !== 2) {
                throw new Error('Exactly two files must be specified.');
            }

            const zipFileName = `release-${this.releaseType}-${version}.zip`;
            const zipFilePath = path.join(outputPath, zipFileName);

            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                console.log(`${archive.pointer()} total bytes`);
                console.log(`Archiver has been finalized and the output file descriptor has closed for ${zipFileName}.`);
                callback();
            });

            archive.on('error', (err) => {
                throw err;
            });

            archive.pipe(output);
            this.files.forEach(file => {
                const filePath = path.join(outputPath, file);
                archive.file(filePath, { name: file });
            });
            archive.finalize();
        });
    }
}

module.exports = ZipReleasesPlugin;

// Example usage:
// const ZipReleasesPlugin = require('./zipReleases');
// 
// module.exports = {
//     // other webpack config options...
//     plugins: [
//         new ZipReleasesPlugin({
//             files: ['file1.js', 'file2.js'],
//             releaseType: 'beta'
//         })
//     ]
// };
