export type ClassValue = string | false | null | undefined;

export function cn(...valores: ClassValue[]): string {
  return valores.filter(Boolean).join(" ");
}
