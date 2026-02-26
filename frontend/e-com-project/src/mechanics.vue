<template>
  <AppLayout>
    <div class="mechanics-page">
      <h2>Request Mechanical Service</h2>

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
        <button type="submit">Submit Request</button>
      </div>
    </form>

    <div v-if="loadingMechanics">Loading mechanics...</div>

    <div v-if="mechanics.length">
      <h3>Mechanics available in {{ selectedLocation }}</h3>
      <div class="mechanic-list">
        <div class="mechanic-card" v-for="m in mechanics" :key="m.id">
          <p style="font-size: 12px; color: #999; margin: 0 0 6px 0;">ID: {{ m.id }}</p>
          <h4>{{ m.fullname || 'Unnamed' }}</h4>
          <p><strong>Location:</strong> {{ m.location }}</p>
          <p><strong>Phone:</strong> {{ m.phone || 'N/A' }}</p>
          <p><strong>Email:</strong> {{ m.email || 'N/A' }}</p>
          <p><strong>Bio:</strong> {{ m.bio || '—' }}</p>
          <p><strong>Experience:</strong> {{ m.years_experience || 0 }} years</p>
          <p><strong>Rating:</strong> {{ m.rating != null ? m.rating.toFixed(2) : 'N/A' }}</p>
          <p><strong>Availability:</strong> {{ m.availability ? 'Available' : 'Not available' }}</p>
          <p><strong>Notes:</strong> {{ m.notes_on_pricing || '—' }}</p>
          <div class="mechanic-actions">
            <button @click="bookMechanic(m)" class="book-btn">Book</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!mechanics.length && selectedLocation && !loadingMechanics">
      No mechanics found for {{ selectedLocation }}.
    </div>

    <div v-if="successMessage" class="success">{{ successMessage }}</div>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import AppLayout from './components/AppLayout.vue'

const api = axios.create({ baseURL: 'http://localhost:3000' })

const locations = ref([])
const selectedLocation = ref('')
const mechanics = ref([])
const loadingMechanics = ref(false)
const selectedMechanicId = ref(null)

const form = ref({
  clientName: '',
  contact: '',
  carModel: '',
  year: '',
  description: ''
})

const selectedMechanicName = computed(() => {
  if (!selectedMechanicId.value) return ''
  const m = mechanics.value.find(x => x.id === selectedMechanicId.value)
  return m ? (m.fullname || m.name || 'Selected Mechanic') : ''
})

const successMessage = ref('')
const errorMessage = ref('')

function bookMechanic(mechanic) {
  selectedMechanicId.value = mechanic.id
  // scroll to form
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
  // Robust fetching: always set loading state, handle empty/invalid location
  loadingMechanics.value = true
  mechanics.value = []
  errorMessage.value = ''
  if (!location) {
    // nothing selected yet
    loadingMechanics.value = false
    return
  }

  try {
    console.log('Fetching mechanics for location:', location)
    const res = await api.get('/mechanics', { params: { location } })
    mechanics.value = res.data || []
    console.log('Mechanics fetched:', mechanics.value)
    if (!mechanics.value.length) {
      // helpful message when none found
      errorMessage.value = `No mechanics found for ${location}.`
    }
  } catch (err) {
    console.error('fetchMechanics error:', err)
    errorMessage.value = err?.response?.data?.error || 'Failed to load mechanics for the selected location.'
  } finally {
    loadingMechanics.value = false
  }
}

function onLocationChange(e) {
  successMessage.value = ''
  errorMessage.value = ''
  console.log('Location changed to:', selectedLocation.value)
  fetchMechanics(selectedLocation.value)
}

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
  if (!selectedLocation.value) {
    errorMessage.value = 'Please choose a location.'
    return false
  }
  if (!selectedMechanicId.value) {
    errorMessage.value = 'Please choose a preferred mechanic by clicking "Book" on the mechanic card.'
    return false
  }
  return true
}

const submitting = ref(false)

async function submitForm() {
  errorMessage.value = ''
  successMessage.value = ''
  if (!validateForm()) return

  submitting.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      errorMessage.value = 'You must be logged in to book a mechanic.'
      submitting.value = false
      return
    }

    const payload = {
      mechanic_id: selectedMechanicId.value,
      clientName: form.value.clientName,
      contact: form.value.contact,
      carModel: form.value.carModel,
      year: parseInt(form.value.year, 10),
      description: form.value.description,
      location: selectedLocation.value
    }

    const res = await api.post('/bookings', payload, { headers: { Authorization: `Bearer ${token}` } })
    successMessage.value = `Booking created (id: ${res.data.id}). Mechanic will respond.`

    // clear form on success
    form.value.clientName = ''
    form.value.contact = ''
    form.value.carModel = ''
    form.value.year = ''
    form.value.description = ''
    selectedMechanicId.value = null
  } catch (err) {
    console.error(err)
    errorMessage.value = err?.response?.data?.error || 'Failed to create booking.'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchLocations()
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
.mechanic-list { display:grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap:12px }
.mechanic-card { border:1px solid #eee; padding:10px; border-radius:6px; background:#fafafa }
.success { color: green; margin-top:12px }
.error { color: red; margin-top:12px }
</style>
