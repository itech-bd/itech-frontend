export type LaravelEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T;
  code?: string;
  errors?: Record<string, string[]>;
};

export function unwrapLaravelResponse<T>(payload: unknown): T {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid API response");
  }

  const envelope = payload as Partial<LaravelEnvelope<T>>;
  if (envelope.success === false) {
    throw new Error(envelope.message ?? "API request failed");
  }

  return envelope.data as T;
}
