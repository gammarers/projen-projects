import {
  github,
  IniFile,
  javascript,
  typescript,
  type Project,
} from 'projen';

/**
 * Author identity shared by the opinionated project types.
 *
 * CDK construct libraries pass these as jsii's `author` and `authorAddress`.
 * TypeScript projects pass them as `authorName` and `authorEmail`.
 * Jsii copies `author` into `authorName` before merging options, so setting
 * `authorName` on a construct library would override a caller-supplied `author`.
 */
export const sharedAuthor = {
  name: 'yicr',
  email: 'yicr@users.noreply.github.com',
} as const;

/**
 * Opinionated defaults common to TypeScript and CDK construct library projects.
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
  minNodeVersion: '20.0.0',
  workflowNodeVersion: '24.x',
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
      'yicr',
    ],
  },
});

/**
 * Adds the shared EditorConfig file to a project.
 */
export const addEditorConfig = (project: Project): void => {
  new IniFile(project, '.editorconfig', {
    obj: {
      'root': true,
      '*': {
        end_of_line: 'lf',
        charset: 'utf-8',
      },
      '*.{js,ts}': {
        indent_style: 'space',
        indent_size: 2,
        max_line_length: 120,
      },
    },
    marker: true,
  });
};
