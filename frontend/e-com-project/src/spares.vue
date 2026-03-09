<template>
  <AppLayout>
    <main class="spares-main">
      <div class="top-row">
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

        <button @click="toggleCart" class="cart-toggle">
          Cart
          <span v-if="cart.length > 0" class="cart-badge">{{ cart.length }}</span>
        </button>
      </div>

      <section class="parts-section">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>
        <div v-if="loading" class="loading">Loading parts...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>

        <div v-else-if="filteredParts.length" class="parts-grid">
          <article v-for="part in filteredParts" :key="part.id" class="part-card">
            <div class="part-image" :style="partImageStyle(part)"></div>
            <div class="part-info">
              <h3 class="part-name">{{ part.name }}</h3>
              <p class="part-category">{{ part.category }}</p>
              <p class="part-desc">{{ part.size || part.capacity || 'Standard specification' }}</p>
              <div class="part-footer">
                <div class="part-price">R{{ parseFloat(part.price).toFixed(2) }}</div>
                <button
                  @click="isInCart(part.id) ? removeFromCart(part.id) : addToCart(part)"
                  :class="['add-btn', { added: isInCart(part.id) }]"
                >{{ isInCart(part.id) ? 'Remove' : 'Add to Cart' }}</button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="no-parts">No parts found for this category.</div>
      </section>

      <div v-if="showCart" class="cart-panel">
        <div class="cart-header">
          <h2>Shopping Cart</h2>
          <button @click="showCart = false" class="close-btn">X</button>
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
              <div class="item-total">R{{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</div>
              <button @click="removeFromCart(item.id)" class="remove-btn">Remove</button>
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
            Order created successfully. Check your orders page.
          </div>
        </div>
      </div>
    </main>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
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
import engineImage from '@/assets/images/download5.jpg'
import electronicsImage from '@/assets/images/images7.jpg'
import externalImage from '@/assets/images/download9.jpg'
import internalImage from '@/assets/images/download8.jpg'
import generalImage from '@/assets/images/download.jpg'

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
const partFallbacks = [engineImage, electronicsImage, externalImage, internalImage, generalImage]

const filteredParts = computed(() => {
  let filtered = parts.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((p) =>
      String(p.category || '').toLowerCase().includes(selectedCategory.value.toLowerCase())
    )
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((p) =>
      String(p.name || '').toLowerCase().includes(query) ||
      String(p.category || '').toLowerCase().includes(query)
    )
  }

  return filtered
})

function toggleCart() {
  showCart.value = !showCart.value
}

function isValidImage(url) {
  return typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:image/'))
}

function pickPartFallback(part) {
  const text = `${part?.name || ''} ${part?.category || ''}`.toLowerCase()

  if (text.includes('engine') || text.includes('oil') || text.includes('piston')) return engineImage
  if (text.includes('electronic') || text.includes('sensor') || text.includes('battery')) return electronicsImage
  if (text.includes('external') || text.includes('body') || text.includes('bumper') || text.includes('light')) return externalImage
  if (text.includes('internal') || text.includes('filter') || text.includes('brake') || text.includes('clutch')) return internalImage

  const id = Number(part?.id || 0)
  return partFallbacks[id % partFallbacks.length]
}

function resolvePartImage(part) {
  if (isValidImage(part?.image)) return part.image
  return pickPartFallback(part)
}

function partImageStyle(part) {
  return { backgroundImage: `url(${resolvePartImage(part)})` }
}

function itemImageStyle(item) {
  const image = isValidImage(item?.image) ? item.image : pickPartFallback(item)
  return { backgroundImage: `url(${image})` }
}

function getSectionTitle() {
  return categories.value.find((c) => c.id === selectedCategory.value)?.name || 'Parts'
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
    image: resolvePartImage(part),
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

function checkout() {
  if (cart.length === 0) {
    checkoutError.value = 'Cart is empty'
    return
  }

  router.push({ path: '/checkout' })
}

onMounted(() => {
  fetchParts()
})
</script>

<style scoped>
.spares-main {
  width: 100%;
  padding: 24px;
  display: grid;
  gap: 16px;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.category-btn {
  border: 1px solid #d5deea;
  background: #ffffff;
  color: #173a5f;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.category-btn:hover {
  transform: translateY(-1px);
  border-color: #7eb0ee;
}

.category-btn.active {
  background: linear-gradient(135deg, #0d62c9, #0a3f8d);
  color: #fff;
  border-color: transparent;
}

.cart-toggle {
  position: relative;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #0d62c9, #0a3f8d);
  color: #fff;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #dc3f4f;
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
}

.parts-section {
  display: grid;
  gap: 12px;
}

.section-title {
  margin: 0;
  font-size: 28px;
  color: #14375d;
}

.loading,
.error-message,
.no-parts {
  border: 1px solid #dce3ec;
  border-radius: 12px;
  padding: 24px;
  background: #fff;
}

.error-message {
  border-color: #f0bec5;
  background: #fff3f5;
  color: #8f1f2c;
}

.parts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.part-card {
  background: #fff;
  border: 1px solid #dce3ec;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.part-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 20px rgba(8, 58, 119, 0.12);
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
  margin: 0;
  color: #133d67;
  font-size: 16px;
}

.part-category {
  margin: 5px 0;
  font-size: 12px;
  color: #60768f;
  text-transform: capitalize;
}

.part-desc {
  margin: 0 0 10px;
  font-size: 13px;
  color: #4b6076;
}

.part-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.part-price {
  font-size: 18px;
  font-weight: 800;
  color: #0c5abb;
}

.add-btn {
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #0d62c9, #0a3f8d);
  color: #fff;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.add-btn.added {
  background: linear-gradient(135deg, #18804c, #0e6639);
}

.cart-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid #dce3ec;
  box-shadow: -8px 0 24px rgba(8, 36, 72, 0.12);
  z-index: 30;
  display: flex;
  flex-direction: column;
}

.cart-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dce3ec;
}

.cart-header h2 {
  margin: 0;
  font-size: 20px;
  color: #173d67;
}

.close-btn {
  border: none;
  background: transparent;
  color: #6a7b8f;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
}

.empty-cart {
  flex: 1;
  display: grid;
  place-items: center;
  color: #617284;
}

.cart-content {
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
}

.cart-items {
  padding: 12px;
  overflow-y: auto;
  display: grid;
  gap: 10px;
}

.cart-item {
  border: 1px solid #dce3ec;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 10px;
}

.item-image {
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
}

.item-details h4 {
  margin: 0;
  font-size: 13px;
  color: #1a3d63;
}

.item-price {
  margin: 4px 0 0;
  font-size: 12px;
  color: #5a7087;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #cad6e5;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.qty-input {
  width: 40px;
  border: 1px solid #cad6e5;
  border-radius: 6px;
  padding: 3px;
  text-align: center;
}

.item-total {
  font-size: 13px;
  font-weight: 700;
  color: #0d58b5;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #c53042;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.cart-summary {
  border-top: 1px solid #dce3ec;
  padding: 12px;
  background: #f8fbff;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  color: #50657a;
}

.summary-row.total {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px solid #dce3ec;
  font-weight: 800;
  color: #0d58b5;
}

.checkout-error,
.checkout-success {
  margin: 10px 12px 0;
  padding: 9px 10px;
  border-radius: 8px;
  font-size: 12px;
}

.checkout-error {
  background: #fff3f5;
  color: #8f1f2c;
}

.checkout-success {
  background: #effbf2;
  color: #17643a;
}

.cart-actions {
  border-top: 1px solid #dce3ec;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.continue-btn,
.checkout-btn {
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  padding: 10px;
  cursor: pointer;
}

.continue-btn {
  background: #e9eef5;
  color: #35506d;
}

.checkout-btn {
  background: linear-gradient(135deg, #0d62c9, #0a3f8d);
  color: #fff;
}

.checkout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .spares-main {
    padding: 16px;
  }

  .section-title {
    font-size: 24px;
  }
}

@media (max-width: 700px) {
  .cart-panel {
    width: 100%;
  }

  .parts-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 520px) {
  .parts-grid {
    grid-template-columns: 1fr;
  }

  .category-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
