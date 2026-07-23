import type {
  AddLinkResponse,
  AuthResponse,
  GraphResponse,
  Session,
  User,
} from "@/lib/types";
import {
  mockAddLink,
  mockCreateSession,
  mockDeleteEdge,
  mockGetGraph,
  mockSessions,
} from "@/lib/mock-graph";

/**
 * REST client for the Express server.
 *
 * Base URL comes from NEXT_PUBLIC_API_URL:
 *   - docker-compose: http://localhost:5001/api
 *   - local server:   http://localhost:<PORT>/api
 *
 * Set NEXT_PUBLIC_USE_MOCK=true to run the UI against an in-memory
 * fixture while the server routes are still being built.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} on ${path}${body ? `: ${body}` : ""}`);
  }
  return res.json() as Promise<T>;
}

const mockUser: User = {
  id: 1,
  name: "Researcher",
  email: "you@example.com",
  createdAt: new Date().toISOString(),
};

export const api = {
  // ---- auth -------------------------------------------------------------

  /** Create an account. Real backend should set an httpOnly session cookie. */
  async signup(input: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (USE_MOCK) {
      return { user: { ...mockUser, name: input.name, email: input.email } };
    }
    return request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /** Sign in. Real backend should set an httpOnly session cookie. */
  async login(input: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    if (USE_MOCK) {
      return {
        user: {
          ...mockUser,
          name: input.email.split("@")[0] ?? "Researcher",
          email: input.email,
        },
      };
    }
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  /** Where the backend's Google OAuth flow starts. */
  googleAuthUrl(): string {
    return `${BASE_URL}/auth/google`;
  },

  /** Clear the session. */
  async logout(): Promise<void> {
    if (USE_MOCK) return;
    await request<unknown>("/auth/logout", { method: "POST" });
  },

  /** Update profile (User Center page). */
  async updateUser(input: {
    name: string;
    email: string;
    password?: string;
  }): Promise<AuthResponse> {
    if (USE_MOCK) {
      return { user: { ...mockUser, name: input.name, email: input.email } };
    }
    return request<AuthResponse>("/auth/me", {
      method: "PATCH",
      body: JSON.stringify(input),
    });
  },

  // ---- sessions ----------------------------------------------------------

  /** All knowledge sessions for the signed-in user. */
  async getSessions(): Promise<{ sessions: Session[] }> {
    if (USE_MOCK) return { sessions: structuredClone(mockSessions) };
    return request<{ sessions: Session[] }>("/sessions");
  },

  /** Create a knowledge session. */
  async createSession(input: {
    title: string;
    description: string | null;
  }): Promise<{ session: Session }> {
    if (USE_MOCK) {
      return { session: mockCreateSession(input.title, input.description) };
    }
    return request<{ session: Session }>("/sessions", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },

  // ---- graph -------------------------------------------------------------

  /** Graph for one session: nodes + edges (with connected nodeIds). */
  async getGraph(sessionId: number): Promise<GraphResponse> {
    if (USE_MOCK) return structuredClone(mockGetGraph(sessionId));
    return request<GraphResponse>(`/sessions/${sessionId}/graph`);
  },

  /** Submit a link for ingestion (same endpoint the Chrome extension calls). */
  async addLink(sessionId: number, url: string): Promise<AddLinkResponse> {
    if (USE_MOCK) return { node: mockAddLink(sessionId, url) };
    return request<AddLinkResponse>(`/sessions/${sessionId}/links`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  },

  /** Remove an edge the NLP service got wrong. */
  async deleteEdge(sessionId: number, edgeId: number): Promise<void> {
    if (USE_MOCK) {
      mockDeleteEdge(sessionId, edgeId);
      return;
    }
    await request<unknown>(`/edges/${edgeId}`, { method: "DELETE" });
  },
};
