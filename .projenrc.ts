import { javascript } from 'projen';
import { ProjenTypeScriptProject } from './src';

const project = new ProjenTypeScriptProject({
  name: '@gammarers/projen-projects',
  repositoryUrl: 'https://github.com/gammarers/projen-projects.git',
  deps: [
    'projen',
  ],
  // This package is published. The shared default leaves npm release off.
  releaseToNpm: true,
  npmTrustedPublishing: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['11 5 * * SUN']),
    },
  },
});

project.synth();
