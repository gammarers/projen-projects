import { awscdk, IniFile, javascript, github } from 'projen';

// export const PROJEN_VERSION = "~0.91.1";

/**
 * Options for {@link ProjenCdkConstructLibrary}.
 *
 * Extends {@link awscdk.AwsCdkConstructLibraryOptions} while requiring
 * `name`, `repository`, and `cdkVersion`.
 */
export interface ProjenCdkConstructLibraryOptions extends Partial<
  Omit<awscdk.AwsCdkConstructLibraryOptions, 'cdkVersion' | 'name' | 'repository'>
> {
  /**
   * The name of the package.
   */
  readonly name: string;

  /**
   * The repository URL.
   */
  readonly repository: string;

  /**
   * The version of the AWS CDK to use.
   */
  readonly cdkVersion: string;
}

/**
 * A projen project type for AWS CDK construct libraries with shared defaults
 * such as author, Node versions, GitHub app credentials, and EditorConfig.
 */
export class ProjenCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {

  /**
   * Creates a new AWS CDK construct library project with opinionated defaults.
   *
   * @param options - Project options. Required fields are `name`, `repository`,
   * and `cdkVersion`. When `repositoryUrl` is omitted, it defaults to `repository`.
   */
  constructor(options: ProjenCdkConstructLibraryOptions) {
    // Avoid passing `repository` through to JsiiProject: it would override the
    // `repository` value derived from `repositoryUrl` during option merging.
    const { repository, repositoryUrl, ...rest } = options;

    super({
      projenrcTs: true,
      author: 'yicr',
      authorAddress: 'yicr@users.noreply.github.com',
      defaultReleaseBranch: 'main',
      packageManager: javascript.NodePackageManager.NPM,
      jsiiVersion: '6.0.x',
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
      ...rest,
      // Jsii requires repositoryUrl; default it from the required repository option.
      repositoryUrl: repositoryUrl ?? repository,
      // release: true,
      // staleOptions: {
      //   pullRequest: {
      //     daysBeforeStale: 90,
      //     daysBeforeClose: 30,
      //     ...options.staleOptions?.pullRequest,
      //   },
      //   issues: {
      //     daysBeforeStale: 180,
      //     daysBeforeClose: 30,
      //     ...options.staleOptions?.pullRequest,
      //   },
      //   ...options.staleOptions,
      // },
      // gitignore: [...(options.gitignore || [])],
    });

    // this.deps.addDependency(`projen@${PROJEN_VERSION}`, DependencyType.DEVENV);

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
