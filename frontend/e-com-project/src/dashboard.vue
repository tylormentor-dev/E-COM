<template>
  <AppLayout>
    <section class="dashboard-page">
      <section class="hero">
        <div class="hero-copy">
          <p class="hero-kicker">MECHANIC CONNECT SOUTH AFRICA</p>
          <h1 class="hero-title">Manage your auto services in one place.</h1>
          <p class="hero-subtitle">
            Book trusted mechanics, browse vehicles, buy parts, and track orders from a single dashboard.
          </p>

          <div class="hero-actions">
            <RouterLink to="/mechanics" class="btn btn-primary">Book Mechanic</RouterLink>
            <RouterLink to="/dealership" class="btn btn-outline">Browse Vehicles</RouterLink>
          </div>
        </div>

        <div class="hero-panel">
          <h3>Today Snapshot</h3>
          <div class="snapshot-grid">
            <button
              v-for="item in snapshotCards"
              :key="item.label"
              type="button"
              class="snap-item"
              @click="openRoute(item.route)"
            >
              <p>{{ item.label }}</p>
              <strong>{{ item.value }}</strong>
              <span class="snap-meta">{{ item.meta }}</span>
            </button>
          </div>
        </div>
      </section>

      <section class="stats-row">
        <article
          v-for="item in stats"
          :key="item.id"
          :class="['stat-card', { active: item.id === selectedStatId }]"
          tabindex="0"
          role="button"
          @click="selectStat(item.id)"
          @keyup.enter="selectStat(item.id)"
        >
          <p class="stat-label">{{ item.label }}</p>
          <h3 class="stat-value">{{ item.value }}</h3>
          <span class="stat-change">{{ item.change }}</span>
        </article>
      </section>

      <section class="stat-insight" v-if="activeStat">
        <div>
          <p class="insight-kicker">Focused Metric</p>
          <h3>{{ activeStat.label }}</h3>
          <p class="insight-copy">{{ activeStat.detail }}</p>
        </div>
        <RouterLink :to="activeStat.route" class="insight-btn">Open {{ activeStat.cta }}</RouterLink>
      </section>

      <section class="feature-grid">
        <article class="carousel-card" @mouseenter="stopAuto" @mouseleave="startAuto">
          <div class="slide-image" :style="{ backgroundImage: `url(${slides[currentSlide].imagePath})` }">
            <button class="slide-nav prev" type="button" @click="prevSlide">Prev</button>
            <button class="slide-nav next" type="button" @click="nextSlide">Next</button>
            <div class="overlay">
              <h3>{{ slides[currentSlide].title }}</h3>
              <p>{{ slides[currentSlide].description }}</p>
            </div>
          </div>
          <div class="slide-dots">
            <button
              v-for="(slide, idx) in slides"
              :key="slide.title"
              :class="['dot', { active: idx === currentSlide }]"
              type="button"
              @click="setSlide(idx)"
            ></button>
          </div>
        </article>

        <article class="quick-card">
          <h3>Quick Access</h3>
          <div class="quick-list">
            <RouterLink to="/bookings" class="quick-link">View my bookings</RouterLink>
            <RouterLink to="/orders" class="quick-link">Track my orders</RouterLink>
            <RouterLink to="/spares" class="quick-link">Shop car spares</RouterLink>
            <RouterLink to="/profile" class="quick-link">Update profile</RouterLink>
          </div>
        </article>
      </section>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import im1 from '@/assets/images/image4.jpg'
import im2 from '@/assets/images/download.jpg'
import im3 from '@/assets/images/download5.jpg'
import im4 from '@/assets/images/images6.jpg'

const router = useRouter()
const currentSlide = ref(0)
const selectedStatId = ref('mechanics')
let timerId = null

const snapshotCards = [
  { label: 'Open Orders', value: '12', meta: '3 need confirmation', route: '/orders' },
  { label: 'Pending Bookings', value: '4', meta: '2 assigned today', route: '/bookings' },
  { label: 'Saved Vehicles', value: '9', meta: '1 new arrival', route: '/dealership' },
  { label: 'Unread Alerts', value: '3', meta: 'Service reminders', route: '/history' }
]

const stats = [
  {
    id: 'mechanics',
    label: 'Mechanics in network',
    value: '250+',
    change: '+8% this month',
    detail: 'Mechanic activity is rising this week. More mechanics are available in major service areas.',
    route: '/mechanics',
    cta: 'Mechanics'
  },
  {
    id: 'vehicles',
    label: 'Vehicles listed',
    value: '1,420',
    change: '+11% this month',
    detail: 'Vehicle inventory has expanded with more imported and used listings this month.',
    route: '/dealership',
    cta: 'Dealership'
  },
  {
    id: 'bookings',
    label: 'Completed bookings',
    value: '3,860',
    change: '+6% this month',
    detail: 'Completed service bookings are trending up with faster turnaround in recent weeks.',
    route: '/bookings',
    cta: 'Bookings'
  },
  {
    id: 'rating',
    label: 'Average customer rating',
    value: '4.7/5',
    change: 'Stable',
    detail: 'Customer satisfaction remains high with consistent positive service feedback.',
    route: '/profile',
    cta: 'Profile'
  }
]

const slides = [
  {
    imagePath: im1,
    title: 'Certified Mechanics Near You',
    description: 'Find trusted mechanics in your area and book service in minutes.'
  },
  {
    imagePath: im2,
    title: 'Vehicles From Verified Sellers',
    description: 'Explore listings and compare prices before you buy your next car.'
  },
  {
    imagePath: im3,
    title: 'Parts and Accessories Marketplace',
    description: 'Get quality parts with simple checkout and order tracking.'
  },
  {
    imagePath: im4,
    title: 'All Activity In One Dashboard',
    description: 'Track bookings, purchases, and service history from a single place.'
  }
]

const activeStat = computed(() => stats.find((item) => item.id === selectedStatId.value) || stats[0])

function openRoute(route) {
  router.push(route)
}

function selectStat(id) {
  selectedStatId.value = id
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

function setSlide(index) {
  currentSlide.value = index
}

function stopAuto() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

function startAuto() {
  stopAuto()
  timerId = setInterval(() => {
    nextSlide()
  }, 5500)
}

onMounted(() => {
  startAuto()
})

onBeforeUnmount(() => {
  stopAuto()
})
</script>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 18px;
}

.hero {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 16px;
}

.hero-copy,
.hero-panel {
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #dce3ec;
  padding: 22px;
}

.hero-copy {
  background: linear-gradient(135deg, #0f2f52 0%, #16436f 45%, #0c66e4 100%);
  color: #f5fbff;
  border: none;
}

.hero-kicker {
  margin: 0;
  font-size: 12px;
  letter-spacing: 1.2px;
  opacity: 0.85;
}

.hero-title {
  margin: 8px 0 8px;
  font-size: clamp(28px, 3vw, 36px);
  line-height: 1.12;
}

.hero-subtitle {
  margin: 0;
  max-width: 560px;
  line-height: 1.6;
  opacity: 0.92;
}

.hero-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: #ffffff;
  color: #123257;
}

.btn-outline {
  border: 1px solid rgba(255, 255, 255, 0.55);
  color: #f5fbff;
}

.hero-panel h3 {
  margin: 0 0 10px;
  color: #17395f;
}

.snapshot-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.snap-item {
  border: 1px solid #dce3ec;
  border-radius: 10px;
  padding: 10px;
  background: #f7fbff;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.snap-item:hover {
  transform: translateY(-2px);
  border-color: #8cb8ef;
  box-shadow: 0 8px 18px rgba(12, 102, 228, 0.12);
}

.snap-item p {
  margin: 0;
  color: #516274;
  font-size: 12px;
}

.snap-item strong {
  display: block;
  margin-top: 4px;
  color: #123257;
  font-size: 22px;
}

.snap-meta {
  display: block;
  margin-top: 2px;
  font-size: 11px;
  color: #4f82bc;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.stat-card {
  background: #fff;
  border: 1px solid #dce3ec;
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover,
.stat-card:focus-visible {
  transform: translateY(-2px);
  border-color: #9dc2ef;
  box-shadow: 0 8px 18px rgba(10, 64, 123, 0.1);
  outline: none;
}

.stat-card.active {
  border-color: #0c66e4;
  box-shadow: 0 10px 20px rgba(12, 102, 228, 0.15);
}

.stat-label {
  margin: 0;
  color: #5d6b7a;
  font-size: 12px;
}

.stat-value {
  margin: 8px 0 4px;
  color: #132238;
  font-size: 28px;
}

.stat-change {
  color: #0c66e4;
  font-size: 12px;
  font-weight: 700;
}

.stat-insight {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border: 1px solid #dce3ec;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px 16px;
}

.insight-kicker {
  margin: 0;
  font-size: 11px;
  color: #4d6076;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.stat-insight h3 {
  margin: 4px 0;
  font-size: 20px;
  color: #143156;
}

.insight-copy {
  margin: 0;
  font-size: 13px;
  color: #4a5c71;
  max-width: 760px;
}

.insight-btn {
  text-decoration: none;
  background: linear-gradient(135deg, #0c66e4, #0a4aa3);
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 12px;
}

.carousel-card,
.quick-card {
  background: #fff;
  border: 1px solid #dce3ec;
  border-radius: 12px;
  padding: 12px;
}

.slide-image {
  height: 270px;
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: relative;
}

.slide-nav {
  position: absolute;
  top: 12px;
  z-index: 2;
  border: 1px solid rgba(255, 255, 255, 0.45);
  background: rgba(8, 28, 52, 0.45);
  color: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;
}

.slide-nav.prev {
  left: 10px;
}

.slide-nav.next {
  right: 10px;
}

.overlay {
  position: absolute;
  inset: auto 0 0 0;
  padding: 16px;
  background: linear-gradient(180deg, rgba(10, 28, 47, 0.1), rgba(10, 28, 47, 0.82));
  color: #fff;
}

.overlay h3 {
  margin: 0 0 6px;
}

.overlay p {
  margin: 0;
  opacity: 0.92;
}

.slide-dots {
  margin-top: 10px;
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: #c5d3e6;
  cursor: pointer;
}

.dot.active {
  width: 26px;
  background: #0c66e4;
}

.quick-card h3 {
  margin: 6px 4px 12px;
  color: #16365b;
}

.quick-list {
  display: grid;
  gap: 8px;
}

.quick-link {
  text-decoration: none;
  color: #17395f;
  border: 1px solid #dce3ec;
  border-radius: 10px;
  padding: 12px;
  background: #f8fbff;
  font-weight: 600;
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.quick-link:hover {
  border-color: #0c66e4;
  color: #0c66e4;
  transform: translateY(-2px);
}

@media (max-width: 1100px) {
  .hero,
  .feature-grid,
  .stat-insight {
    grid-template-columns: 1fr;
  }

  .stat-insight {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .hero-title {
    font-size: 26px;
  }

  .stats-row,
  .snapshot-grid {
    grid-template-columns: 1fr;
  }

  .slide-image {
    height: 220px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
