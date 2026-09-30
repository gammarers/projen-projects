import { JsonFile, awscdk, javascript } from 'projen';
import { sharedNodeVersions } from './shared-project-defaults';

const devcontainerUser = 'developer';
const devcontainerWorkspaceFolder = '/workspace';
const devcontainerNpmVersion = '12';

/**
 * Turns an npm package name into a Dev Container name.
 *
 * `@scope/name` becomes `dev-scope-name`.
 *
 * @param packageName - npm package name, with or without a scope.
 * @returns Dev Container `name`.
 */
const devcontainerName = (packageName: string): string => {
  const withoutScopePrefix = packageName.replace(/^@/, '');
  const sanitized = withoutScopePrefix.replace(/\//g, '-');
  return `dev-${sanitized}`;
};

/**
 * Builds the command that runs once after the container is created.
 *
 * Ownership of the anonymous `node_modules` volume is fixed first.
 * Install then runs in the same shell, using the project's package manager.
 *
 * @param installCommand - Immutable install command, such as `npm ci`.
 * @returns Shell command for `postCreateCommand`.
 */
const postCreateCommand = (installCommand: string): string =>
  `sudo chown -R $(whoami): ${devcontainerWorkspaceFolder} && ${installCommand}`;

/**
 * .NET, Python, and Java features used by jsii construct libraries.
 */
const jsiiLanguageFeatures = {
  'ghcr.io/devcontainers/features/dotnet:1': {},
  'ghcr.io/devcontainers/features/python:1': {},
  'ghcr.io/devcontainers/features/java:1': {},
};

/**
 * Dev Container features for a project.
 *
 * CDK construct libraries include {@link jsiiLanguageFeatures} for jsii packaging.
 * Other Node projects keep the common, git, and Node.js features.
 *
 * @param project - Node project that receives the Dev Container.
 * @returns Feature map for `devcontainer.json`.
 */
const devcontainerFeatures = (project: javascript.NodeProject) => {
  const features = {
    'ghcr.io/devcontainers/features/common-utils:2': {
      username: devcontainerUser,
      upgradePackages: true,
    },
    'ghcr.io/devcontainers/features/git:1': {},
    'ghcr.io/devcontainers/features/node:2': {
      version: sharedNodeVersions.devcontainer,
      npmVersion: devcontainerNpmVersion,
    },
  };

  if (!(project instanceof awscdk.AwsCdkConstructLibrary)) {
    return features;
  }

  return {
    ...features,
    ...jsiiLanguageFeatures,
  };
};

/**
 * Adds the shared Dev Container definition to a project.
 *
 * Writes `.devcontainer/devcontainer.json` and excludes that directory from the npm package.
 * Node.js matches {@link sharedNodeVersions}.
 * CDK construct libraries also install the .NET, Python, and Java features.
 *
 * @param project - Node project that receives the Dev Container.
 */
export const addDevContainer = (project: javascript.NodeProject): void => {
  project.addPackageIgnore('/.devcontainer');

  new JsonFile(project, '.devcontainer/devcontainer.json', {
    allowComments: true,
    obj: {
      name: devcontainerName(project.name),
      image: 'mcr.microsoft.com/devcontainers/base:trixie',
      features: devcontainerFeatures(project),
      workspaceMount: `source=\${localWorkspaceFolder},target=${devcontainerWorkspaceFolder},type=bind`,
      workspaceFolder: devcontainerWorkspaceFolder,
      mounts: [
        `target=${devcontainerWorkspaceFolder}/node_modules`,
      ],
      remoteUser: devcontainerUser,
      remoteEnv: {
        npm_config_loglevel: 'error',
      },
      postCreateCommand: postCreateCommand(project.package.installCommand),
    },
  });
};
