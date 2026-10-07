import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Testing } from 'projen';
import { ProjenCdkConstructLibrary } from '../src';

const createOutdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'projen-cdk-construct-library-'));

describe('ProjenCdkConstructLibrary', () => {
  test('synthesizes with required options', () => {
    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repositoryUrl: 'https://github.com/example/test-construct.git',
      cdkVersion: '2.170.0',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].name).toBe('test-construct');
    expect(snapshot['package.json'].repository.url).toBe(
      'https://github.com/example/test-construct.git',
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
    expect(snapshot['.devcontainer/devcontainer.json'].name).toBe('dev-test-construct');
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/dotnet:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/python:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].features['ghcr.io/devcontainers/features/java:1']).toEqual({});
    expect(snapshot['.devcontainer/devcontainer.json'].postCreateCommand).toBe(
      'sudo chown -R $(whoami): /workspace && npm ci',
    );
    expect(snapshot['.devcontainer.json']).toBeUndefined();
    expect(snapshot['.npmignore']).toContain('/.devcontainer');
  });

  test('uses author when explicitly provided', () => {
    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repositoryUrl: 'https://github.com/example/test-construct.git',
      cdkVersion: '2.170.0',
      author: 'override-author',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].author.name).toBe('override-author');
  });
});
