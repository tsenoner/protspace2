# NPM Run Rollup Build Lib

This script is used to build a library using Rollup. Rollup is a popular JavaScript module bundler that helps create optimized and smaller bundles for your JavaScript/TypeScript projects.

## Prerequisites

Before running this script, make sure you have the following prerequisites:

1. **Node.js and npm**: Ensure that you have Node.js and npm (Node Package Manager) installed on your system. You can download and install them from [the official Node.js website](https://nodejs.org/).
2. **NPM Account**: You must have an npm account. If you don't have one, you can create an account by running `npm adduser` and following the prompts.

## Usage

To change and publish the library, you need to follow these steps:

1. **Clone and navigate to your project directory:**

If you haven't already, clone the Rost Backend repository to your local machine:

```bash
git clone https://github.com/your-username/rost-backend.git

cd rostspace-web/scatter-board-library
```

2. **Install dependencies:**

   If you haven't already, make sure to install the required dependencies by running:

   ```bash
   npm install
   ```
3. **Run the Rollup build script:**
    
    To build your library using Rollup, use the following command:
    ```bash
   npm run rollup-build-lib
   ```
4. **Access the build library:**
    Once the script completes successfully, you'll find the built library in a designated directory (the dist folder) within your project. This built library can be used in your applications or shared with others.

5. **Login to Your npm Account (If Not Already Logged In):**

   If you haven't already logged in to your npm account on the command line, you can do so using the following command:

   ```bash
   npm login
   ```
6. **Run npm publish:**

    To publish your package, simply run the following command:
    ```bash
   npm publish
   ```
   Note: It's important to follow semantic versioning (semver) when updating your package. Increment the version number in your package.json file appropriately to indicate the type of changes made (major, minor, or patch).


