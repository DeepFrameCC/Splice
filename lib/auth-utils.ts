export const pseudoRegex = /^[a-z0-9._]+$/;

export function formatPseudo(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9._]/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.|\.$/g, "");
}
