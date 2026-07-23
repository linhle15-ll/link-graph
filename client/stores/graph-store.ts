import { create } from "zustand";

/**
 * Client-side interaction state for the session graph page.
 * Server data (nodes/edges) lives in the TanStack Query cache.
 */
interface GraphState {
  selectedNodeId: number | null;
  /** Node ids unchecked in the Sources sidebar (hidden from the graph). */
  hiddenNodeIds: Set<number>;
  sidebarOpen: boolean;
  summaryOpen: boolean;

  selectNode: (id: number | null) => void;
  toggleNodeHidden: (id: number) => void;
  setAllHidden: (ids: number[], hidden: boolean) => void;
  toggleSidebar: () => void;
  toggleSummary: () => void;
  reset: () => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  selectedNodeId: null,
  hiddenNodeIds: new Set<number>(),
  sidebarOpen: true,
  summaryOpen: true,

  selectNode: (id) => set({ selectedNodeId: id }),
  toggleNodeHidden: (id) =>
    set((s) => {
      const next = new Set(s.hiddenNodeIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return { hiddenNodeIds: next };
    }),
  setAllHidden: (ids, hidden) =>
    set(() => ({ hiddenNodeIds: hidden ? new Set(ids) : new Set<number>() })),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  toggleSummary: () => set((s) => ({ summaryOpen: !s.summaryOpen })),
  reset: () => set({ selectedNodeId: null, hiddenNodeIds: new Set<number>() }),
}));
