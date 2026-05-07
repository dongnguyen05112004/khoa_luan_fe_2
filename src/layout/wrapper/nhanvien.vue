<template>
  <div class="nv-layout">
    <!-- ===== SIDEBAR ===== -->
    <aside class="nv-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="nv-brand">
        <div class="brand-logo">
          <img src="@/assets/logo.png" alt="SmartGym AI Logo" class="brand-logo-img" />
        </div>
        <div class="brand-text" v-show="!sidebarCollapsed">
          <div class="brand-name">SMARTGYM AI</div>
          <div class="brand-role">Management Panel</div>
        </div>
      </div>

      <!-- Toggle -->
      <button class="sidebar-toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- Nav -->
      <nav class="nv-nav">
        <router-link to="/nhanvien" class="nv-nav-item" exact-active-class="active" exact>
          <i class="fas fa-home nav-ico"></i>
          <span v-show="!sidebarCollapsed">Tổng quan</span>
        </router-link>

        <router-link to="/nhanvien/quanlyhoivien" class="nv-nav-item" exact-active-class="active">
          <i class="fas fa-users nav-ico"></i>
          <span v-show="!sidebarCollapsed">Hội viên</span>
        </router-link>

        <router-link to="/nhanvien/hop_dong" class="nv-nav-item" exact-active-class="active">
          <i class="fas fa-file-contract nav-ico"></i>
          <span v-show="!sidebarCollapsed">Hợp đồng</span>
        </router-link>

        <router-link to="/nhanvien/thu_tien" class="nv-nav-item" exact-active-class="active">
          <i class="fas fa-credit-card nav-ico"></i>
          <span v-show="!sidebarCollapsed">Thanh toán</span>
        </router-link>
      </nav>


    </aside>

    <!-- ===== MAIN AREA ===== -->
    <div class="nv-main">
      <!-- Top Header -->
      <header class="nv-header">
        <!-- Search bar -->
        <div class="nv-search">
          <i class="fas fa-search search-ico"></i>
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Tìm kiếm hội viên, nhân viên, số điện thoại..."
            class="search-input"
          />
        </div>

        <!-- Header Right -->
        <div class="nv-header-right">
          <!-- Check-in Nhanh Button -->
          <button class="btn-checkin-nhanh">
            <i class="fas fa-bolt"></i>
            Check-in Nhanh
          </button>

          <!-- Notification -->
          <button class="nv-icon-btn" title="Thông báo">
            <i class="fas fa-bell"></i>
            <span class="badge-dot"></span>
          </button>
          <!-- Đăng xuất -->
          <button
            class="btn btn-danger btn-sm d-flex align-items-center gap-2"
            @click="handleLogout"
            :disabled="loggingOut"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>{{ loggingOut ? 'Đang xuất...' : 'Đăng xuất' }}</span>
          </button>

          <!-- Avatar -->
          <div class="nv-user-info">
            <img
              src="https://ui-avatars.com/api/?name=Le+Tan&background=2d7a3a&color=fff&bold=true&size=36"
              class="user-avatar"
              alt="User"
            />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="nv-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NhanVienLayout',
  data() {
    return {
      sidebarCollapsed: false,
      searchQuery: '',
      loggingOut: false,
    }
  },
  methods: {
    async handleLogout() {
      if (this.loggingOut) return
      this.loggingOut = true
      try {
        const token = localStorage.getItem('token')
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/logout`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } catch (err) {
        console.warn('Logout API error:', err)
      } finally {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        this.$router.push('/dangnhap')
        this.loggingOut = false
      }
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.nv-layout {
  display: flex;
  min-height: 100vh;
  background: #f2f6f3;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ===== SIDEBAR ===== */
.nv-sidebar {
  width: 220px;
  min-height: 100vh;
  background: linear-gradient(175deg, #1c5e2e 0%, #174d25 50%, #0f3418 100%);
  display: flex;
  flex-direction: column;
  padding: 0 0 16px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
  box-shadow: 3px 0 24px rgba(0, 0, 0, 0.18);
  z-index: 10;
}
.nv-sidebar.collapsed {
  width: 64px;
}

/* Brand */
.nv-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}
.brand-logo {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
}
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.brand-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.6px;
  line-height: 1.2;
}
.brand-role {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 2px;
}

/* Sidebar toggle button */
.sidebar-toggle-btn {
  position: absolute;
  top: 24px;
  right: -13px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #2d7a3a;
  color: #2d7a3a;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s;
}
.sidebar-toggle-btn:hover {
  background: #e8f5e9;
  transform: scale(1.1);
}

/* Nav */
.nv-nav {
  flex: 1;
  padding: 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}
.nv-nav::-webkit-scrollbar { width: 3px; }
.nv-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.nv-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.68);
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
}
.nv-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}
.nv-nav-item.active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-weight: 600;
}
.nv-nav-item.active .nav-ico {
  color: #a8e6b5;
}
.nav-ico {
  font-size: 0.9rem;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
}


/* ===== MAIN ===== */
.nv-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* Header */
.nv-header {
  background: #fff;
  border-bottom: 1px solid #e5eae7;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.nv-search {
  flex: 1;
  position: relative;
  max-width: 460px;
}
.search-ico {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.82rem;
}
.search-input {
  width: 100%;
  padding: 9px 14px 9px 38px;
  background: #f4f7f5;
  border: 1px solid #e2e8e4;
  border-radius: 10px;
  font-size: 0.84rem;
  color: #334155;
  font-family: 'Inter', sans-serif;
  outline: none;
  transition: all 0.2s;
}
.search-input::placeholder { color: #adb5bd; }
.search-input:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.08);
}

.nv-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

/* Check-in Nhanh */
.btn-checkin-nhanh {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.84rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn-checkin-nhanh:hover {
  background: #245f2e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(45, 122, 58, 0.3);
}
.btn-checkin-nhanh i { font-size: 0.8rem; }

/* Icon button */
.nv-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f4f7f5;
  border: 1px solid #e2e8e4;
  color: #64748b;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.nv-icon-btn:hover {
  background: #e8f5e9;
  color: #2d7a3a;
}
.badge-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
}

/* User avatar */
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #c6e9cf;
  cursor: pointer;
  transition: border-color 0.2s;
}
.user-avatar:hover { border-color: #2d7a3a; }

/* Page content */
.nv-content {
  flex: 1;
  overflow-y: auto;
  background: #f2f6f3;
}
</style>
