<template>
  
</template>

<script>
export default {
  name: 'NhatKy',
  data() {
    return {
      search: '',
      filterType: '',
      filterUser: '',
      filterDate: '',
      logs: [
        { id: 1,  date: '02/04/2025', time: '09:12:05', user: 'Nguyễn Văn An',  userRole: 'admin',    type: 'login',  action: 'Đăng nhập',           description: 'Đăng nhập thành công từ Chrome',         ip: '192.168.1.10' },
        { id: 2,  date: '02/04/2025', time: '09:15:30', user: 'Nguyễn Văn An',  userRole: 'admin',    type: 'update', action: 'Cập nhật tài khoản',   description: 'Cập nhật email người dùng ID #12',       ip: '192.168.1.10' },
        { id: 3,  date: '02/04/2025', time: '09:40:12', user: 'Trần Thị Bình',  userRole: 'nhanvien', type: 'login',  action: 'Đăng nhập',           description: 'Đăng nhập thành công từ Firefox',        ip: '192.168.1.25' },
        { id: 4,  date: '02/04/2025', time: '10:01:45', user: 'Lê Minh Cường',  userRole: 'khachhang',type: 'login',  action: 'Đăng nhập',           description: 'Đăng nhập thành công từ Mobile',         ip: '10.0.0.15'    },
        { id: 5,  date: '02/04/2025', time: '10:15:00', user: 'Bùi Thị Lan',    userRole: 'admin',    type: 'delete', action: 'Xóa tài khoản',        description: 'Xóa tài khoản người dùng ID #45',        ip: '192.168.1.10' },
        { id: 6,  date: '02/04/2025', time: '10:22:18', user: 'Hệ thống',       userRole: 'system',   type: 'error',  action: 'Lỗi kết nối DB',       description: 'Mất kết nối MySQL trong 2 giây',         ip: 'localhost'    },
        { id: 7,  date: '01/04/2025', time: '17:05:00', user: 'Phạm Thị Dung',  userRole: 'nhanvien', type: 'logout', action: 'Đăng xuất',            description: 'Đăng xuất thủ công',                    ip: '192.168.1.35' },
        { id: 8,  date: '01/04/2025', time: '16:50:00', user: 'Hoàng Văn Em',   userRole: 'khachhang',type: 'update', action: 'Cập nhật hồ sơ',       description: 'Đổi mật khẩu thành công',               ip: '10.0.0.22'    },
        { id: 9,  date: '01/04/2025', time: '14:30:10', user: 'Vũ Thị Phương',  userRole: 'nhanvien', type: 'login',  action: 'Đăng nhập',           description: 'Đăng nhập từ thiết bị mới — cảnh báo',  ip: '192.168.2.5'  },
        { id: 10, date: '01/04/2025', time: '08:00:00', user: 'Hệ thống',       userRole: 'system',   type: 'update', action: 'Sao lưu dữ liệu',      description: 'Tự động backup hoàn thành 100%',         ip: 'localhost'    },
      ],
    }
  },
  computed: {
    filteredLogs() {
      return this.logs.filter(l => {
        const q = this.search.toLowerCase()
        const matchSearch = !q || l.user.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
        const matchType = !this.filterType || l.type === this.filterType
        const matchUser = !this.filterUser || l.userRole === this.filterUser
        return matchSearch && matchType && matchUser
      })
    },
  },
  methods: {
    countByType(type) { return this.logs.filter(l => l.type === type).length },
    typeLabel(t) {
      return { login: 'Đăng nhập', logout: 'Đăng xuất', update: 'Cập nhật', delete: 'Xóa', error: 'Lỗi' }[t] || t
    },
    typeIcon(t) {
      return {
        login:  'fas fa-sign-in-alt',
        logout: 'fas fa-sign-out-alt',
        update: 'fas fa-edit',
        delete: 'fas fa-trash',
        error:  'fas fa-exclamation-triangle',
      }[t] || 'fas fa-circle'
    },
  },
}
</script>

<style scoped>
.page-wrapper { padding: 0; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
}
.page-desc { color: #64748b; font-size: 0.875rem; margin: 0; }

.btn-export {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #2d7a3a;
  border: 2px solid #2d7a3a;
  border-radius: 10px;
  padding: 9px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-export:hover { background: #2d7a3a; color: #fff; }

/* Stats */
.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.stat-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; color: #fff; flex-shrink: 0;
}
.bg-blue   { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.bg-green  { background: linear-gradient(135deg, #22c55e, #15803d); }
.bg-red    { background: linear-gradient(135deg, #ef4444, #b91c1c); }
.bg-orange { background: linear-gradient(135deg, #f97316, #c2410c); }
.stat-value { font-size: 1.5rem; font-weight: 700; color: #1e293b; line-height: 1; }
.stat-label { font-size: 0.78rem; color: #64748b; margin-top: 4px; }

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.search-box {
  display: flex; align-items: center; gap: 10px;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; padding: 9px 16px;
  flex: 1; min-width: 220px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.search-box i { color: #94a3b8; }
.search-box input {
  border: none; outline: none;
  font-size: 0.875rem; width: 100%; background: transparent; color: #1e293b;
}
.filter-group { display: flex; gap: 10px; flex-wrap: wrap; }
.filter-group select, .date-input {
  background: #fff; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 9px 14px; font-size: 0.875rem; color: #475569; cursor: pointer; outline: none;
}

/* Table */
.table-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table thead { background: #f8fafc; }
.data-table th {
  padding: 12px 14px; text-align: left;
  font-size: 0.75rem; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
}
.data-table td {
  padding: 12px 14px; border-bottom: 1px solid #f1f5f9;
  color: #1e293b; vertical-align: middle;
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #f8fafc; }

.time-cell { display: flex; flex-direction: column; gap: 2px; }
.time-date { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
.time-hour { font-size: 0.72rem; }

.user-cell { display: flex; align-items: center; gap: 8px; }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; }
.fw-500 { font-weight: 500; }
.font-mono { font-family: monospace; }

/* Type badges */
.type-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 0.72rem; font-weight: 600; white-space: nowrap;
}
.type-login  { background: #f0fdf4; color: #16a34a; }
.type-logout { background: #f1f5f9; color: #475569; }
.type-update { background: #eff6ff; color: #2563eb; }
.type-delete { background: #fff7ed; color: #c2410c; }
.type-error  { background: #fef2f2; color: #dc2626; }

/* Pagination */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-top: 1px solid #f1f5f9;
}
.page-btns { display: flex; gap: 6px; }
.page-btn {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  color: #64748b; font-size: 0.82rem; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.page-btn.active { background: #2d7a3a; color: #fff; border-color: #2d7a3a; }
.page-btn:hover:not(.active) { background: #f0fdf4; color: #2d7a3a; }
</style>
