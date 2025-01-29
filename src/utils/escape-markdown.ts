export function escapeMarkdownV2(text: string) {
  return text
    .replace(/_/g, "\\_")  // Escape underscores
    .replace(/\*/g, "\\*")  // Escape asterisks
    .replace(/\[/g, "\\[")  // Escape square brackets
    .replace(/\]/g, "\\]")  // Escape square brackets
    .replace(/\(/g, "\\(")  // Escape parentheses
    .replace(/\)/g, "\\)")  // Escape parentheses
    .replace(/~/g, "\\~")   // Escape tilde
    .replace(/`/g, "\\`")   // Escape backtick
    .replace(/>/g, "\\>")   // Escape greater than
    .replace(/#/g, "\\#")   // Escape hash symbol
    .replace(/\+/g, "\\+")  // Escape plus
    .replace(/-/g, "\\-")   // Escape minus
    .replace(/=/g, "\\=")   // Escape equal sign
    .replace(/\|/g, "\\|")  // Escape vertical bar
    .replace(/\{/g, "\\{")  // Escape curly braces
    .replace(/\}/g, "\\}")  // Escape curly braces
    .replace(/\./g, "\\.")  // Escape dot
    .replace(/!/g, "\\!");  // Escape exclamation mark
}
