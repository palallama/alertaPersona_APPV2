export function getColor(v: string, a: number = 1): string {
  const val = getComputedStyle(document.documentElement)
    .getPropertyValue(`--ins-${v}`)
    .trim()

  return v.includes('-rgb') ? `rgba(${val}, ${a})` : val
}

export function getRandomColor(): string {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `#${hex.toUpperCase()}`;
}