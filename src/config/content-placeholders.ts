const PLACEHOLDER_KEYS = [
  'HEADER_HEADING',
  'HEADER_SUBHEADING',
  'NAVIGATION_HOME',
  'NAVIGATION_VIDEOS',
  'NAVIGATION_IMAGES',
  'NAVIGATION_ARTISTS',
  'NAVIGATION_CONTACT',
  'ABOUT_US_HEADING',
  'ABOUT_US_CONTENT',
]

export const generateEmptyContent = (): Record<string, string> => {
  return Object.fromEntries(PLACEHOLDER_KEYS.map((key) => [key, '']))
}
