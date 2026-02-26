<template>
	<AppLayout>
		<div class="bookings-page">
			<h1>My Bookings</h1>

			<div v-if="loading" class="loading">Loading bookings...</div>
			<div v-if="error" class="error-message">{{ error }}</div>

			<div v-if="!loading && bookings.length === 0" class="no-bookings">
				<p>No bookings yet. Go to Mechanics to book a service.</p>
			</div>

			<div v-if="!loading && bookings.length > 0" class="bookings-list">
				<div v-for="booking in bookings" :key="booking.id" class="booking-card">
					<div class="booking-header">
						<h3>{{ booking.mechanic_name || 'Mechanic' }}</h3>
						<span :class="['status-badge', booking.status]">{{ booking.status }}</span>
					</div>
					<div class="booking-details">
						<p><strong>Client:</strong> {{ booking.client_name }}</p>
						<p><strong>Contact:</strong> {{ booking.contact }}</p>
						<p><strong>Car:</strong> {{ booking.car_model }} ({{ booking.year }})</p>
						<p><strong>Location:</strong> {{ booking.location }}</p>
						<p><strong>Description:</strong> {{ booking.description }}</p>
						<p><strong>Booked:</strong> {{ formatDate(booking.created_at) }}</p>
						<p v-if="booking.scheduled_at"><strong>Scheduled:</strong> {{ formatDate(booking.scheduled_at) }}</p>
					</div>
					<div class="booking-actions">
						<button v-if="booking.status === 'pending'" :disabled="cancellingId === booking.id" @click="cancelBooking(booking.id)">Cancel</button>
					</div>
				</div>
			</div>
		</div>
	</AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from './components/AppLayout.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:3000' })

const bookings = ref([])
const loading = ref(true)
const error = ref('')
const cancellingId = ref(null)

async function fetchBookings() {
	loading.value = true
	error.value = ''
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			router.push('/')
			return
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

async function cancelBooking(id) {
	if (!id) return
	cancellingId.value = id
	try {
		const token = localStorage.getItem('token')
		if (!token) {
			error.value = 'You must be logged in'
			cancellingId.value = null
			return
		}
		await api.post(`/bookings/${id}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
		// refresh list
		await fetchBookings()
	} catch (err) {
		console.error('Error cancelling booking:', err)
		error.value = err?.response?.data?.error || 'Failed to cancel booking'
	} finally {
		cancellingId.value = null
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

.booking-details {
	font-size: 14px;
	line-height: 1.8;
	color: #555;
}

.booking-details p {
	margin: 6px 0;
	word-wrap: break-word;
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
