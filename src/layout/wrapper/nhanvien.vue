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
          <div class="brand-sub">Lễ tân Dashboard</div>
        </div>
      </div>

      <!-- Toggle button -->
      <button class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
        <i :class="sidebarCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <!-- Hội viên -->
        <div class="nav-section-label" v-show="!sidebarCollapsed">HỘI VIÊN</div>
        <div class="nav-divider" v-show="sidebarCollapsed"></div>

        <router-link to="/nhanvien/hoi_vien_moi" class="nav-item" active-class="active">
          <i class="fas fa-user-plus nav-icon"></i>
          <span v-show="!sidebarCollapsed">Tạo hội viên mới</span>
        </router-link>

        <router-link to="/nhanvien/tim_kiem" class="nav-item" active-class="active">
          <i class="fas fa-search nav-icon"></i>
          <span v-show="!sidebarCollapsed">Tìm kiếm hội viên</span>
        </router-link>

        <router-link to="/nhanvien/ho_so" class="nav-item" active-class="active">
          <i class="fas fa-id-card nav-icon"></i>
          <span v-show="!sidebarCollapsed">Quản lý hồ sơ</span>
        </router-link>

        <!-- Hợp đồng -->
        <div class="nav-section-label" v-show="!sidebarCollapsed">HỢP ĐỒNG</div>
        <div class="nav-divider" v-show="sidebarCollapsed"></div>

        <router-link to="/nhanvien/hop_dong" class="nav-item" active-class="active">
          <i class="fas fa-file-contract nav-icon"></i>
          <span v-show="!sidebarCollapsed">Tạo / Gia hạn / Hủy</span>
        </router-link>

        <router-link to="/nhanvien/trang_thai_hop_dong" class="nav-item" active-class="active">
          <i class="fas fa-clipboard-list nav-icon"></i>
          <span v-show="!sidebarCollapsed">Trạng thái hợp đồng</span>
        </router-link>

        <!-- Thanh toán -->
        <div class="nav-section-label" v-show="!sidebarCollapsed">THANH TOÁN</div>
        <div class="nav-divider" v-show="sidebarCollapsed"></div>

        <router-link to="/nhanvien/thu_tien" class="nav-item" active-class="active">
          <i class="fas fa-cash-register nav-icon"></i>
          <span v-show="!sidebarCollapsed">Thu tiền</span>
        </router-link>

        <router-link to="/nhanvien/hoa_don" class="nav-item" active-class="active">
          <i class="fas fa-receipt nav-icon"></i>
          <span v-show="!sidebarCollapsed">Xuất hóa đơn</span>
        </router-link>

        <router-link to="/nhanvien/lich_su_giao_dich" class="nav-item" active-class="active">
          <i class="fas fa-history nav-icon"></i>
          <span v-show="!sidebarCollapsed">Lịch sử giao dịch</span>
        </router-link>

        <!-- Check-in -->
        <div class="nav-section-label" v-show="!sidebarCollapsed">CHECK-IN</div>
        <div class="nav-divider" v-show="sidebarCollapsed"></div>

        <router-link to="/nhanvien/checkin" class="nav-item" active-class="active">
          <i class="fas fa-door-open nav-icon"></i>
          <span v-show="!sidebarCollapsed">Check-in hội viên</span>
        </router-link>

        <router-link to="/nhanvien/qr" class="nav-item" active-class="active">
          <i class="fas fa-qrcode nav-icon"></i>
          <span v-show="!sidebarCollapsed">Quét QR</span>
        </router-link>

        <router-link to="/nhanvien/kiem_tra" class="nav-item" active-class="active">
          <i class="fas fa-check-circle nav-icon"></i>
          <span v-show="!sidebarCollapsed">Kiểm tra hợp lệ</span>
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
        <div class="header-left">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
              <li class="breadcrumb-item text-muted small">NHÂN VIÊN</li>
              <li class="breadcrumb-item active small">LỄ TÂN</li>
            </ol>
          </nav>
        </div>
        <div class="header-right d-flex align-items-center gap-3">
          <!-- Stat chips -->
          <div class="header-stat-chip">
            <i class="fas fa-door-open"></i>
            <span class="chip-value">{{ stats.checkinToday }}</span>
            <span class="chip-label">Check-in hôm nay</span>
          </div>
          <div class="header-stat-chip chip-green">
            <i class="fas fa-user-plus"></i>
            <span class="chip-value">{{ stats.newMembers }}</span>
            <span class="chip-label">Hội viên mới</span>
          </div>
          <div class="header-stat-chip chip-orange">
            <i class="fas fa-file-contract"></i>
            <span class="chip-value">{{ stats.expiringContracts }}</span>
            <span class="chip-label">HĐ sắp hết hạn</span>
          </div>
          <!-- Notification bell -->
          <button class="header-icon-btn" title="Thông báo">
            <i class="fas fa-bell"></i>
            <span class="notif-dot"></span>
          </button>
          <!-- Staff Avatar -->
          <div class="admin-avatar-wrap d-flex align-items-center gap-2 ms-1">
            <img src="https://ui-avatars.com/api/?name=Le+Tan&background=2d7a3a&color=ffffff&bold=true&size=36" class="rounded-circle" alt="Lễ tân" width="36" height="36" />
            <div>
              <div class="fw-bold small lh-1">Nguyễn Lễ Tân</div>
              <div class="text-muted" style="font-size:0.72rem;">Nhân viên lễ tân</div>
            </div>
          </div>
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
  name: 'NhanVienLayout',
  data() {
    return {
      sidebarCollapsed: false,
      showAiBubble: true,
      stats: {
        checkinToday: 47,
        newMembers: 5,
        expiringContracts: 8,
      },
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  position: sticky;
  top: 0;
  z-index: 5;
}
.breadcrumb-item + .breadcrumb-item::before {
  content: "›";
  color: #94a3b8;
}

/* Header stat chips */
.header-stat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0faf3;
  border: 1px solid #c6e9cf;
  border-radius: 20px;
  padding: 5px 14px;
  color: #1a5c28;
  font-size: 0.8rem;
}
.header-stat-chip i { font-size: 0.8rem; opacity: 0.7; }
.chip-value { font-weight: 700; }
.chip-label { color: #4a7c5a; font-size: 0.72rem; }
.header-stat-chip.chip-green {
  background: #f0fdf4;
  border-color: #86efac;
  color: #15803d;
}
.header-stat-chip.chip-green .chip-label { color: #15803d; opacity: 0.7; }
.header-stat-chip.chip-orange {
  background: #fff7ed;
  border-color: #fdba74;
  color: #c2410c;
}
.header-stat-chip.chip-orange .chip-label { color: #c2410c; opacity: 0.7; }

/* Header icon button */
.header-icon-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f7fa;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.header-icon-btn:hover { background: #e8f5e9; color: #2d7a3a; }
.notif-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e74c3c;
  border: 2px solid #fff;
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
