<template>
  <AppLayout>
    <div class="mechanics-page">
      <h2>Request Mechanical Service</h2>
      <p class="instructions">Fill in your details below. All registered mechanics will be able to view and respond to your request.</p>

      <form @submit.prevent="submitForm" class="service-form">
        <div class="row">
          <label>Client Name *</label>
          <input v-model="form.clientName" required />
        </div>

        <div class="row">
          <label>Contact (phone or email) *</label>
          <input v-model="form.contact" required />
        </div>

        <div class="row">
          <label>Car Make / Model *</label>
          <input v-model="form.carModel" required />
        </div>

        <div class="row">
          <label>Year *</label>
          <input v-model="form.year" type="number" min="1900" max="2099" required />
        </div>

        <div class="row">
          <label>Problem Description *</label>
          <textarea v-model="form.description" rows="5" required placeholder="Describe the issue with your car..."></textarea>
        </div>

        <div class="row actions">
         
            <input type="datetime-local" v-model="scheduledAt" />
            <button type="submit" :disabled="submitting">{{ submitting ? 'Submitting...' : 'Submit Request' }}</button>
          </div>
      </form>

      <div v-if="successMessage" class="success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import AppLayout from './components/AppLayout.vue'

const api = axios.create({ baseURL: 'http://localhost:3000' })

const submitting = ref(false)

const form = ref({
  clientName: '',
  contact: '',
  carModel: '',
  year: '',
  description: ''
})

const mechanics = ref([])
const selectedMechanicId = ref('')
const scheduledAt = ref('')

const successMessage = ref('')
const errorMessage = ref('')

function validateForm() {
  if (!form.value.clientName || !form.value.contact || !form.value.carModel || !form.value.year || !form.value.description) {
    errorMessage.value = 'Please fill in all required fields.'
    return false
  }
  const y = parseInt(form.value.year, 10)
  if (isNaN(y) || y < 1886 || y > 2099) {
    errorMessage.value = 'Please enter a valid year.'
    return false
  }
  if (!scheduledAt.value) {
    errorMessage.value = 'Please select a desired schedule time.'
    return false
  }
  return true
}


async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validateForm()) return

  submitting.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      errorMessage.value = 'You must be logged in to request a mechanic.'
      submitting.value = false
      return
    }

    const payload = {
      mechanic_id: selectedMechanicId.value || null,
      clientName: form.value.clientName,
      contact: form.value.contact,
      carModel: form.value.carModel,
      year: parseInt(form.value.year, 10),
      description: form.value.description,
      scheduled_at: scheduledAt.value
    }

    const res = await api.post('/bookings', payload, { headers: { Authorization: `Bearer ${token}` } })
    successMessage.value = `Booking created (id: ${res.data.id}). Status: ${res.data.status || 'pending'}`

    // clear form on success
    form.value.clientName = ''
    form.value.contact = ''
    form.value.carModel = ''
    form.value.year = ''
    form.value.description = ''
    scheduledAt.value = ''

  } catch (err) {
    console.error(err)
    errorMessage.value = err?.response?.data?.error || 'Failed to create booking.'
  } finally {
    submitting.value = false
  }
};
</script>

<style scoped>
.mechanics-page { max-width: 700px; margin: 0 auto; padding: 16px }
.instructions { color: #666; font-size: 14px; margin-bottom: 20px }
.service-form { border: 1px solid #ddd; padding: 20px; margin-bottom: 16px; border-radius: 6px }
.row { margin-bottom: 15px; display: flex; flex-direction: column }
.row label { font-weight: 600; margin-bottom: 6px; color: #333 }
.row input, .row textarea, .row select { padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: 14px }
.row input:focus, .row textarea:focus, .row select:focus { outline: none; border-color: #0066cc; box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1) }
.actions { display: flex; justify-content: flex-end; margin-top: 20px }
.actions button { padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600 }
.actions button:hover:not(:disabled) { background: #0052a3 }
.actions button:disabled { opacity: 0.6; cursor: not-allowed }
.success { color: #27ae60; background: #d5f4e6; padding: 12px; border-left: 4px solid #27ae60; margin-top: 12px; border-radius: 3px }
.error { color: #e74c3c; background: #fadbd8; padding: 12px; border-left: 4px solid #e74c3c; margin-top: 12px; border-radius: 3px }
</style>