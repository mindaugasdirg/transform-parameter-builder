import { ClipPrimitivePlanesProps, ClipPrimitiveShapeProps, ClipVectorProps } from "@itwin/core-geometry";
import { ClipData, LegacyView, PerModelCategoryExtension, PlaneClip, PlaneClipSet, PlaneProps, ShapeProps, UnionOfPlaneClipSets } from "./models/LegacyView";
import { TransformParameters, ViewModes } from "./models/FilterByViewDefinition";
import { CompressedId64Set, Id64Array } from "@itwin/core-bentley";
import { SubCategoryOverrideData } from "./models/ITwin3dView";
import { SavedView } from "./models/SavedView";
import {
  ClipPlaneProps as NewClipPlaneProps,
  NewClipPrimitivePlaneProps,
  NewClipPrimitiveShapeProps,
  PlanesProps as NewPlaneProps,
  ShapeProps as NewShapeProps,
} from "./models/ClipVectors";
import { EmphasizeElements } from "./models/EmphasizeElements";
import { EXTENSION_NAMES } from "./models/Extension";

export function parseSavedView(savedView: SavedView, viewMode: ViewModes): TransformParameters {
  return {
    categories: getListFromListOrCompressedId64Set(savedView.savedViewData.itwin3dView.categories?.enabled) ?? [],
    models: getListFromListOrCompressedId64Set(savedView.savedViewData.itwin3dView.models?.enabled) ?? [],
    neverDrawn: getNeverDrawnSavedView(savedView),
    alwaysDrawn: getAlwaysDrawnSavedView(savedView),
    isAlwaysDrawnExclusive: getIsAlwaysDrawnExclusive(savedView),
    subCategoryOvr: savedView.savedViewData.itwin3dView.displayStyle?.subCategoryOverrides,
    clip: tryGetClipData(savedView.savedViewData.itwin3dView.clipVectors),
    perModelCategoryVisibility: getExtensionValue<PerModelCategoryExtension>(savedView.extensions, "PerModelCategoryVisibility")?.perModelCategoryVisibilityProps ?? [],
    hiddenCategories: getListFromListOrCompressedId64Set(savedView.savedViewData.itwin3dView.categories?.disabled),
    hiddenModels: getListFromListOrCompressedId64Set(savedView.savedViewData.itwin3dView.models?.disabled),
    viewMode,
  };
}

export function parseLegacySavedView(legacyViewDefinition: LegacyView, viewMode: ViewModes): TransformParameters {
  return {
    categories: getListFromListOrCompressedId64Set(legacyViewDefinition.categorySelectorProps.categories) ?? [],
    models: getListFromListOrCompressedId64Set(legacyViewDefinition.modelSelectorProps?.models) ?? [],
    neverDrawn: legacyViewDefinition.emphasizeElementsProps?.neverDrawn,
    alwaysDrawn: legacyViewDefinition.emphasizeElementsProps?.alwaysDrawn,
    isAlwaysDrawnExclusive: legacyViewDefinition.emphasizeElementsProps?.isAlwaysDrawnExclusive,
    subCategoryOvr: legacyViewDefinition.displayStyleProps.jsonProperties?.styles?.subCategoryOvr as SubCategoryOverrideData[],
    clip: tryGetClipDataForLegacyView(legacyViewDefinition.viewDefinitionProps.jsonProperties?.viewDetails?.clip),
    perModelCategoryVisibility: legacyViewDefinition.perModelCategoryVisibility,
    hiddenCategories: getListFromListOrCompressedId64Set(legacyViewDefinition.hiddenCategories),
    hiddenModels: getListFromListOrCompressedId64Set(legacyViewDefinition.hiddenModels),
    viewMode,
  };
}

function getListFromListOrCompressedId64Set(ids?: string | Id64Array) {
  if (ids === undefined) {
    return undefined;
  }

  if (typeof ids === "string") {
    return CompressedId64Set.decompressArray(ids);
  }

  return ids;
}

function getExtensionValue<R>(extensions: { extensionName: string, data: string }[], extensionName: string): R | undefined {
  const data = extensions.find((x: { extensionName: string }) => x.extensionName === extensionName)?.data;

  return data ? JSON.parse(data) : undefined;
}

function getAlwaysDrawnSavedView(savedView: SavedView): Id64Array | undefined {
  return getExtensionValue<EmphasizeElements>(savedView.extensions, EXTENSION_NAMES.emphasizedElements)?.emphasizeElementsProps?.alwaysDrawn;
}

function getIsAlwaysDrawnExclusive(savedView: SavedView): boolean | undefined {
  return getExtensionValue<EmphasizeElements>(savedView.extensions, EXTENSION_NAMES.emphasizedElements)?.emphasizeElementsProps?.isAlwaysDrawnExclusive;
}

function getNeverDrawnSavedView(savedView: SavedView): Id64Array | undefined {
  return getExtensionValue<EmphasizeElements>(savedView.extensions, EXTENSION_NAMES.emphasizedElements)?.emphasizeElementsProps?.neverDrawn;
}

export function parseTransformParametersToJson(transformParameters: TransformParameters, includeEscapeCharacters?: boolean): string {
  const params = JSON.stringify(transformParameters);
  if (!includeEscapeCharacters)
    return params;

  return params.replace(/"/g, '\\"');
}

function tryGetClipDataForLegacyView(clipVectors: ClipVectorProps | undefined): ClipData | undefined {
  if (!clipVectors || !clipVectors.length)
    return undefined;

  const clipPlanes: PlaneProps[] = clipVectors
    .filter((primitive) => isPlanePrimitive(primitive))
    .map((primitive) => (primitive as ClipPrimitivePlanesProps).planes! as PlaneProps);

  const clipShapes: ShapeProps[] = clipVectors
    .filter((primitive) => isShapePrimitive(primitive))
    .map((primitive) => (primitive as ClipPrimitiveShapeProps).shape! as ShapeProps);

  return {
    shapes: clipShapes.length > 0 ? clipShapes : undefined,
    planes: clipPlanes.length > 0 ? clipPlanes : undefined,
  };
}

function tryGetClipData(_clipVectors: Array<NewClipPrimitivePlaneProps | NewClipPrimitiveShapeProps> | undefined): ClipData | undefined {
  if (!_clipVectors || !_clipVectors.length)
    return undefined;

  const clipPlanes: PlaneProps[] = _clipVectors
    .filter((primitive) => isPlanePrimitive(primitive))
    .map((primitive) => (primitive as NewClipPrimitivePlaneProps).planes )
    .map((primitive) => changeNewPlanePropsToPlaneProps(primitive));

  const clipShapes: ShapeProps[] = _clipVectors
    .filter((primitive) => isShapePrimitive(primitive))
    .map((primitive) => (primitive as NewClipPrimitiveShapeProps).shape )
    .map((primitive) => changeNewShapePropsToShapeProps(primitive));

  return {
    shapes: clipShapes.length > 0 ? clipShapes : [],
    planes: clipPlanes.length > 0 ? clipPlanes : [],
  };
}

function isPlanePrimitive(primitive: any): primitive is ClipPrimitivePlanesProps {
  return "planes" in primitive;
}

function isShapePrimitive(primitive: any): primitive is ClipPrimitiveShapeProps {
  return "shape" in primitive;
}

function changeNewShapePropsToShapeProps(primitive: NewShapeProps): ShapeProps {
  return {
    points: primitive.points,
    trans: primitive.transform,
    zlow: primitive.zLow,
    zhigh: primitive.zHigh,
    mask: primitive.mask,
    invisible: primitive.invisible,
  };
}

function changeNewPlanePropsToPlaneProps(primitive: NewPlaneProps): PlaneProps {
  return {
    clips: getClipPlaneProps(primitive.clips),
    invisible: primitive.invisible,
  };
}

function getClipPlaneProps(clips: NewClipPlaneProps[][]): UnionOfPlaneClipSets {
  const planeClipSet: PlaneClipSet[] = [];
  clips.forEach((element) => {
    const planeClip: PlaneClip[] = [];
    element.forEach((clip) => {
      planeClip.push({
        normal: clip.normal,
        dist: clip.distance,
        invisible: clip.invisible,
        interior: clip.interior,
      });
    });
    planeClipSet.push(planeClip);
  });
  return planeClipSet;
}
