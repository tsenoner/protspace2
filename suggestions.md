# Suggestions

- remove the **frontend** folder and move everything to the root
- move the **tests** next to the code they are testing (colocate)
- move the **stories** to the components they are describing (colocate)
- update the **node version** to the latest LTS version
- define a **node version** in the `package.json` file and add a `.nvmrc` file to lock the node version
- update the `README.md` file to better explain the project and the steps one needs to follow to run the project
- remove all the unused dependencies. e.g. chai, jsonparse, @storybook/blocks, @storybook/nextjs, etc. don't seem to be used
- some dependencies are declared twice (**dependencies** and **devDependencies**). remove one of them e.g. autoprefixer, postcss, tailwindcss
- update the dependencies to the latest version. use `yarn upgrade-interactive --latest`
- consider moving to a monorepo setup (e.g. turborepo) to manage the frontend and the scatter-board-library. alternatively could **scatter-board-library** also be moved to the frontend folder as a library and not be a separate package?
- be consisistent in the way (eslint rules can be used to enforce best practices):
  - components are written (function declaration vs arrow function)
  - components are exported
  - component files are named (should have the same name as the exported component)
  - types are defined (interface vs type)
- remove commented out code
- break down big components into smaller ones (e.g. VisualizationComp)
- move utils out of the components folder
- remove the **pages** folder
- fix failing tests
- add prettier (formatting) and eslint (stricter rules for consistency)
- add a github action to run the tests, linting and formatting
- add a precommit hook to run linting and formatting

# Questions

- what is the purpose of the `index.html` file?
