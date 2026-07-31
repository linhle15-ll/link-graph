/** UI-level data shapes. A real data layer can implement these later. */

export type Folder = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
};

export type FolderSummary = Folder & {
  linkCount: number;
  edgeCount: number;
};

export type LinkNode = {
  id: number;
  folderId: number;
  title: string;
  url: string;
  description: string | null;
  posX: number;
  posY: number;
};

/** A supporting quote or excerpt that justifies an edge. */
export type EdgeEvidence = {
  id: number;
  quote: string;
  /** Where the quote came from, e.g. "Section 3.2" or a source title. */
  source: string | null;
};

export type GraphEdge = {
  id: number;
  folderId: number;
  sourceId: number;
  targetId: number;
  /** Short relationship label rendered on the edge, e.g. "builds on". */
  label: string | null;
  /** Long-form explanation of why the two sources are connected. */
  reasoning: string | null;
  /** 1 = loosely related, 2 = related, 3 = strongly related. */
  strength: number;
  evidence: EdgeEvidence[];
};

export const EDGE_STRENGTHS = [
  { value: "1", label: "Loosely related" },
  { value: "2", label: "Related" },
  { value: "3", label: "Strongly related" },
] as const;
