<template>
  <div class="contact__wrapper px-4">
    <div class="contact__save-button d-flex justify-end align-center p-relative">
      <button
        @click="saveDetails"
        :class="{ disabled: isSaveButtonDisabled }"
        class="button button--secondary button--icon p-absolute save"
      >
        <span>Update Details</span>
        <span class="material-symbols-outlined"> upload </span>
      </button>
    </div>
    <div class="contact__list d-flex justify-sb pb-5 pr-5">
      <div class="contact__item d-flex-col w-100 p-4">
        <p class="mb-1">Email</p>
        <input
          type="email"
          v-model="contactDetails.email"
          class="input"
          :class="{ 'input--error': !isEmailValid && contactDetails.email.length > 0 }"
          @input="validateEmail"
        />
      </div>
      <div class="contact__item d-flex-col w-100 p-4">
        <p class="mb-1">Phone</p>
        <input
          type="number"
          v-model="contactDetails.phone"
          class="input"
          :class="{ 'input--error': !isPhoneValid && contactDetails.phone }"
          @input="validatePhoneNumber"
        />
      </div>
      <div class="contact__item d-flex-col w-100 p-4">
        <p class="mb-1">Instagram</p>
        <input
          type="text"
          v-model="contactDetails.instagram"
          class="input"
          :class="{ 'input--error': !isUrlValid && contactDetails.instagram.length > 0 }"
          @input="validateUrl"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import {
  isValidEmail,
  isValidPhoneNumber,
  isValidURL,
  deepEqual,
} from '../../../helpers/helper-functions'
import { fetchContactDetails, updateContactDetails } from '../../../services/contact.service'
import type { ContactDetails } from '../../../types/contact'

export default defineComponent({
  setup() {
    const isEmailValid = ref(false)
    const isPhoneValid = ref(false)
    const isUrlValid = ref(false)
    const detailsCopy = ref<ContactDetails | null>(null)
    const contactDetails = ref<ContactDetails>({
      email: '',
      phone: '',
      instagram: '',
    })

    const isSaveButtonDisabled = computed(() => {
      const isValid = isEmailValid.value && isPhoneValid.value && isUrlValid.value
      const isUnchanged = deepEqual(contactDetails.value, detailsCopy.value)
      return !isValid || isUnchanged
    })

    const validateEmail = () => {
      isEmailValid.value = isValidEmail(contactDetails.value.email)
    }

    const validatePhoneNumber = () => {
      isPhoneValid.value = isValidPhoneNumber(contactDetails.value.phone.toString())
    }

    const validateUrl = () => {
      isUrlValid.value = isValidURL(contactDetails.value.instagram)
    }

    const saveDetails = async () => {
      if (!isSaveButtonDisabled.value) {
        await updateContactDetails({
          email: contactDetails.value.email,
          phone: contactDetails.value.phone.toString(),
          instagram: contactDetails.value.instagram,
        })
        detailsCopy.value = { ...contactDetails.value }
      }
    }

    onMounted(async () => {
      const fetchedDetails = await fetchContactDetails()

      contactDetails.value = fetchedDetails
      detailsCopy.value = { ...fetchedDetails }

      validateEmail()
      validatePhoneNumber()
      validateUrl()
    })

    return {
      contactDetails,
      isEmailValid,
      isPhoneValid,
      isUrlValid,
      isSaveButtonDisabled,
      validateEmail,
      validatePhoneNumber,
      validateUrl,
      saveDetails,
    }
  },
})
</script>

<style lang="scss" scoped src="./Contact.scss"></style>
