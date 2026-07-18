export type IdentityErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INVALID_INPUT"
  | "CONFLICT"
  | "INTERNAL";

export class IdentityError extends Error {
  code: IdentityErrorCode;
  constructor(code: IdentityErrorCode, message: string) {
    super(message);
    this.code = code;
    this.name = "IdentityError";
  }
}

export function toSafeMessage(err: unknown): string {
  if (err instanceof IdentityError) return err.message;
  return "An unexpected error occurred.";
}
