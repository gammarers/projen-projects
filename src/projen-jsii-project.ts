import { cdk } from 'projen';
import { addDevContainer } from './core/devcontainer';
import { addEditorConfig } from './core/editor-config';
import { addEslintConfig } from './core/eslint-config';
import { createSharedTypeScriptProjectDefaults, sharedAuthor } from './core/shared-project-defaults';

/**
 * Options for {@link ProjenJsiiProject}.
 *
 * Extends {@link cdk.JsiiProjectOptions} while requiring
 * `name` and `repositoryUrl`.
 * Projen's `repository` option is omitted: jsii derives it from `repositoryUrl`,
 * and passing `repository` would override that derived value.
 */
export interface ProjenJsiiProjectOptions extends Partial<
  Omit<cdk.JsiiProjectOptions, 'name' | 'repositoryUrl' | 'repository'>
> {
  /**
   * The name of the package.
   */
  readonly name: string;

  /**
   * Git repository URL.
   */
  readonly repositoryUrl: string;
}

/**
 * A projen project type for multi-language jsii libraries with shared defaults
 * such as author, Node versions, GitHub app credentials, EditorConfig, ESLint, and a Dev Container.
 */
export class ProjenJsiiProject extends cdk.JsiiProject {

  /**
   * Creates a new jsii project with opinionated defaults.
   *
   * @param options - Project options. Required fields are `name` and `repositoryUrl`.
   */
  constructor(options: ProjenJsiiProjectOptions) {
    super({
      ...createSharedTypeScriptProjectDefaults(),
      author: sharedAuthor.name,
      authorAddress: sharedAuthor.email,
      jsiiVersion: '6.0.x',
      ...options,
      devContainer: false,
    });

    addEditorConfig(this);
    addEslintConfig(this);
    addDevContainer(this);
  }
}
