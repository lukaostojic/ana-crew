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
    content: string
  }
  videos: VideoContent[]
}

export type VideoData = {
  id: string
  url: string
}

export type VideoContent = {
  videoId?: string
  heading?: string
  description?: string
}

export interface Language {
  code: string
  name: string
}
