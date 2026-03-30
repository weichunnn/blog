import { execSync } from "child_process";

export function getChangedFiles(extension: string) {
  const extensionFilter = extension ? `-- '*.${extension}'` : "";

  // Use '--name-status' to get the status of each file
  const command = `git diff HEAD^ HEAD --name-status ${extensionFilter}`;
  const diffOutput = execSync(command).toString();

  const allChanges: string[] = [];
  const deletes: string[] = [];

  diffOutput
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      const [status, filename] = line.split("\t");
      if (status === "D") deletes.push(filename);
      else allChanges.push(filename);
    });
  return { allChanges, deletes };
}
