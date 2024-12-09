import { readFileSync, writeFileSync } from "fs";
import { parseSavedView, parseTransformParametersToJson } from "./TransformParametersUtils";
import { ViewModes } from "./models/FilterByViewDefinition";
import { SavedView } from "./models/SavedView";
import path from "path";

function run(): void {
  const savedViewFileName = "savedView.json";
  const outputFileName = "transformParameters.json";
  const viewMode: ViewModes = !!process.argv.find((value) => value === "includeNewContent") ? ViewModes.IncludeNewContent : ViewModes.FilterContent;
  const escapeFlag = !!process.argv.find((value) => value === "escape");

  const savedViewJSON = readFileSync(path.join(__dirname, "../", savedViewFileName), "utf8");
  const savedView: SavedView = JSON.parse(savedViewJSON).savedView;
  const transformParameters = parseSavedView(savedView, viewMode);

  const transformParametersJSON = parseTransformParametersToJson(transformParameters, escapeFlag);

  console.log("\nTRANSFORM PARAMETERS:\n");
  console.log("\x1b[33m%s\x1b[0m\n", transformParametersJSON);
  writeFileSync(outputFileName, transformParametersJSON);
}

run();
