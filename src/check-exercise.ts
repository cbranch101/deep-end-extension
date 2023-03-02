import { workspace } from "vscode";
import expect from "expect";
const getWorkspaceRoot = () => {
  const { workspaceFolders } = workspace;
  if (!workspaceFolders) {
    return null;
  }
  if (workspaceFolders.length !== 1) {
    return null;
  }
  const [folder] = workspaceFolders;
  return folder.uri.fsPath;
};

const importExerciseRoot = (workspaceRoot: string) => {
  return import(`${workspaceRoot}/dist/main.js`);
};

const checkExercise = () => {
  const workspaceRoot = getWorkspaceRoot();
  if (workspaceRoot) {
    importExerciseRoot(workspaceRoot).then((imported) => {
      const { addNum } = imported;
      expect(addNum(2, 3)).toEqual(4);
    });
  }
};

export default checkExercise;
