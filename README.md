# Projen Projects

[![npm version](https://img.shields.io/npm/v/@gammarers/projen-projects?style=flat-square)](https://www.npmjs.com/package/@gammarers/projen-projects)
[![license](https://img.shields.io/npm/l/@gammarers/projen-projects?style=flat-square)](https://www.npmjs.com/package/@gammarers/projen-projects)
[![Node.js](https://img.shields.io/node/v/@gammarers/projen-projects?style=flat-square)](https://www.npmjs.com/package/@gammarers/projen-projects)
[![build](https://img.shields.io/github/actions/workflow/status/gammarers/projen-projects/build.yml?label=build&style=flat-square)](https://github.com/gammarers/projen-projects/actions/workflows/build.yml)

Opinionated [projen](https://projen.io/) project types for AWS CDK construct libraries and TypeScript packages.

## Features

- `ProjenCdkConstructLibrary` — an `AwsCdkConstructLibrary` wrapper with shared defaults
- `ProjenTypeScriptProject` — a `TypeScriptProject` wrapper with the same shared defaults
- Requires only `name` and `repositoryUrl` to get started (`cdkVersion` is also required for CDK libraries)
- Shared author, Node (`>= 20`), TypeScript (`6.0.x`), and jsii (`6.0.x`, CDK libraries) settings
- GitHub App credentials for workflow authentication
- Weekly dependency upgrades with auto-approve / auto-merge labels
- Generates a consistent `.editorconfig` and sets ESLint `max-len` to 160
- Runs Jest with `--silent` so test logs stay quiet
- Enables TypeScript `strict` in the development tsconfig
- Defaults discovered AWS Lambda handlers to Node.js 24, with `@aws-sdk/*` external and source maps
- Generates `.devcontainer/devcontainer.json` on Node 24, aligned with workflow Node `24.x`

## Installation

### npm

```bash
npm install @gammarers/projen-projects
```

### yarn

```bash
yarn add @gammarers/projen-projects
```

### pnpm

```bash
pnpm add @gammarers/projen-projects
```

## Usage

Create a `.projenrc.ts` that uses `ProjenCdkConstructLibrary`:

```ts
import { ProjenCdkConstructLibrary } from '@gammarers/projen-projects';

const project = new ProjenCdkConstructLibrary({
  name: '@example/my-cdk-construct',
  repositoryUrl: 'https://github.com/example/my-cdk-construct.git',
  cdkVersion: '2.170.0',
});

project.synth();
```

Or use `ProjenTypeScriptProject` for a TypeScript package:

```ts
import { ProjenTypeScriptProject } from '@gammarers/projen-projects';

const project = new ProjenTypeScriptProject({
  name: '@example/my-typescript-project',
  repositoryUrl: 'https://github.com/example/my-typescript-project.git',
});

project.synth();
```

Then generate the project files:

```bash
npx projen
```

## Options

`ProjenCdkConstructLibrary` accepts `ProjenCdkConstructLibraryOptions`, which extends
`AwsCdkConstructLibraryOptions` (most fields optional) while requiring the following:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Package name |
| `repositoryUrl` | `string` | Yes | Git repository URL (jsii derives `repository` from this value) |
| `cdkVersion` | `string` | Yes | AWS CDK version |

Optional highlights:

| Option | Description |
| --- | --- |
| Other `AwsCdkConstructLibrary` options | Passed through and can override the built-in defaults, including `lambdaOptions`. `devContainer` stays `false` |

Built-in defaults include author `yicr`, npm as the package manager, `releaseToNpm: false`,
public npm access, workflow Node `24.x`, and GitHub App-based projen credentials.
Discovered Lambda handlers use Node.js 24, exclude `@aws-sdk/*` from the bundle, and emit source maps.
Passing `lambdaOptions` replaces that default. A library with no Lambda handler is unchanged.

`ProjenTypeScriptProject` accepts `ProjenTypeScriptProjectOptions`, which extends
`TypeScriptProjectOptions` (most fields optional) while requiring the following:

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | `string` | Yes | Package name |
| `repositoryUrl` | `string` | Yes | Git repository URL (passed through as projen's `repository`) |

Other `TypeScriptProject` options are passed through and can override the built-in defaults.
`devContainer` stays `false`. The same author, Node, TypeScript, npm, and GitHub App defaults
as `ProjenCdkConstructLibrary` apply (`jsiiVersion` is not set because this type is not a jsii project).

Both types write `.devcontainer/devcontainer.json` and add `/.devcontainer` to `.npmignore`.
CDK construct libraries also install the .NET, Python, and Java Dev Container features.
After the container is created, it fixes ownership of the `node_modules` volume, marks the
workspace as a Git safe directory, and runs the project's immutable install command
(`npm ci` with the default package manager).

## Requirements

- Node.js `>= 20.0.0`

## License

This project is licensed under the Apache-2.0 License.
