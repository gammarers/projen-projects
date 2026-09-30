import { awscdk } from 'projen';
import { addDevContainer } from './core/devcontainer';
import { addEditorConfig } from './core/editor-config';
import { addEslintConfig } from './core/eslint-config';
import { createSharedTypeScriptProjectDefaults, sharedAuthor } from './core/shared-project-defaults';

// export const PROJEN_VERSION = "~0.91.1";

/**
 * Options for {@link ProjenCdkConstructLibrary}.
 *
 * Extends {@link awscdk.AwsCdkConstructLibraryOptions} while requiring
 * `name`, `repositoryUrl`, and `cdkVersion`.
 * Projen's `repository` option is omitted: jsii derives it from `repositoryUrl`,
 * and passing `repository` would override that derived value.
 */
export interface ProjenCdkConstructLibraryOptions extends Partial<
  Omit<awscdk.AwsCdkConstructLibraryOptions, 'cdkVersion' | 'name' | 'repositoryUrl' | 'repository'>
> {
  /**
   * The name of the package.
   */
  readonly name: string;

  /**
   * Git repository URL.
   */
  readonly repositoryUrl: string;

  /**
   * The version of the AWS CDK to use.
   */
  readonly cdkVersion: string;
}

/**
 * A projen project type for AWS CDK construct libraries with shared defaults
 * such as author, Node versions, GitHub app credentials, EditorConfig, ESLint, and a Dev Container.
 */
export class ProjenCdkConstructLibrary extends awscdk.AwsCdkConstructLibrary {

  /**
   * Creates a new AWS CDK construct library project with opinionated defaults.
   *
   * @param options - Project options. Required fields are `name`, `repositoryUrl`,
   * and `cdkVersion`.
   */
  constructor(options: ProjenCdkConstructLibraryOptions) {
    super({
      ...createSharedTypeScriptProjectDefaults(),
      author: sharedAuthor.name,
      authorAddress: sharedAuthor.email,
      jsiiVersion: '6.0.x',
      ...options,
      devContainer: false,
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

    addEditorConfig(this);
    addEslintConfig(this);
    addDevContainer(this);
  }
}
