<template>
  <div class="app-layout">
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img class="logo-image" alt="Company Logo">
        </div>
        <div class="company-info">
          <h1 class="company-name">{{ companyname }}</h1>
          <h3 class="slogan">{{ slogan }}</h3>
        </div>
      </div>
    </header>

    <div class="search-container">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="search" class="search" placeholder="Search services, mechanics, or bookings...">
      </div>
    </div>

    <div class="main-wrapper">
      <nav :class="['side-bar', { collapsed: !sidebarOpen }]">
        <div :class="['side-inner', { collapsed: !sidebarOpen }]" :aria-hidden="!sidebarOpen">
          <div class="side-header">
            <div>
              <h2 class="nav-heading">SERVICES</h2>
              <h5 class="mini-heading">Welcome back!</h5>
            </div>
          </div>
          <ul class="nav-list">
            <li><router-link to="/dashboard" class="nav-link"><span class="label">Dashboard</span></router-link></li>
            <li><router-link to="/spares" class="nav-link"><span class="label">Spares</span></router-link></li>
            <li><router-link to="/dealership" class="nav-link"><span class="label">Dealership</span></router-link></li>
            <li><router-link to="/mechanics" class="nav-link"><span class="label">Mechanics</span></router-link></li>
            <li><router-link to="/mechanic-requests" class="nav-link"><span class="label">Requests</span></router-link></li>
            <li><router-link to="/bookings" class="nav-link"><span class="label">Bookings</span></router-link></li>
            <li><router-link to="/profile" class="nav-link"><span class="label">Profile</span></router-link></li>
            <li><router-link to="/checkout" class="nav-link"><span class="label">Checkout</span></router-link></li>
            <li><router-link to="/orders" class="nav-link"><span class="label">Orders</span></router-link></li>
            <li><router-link to="/history" class="nav-link"><span class="label">History</span></router-link></li>
          </ul>
        </div>
      </nav>

      <button
        class="toggle-btn"
        @click="toggleSidebar"
        aria-label="Toggle sidebar">
        {{ sidebarOpen? '‹' : '›' }}
      </button>

      <main class="dash-main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const companyname = 'MECHANIC CONNECT'
const slogan = 'Quality Car Parts & Accessories'
const sidebarOpen = ref(true)

function toggleSidebar() { sidebarOpen.value = !sidebarOpen.value }
</script>
