"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { GraphResponse } from "@/lib/types";

export const graphQueryKey = (sessionId: number) =>
  ["graph", sessionId] as const;

/**
 * The Chrome extension pushes links from outside the app, so the graph
 * polls: nodes appear here after the ingestion pipeline finishes.
 */
export function useGraph(sessionId: number) {
  return useQuery({
    queryKey: graphQueryKey(sessionId),
    queryFn: () => api.getGraph(sessionId),
    refetchInterval: 10_000,
    refetchOnWindowFocus: true,
    enabled: Number.isFinite(sessionId),
  });
}

export function useAddLink(sessionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => api.addLink(sessionId, url),
    onSuccess: ({ node }) => {
      queryClient.setQueryData<GraphResponse>(
        graphQueryKey(sessionId),
        (old) => (old ? { ...old, nodes: [...old.nodes, node] } : old),
      );
      toast.success("Link submitted", {
        description: "It will appear once ingestion finishes.",
      });
    },
    onError: (error) => {
      toast.error("Could not submit link", { description: error.message });
    },
  });
}

export function useDeleteEdge(sessionId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (edgeId: number) => api.deleteEdge(sessionId, edgeId),
    onSuccess: (_, edgeId) => {
      queryClient.setQueryData<GraphResponse>(
        graphQueryKey(sessionId),
        (old) =>
          old
            ? { ...old, edges: old.edges.filter((e) => e.id !== edgeId) }
            : old,
      );
      toast.success("Connection removed");
    },
    onError: (error) => {
      toast.error("Could not remove connection", {
        description: error.message,
      });
    },
  });
}
