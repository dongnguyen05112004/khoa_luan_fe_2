<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-avatar">
          <img v-if="brandInfo.logo" :src="brandInfo.logo" alt="SmartGym AI Logo" />
          <img v-else src="@/assets/logo.png" alt="SmartGym AI Logo" />
        </div>
        <div class="brand-info" v-show="!sidebarCollapsed">
          <div class="brand-title">{{ brandInfo.name }}</div>
          <div class="brand-sub">Admin Dashboard</div>
        </div>
      </div>

      <!-- Toggle button -->
      <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <router-link to="/admin/quanlynguoidung" class="nav-item" exact-active-class="active">
          <i class="fas fa-chart-line nav-icon"></i>
          <span v-show="!sidebarCollapsed">Quản lý người dùng</span>
        </router-link>

       <router-link to="/admin/config" class="nav-item" active-class="active">
          <i class="fas fa-cogs nav-icon"></i>
          <span v-show="!sidebarCollapsed">Cấu hình hệ thống</span>
        </router-link>
        <router-link to="/admin/nhat_ky" class="nav-item" exact-active-class="active">
          <i class="fas fa-clipboard-list nav-icon"></i>
          <span v-show="!sidebarCollapsed">Tra cứu nhật ký</span>
        </router-link>
      </nav>


    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item text-muted small">ADMIN</li>
              <li class="breadcrumb-item active small">HỆ THỐNG</li>
            </ol>
          </nav>
        </div>
        <div class="header-right d-flex align-items-center gap-3">
           
          <button
            class="btn btn-danger btn-sm d-flex align-items-center gap-2"
            @click="handleLogout"
            :disabled="loggingOut"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>{{ loggingOut ? 'Đang xuất...' : 'Đăng xuất' }}</span>
          </button>
          <!-- Admin Avatar -->
          <div class="admin-avatar-wrap d-flex align-items-center gap-2 ms-2">
            <img src="https://ui-avatars.com/api/?name=He+Thong+Admin&background=2d7a3a&color=ffffff&bold=true&size=36" class="rounded-circle" alt="Admin" width="36" height="36" />
            <div>
              <div class="fw-bold small lh-1">Hệ thống Admin</div>
              <div class="text-muted" style="font-size:0.72rem;">Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>

     
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AdminLayout',
  data() {
    return {
      sidebarCollapsed: false,
      showAiBubble: true,
      loggingOut: false,
      stats: {
        totalUsers: 128,
        lockedAccounts: 3,
      },
      brandInfo: {
        name: 'SMARTGYM AI',
        logo: ''
      }
    }
  },
  mounted() {
    this.fetchSystemSettings();
  },
  methods: {
    async fetchSystemSettings() {
      try {
        const response = await axios.get('/api/system-settings');
        const settings = response.data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value;
          return acc;
        }, {});
        if (settings.gymName) this.brandInfo.name = settings.gymName;
        if (settings.logo) this.brandInfo.logo = settings.logo;
      } catch (error) {
        console.error('Lỗi tải thông tin thương hiệu:', error);
      }
    },
    async handleLogout() {
      if (this.loggingOut) return
      this.loggingOut = true
      try {
        const token = localStorage.getItem('token')
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      } catch (err) {
        // Dù API lỗi vẫn tiếp tục xóa local session
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
/* ===== LAYOUT ===== */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f0f4f8;
  font-family: 'Segoe UI', sans-serif;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: linear-gradient(180deg, #2d7a3a 0%, #1a5c28 60%, #0f3d1a 100%);
  display: flex;
  flex-direction: column;
  padding: 20px 0 16px;
  transition: width 0.3s ease;
  position: relative;
  flex-shrink: 0;
  box-shadow: 4px 0 20px rgba(0,0,0,0.15);
}
.sidebar.collapsed {
  width: 68px;
}

/* Brand */
.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.15);
  margin-bottom: 12px;
}
.brand-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.brand-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.brand-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}
.brand-sub {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.65);
}

/* Toggle */
.sidebar-toggle {
  position: absolute;
  top: 22px;
  right: -14px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #2d7a3a;
  color: #2d7a3a;
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s;
}
.sidebar-toggle:hover {
  background: #e8f5e9;
}

/* Nav items */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 10px;
  overflow-y: auto;
}
.sidebar-nav::-webkit-scrollbar { width: 4px; }
.sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

/* Section labels */
.nav-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.4);
  padding: 14px 12px 4px;
  text-transform: uppercase;
}
.nav-divider {
  height: 1px;
  background: rgba(255,255,255,0.12);
  margin: 10px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.86rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  line-height: 1.3;
}
.nav-item:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.nav-item.active {
  background: rgba(255,255,255,0.22);
  color: #fff;
  font-weight: 600;
  box-shadow: inset 3px 0 0 rgba(255,255,255,0.6);
}
.nav-icon {
  font-size: 0.95rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}


/* ===== MAIN ===== */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.top-header {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 5;
}
/* Breadcrumb */
.header-breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.82rem;
  font-weight: 500;
}
.breadcrumb-root {
  color: #94a3b8;
  letter-spacing: 0.3px;
}
.breadcrumb-sep {
  font-size: 0.6rem;
  color: #cbd5e1;
}
.breadcrumb-current {
  color: #1e293b;
  font-weight: 600;
}
/* Header right */
.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
/* Action buttons */
.header-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s;
}
.header-action-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.header-action-btn.primary {
  background: #2d7a3a;
  color: #fff;
  border-color: #2d7a3a;
}
.header-action-btn.primary:hover { background: #245f2e; }
/* User info */
.header-user {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 10px;
  border-left: 1px solid #e2e8f0;
}
.header-user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #2d7a3a;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.header-user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}
.header-user-role {
  font-size: 0.72rem;
  color: #94a3b8;
}

/* Page content */
.page-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

/* ===== AI BUBBLE ===== */
.ai-bubble {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 280px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  padding: 14px 16px;
  z-index: 999;
  animation: fadeInUp 0.3s ease;
}
.ai-bubble-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.ai-icon {
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.8rem;
}
.ai-bubble-header strong {
  font-size: 0.78rem;
  color: #1e293b;
  flex: 1;
}
.ai-bubble-text {
  font-size: 0.8rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}
.ai-minimize-btn {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}
.ai-minimize-btn:hover { color: #6366f1; }

.ai-fab {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border: none;
  color: #fff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
  cursor: pointer;
  z-index: 999;
  transition: transform 0.2s;
}
.ai-fab:hover { transform: scale(1.1); }

/* Animation cho phép thu gọn / phình ra của AI Bubble */
.ai-fade-enter-active, .ai-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.ai-fade-enter-from, .ai-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
</style>
