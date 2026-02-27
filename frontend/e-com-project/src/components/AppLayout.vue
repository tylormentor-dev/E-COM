<template>
  <div class="layout-root">
    <div v-if="mobileMenuOpen" class="mobile-overlay" @click="closeMobileMenu"></div>

    <aside :class="['sidebar', { collapsed: !sidebarOpen, open: mobileMenuOpen }]">
      <div class="brand-block">
        <div class="brand-mark">MC</div>
        <div v-if="sidebarOpen" class="brand-copy">
          <h1>Mechanic Connect</h1>
          <p>Auto services platform</p>
        </div>
      </div>

      <nav class="nav-list">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          @click="closeMobileMenu"
        >
          <span class="nav-badge">{{ item.badge }}</span>
          <span v-if="sidebarOpen" class="nav-label">{{ item.label }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div v-if="sidebarOpen" class="user-card">
          <p class="user-name">{{ userName }}</p>
          <p class="user-role">{{ userRole }}</p>
        </div>
        <button class="logout-btn" @click="logout">
          <span class="nav-badge">LO</span>
          <span v-if="sidebarOpen">Logout</span>
        </button>
      </div>
    </aside>

    <div class="layout-shell">
      <header class="topbar">
        <div class="topbar-left">
          <button class="mobile-menu-btn" @click="toggleMobileMenu">Menu</button>
          <button class="collapse-btn" @click="toggleSidebar">
            {{ sidebarOpen ? 'Collapse' : 'Expand' }}
          </button>
          <h2 class="route-title">{{ routeTitle }}</h2>
        </div>

        <div class="search-wrap">
          <input
            v-model="searchText"
            class="search-input"
            type="search"
            placeholder="Search services, bookings, parts"
          />
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

const route = useRoute()
const router = useRouter()

const sidebarOpen = ref(true)
const mobileMenuOpen = ref(false)
const searchText = ref('')

const navItems = [
  { to: '/dashboard', label: 'Dashboard', badge: 'DB' },
  { to: '/mechanics', label: 'Mechanics', badge: 'ME' },
  { to: '/bookings', label: 'Bookings', badge: 'BK' },
  { to: '/dealership', label: 'Dealership', badge: 'DL' },
  { to: '/spares', label: 'Spares', badge: 'SP' },
  { to: '/orders', label: 'Orders', badge: 'OR' },
  { to: '/checkout', label: 'Checkout', badge: 'CO' },
  { to: '/profile', label: 'Profile', badge: 'PR' }
]

const userName = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.fullname || user.name || user.email || 'User'
  } catch {
    return 'User'
  }
})

const userRole = computed(() => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return (user.role || 'customer').toUpperCase()
  } catch {
    return 'CUSTOMER'
  }
})

const routeTitle = computed(() => String(route.name || 'Dashboard'))

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
  --bg: #f3f6fb;
  --panel: #ffffff;
  --text: #132238;
  --muted: #5d6b7a;
  --line: #dce3ec;
  --accent: #0c66e4;
  --accent-strong: #094eb0;
  min-height: 100vh;
  background: radial-gradient(1200px 500px at 20% -10%, #ddeafe 0%, #f3f6fb 45%, #f3f6fb 100%);
  display: flex;
}

.sidebar {
  width: 268px;
  background: linear-gradient(180deg, #102642 0%, #173d67 45%, #0f2f52 100%);
  color: #eaf2fe;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.14);
  transition: width 0.2s ease;
  z-index: 20;
}

.sidebar.collapsed {
  width: 92px;
}

.brand-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #49a0ff, #0c66e4);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.brand-copy h1 {
  font-size: 16px;
  margin: 0;
}

.brand-copy p {
  margin: 2px 0 0;
  font-size: 12px;
  opacity: 0.75;
}

.nav-list {
  margin-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 10px;
  color: #d6e6ff;
  text-decoration: none;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, rgba(73, 160, 255, 0.24), rgba(12, 102, 228, 0.28));
  color: #ffffff;
  box-shadow: inset 0 0 0 1px rgba(128, 191, 255, 0.28);
}

.nav-badge {
  min-width: 32px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.14);
}

.nav-label {
  font-size: 14px;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.user-card {
  padding: 8px 10px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.09);
}

.user-name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
}

.user-role {
  margin: 3px 0 0;
  font-size: 11px;
  letter-spacing: 0.4px;
  opacity: 0.85;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(6, 18, 32, 0.25);
  color: #eaf2fe;
  border-radius: 10px;
  padding: 10px 10px;
  cursor: pointer;
}

.layout-shell {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 72px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid var(--line);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.mobile-menu-btn,
.collapse-btn {
  border: 1px solid var(--line);
  background: var(--panel);
  color: var(--text);
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
}

.mobile-menu-btn {
  display: none;
}

.route-title {
  margin: 0 0 0 2px;
  color: var(--text);
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-wrap {
  width: min(420px, 45vw);
}

.search-input {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--line);
  padding: 0 12px;
  color: var(--text);
  background: #fff;
}

.content-area {
  padding: 22px;
}

.mobile-overlay {
  display: none;
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
    left: -290px;
    top: 0;
    bottom: 0;
    width: 270px;
    transition: left 0.2s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(4, 12, 21, 0.45);
    z-index: 15;
  }

  .search-wrap {
    width: 180px;
  }
}

@media (max-width: 640px) {
  .topbar {
    padding: 0 12px;
  }

  .route-title {
    font-size: 15px;
  }

  .search-wrap {
    display: none;
  }

  .content-area {
    padding: 14px;
  }
}
</style>
