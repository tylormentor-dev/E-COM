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
            <div class="snap-item">
              <p>Open Orders</p>
              <strong>12</strong>
            </div>
            <div class="snap-item">
              <p>Pending Bookings</p>
              <strong>4</strong>
            </div>
            <div class="snap-item">
              <p>Saved Vehicles</p>
              <strong>9</strong>
            </div>
            <div class="snap-item">
              <p>Unread Alerts</p>
              <strong>3</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-row">
        <article class="stat-card" v-for="item in stats" :key="item.label">
          <p class="stat-label">{{ item.label }}</p>
          <h3 class="stat-value">{{ item.value }}</h3>
          <span class="stat-change">{{ item.change }}</span>
        </article>
      </section>

      <section class="feature-grid">
        <article class="carousel-card">
          <div class="slide-image" :style="{ backgroundImage: `url(${slides[currentSlide].imagePath})` }">
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
              @click="currentSlide = idx"
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
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import im1 from '@/assets/images/image4.jpg'
import im5 from '@/assets/images/download.jpg'
import im3 from '@/assets/images/download5.jpg'
import im4 from '@/assets/images/images6.jpg'

const currentSlide = ref(0)
let timerId = null

const slides = [
  {
    imagePath: im1,
    title: 'Certified Mechanics Near You',
    description: 'Find trusted mechanics in your area and book service in minutes.'
  },
  {
    imagePath: im5,
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

const stats = [
  { label: 'Mechanics in network', value: '250+', change: '+8% this month' },
  { label: 'Vehicles listed', value: '1,420', change: '+11% this month' },
  { label: 'Completed bookings', value: '3,860', change: '+6% this month' },
  { label: 'Average customer rating', value: '4.7/5', change: 'Stable' }
]

onMounted(() => {
  timerId = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length
  }, 6000)
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
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
  font-size: 34px;
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
}

.btn {
  text-decoration: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
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
}

.quick-link:hover {
  border-color: #0c66e4;
  color: #0c66e4;
}

@media (max-width: 1100px) {
  .hero,
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .stats-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .hero-title {
    font-size: 26px;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .snapshot-grid {
    grid-template-columns: 1fr;
  }
}
</style>
