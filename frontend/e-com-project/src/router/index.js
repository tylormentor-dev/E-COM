import { createRouter, createWebHistory } from 'vue-router'
import Login from '../log-in.vue'
import dashboard from '@/dashboard.vue'
import dealership from '@/cars-delerships.vue'
import spares from '@/spares.vue'
import register from '@/signup.vue'



const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: dashboard },
  { path: '/dealership', name: 'Dealership', component: dealership },
  { path: '/spares', name: 'Spares', component: spares},
  { path: '/register', name: 'Register', component: register },

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
