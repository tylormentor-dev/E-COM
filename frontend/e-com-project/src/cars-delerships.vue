<template>
  <div class="dealership-container">
    <!-- Header (same as dashboard) -->
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

    <!-- Search Container (same as dashboard) -->
    <div class="search-container">
      <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="search" class="search" placeholder="Search cars by model, price, year...">
      </div>
    </div>

    <div class="main-wrapper">
      <!-- Sidebar (same as dashboard) -->
      <nav :class="['side-bar', { collapsed: !sidebarOpen }]">
        <div :class="['side-inner', { collapsed: !sidebarOpen }]" :aria-hidden="!sidebarOpen">
          <div class="side-header">
            <div>
              <h2 class="nav-heading">DEALERSHIP</h2>
              <h5 class="mini-heading">Browse our certified deals</h5>
            </div>
          </div>
          <ul class="nav-list">
            <li><router-link to="/dashboard" class="nav-link"><span class="label">Dashboard</span></router-link></li>
            <li><router-link to="/spares" class="nav-link"><span class="label">Spares</span></router-link></li>
            <li><router-link to="/dealership" class="nav-link active"><span class="label">Dealership</span></router-link></li>
            <li><router-link to="/mechanics" class="nav-link"><span class="label">Mechanics</span></router-link></li>
            <li><router-link to="/bookings" class="nav-link"><span class="label">Bookings</span></router-link></li>
            <li><router-link to="/profile" class="nav-link"><span class="label">Profile</span></router-link></li>
            <li><router-link to="/orders" class="nav-link"><span class="label">Orders</span></router-link></li>
            <li><router-link to="/history" class="nav-link"><span class="label">History</span></router-link></li>
          </ul>
        </div>
      </nav>

      <!-- Toggle Button -->
      <button
        class="toggle-btn"
        @click="toggleSidebar"
        aria-label="Toggle sidebar">
        {{ sidebarOpen? '‹' : '›' }}
      </button>

      <main class="dealership-main">
        <!-- Vehicle Type Navigation -->
        <div class="vehicle-nav">
          <button 
            v-for="type in vehicleTypes" 
            :key="type.id"
            :class="['vehicle-nav-btn', { active: selectedVehicleType === type.id }]"
            @click="selectedVehicleType = type.id">
            <span class="type-name">{{ type.name }}</span>
          </button>
        </div>

        <!-- Category Filters -->
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
            <span class="category-dot" aria-hidden="true"></span>
            <span class="category-label">{{ category.name }}</span>
            <span class="category-count">({{ getCategoryCount(category.id) }})</span>
          </label>
        </div>

        

        <!-- Cars Grid -->
        <div class="cars-section">
          <h2 class="section-title">{{ getSectionTitle() }}</h2>
          <div v-if="filteredCars.length > 0" class="cars-grid">
           <div v-for="car in filteredCars" :key="car.id" class="car-card">
              <div class="car-image-container">
                <img :src="car.image" :alt="car.name" class="car-image">
                <div class="car-badge" :class="car.category">{{ car.category }}</div>
                <div class="car-overlay">
                  <button class="view-details-btn">View Details</button>
                </div>
              </div>
              <div class="car-info">
                <h3 class="car-name">{{ car.name }}</h3>
<p class="car-model">{{ car.model }} • {{ car.year }}</p>

<div class="car-specs">
  <span class="spec"><span class="spec-icon">⛽</span>{{ car.fuel_capacity}}</span>
  <span class="spec"><span class="spec-icon">⚙️</span>{{ car.transmission }}</span>
  <span class="spec"><span class="spec-icon">📊</span>{{ car.km_driven }}km</span>
  <span class="spec"><span class="spec-icon"></span>{{ car.document_proof }}</span>
</div>

<div class="car-footer">
  <div class="car-price">
    <span class="price-label">Price</span>
    <span class="price-value">R{{ car.price }}</span>
  </div>
  <button class="buy-btn">Buy Now</button>
</div>0

                <div class="car-footer">
                  <div class="car-price">
                    <span class="price-label">Price</span>
                    <span class="price-value">R{{ cars.price }}</span>
                  </div>
                  <button class="buy-btn">Buy Now</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-cars">
            <div class="no-cars-icon">🚫</div>
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters to see available vehicles</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
  return {
    cars: [],
    sidebarOpen: true,   
    selectedCategory: "all",
    selectedVehicleType: "all",
      categories: [
        { id: "all", name: "All" },
        { id: "new", name: "New" },
        { id: "used", name: "Used" }
      ],

      vehicleTypes: [
        { id: "all", name: "All Vehicles" },
        { id: "sedan", name: "Sedan" },
        { id: "suv", name: "SUV" },
        { id: "hatchback", name: "Hatchback" },
        { id: "truck", name: "Truck" }
      ]
    };
  },

  computed: {
    filteredCars() {
      return this.cars.filter(car => {

        const categoryMatch =
          this.selectedCategory === "all" ||
          car.category === this.selectedCategory;

        const typeMatch =
          this.selectedVehicleType === "all" ||
          car.vehicleType === this.selectedVehicleType;

        return categoryMatch && typeMatch;
      });
    }
  },

  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },

    getCategoryCount(categoryId) {
      if (categoryId === "all") return this.cars.length;
      return this.cars.filter(car => car.category === categoryId).length;
    },

    getSectionTitle() {
      if (this.selectedCategory === "all") {
        return "All Vehicles";
      }
      return `${this.selectedCategory.toUpperCase()} Vehicles`;
    },
  },

  async mounted() {
  try {
    const response = await axios.get("http://localhost:3000/cars");
    this.cars = response.data;
    console.log("Cars loaded:", this.cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dealership-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Header (Same as Dashboard) */
.header {
  background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 20px 40px;
  border-bottom: 3px solid rgba(212, 212, 212, 0.61);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.6s ease-out;
  position: relative;
  z-index: 8;
  width: 100%;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid rgba(173, 174, 180, 0.692);
  background-image: url(images.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 5px;
  box-shadow: 0 0 15px rgba(246, 247, 252, 0.5);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.company-info {
  color: white;
  flex: 1;
}

.company-name {
  font-size: 36px;
  font-weight: bold;
  background: linear-gradient(135deg, #001a8d 0%, #4ea3e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 5px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeInLeft 0.8s ease-out;
  letter-spacing: 0.5px;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slogan {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  animation: fadeInLeft 0.8s ease-out 0.1s both;
  letter-spacing: 0.3px;
}

.header-icons {
  display: flex;
  gap: 20px;
  align-items: center;
}

.header-icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.3);
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
}

/* Search Container */
.search-container {
  background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 15px 40px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 7;
  position: relative;
}

.search-bar {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #bbb;
}

.search {
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
  color: #3a3a3a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 15px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.search::placeholder {
  color: #999;
}

h2, h5 {
  color: #4ea3e9;
}

/* Main Wrapper */
.main-wrapper {
  display: flex;
  flex: 1;
  position: relative;
  overflow: hidden;
}

/* Sidebar */
.side-bar {
  padding: 1px;
  box-sizing: border-box;
  box-shadow: 0 20px 60px rgba(179, 178, 178, 0.6);
  width: 250px;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(im.jpg);
  background-position: center;
  position: relative;
  overflow-y: auto;
  transform-origin: left center;
  transition: transform 220ms cubic-bezier(.2, .9, .2, 1), width 220ms cubic-bezier(.2, .9, .2, 1), opacity 220ms ease;
  transform: scaleX(1);
  opacity: 1;
  z-index: 6;
  margin: 2px 0px
}

.side-bar.collapsed {
  transform: scaleX(0.18);
  opacity: 0.02;
}

.side-inner {
  padding: 20px 15px;
  height: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);
}

.side-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.nav-heading {
  font-size: 16px;
  color: #4ea3e9;
  font-weight: 700;
  letter-spacing: 1px;
}

.mini-heading {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400px;
  margin-top: 5px;
}

.toggle-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  position: absolute;
  top: 130px;
  left: 232px;
  z-index: 50;
  pointer-events: auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  transition: left 220ms cubic-bezier(.2, .9, .2, 1), background 160ms ease, transform 160ms ease;
  font-weight: bold;
}

.toggle-btn:hover {
  background: linear-gradient(135deg, #0d47a1 0%, #001a8d 100%);
  box-shadow: 0 8px 24px rgba(31, 111, 235, 0.4);
  transform: scale(1.05);
}

.nav-list {
  margin-top: 10px;
  list-style: none;
  padding: 0;
}

.nav-list li {
  margin-bottom: 8px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: #4ea3e9;
  background: rgba(78, 163, 233, 0.1);
  padding-left: 16px;
}

.nav-link.active {
  color: #1f6feb;
  font-weight: bold;
  background: rgba(31, 111, 235, 0.15);
  border-left: 3px solid #1f6feb;
  padding-left: 14px;
}

.nav-icon {
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.label {
  display: inline-block;
  transition: opacity 160ms ease, transform 160ms ease, visibility 0s linear 0s;
  opacity: 1;
  padding:5px;
  font-size: 17px;
  font-weight: 500px;
}

.side-inner.collapsed .label {
  opacity: 0;
  transform: translateX(-6px);
  visibility: hidden;
}

a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
}

/* Main Content */
.dealership-main {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
  max-width: 1400px;
  width: 100%;
}

/* Vehicle Type Navigation */
.vehicle-nav {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.vehicle-nav-btn {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
  transition: all 0.3s ease;
}

.vehicle-nav-btn:hover {
  border-color: #1f6feb;
  color: #1f6feb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.15);
}

.vehicle-nav-btn.active {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
  border-color: transparent;
  box-shadow: 0 6px 18px rgba(31, 111, 235, 0.3);
}

.type-icon {
  font-size: 18px;
}

.type-name {
  font-size: 14px;
}

/* Category Filters */
.category-filters {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.category-btn {
  background: white;
  border: 2px solid #e0e0e0;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.category-btn:hover {
  border-color: #4ea3e9;
  color: #4ea3e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 163, 233, 0.15);
}

.category-btn .category-radio {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.category-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: transparent;
  transition: all 0.18s ease;
  display: inline-block;
}

.category-btn .category-radio:checked + .category-dot,
.category-btn.active .category-dot {
  background: linear-gradient(135deg, #4ea3e9 0%, #1f6feb 100%);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.18);
}

.category-label {
  display: inline-block;
  margin-right: 6px;
}

.category-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.category-btn.active .category-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Inventory Stats */
.inventory-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid #1f6feb;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1f6feb;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  font-weight: 500;
}

/* Cars Section */
.cars-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f6feb;
  margin-bottom: 25px;
  letter-spacing: 0.5px;
}

.cars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
}

.car-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: slideUp 0.6s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.car-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(31, 111, 235, 0.2);
}

.car-image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f0f4ff, #e8f0ff);
}

.car-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.car-card:hover .car-image {
  transform: scale(1.1);
}

.car-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  letter-spacing: 0.5px;
}

.car-badge.used {
  background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
}

.car-badge.imported {
  background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
}

.car-badge.all {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
}

.car-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.car-card:hover .car-overlay {
  opacity: 1;
}

.view-details-btn {
  background: white;
  color: #1f6feb;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  background: #1f6feb;
  color: white;
  transform: scale(1.05);
}

.car-info {
  padding: 20px;
}

.car-name {
  font-size: 18px;
  font-weight: bold;
  color: #1f6feb;
  margin-bottom: 5px;
}

.car-model {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.car-specs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.spec {
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.spec-icon {
  font-size: 14px;
}

.car-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.car-price {
  display: flex;
  flex-direction: column;
}

.price-label {
  font-size: 11px;
  color: #999;
  font-weight: 500;
}

.price-value {
  font-size: 18px;
  font-weight: bold;
  color: #1f6feb;
}

.buy-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s ease;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(31, 111, 235, 0.4);
}

/* No Cars Found */
.no-cars {
  text-align: center;
  padding: 60px 30px;
  color: #999;
}

.no-cars-icon {
  font-size: 80px;
  margin-bottom: 15px;
}

.no-cars h3 {
  font-size: 24px;
  color: #555;
  margin-bottom: 10px;
}

.no-cars p {
  font-size: 14px;
  color: #999;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #1f6feb;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #0d47a1;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .dealership-main {
    padding: 20px;
  }

  .inventory-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .cars-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .company-name {
    font-size: 28px;
  }

  .slogan {
    font-size: 16px;
  }

  .header-icons {
    justify-content: center;
    width: 100%;
  }

  .search-container {
    padding: 15px 15px;
  }

  .search-bar {
    max-width: 100%;
  }

  .main-wrapper {
    flex-direction: column;
  }

  .side-bar {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
  }

  .toggle-btn {
    position: fixed;
    top: 130px;
  }

  .dealership-main {
    padding: 20px;
  }

  .inventory-stats {
    grid-template-columns: 1fr;
  }

  .vehicle-nav {
    gap: 10px;
  }

  .vehicle-nav-btn {
    padding: 10px 16px;
    font-size: 12px;
  }

  .cars-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .section-title {
    font-size: 22px;
  }

  .car-name {
    font-size: 16px;
  }

  .price-value {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .cars-grid {
    grid-template-columns: 1fr;
  }

  .inventory-stats {
    grid-template-columns: 1fr;
  }

  .vehicle-nav {
    flex-direction: column;
  }

  .vehicle-nav-btn {
    width: 100%;
  }

  .category-filters {
    flex-direction: column;
  }

  .category-btn {
    width: 100%;
  }
}
</style>