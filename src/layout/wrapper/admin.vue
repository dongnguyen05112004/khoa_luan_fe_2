<template>
  <div class="admin-layout">
    <!-- SIDEBAR -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-avatar">
          <img src="https://ui-avatars.com/api/?name=Admin&background=ffffff&color=2d7a3a&bold=true&size=40" alt="Admin" />
        </div>
        <div class="brand-info" v-show="!sidebarCollapsed">
          <div class="brand-title">SMARTGYM AI</div>
          <div class="brand-sub">Admin Panel</div>
        </div>
      </div>

      <!-- Toggle button -->
      <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <router-link to="/admin/quanlynguoidung" class="nav-item" active-class="active">
          <i class="fas fa-users nav-icon"></i>
          <span v-show="!sidebarCollapsed">Quản lý người dùng</span>
        </router-link>

        <router-link to="/admin/cus_mgr" class="nav-item" active-class="active">
          <i class="fas fa-cog nav-icon"></i>
          <span v-show="!sidebarCollapsed">Cấu hình hệ thống</span>
        </router-link>

        <router-link to="/admin" class="nav-item" exact-active-class="active">
          <i class="fas fa-clipboard-list nav-icon"></i>
          <span v-show="!sidebarCollapsed">Tra cứu nhật ký</span>
        </router-link>
      </nav>

      <!-- Version badge at bottom -->
      <div class="sidebar-footer" v-show="!sidebarCollapsed">
        <span class="version-badge">V2.4.0-AI</span>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-search-wrap">
          <i class="fas fa-search header-search-icon"></i>
          <input type="text" class="header-search-input" placeholder="Tìm kiếm hệ thống..." />
        </div>
        <div class="header-right">
          <button class="header-icon-btn" title="Thông báo">
            <i class="fas fa-bell"></i>
            <span class="notif-dot"></span>
          </button>
          <button class="header-icon-btn" title="Tài khoản">
            <img src="https://ui-avatars.com/api/?name=He+Thong+Admin&background=2d7a3a&color=ffffff&bold=true&size=36" class="header-avatar" alt="Admin" />
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <router-view />
      </main>
    </div>

    <!-- AI Floating Chat Bubble -->
    <div class="ai-bubble" v-if="showAiBubble">
      <div class="ai-bubble-header">
        <span class="ai-icon"><i class="fas fa-robot"></i></span>
        <strong>AI GỢI Ý VẬN HÀNH</strong>
        <button class="btn-close btn-close-white ms-auto" style="font-size:0.65rem;" @click="showAiBubble = false"></button>
      </div>
      <p class="ai-bubble-text">
        Phòng tập tại quận 1 đang thiếu PT vào khung giờ 17:00 – 19:00, AI đề xuất điều phối nhân sự từ cơ sở lân cận.
      </p>
    </div>
    <button class="ai-fab" v-else @click="showAiBubble = true" title="AI Assistant">
      <i class="fas fa-robot"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'AdminLayout',
  data() {
    return {
      sidebarCollapsed: false,
      showAiBubble: true,
    }
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
.brand-avatar img {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.4);
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
  gap: 4px;
  padding: 0 10px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 10px;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  line-height: 1.3;
}
.nav-item:hover {
  background: rgba(255,255,255,0.12);
  color: #fff;
}
.nav-item.active {
  background: rgba(255,255,255,0.2);
  color: #fff;
  font-weight: 600;
}
.nav-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

/* Footer version */
.sidebar-footer {
  padding: 12px 16px 0;
  border-top: 1px solid rgba(255,255,255,0.15);
}
.version-badge {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.08);
  padding: 3px 10px;
  border-radius: 20px;
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
.header-search-wrap {
  position: relative;
  flex: 1;
  max-width: 320px;
}
.header-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.82rem;
}
.header-search-input {
  width: 100%;
  padding: 9px 14px 9px 34px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.85rem;
  outline: none;
  background: #f8fafc;
  color: #1e293b;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.header-search-input:focus {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45,122,58,0.1);
  background: #fff;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-icon-btn {
  width: 38px;
  height: 38px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background 0.2s, border-color 0.2s;
  padding: 0;
}
.header-icon-btn:hover { background: #f1f5f9; border-color: #cbd5e1; }
.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
}
.notif-dot {
  position: absolute;
  top: 6px; right: 7px;
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid #fff;
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
