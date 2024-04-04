import { Id64Array } from "@itwin/core-bentley";

export interface EmphasizeElementProps {
  neverDrawn?: Id64Array;
  alwaysDrawn?: Id64Array;
  isAlwaysDrawnExclusive?: boolean;
}

export interface EmphasizeElements {
  emphasizeElementsProps?: EmphasizeElementProps;
}
