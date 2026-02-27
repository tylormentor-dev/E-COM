<template>
  <AppLayout>
    <div class="checkout-page">
      <main class="checkout-main">
      <section class="summary">
        <h2>Order Summary</h2>
        <div v-if="itemsToPurchase.length === 0" class="empty">No items to purchase.</div>

        <div v-for="it in itemsToPurchase" :key="it.id" class="summary-item">
          <img
            :src="resolveCheckoutImage(it)"
            :alt="it.name || 'Item image'"
            class="item-img"
            @error="onCheckoutImageError($event, it)"
          />
          <div class="item-meta">
            <div class="item-name">{{ it.name }}</div>
            <div class="item-desc">Quantity: {{ it.quantity || 1 }}</div>
          </div>
          <div class="item-price">R{{ (parseFloat(it.price) * (it.quantity || 1)).toFixed(2) }}</div>
        </div>

        <div class="summary-totals">
          <div class="row"><span>Subtotal</span><span>R{{ subtotal.toFixed(2) }}</span></div>
          <div class="row"><span>Tax (10%)</span><span>R{{ (subtotal * 0.1).toFixed(2) }}</span></div>
          <div class="row total"><span>Total</span><span>R{{ total.toFixed(2) }}</span></div>
        </div>
      </section>

      <section class="payments">
        <h2>Payment Methods</h2>
        <p class="help">Choose one of the available payment methods. This demo simulates payments.</p>

        <div class="methods">
          <label v-for="m in methods" :key="m.id" :class="['method', {selected: selectedMethod === m.id}]">
            <input type="radio" name="method" :value="m.id" v-model="selectedMethod" />
            <div class="method-info">
              <div class="method-title">{{ m.title }}</div>
              <div class="method-desc">{{ m.desc }}</div>
            </div>
          </label>
        </div>

        <div class="method-form">
          <div v-if="selectedMethod === 'paypal'">
            <p>You will be redirected to PayPal (simulated).</p>
          </div>

          <div v-if="selectedMethod === 'stripe'">
            <p>Enter card details (simulated).</p>
            <input v-model="card.number" placeholder="Card number" />
            <div class="row-inputs">
              <input v-model="card.expiry" placeholder="MM/YY" />
              <input v-model="card.cvc" placeholder="CVC" />
            </div>
          </div>

          <div v-if="selectedMethod === 'paystack'">
            <p>Paystack flow (simulated). Enter email used for payment.</p>
            <input v-model="paystack.email" placeholder="Email" />
          </div>

          <div v-if="selectedMethod === 'paysnap'">
            <p>Paysnap quick pay (simulated). Provide phone or email.</p>
            <input v-model="paysnap.info" placeholder="Phone or email" />
          </div>

          <div v-if="selectedMethod === 'mpesa'">
            <p>M-Pesa mobile payment (simulated).</p>
            <input v-model="mpesa.phone" placeholder="Phone number" />
          </div>

          <div v-if="selectedMethod === 'bank'">
            <p>Bank transfer: transfer to the account below and click "I paid".
            <br />Account: 123-456789 (Mechanic Connect)
            <br />Bank: Demo Bank
            </p>
            <input v-model="bank.reference" placeholder="Payment reference" />
          </div>

          <div v-if="selectedMethod === 'scan'" class="scan-pay">
            <p>Scan the QR code with your banking app to pay (simulated QR).</p>
            <div class="qr" v-html="qrSvg"></div>
            <p class="scan-hint">Amount: R{{ total.toFixed(2) }}</p>
          </div>
        </div>

        <div class="pay-actions">
          <button @click="performPayment" :disabled="processing">{{ processing ? 'Processing...' : primaryLabel }}</button>
          <button class="secondary" @click="cancel">Cancel</button>
        </div>

        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="success" class="success">Payment successful — order created. Redirecting to Orders...</div>
      </section>
    </main>
  </div>
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { cartState, subtotal as cartSubtotal, clearCart } from './cartStore'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from './components/AppLayout.vue'

const route = useRoute()
const router = useRouter()

const methods = [
  { id: 'paypal', title: 'PayPal', desc: 'Pay securely with PayPal' },
  { id: 'stripe', title: 'Card (Stripe)', desc: 'Pay with credit or debit card' },
  { id: 'paystack', title: 'Paystack', desc: 'Popular African card/mobile payments' },
  { id: 'paysnap', title: 'Paysnap', desc: 'Quick Pay (Paysnap) — simulated' },
  { id: 'mpesa', title: 'M-Pesa', desc: 'Mobile money payment' },
  { id: 'bank', title: 'Bank Transfer', desc: 'Manual bank transfer' },
  { id: 'scan', title: 'Scan to Pay (QR)', desc: 'Scan the QR code with your banking app' }
]

const selectedMethod = ref('paypal')
const processing = ref(false)
const error = ref('')
const success = ref(false)

// forms
const card = ref({ number: '', expiry: '', cvc: '' })
const paystack = ref({ email: '' })
const paysnap = ref({ info: '' })
const mpesa = ref({ phone: '' })
const bank = ref({ reference: '' })

// Determine items to purchase: prefer query params for single-car purchase
const itemsToPurchase = ref([])
const subtotal = computed(() => {
  if (itemsToPurchase.value.length === 0) return 0
  return itemsToPurchase.value.reduce((s, it) => s + (parseFloat(it.price) * (it.quantity || 1)), 0)
})
const total = computed(() => subtotal.value + (subtotal.value * 0.1))

function buildPlaceholderImage(label, bg = '#0d47a1') {
  const safe = String(label || 'Item').slice(0, 28)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='700' height='450'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='38' fill='#ffffff' font-family='Arial,sans-serif'>${safe}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function resolveCheckoutImage(item) {
  const image = item?.image
  if (typeof image === 'string') {
    const trimmed = image.trim()
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:image/')) {
      return trimmed
    }
  }
  return buildPlaceholderImage(
    item?.name || (item?.car ? 'Vehicle' : 'Spare Part'),
    item?.car ? '#0d47a1' : '#215732'
  )
}

function onCheckoutImageError(event, item) {
  event.target.src = buildPlaceholderImage(
    item?.name || (item?.car ? 'Vehicle' : 'Spare Part'),
    item?.car ? '#0d47a1' : '#215732'
  )
}

function buildQrSvg(text = 'Scan to pay') {
  // Simple SVG placeholder QR-like box with text — not a real QR.
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><rect width='100%' height='100%' fill='#fff' stroke='#222'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='#222'>${text}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const qrSvg = `<img src="${buildQrSvg(`Pay R${total.value.toFixed(2)}`)}" alt="QR" />`

onMounted(() => {
  // If route has car details, use that single item. Expect query params car_id, name, price, image
  const carId = route.query.car_id
  if (carId) {
    const item = {
      id: carId,
      name: route.query.name || 'Selected Car',
      price: route.query.price || '0',
      image: route.query.image || null,
      quantity: 1,
      car: true
    }
    item.image = resolveCheckoutImage(item)
    itemsToPurchase.value = [item]
    return
  }

  // Otherwise use cart
  if (cartState.items && cartState.items.length) {
    itemsToPurchase.value = cartState.items.map(i => ({
      ...i,
      image: resolveCheckoutImage(i)
    }))
  }
})

function validateMethod() {
  if (selectedMethod.value === 'stripe') {
    if (!card.value.number || !card.value.expiry || !card.value.cvc) {
      error.value = 'Please enter valid card details.'
      return false
    }
  }
  if (selectedMethod.value === 'paystack' && !paystack.value.email) {
    error.value = 'Please enter email for Paystack.'
    return false
  }
  if (selectedMethod.value === 'paysnap' && !paysnap.value.info) {
    error.value = 'Please enter phone or email for Paysnap.'
    return false
  }
  if (selectedMethod.value === 'mpesa' && !mpesa.value.phone) {
    error.value = 'Please enter phone for M-Pesa.'
    return false
  }
  if (selectedMethod.value === 'bank' && !bank.value.reference) {
    error.value = 'Please enter bank payment reference.'
    return false
  }
  return true
}

const primaryLabel = computed(() => {
  if (processing.value) return 'Processing...'
  if (selectedMethod.value === 'bank') return 'I paid (create order)'
  return `Pay with ${methods.find(m=>m.id===selectedMethod.value)?.title || 'Payment'}`
})

async function performPayment() {
  error.value = ''
  if (itemsToPurchase.value.length === 0) {
    error.value = 'No items to pay for.'
    return
  }
  if (!validateMethod()) return

  processing.value = true
  try {
    // Simulate different flows
    await new Promise(r => setTimeout(r, 900))

    // Prepare items array for backend: support part_id or car_id
    const items = itemsToPurchase.value.map(it => {
      if (route.query.car_id || it.car) {
        return { car_id: it.id, quantity: it.quantity || 1, price: parseFloat(it.price) }
      }
      return { part_id: it.id, quantity: it.quantity || 1, price: parseFloat(it.price) }
    })

    const orderPayload = { items, total_price: total.value }
    const token = localStorage.getItem('token')
    if (!token) {
      error.value = 'You must be logged in to complete payment.'
      processing.value = false
      return
    }

    const res = await axios.post('http://localhost:3000/orders/create', orderPayload, { headers: { Authorization: `Bearer ${token}` } })

    success.value = true
    // clear cart if we used it
    if (!route.query.car_id) clearCart()

    setTimeout(() => router.push('/orders'), 900)
  } catch (err) {
    console.error('Payment/create order error', err)
    error.value = err?.response?.data?.error || 'Payment failed or order could not be created.'
  } finally {
    processing.value = false
  }
}

function cancel() {
  router.back()
}
</script>

<style scoped>
.checkout-page { max-width: 1100px; margin: 24px auto; padding: 12px }
.checkout-header { margin-bottom: 12px }
.checkout-main { display: grid; grid-template-columns: 1fr 420px; gap: 20px }
.summary { background: white; padding: 16px; border-radius: 8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.summary-item { display:flex; gap:12px; align-items:center; padding:8px 0; border-bottom:1px solid #f0f0f0 }
.summary-item:last-of-type { border-bottom: none }
.item-img { width:80px; height:60px; object-fit:cover; border-radius:6px }
.item-name { font-weight:700 }
.summary-totals { margin-top: 12px; }
.summary-totals .row { display:flex; justify-content:space-between; padding:6px 0 }
.summary-totals .total { font-weight:800; color:#1f6feb }

.payments { background: white; padding: 16px; border-radius:8px; box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.methods { display:flex; flex-direction:column; gap:8px }
.method { display:flex; gap:12px; padding:10px; border-radius:6px; border:1px solid #eee; align-items:center; cursor:pointer }
.method.selected { border-color:#1f6feb; background: linear-gradient(90deg, #f0f7ff 0%, #fff 100%) }
.method input { margin-right:8px }
.method-title { font-weight:700 }
.method-desc { font-size:12px; color:#666 }
.method-form { margin-top:12px }
input { display:block; width:100%; padding:8px; margin:8px 0; border-radius:6px; border:1px solid #ddd }
.row-inputs { display:flex; gap:8px }
.pay-actions { display:flex; gap:8px; margin-top:12px }
.pay-actions button { padding:10px 14px; border-radius:6px; border:none }
.pay-actions .secondary { background:#f0f0f0 }
.pay-actions button:disabled { opacity:0.7; cursor:not-allowed }
.error { margin-top:12px; padding:8px; background:#f8d7da; color:#721c24; border-radius:6px }
.success { margin-top:12px; padding:8px; background:#d4edda; color:#155724; border-radius:6px }
.scan-pay .qr img { width:200px; height:200px; border:1px solid #ddd; background:white }
@media (max-width: 900px) { .checkout-main { grid-template-columns: 1fr; } }
</style>
