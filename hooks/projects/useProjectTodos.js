import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const getHeaders = (userId) => ({ userId });
const KEY = (pid) => ["todos", pid];

/* ── Fetch todos ─────────────────────────────── */
export function useProjectTodos(projectId) {
  return useQuery({
    queryKey: KEY(projectId),
    queryFn: () =>
      axios.get(`/api/projects/${projectId}/todos`).then((r) => r.data),
    enabled: !!projectId,
    staleTime: 0,
  });
}

/* ── Add todo ────────────────────────────────── */
export function useAddTodo(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ text, status, userId }) =>
      axios
        .post(
          `/api/projects/${projectId}/todos`,
          { text, status },
          { headers: getHeaders(userId) }
        )
        .then((r) => r.data),

    // Optimistic: append immediately
    onMutate: async ({ text, status }) => {
      await qc.cancelQueries({ queryKey: KEY(projectId) });
      const prev = qc.getQueryData(KEY(projectId)) ?? [];
      const optimistic = { _id: `tmp-${Date.now()}`, text, status, order: prev.length };
      qc.setQueryData(KEY(projectId), [...prev, optimistic]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY(projectId), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY(projectId) }),
  });
}

/* ── Update todo ─────────────────────────────── */
export function useUpdateTodo(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, text, status, userId }) =>
      axios
        .put(
          `/api/projects/${projectId}/todos`,
          { _id, text, status },
          { headers: getHeaders(userId) }
        )
        .then((r) => r.data),

    onMutate: async ({ _id, text, status }) => {
      await qc.cancelQueries({ queryKey: KEY(projectId) });
      const prev = qc.getQueryData(KEY(projectId)) ?? [];
      qc.setQueryData(
        KEY(projectId),
        prev.map((t) =>
          t._id === _id
            ? { ...t, ...(text !== undefined && { text }), ...(status !== undefined && { status }) }
            : t
        )
      );
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY(projectId), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY(projectId) }),
  });
}

/* ── Delete todo ─────────────────────────────── */
export function useDeleteTodo(projectId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, userId }) =>
      axios
        .delete(
          `/api/projects/${projectId}/todos?todoId=${todoId}`,
          { headers: getHeaders(userId) }
        )
        .then((r) => r.data),

    onMutate: async ({ todoId }) => {
      await qc.cancelQueries({ queryKey: KEY(projectId) });
      const prev = qc.getQueryData(KEY(projectId)) ?? [];
      qc.setQueryData(KEY(projectId), prev.filter((t) => t._id !== todoId));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(KEY(projectId), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: KEY(projectId) }),
  });
}
