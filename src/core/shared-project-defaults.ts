import {
  github,
  javascript,
  typescript,
} from 'projen';

/**
 * Author identity shared by the opinionated project types.
 *
 * jsii projects (including CDK construct libraries) pass these as
 * `author` and `authorAddress`.
 * TypeScript projects pass them as `authorName` and `authorEmail`.
 * Jsii copies `author` into `authorName` before merging options, so setting
 * `authorName` on a jsii project would override a caller-supplied `author`.
 */
export const sharedAuthor = {
  name: 'yicr',
  email: 'yicr@users.noreply.github.com',
} as const;

/**
 * Maximum line length shared by EditorConfig and ESLint.
 */
export const sharedMaxLineLength = 160;

/**
 * Node.js versions shared by CI workflows and the Dev Container.
 *
 * `workflow` is the GitHub Actions `node-version` (`24.x`).
 * `devcontainer` is the Dev Container Node feature version on that same major line.
 */
export const sharedNodeVersions = {
  min: '20.0.0',
  workflow: '24.x',
  devcontainer: '24',
} as const;

/**
 * Opinionated defaults common to TypeScript, jsii, and CDK construct library projects.
 *
 * Returns a new object on each call so nested workflow options are not shared
 * across projects.
 */
export const createSharedTypeScriptProjectDefaults = (): Partial<typescript.TypeScriptProjectOptions> => ({
  projenrcTs: true,
  defaultReleaseBranch: 'main',
  packageManager: javascript.NodePackageManager.NPM,
  typescriptVersion: '6.0.x',
  releaseToNpm: false,
  npmTrustedPublishing: false,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: sharedNodeVersions.min,
  workflowNodeVersion: sharedNodeVersions.workflow,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  githubOptions: {
    projenCredentials: github.GithubCredentials.fromApp({
      permissions: {
        pullRequests: github.workflows.AppPermission.WRITE,
        contents: github.workflows.AppPermission.WRITE,
        workflows: github.workflows.AppPermission.WRITE,
      },
    }),
  },
  autoApproveUpgrades: true,
  autoApproveOptions: {
    allowedUsernames: [
      'gammarers-projen-upgrade-bot[bot]',
      sharedAuthor.name,
    ],
  },
  // The development tsconfig typechecks tests with strict mode.
  tsconfigDev: {
    compilerOptions: {
      strict: true,
    },
  },
  // --silent keeps console output from tests out of the Jest run.
  // coverageThreshold fails the suite when coverage falls below these floors.
  jestOptions: {
    extraCliOptions: ['--silent'],
    jestConfig: {
      coverageThreshold: {
        branches: 95,
        functions: 90,
        lines: 100,
        statements: 100,
      },
    },
  },
});
