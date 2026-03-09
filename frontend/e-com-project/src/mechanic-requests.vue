<template>
  <AppLayout>
    <div class="requests-page">
      <h2>Service Requests</h2>
      <p class="instructions">Review and manage service requests from customers.</p>

      <div v-if="loadingRequests" class="loading">Loading requests...</div>

      <div v-else-if="requests.length === 0" class="no-requests">
        <p>No service requests yet.</p>
      </div>

      <div v-else class="requests-list">
        <div class="request-card" v-for="req in requests" :key="req.id" :class="`status-${req.status}`">
          <div class="request-header">
            <h3>{{ req.client_name }}</h3>
            <span class="status-badge" :class="`status-${req.status}`">{{ req.status }}</span>
          </div>

          <div class="request-details">
            <p><strong>Contact:</strong> {{ req.contact }}</p>
            <p><strong>Car:</strong> {{ req.car_model }} ({{ req.year }})</p>
            <p><strong>Problem:</strong> {{ req.description }}</p>
            <p class="date"><strong>Requested:</strong> {{ formatDate(req.created_at) }}</p>
          </div>

          <div class="request-actions" v-if="req.status === 'pending'">
            <button @click="approveRequest(req.id)" class="approve-btn" :disabled="submitting">
              {{ submitting && currentRequestId === req.id ? 'Processing...' : 'Approve' }}
            </button>
            <button @click="denyRequest(req.id)" class="deny-btn" :disabled="submitting">
              {{ submitting && currentRequestId === req.id ? 'Processing...' : 'Deny' }}
            </button>
          </div>

          <div v-else class="request-actions-disabled">
            <p>{{ req.status === 'approved' ? '✓ You approved this request' : '✗ You denied this request' }}</p>
          </div>
        </div>
      </div>

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

const requests = ref([])
const loadingRequests = ref(false)
const submitting = ref(false)
const currentRequestId = ref(null)
const successMessage = ref('')
const errorMessage = ref('')

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function fetchRequests() {
  loadingRequests.value = true
  errorMessage.value = ''
  
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      errorMessage.value = 'You must be logged in.'
      loadingRequests.value = false
      return
    }

    const res = await api.get('/requests', { headers: { Authorization: `Bearer ${token}` } })
    requests.value = res.data || []
  } catch (err) {
    console.error('Error fetching requests:', err)
    errorMessage.value = err?.response?.data?.error || 'Failed to load requests.'
  } finally {
    loadingRequests.value = false
  }
}

async function approveRequest(requestId) {
  submitting.value = true
  currentRequestId.value = requestId
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const token = localStorage.getItem('token')
    const res = await api.patch(`/requests/${requestId}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } })
    
    // Update the local request status
    const req = requests.value.find(r => r.id === requestId)
    if (req) {
      req.status = 'approved'
    }
    
    successMessage.value = `Request ${requestId} approved successfully.`
  } catch (err) {
    console.error('Error approving request:', err)
    errorMessage.value = err?.response?.data?.error || 'Failed to approve request.'
  } finally {
    submitting.value = false
    currentRequestId.value = null
  }
}

async function denyRequest(requestId) {
  submitting.value = true
  currentRequestId.value = requestId
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const token = localStorage.getItem('token')
    const res = await api.patch(`/requests/${requestId}/deny`, {}, { headers: { Authorization: `Bearer ${token}` } })
    
    // Update the local request status
    const req = requests.value.find(r => r.id === requestId)
    if (req) {
      req.status = 'denied'
    }
    
    successMessage.value = `Request ${requestId} denied.`
  } catch (err) {
    console.error('Error denying request:', err)
    errorMessage.value = err?.response?.data?.error || 'Failed to deny request.'
  } finally {
    submitting.value = false
    currentRequestId.value = null
  }
}

onMounted(() => {
  fetchRequests()
})
</script>

<style scoped>
.requests-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
}

.instructions {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.loading,
.no-requests {
  text-align: center;
  padding: 40px;
  color: #999;
}

.requests-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.request-card {
  border: 1px solid #ddd;
  border-left: 4px solid #999;
  padding: 16px;
  border-radius: 6px;
  background: #fff;
}

.request-card.status-approved {
  border-left-color: #27ae60;
  background: #f0fdf4;
}

.request-card.status-denied {
  border-left-color: #e74c3c;
  background: #fef2f2;
}

.request-card.status-pending {
  border-left-color: #f39c12;
  background: #fffbf0;
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.request-header h3 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.status-approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.status-denied {
  background: #f8d7da;
  color: #721c24;
}

.request-details {
  margin-bottom: 16px;
  color: #555;
  font-size: 14px;
}

.request-details p {
  margin: 6px 0;
}

.request-details .date {
  color: #999;
  font-size: 12px;
}

.request-actions,
.request-actions-disabled {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.request-actions-disabled {
  color: #27ae60;
  font-size: 14px;
}

.request-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  flex: 1;
  transition: all 0.2s;
}

.approve-btn {
  background: #27ae60;
  color: white;
}

.approve-btn:hover:not(:disabled) {
  background: #229954;
}

.deny-btn {
  background: #e74c3c;
  color: white;
}

.deny-btn:hover:not(:disabled) {
  background: #c0392b;
}

.approve-btn:disabled,
.deny-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  color: #27ae60;
  background: #d5f4e6;
  padding: 12px;
  border-left: 4px solid #27ae60;
  margin-top: 12px;
  border-radius: 3px;
}

.error {
  color: #e74c3c;
  background: #fadbd8;
  padding: 12px;
  border-left: 4px solid #e74c3c;
  margin-top: 12px;
  border-radius: 3px;
}
</style>
