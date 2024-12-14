import axios from 'axios'

const imgbbApiKey = 'b66c71c241d70cfb17b04e5460333bce'
const imgbbBaseUrl = 'https://api.imgbb.com/1'

const uploadImage = async (file: any) => {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post(`${imgbbBaseUrl}/upload?key=${imgbbApiKey}`, formData)
    return response.data.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
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
