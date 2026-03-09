<template>
	<AppLayout>
		<div class="bookings-page">
			<h1>{{ isMechanic ? 'Pending Service Requests' : 'My Bookings' }}</h1>

			<div v-if="loading" class="loading">Loading bookings...</div>
			<div v-if="error" class="error-message">{{ error }}</div>

			<div v-if="!loading && bookings.length === 0" class="no-bookings">
				<p>{{ isMechanic ? 'No pending requests at your location.' : 'No bookings yet. Go to Mechanics to book a service.' }}</p>
			</div>

			<div v-if="!loading && bookings.length > 0" class="bookings-list">
				<div v-for="booking in bookings" :key="booking.id" class="booking-card">
					<div class="booking-header">
						<h3>{{ isMechanic ? booking.client_fullname : (booking.mechanic_name || 'Pending Assignment') }}</h3>
						<span :class="['status-badge', booking.status]">{{ booking.status }}</span>
					</div>
					<div class="booking-details">
						<p><strong>{{ isMechanic ? 'Client' : 'Mechanic' }}:</strong> {{ isMechanic ? booking.client_fullname : (booking.mechanic_name || 'Not Assigned') }}</p>
						<p><strong>Contact:</strong> {{ booking.contact }}</p>
						<p><strong>Car:</strong> {{ booking.car_model }} ({{ booking.year }})</p>
						<p><strong>Location:</strong> {{ booking.location }}</p>
						<p><strong>Description:</strong> {{ booking.description }}</p>
						<p><strong>{{ isMechanic ? 'Requested' : 'Booked' }}:</strong> {{ formatDate(booking.created_at) }}</p>
						<p v-if="booking.scheduled_at"><strong>Scheduled:</strong> {{ formatDate(booking.scheduled_at) }}</p>
					</div>
					<div class="booking-actions">
						<template v-if="isMechanic && booking.status === 'pending'">
							<button @click="acceptBooking(booking.id)" :disabled="loadingId === booking.id" class="accept-btn">Accept</button>
							<button @click="rejectBooking(booking.id)" :disabled="loadingId === booking.id" class="reject-btn">Reject</button>
						</template>
						<template v-else-if="!isMechanic && booking.status === 'pending'">
							<button @click="cancelBooking(booking.id)" :disabled="loadingId === booking.id" class="cancel-btn">Cancel</button>
						</template>
					</div>
				</div>
			</div>
		</div>
	</AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from './components/AppLayout.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:3000' })

const bookings = ref([])
const loading = ref(true)
const error = ref('')
const loadingId = ref(null)
const userRole = ref('')

const isMechanic = computed(() => userRole.value === 'mechanic')

async function fetchBookings() {
	loading.value = true
	error.value = ''
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/')
			return
		}
		
		// Get user role
		const userStr = localStorage.getItem('user')
		if (userStr) {
			const user = JSON.parse(userStr)
			userRole.value = user.role
		}
		
		const res = await api.get('/bookings', { headers: { Authorization: `Bearer ${token}` } })
		bookings.value = res.data || []
	} catch (err) {
		console.error('Error fetching bookings:', err)
		error.value = err?.response?.data?.error || 'Failed to load bookings'
		if (err?.response?.status === 401) router.push('/')
	} finally {
		loading.value = false
	}
}

function formatDate(date) {
	if (!date) return 'N/A'
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

onMounted(() => {
	fetchBookings()
})

async function acceptBooking(id) {
	if (!id) return
	loadingId.value = id
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			error.value = 'You must be logged in'
			loadingId.value = null
			return
		}
		await api.post(`/bookings/${id}/accept`, {}, { headers: { Authorization: `Bearer ${token}` } })
		// refresh list
		await fetchBookings()
	} catch (err) {
		console.error('Error accepting booking:', err)
		error.value = err?.response?.data?.error || 'Failed to accept booking'
	} finally {
		loadingId.value = null
	}
}

async function rejectBooking(id) {
	if (!id) return
	loadingId.value = id
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			error.value = 'You must be logged in'
			loadingId.value = null
			return
		}
		await api.post(`/bookings/${id}/reject`, {}, { headers: { Authorization: `Bearer ${token}` } })
		// refresh list
		await fetchBookings()
	} catch (err) {
		console.error('Error rejecting booking:', err)
		error.value = err?.response?.data?.error || 'Failed to reject booking'
	} finally {
		loadingId.value = null
	}
}

async function cancelBooking(id) {
	if (!id) return
	loadingId.value = id
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			error.value = 'You must be logged in'
			loadingId.value = null
			return
		}
		await api.post(`/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
		// refresh list
		await fetchBookings()
	} catch (err) {
		console.error('Error cancelling booking:', err)
		error.value = err?.response?.data?.error || 'Failed to cancel booking'
	} finally {
		loadingId.value = null
	}
}
</script>

<style scoped>
.bookings-page {
	max-width: 1000px;
	margin: 0 auto;
	padding: 20px;
	min-height: 100vh;
}

h1 {
	color: #333;
	margin-bottom: 20px;
}

.loading, .error-message, .no-bookings {
	text-align: center;
	padding: 20px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-message {
	background: #f8d7da;
	color: #721c24;
}

.no-bookings {
	color: #666;
}

.bookings-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 16px;
}

.booking-card {
	background: white;
	border-radius: 8px;
	padding: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
}

.booking-card:hover {
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	transform: translateY(-2px);
}

.booking-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 12px;
	border-bottom: 2px solid #f0f0f0;
	padding-bottom: 8px;
}

.booking-header h3 {
	margin: 0;
	color: #1f6feb;
	font-size: 18px;
}

.status-badge {
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 600;
	text-transform: uppercase;
}

.status-badge.pending {
	background: #fff3cd;
	color: #856404;
}

.status-badge.accepted {
	background: #d4edda;
	color: #155724;
}

.status-badge.rejected {
	background: #f8d7da;
	color: #721c24;
}

.status-badge.cancelled {
	background: #e2e3e5;
	color: #383d41;
}

.booking-details {
	font-size: 14px;
	line-height: 1.8;
	color: #555;
}

.booking-details p {
	margin: 6px 0;
	word-wrap: break-word;
}

.booking-actions {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}

.booking-actions button {
	flex: 1;
	min-width: 100px;
	padding: 8px 12px;
	border-radius: 4px;
	font-size: 12px;
	font-weight: 600;
	border: none;
	cursor: pointer;
	transition: all 0.2s;
}

.accept-btn {
	background: #28a745;
	color: white;
}

.accept-btn:hover:not(:disabled) {
	background: #218838;
}

.reject-btn {
	background: #dc3545;
	color: white;
}

.reject-btn:hover:not(:disabled) {
	background: #c82333;
}

.cancel-btn {
	background: #ffc107;
	color: #333;
}

.cancel-btn:hover:not(:disabled) {
	background: #e0a800;
}

button:disabled {
	opacity: 0.6;
	cursor: not-allowed;
}

@media (max-width: 600px) {
	.bookings-list {
		grid-template-columns: 1fr;
	}

	.bookings-page {
		padding: 12px;
	}
}
</style>
