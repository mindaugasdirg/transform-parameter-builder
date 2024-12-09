import { Id64Array, Id64String } from "@itwin/core-bentley";
import { EmphasizeElementsProps, ViewStateProps } from "@itwin/core-common";
import { ViewModes } from "./FilterByViewDefinition";

export interface ShapeProps {
  // Array of number arrays describing the polygon. Each low level array contains numbers corresponding to coordinates [x, y, z].
  points?: Array<[number, number, number]>;
  // Array of number arrays describing the transform applied to the polygon. Each low level array contains 4 numbers of a transform row [qx, qy, qz, ax].
  trans?: Array<[number, number, number, number]>;
  // Lower bound on Z.
  zlow?: number;
  // Upper bound on Z.
  zhigh?: number;
  // `true` if this shape is a mask.
  mask?: boolean;
  // `true` if this shape is invisible.
  invisible?: boolean;
}

export interface PlaneClip {
  // The plane's inward normal as a number array corresponding to coordinates [x, y ,z].
  normal?: [number, number, number];
  // The plane's distance from the origin.
  dist?: number;
  invisible?: boolean;
  interior?: boolean;
}

export interface ClipData {
  shapes?: ShapeProps[];
  planes?: PlaneProps[];
}
export type PlaneClipSet = PlaneClip[];

export type UnionOfPlaneClipSets = PlaneClipSet[];

export interface PlaneProps {
  invisible?: boolean;
  clips?: UnionOfPlaneClipSets;
}

export interface PerModelCategoryExtension {
  perModelCategoryVisibilityProps: PerModelCategoryData[];
}

export interface PerModelCategoryData {
  modelId: Id64String;
  categoryId: Id64String;
  visible: boolean;
}

export interface LegacyView extends ViewStateProps {
  perModelCategoryVisibility?: PerModelCategoryData[];
  emphasizeElementsProps?: EmphasizeElementsProps;
  hiddenModels: Id64Array;
  hiddenCategories: Id64Array;
  viewMode: ViewModes;
}

