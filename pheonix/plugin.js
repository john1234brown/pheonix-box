const fs = require('fs');
const path = require('path');

class CopyWorkerPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap('CopyWorkerPlugin', (compilation) => {
            const srcPath = path.resolve(__dirname, 'src', 'worker.js');
            const destPath = path.resolve(__dirname, 'production', 'worker.js');

            fs.copyFile(srcPath, destPath, (err) => {
                if (err) {
                    console.error('Error copying worker.js:', err);
                } else {
                    console.log('worker.js was copied to the production folder.');
                }
            });
        });
    }
}

module.exports = CopyWorkerPlugin;