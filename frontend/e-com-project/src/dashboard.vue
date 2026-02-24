<template>
  <div class="dashboard-container">
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
             <li><router-link to="/dealership" class="nav-link active"><span class="label">Dealership</span></router-link></li>
            <li><router-link to="/mechanics" class="nav-link"><span class="label">Mechanics</span></router-link></li>
            <li><router-link to="/bookings" class="nav-link"><span class="label">Bookings</span></router-link></li>
            <li><router-link to="/profile" class="nav-link"><span class="label">Profile</span></router-link></li>
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
        

        <!-- Carousel -->
        <div class="carousel-container">
          <div class="carousel-slide" v-for="(slide, index) in adSlides" :key="index" v-show="currentSlide === index" :style="{ backgroundImage: `url(${slide.imagePath})` }">
            <div class="slide-overlay"></div>
            <div class="slide-content">
              <h2 class="slide-title">{{ slide.title }}</h2>
              <p class="slide-description">{{ slide.description }}</p>
              <button class="slide-btn">Learn More</button>
            </div>
          </div>
          <div class="carousel-indicators">
            <span v-for="(slide, index) in adSlides" :key="'indicator-' + index" :class="['indicator', { active: currentSlide === index }]" @click="currentSlide = index"></span>
          </div>
        </div>

        <!-- Featured Services -->
        <div class="featured-section">
          <h2 class="section-title">Popular Services</h2>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">🛢️</div>
              <h3>Oil Change</h3>
              <p>Quick and professional oil changes</p>
              <button class="service-btn">Book Now</button>
            </div>
            <div class="service-card">
              <div class="service-icon">⛽</div>
              <h3>Fuel System</h3>
              <p>Fuel injection & cleaning services</p>
              <button class="service-btn">Book Now</button>
            </div>
            <div class="service-card">
              <div class="service-icon">🔧</div>
              <h3>Engine Diagnostics</h3>
              <p>Advanced diagnostic tools</p>
              <button class="service-btn">Book Now</button>
            </div>
            <div class="service-card">
              <div class="service-icon">🛞</div>
              <h3>Tire Replacement</h3>
              <p>Quality tires & installation</p>
              <button class="service-btn">Book Now</button>
            </div>
          </div>
        </div>

        

        <!-- Ad Card -->
        <div class="ad-card2">
          <div class="ad-card2-icon">🏆</div>
          <div class="ad-card2-text">Expert Auto Services at Your Fingertips</div>
          <p class="ad-card2-subtitle">Join thousands of satisfied customers</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.dashboard-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* Header */
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


/* Search Container */
.search-container {
  background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a);
  padding: 15px 40px;
  display: flex;
  justify-content: center;
  width: 100%;
  z-index: 7;
  position: relative;
  border-bottom: 3px solid silver;
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
  position: absolute;
  left: 0;
  top: 3px;
  height: 100%;
  width: 250px;
  background-image: url(im.jpg);
  background-size: cover;
  background-position: center;
  overflow-y: auto;
  z-index: 20;
  transition: transform 0.3s ease;
  opacity: 0.7;
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
  font-weight: 400;
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

.nav-link.router-link-active {
  color: #1f6feb;
  font-weight: bold;
  background: rgba(31, 111, 235, 0.15);
  border-left: 3px solid #1f6feb;
  padding-left: 14px;
}

.label {
  display: inline-block;
  transition: opacity 160ms ease, transform 160ms ease, visibility 0s linear 0s;
  opacity: 1;
  font-size: 17px;
  font-weight: 500;
  padding: 5px;
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
.dash-main {
  padding: 30px;
  flex: 1;
  max-width: 1400px;
  width: 100%;
}

/* Stats Container */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
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

/* Carousel */
.carousel-container {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  height: 520px;
  width: 1600px;
  position: relative;
  overflow: hidden;
  border-bottom: 5px solid rgb(0, 125, 241);
  margin: -30px -50px;
  
}

.carousel-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeSlide 0.5s ease-in-out;
  z-index: 1;
}

@keyframes fadeSlide {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.slide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.slide-content {
  position: relative;
  text-align: center;
  color: white;
  z-index: 2;
  width: 90%;
  max-width: 600px;
}

.slide-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.5px;
}

.slide-description {
  font-size: 18px;
  margin-bottom: 25px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
  letter-spacing: 0.3px;
}

.slide-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
  border: none;
  padding: 14px 35px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(31, 111, 235, 0.3);
  font-weight: 600;
}

.slide-btn:hover {
  background: linear-gradient(135deg, #0d47a1 0%, #001a8d 100%);
  box-shadow: 0 6px 20px rgba(31, 111, 235, 0.5);
  transform: translateY(-2px);
}

.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #1f6feb;
  width: 30px;
  border-radius: 6px;
}

.indicator:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

/* Featured Section */
.featured-section {
  margin: 50px;
  padding: 0px 20px;
}

.section-title {
  font-size: 28px;
  font-weight: bold;
  color: #1f6feb;
  margin-bottom: 25px;
  letter-spacing: 0.5px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-top: 4px solid #1f6feb;
 
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(31, 111, 235, 0.15);
  border-top-color: #4ea3e9;
}

.service-icon {
  font-size: 40px;
  margin-bottom: 15px;
  display: block;
}

.service-card h3 {
  color: #1f6feb;
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
}

.service-card p {
  color: #999;
  font-size: 13px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.service-btn {
  background: linear-gradient(135deg, #1f6feb 0%, #0d47a1 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
}

.service-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(31, 111, 235, 0.4);
}

/* Ad Card */
.ad-card2 {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  background: linear-gradient(135deg, rgba(31, 111, 235, 0.1), rgba(78, 163, 233, 0.1));
  border: 2px solid rgba(31, 111, 235, 0.3);
  min-height: 250px;
  width: 100%;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: white;
  font-size: 28px;
  font-weight: bold;
  gap: 15px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  background-image: linear-gradient(135deg, rgba(31, 111, 235, 0.05), rgba(78, 163, 233, 0.05)), url(auto-parts-1.jpg);
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
  margin: 0px 70px;
}

.ad-card2:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(31, 111, 235, 0.2);
  border-color: rgba(31, 111, 235, 0.5);
}

.ad-card2-icon {
  font-size: 60px;
  animation: bounce 2s infinite;
}

.ad-card2-text {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 0.5px;
}

.ad-card2-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
  margin-top: 10px;
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
  .dash-main {
    padding: 20px;
  }

  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .services-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .dash-main {
    padding: 20px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .carousel-container {
    height: 300px;
  }

  .slide-title {
    font-size: 24px;
  }

  .slide-description {
    font-size: 14px;
  }

  .section-title {
    font-size: 22px;
  }
}
</style>

<script>
import im1 from '@/assets/images/image4.jpg';
import im5 from '@/assets/images/download.jpg';
import im3 from '@/assets/images/download5.jpg';
import im4 from '@/assets/images/images6.jpg';
import im from '@/assets/images/download8.jpg';

export default {
  name: 'dashboardPage',
  data() {
    return {
      companyname: 'MECHANIC CONNECT',
      slogan: 'Your Best Friend In Automotive Solutions',
      sidebarOpen: true,
      currentSlide: 0,
      slideInterval: null,
      adSlides: [
        {
          imagePath:  im1,
          title: 'Affordable Car Deals',
          description: 'Discover unbeatable prices on quality vehicles with our exclusive car deals'
        },
        {
          imagePath:  im5,
          title: 'Car Spares & Accessories',
          description: 'Reliable and affordable automotive Components '
        },
        {
          imagePath: im3,
          title: 'Engine Diagnostics',
          description: 'Advanced diagnostic tools to identify and fix engine issues quickly'
        },
        {
          imagePath: im4,
          title: 'Brake System Service',
          description: 'Comprehensive brake inspection and maintenance for your safety'
        },
        {
          imagePath: im,
          title: 'Car for Cash',
          description: 'Get instant cash for your car with our hassle-free selling process'
        }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    startSlideshow() {
      this.slideInterval = setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.adSlides.length;
      }, 10000);
    },
    stopSlideshow() {
      if (this.slideInterval) {
        clearInterval(this.slideInterval);
      }
    }
  },
  mounted() {
    this.startSlideshow();
  },
  beforeUnmount() {
    this.stopSlideshow();
  }
}
</script>