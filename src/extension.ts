import { commands, ExtensionContext, workspace, Uri } from "vscode";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";
import { transform } from "@babel/core";
import { Parcel, createWorkerFarm } from "@parcel/core";
import { MemoryFS } from "@parcel/fs";
import requireFromString from "require-from-string";
import expect from "expect";

const workerFarm = createWorkerFarm({ backend: "process" });
const outputFS = new MemoryFS(workerFarm);

const getFile = (uri: Uri) => {
  const source = workspace.fs.readFile(uri).then((value) => value.toString());
};

const importDirectory = async (path: string) => {
  const importedStuff = await import(path);
  console.log(importedStuff);
};

const getExerciseDocument = (fileName: string) =>
  workspace.textDocuments.find((document) => {
    console.log(document.fileName);
    return document.fileName.endsWith(fileName);
  });

const getExerciseDocumentSourceWithBabel = (root: string) => {
  const document = getExerciseDocument("exercise.js");
  if (document) {
    const options = {
      cwd: root,
      presets: ["@babel/preset-env"],
    };
    const source = workspace.fs.readFile(document.uri).then((stream) => stream.toString());
    source.then((contents) => {
      transform(contents, options, (error, result) => {
        if (error) {
          console.log(error);
        }
        if (result) {
          if (result.code) {
            const stuff = requireFromString(result.code);
            console.log(stuff.foo());
          }
        }
      });
    });
  }
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

const getSourceUsingParcel = (root: string) => {
  const document = getExerciseDocument("exercise.js");
  if (document) {
    let bundler = new Parcel({
      entries: document.uri.fsPath,
      defaultConfig: `${root}/node_modules/@parcel/config-default/index.json`,
      workerFarm,
      outputFS,
    });
    bundler
      .run()
      .then(({ bundleGraph }) => {
        bundleGraph.getBundles().map((bundle) => {
          outputFS.readFile(bundle.filePath, "utf8").then((stuff) => {
            const { foo } = requireFromString(stuff);
            console.log(foo());
          });
        });
      })
      .catch((e) => {
        throw e;
      });
  }
};

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
export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
    HelloWorldPanel.render(context.extensionUri);
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
}
