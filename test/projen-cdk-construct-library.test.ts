import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Testing, awscdk } from 'projen';
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
    expect(Object.keys(snapshot).some((filePath) => filePath.endsWith('-function.ts'))).toBe(false);
  });

  test('bundles a discovered lambda with the shared runtime', () => {
    const outdir = createOutdir();
    fs.mkdirSync(path.join(outdir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(outdir, 'src', 'hello.lambda.ts'), 'export const handler = async () => {};\n');

    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repositoryUrl: 'https://github.com/example/test-construct.git',
      cdkVersion: '2.170.0',
      outdir,
    });

    const snapshot = Testing.synth(project);
    const bundleArgs = JSON.stringify(snapshot['.projen/tasks.json']);

    expect(snapshot['src/hello-function.ts']).toContain("new lambda.Runtime('nodejs24.x'");
    expect(bundleArgs).toContain('--external:@aws-sdk/*');
    expect(bundleArgs).toContain('--sourcemap');
  });

  test('replaces the shared lambda options when lambdaOptions is provided', () => {
    const outdir = createOutdir();
    fs.mkdirSync(path.join(outdir, 'src'), { recursive: true });
    fs.writeFileSync(path.join(outdir, 'src', 'hello.lambda.ts'), 'export const handler = async () => {};\n');

    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repositoryUrl: 'https://github.com/example/test-construct.git',
      cdkVersion: '2.170.0',
      lambdaOptions: {
        runtime: awscdk.LambdaRuntime.NODEJS_22_X,
      },
      outdir,
    });

    const snapshot = Testing.synth(project);
    const bundleArgs = JSON.stringify(snapshot['.projen/tasks.json']);

    expect(snapshot['src/hello-function.ts']).toContain("new lambda.Runtime('nodejs22.x'");
    expect(bundleArgs).not.toContain('--sourcemap');
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
