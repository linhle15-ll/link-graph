"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import type { Session } from "@/lib/types";

export const SESSIONS_QUERY_KEY = ["sessions"] as const;

export function useSessions() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: api.getSessions,
    refetchOnWindowFocus: true,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { title: string; description: string | null }) =>
      api.createSession(input),
    onSuccess: ({ session }) => {
      queryClient.setQueryData<{ sessions: Session[] }>(
        SESSIONS_QUERY_KEY,
        (old) =>
          old
            ? { sessions: [session, ...old.sessions] }
            : { sessions: [session] },
      );
      toast.success("Session created");
    },
    onError: (error) => {
      toast.error("Could not create session", { description: error.message });
    },
  });
}
