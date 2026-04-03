<template>
  <div class="audit-logs-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold title-green mb-1">Trung tâm Tra cứu Nhật ký Hệ thống</h4>
        <p class="text-muted small mb-0">Theo dõi và giám sát mọi biến động dữ liệu thời gian thực</p>
      </div>
      <button class="btn btn-action-green btn-sm px-4 py-2 rounded-3 fw-bold shadow-sm">
        <i class="fas fa-download me-2"></i> Xuất báo cáo (CSV/PDF)
      </button>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="stat-card card-border-cyan bg-white h-100 d-flex flex-column justify-content-center px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2 letter-spacing-wide">TOTAL LOGS TODAY</div>
          <div class="d-flex align-items-end justify-content-between">
            <h2 class="mb-0 fw-bolder text-dark lh-1">1,284</h2>
            <span class="text-green-500 small fw-bold">+12% <i class="fas fa-arrow-trend-up ms-1"></i></span>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-border-purple bg-white h-100 d-flex flex-column justify-content-center px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2 letter-spacing-wide">HIGH SEVERITY CHANGES</div>
          <div class="d-flex align-items-end justify-content-between">
            <h2 class="mb-0 fw-bolder text-purple lh-1">42</h2>
            <span class="text-red-500 small fw-bold">Attention !</span>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-border-cyan bg-white h-100 d-flex flex-column justify-content-center px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2 letter-spacing-wide">LAST ADMIN ACTION</div>
          <div class="d-flex align-items-center gap-3">
            <div class="avatar-orange d-flex align-items-center justify-content-center rounded-circle">
              <i class="fas fa-user text-white"></i>
            </div>
            <div>
              <div class="fw-bold text-dark lh-sm">Cấu hình API</div>
              <div class="very-small text-gray-400 mt-1">2 phút trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm mb-4 rounded-4 filter-bar-card">
      <div class="card-body p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-3">
            <div class="filter-input-group d-flex align-items-center rounded-3 px-3 py-2">
              <i class="far fa-calendar text-gray-400 me-2"></i>
              <input type="text" class="border-0 bg-transparent flex-grow-1 small text-dark outline-none" placeholder="Oct 12, 2023 - Oct 19, 2023" value="Oct 12, 2023 - Oct 19, 2023">
            </div>
          </div>
          <div class="col-md-4">
            <div class="filter-input-group d-flex align-items-center rounded-3 px-3 py-2">
              <i class="fas fa-user-shield text-gray-400 me-2"></i>
              <input type="text" class="border-0 bg-transparent flex-grow-1 small text-gray-400 outline-none" placeholder="Tìm tên quản trị viên...">
            </div>
          </div>
          <div class="col-md-3">
            <select class="form-select border-0 shadow-none filter-input-group rounded-3 py-2 small text-dark cursor-pointer">
              <option>Tất cả danh mục</option>
            </select>
          </div>
          <div class="col-md-2 text-end">
            <button class="btn btn-filter w-100 py-2 rounded-3 fw-bold text-dark">Lọc dữ liệu</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden rounded-4">
      <div class="table-responsive">
        <table class="table mb-0 align-middle table-borderless">
          <thead class="table-header-gray text-gray-500 very-small text-uppercase fw-bold letter-spacing-wide">
            <tr>
              <th class="ps-4 py-3">TIMESTAMP</th>
              <th class="py-3">ACTOR</th>
              <th class="py-3">ACTION</th>
              <th class="py-3">TARGET OBJECT</th>
              <th class="py-3">IP ADDRESS</th>
              <th class="pe-4 py-3 text-end"></th>
            </tr>
          </thead>
          <tbody class="small custom-tbody">
            <tr v-for="log in logs" :key="log.id" class="cursor-pointer border-bottom custom-tr" data-bs-toggle="offcanvas" data-bs-target="#logDetailDrawer">
              <td class="ps-4 text-gray-500 py-3 font-monospace-number">{{ log.timestamp }}</td>
              <td class="fw-bold d-flex align-items-center gap-3 py-3">
                <div class="actor-avatar d-flex align-items-center justify-content-center text-white very-small rounded-circle" :style="{ backgroundColor: log.avatarBg }">
                  {{ log.actorInitials }}
                </div>
                <span class="text-dark">{{ log.actorName }}</span>
              </td>
              <td class="py-3">
                <span class="status-dot" :style="{ backgroundColor: log.actionHex }"></span>
                <span class="fw-bold" :style="{ color: log.actionHex }">{{ log.actionType }}</span>
              </td>
              <td class="text-gray-400 py-3">{{ log.targetObject }}</td>
              <td class="text-gray-400 py-3 font-monospace-number">{{ log.ipAddress }}</td>
              <td class="pe-4 text-end py-3">
                <i class="fas fa-angle-right text-gray-400 fs-5"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="card-footer bg-white d-flex justify-content-between align-items-center py-3 px-4 border-0">
        <div class="very-small text-gray-400">Hiển thị 1-10 trên 1,284 kết quả</div>
        <div class="d-flex align-items-center gap-2 pagination-custom">
          <button class="btn btn-link text-gray-400 p-0 text-decoration-none"><i class="fas fa-angle-left"></i></button>
          <button class="btn active-page rounded-2 fw-bold mx-1">1</button>
          <button class="btn btn-link text-dark fw-bold p-0 text-decoration-none mx-1">2</button>
          <button class="btn btn-link text-dark fw-bold p-0 text-decoration-none mx-1">3</button>
          <button class="btn btn-link text-gray-600 p-0 text-decoration-none"><i class="fas fa-angle-right"></i></button>
        </div>
      </div>
    </div>

    <div class="offcanvas offcanvas-end border-0 shadow-lg" tabindex="-1" id="logDetailDrawer" style="width: 420px;">
       <div class="offcanvas-header border-bottom px-4 py-3">
        <div>
          <h5 class="offcanvas-title fw-bold text-dark mb-1">Chi tiết thay đổi</h5>
          <div class="very-small text-muted">Log ID: 772-AD92-X1</div>
        </div>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body px-4 py-4">
        <div class="row g-2 mb-4">
          <div class="col-6">
            <div class="p-2 rounded-3 bg-light border">
              <div class="very-small text-muted text-uppercase mb-1">HÀNH ĐỘNG</div>
              <div class="fw-bold text-purple small" style="color: #8b5cf6;">UPDATE_MEMBER</div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-2 rounded-3 bg-light border">
              <div class="very-small text-muted text-uppercase mb-1">MỨC ĐỘ</div>
              <div class="fw-bold text-danger small">Nghiêm trọng</div>
            </div>
          </div>
        </div>
        <div class="very-small fw-bold text-muted text-uppercase mb-2 letter-spacing-wide">SO SÁNH THAY ĐỔI (CHANGE COMPARISON)</div>
        <div class="comparison-table border rounded-3 overflow-hidden mb-4 shadow-sm">
          <div class="row g-0 bg-light border-bottom py-2 px-3 fw-bold very-small text-muted">
            <div class="col-6">DỮ LIỆU CŨ (OLD)</div>
            <div class="col-6">DỮ LIỆU MỚI (NEW)</div>
          </div>
          <div class="row g-0 border-bottom">
            <div class="col-6 p-3 border-end bg-white">
              <div class="very-small text-muted mb-1 font-monospace">plan_type</div>
              <div class="small text-dark">Standard_Monthly</div>
            </div>
            <div class="col-6 p-3 bg-success-light">
              <div class="very-small text-success mb-1 font-monospace">plan_type</div>
              <div class="small fw-bold text-success">Premium_Annual</div>
            </div>
          </div>
          <div class="row g-0">
             <div class="col-6 p-3 border-end bg-white">
              <div class="very-small text-muted mb-1 font-monospace">status</div>
              <div class="small text-dark">Active</div>
            </div>
            <div class="col-6 p-3 bg-success-light">
              <div class="very-small text-success mb-1 font-monospace">status</div>
              <div class="small fw-bold text-success">VIP_Priority</div>
            </div>
          </div>
        </div>
        <button class="btn btn-filter w-100 fw-bold py-2 mb-3 rounded-3 text-dark" data-bs-dismiss="offcanvas">
          <i class="fas fa-check-double me-2"></i> Xác nhận nhật ký & Đóng
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AuditLogs',
  data() {
    return {
      // Dữ liệu mẫu (Mock data) được cấu hình chính xác màu sắc
      logs: [
        { id: 1, timestamp: '2023-10-24 14:22:05', actorInitials: 'H', actorName: 'Hùng Trần', avatarBg: '#547665', actionType: 'UPDATE_MEMBER', actionHex: '#8b5cf6', targetObject: 'MBR_992812', ipAddress: '192.168.1.45' },
        { id: 2, timestamp: '2023-10-24 14:15:30', actorInitials: 'L', actorName: 'Linh Phạm', avatarBg: '#a7cdbd', actionType: 'CREATE_PLAN', actionHex: '#10b981', targetObject: 'PLN_KICK_OFF', ipAddress: '114.23.1.89' },
        { id: 3, timestamp: '2023-10-24 13:58:12', actorInitials: 'SY', actorName: 'HS thống AI', avatarBg: '#448c68', actionType: 'AUTO_BACKUP', actionHex: '#0ea5e9', targetObject: 'DB_SNAPSHOT_02', ipAddress: 'localhost' },
        { id: 4, timestamp: '2023-10-24 13:40:01', actorInitials: 'T', actorName: 'Admin Tuấn', avatarBg: '#e89c68', actionType: 'DELETE_CAMPAIGN', actionHex: '#8b5cf6', targetObject: 'CMP_BLACK_FRI', ipAddress: '45.76.122.9' },
      ]
    }
  }
}
</script>

<style scoped>
/* ================= CSS PIXEL-PERFECT ================= */
.audit-logs-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

/* Typography & Colors */
.title-green { color: #3b7b59; }
.text-purple { color: #8b5cf6 !important; }
.text-green-500 { color: #10b981 !important; }
.text-red-500 { color: #ef4444 !important; }
.text-gray-400 { color: #9ca3af !important; }
.text-gray-500 { color: #6b7280 !important; }
.very-small { font-size: 0.7rem; }
.letter-spacing-wide { letter-spacing: 0.05em; }
.font-monospace-number { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }

/* Buttons */
.btn-action-green {
  background-color: #4b8965;
  border-color: #4b8965;
  color: white;
}
.btn-action-green:hover { background-color: #3b6d51; border-color: #3b6d51; }

.btn-filter {
  background-color: #e2e8f0;
  border: none;
}
.btn-filter:hover { background-color: #cbd5e1; }

/* Stats Cards (Border full bọc quanh) */
.stat-card {
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.card-border-cyan { border: 2px solid #38bdf8; }
.card-border-purple { border: 2px solid #a855f7; }

/* Avatar */
.avatar-orange {
  width: 38px;
  height: 38px;
  background-color: #fdba74;
}
.actor-avatar {
  width: 32px;
  height: 32px;
  font-weight: bold;
}

/* Filter Bar */
.filter-bar-card { background-color: #ffffff; }
.filter-input-group { background-color: #f1f5f9; }
.outline-none:focus { outline: none; }

/* Table Styling */
.table-header-gray { background-color: #f8fafc; }
.custom-tbody tr.custom-tr { border-bottom-color: #f1f5f9; }
.custom-tbody tr:hover { background-color: #f8fafc; }

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

/* Pagination */
.active-page {
  background-color: #2b6645;
  color: white;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.active-page:hover { color: white; background-color: #1e4b32; }

/* Utilities */
.cursor-pointer { cursor: pointer; }
.bg-success-light { background-color: #f0fdf4 !important; }
.text-success { color: #16a34a !important; }

/* Animation */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Modal/Drawer Backdrop */
:deep(.offcanvas-backdrop.show) { opacity: 0.3; }
</style>