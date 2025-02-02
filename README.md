# Protspace2

## Installation

Clone the source code:

```bash
git clone https://github.com/tsenoner/protspace2.git
```

### Project dependencies

After clone the repository change to the directory:

```bash
cd protspace2
```

Then install dependencies

```bash
yarn install
```

### Starting the app

Run `yarn dev` to start the application.

### Testing

Run `yarn test` to execute the test suite.

### Linting

Run `yarn lint` to check lint errors.

### Local Development with `scatter-board-library`

The project uses a locally developed library, `scatter-board-library`, which is built with Rollup and designed to work with React.

Setting Up the Library

```bash
cd scatter-board-library
yarn install
```

##### Yarn Link for Local Development

To work on both the frontend application and the library simultaneously, you can use Yarn’s linking feature. This way, any change in the library will be immediately available in the frontend.

###### Create a Global Link for the Library:

In the `scatter-board-library` directory, run:

```bash
yarn link
```

###### Link the Library in the Frontend Project:

In a separate terminal, navigate back to the `root` directory and run:

```bash
yarn link scatter-board-library
```

This creates a symbolic link from your local `scatter-board-library` to the `node_modules` folder of your root(frontend) project.

The `scatter-board-library` uses `Rollup` to bundle the library, producing both `CommonJS` and `ES module` builds along with `TypeScript` declaration files.

In the `scatter-board-library` directory, start the `Rollup` build in watch mode to automatically rebuild the library when changes are made:

```bash
cd scatter-board-library
yarn rollup-build-lib
```
