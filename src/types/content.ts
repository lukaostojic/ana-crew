export type Content = {
  header: {
    heading: string
    subheading: string
  }
  navigation: [
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
  ]
  aboutUs: {
    heading: string
    content: any
  }
  videos: []
}

export type Video = {
  videoId?: string
  heading?: ''
  description?: ''
}

export interface Language {
  code: string
  name: string
}
