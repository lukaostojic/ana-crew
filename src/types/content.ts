export type Content = {
  header: {
    heading: string
    aboutUs: string
  }
  navigation: [
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
    { label: string; value: string },
  ]
  videos: []
}

export type Video = {
  heading: ''
  description: ''
  url: ''
}
