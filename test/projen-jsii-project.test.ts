import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Testing } from 'projen';
import { ProjenJsiiProject } from '../src';

const createOutdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'projen-jsii-project-'));

describe('ProjenJsiiProject', () => {
  test('synthesizes with required options', () => {
    const project = new ProjenJsiiProject({
      name: 'test-jsii-project',
      repositoryUrl: 'https://github.com/example/test-jsii-project.git',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].name).toBe('test-jsii-project');
    expect(snapshot['package.json'].repository.url).toBe(
      'https://github.com/example/test-jsii-project.git',
    );
    expect(snapshot['package.json'].author.name).toBe('yicr');
    expect(snapshot['package.json'].author.email).toBe('yicr@users.noreply.github.com');
    expect(snapshot['package.json'].engines.node).toBe('>= 20.0.0');
    expect(snapshot['.editorconfig']).toContain('indent_size=2');
    expect(snapshot['.editorconfig']).toContain('max_line_length=160');
    expect(snapshot['.eslintrc.json'].rules['max-len']).toEqual(['error', {
      code: 160,
      ignoreUrls: true,
      ignoreStrings: true,
    }]);
    expect(snapshot['.projen/tasks.json'].tasks.test.steps[0].execArgs).toContain('--silent');
    expect(snapshot['package.json'].jest.coverageThreshold).toEqual({
      global: {
        branches: 95,
        functions: 90,
        lines: 100,
        statements: 100,
      },
    });
    expect(snapshot['test/tsconfig.json'].compilerOptions.strict).toBe(true);
    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-test-jsii-project');
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/dotnet:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/python:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/java:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].workspaceMount).toBe(
      'source=${localWorkspaceFolder},target=${containerWorkspaceFolder},type=bind',
    );
    expect(snapshot['.devcontainer/devcontainer.json'].mounts).toEqual([
      'target=${containerWorkspaceFolder}/node_modules',
    ]);
    expect(snapshot['.devcontainer/devcontainer.json'].postCreateCommand).toEqual({
      fixVolumePermissions: 'sudo chown -R $(whoami): ${containerWorkspaceFolder}',
      gitConfigSafeDirectory: 'git config --global --add safe.directory ${containerWorkspaceFolder}',
      gitConfigCredentialHelper: 'git config --global credential.helper store',
      installDependencies: 'npm ci',
    });
    expect(snapshot['.devcontainer.json']).toBeUndefined();
    expect(snapshot['.npmignore']).toContain('/.devcontainer');
  });

  test('names the devcontainer from a scoped package', () => {
    const project = new ProjenJsiiProject({
      name: '@example/scoped-jsii',
      repositoryUrl: 'https://github.com/example/scoped-jsii.git',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-example-scoped-jsii');
    expect(snapshot['.devcontainer.json']).toBeUndefined();
  });

  test('uses author when explicitly provided', () => {
    const project = new ProjenJsiiProject({
      name: 'test-jsii-project',
      repositoryUrl: 'https://github.com/example/test-jsii-project.git',
      author: 'override-author',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].author.name).toBe('override-author');
  });
});
