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
  heading: ''
  description: ''
  url: ''
}

export interface Language {
  code: string
  name: string
}
