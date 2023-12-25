import fs from "node:fs";

export const readFile = (fileName: string) => {
  const data = fs.readFileSync(fileName, "utf-8");
  return JSON.parse(data);
};
