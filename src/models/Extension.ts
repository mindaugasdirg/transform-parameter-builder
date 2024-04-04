export const EXTENSION_NAMES = {
  emphasizedElements: "EmphasizeElements",
} as const;

export interface Extension {
  extensionName: string;
  markdownUrl: string;
  schemaUrl: string;
  data: string;
}
