<template>
  <AppLayout>
    <main class="dealership-main">
      <div class="filters-wrap">
        <div class="vehicle-nav">
          <button
            v-for="type in vehicleTypes"
            :key="type.id"
            :class="['vehicle-nav-btn', { active: selectedVehicleType === type.id }]"
            @click="selectedVehicleType = type.id"
          >
            {{ type.name }}
          </button>
        </div>

        <div class="category-filters" role="radiogroup" aria-label="Category Filters">
          <label
            v-for="category in categories"
            :key="category.id"
            :class="['category-btn', { active: selectedCategory === category.id }]"
          >
            <input
              type="radio"
              class="category-radio"
              name="category"
              :value="category.id"
              v-model="selectedCategory"
            />
            <span class="category-label">{{ category.name }}</span>
            <span class="category-count">({{ getCategoryCount(category.id) }})</span>
          </label>
        </div>
      </div>

      <section class="cars-section">
        <h2 class="section-title">{{ getSectionTitle() }}</h2>

        <div v-if="loading" class="loading">Loading vehicles...</div>
        <div v-else-if="fetchError" class="error-message">{{ fetchError }}</div>

        <div v-else-if="filteredCars.length > 0" class="cars-grid">
          <article v-for="car in filteredCars" :key="car.id" class="car-card">
            <div class="car-image-container">
              <img
                :src="resolveCarImage(car)"
                :alt="`${car.name || 'Vehicle'} ${car.model || ''}`.trim()"
                class="car-image"
                @error="onCarImageError($event, car)"
              >
              <div class="car-badge">{{ car.category || 'vehicle' }}</div>
              <button class="view-details-btn" @click="openCheckout(car)">View Details</button>
            </div>

            <div class="car-info">
              <h3 class="car-name">{{ car.name || 'Unnamed Vehicle' }}</h3>
              <p class="car-model">{{ car.model || 'Model N/A' }} | {{ car.year || 'Year N/A' }}</p>

              <div class="car-specs">
                <span class="spec">Fuel: {{ car.fuel_capacity || 'N/A' }}</span>
                <span class="spec">Transmission: {{ car.transmission || 'N/A' }}</span>
                <span class="spec">Mileage: {{ car.km_driven || 0 }} km</span>
              </div>

              <div class="car-footer">
                <div class="car-price">
                  <span class="price-label">Price</span>
                  <span class="price-value">R{{ car.price }}</span>
                </div>
                <button @click="openCheckout(car)" class="buy-btn">Buy Now</button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="no-cars">
          <h3>No vehicles found</h3>
          <p>Try adjusting your vehicle type or category filters.</p>
        </div>
      </section>
    </main>
  </AppLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AppLayout from './components/AppLayout.vue'
import sedanImage from '@/assets/images/image4.jpg'
import truckImage from '@/assets/images/images6.jpg'
import electricImage from '@/assets/images/images7.jpg'
import suvImage from '@/assets/images/download.jpg'
import sportImage from '@/assets/images/download8.jpg'
import classicImage from '@/assets/images/download9.jpg'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:3000' })

const cars = ref([])
const loading = ref(false)
const fetchError = ref('')
const selectedCategory = ref('all')
const selectedVehicleType = ref('all')

const categories = ref([
  { id: 'all', name: 'All' },
  { id: 'sedan', name: 'Sedan' },
  { id: 'truck', name: 'Truck' }
])

const vehicleTypes = ref([
  { id: 'all', name: 'All Vehicles' },
  { id: 'petrol', name: 'Petrol' },
  { id: 'electric', name: 'Electric' }
])

const vehicleFallbacks = [sedanImage, truckImage, electricImage, suvImage, sportImage, classicImage]
const wikiImageCache = new Map()

const filteredCars = computed(() => {
  const selCat = selectedCategory.value.toLowerCase()
  const selType = selectedVehicleType.value.toLowerCase()

  const includesMatch = (field, value) => {
    if (field == null) return false
    if (Array.isArray(field)) return field.some((f) => f && f.toString().toLowerCase().includes(value))
    return field.toString().toLowerCase().includes(value)
  }

  return cars.value.filter((car) => {
    const carCategory = car.category || ''
    const carType = car.vehicle_type || ''

    const matchesCategory = selCat === 'all' || includesMatch(carCategory, selCat)
    const matchesType = selType === 'all' || includesMatch(carType, selType)

    return matchesCategory && matchesType
  })
})

function pickVehicleFallback(car) {
  const text = `${car?.name || ''} ${car?.model || ''} ${car?.category || ''} ${car?.vehicle_type || ''}`.toLowerCase()

  if (text.includes('electric') || text.includes('ev')) return electricImage
  if (text.includes('truck')) return truckImage
  if (text.includes('suv')) return suvImage
  if (text.includes('sport') || text.includes('coupe')) return sportImage
  if (text.includes('classic')) return classicImage
  if (text.includes('sedan')) return sedanImage

  const id = Number(car?.id || 0)
  return vehicleFallbacks[id % vehicleFallbacks.length]
}

function slug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function buildVehicleQueryImage(car) {
  const make = slug(car?.name)
  const model = slug(car?.model)
  const type = slug(car?.vehicle_type)
  const query = [make, model, type, 'car'].filter(Boolean).join(',')
  const lock = Number(car?.id || 1)
  return `https://source.unsplash.com/800x500/?${encodeURIComponent(query)}&sig=${lock}`
}

async function fetchWikipediaImage(title) {
  if (!title) return null
  const key = title.trim().toLowerCase()
  if (!key) return null

  if (wikiImageCache.has(key)) {
    return wikiImageCache.get(key)
  }

  try {
    const pageTitle = encodeURIComponent(title.trim().replace(/\s+/g, '_'))
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${pageTitle}`)
    if (!response.ok) {
      wikiImageCache.set(key, null)
      return null
    }

    const data = await response.json()
    const image = data?.originalimage?.source || data?.thumbnail?.source || null
    wikiImageCache.set(key, image)
    return image
  } catch {
    wikiImageCache.set(key, null)
    return null
  }
}

async function resolveVehicleImageByName(car) {
  const make = String(car?.name || '').trim()
  const model = String(car?.model || '').trim()
  const candidates = [
    `${make} ${model}`.trim(),
    `${make} ${model} (automobile)`.trim(),
    `${make} ${model} car`.trim(),
    make
  ].filter(Boolean)

  for (const candidate of candidates) {
    const image = await fetchWikipediaImage(candidate)
    if (image) return image
  }

  return buildVehicleQueryImage(car)
}

function resolveCarImage(car) {
  const img = car?.image
  if (typeof img === 'string' && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:image/'))) {
    return img
  }

  return pickVehicleFallback(car)
}

function onCarImageError(event, car) {
  event.target.src = pickVehicleFallback(car)
}

function openCheckout(car) {
  router.push({
    path: '/checkout',
    query: {
      car_id: car.id,
      name: car.name,
      price: car.price,
      image: resolveCarImage(car)
    }
  })
}

function getCategoryCount(categoryId) {
  const sel = String(categoryId || '').toLowerCase()
  if (sel === 'all') return cars.value.length

  return cars.value.filter((car) => {
    const cat = car.category || ''
    if (Array.isArray(cat)) return cat.some((c) => c && c.toString().toLowerCase().includes(sel))
    return cat.toString().toLowerCase().includes(sel)
  }).length
}

function getSectionTitle() {
  if (selectedCategory.value === 'all') return 'All Vehicles'
  return `${selectedCategory.value.toUpperCase()} Vehicles`
}

async function fetchCars() {
  loading.value = true
  fetchError.value = ''
  try {
    const response = await api.get('/cars')
    const rawCars = response.data || []
    const hydratedCars = await Promise.all(
      rawCars.map(async (car) => ({
        ...car,
        image: await resolveVehicleImageByName(car)
      }))
    )
    cars.value = hydratedCars
  } catch (error) {
    console.error('Error fetching cars:', error)
    fetchError.value = error?.response?.data?.error || 'Failed to load cars'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCars()
})
</script>

<style scoped>
.dealership-main {
  width: 100%;
  padding: 24px;
  display: grid;
  gap: 18px;
}

.filters-wrap {
  display: grid;
  gap: 12px;
}

.vehicle-nav,
.category-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.vehicle-nav-btn,
.category-btn {
  border: 1px solid #d3deec;
  background: #ffffff;
  color: #214063;
  border-radius: 10px;
  padding: 9px 14px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.vehicle-nav-btn:hover,
.category-btn:hover {
  transform: translateY(-1px);
  border-color: #80ace8;
  box-shadow: 0 6px 14px rgba(10, 73, 141, 0.1);
}

.vehicle-nav-btn.active,
.category-btn.active {
  background: linear-gradient(135deg, #0e5cbc, #0a3d85);
  color: #fff;
  border-color: transparent;
}

.category-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.category-count {
  margin-left: 6px;
  opacity: 0.9;
}

.cars-section {
  display: grid;
  gap: 14px;
}

.section-title {
  margin: 0;
  font-size: 28px;
  color: #13365d;
}

.loading,
.error-message,
.no-cars {
  background: #fff;
  border: 1px solid #dce3ec;
  border-radius: 12px;
  padding: 26px;
}

.error-message {
  color: #861d29;
  background: #fff2f4;
  border-color: #f3c3ca;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.car-card {
  background: #fff;
  border: 1px solid #dce3ec;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.car-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 24px rgba(12, 54, 110, 0.14);
}

.car-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image {
  transform: scale(1.06);
}

.car-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(5, 34, 67, 0.75);
  color: #fff;
  font-size: 11px;
  text-transform: capitalize;
}

.view-details-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #13447a;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 10px;
  cursor: pointer;
}

.car-info {
  padding: 14px;
}

.car-name {
  margin: 0;
  font-size: 18px;
  color: #14385f;
}

.car-model {
  margin: 4px 0 10px;
  font-size: 12px;
  color: #5c7087;
}

.car-specs {
  display: grid;
  gap: 6px;
}

.spec {
  font-size: 12px;
  color: #3f536a;
}

.car-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.car-price {
  display: grid;
}

.price-label {
  font-size: 11px;
  color: #6c7f95;
}

.price-value {
  font-size: 18px;
  color: #0d58b5;
  font-weight: 800;
}

.buy-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #fff;
  background: linear-gradient(135deg, #0e5cbc, #0a3d85);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .dealership-main {
    padding: 16px;
  }

  .section-title {
    font-size: 24px;
  }
}

@media (max-width: 560px) {
  .cars-grid {
    grid-template-columns: 1fr;
  }

  .vehicle-nav-btn,
  .category-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
