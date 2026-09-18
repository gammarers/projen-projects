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
      repository: 'https://github.com/example/test-typescript-project.git',
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
  });

  test('uses authorName when explicitly provided', () => {
    const project = new ProjenTypeScriptProject({
      name: 'test-typescript-project',
      repository: 'https://github.com/example/test-typescript-project.git',
      authorName: 'override-author',
      outdir: createOutdir(),
    });

    const snapshot = Testing.synth(project);

    expect(snapshot['package.json'].author.name).toBe('override-author');
  });
});
