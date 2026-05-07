<template>
  <div class="pt-layout">
    <!-- ===== SIDEBAR ===== -->
    <aside class="pt-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="pt-brand">
        <div class="brand-logo">
          <img src="@/assets/logo.png" alt="SmartGym AI Logo" class="brand-logo-img" />
        </div>
        <div class="brand-text" v-show="!sidebarCollapsed">
          <div class="brand-name">SmartGym</div>
          <div class="brand-role">Quản lý chuyên nghiệp</div>
        </div>
      </div>

      <!-- Toggle -->
      <button class="sidebar-toggle-btn" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- PT Info Card -->
      <div class="pt-info-card" v-show="!sidebarCollapsed">
        <div class="pt-avatar-wrap">
          <img :src="ptAvatar" class="pt-avatar" alt="PT Avatar" />
          <span class="pt-online-dot"></span>
        </div>
        <div class="pt-info-text">
          <div class="pt-name">{{ ptName }}</div>
          <div class="pt-badge">PT</div>
        </div>
      </div>
      <div class="pt-avatar-sm" v-show="sidebarCollapsed">
        <img :src="ptAvatar" class="pt-avatar-mini" alt="PT" />
      </div>

      <!-- Nav -->
      <nav class="pt-nav">
        <router-link to="/pt/lich_tap" class="pt-nav-item" active-class="active">
          <i class="fas fa-calendar-alt nav-ico"></i>
          <span v-show="!sidebarCollapsed">Quản lí lịch tập</span>
        </router-link>

        <router-link to="/pt/chi_so_suc_khoe" class="pt-nav-item" active-class="active">
          <i class="fas fa-chart-line nav-ico"></i>
          <span v-show="!sidebarCollapsed">Chỉ số sức khỏe hội viên</span>
        </router-link>

        <router-link to="/pt/goi_y_ai" class="pt-nav-item" active-class="active">
          <i class="fas fa-robot nav-ico"></i>
          <span v-show="!sidebarCollapsed">Gợi ý lộ trình tập luyện bằng AI</span>
        </router-link>
      </nav>


    </aside>

    <!-- ===== MAIN ===== -->
    <div class="pt-main">
      <!-- Top Header -->
      <header class="pt-header">
        <div class="pt-header-left">
          <div class="pt-header-date">
            <i class="fas fa-calendar-check"></i>
            {{ currentDateStr }}
          </div>
        </div>
        <div class="pt-header-right">
          <button class="nv-icon-btn" title="Thông báo">
            <i class="fas fa-bell"></i>
            <span class="badge-dot"></span>
          </button>
          <button
            class="btn-logout"
            @click="handleLogout"
            :disabled="loggingOut"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>{{ loggingOut ? 'Đang xuất...' : 'Đăng xuất' }}</span>
          </button>
          <div class="nv-user-info">
            <img :src="ptAvatar" class="user-avatar" alt="PT" />
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="pt-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'PTLayout',
  data() {
    return {
      sidebarCollapsed: false,
      loggingOut: false,
      ptName: 'PT Chuyên Nghiệp',
      ptAvatar: 'https://ui-avatars.com/api/?name=PT&background=1c5e2e&color=fff&bold=true&size=64',
    }
  },
  computed: {
    currentDateStr() {
      const now = new Date()
      const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
      const d = days[now.getDay()]
      return `${d}, ${now.getDate()} Tháng ${now.getMonth() + 1} ${now.getFullYear()}`
    },
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.name) {
          this.ptName = user.name
          this.ptAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1c5e2e&color=fff&bold=true&size=64`
        }
      } catch (e) {}
    },
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

* { box-sizing: border-box; }

.pt-layout {
  display: flex;
  min-height: 100vh;
  background: #f2f6f3;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* ===== SIDEBAR ===== */
.pt-sidebar {
  width: 220px;
  min-height: 100vh;
  background: linear-gradient(175deg, #1c5e2e 0%, #174d25 55%, #0f3418 100%);
  display: flex;
  flex-direction: column;
  padding: 0 0 16px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
  box-shadow: 3px 0 24px rgba(0,0,0,0.18);
  z-index: 10;
}
.pt-sidebar.collapsed { width: 64px; }

/* Brand */
.pt-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 22px 16px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}
.brand-logo {
  width: 38px; height: 38px;
  background: rgba(255,255,255,0.15);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
}
.brand-logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.brand-name { font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: 0.4px; }
.brand-role { font-size: 0.67rem; color: rgba(255,255,255,0.55); margin-top: 2px; }

/* Sidebar toggle */
.sidebar-toggle-btn {
  position: absolute;
  top: 24px; right: -13px;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #2d7a3a;
  color: #2d7a3a;
  font-size: 0.6rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s;
}
.sidebar-toggle-btn:hover { background: #e8f5e9; transform: scale(1.1); }

/* PT Info Card */
.pt-info-card {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 14px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 10px 12px;
  border: 1px solid rgba(255,255,255,0.15);
  overflow: hidden;
}
.pt-avatar-wrap { position: relative; flex-shrink: 0; }
.pt-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
  object-fit: cover;
}
.pt-online-dot {
  position: absolute;
  bottom: 1px; right: 1px;
  width: 9px; height: 9px;
  background: #4ade80;
  border-radius: 50%;
  border: 2px solid #1c5e2e;
}
.pt-info-text { overflow: hidden; }
.pt-name { font-size: 0.8rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pt-badge {
  display: inline-block;
  font-size: 0.62rem; font-weight: 700;
  background: rgba(74,222,128,0.25);
  color: #86efac;
  border-radius: 4px;
  padding: 1px 6px;
  margin-top: 2px;
}
.pt-avatar-sm { display: flex; justify-content: center; padding: 12px 0 8px; }
.pt-avatar-mini {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  object-fit: cover;
}

/* Nav */
.pt-nav {
  flex: 1;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
  overflow-x: hidden;
}
.pt-nav::-webkit-scrollbar { width: 3px; }
.pt-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

.pt-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.68);
  text-decoration: none;
  font-size: 0.83rem;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  line-height: 1.35;
}
.pt-nav-item:hover { background: rgba(255,255,255,0.1); color: #fff; }
.pt-nav-item.active { background: rgba(255,255,255,0.18); color: #fff; font-weight: 600; }
.pt-nav-item.active .nav-ico { color: #a8e6b5; }
.nav-ico { font-size: 0.9rem; width: 18px; text-align: center; flex-shrink: 0; }


/* ===== MAIN ===== */
.pt-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }

/* Header */
.pt-header {
  background: #fff;
  border-bottom: 1px solid #e5eae7;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}
.pt-header-left {}
.pt-header-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.84rem;
  font-weight: 500;
  color: #475569;
}
.pt-header-date i { color: #2d7a3a; }

.pt-header-right { display: flex; align-items: center; gap: 12px; }

.nv-icon-btn {
  position: relative;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: #f4f7f5;
  border: 1px solid #e2e8e4;
  color: #64748b;
  font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.nv-icon-btn:hover { background: #e8f5e9; color: #2d7a3a; }
.badge-dot {
  position: absolute;
  top: 7px; right: 7px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  background: transparent;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
}
.btn-logout:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
.btn-logout:disabled { opacity: 0.5; cursor: not-allowed; }

.user-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid #c6e9cf;
  object-fit: cover;
  cursor: pointer;
}

/* Page content */
.pt-content {
  flex: 1;
  overflow-y: auto;
  background: #f2f6f3;
  padding: 24px;
}
</style>
