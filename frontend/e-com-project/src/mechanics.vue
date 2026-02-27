<template>
  <AppLayout>
    <div class="mechanics-page">
      <h2>Request Mechanical Service</h2>
      <p class="instructions">Fill in your details below. All registered mechanics will be able to view and respond to your request.</p>

      <form @submit.prevent="submitForm" class="service-form">
        <div class="row">
          <label>Client Name *</label>
          <input v-model="form.clientName" required />
<<<<<<< HEAD
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
          <textarea v-model="form.description" rows="4" required></textarea>
        </div>

        <div class="row">
          <label>Location *</label>
          <select v-model="selectedLocation" @change="onLocationChange" required>
            <option value="" disabled>Select a location</option>
            <option v-for="loc in locations" :key="loc" :value="loc">{{ loc }}</option>
          </select>
        </div>

        <div class="row">
          <label>Preferred Mechanic</label>
          <div v-if="selectedMechanicId">Selected: {{ selectedMechanicName }}</div>
          <div v-else class="note">Choose a mechanic below and click Book.</div>
        </div>

        <div class="row actions">
          <button type="submit" :disabled="submitting">
            {{ submitting ? 'Submitting...' : 'Submit Request' }}
          </button>
        </div>
      </form>

      <div v-if="loadingMechanics">Loading mechanics...</div>

      <div v-if="mechanics.length">
        <h3>Mechanics available in {{ selectedLocation || 'all areas' }}</h3>
        <div class="mechanic-list">
          <div class="mechanic-card" v-for="m in mechanics" :key="m.id">
            <p style="font-size: 12px; color: #999; margin: 0 0 6px 0">ID: {{ m.id }}</p>
            <h4>{{ m.fullname || m.name || 'Unnamed Mechanic' }}</h4>
            <p><strong>Location:</strong> {{ m.location || 'N/A' }}</p>
            <p><strong>Phone:</strong> {{ m.phone || 'N/A' }}</p>
            <p><strong>Email:</strong> {{ m.email || 'N/A' }}</p>
            <p><strong>Bio:</strong> {{ m.bio || '-' }}</p>
            <p><strong>Experience:</strong> {{ m.years_experience || 0 }} years</p>
            <p><strong>Rating:</strong> {{ m.rating != null ? Number(m.rating).toFixed(2) : 'N/A' }}</p>
            <p><strong>Availability:</strong> {{ m.availability ? 'Available' : 'Not available' }}</p>
            <p><strong>Notes:</strong> {{ m.notes_on_pricing || '-' }}</p>
            <div class="mechanic-actions">
              <button @click="bookMechanic(m)" class="book-btn">Book</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!mechanics.length && selectedLocation && !loadingMechanics">
        No mechanics found for {{ selectedLocation }}.
      </div>

=======
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

>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
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

<<<<<<< HEAD
const locations = ref([])
const selectedLocation = ref('')
const mechanics = ref([])
const loadingMechanics = ref(false)
const selectedMechanicId = ref(null)
=======
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
const submitting = ref(false)

const form = ref({
  clientName: '',
  contact: '',
  carModel: '',
  year: '',
  description: ''
})

<<<<<<< HEAD
const selectedMechanicName = computed(() => {
  if (!selectedMechanicId.value) return ''
  const match = mechanics.value.find((x) => Number(x.id) === Number(selectedMechanicId.value))
  return match ? (match.fullname || match.name || 'Selected Mechanic') : ''
})
=======
const mechanics = ref([])
const selectedMechanicId = ref('')
const scheduledAt = ref('')
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1

const successMessage = ref('')
const errorMessage = ref('')

<<<<<<< HEAD
function bookMechanic(mechanic) {
  selectedMechanicId.value = Number(mechanic.id)
  const formEl = document.querySelector('.service-form')
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' })
}

async function fetchLocations() {
  try {
    const res = await api.get('/locations')
    locations.value = res.data || []
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Failed to load locations.'
  }
}

async function fetchMechanics(location) {
  loadingMechanics.value = true
  mechanics.value = []

  try {
    const params = {}
    if (location) params.location = location

    const res = await api.get('/mechanics', { params })
    mechanics.value = Array.isArray(res.data) ? res.data : (res.data?.data || [])
  } catch (err) {
    console.error(err)
    errorMessage.value = err?.response?.data?.error || 'Failed to load mechanics.'
  } finally {
    loadingMechanics.value = false
  }
}

function onLocationChange() {
  successMessage.value = ''
  errorMessage.value = ''
  selectedMechanicId.value = null

  if (!selectedLocation.value) {
    mechanics.value = []
    return
  }

  fetchMechanics(selectedLocation.value)
}

=======
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
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
<<<<<<< HEAD

  if (!selectedLocation.value) {
    errorMessage.value = 'Please choose a location.'
    return false
  }

  if (!selectedMechanicId.value) {
    errorMessage.value = 'Please choose a preferred mechanic by clicking Book on a mechanic card.'
=======
  if (!scheduledAt.value) {
    errorMessage.value = 'Please select a desired schedule time.'
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
    return false
  }

  return true
}

<<<<<<< HEAD
=======

>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validateForm()) return

  submitting.value = true

  try {
    const token = localStorage.getItem('token')
    if (!token) {
<<<<<<< HEAD
      errorMessage.value = 'You must be logged in to book a mechanic.'
=======
      errorMessage.value = 'You must be logged in to request a mechanic.'
      submitting.value = false
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
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

<<<<<<< HEAD
    const res = await api.post('/bookings', payload, {
      headers: { Authorization: `Bearer ${token}` }
    })

    successMessage.value = `Booking created (id: ${res.data.id}). Mechanic will respond.`
=======
    const res = await api.post('/bookings', payload, { headers: { Authorization: `Bearer ${token}` } })
    successMessage.value = `Booking created (id: ${res.data.id}). Status: ${res.data.status || 'pending'}`
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1

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
<<<<<<< HEAD
}

onMounted(() => {
  fetchLocations()
  fetchMechanics()
})
</script>

<style scoped>
.mechanics-page { max-width: 900px; margin: 0 auto; padding: 16px }
.service-form { border: 1px solid #ddd; padding: 12px; margin-bottom: 16px }
.row { margin-bottom: 10px; display:flex; flex-direction:column }
.row label { font-weight:600; margin-bottom:6px }
.row input, .row textarea, .row select { padding:8px; border:1px solid #ccc; border-radius:4px }
.actions { display:flex; justify-content:flex-end }
.actions button { padding:8px 14px }
.actions button[disabled] { opacity: 0.7; cursor: not-allowed }
.mechanic-list { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px }
.mechanic-card { border:1px solid #eee; padding:10px; border-radius:6px; background:#fafafa }
.success { color: green; margin-top:12px }
.error { color: red; margin-top:12px }
</style>
=======
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
>>>>>>> 78ba20db8e5f3d8d593c637600462bf4a68d21e1
