<template>
  <div class="layout-root">
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

    <aside :class="['sidebar', { collapsed: !sidebarOpen, open: mobileMenuOpen }]">
      <div class="sidebar-top">
        <div class="brand-block">
          <div class="brand-mark">MC</div>
          <div v-if="sidebarOpen" class="brand-copy">
            <p class="brand-kicker">Garage Suite</p>
            <h1>Mechanic Connect</h1>
          </div>
        </div>

        <nav class="nav-list" aria-label="Primary navigation">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :class="['nav-item', { 'is-active': route.path === item.to }]"
            @click="closeMobileMenu"
          >
            <span class="nav-icon">{{ item.icon }}</span>
            <span v-if="sidebarOpen" class="nav-copy">
              <span class="nav-label">{{ item.label }}</span>
              <span class="nav-meta">{{ item.meta }}</span>
            </span>
          </RouterLink>
        </nav>
      </div>

      <div v-if="sidebarOpen" class="visual-stack">
        <article class="visual-card" :style="{ backgroundImage: `url(${vehicleImage})` }">
          <div class="visual-overlay">
            <p>Vehicle Listings</p>
            <strong>Find your next car faster</strong>
          </div>
        </article>

        <article class="visual-card parts" :style="{ backgroundImage: `url(${partsImage})` }">
          <div class="visual-overlay">
            <p>Mechanical Parts</p>
            <strong>Browse quality spares and accessories</strong>
          </div>
        </article>
      </div>

      <div class="sidebar-footer">
        <div v-if="sidebarOpen" class="user-card">
          <div class="user-avatar">{{ userInitial }}</div>
          <div>
            <p class="user-name">{{ userName }}</p>
            <p class="user-role">{{ userRole }}</p>
          </div>
        </div>

        <button class="logout-btn" @click="logout">
          <span class="logout-mark">LO</span>
          <span v-if="sidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <div class="layout-shell">
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="toggleMobileMenu">Menu</button>
          <button class="collapse-btn" @click="toggleSidebar">{{ sidebarOpen ? 'Collapse' : 'Expand' }}</button>
          <div class="title-wrap">
            <h2 class="route-title">{{ routeTitle }}</h2>
            <p class="route-subtitle">{{ routeSubtitle }}</p>
          </div>
        </div>

        <div class="topbar-right">
          <div class="search-wrap">
            <input
              v-model="searchText"
              class="search-input"
              type="search"
              placeholder="Search vehicles, parts, bookings"
            />
          </div>
          <div class="status-pill">Live</div>
        </div>
      </header>

      <main class="content-area">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import partsImage from '@/assets/images/download5.jpg'
import vehicleImage from '@/assets/images/image4.jpg'

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const mobileMenuOpen = ref(false)
const searchText = ref('')

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: 'DB', meta: 'Overview and stats' },
  { to: '/mechanics', label: 'Mechanics', icon: 'ME', meta: 'Find and book experts' },
  { to: '/mechanic-requests', label: 'Requests', icon: 'RQ', meta: 'Incoming service requests' },
  { to: '/bookings', label: 'Bookings', icon: 'BK', meta: 'Manage appointments' },
  { to: '/dealership', label: 'Dealership', icon: 'DL', meta: 'Browse listed vehicles' },
  { to: '/spares', label: 'Spares', icon: 'SP', meta: 'Mechanical parts catalog' },
  { to: '/checkout', label: 'Checkout', icon: 'CO', meta: 'Review and pay' },
  { to: '/orders', label: 'Orders', icon: 'OR', meta: 'Track purchases' },
  { to: '/history', label: 'History', icon: 'HS', meta: 'Past activity' },
  { to: '/profile', label: 'Profile', icon: 'PR', meta: 'Account settings' }
]

const currentNavItem = computed(() => navItems.find((item) => item.to === route.path))

const userName = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.fullname || user.name || user.email || 'User'
  } catch {
    return 'User'
  }
})

const userInitial = computed(() => String(userName.value).charAt(0).toUpperCase() || 'U')

const userRole = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const role = String(user.role || 'customer')
    return role.charAt(0).toUpperCase() + role.slice(1)
  } catch {
    return 'Customer'
  }
})

const routeTitle = computed(() => currentNavItem.value?.label || String(route.name || 'Dashboard'))
const routeSubtitle = computed(() => currentNavItem.value?.meta || 'Manage your vehicles, parts, and services')

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}
</script>

<style scoped>
.layout-root {
  --bg: #edf2f8;
  --surface: #ffffff;
  --ink: #122136;
  --muted: #627086;
  --line: #d5deea;
  --accent: #0b7d69;
  --accent-strong: #065f51;
  --nav-start: #0f2135;
  --nav-mid: #16314f;
  --nav-end: #11253d;
  min-height: 100vh;
  display: flex;
  background: radial-gradient(circle at 10% -20%, #dbeeff 0%, #edf2f8 42%, #edf2f8 100%);
  color: var(--ink);
  font-family: Poppins, 'Trebuchet MS', sans-serif;
}

.sidebar {
  width: 310px;
  background: linear-gradient(180deg, var(--nav-start) 0%, var(--nav-mid) 40%, var(--nav-end) 100%);
  color: #e8f2ff;
  padding: 16px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.14);
  position: relative;
  overflow: hidden;
  transition: width 0.24s ease;
  z-index: 20;
}

.sidebar::before {
  content: '';
  position: absolute;
  top: -140px;
  right: -60px;
  width: 260px;
  height: 260px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(68, 124, 212, 0.35), rgba(68, 124, 212, 0));
  pointer-events: none;
}

.sidebar.collapsed {
  width: 96px;
}

.sidebar-top {
  display: grid;
  gap: 12px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  background: rgba(7, 17, 29, 0.35);
}

.brand-mark {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1ba88d, #0b7d69);
  display: grid;
  place-items: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.brand-copy {
  min-width: 0;
}

.brand-kicker {
  margin: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  opacity: 0.72;
}

.brand-copy h1 {
  margin: 2px 0 0;
  font-size: 16px;
  line-height: 1.2;
}

.nav-list {
  display: grid;
  gap: 7px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  text-decoration: none;
  color: #dcecff;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.02);
  transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
  animation: navFade 0.34s ease both;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(156, 204, 255, 0.3);
  transform: translateX(3px);
}

.nav-item.is-active {
  background: linear-gradient(135deg, rgba(11, 125, 105, 0.35), rgba(23, 171, 145, 0.2));
  border-color: rgba(113, 219, 201, 0.45);
}

.nav-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.13);
  color: #f5fbff;
  flex-shrink: 0;
}

.nav-copy {
  min-width: 0;
  display: grid;
}

.nav-label {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-meta {
  margin-top: 2px;
  font-size: 11px;
  color: rgba(225, 239, 255, 0.78);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.visual-stack {
  margin-top: 10px;
  display: grid;
  gap: 10px;
}

.visual-card {
  height: 96px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.24);
  background-size: cover;
  background-position: center;
  position: relative;
}

.visual-card.parts {
  height: 82px;
}

.visual-overlay {
  position: absolute;
  inset: 0;
  padding: 10px;
  background: linear-gradient(160deg, rgba(6, 14, 24, 0.15), rgba(6, 14, 24, 0.8));
  display: grid;
  align-content: end;
}

.visual-overlay p {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.7px;
  text-transform: uppercase;
  opacity: 0.85;
}

.visual-overlay strong {
  margin-top: 3px;
  font-size: 12px;
  font-weight: 700;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  display: grid;
  gap: 9px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 9px;
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1ba88d, #0b7d69);
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
}

.user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.user-role {
  margin: 2px 0 0;
  font-size: 11px;
  opacity: 0.76;
}

.logout-btn {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(3, 10, 19, 0.3);
  color: #e8f2ff;
  border-radius: 10px;
  padding: 9px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logout-mark {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.14);
  font-size: 10px;
  font-weight: 700;
}

.layout-shell {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  min-height: 78px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(7px);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.title-wrap {
  min-width: 0;
}

.route-title {
  margin: 0;
  font-size: 20px;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.route-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-wrap {
  width: min(420px, 40vw);
}

.search-input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: #ffffff;
  color: var(--ink);
  padding: 0 12px;
}

.search-input:focus {
  outline: none;
  border-color: rgba(11, 125, 105, 0.7);
  box-shadow: 0 0 0 3px rgba(11, 125, 105, 0.16);
}

.status-pill {
  border-radius: 999px;
  border: 1px solid #bddfd8;
  background: #e9f7f4;
  color: #0b7d69;
  font-size: 11px;
  font-weight: 700;
  padding: 8px 11px;
}

.mobile-menu-btn,
.collapse-btn {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
}

.mobile-menu-btn {
  display: none;
}

.content-area {
  padding: 22px;
}

.mobile-overlay {
  display: none;
}

@keyframes navFade {
  from {
    opacity: 0;
    transform: translateX(-8px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1100px) {
  .search-wrap {
    width: 260px;
  }
}

@media (max-width: 980px) {
  .mobile-menu-btn {
    display: inline-flex;
  }

  .collapse-btn {
    display: none;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: -320px;
    width: 300px;
    transition: left 0.24s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 15;
    background: rgba(8, 17, 27, 0.5);
  }

  .search-wrap {
    width: 210px;
  }
}

@media (max-width: 680px) {
  .topbar {
    padding: 0 12px;
  }

  .route-title {
    font-size: 17px;
  }

  .route-subtitle,
  .status-pill,
  .search-wrap {
    display: none;
  }

  .content-area {
    padding: 14px;
  }
}
</style>
