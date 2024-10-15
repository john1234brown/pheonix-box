# Pheonix Box CLI Tutorial (NPM Version)

Welcome to the Pheonix Box NPM Module tutorial. This guide will help you understand how to use the Pheonix Box NPM Module to manage and secure your files. Additionally, we will cover how to secure a binary and the root folder space of a Linux OS.

## Table of Contents
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Configuration](#configuration)
5. [Securing a Binary](#securing-a-binary)
6. [Securing the Root Folder Space](#securing-the-root-folder-space)
7. [Conclusion](#conclusion)

## Introduction
The Pheonix Box NPM Module is a powerful tool for managing and securing files. Its encryption and hashing capabilities ensure the confidentiality and integrity of files, making it suitable for various security applications. The configurable settings, concurrency support, and state management features make it a versatile and efficient solution for file processing tasks.

## Installation
To install the Pheonix Box NPM Module, follow these steps:

1. Install the module via NPM:
    ```sh
    npm install pheonix-box
    ```

## Basic Usage
To start using the Pheonix Box NPM Module, you can use the following commands in your Node.js application:

- Import the module:
    ```js
    const PheonixBox = require('pheonix-box');
    ```

- Start the Pheonix process:
    ```js
    const pheonix = new PheonixBox();
    pheonix.start();
    ```

- Display help:
    ```js
    pheonix.help();
    ```

## Configuration
You can configure the Pheonix Box NPM Module using various methods. Here are some examples:

- Add a path to the configuration:
    ```js
    pheonix.config.addPath('/path/to/directory');
    ```

- Set the number of threads:
    ```js
    pheonix.config.setThreads(4);
    ```

- Enable AES Key encryption:
    ```js
    pheonix.config.setUseAesKey(true);
    ```

## Securing a Binary
To secure a binary using the Pheonix Box NPM Module, follow these steps:

1. Add the binary's directory to the configuration:
    ```js
    pheonix.config.addPath('/path/to/binary');
    ```

2. Enable encryption and hashing:
    ```js
    pheonix.config.setUseCeaserCipher(true);
    pheonix.config.setUseAesKey(true);
    ```

3. Start the Pheonix process to secure the binary:
    ```js
    pheonix.start();
    ```

## Securing the Root Folder Space
To secure the root folder space specifically for securing the OS level binaries of a Linux OS, follow these steps:

1. Add the root directory to the configuration:
    ```js
    pheonix.config.addPath('/');
    ```

2. Exclude the home directory from the configuration to avoid affecting personal files:
    ```js
    pheonix.config.excludePath('/home');
    ```

3. Enable encryption and hashing:
    ```js
    pheonix.config.setUseCeaserCipher(true);
    pheonix.config.setUseAesKey(true);
    ```

4. Start the Pheonix process to secure the root folder space:
    ```js
    pheonix.start();
    ```

**Note:** Be cautious when securing the root folder space as it may affect system files and operations.

## Conclusion
The Pheonix Box NPM Module is a versatile tool for managing and securing files. By following this tutorial, you can configure and use the module to secure your binaries and the root folder space of your Linux OS. For more detailed information, refer to the project's [documentation and source code](https://github.com/john1234brown/Pheonix-Box-Cli).

### New Additions

- **Concurrency Support**: You can now set the number of concurrent threads for file processing.
    ```js
    pheonix.config.setThreads(4);
    ```

- **State Management**: The module now supports state management to resume interrupted processes.
    ```js
    pheonix.state.save();
    pheonix.state.load();
    ```

- **Enhanced Debugging**: Enable debugging to get detailed logs.
    ```js
    pheonix.config.setDebug(true);
    ```

By following this updated guide, you can take full advantage of the new features and improvements in the Pheonix Box NPM Module.

For information on using the Pheonix Box CLI as a standalone binary, please refer to the [GitHub repository](https://github.com/john1234brown/pheonix-box).

