<template>
  <AppLayout>
    <div class="orders-page">
      <header class="page-header">
        <h1>My Orders</h1>
        <button @click="goToProfile" class="profile-btn">Profile</button>
      </header>

    <div class="filters">
      <div class="filter-group">
        <label>Filter by Status:</label>
        <select v-model="selectedStatus" @change="fetchOrders" class="status-filter">
          <option value="">All Orders</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading">Loading orders...</div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!loading && orders.length === 0" class="no-orders">
      <p>No orders found</p>
    </div>

    <div v-if="!loading && orders.length > 0" class="orders-container">
      <div class="orders-list">
        <div 
          v-for="order in orders" 
          :key="order.id" 
          class="order-card"
          @click="selectOrder(order)"
        >
          <div class="order-header">
            <div class="order-id">Order #{{ order.id }}</div>
            <div class="order-status" :class="order.status">{{ order.status }}</div>
          </div>
          <div class="order-info">
            <p><strong>Date:</strong> {{ formatDate(order.created_at) }}</p>
            <p><strong>Total:</strong> ${{ parseFloat(order.total_price).toFixed(2) }}</p>
            <p><strong>Delivery:</strong> {{ order.delivery_address }}</p>
          </div>
          <div class="order-actions">
            <button
              v-if="order.status === 'pending'"
              @click.stop="confirmCancel(order)"
              :disabled="cancelingId === order.id"
              class="cancel-btn"
            >
              {{ cancelingId === order.id ? 'Cancelling...' : 'Cancel' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Order Details Modal -->
      <div v-if="selectedOrderData" class="order-details-panel">
        <button @click="selectedOrderData = null" class="close-btn">✕</button>
        <div class="details-content">
          <h2>Order Details - #{{ selectedOrderData.id }}</h2>
          
          <div class="detail-section">
            <h3>Order Information</h3>
            <div class="detail-row">
              <label>Order ID:</label>
              <span>#{{ selectedOrderData.id }}</span>
            </div>
            <div class="detail-row">
              <label>Status:</label>
              <span :class="selectedOrderData.status" class="status-badge">{{ selectedOrderData.status }}</span>
            </div>
            <div class="detail-row">
              <label>Date:</label>
              <span>{{ formatDate(selectedOrderData.created_at) }}</span>
            </div>
            <div class="detail-row">
              <label>Payment Method:</label>
              <span>{{ selectedOrderData.payment_method }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h3>Delivery Address</h3>
            <p class="address-text">{{ selectedOrderData.delivery_address }}</p>
          </div>

          <div class="detail-section">
            <h3>Items</h3>
            <div v-if="selectedOrderData.items && selectedOrderData.items.length > 0" class="items-list">
              <div v-for="item in selectedOrderData.items" :key="item.item_id" class="item">
                <div class="item-type-badge" :class="item.item_type">
                  {{ item.item_type === 'car' ? '🚗 Car' : '🔧 Part' }}
                </div>
                <div class="item-details">
                  <h4>{{ item.item_name }}</h4>
                  <p class="item-desc">{{ item.item_description }}</p>
                </div>
                <div class="item-price">
                  <p><strong>Qty:</strong> {{ item.quantity }}</p>
                  <p><strong>Price:</strong> ${{ parseFloat(item.price).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="no-items">No items in this order</div>
          </div>

          <div class="detail-section total-section">
            <div class="total-row">
              <label>Total Amount:</label>
              <span class="total-amount">${{ parseFloat(selectedOrderData.total_price).toFixed(2) }}</span>
            </div>
          </div>
          <div v-if="selectedOrderData && selectedOrderData.status === 'pending'" class="detail-actions">
            <button @click="confirmCancel(selectedOrderData)" :disabled="cancelingId === selectedOrderData.id" class="cancel-btn">
              {{ cancelingId === selectedOrderData.id ? 'Cancelling...' : 'Cancel Order' }}
            </button>
          </div>
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

const orders = ref([])
const selectedOrderData = ref(null)
const loading = ref(true)
const error = ref('')
const selectedStatus = ref('')
const cancelingId = ref(null)

async function confirmCancel(order) {
  if (!confirm(`Cancel order #${order.id}? This cannot be undone.`)) return
  await cancelOrder(order.id)
}

async function cancelOrder(orderId) {
  cancelingId.value = orderId
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }
    await api.post(`/orders/${orderId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } })
    // Refresh orders and selected order
    await fetchOrders()
    if (selectedOrderData.value && selectedOrderData.value.id === orderId) {
      selectedOrderData.value.status = 'cancelled'
    }
  } catch (err) {
    console.error('Error cancelling order:', err)
    error.value = err?.response?.data?.error || 'Failed to cancel order'
  } finally {
    cancelingId.value = null
  }
}

async function fetchOrders() {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    let url = '/orders'
    if (selectedStatus.value) {
      url += `?status=${selectedStatus.value}`
    }

    const res = await api.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    orders.value = res.data || []
    loading.value = false
  } catch (err) {
    console.error('Error fetching orders:', err)
    error.value = err?.response?.data?.error || 'Failed to load orders'
    loading.value = false
    if (err?.response?.status === 401) {
      router.push('/')
    }
  }
}

async function selectOrder(order) {
  loading.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    const res = await api.get(`/orders/${order.id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    selectedOrderData.value = res.data
    loading.value = false
  } catch (err) {
    console.error('Error fetching order details:', err)
    error.value = err?.response?.data?.error || 'Failed to load order details'
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

function goToProfile() {
  router.push('/profile')
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  color: #333;
  font-size: 32px;
  margin: 0;
}

.profile-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filters {
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-group label {
  font-weight: 600;
  color: #333;
}

.status-filter {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.status-filter:focus {
  outline: none;
  border-color: #667eea;
}

.loading {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.no-orders {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  color: #999;
}

.orders-container {
  display: flex;
  gap: 20px;
}

.orders-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 5px solid #667eea;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.order-id {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.order-status.paid {
  background: #d4edda;
  color: #155724;
}

.order-status.pending {
  background: #fff3cd;
  color: #856404;
}

.order-status.shipped {
  background: #d1ecf1;
  color: #0c5460;
}

.order-status.delivered {
  background: #c3e6cb;
  color: #155724;
}

.order-status.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.order-info {
  font-size: 14px;
  color: #666;
}

.order-info p {
  margin: 5px 0;
}

.order-details-panel {
  flex: 1;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #333;
}

.details-content h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}

.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  color: #333;
  font-size: 16px;
  margin: 0 0 15px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.detail-row label {
  font-weight: 600;
  color: #666;
  min-width: 150px;
}

.detail-row span {
  color: #333;
  text-align: right;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.address-text {
  background: #f9f9f9;
  padding: 15px;
  border-left: 4px solid #667eea;
  color: #333;
  margin: 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  align-items: flex-start;
}

.item-type-badge {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.item-type-badge.car {
  background: #d1ecf1;
  color: #0c5460;
}

.item-type-badge.part {
  background: #d4edda;
  color: #155724;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.item-desc {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.item-price {
  text-align: right;
  min-width: 120px;
}

.item-price p {
  margin: 5px 0;
  font-size: 14px;
  color: #666;
}

.no-items {
  color: #999;
  font-style: italic;
}

.total-section {
  background: #f0f0f0;
  padding: 20px !important;
  border-radius: 6px;
  border-bottom: none;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-row label {
  font-weight: 700;
  font-size: 16px;
  color: #333;
}

.total-amount {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
}

@media (max-width: 1024px) {
  .orders-container {
    flex-direction: column;
  }

  .order-details-panel {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .orders-page {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
}
</style>
