import { reactive, computed } from 'vue'

const state = reactive({
  items: []
})

function save() {
  try {
    localStorage.setItem('cart_items', JSON.stringify(state.items))
  } catch (e) {
    console.warn('Failed to persist cart', e)
  }
}

function load() {
  try {
    const raw = localStorage.getItem('cart_items')
   const parsed = raw ? JSON.parse(raw) : []
   // mutate array in-place to preserve references
   state.items.splice(0, state.items.length, ...parsed)
  } catch (e) {
   state.items.splice(0, state.items.length)
  }
}

function getCart() {
  return state.items
}

function addToCart(item) {
  const existing = state.items.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity || 1
  } else {
    state.items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || null,
      quantity: item.quantity || 1
    })
  }
  save()
}

function removeFromCart(id) {
  const idx = state.items.findIndex(i => i.id === id)
  if (idx >= 0) state.items.splice(idx, 1)
  save()
}

function isInCart(id) {
  return state.items.some(i => i.id === id)
}

function incrementQty(id) {
  const it = state.items.find(i => i.id === id)
  if (it) { it.quantity += 1; save() }
}

function decrementQty(id) {
  const it = state.items.find(i => i.id === id)
  if (it && it.quantity > 1) { it.quantity -= 1; save() }
}

function clearCart() {
  state.items.splice(0, state.items.length)
  save()
}

const subtotal = computed(() => state.items.reduce((s, it) => s + (parseFloat(it.price) * it.quantity), 0))

load()

export {
  state as cartState,
  getCart,
  addToCart,
  removeFromCart,
  isInCart,
  incrementQty,
  decrementQty,
  clearCart,
  subtotal
}
