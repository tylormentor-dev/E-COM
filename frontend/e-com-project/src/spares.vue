<template>
  <div class="spares-container">
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
        <input type="search" class="search" placeholder="Search parts, categories or SKU...">
      </div>
    </div>

    <div class="main-wrapper">
      <nav :class="['side-bar', { collapsed: !sidebarOpen }]">
        <div :class="['side-inner', { collapsed: !sidebarOpen }]" :aria-hidden="!sidebarOpen">
          <div class="side-header">
            <div>
              <h2 class="nav-heading">SPARES</h2>
              <h5 class="mini-heading">Car Parts & Components</h5>
            </div>
          </div>
          <ul class="nav-list">
            <li><router-link to="/dashboard" class="nav-link"><span class="label">Dashboard</span></router-link></li>
            <li><router-link to="/spares" class="nav-link"><span class="label">Spares</span></router-link></li>
            <li><router-link to="/dealership" class="nav-link"><span class="label">Dealership</span></router-link></li>
            <li><router-link to="/mechanics" class="nav-link"><span class="label">Mechanics</span></router-link></li>
            <li><router-link to="/bookings" class="nav-link"><span class="label">Bookings</span></router-link></li>
            <li><router-link to="/profile" class="nav-link"><span class="label">Profile</span></router-link></li>
            <li><router-link to="/orders" class="nav-link"><span class="label">Orders</span></router-link></li>
            <li><router-link to="/history" class="nav-link"><span class="label">History</span></router-link></li>
          </ul>
        </div>
      </nav>

      <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
        {{ sidebarOpen? '‹' : '›' }}
      </button>

      <main class="spares-main">
        <div class="category-filters">
          <label v-for="cat in categories" :key="cat.id" :class="['category-btn', { active: selectedCategory === cat.id }]">
            <input type="radio" class="category-radio" name="spares-category" v-model="selectedCategory" :value="cat.id" />
            <span class="category-dot" aria-hidden="true"></span>
            <span class="category-label">{{ cat.name }}</span>
          </label>
        </div>

        <section class="parts-section">
          <h2 class="section-title">{{ getSectionTitle() }}</h2>
          <div v-if="filteredParts.length" class="parts-grid">
            <div v-for="part in filteredParts" :key="part.id" class="part-card">
              <div class="part-image" :style="{ backgroundImage: `url(${part.image})` }"></div>
              <div class="part-info">
                <h3 class="part-name">{{ part.name }}</h3>
                <p class="part-desc">{{ part.desc }}</p>
                <div class="part-footer">
                  <div class="part-price">R{{ part.price }}</div>
                  <button class="add-btn">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-parts">No parts found for this category.</div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SparesPage',
  data() {
    return {
      companyname: 'MECHANIC CONNECT',
      slogan: 'Quality Car Parts & Accessories',
      sidebarOpen: true,
      selectedCategory: 'all',
      categories: [
        { id: 'all', name: 'All Parts' },
        { id: 'internal', name: 'Internal' },
        { id: 'external', name: 'External' },
        { id: 'engine', name: 'Engine' },
        { id: 'electronics', name: 'Electronics' }
      ],
      parts: [
      ]
    }
  },
  computed: {
    filteredParts() {
      if (this.selectedCategory === 'all') return this.parts;
      return this.parts.filter(p => p.category === this.selectedCategory);
    }
  },
  methods: {
    toggleSidebar() { this.sidebarOpen = !this.sidebarOpen },
    getSectionTitle() {
      const cat = this.categories.find(c => c.id === this.selectedCategory)?.name || 'Parts';
      return `${cat}`;
    }
  }
}
</script>

<style>
/* Reuse dashboard header/search/sidebar colors and styles (subset) */
.spares-container { display:flex; flex-direction:column; min-height:100vh; background:#f5f7fa }
.header { background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a); padding:20px 40px; border-bottom:3px solid rgba(212,212,212,0.61); box-shadow:0 4px 20px rgba(0,0,0,0.3); z-index:8 }
.header-content { display:flex; align-items:center; justify-content:space-between; gap:25px; max-width:1400px; margin:0 auto; width:100% }
.logo-image{ width:100px; height:100px; border-radius:50%; border:3px solid rgba(173,174,180,0.69); background-image:url(images.jpg); background-size:cover }
.company-name{ font-size:36px; font-weight:700; background:linear-gradient(135deg,#001a8d 0%,#4ea3e9 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent }
.slogan{ color:rgba(255,255,255,0.8); font-size:18px }
.search-container{ background: linear-gradient(135deg, #080808, #383838, rgb(143, 142, 142), #56555a); padding:15px 40px; display:flex; justify-content:center; width:100%; z-index:7 }
.search-bar{ position:relative; width:100%; max-width:600px }
.search{ width:100%; padding:12px 15px 12px 45px; border-radius:8px; border:2px solid #e0e0e0 }
.main-wrapper{ display:flex; flex:1 }
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
  opacity: 0.95;
}
.side-inner{ padding:20px; background:rgba(0,0,0,0.3); color:rgba(255,255,255,0.9) }
.nav-heading{ font-size:16px; color:#4ea3e9; font-weight:700 }
.nav-list{ list-style:none; padding:0; margin-top:10px }
.nav-link{ color:rgba(255,255,255,0.8); display:flex; padding:10px 12px; border-radius:6px; text-decoration:none }
.nav-link.active{ color:#1f6feb; background:rgba(31,111,235,0.15); border-left:3px solid #1f6feb }
.toggle-btn{ background:linear-gradient(135deg,#1f6feb 0%,#0d47a1 100%); color:#fff; padding:8px 12px; border-radius:6px; position:absolute; top:130px; left:232px }

.spares-main{ padding:30px; flex:1; max-width:1400px; width:100% }
.category-filters{ display:flex; justify-content:center; align-items:center; gap:12px; margin-bottom:20px; flex-wrap:wrap }
.category-btn{ background:white; border:2px solid #e0e0e0; padding:8px 14px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; cursor:pointer }
.category-btn .category-radio{ position:absolute; opacity:0; pointer-events:none }
.category-dot{ width:14px; height:14px; border-radius:50%; border:2px solid #e0e0e0 }
.category-btn.active .category-dot{ background:linear-gradient(135deg,#4ea3e9 0%,#1f6feb 100%); border-color:transparent }
.category-label{ margin-left:6px }
.category-btn:hover {
  border-color: #4ea3e9;
  color: #4ea3e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 163, 233, 0.15);
}
.parts-section{ margin: 50px 150px;}
.section-title{ font-size: 24px; color:#1f6feb; margin-bottom: 16px; }
.parts-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px }
.part-card{ background:white; margin-left: 12px; border-radius:10px; box-shadow:0 6px 18px rgba(0,0,0,0.06); overflow:hidden }
.part-image{ height:140px;  background-size:cover; background-position:center }
.part-info{ padding:12px }
.part-name{ color:#1f6feb; font-size:16px; margin-bottom:6px }
.part-desc{ color:#666; font-size:13px; margin-bottom:12px }
.part-footer{ display:flex; justify-content:space-between; align-items:center }
.part-price{ font-weight:700; color:#1f6feb }
.add-btn{ background:linear-gradient(135deg,#1f6feb 0%,#0d47a1 100%); color:white; padding:8px 12px; border-radius:6px }
.no-parts{ text-align:center; color:#999; padding:40px }

@media (max-width:768px){ .side-bar{ position:fixed; left:0; top:0; height:100vh } .toggle-btn{ position:fixed } .parts-grid{ grid-template-columns:repeat(auto-fill,minmax(160px,1fr)) } }
</style>
