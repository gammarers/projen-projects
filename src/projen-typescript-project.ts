import { typescript } from 'projen';
import { addDevContainer } from './core/devcontainer';
import { addEditorConfig } from './core/editor-config';
import { createSharedTypeScriptProjectDefaults, sharedAuthor } from './core/shared-project-defaults';

/**
 * Options for {@link ProjenTypeScriptProject}.
 *
 * Extends {@link typescript.TypeScriptProjectOptions} while requiring
 * `name` and `repositoryUrl`. Projen's `repository` option is omitted;
 * `repositoryUrl` is mapped to it.
 */
export interface ProjenTypeScriptProjectOptions extends Partial<
  Omit<typescript.TypeScriptProjectOptions, 'name' | 'repository'>
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
 * A projen project type for TypeScript packages with shared defaults
 * such as author, Node versions, GitHub app credentials, EditorConfig, and a Dev Container.
 */
export class ProjenTypeScriptProject extends typescript.TypeScriptProject {

  /**
   * Creates a new TypeScript project with opinionated defaults.
   *
   * @param options - Project options. Required fields are `name` and `repositoryUrl`.
   */
  constructor(options: ProjenTypeScriptProjectOptions) {
    const { repositoryUrl, ...rest } = options;

    super({
      ...createSharedTypeScriptProjectDefaults(),
      authorName: sharedAuthor.name,
      authorEmail: sharedAuthor.email,
      ...rest,
      repository: repositoryUrl,
      devContainer: false,
    });

    addEditorConfig(this);
    addDevContainer(this);
  }
}
