/*eslint-env node*/

"use strict";

var findGlobalPackages = require("find-global-packages");
var path = require("path");

function uniq(arr) {
  return arr.reduce(function (result, item) {
    if (result.indexOf(item) === -1) {
      result.push(item);
    }
    return result;
  }, []);
}

findGlobalPackages(function(err, dirs) {
  if (err) {
    return console.error(err.stack ? err.stack : err.toString());
  }
  // get all currently defined NODE_PATHs
  var nodePaths = process.env.NODE_PATH ? process.env.NODE_PATH.split(path.delimiter) : [];
  // globalNodePaths will be a list of strings representing paths to globally available node_modules directories
  var globalNodePaths = uniq(dirs.map(function (dir) {
    return path.resolve(dir, "..");
  }));
  // merge them together
  nodePaths = uniq(nodePaths.concat(globalNodePaths));
  // expose them back to NODE_PATH env var
  process.env.NODE_PATH = nodePaths.join(path.delimiter);
  // refresh paths for node
  require("module").Module._initPaths();
});
