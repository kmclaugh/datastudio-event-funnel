"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const validate = require("@google/dscc-validation");
const fs_1 = require("fs");
const args_1 = require("../args");
const util_1 = require("../util");
exports.validateBuildValues = (args) => {
  const cssFile = process.env.npm_package_dsccViz_cssFile;
  const jsonFile = process.env.npm_package_dsccViz_jsonFile;
  if (jsonFile === undefined) {
    throw util_1.invalidVizConfig("jsonFile");
  }
  // Require either jsFile or tsFile
  const jsFile = process.env.npm_package_dsccViz_jsFile;
  const tsFile = process.env.npm_package_dsccViz_tsFile;
  if (jsFile === undefined && tsFile === undefined) {
    throw util_1.invalidVizConfig("jsFile");
  }
  const devBucket = process.env.npm_package_dsccViz_gcsDevBucket;
  if (devBucket === undefined) {
    throw util_1.invalidVizConfig("gcsDevBucket");
  }
  const prodBucket = process.env.npm_package_dsccViz_gcsProdBucket;
  if (prodBucket === undefined) {
    throw util_1.invalidVizConfig("gcsProdBucket");
  }
  const devMode =
    args.deployment === args_1.DeploymentChoices.PROD ? false : true;
  const gcsBucket = devMode ? devBucket : prodBucket;
  const manifestFile = "manifest.json";
  const pwd = process.cwd();
  return {
    devBucket,
    prodBucket,
    manifestFile,
    cssFile,
    jsonFile,
    jsFile,
    tsFile,
    devMode,
    pwd,
    gcsBucket,
  };
};
const friendifyError = (error) =>
  `The value at: ${error.dataPath} is invalid. ${error.message}.`;
const unique = (ts) => [...new Set(ts)];
const throwIfErrors = (errors, fileType) => {
  const friendlyErrors = errors.map(friendifyError);
  const uniqueErrors = unique(friendlyErrors);
  if (uniqueErrors.length !== 0) {
    throw new Error(`Invalid ${fileType}: \n${JSON.stringify(uniqueErrors)}`);
  }
};
exports.validateManifestFile = (path) => {
  const fileExists = fs_1.existsSync(path);
  if (!fileExists) {
    throw new Error(`The file: \n${path}\n was not found.`);
  }
  const fileContents = fs_1.readFileSync(path, "utf8");
  let parsedJson;
  try {
    parsedJson = JSON.parse(fileContents);
  } catch (e) {
    throw new Error(`The file:\n ${path}\n could not be parsed as JSON. `);
  }
  throwIfErrors(validate.validateManifest(parsedJson), "manifest");
  return true;
};
exports.validateConfigFile = (path) => {
  const fileExists = fs_1.existsSync(path);
  if (!fileExists) {
    throw new Error(`The file: \n${path}\n was not found.`);
  }
  const fileContents = fs_1.readFileSync(path, "utf8");
  let parsedJson;
  try {
    parsedJson = JSON.parse(fileContents);
  } catch (e) {
    throw new Error(`The file:\n ${path}\n could not be parsed as JSON. `);
  }
  throwIfErrors(validate.validateConfig(parsedJson), "config");
  return true;
};
