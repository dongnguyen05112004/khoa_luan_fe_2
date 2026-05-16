<template>
  <div class="branch-mgr">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản lý chi nhánh hệ thống</h1>
        <p class="page-desc">Thiết lập và quản lý danh sách các chi nhánh phòng tập SmartGym AI.</p>
      </div>
      <button class="btn-create" @click="openCreateModal">
        <i class="fas fa-plus"></i>
        Thêm chi nhánh mới
      </button>
    </div>

    <!-- Stats Row -->
    <div class="stats-row">
      <div class="stats-card">
        <div class="stats-info">
          <div class="stats-label">TỔNG CHI NHÁNH</div>
          <div class="stats-number">{{ branches.length }}</div>
        </div>
        <div class="stats-icon"><i class="fas fa-building"></i></div>
      </div>
      <div class="stats-card">
        <div class="stats-info">
          <div class="stats-label">TỔNG SỨC CHỨA</div>
          <div class="stats-number">{{ totalCapacity }}</div>
        </div>
        <div class="stats-icon"><i class="fas fa-users"></i></div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Đang tải danh sách chi nhánh...</p>
      </div>
      <table v-else class="branch-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>TÊN CHI NHÁNH</th>
            <th>ĐỊA CHỈ</th>
            <th>SỐ ĐIỆN THOẠI</th>
            <th>SỨC CHỨA</th>
            <th>HỘI VIÊN / NHÂN VIÊN</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="branch in branches" :key="branch.id" class="table-row">
            <td class="col-id">#{{ branch.id }}</td>
            <td class="col-name">
              <div class="branch-cell">
                <div class="branch-avatar">{{ branch.branch_name.charAt(0) }}</div>
                <span class="branch-name">{{ branch.branch_name }}</span>
              </div>
            </td>
            <td class="col-address">{{ branch.address || '—' }}</td>
            <td class="col-phone">{{ branch.phone || '—' }}</td>
            <td class="col-capacity">
              <span class="capacity-badge">{{ branch.capacity || '—' }}</span>
            </td>
            <td class="col-stats">
              <div class="mini-stats">
                <span title="Người dùng"><i class="fas fa-user"></i> {{ branch.users_count || 0 }}</span>
                <span title="Thiết bị"><i class="fas fa-dumbbell"></i> {{ branch.equipment_count || 0 }}</span>
              </div>
            </td>
            <td class="col-actions">
              <button class="action-btn edit" title="Chỉnh sửa" @click="openEditModal(branch)">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn delete" title="Xoá chi nhánh" @click="deleteBranch(branch)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="branches.length === 0">
            <td colspan="7" class="no-data">
              <i class="fas fa-building-slash"></i>
              <p>Chưa có chi nhánh nào được tạo</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Tạo/Sửa Chi Nhánh -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showModal" @click.self="showModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-header-icon" :class="isEdit ? 'edit-icon' : 'create-icon'">
              <i :class="isEdit ? 'fas fa-pen' : 'fas fa-plus'"></i>
            </div>
            <div>
              <h2>{{ isEdit ? 'Chỉnh sửa chi nhánh' : 'Thêm chi nhánh mới' }}</h2>
              <p>{{ isEdit ? 'Cập nhật thông tin chi nhánh hệ thống.' : 'Điền thông tin để thêm chi nhánh mới vào hệ thống.' }}</p>
            </div>
            <button class="modal-close" @click="showModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label><i class="fas fa-building form-label-icon"></i> Tên chi nhánh <span class="required">*</span></label>
              <input v-model="form.branch_name" type="text" placeholder="Nhập tên chi nhánh..." :class="{ 'input-error': errors.branch_name }" />
              <span class="error-msg" v-if="errors.branch_name">{{ errors.branch_name }}</span>
            </div>
            <div class="form-group">
              <label><i class="fas fa-map-marker-alt form-label-icon"></i> Địa chỉ</label>
              <input v-model="form.address" type="text" placeholder="Nhập địa chỉ..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-phone form-label-icon"></i> Số điện thoại</label>
                <input v-model="form.phone" type="text" placeholder="Nhập số điện thoại..." />
              </div>
              <div class="form-group">
                <label><i class="fas fa-users form-label-icon"></i> Sức chứa</label>
                <input v-model="form.capacity" type="number" placeholder="Sức chứa tối đa..." min="1" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showModal = false">Huỷ</button>
            <button class="btn-save" @click="saveBranch" :disabled="saving">
              <i v-if="saving" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-check"></i>
              {{ isEdit ? 'Lưu thay đổi' : 'Tạo chi nhánh' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast-fade">
      <div class="toast-msg" v-if="toast.show">
        <i :class="toast.icon"></i> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'QuanLyChiNhanh',
  data() {
    return {
      branches: [],
      loading: false,
      saving: false,
      showModal: false,
      isEdit: false,
      form: {
        id: null,
        branch_name: '',
        address: '',
        phone: '',
        capacity: null
      },
      errors: {
        branch_name: ''
      },
      toast: {
        show: false,
        message: '',
        icon: ''
      }
    };
  },
  computed: {
    totalCapacity() {
      return this.branches.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0);
    }
  },
  mounted() {
    this.fetchBranches();
  },
  methods: {
    async fetchBranches() {
      this.loading = true;
      try {
        const response = await axios.get('/api/branches');
        this.branches = response.data;
      } catch (error) {
        this.showToast('fas fa-exclamation-circle', 'Không thể tải danh sách chi nhánh!');
      } finally {
        this.loading = false;
      }
    },
    openCreateModal() {
      this.isEdit = false;
      this.form = { id: null, branch_name: '', address: '', phone: '', capacity: null };
      this.errors = { branch_name: '' };
      this.showModal = true;
    },
    openEditModal(branch) {
      this.isEdit = true;
      this.form = { ...branch };
      this.errors = { branch_name: '' };
      this.showModal = true;
    },
    async saveBranch() {
      if (!this.form.branch_name.trim()) {
        this.errors.branch_name = 'Vui lòng nhập tên chi nhánh';
        return;
      }

      this.saving = true;
      try {
        if (this.isEdit) {
          await axios.put(`/api/branches/${this.form.id}`, this.form);
          this.showToast('fas fa-check-circle', 'Cập nhật chi nhánh thành công!');
        } else {
          await axios.post('/api/branches', this.form);
          this.showToast('fas fa-check-circle', 'Thêm chi nhánh mới thành công!');
        }
        this.showModal = false;
        this.fetchBranches();
      } catch (error) {
        this.showToast('fas fa-times-circle', 'Lỗi khi lưu chi nhánh!');
      } finally {
        this.saving = false;
      }
    },
    async deleteBranch(branch) {
      if (!confirm(`Bạn có chắc muốn xoá chi nhánh "${branch.branch_name}"?`)) return;
      try {
        await axios.delete(`/api/branches/${branch.id}`);
        this.showToast('fas fa-trash', 'Đã xoá chi nhánh!');
        this.fetchBranches();
      } catch (error) {
        this.showToast('fas fa-times-circle', 'Không thể xoá chi nhánh này!');
      }
    },
    showToast(icon, message) {
      this.toast = { show: true, icon, message };
      setTimeout(() => { this.toast.show = false; }, 3000);
    }
  }
};
</script>

<style scoped>
.branch-mgr {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
}
.page-desc {
  color: #64748b;
  margin: 0;
}
.btn-create {
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(45, 122, 58, 0.2);
}
.btn-create:hover {
  background: #245f2e;
  transform: translateY(-2px);
}

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stats-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.stats-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.stats-number {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
}
.stats-icon {
  width: 48px;
  height: 48px;
  background: #f0fdf4;
  color: #2d7a3a;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

/* Table Card */
.table-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}
.branch-table {
  width: 100%;
  border-collapse: collapse;
}
.branch-table th {
  background: #f8fafc;
  padding: 16px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #e2e8f0;
}
.table-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s;
}
.table-row:hover {
  background: #f8fafc;
}
.table-row td {
  padding: 16px 20px;
  vertical-align: middle;
  color: #334155;
  font-size: 0.9rem;
}

.branch-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.branch-avatar {
  width: 36px;
  height: 36px;
  background: #2d7a3a;
  color: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}
.branch-name {
  font-weight: 600;
  color: #1e293b;
}

.capacity-badge {
  background: #eef2ff;
  color: #4f46e5;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.mini-stats {
  display: flex;
  gap: 12px;
  font-size: 0.8rem;
  color: #64748b;
}
.mini-stats span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 5px;
}
.action-btn.edit { background: #f0fdf4; color: #166534; }
.action-btn.edit:hover { background: #dcfce7; }
.action-btn.delete { background: #fef2f2; color: #991b1b; }
.action-btn.delete:hover { background: #fee2e2; }

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  width: 100%;
  max-width: 550px;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  overflow: hidden;
  animation: modalIn 0.3s ease-out;
}
@keyframes modalIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.modal-header {
  padding: 24px 30px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}
.modal-header-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}
.create-icon { background: #f0fdf4; color: #2d7a3a; }
.edit-icon { background: #eff6ff; color: #2563eb; }
.modal-header h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
.modal-header p { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }
.modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #94a3b8; font-size: 1.1rem; cursor: pointer; }

.modal-body { padding: 30px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 8px; }
.form-label-icon { width: 20px; color: #94a3b8; margin-right: 5px; }
.form-group input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
}
.form-group input:focus { outline: none; border-color: #2d7a3a; box-shadow: 0 0 0 4px rgba(45, 122, 58, 0.1); }
.input-error { border-color: #ef4444 !important; }
.error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 5px; display: block; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.required { color: #ef4444; }

.modal-footer { padding: 20px 30px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 12px; }
.btn-cancel { background: #fff; border: 1.5px solid #e2e8f0; color: #64748b; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; }
.btn-save { background: #2d7a3a; border: none; color: #fff; padding: 10px 24px; border-radius: 10px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; }
.btn-save:disabled { opacity: 0.7; cursor: not-allowed; }

/* Toast */
.toast-msg {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: #fff;
  padding: 12px 24px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  z-index: 2000;
}

.no-data {
  padding: 60px 0;
  text-align: center;
  color: #94a3b8;
}
.no-data i { font-size: 3rem; margin-bottom: 15px; display: block; }

.loading-state {
  padding: 60px 0;
  text-align: center;
  color: #64748b;
}
.loading-state i { font-size: 2rem; margin-bottom: 15px; }

/* Animations */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translate(-50%, 20px); }
</style>
