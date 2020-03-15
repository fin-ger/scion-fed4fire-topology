"use strict";

const { generateImportMapForProjectPackage } = require("@jsenv/node-module-import-map");
const { resolve, dirname } = require("path");
const fs = require("fs");

const IMPORT_MAP_FILE = resolve(__dirname, "..", "importmap.json");

async function main() {
  await generateImportMapForProjectPackage({
    projectDirectoryUrl: resolve(__dirname, '..'),
    includeDevDependencies: false,
    importMapFile: true,
    importMapFileRelativeUrl: IMPORT_MAP_FILE,
  });
  
  const importmap = JSON.parse(fs.readFileSync(IMPORT_MAP_FILE));
  
  function expandPaths(paths, result) {
    for (let path in paths) {
      result[path] = paths[path];
      result[path + "/"] = dirname(paths[path]) + "/";
    }
  }
  
  let imports = {};
  expandPaths(importmap.imports, imports);
  
  for (let module in importmap.scopes) {
    expandPaths(importmap.scopes[module], imports);
  }
  
  fs.writeFileSync(IMPORT_MAP_FILE, JSON.stringify({
    imports: imports,
  }, null, 2));
}

main();

