/**
 * Static content used only so the interface can be designed and reviewed.
 * Replace this module with a real data layer when logic is added.
 */

import type { FolderSummary, GraphEdge, LinkNode } from "@/lib/types";

export const folders: FolderSummary[] = [
  {
    id: 1,
    name: "Transformer Architectures",
    description:
      "Foundational and follow-up work on attention, scaling behaviour and efficient inference.",
    color: "chart-1",
    linkCount: 4,
    edgeCount: 3,
  },
  {
    id: 2,
    name: "Retrieval Augmented Generation",
    description:
      "How external memory changes grounding, hallucination rates and evaluation design.",
    color: "chart-3",
    linkCount: 0,
    edgeCount: 0,
  },
  {
    id: 3,
    name: "Interface Ergonomics",
    description: null,
    color: "chart-2",
    linkCount: 0,
    edgeCount: 0,
  },
];

export const links: LinkNode[] = [
  {
    id: 11,
    folderId: 1,
    title: "Attention Is All You Need",
    url: "https://arxiv.org/abs/1706.03762",
    description:
      "Introduces the transformer and removes recurrence from sequence transduction entirely.",
    posX: 0,
    posY: 40,
  },
  {
    id: 12,
    folderId: 1,
    title: "Scaling Laws for Neural Language Models",
    url: "https://arxiv.org/abs/2001.08361",
    description:
      "Empirical power-law relationships between loss, compute and data.",
    posX: 300,
    posY: -70,
  },
  {
    id: 13,
    folderId: 1,
    title: "FlashAttention",
    url: "https://arxiv.org/abs/2205.14135",
    description:
      "IO-aware exact attention that reduces memory traffic on GPUs.",
    posX: 300,
    posY: 150,
  },
  {
    id: 14,
    folderId: 1,
    title: "Training Compute-Optimal Language Models",
    url: "https://arxiv.org/abs/2203.15556",
    description: "Revises the compute-optimal token-to-parameter ratio.",
    posX: 610,
    posY: 30,
  },
];

export const edges: GraphEdge[] = [
  {
    id: 101,
    folderId: 1,
    sourceId: 11,
    targetId: 12,
    label: "is measured by",
    reasoning:
      "The scaling laws paper studies the exact architecture proposed here, so its loss curves are only meaningful in the context of the transformer's parameter layout. Reading them together explains why depth and width trade off the way they do, and why the original design choices held up as models grew several orders of magnitude larger.",
    strength: 3,
    evidence: [
      {
        id: 1,
        quote:
          "Performance depends strongly on scale, weakly on model shape — width and depth matter far less than total parameter count.",
        source: "Scaling Laws, Section 1",
      },
      {
        id: 2,
        quote:
          "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.",
        source: "Attention Is All You Need, Abstract",
      },
    ],
  },
  {
    id: 102,
    folderId: 1,
    sourceId: 11,
    targetId: 13,
    label: "is optimised by",
    reasoning:
      "FlashAttention keeps the mathematics of scaled dot-product attention untouched and changes only how the computation moves through memory. It is therefore a direct engineering answer to the quadratic cost introduced by the original formulation.",
    strength: 2,
    evidence: [
      {
        id: 3,
        quote:
          "We compute exact attention with far fewer memory accesses by tiling the computation in on-chip SRAM.",
        source: "FlashAttention, Abstract",
      },
    ],
  },
  {
    id: 103,
    folderId: 1,
    sourceId: 12,
    targetId: 14,
    label: "is corrected by",
    reasoning:
      "Both papers fit the same family of curves but disagree on the optimal allocation of a fixed compute budget. The later result argues the earlier one under-trained its models on tokens, which reverses the practical guidance for anyone sizing a run.",
    strength: 3,
    evidence: [
      {
        id: 4,
        quote:
          "Model size and the number of training tokens should be scaled in equal proportion.",
        source: "Compute-Optimal LMs, Abstract",
      },
    ],
  },
];

export function getFolder(id: number) {
  return folders.find((f) => f.id === id) ?? null;
}

export function getGraph(folderId: number) {
  return {
    nodes: links.filter((l) => l.folderId === folderId),
    edges: edges.filter((e) => e.folderId === folderId),
  };
}
