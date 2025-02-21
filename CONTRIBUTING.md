# CONTRIBUTING

If you are using VSCode, you can install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension. Once installed you will be prompted to reopen the folder in a container. All required dependencies will be installed in the container for you. If you're not prompted, you can run the `Remote-Containers: Open Folder in Container` command from the [VSCode Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

If you're not able to use the dev container, follow these instructions:

## Prerequisite

To build platform binding and wasm, make sure you have installed [Rust](https://www.rust-lang.org/it/tools/install).

> On Windows, Rust requires [C++ build tools](https://visualstudio.microsoft.com/it/visual-cpp-build-tools/). You can also select _Desktop development with C++_
> while installing Visual Studio.

> Alternatively, if Rust is not available you can run `yarn build.platform.copy` to download bindings from CDN

To build Qwik for local development, first install the dev dependencies using [yarn](https://yarnpkg.com/):

## Development

```
yarn
```

Next the `start` command will:

- Build the source files
- Begin the watch process so any changes will rebuild
- Run the type checking watch process with [tsc](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- Run the unit test watch process

```
yarn start
```

Finally you can use yarn workspace command to run packages' commands, for example:

```
yarn workspace qwik-docs dev.ssr
yarn workspace @builder.io/qwik-city dev.ssr
```

More commands can be found in each package's package.json scripts section.

## Starter CLI `create-qwik`

- [Starter CLI](https://github.com/BuilderIO/qwik/blob/main/starters/README.md)

## Running All Tests

To run all Unit tests ([uvu](https://github.com/lukeed/uvu)) and E2E tests ([Playwright](https://playwright.dev/)), run:

```
yarn test
```

The `test` command will also ensure a build was completed.

### Unit Tests Only

Unit tests use [uvu](https://github.com/lukeed/uvu)

```
yarn test.unit
```

To keep _uvu_ open with the watch mode, run:

```
yarn test.watch
```

> Note that the `test.watch` command isn't necessary if you're running the `yarn start` command, since `start` will also concurrently run the _uvu_ watch process.

### E2E Tests Only

E2E tests use [Playwright](https://playwright.dev/).

To run the Playwright tests headless, from start to finish, run:

```
yarn test.e2e
```

## Production Build

The `yarn start` command will run development builds, type check, watch unit tests, and watch the files for changes.

A full production build will:

- Builds each submodule
- Generates bundled `.d.ts` files for each submodule with [API Extractor](https://api-extractor.com/)
- Checks the public API hasn't changed
- Builds a minified `core.min.mjs` file
- Generates the publishing `package.json`

```
yarn build
```

The build output will be written to `packages/qwik/dist`, which will be the directory that is published
to [@builder.io/qwik](https://www.npmjs.com/package/@builder.io/qwik).

## Committing using "Commitizen":

Instead of using `git commit` please use the following command:

```shell
yarn commit
```

You'll be asked guiding questions which will eventually create a descriptive commit message and necessary to generate meaningful release notes / CHANGELOG automatically.

## Releasing

1. Run `yarn release.prepare`, which will test, lint and build.
2. Use the interactive UI to select the next version, which will update the `package.json` `version` property, add the git change, and start a commit message.
3. Create a PR with the `package.json` change to merge to `main`.
4. After the `package.json` with the updated version is in `main`, click the [Run Workflow](https://github.com/BuilderIO/qwik/actions/workflows/ci.yml) button from the "Qwik CI" Github Action workflow.
5. Select the NPM dist-tag that should be used for this version, then click "Run Workflow".
6. The Github Action will dispatch the workflow to build `@builder.io/qwik` and each of the submodules, build WASM and native bindings, combine them into one package, and validate the package before publishing to NPM.
7. If the build is successful and all tests and validation passes, the workflow will automatically publish to NPM, commit a git tag to the repo, and create a Github release.
8. 🚀

## Pre-submit hooks

The project has pre-submit hooks, which ensure that your code is correctly formatted. You can run them manually like so:

```
yarn lint
```

Some of the issues can be fixed automatically by using:

```
yarn fmt
```
