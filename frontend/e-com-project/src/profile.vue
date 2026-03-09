<template>
  <AppLayout>
    <div class="profile-page">
      <div v-if="loading" class="loading">Loading profile...</div>

      <div v-if="error" class="error-message">{{ error }}</div>

      <div v-if="user && !loading" class="profile-container">
      <div class="profile-header-card">
        <div class="profile-image">
          <img v-if="user.profile_image" :src="user.profile_image" :alt="user.fullname">
          <div v-else class="placeholder-image">{{ user.fullname.charAt(0).toUpperCase() }}</div>
        </div>
        <div class="profile-name-section">
          <h2>{{ user.fullname }}</h2>
          <p class="role-badge" :class="user.role">{{ user.role }}</p>
        </div>
      </div>

      <div class="profile-details">
        <div class="detail-section">
          <h3>Contact Information</h3>
          <div class="detail-row">
            <label>Email:</label>
            <span>{{ user.email || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>Phone:</label>
            <span>{{ user.phone || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>Address:</label>
            <span>{{ user.address || 'N/A' }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Personal Information</h3>
          <div class="detail-row">
            <label>Date of Birth:</label>
            <span>{{ formatDate(user.dob) || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>ID Number:</label>
            <span>{{ user.id_number || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>User ID:</label>
            <span>{{ user.id }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3>Account Information</h3>
          <div class="detail-row">
            <label>Account Type:</label>
            <span>{{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}</span>
          </div>
          <div class="detail-row">
            <label>Member Since:</label>
            <span>{{ formatDate(user.created_at) || 'N/A' }}</span>
          </div>
          <div class="detail-row">
            <label>Last Updated:</label>
            <span>{{ formatDate(user.updated_at) || 'N/A' }}</span>
          </div>
        </div>
      </div>

        <div class="profile-actions">
          <button @click="editProfile" class="action-btn edit-btn">Edit Profile</button>
          <button @click="changePassword" class="action-btn change-pwd-btn">Change Password</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from './components/AppLayout.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({ baseURL: 'http://localhost:3000' })

const user = ref(null)
const loading = ref(true)
const error = ref('')

async function fetchUserProfile() {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/')
      return
    }

    const res = await api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    user.value = res.data
    loading.value = false
  } catch (err) {
    console.error('Error fetching profile:', err)
    error.value = err?.response?.data?.error || 'Failed to load profile'
    loading.value = false
    if (err?.response?.status === 401) {
      router.push('/')
    }
  }
}

function formatDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function handleLogout() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/')
}

function editProfile() {
  alert('Edit profile feature coming soon!')
}

function changePassword() {
  alert('Change password feature coming soon!')
}

onMounted(() => {
  fetchUserProfile()
})
</script>

<style scoped>
.profile-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-header h1 {
  color: #333;
  font-size: 32px;
  margin: 0;
}

.logout-btn {
  padding: 10px 20px;
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.loading {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  font-size: 18px;
  color: #666;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.profile-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-header-card {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image {
  flex-shrink: 0;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #667eea;
  object-fit: cover;
}

.placeholder-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  border: 4px solid #667eea;
}

.profile-name-section {
  flex: 1;
}

.profile-name-section h2 {
  margin: 0 0 10px 0;
  font-size: 28px;
  color: #333;
}

.role-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.customer {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.role-badge.mechanic {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.role-badge.admin {
  background: linear-gradient(135deg, #fa709a, #fee140);
  color: white;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detail-section {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row label {
  font-weight: 600;
  color: #666;
  min-width: 120px;
}

.detail-row span {
  color: #333;
  text-align: right;
  flex: 1;
  padding-left: 20px;
  word-break: break-word;
}

.profile-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 20px;
}

.action-btn {
  padding: 12px 30px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.change-pwd-btn {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

.change-pwd-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.3);
}

@media (max-width: 768px) {
  .profile-page {
    padding: 10px;
  }

  .profile-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .profile-header h1 {
    font-size: 24px;
  }

  .profile-header-card {
    flex-direction: column;
    text-align: center;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }

  .detail-row {
    flex-direction: column;
    gap: 5px;
  }

  .detail-row span {
    text-align: left;
    padding-left: 0;
  }

  .profile-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
