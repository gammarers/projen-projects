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
    expect(snapshot['.editorconfig']).toContain('max_line_length=120');
    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-test-typescript-project');
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/node:2']).toEqual({
      version: '24',
      npmVersion: '12',
    });
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/dotnet:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/python:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/java:1']).toBeUndefined();
    expect(snapshot['.devcontainer/devcontainer.json'].postCreateCommand).toBe(
      'sudo chown -R $(whoami): /workspace && npm ci',
    );
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
