export function formatCode(data) {
  return data.source_code.replace(/\n/g, "\\n");
}
