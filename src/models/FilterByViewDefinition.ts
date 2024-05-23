import { Id64Array } from "@itwin/core-bentley";
import { ClipData, PerModelCategoryData } from "./LegacyView";
import { SubCategoryOverrideData } from "./ITwin3dView";

export enum ViewModes {
  IncludeNewContent = "IncludeNewContent",
  FilterContent = "FilterContent"
}

export interface TransformParameters {
  categories: Id64Array;
  hiddenCategories?: Id64Array;
  models: Id64Array;
  hiddenModels?: Id64Array;
  alwaysDrawn?: Id64Array;
  neverDrawn?: Id64Array;
  isAlwaysDrawnExclusive?: boolean;
  subCategoryOvr?: SubCategoryOverrideData[];
  clip?: ClipData;
  perModelCategoryVisibility?: PerModelCategoryData[];
  viewMode?: ViewModes;
}
