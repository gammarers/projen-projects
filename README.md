# @gammarers/projen-projects

[![NpmPackageLicense](https://img.shields.io/npm/l/@gammarers/projen-projects)](https://www.npmjs.com/package/@gammarers/projen-projects)
[![NpmPackageVersion](https://img.shields.io/npm/v/@gammarers/projen-projects)](https://www.npmjs.com/package/@gammarers/projen-projects)
[![NpmPackageDownloads](https://img.shields.io/npm/dt/@gammarers/projen-projects)](https://www.npmjs.com/package/@gammarers/projen-projects)

Opinionated [projen](https://projen.io/) project types for AWS CDK construct libraries.

## Features

- `ProjenCdkConstructLibrary` — an `AwsCdkConstructLibrary` wrapper with shared defaults
- Requires only `name`, `repository`, and `cdkVersion` to get started
- Defaults `repositoryUrl` from `repository` when omitted
- Shared author, Node (`>= 20`), TypeScript (`6.0.x`), and jsii (`6.0.x`) settings
- GitHub App credentials for workflow authentication
- Weekly dependency upgrades with auto-approve / auto-merge labels
- Generates a consistent `.editorconfig`

## Installation

npm:

```bash
npm install @gammarers/projen-projects
```

yarn:

```bash
yarn add @gammarers/projen-projects
```

## Usage

Create a `.projenrc.ts` that uses `ProjenCdkConstructLibrary`:

```ts
import { ProjenCdkConstructLibrary } from '@gammarers/projen-projects';

const project = new ProjenCdkConstructLibrary({
  name: '@example/my-cdk-construct',
  repository: 'https://github.com/example/my-cdk-construct.git',
  cdkVersion: '2.170.0',
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
| `repository` | `string` | Yes | Repository URL (also used as the default for `repositoryUrl`) |
| `cdkVersion` | `string` | Yes | AWS CDK version |

Optional highlights:

| Option | Description |
| --- | --- |
| `repositoryUrl` | Jsii repository URL; defaults to `repository` when omitted |
| Other `AwsCdkConstructLibrary` options | Passed through and can override the built-in defaults |

Built-in defaults include author `yicr`, npm as the package manager, `releaseToNpm: false`,
public npm access, workflow Node `24.x`, and GitHub App-based projen credentials.

## Requirements

- Node.js `>= 20.0.0`
- [projen](https://www.npmjs.com/package/projen)

## License

This project is licensed under the Apache-2.0 License.
