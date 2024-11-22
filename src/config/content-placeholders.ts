const PLACEHOLDER_KEYS = [
  'HEADER_HEADING',
  'HEADER_ABOUT_US',
  'NAVIGATION_HOME',
  'NAVIGATION_VIDEOS',
  'NAVIGATION_IMAGES',
  'NAVIGATION_ARTISTS',
  'NAVIGATION_CONTACT',
]

export const generateEmptyContent = (): Record<string, string> => {
  return Object.fromEntries(PLACEHOLDER_KEYS.map((key) => [key, '']))
}
