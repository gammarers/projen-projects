import { IniFile, javascript, github, typescript } from 'projen';

/**
 * Options for {@link ProjenTypeScriptProject}.
 *
 * Extends {@link typescript.TypeScriptProjectOptions} while requiring
 * `name` and `repository`.
 */
export interface ProjenTypeScriptProjectOptions extends Partial<
  Omit<typescript.TypeScriptProjectOptions, 'name' | 'repository'>
> {
  /**
   * The name of the package.
   */
  readonly name: string;

  /**
   * The repository URL.
   */
  readonly repository: string;
}

/**
 * A projen project type for TypeScript packages with shared defaults
 * such as author, Node versions, GitHub app credentials, and EditorConfig.
 */
export class ProjenTypeScriptProject extends typescript.TypeScriptProject {

  /**
   * Creates a new TypeScript project with opinionated defaults.
   *
   * @param options - Project options. Required fields are `name` and `repository`.
   */
  constructor(options: ProjenTypeScriptProjectOptions) {
    super({
      projenrcTs: true,
      authorName: 'yicr',
      authorEmail: 'yicr@users.noreply.github.com',
      defaultReleaseBranch: 'main',
      packageManager: javascript.NodePackageManager.NPM,
      typescriptVersion: '6.0.x',
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
      autoApproveUpgrades: true,
      autoApproveOptions: {
        allowedUsernames: [
          'gammarers-projen-upgrade-bot[bot]',
          'yicr',
        ],
      },
      ...options,
    });

    new IniFile(this, '.editorconfig', {
      obj: {
        'root': true,
        '*': {
          end_of_line: 'lf',
          charset: 'utf-8',
        },
        '*.{js,ts}': {
          indent_style: 'space',
          indent_size: 2,
          max_line_length: 120,
        },
      },
      marker: true,
    });
  }
}
