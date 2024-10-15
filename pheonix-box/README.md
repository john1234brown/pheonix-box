# Pheonix Box NPM
Pheonix Box is a TypeScript project that is compiled, bundled with Webpack, and obfuscated into a binary. It provides a robust tamper-proof solution for managing and processing files with encryption and hashing capabilities. This NPM module exposes the `JohnsPheonixBox` class object for public use.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [License](#license)

## Installation

To install the package, run:

```bash
npm install pheonix-box
```

## Usage

To use the `JohnsPheonixBox` class, import it into your project:

```typescript
import { JohnsPheonixBox } from 'pheonix-box';

const pheonixBox = new JohnsPheonixBox();
```

## Configuration

The configuration is managed through the `Config` class. You can customize various settings such as paths, encryption keys, and debug options.

### Configuration File

The configuration is stored in a JSON file named `configurable.json`. Here is an example of what the configuration file might look like:

```json
{
    "paths": ["src", "dist"],
    "fileTypes": [".ts", ".js"],
    "fileRegexs": ["\\.test\\.ts$", "\\.spec\\.ts$"],
    "useFileTypes": true,
    "useFileRegexs": false,
    "useCeaserCipher": false,
    "useAesKey": true,
    "forkDelay": 1,
    "forkExecutionDelay": 1,
    "threads": 4,
    "whiteSpaceOffset": 2,
    "debug": true
}
```

### Configuration Options

- `paths`: An array of paths to include in the processing.
- `fileTypes`: An array of file extensions to include.
- `fileRegexs`: An array of regular expressions to match file names.
- `useFileTypes`: A boolean indicating whether to use file types for filtering.
- `useFileRegexs`: A boolean indicating whether to use regular expressions for filtering.
- `useCeaserCipher`: A boolean indicating whether to use Caesar Cipher for encryption.
- `useAesKey`: A boolean indicating whether to use AES encryption.
- `forkDelay`: A number indicating the delay between forks.
- `forkExecutionDelay`: A number indicating the delay between fork executions.
- `threads`: The number of threads to use for processing.
- `whiteSpaceOffset`: The number of spaces to use for indentation.
- `debug`: A boolean indicating whether to enable debug mode.

### Methods

The `Config` class provides several methods to manage the configuration:

- `addPath(path: string)`: Adds a new path to the configuration.
- `removePath(path: string)`: Removes a path from the configuration.
- `addFileType(fileType: string)`: Adds a new file type to the configuration.
- `removeFileType(fileType: string)`: Removes a file type from the configuration.
- `addFileRegex(regex: string)`: Adds a new file regex to the configuration.
- `removeFileRegex(regex: string)`: Removes a file regex from the configuration.
- `saveConfigP()`: Saves the current configuration to the file.

### Example Usage

Here is an example of how to use the `Config` class:

```typescript
import { Config } from 'pheonix-box';

const config = new Config();

// Add a new path
config.addPath('new/path');

// Remove an existing path
config.removePath('old/path');

// Add a new file type
config.addFileType('.jsx');

// Remove an existing file type
config.removeFileType('.js');

// Save the updated configuration
config.saveConfigP();
```

This will update the `configurable.json` file with the new settings.

### Debugging

If you enable the `debug` option, the `Config` class will log messages to the console, which can help you troubleshoot issues with your configuration.

```typescript
const config = new Config();
config.debug = true;
config.addPath('new/path'); // This will log a message to the console
```

By following this guide, you can effectively manage and customize the configuration for the Pheonix Box project.

## License

This project is licensed under the X11 License. See the [LICENSE](https://github.com/john1234brown/pheonix-box/blob/main/pheonix/LICENSE) file for details.

For more information on the binary version of Pheonix Box, please visit the [GitHub repository](https://github.com/john1234brown/pheonix-box).
