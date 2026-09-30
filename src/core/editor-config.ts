import { IniFile, type Project } from 'projen';
import { sharedMaxLineLength } from './shared-project-defaults';

/**
 * Adds the shared EditorConfig file to a project.
 *
 * @param project - Project that receives `.editorconfig`.
 */
export const addEditorConfig = (project: Project): void => {
  new IniFile(project, '.editorconfig', {
    obj: {
      'root': true,
      '*': {
        end_of_line: 'lf',
        charset: 'utf-8',
      },
      '*.{js,ts}': {
        indent_style: 'space',
        indent_size: 2,
        max_line_length: sharedMaxLineLength,
      },
    },
    marker: true,
  });
};
