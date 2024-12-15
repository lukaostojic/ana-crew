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
      return response.data.data // Return the image URL
    } catch (error) {
      console.error('Error uploading image to ImgBB:', error)
      return null
    }
  }

  return null
}

const getImages = async () => {
  console.warn(
    'ImgBB API does not provide an endpoint to list all images directly. Consider maintaining an image list in Firestore or another database.',
  )
  return []
}

const deleteImage = async (imageDeleteUrl: string) => {
  try {
    const response = await axios.get(imageDeleteUrl) // ImgBB provides a unique delete URL for each image
    return response.data.success // Returns true if successfully deleted
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export { uploadImage, getImages, deleteImage }
