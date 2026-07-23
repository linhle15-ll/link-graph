import type { GraphResponse, GraphNode, Session } from "@/lib/types";

/**
 * Development fixture. Used when NEXT_PUBLIC_USE_MOCK=true so the
 * frontend can be built and demoed before the server routes exist.
 */

const now = new Date().toISOString();

export const mockSessions: Session[] = [
  {
    id: 1,
    title: "Greenery & wellbeing",
    description: "Sources on the effects of green space on mental health.",
    createdAt: now,
    nodeCount: 3,
  },
  {
    id: 2,
    title: "Transformer lineage",
    description: "How the core architecture papers relate.",
    createdAt: now,
    nodeCount: 5,
  },
  {
    id: 3,
    title: "Thesis chapter 2",
    description: null,
    createdAt: now,
    nodeCount: 0,
  },
  {
    id: 4,
    title: "Causal inference reading",
    description: "description if provided",
    createdAt: now,
    nodeCount: 0,
  },
  {
    id: 5,
    title: "Lit review — RAG",
    description: null,
    createdAt: now,
    nodeCount: 0,
  },
];

const graphs = new Map<number, GraphResponse>([
  [
    1,
    {
      nodes: [
        {
          id: 1,
          title: "CHI paper",
          link: "https://dl.acm.org/doi/10.1145/example",
          contentSummary:
            "A CHI study measuring the effects of greenery exposure on reported stress and focus in office workers, finding significant improvements in both.",
          text: null,
          tags: ["greenery", "hci"],
          author: "Chen et al.",
          site: "dl.acm.org",
          createdAt: now,
          knowledgeFileId: 1,
        },
        {
          id: 2,
          title: "wikipedia",
          link: "https://en.wikipedia.org/wiki/Causal_inference",
          contentSummary:
            "Overview of causal inference: methods for determining cause-and-effect relationships from data, including randomized experiments and observational designs.",
          text: null,
          tags: ["causal"],
          author: "Wikipedia",
          site: "wikipedia.org",
          createdAt: now,
          knowledgeFileId: 2,
        },
        {
          id: 3,
          title: "sth else",
          link: "https://example.org/green-cities",
          contentSummary:
            "Argues city-level greenery investments show weaker wellbeing effects than lab studies suggest, attributing earlier results to selection bias.",
          text: null,
          tags: ["greenery", "urban"],
          author: "Rivera",
          site: "example.org",
          createdAt: now,
          knowledgeFileId: 3,
        },
      ],
      edges: [
        {
          id: 1,
          score: 0.91,
          reason: "Both link greenery exposure to wellbeing outcomes",
          tags: ["agrees"],
          createdAt: now,
          knowledgeFileId: 1,
          nodeIds: [1, 3],
        },
        {
          id: 2,
          score: 0.84,
          reason:
            "The CHI study's causal claims conflict with the article's methodology critique",
          tags: ["disagrees"],
          createdAt: now,
          knowledgeFileId: 2,
          nodeIds: [1, 2],
        },
      ],
    },
  ],
  [
    2,
    {
      nodes: [
        {
          id: 11,
          title: "Attention Is All You Need",
          link: "https://arxiv.org/abs/1706.03762",
          contentSummary:
            "Introduces the Transformer, replacing recurrence with self-attention.",
          text: null,
          tags: ["transformers"],
          author: "Vaswani et al.",
          site: "arxiv.org",
          createdAt: now,
          knowledgeFileId: 11,
        },
        {
          id: 12,
          title: "BERT",
          link: "https://arxiv.org/abs/1810.04805",
          contentSummary:
            "Masked-language-model pre-training on the Transformer encoder.",
          text: null,
          tags: ["pretraining"],
          author: "Devlin et al.",
          site: "arxiv.org",
          createdAt: now,
          knowledgeFileId: 12,
        },
        {
          id: 13,
          title: "GPT-3",
          link: "https://arxiv.org/abs/2005.14165",
          contentSummary:
            "Scaling autoregressive Transformers yields few-shot learners.",
          text: null,
          tags: ["scaling"],
          author: "Brown et al.",
          site: "arxiv.org",
          createdAt: now,
          knowledgeFileId: 13,
        },
        {
          id: 14,
          title: "Chinchilla",
          link: "https://arxiv.org/abs/2203.15556",
          contentSummary:
            "Compute-optimal training: smaller models, more tokens.",
          text: null,
          tags: ["scaling"],
          author: "Hoffmann et al.",
          site: "arxiv.org",
          createdAt: now,
          knowledgeFileId: 14,
        },
        {
          id: 15,
          title: "RAG",
          link: "https://arxiv.org/abs/2005.11401",
          contentSummary:
            "Retrieval-augmented generation for knowledge-intensive tasks.",
          text: null,
          tags: ["retrieval"],
          author: "Lewis et al.",
          site: "arxiv.org",
          createdAt: now,
          knowledgeFileId: 15,
        },
      ],
      edges: [
        {
          id: 11,
          score: 0.95,
          reason: "BERT builds on the Transformer encoder",
          tags: ["agrees"],
          createdAt: now,
          knowledgeFileId: 11,
          nodeIds: [11, 12],
        },
        {
          id: 12,
          score: 0.9,
          reason: "GPT-3 scales the Transformer decoder",
          tags: ["agrees"],
          createdAt: now,
          knowledgeFileId: 12,
          nodeIds: [11, 13],
        },
        {
          id: 13,
          score: 0.82,
          reason: "Chinchilla revisits GPT-3 scaling assumptions",
          tags: ["disagrees"],
          createdAt: now,
          knowledgeFileId: 13,
          nodeIds: [13, 14],
        },
        {
          id: 14,
          score: 0.66,
          reason: "RAG addresses factuality limits of pure LMs",
          tags: ["agrees"],
          createdAt: now,
          knowledgeFileId: 14,
          nodeIds: [13, 15],
        },
      ],
    },
  ],
]);

let nextMockId = 100;

export function mockGetGraph(sessionId: number): GraphResponse {
  const graph = graphs.get(sessionId);
  if (graph) return graph;
  const empty: GraphResponse = { nodes: [], edges: [] };
  graphs.set(sessionId, empty);
  return empty;
}

export function mockCreateSession(
  title: string,
  description: string | null,
): Session {
  const session: Session = {
    id: nextMockId++,
    title,
    description,
    createdAt: new Date().toISOString(),
    nodeCount: 0,
  };
  mockSessions.unshift(session);
  return session;
}

/** Simulates POST /api/sessions/:id/links in mock mode. */
export function mockAddLink(sessionId: number, url: string): GraphNode {
  const id = nextMockId++;
  let site = "unknown";
  try {
    site = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // keep fallback
  }
  const node: GraphNode = {
    id,
    title: site,
    link: url,
    contentSummary:
      "Extraction pending — the ingestion service will fill this in.",
    text: null,
    tags: [],
    author: "Unknown",
    site,
    createdAt: new Date().toISOString(),
    knowledgeFileId: id,
  };
  mockGetGraph(sessionId).nodes.push(node);
  const session = mockSessions.find((s) => s.id === sessionId);
  if (session) session.nodeCount += 1;
  return node;
}

export function mockDeleteEdge(sessionId: number, edgeId: number): void {
  const graph = mockGetGraph(sessionId);
  const i = graph.edges.findIndex((e) => e.id === edgeId);
  if (i !== -1) graph.edges.splice(i, 1);
}
