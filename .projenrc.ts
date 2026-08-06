import { cdk, javascript, github } from 'projen';
const project = new cdk.JsiiProject({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  defaultReleaseBranch: 'main',
  typescriptVersion: '6.0.x',
  jsiiVersion: '6.0.x',
  name: '@gammarers/projen-aws-cdk-construct',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/projen-project-types.git',
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
  autoApproveOptions: {
    allowedUsernames: [
      'gammarers-projen-upgrade-bot[bot]',
      'yicr',
    ],
  },
  jestOptions: {
    extraCliOptions: ['--silent'],
  },
  tsconfigDev: {
    compilerOptions: {
      strict: true,
    },
  },
});
project.eslint?.addRules({
  'max-len': ['error', {
    code: 120,
    ignoreUrls: true,
    ignoreStrings: true,
  }],
});
project.addPackageIgnore('/.devcontainer');
project.synth();