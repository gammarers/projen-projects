import { typescript } from 'projen';
import { sharedMaxLineLength } from './shared-project-defaults';

/**
 * Adds the shared ESLint rules to a project.
 *
 * Line length matches {@link sharedMaxLineLength}.
 * When ESLint is disabled, the project is left unchanged.
 *
 * @param project - TypeScript project that receives the rules.
 */
export const addEslintConfig = (project: typescript.TypeScriptProject): void => {
  project.eslint?.addRules({
    'max-len': ['error', {
      code: sharedMaxLineLength,
      ignoreUrls: true,
      ignoreStrings: true,
    }],
  });
};
