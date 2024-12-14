export type Content = {
  header: {
    heading: string
    subheading: string
  }
  aboutUs: {
    heading: string
    content: string
  }
  navigation: NavigationLink[]
  videos: VideoContent[]
  articles: ArticleContent[]
}

export type ArticleData = {
  id: string
  imageUrl: string
  link?: string
}

export type ArticleContent = {
  articleId?: string
  heading?: string
  content?: string
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

export type Language = {
  code: string
  name: string
}

export type NavigationLink = {
  label: string
  value: string
}
