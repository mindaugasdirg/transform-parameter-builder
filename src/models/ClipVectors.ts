export interface ClipPlaneProps {
  normal?: [x: number, y: number, z: number];
  distance?: number;
  invisible?: boolean;
  interior?: boolean;
}

/**
   * Contains the set of clip planes used to clip the view
   */
export interface PlanesProps {
  clips: ClipPlaneProps[][];
  invisible?: boolean;
}
/**
   * Contains the shape/polygon used to clip the view
   */
export interface ShapeProps {
  points: [px: number, py: number, pz: number][];
  transform: [
    [qx: number, qy: number, qz: number, ax: number],
    [qx: number, qy: number, qz: number, ax: number],
    [qx: number, qy: number, qz: number, ax: number]
  ];
  zLow?: number;
  zHigh?: number;
  mask?: boolean;
  invisible?: boolean;
}

/**
   * A clip primitive made of a set planes
   */
export interface NewClipPrimitivePlaneProps {
  planes: PlanesProps;
}

/**
   * A clip primitive made of a shape
   */
export interface NewClipPrimitiveShapeProps {
  shape: ShapeProps;
}
