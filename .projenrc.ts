import { javascript, github, typescript } from 'projen';
const project = new typescript.TypeScriptProject({
  authorName: 'yicr',
  authorEmail: 'yicr@users.noreply.github.com',
  typescriptVersion: '6.0.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/projen-projects',
  packageManager: javascript.NodePackageManager.NPM,
  projenrcTs: true,
  repository: 'https://github.com/gammarers/projen-projects.git',
  deps: [
    'projen',
  ],
  releaseToNpm: true,
  npmTrustedPublishing: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '20.0.0',
  workflowNodeVersion: '24.x',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['11 5 * * SUN']),
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