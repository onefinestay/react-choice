export function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isDefined(value) {
  return typeof value !== 'undefined';
}
