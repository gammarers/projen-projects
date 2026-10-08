import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Testing } from 'projen';
import { ProjenTypeScriptProject } from '../src';

const createOutdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'projen-typescript-project-'));

describe('ProjenTypeScriptProject', () => {
  test('synthesizes with required options', () => {
    const project = new ProjenTypeScriptProject({
      name: 'test-typescript-project',
      repositoryUrl: 'https://github.com/example/test-typescript-project.git',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].name).toBe('test-typescript-project');
    expect(snapshot['package.json'].repository.url).toBe(
      'https://github.com/example/test-typescript-project.git',
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
    expect(snapshot['test/tsconfig.json'].compilerOptions.strict).toBe(true);
    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-test-typescript-project');
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/node:2']).toEqual({
      version: '24',
      npmVersion: '12',
    });
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/dotnet:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/python:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/java:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].workspaceMount).toBe(
      'source=${localWorkspaceFolder},target=${containerWorkspaceFolder},type=bind',
    );
    expect(snapshot['.devcontainer/devcontainer.json'].workspaceFolder).toBe('/workspace');
    expect(snapshot['.devcontainer/devcontainer.json'].mounts).toEqual([
      'target=${containerWorkspaceFolder}/node_modules',
    ]);
    expect(snapshot['.devcontainer/devcontainer.json'].postCreateCommand).toEqual({
      fixVolumePermissions: 'sudo chown -R $(whoami): /workspace',
      gitConfigSafeDirectory: 'git config --global --add safe.directory ${containerWorkspaceFolder}',
      installDependencies: 'npm ci',
    });
    expect(snapshot['.devcontainer.json']).toBeUndefined();
    expect(snapshot['.npmignore']).toContain('/.devcontainer');
  });

  test('names the devcontainer from a scoped package', () => {
    const project = new ProjenTypeScriptProject({
      name: '@example/scoped-project',
      repositoryUrl: 'https://github.com/example/scoped-project.git',
      devContainer: true,
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-example-scoped-project');
    expect(snapshot['.devcontainer.json']).toBeUndefined();
  });

  test('uses authorName when explicitly provided', () => {
    const project = new ProjenTypeScriptProject({
      name: 'test-typescript-project',
      repositoryUrl: 'https://github.com/example/test-typescript-project.git',
      authorName: 'override-author',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].author.name).toBe('override-author');
  });
});
