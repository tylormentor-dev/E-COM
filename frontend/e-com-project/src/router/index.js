import { createRouter, createWebHistory } from 'vue-router'
import Login from '../log-in.vue'
import dashboard from '@/dashboard.vue'
import dealership from '@/cars-delerships.vue'
import spares from '@/spares.vue'
import register from '@/signup.vue'
import mechanics from '@/mechanics.vue'
import profile from '@/profile.vue'
import orders from '@/orders.vue'
import checkout from '@/checkout.vue'
import bookings from '@/bookings.vue'



const routes = [
  { path: '/', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/dashboard', name: 'Dashboard', component: dashboard, meta: { requiresAuth: true } },
  { path: '/dealership', name: 'Dealership', component: dealership, meta: { requiresAuth: true } },
  { path: '/spares', name: 'Spares', component: spares, meta: { requiresAuth: true } },
  { path: '/register', name: 'Register', component: register, meta: { requiresAuth: false } },
  { path: '/mechanics', name: 'Mechanics', component: mechanics, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: profile, meta: { requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: orders, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: checkout, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', redirect: '/' },// catch-all route to redirect to login
  { path: '/bookings', name: 'Bookings', component: bookings, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Route guard: Check authentication before each route
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/') // Redirect to login
  }
  // If user tries to go to login/register but is already authenticated
  else if (!to.meta.requiresAuth && isAuthenticated && (to.path === '/' || to.path === '/register')) {
    next('/dashboard') // Redirect to dashboard
  }
  else {
    next() // Allow navigation
  }
})

export default router
