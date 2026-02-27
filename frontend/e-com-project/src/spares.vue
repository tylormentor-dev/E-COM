<template>
  <AppLayout>
    <main class="spares-main">
      <div class="page-actions" style="display:flex; justify-content:flex-end; margin-bottom:12px;">
        <button @click="toggleCart" class="cart-toggle">
          🛒 Cart
          <span v-if="cart.length > 0" class="cart-badge">{{ cart.length }}</span>
        </button>
      </div>
      <div class="category-filters">
        <button 
          v-for="cat in categories" 
          :key="cat.id" 
          @click="selectedCategory = cat.id"
          :class="['category-btn', { active: selectedCategory === cat.id }]"
        >
          {{ cat.name }}
        </button>
      </div>

      <section class="parts-section">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>
        <div v-if="loading" class="loading">Loading parts...</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="!loading && filteredParts.length" class="parts-grid">
          <div v-for="part in filteredParts" :key="part.id" class="part-card">
            <div class="part-image" :style="partImageStyle(part)"></div>
            <div class="part-info">
              <h3 class="part-name">{{ part.name }}</h3>
              <p class="part-category">{{ part.category }}</p>
              <p class="part-desc">{{ part.size || part.capacity || 'Standard' }}</p>
              <div class="part-footer">
                <div class="part-price">R{{ parseFloat(part.price).toFixed(2) }}</div>
                <button
                  @click="isInCart(part.id) ? removeFromCart(part.id) : addToCart(part)"
                  :class="['add-btn', { added: isInCart(part.id) }]"
                >{{ isInCart(part.id) ? 'Remove' : 'Add to Cart' }}</button>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!loading && filteredParts.length === 0" class="no-parts">No parts found for this category.</div>
      </section>

      <!-- Cart Panel -->
      <div v-if="showCart" class="cart-panel">
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button @click="showCart = false" class="close-btn">✕</button>
        </div>

        <div v-if="cart.length === 0" class="empty-cart">
          <p>Your cart is empty</p>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cart" :key="`${item.id}-${item.quantity}`" class="cart-item">
              <div class="item-image" :style="itemImageStyle(item)"></div>
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p class="item-price">R{{ parseFloat(item.price).toFixed(2) }}</p>
              </div>
              <div class="item-quantity">
                <button @click="decrementQty(item.id)" class="qty-btn">-</button>
                <input v-model.number="item.quantity" type="number" class="qty-input" min="1">
                <button @click="incrementQty(item.id)" class="qty-btn">+</button>
              </div>
              <div class="item-total">
                R{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
              </div>
              <button @click="removeFromCart(item.id)" class="remove-btn">🗑️</button>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>R{{ calculateSubtotal().toFixed(2) }}</span>
            </div>
            <div class="summary-row">
              <span>Tax (10%):</span>
              <span>R{{ (calculateSubtotal() * 0.1).toFixed(2) }}</span>
            </div>
            <div class="summary-row total">
              <span>Total:</span>
              <span>R{{ calculateTotal().toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="checkoutError" class="checkout-error">{{ checkoutError }}</div>

          <div class="cart-actions">
            <button @click="showCart = false" class="continue-btn">Continue Shopping</button>
            <button @click="checkout" :disabled="checkoutLoading" class="checkout-btn">
              {{ checkoutLoading ? 'Processing...' : 'Checkout' }}
            </button>
          </div>

          <div v-if="checkoutSuccess" class="checkout-success">
            ✅ Order created successfully! Check your orders page.
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppLayout from './components/AppLayout.vue'
import {
  cartState,
  addToCart as storeAddToCart,
  isInCart as storeIsInCart,
  removeFromCart as storeRemoveFromCart,
  incrementQty as storeIncQty,
  decrementQty as storeDecQty,
  subtotal
} from './cartStore'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:3000' })

const showCart = ref(false)
const selectedCategory = ref('all')
const searchQuery = ref('')
const loading = ref(false)
const error = ref('')
const checkoutLoading = ref(false)
const checkoutError = ref('')
const checkoutSuccess = ref(false)

const categories = ref([
  { id: 'all', name: 'All Parts' },
  { id: 'internal', name: 'Internal' },
  { id: 'external', name: 'External' },
  { id: 'engine', name: 'Engine' },
  { id: 'electronics', name: 'Electronics' }
])

const parts = ref([])
const cart = cartState.items

const filteredParts = computed(() => {
  let filtered = parts.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) || 
      (p.category && p.category.toLowerCase().includes(query))
    )
  }

  return filtered
})

function toggleCart() {
  showCart.value = !showCart.value
}

function buildPlaceholderImage(label, bg = '#215732') {
  const safe = String(label || 'Spare Part').slice(0, 28)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='34' fill='#ffffff' font-family='Arial,sans-serif'>${safe}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function resolveImage(url, label, bg = '#215732') {
  if (typeof url === 'string') {
    const trimmed = url.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
      return trimmed
    }
  }
  return buildPlaceholderImage(label, bg)
}

function partImageStyle(part) {
  return { backgroundImage: `url(${resolveImage(part?.image, part?.name || 'Part')})` }
}

function itemImageStyle(item) {
  return { backgroundImage: `url(${resolveImage(item?.image, item?.name || 'Cart Item')})` }
}

function getSectionTitle() {
  const cat = categories.value.find(c => c.id === selectedCategory.value)?.name || 'Parts'
  return `${cat}`
}

async function fetchParts() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/spares')
    parts.value = res.data || []
  } catch (err) {
    console.error('Error fetching parts:', err)
    error.value = 'Failed to load parts'
  } finally {
    loading.value = false
  }
}

function addToCart(part) {
  storeAddToCart({
    id: part.id,
    name: part.name,
    price: part.price,
    image: resolveImage(part.image, part.name),
    quantity: 1
  })
}

function isInCart(partId) {
  return storeIsInCart(partId)
}

function removeFromCart(partId) {
  storeRemoveFromCart(partId)
}

function incrementQty(partId) {
  storeIncQty(partId)
}

function decrementQty(partId) {
  storeDecQty(partId)
}

function calculateSubtotal() {
  return subtotal.value || cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
}

function calculateTotal() {
  const subtotalVal = calculateSubtotal()
  return subtotalVal + (subtotalVal * 0.1)
}

async function checkout() {
  if (cart.length === 0) {
    checkoutError.value = 'Cart is empty'
    return
  }

  // navigate to centralized checkout page which reads cart from cartStore
  router.push({ path: '/checkout' })
}

onMounted(() => {
  fetchParts()
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.spares-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 20px 40px;
  border-bottom: 3px solid rgba(212, 212, 212, 0.61);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 8;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(173, 174, 180, 0.69);
  background-image: url(images.jpg);
  background-size: cover;
}

.company-info {
  flex: 1;
  color: white;
}

.company-name {
  font-size: 32px;
  font-weight: 700;
  background: linear-gradient(135deg, #001a8d 0%, #4ea3e9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 5px;
}

.slogan {
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.cart-icon-wrapper {
  display: flex;
  align-items: center;
}

.cart-toggle {
  padding: 10px 20px;
  background: linear-gradient(135deg, #4ea3e9, #1f6feb);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  position: relative;
  transition: all 0.3s ease;
}

.cart-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 163, 233, 0.4);
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff6b6b;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

.search-container {
  background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 15px 40px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 7;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.search {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  font-size: 14px;
}

.main-wrapper {
  display: flex;
  flex: 1;
  position: relative;
}

.side-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 250px;
  background: rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  z-index: 20;
  transition: transform 0.3s ease;
}

.side-inner {
  padding: 20px;
  background: rgba(31, 111, 235, 0.08);
  color: #333;
}

.nav-heading {
  font-size: 16px;
  color: #1f6feb;
  font-weight: 700;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
}

.nav-link {
  color: #666;
  display: flex;
  padding: 10px 12px;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.active {
  color: #1f6feb;
  background: rgba(31, 111, 235, 0.1);
  border-left: 3px solid #1f6feb;
}

.toggle-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  position: absolute;
  top: 130px;
  left: 232px;
  border: none;
  cursor: pointer;
  z-index: 25;
}

.spares-main {
  padding: 30px;
  flex: 1;
  margin-left: 250px;
  max-width: calc(100% - 250px);
}

.category-filters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-btn {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.category-btn:hover {
  border-color: #4ea3e9;
  color: #4ea3e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 163, 233, 0.15);
}

.category-btn.active {
  background: linear-gradient(135deg, #4ea3e9 0%, #1f6feb 100%);
  color: white;
  border-color: transparent;
}

.parts-section {
  margin-top: 30px;
}

.section-title {
  font-size: 24px;
  color: #1f6feb;
  margin-bottom: 20px;
}

.loading,
.error-message {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  font-size: 16px;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.part-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.part-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.part-image {
  height: 140px;
  background-size: cover;
  background-position: center;
}

.part-info {
  padding: 12px;
}

.part-name {
  color: #1f6feb;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.part-category {
  color: #999;
  font-size: 12px;
  margin-bottom: 4px;
  text-transform: capitalize;
}

.part-desc {
  color: #666;
  font-size: 13px;
  margin-bottom: 12px;
}

.part-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.part-price {
  font-weight: 700;
  color: #1f6feb;
}

.add-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(31, 111, 235, 0.3);
}

.add-btn.added {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  cursor: default;
  opacity: 0.95;
}

.add-btn:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

.no-parts {
  text-align: center;
  color: #999;
  padding: 40px;
  background: white;
  border-radius: 8px;
}

/* CART PANEL STYLES */
.cart-panel {
  position: fixed;
  right: 0;
  top: 0;
  height: 100vh;
  width: 380px;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
  z-index: 30;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid #eee;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #1f6feb;
}

.close-btn {
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

.empty-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}

.cart-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.cart-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 10px;
  align-items: center;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333;
}

.item-price {
  color: #1f6feb;
  font-weight: 600;
  font-size: 13px;
}

.item-quantity {
  display: flex;
  gap: 4px;
  align-items: center;
}

.qty-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  background: white;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.qty-input {
  width: 35px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px;
  font-size: 12px;
}

.item-total {
  min-width: 55px;
  text-align: right;
  font-weight: 600;
  color: #1f6feb;
}

.remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.cart-summary {
  padding: 15px;
  border-top: 2px solid #eee;
  background: #f9f9f9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: #666;
}

.summary-row.total {
  font-size: 16px;
  font-weight: bold;
  color: #1f6feb;
  border-top: 2px solid #ddd;
  padding-top: 12px;
  margin-top: 12px;
}

.checkout-error {
  color: #721c24;
  background: #f8d7da;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 15px 0 15px;
  font-size: 13px;
}

.checkout-success {
  color: #155724;
  background: #d4edda;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 15px 0 15px;
  font-size: 13px;
}

.cart-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
}

.continue-btn,
.checkout-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.continue-btn {
  background: #f0f0f0;
  color: #333;
}

.continue-btn:hover {
  background: #e0e0e0;
}

.checkout-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .cart-panel {
    width: 100%;
    right: 0;
    height: 400px;
  }

  .spares-main {
    margin-left: 0;
    max-width: 100%;
  }

  .parts-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
