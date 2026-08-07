import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Testing } from 'projen';
import { ProjenCdkConstructLibrary } from '../src';

const createOutdir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'projen-cdk-construct-library-'));

describe('ProjenCdkConstructLibrary', () => {
  test('synthesizes with required options and defaults repositoryUrl from repository', () => {
    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repository: 'https://github.com/example/test-construct.git',
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
    expect(snapshot['.editorconfig']).toContain('max_line_length=120');
  });

  test('uses repositoryUrl when explicitly provided', () => {
    const project = new ProjenCdkConstructLibrary({
      name: 'test-construct',
      repository: 'https://github.com/example/test-construct.git',
      repositoryUrl: 'https://github.com/example/override.git',
      cdkVersion: '2.170.0',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].repository.url).toBe(
      'https://github.com/example/override.git',
    );
  });
});
