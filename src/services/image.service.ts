import axios from 'axios'

const imgbbApiKey = 'b66c71c241d70cfb17b04e5460333bce'
const imgbbBaseUrl = 'https://api.imgbb.com/1'

export const fetchImage = async (imgbbId: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${imgbbBaseUrl}/images/${imgbbId}`, {
      params: { key: imgbbApiKey },
    })
    return response.data.data
  } catch (error) {
    console.error('Failed to fetch image from ImgBB:', error)
    return null
  }
}

const uploadImage = async (event: Event): Promise<any | null> => {
  const target = event.target as HTMLInputElement
  const file = target.files && target.files[0]

  if (file) {
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await axios.post(`${imgbbBaseUrl}/upload?key=${imgbbApiKey}`, formData)
      return response.data.data
    } catch (error) {
      console.error('Error uploading image to ImgBB:', error)
      return null
    }
  }

  return null
}

const deleteImage = async (deleteUrl: string) => {
  try {
    await axios.post(deleteUrl)
  } catch (error) {
    console.error('Failed to delete image from ImgBB:', error)
    throw error
  }
}

export { uploadImage, deleteImage }
