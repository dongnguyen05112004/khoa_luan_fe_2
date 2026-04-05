<template>
  <div class="thietbi-page">

    <!-- TOAST -->
    <transition name="toast-fade">
      <div v-if="toast.show" :class="['toast-msg', toast.type]">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.text }}
      </div>
    </transition>

    <!-- PAGE HEADER -->
    <div class="page-header">
      <div class="page-title-block">
        <div class="page-breadcrumb">
          <span class="bc-root">Admin</span>
          <i class="fas fa-chevron-right bc-sep"></i>
          <span class="bc-cur">Thiết bị</span>
        </div>
        <h1 class="page-title">Quản lý thiết bị phòng tập</h1>
      </div>
      <div class="page-actions">
        <button class="btn-add" @click="openAddModal">
          <i class="fas fa-plus"></i> Thêm thiết bị
        </button>
      </div>
    </div>

    <!-- KPI CARDS -->
    <div class="kpi-row">
      <div class="kpi-card accent-green">
        <div class="kpi-card-inner">
          <div class="kpi-icon-wrap"><i class="fas fa-dumbbell"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">TỔNG MÁY</div>
            <div class="kpi-value">{{ devices.length }}</div>
          </div>
        </div>
        <div class="kpi-border-accent"></div>
      </div>
      <div class="kpi-card accent-blue">
        <div class="kpi-card-inner">
          <div class="kpi-icon-wrap"><i class="fas fa-bolt"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">ĐANG VẬN HÀNH</div>
            <div class="kpi-value">{{ devices.filter(d => d.status === 'active').length }}</div>
          </div>
        </div>
        <div class="kpi-border-accent"></div>
      </div>
      <div class="kpi-card accent-orange">
        <div class="kpi-card-inner">
          <div class="kpi-icon-wrap"><i class="fas fa-tools"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">ĐANG BẢO TRÌ</div>
            <div class="kpi-value">{{ devices.filter(d => d.status === 'maintenance').length }}</div>
          </div>
        </div>
        <div class="kpi-border-accent"></div>
      </div>
      <div class="kpi-card accent-red">
        <div class="kpi-card-inner">
          <div class="kpi-icon-wrap"><i class="fas fa-exclamation-triangle"></i></div>
          <div class="kpi-data">
            <div class="kpi-label">BỊ HỎNG</div>
            <div class="kpi-value">{{ devices.filter(d => d.status === 'broken').length }}</div>
          </div>
        </div>
        <div class="kpi-border-accent"></div>
      </div>
    </div>

    <!-- TOOLBAR -->
    <div class="toolbar">
      <div class="search-box">
        <i class="fas fa-search search-ic"></i>
        <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tên hoặc mã thiết bị..." class="search-input"/>
      </div>
      <div class="toolbar-right">
        <select v-model="filterStatus" class="status-select">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang sử dụng</option>
          <option value="maintenance">Đang bảo trì</option>
          <option value="broken">Hỏng / Ngừng dùng</option>
        </select>
        <button class="btn-maintenance-list" @click="openMaintenanceListModal">
          <i class="fas fa-calendar-alt"></i> Lịch bảo trì
        </button>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-wrap">
      <div class="spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else class="content-area" :class="{ 'with-panel': selectedDevice }">

      <!-- Device Grid -->
      <div class="device-grid">
        <div v-if="filteredDevices.length === 0" class="empty-state">
          <i class="fas fa-box-open"></i>
          <p>Không tìm thấy thiết bị nào</p>
        </div>
        <div
          v-for="device in filteredDevices"
          :key="device.id"
          class="device-card"
          :class="{ 'is-selected': selectedDevice && selectedDevice.id === device.id }"
          @click="selectDevice(device)"
        >
          <div class="device-img-wrap">
            <div class="device-status-badge" :class="device.status">{{ statusLabel(device.status) }}</div>
            <div class="device-img-placeholder" :style="imgBgFor(device.status)">
              <i :class="iconFor(device.type)" class="device-img-icon"></i>
            </div>
          </div>
          <div class="device-info">
            <div class="device-name">{{ device.equipment_name || '—' }}</div>
            <div class="device-meta">
              <span class="device-meta-item"><i class="fas fa-tag"></i> {{ device.serial_number || '—' }}</span>
              <span class="device-meta-item"><i class="fas fa-map-marker-alt"></i> {{ device.location || (device.branch && device.branch.name) || '—' }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn-detail" @click.stop="selectDevice(device)"><i class="fas fa-eye"></i> Chi tiết</button>
            <button class="btn-delete-card" @click.stop="confirmDelete(device)" title="Xóa"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
      </div>

      <!-- Detail Panel -->
      <transition name="panel-slide">
        <div class="detail-panel" v-if="selectedDevice">
          <div class="panel-header">
            <div>
              <div class="panel-title">{{ selectedDevice.equipment_name || '—' }}</div>
              <div class="panel-device-code">{{ selectedDevice.serial_number }}</div>
            </div>
            <button class="panel-close" @click="selectedDevice = null"><i class="fas fa-times"></i></button>
          </div>

          <!-- Status Quick Update -->
          <div class="panel-section">
            <div class="section-label"><i class="fas fa-circle-dot"></i> Trạng thái thiết bị</div>
            <div class="status-btn-group">
              <button
                v-for="s in statusOptions"
                :key="s.value"
                :class="['status-opt-btn', s.value, selectedDevice.status === s.value ? 'active' : '']"
                @click="quickUpdateStatus(s.value)"
                :disabled="savingStatus"
              >
                <i :class="s.icon"></i> {{ s.label }}
              </button>
            </div>
          </div>

          <!-- Detail Info -->
          <div class="panel-section">
            <div class="section-label"><i class="fas fa-info-circle"></i> Thông tin</div>
            <div class="spec-grid">
              <div class="spec-item"><div class="spec-label">Thương hiệu</div><div class="spec-value">{{ selectedDevice.brand || '—' }}</div></div>
              <div class="spec-item"><div class="spec-label">Loại</div><div class="spec-value">{{ selectedDevice.type || '—' }}</div></div>
              <div class="spec-item"><div class="spec-label">Khu vực</div><div class="spec-value">{{ selectedDevice.location || (selectedDevice.branch && selectedDevice.branch.name) || '—' }}</div></div>
              <div class="spec-item"><div class="spec-label">Năm mua</div><div class="spec-value">{{ selectedDevice.purchase_date ? selectedDevice.purchase_date.substring(0, 4) : '—' }}</div></div>
            </div>
          </div>

          <!-- Maintenance of this device -->
          <div class="panel-section">
            <div class="section-label-row">
              <span class="section-label"><i class="fas fa-calendar-check"></i> Lịch bảo trì</span>
              <button class="btn-add-maint" @click="openAddMaintenanceModal(selectedDevice)">
                <i class="fas fa-plus"></i> Thêm lịch
              </button>
            </div>
            <div v-if="loadingMaint" class="maint-loading">Đang tải...</div>
            <div v-else-if="deviceMaintenances.length === 0" class="maint-empty">Chưa có lịch bảo trì</div>
            <div v-else class="maint-list">
              <div class="maint-item" v-for="m in deviceMaintenances" :key="m.id">
                <div class="maint-info">
                  <div class="maint-title">{{ m.description || '(Không có mô tả)' }}</div>
                  <div class="maint-date"><i class="fas fa-calendar"></i> {{ formatDate(m.maintenance_date) }}</div>
                </div>
                <button class="btn-del-maint" @click="deleteMaintenance(m.id)" title="Xóa lịch"><i class="fas fa-times"></i></button>
              </div>
            </div>
          </div>

          <!-- Panel Actions -->
          <div class="panel-actions">
            <button class="btn-edit-device" @click="openEditModal(selectedDevice)">
              <i class="fas fa-edit"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ===== MODAL: ADD / EDIT DEVICE ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showDeviceModal" @click.self="showDeviceModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <span class="modal-title">
              <i :class="editingDevice ? 'fas fa-edit' : 'fas fa-plus-circle'"></i>
              {{ editingDevice ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới' }}
            </span>
            <button class="modal-close" @click="showDeviceModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Tên thiết bị <span class="req">*</span></label>
                <input v-model="deviceForm.equipment_name" type="text" placeholder="VD: Máy chạy bộ NordicTrack" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Mã serial</label>
                <input v-model="deviceForm.serial_number" type="text" placeholder="VD: TBM-001" class="form-input"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Khu vực / Vị trí</label>
                <input v-model="deviceForm.location" type="text" placeholder="VD: Cardio A" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Loại thiết bị</label>
                <select v-model="deviceForm.type" class="form-input">
                  <option value="">-- Chọn loại --</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Flexibility">Flexibility</option>
                  <option value="Other">Khác</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Thương hiệu</label>
                <input v-model="deviceForm.brand" type="text" placeholder="VD: Matrix, LifeFitness" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Ngày mua</label>
                <input v-model="deviceForm.purchase_date" type="date" class="form-input"/>
              </div>
            </div>
            <div class="form-group full" v-if="editingDevice">
              <label>Trạng thái</label>
              <select v-model="deviceForm.status" class="form-input">
                <option value="active">Đang sử dụng</option>
                <option value="maintenance">Đang bảo trì</option>
                <option value="broken">Hỏng / Ngừng dùng</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showDeviceModal = false">Huỷ</button>
            <button class="btn-save" @click="saveDevice" :disabled="savingDevice">
              <i class="fas fa-save"></i> {{ savingDevice ? 'Đang lưu...' : 'Lưu thiết bị' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== MODAL: DELETE CONFIRM ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="modal-box delete-modal-box">
          <div class="delete-modal-icon-wrap">
            <div class="delete-modal-icon"><i class="fas fa-trash-alt"></i></div>
          </div>
          <div class="delete-modal-content">
            <h3 class="delete-modal-title">Xác nhận xóa thiết bị?</h3>
            <p class="delete-modal-desc">
              Bạn đang xóa thiết bị <strong>{{ deviceToDelete && deviceToDelete.name }}</strong>.
              Hành động này không thể hoàn tác.
            </p>
          </div>
          <div class="delete-modal-footer">
            <button class="btn-cancel" @click="showDeleteModal = false">Huỷ</button>
            <button class="btn-confirm-delete" @click="deleteDevice" :disabled="savingDevice">
              <i class="fas fa-trash-alt"></i> {{ savingDevice ? 'Đang xóa...' : 'Xóa thiết bị' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== MODAL: ADD MAINTENANCE ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showMaintenanceModal" @click.self="showMaintenanceModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <span class="modal-title"><i class="fas fa-calendar-plus"></i> Tạo lịch bảo trì</span>
            <button class="modal-close" @click="showMaintenanceModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group full">
              <label>Thiết bị <span class="req">*</span></label>
              <select v-model="maintForm.equipment_id" class="form-input">
                <option value="">-- Chọn thiết bị --</option>
                <option v-for="d in devices" :key="d.id" :value="d.id">{{ d.equipment_name }} ({{ d.serial_number || d.id }})</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Tiêu đề <span class="req">*</span></label>
                <input v-model="maintForm.title" type="text" placeholder="VD: Bảo trì định kỳ Q2" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Ngày bảo trì <span class="req">*</span></label>
                <input v-model="maintForm.scheduled_date" type="date" class="form-input"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Loại</label>
                <select v-model="maintForm.type" class="form-input">
                  <option value="one_time">Một lần</option>
                  <option value="recurring">Định kỳ</option>
                </select>
              </div>
              <div class="form-group" v-if="maintForm.type === 'recurring'">
                <label>Chu kỳ (ngày)</label>
                <input v-model="maintForm.interval_days" type="number" placeholder="VD: 30" class="form-input"/>
              </div>
            </div>
            <div class="form-group full">
              <label>Ghi chú</label>
              <textarea v-model="maintForm.notes" rows="3" placeholder="Mô tả công việc bảo trì..." class="form-input form-textarea"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showMaintenanceModal = false">Huỷ</button>
            <button class="btn-save" @click="saveMaintenance" :disabled="savingMaint">
              <i class="fas fa-save"></i> {{ savingMaint ? 'Đang lưu...' : 'Lưu lịch' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== MODAL: MAINTENANCE LIST ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showMaintenanceListModal" @click.self="showMaintenanceListModal = false">
        <div class="modal-box modal-wide">
          <div class="modal-header">
            <span class="modal-title"><i class="fas fa-calendar-alt"></i> Danh sách lịch bảo trì</span>
            <div style="display:flex;gap:8px;align-items:center;">
              <button class="btn-add-inline" @click="openAddMaintenanceModal(null)"><i class="fas fa-plus"></i> Thêm lịch</button>
              <button class="modal-close" @click="showMaintenanceListModal = false"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="modal-body" style="max-height:60vh;overflow-y:auto;">
            <div v-if="loadingAllMaint" class="maint-loading">Đang tải...</div>
            <div v-else-if="allMaintenances.length === 0" class="maint-empty">Chưa có lịch bảo trì nào</div>
            <table v-else class="maint-table">
              <thead>
                <tr>
                  <th>Thiết bị</th>
                  <th>Tiêu đề</th>
                  <th>Ngày bảo trì</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="m in allMaintenances" :key="m.id">
                  <td>{{ getDeviceName(m.equipment_id) }}</td>
                  <td>{{ m.description || '(Không có mô tả)' }}</td>
                  <td>{{ formatDate(m.maintenance_date) }}</td>
                  <td><span :class="['type-badge', m.is_periodic ? 'recurring' : 'one_time']">{{ m.is_periodic ? 'Định kỳ' : 'Một lần' }}</span></td>
                  <td><span :class="['maint-status', m.status]">{{ m.status || 'pending' }}</span></td>
                  <td><button class="btn-del-maint" @click="deleteMaintenance(m.id)" title="Xóa"><i class="fas fa-trash-alt"></i></button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import { equipmentApi, maintenanceApi } from '../../services/equipmentApi.js'

export default {
  name: 'TabThietBi',
  data() {
    return {
      loading: false,
      savingDevice: false,
      savingStatus: false,
      savingMaint: false,
      loadingMaint: false,
      loadingAllMaint: false,

      searchQuery: '',
      filterStatus: '',
      devices: [],
      selectedDevice: null,
      deviceMaintenances: [],
      allMaintenances: [],

      showDeviceModal: false,
      editingDevice: null,
      deviceForm: { equipment_name: '', serial_number: '', location: '', type: '', brand: '', purchase_date: '', status: 'active' },

      showDeleteModal: false,
      deviceToDelete: null,

      showMaintenanceModal: false,
      maintForm: { equipment_id: '', title: '', scheduled_date: '', type: 'one_time', interval_days: '', notes: '' },

      showMaintenanceListModal: false,

      toast: { show: false, text: '', type: 'success' },
      toastTimer: null,

      statusOptions: [
        { value: 'active', label: 'Đang sử dụng', icon: 'fas fa-check-circle' },
        { value: 'maintenance', label: 'Bảo trì', icon: 'fas fa-tools' },
        { value: 'broken', label: 'Hỏng', icon: 'fas fa-exclamation-triangle' },
      ],
    }
  },

  computed: {
    filteredDevices() {
      return this.devices.filter(d => {
        const q = this.searchQuery.toLowerCase()
        const name = (d.equipment_name || '').toLowerCase()
        const code = (d.serial_number || '').toLowerCase()
        const matchSearch = !q || name.includes(q) || code.includes(q)
        const matchStatus = !this.filterStatus || d.status === this.filterStatus
        return matchSearch && matchStatus
      })
    },
  },

  mounted() {
    this.fetchDevices()
  },

  methods: {
    // ── HELPERS ──────────────────────────────────────────
    showToast(text, type = 'success') {
      clearTimeout(this.toastTimer)
      this.toast = { show: true, text, type }
      this.toastTimer = setTimeout(() => { this.toast.show = false }, 3500)
    },

    statusLabel(status) {
      const map = { active: 'Đang sử dụng', maintenance: 'Bảo trì', broken: 'Hỏng' }
      return map[status] || status
    },

    imgBgFor(status) {
      const map = {
        active: 'background: linear-gradient(135deg,#e8f5e9,#c8e6c9)',
        maintenance: 'background: linear-gradient(135deg,#fff3e0,#ffe082)',
        broken: 'background: linear-gradient(135deg,#ffebee,#ffcdd2)',
      }
      return map[status] || 'background: linear-gradient(135deg,#f1f5f9,#e2e8f0)'
    },

    iconFor(type) {
      const map = { Cardio: 'fas fa-walking', Strength: 'fas fa-dumbbell', Flexibility: 'fas fa-child' }
      return map[type] || 'fas fa-dumbbell'
    },

    formatDate(d) {
      if (!d) return '—'
      const dt = new Date(d)
      return isNaN(dt) ? d : dt.toLocaleDateString('vi-VN')
    },

    getDeviceName(id) {
      const d = this.devices.find(x => x.id === id)
      return d ? (d.equipment_name || d.id) : `#${id}`
    },

    // ── FETCH DEVICES ────────────────────────────────────
    async fetchDevices() {
      this.loading = true
      try {
        const res = await equipmentApi.getAll()
        // support both { data: [...] } and [...] responses
        this.devices = Array.isArray(res.data) ? res.data : (res.data.data || [])
      } catch (e) {
        this.showToast('Không thể tải danh sách thiết bị', 'error')
      } finally {
        this.loading = false
      }
    },

    // ── SELECT DEVICE & fetch its maintenance ────────────
    async selectDevice(device) {
      if (this.selectedDevice && this.selectedDevice.id === device.id) {
        this.selectedDevice = null
        return
      }
      this.selectedDevice = device
      this.deviceMaintenances = []
      this.loadingMaint = true
      try {
        const res = await maintenanceApi.getAll({ equipment_id: device.id })
        const list = Array.isArray(res.data) ? res.data : (res.data.data || [])
        this.deviceMaintenances = list.filter(m => m.equipment_id === device.id)
      } catch {
        this.deviceMaintenances = []
      } finally {
        this.loadingMaint = false
      }
    },

    // ── ADD MODAL ────────────────────────────────────────
    openAddModal() {
      this.editingDevice = null
      this.deviceForm = { equipment_name: '', serial_number: '', location: '', type: '', brand: '', purchase_date: '', status: 'active' }
      this.showDeviceModal = true
    },

    openEditModal(device) {
      this.editingDevice = device
      this.deviceForm = {
        equipment_name: device.equipment_name || '',
        serial_number: device.serial_number || '',
        location: device.location || '',
        type: device.type || '',
        brand: device.brand || '',
        purchase_date: device.purchase_date ? device.purchase_date.substring(0, 10) : '',
        status: device.status || 'active',
      }
      this.showDeviceModal = true
    },

    async saveDevice() {
      if (!this.deviceForm.equipment_name) {
        this.showToast('Vui lòng nhập tên thiết bị', 'error')
        return
      }
      this.savingDevice = true
      try {
        if (this.editingDevice) {
          await equipmentApi.update(this.editingDevice.id, this.deviceForm)
          this.showToast('Cập nhật thiết bị thành công!')
        } else {
          await equipmentApi.create(this.deviceForm)
          this.showToast('Thêm thiết bị thành công!')
        }
        this.showDeviceModal = false
        await this.fetchDevices()
        if (this.selectedDevice) {
          const updated = this.devices.find(d => d.id === this.selectedDevice.id)
          if (updated) this.selectedDevice = updated
        }
      } catch (e) {
        const msg = e.response?.data?.message || 'Có lỗi xảy ra khi lưu'
        this.showToast(msg, 'error')
      } finally {
        this.savingDevice = false
      }
    },

    // ── DELETE DEVICE ────────────────────────────────────
    confirmDelete(device) {
      this.deviceToDelete = device
      this.showDeleteModal = true
    },

    async deleteDevice() {
      if (!this.deviceToDelete) return
      this.savingDevice = true
      try {
        await equipmentApi.remove(this.deviceToDelete.id)
        if (this.selectedDevice && this.selectedDevice.id === this.deviceToDelete.id) {
          this.selectedDevice = null
        }
        this.showToast('Xóa thiết bị thành công!')
        this.showDeleteModal = false
        await this.fetchDevices()
      } catch (e) {
        const msg = e.response?.data?.message || 'Không thể xóa thiết bị'
        this.showToast(msg, 'error')
      } finally {
        this.savingDevice = false
        this.deviceToDelete = null
      }
    },

    // ── QUICK STATUS ─────────────────────────────────────
    async quickUpdateStatus(newStatus) {
      if (!this.selectedDevice || this.selectedDevice.status === newStatus) return
      this.savingStatus = true
      try {
        await equipmentApi.updateStatus(this.selectedDevice.id, newStatus)
        this.selectedDevice.status = newStatus
        const idx = this.devices.findIndex(d => d.id === this.selectedDevice.id)
        if (idx !== -1) this.devices[idx].status = newStatus
        this.showToast(`Đã cập nhật trạng thái: ${this.statusLabel(newStatus)}`)
      } catch (e) {
        const msg = e.response?.data?.message || 'Không thể cập nhật trạng thái'
        this.showToast(msg, 'error')
      } finally {
        this.savingStatus = false
      }
    },

    // ── MAINTENANCE ──────────────────────────────────────
    openAddMaintenanceModal(device) {
      this.showMaintenanceListModal = false
      this.maintForm = {
        equipment_id: device ? device.id : '',
        title: '',
        scheduled_date: '',
        type: 'one_time',
        interval_days: '',
        notes: '',
      }
      this.showMaintenanceModal = true
    },

    async saveMaintenance() {
      if (!this.maintForm.equipment_id || !this.maintForm.scheduled_date) {
        this.showToast('Vui lòng chọn thiết bị và ngày bảo trì', 'error')
        return
      }
      this.savingMaint = true
      try {
        // Map form fields → backend fields
        const payload = {
          equipment_id:     this.maintForm.equipment_id,
          maintenance_date: this.maintForm.scheduled_date,           // scheduled_date → maintenance_date
          description:      [this.maintForm.title, this.maintForm.notes].filter(Boolean).join(' — ') || null,
          is_periodic:      this.maintForm.type === 'recurring',     // type → is_periodic boolean
          interval_days:    this.maintForm.type === 'recurring' ? (this.maintForm.interval_days || null) : null,
        }
        await maintenanceApi.create(payload)
        this.showToast('Tạo lịch bảo trì thành công!')
        this.showMaintenanceModal = false
        if (this.selectedDevice && this.selectedDevice.id === this.maintForm.equipment_id) {
          await this.selectDevice(this.selectedDevice)
        }
        if (this.showMaintenanceListModal) await this.openMaintenanceListModal()
      } catch (e) {
        const msg = e.response?.data?.message
          || (e.response?.data?.errors ? Object.values(e.response.data.errors).flat().join(', ') : null)
          || 'Có lỗi xảy ra'
        this.showToast(msg, 'error')
      } finally {
        this.savingMaint = false
      }
    },

    async deleteMaintenance(id) {
      try {
        await maintenanceApi.remove(id)
        this.showToast('Đã xóa lịch bảo trì')
        this.deviceMaintenances = this.deviceMaintenances.filter(m => m.id !== id)
        this.allMaintenances = this.allMaintenances.filter(m => m.id !== id)
      } catch (e) {
        this.showToast('Không thể xóa lịch bảo trì', 'error')
      }
    },

    async openMaintenanceListModal() {
      this.showMaintenanceListModal = true
      this.loadingAllMaint = true
      try {
        const res = await maintenanceApi.getAll()
        this.allMaintenances = Array.isArray(res.data) ? res.data : (res.data.data || [])
      } catch {
        this.allMaintenances = []
      } finally {
        this.loadingAllMaint = false
      }
    },
  },
}
</script>

<style scoped>
/* PAGE */
.thietbi-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
  position: relative;
}

/* TOAST */
.toast-msg {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.88rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 9px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.toast-msg.success { background: #16a34a; color: #fff; }
.toast-msg.error   { background: #dc2626; color: #fff; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-12px); }

/* PAGE HEADER */
.page-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; margin-bottom: 4px; }
.bc-root { color: #94a3b8; }
.bc-sep  { font-size: 0.55rem; color: #cbd5e1; }
.bc-cur  { color: #2d7a3a; font-weight: 600; }
.page-title { font-size: 1.45rem; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.4px; }
.page-actions { display: flex; gap: 10px; flex-shrink: 0; }
.btn-add {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px;
  border: none; border-radius: 10px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff; font-size: 0.84rem; font-weight: 600;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s;
  box-shadow: 0 3px 12px rgba(45,122,58,0.3);
}
.btn-add:hover { opacity: 0.9; transform: translateY(-1px); }

/* KPI */
.kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.kpi-card {
  background: #fff; border-radius: 14px; padding: 18px 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  position: relative; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.1); }
.kpi-card-inner { display: flex; align-items: center; gap: 14px; }
.kpi-icon-wrap { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0; }
.kpi-card.accent-green  .kpi-icon-wrap { background: #dcfce7; color: #16a34a; }
.kpi-card.accent-blue   .kpi-icon-wrap { background: #dbeafe; color: #2563eb; }
.kpi-card.accent-orange .kpi-icon-wrap { background: #fff3e0; color: #d97706; }
.kpi-card.accent-red    .kpi-icon-wrap { background: #fee2e2; color: #dc2626; }
.kpi-label { font-size: 0.68rem; color: #94a3b8; font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; margin-bottom: 2px; }
.kpi-value { font-size: 1.9rem; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
.kpi-border-accent { position: absolute; top: 0; left: 0; width: 4px; height: 100%; border-radius: 14px 0 0 14px; }
.kpi-card.accent-green  .kpi-border-accent { background: #16a34a; }
.kpi-card.accent-blue   .kpi-border-accent { background: #2563eb; }
.kpi-card.accent-orange .kpi-border-accent { background: #d97706; }
.kpi-card.accent-red    .kpi-border-accent { background: #dc2626; }

/* TOOLBAR */
.toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.search-box {
  display: flex; align-items: center; gap: 8px;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px;
  padding: 8px 14px; flex: 1; min-width: 220px; transition: border-color 0.2s;
}
.search-box:focus-within { border-color: #2d7a3a; }
.search-ic { color: #94a3b8; font-size: 0.85rem; }
.search-input { border: none; outline: none; background: transparent; font-size: 0.85rem; color: #475569; width: 100%; }
.toolbar-right { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.status-select { padding: 8px 12px; border: 1.5px solid #e2e8f0; border-radius: 9px; background: #fff; font-size: 0.82rem; color: #475569; cursor: pointer; outline: none; }
.btn-maintenance-list {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border: none; border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  color: #fff; font-size: 0.82rem; font-weight: 600; cursor: pointer;
  transition: opacity 0.18s;
}
.btn-maintenance-list:hover { opacity: 0.88; }

/* LOADING */
.loading-wrap { display: flex; align-items: center; gap: 12px; justify-content: center; padding: 60px; color: #64748b; }
.spinner { width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #2d7a3a; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* CONTENT AREA */
.content-area { display: grid; grid-template-columns: 1fr; gap: 16px; transition: grid-template-columns 0.3s; }
.content-area.with-panel { grid-template-columns: 1fr 380px; }

/* DEVICE GRID */
.device-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; align-content: start; }
.empty-state { grid-column: 1/-1; text-align: center; padding: 60px; color: #94a3b8; }
.empty-state i { font-size: 3rem; margin-bottom: 12px; display: block; }
.device-card {
  background: #fff; border-radius: 14px; overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06); cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent; display: flex; flex-direction: column;
}
.device-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
.device-card.is-selected { border-color: #2d7a3a; box-shadow: 0 6px 24px rgba(45,122,58,0.2); }
.device-img-wrap { position: relative; height: 130px; }
.device-img-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.device-img-icon { font-size: 3rem; color: rgba(0,0,0,0.22); }
.device-status-badge { position: absolute; top: 10px; left: 10px; font-size: 0.62rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.4px; }
.device-status-badge.active      { background: #dcfce7; color: #16a34a; }
.device-status-badge.maintenance { background: #fef3c7; color: #d97706; }
.device-status-badge.broken      { background: #fee2e2; color: #dc2626; }
.device-info { padding: 10px 12px 4px; flex: 1; }
.device-name { font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 5px; line-height: 1.3; }
.device-meta { display: flex; flex-direction: column; gap: 3px; }
.device-meta-item { font-size: 0.7rem; color: #94a3b8; display: flex; align-items: center; gap: 5px; }
.card-actions { display: flex; gap: 8px; margin: 10px 12px 12px; }
.btn-detail {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 7px; border: none; border-radius: 8px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
}
.btn-detail:hover { opacity: 0.9; }
.btn-delete-card {
  width: 32px; height: 32px; flex-shrink: 0;
  border: 1.5px solid #fecaca; border-radius: 8px;
  background: #fff5f5; color: #ef4444; font-size: 0.78rem;
  cursor: pointer; transition: background 0.18s, transform 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.btn-delete-card:hover { background: #fee2e2; border-color: #ef4444; transform: scale(1.08); }

/* DETAIL PANEL */
.detail-panel {
  background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  padding: 18px; display: flex; flex-direction: column; gap: 14px;
  align-self: start; position: sticky; top: 20px;
  max-height: calc(100vh - 100px); overflow-y: auto;
}
.panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.panel-title { font-size: 0.98rem; font-weight: 700; color: #1e293b; }
.panel-device-code { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; }
.panel-close { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; }
.panel-close:hover { background: #fee2e2; color: #dc2626; }

.panel-section { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 0.75rem; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 6px; }
.section-label-row { display: flex; align-items: center; justify-content: space-between; }
.btn-add-maint {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px;
  border: none; border-radius: 7px; background: #2d7a3a; color: #fff;
  font-size: 0.76rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
}
.btn-add-maint:hover { opacity: 0.88; }

/* Status buttons */
.status-btn-group { display: flex; gap: 6px; flex-wrap: wrap; }
.status-opt-btn {
  flex: 1; min-width: 80px; padding: 7px 8px;
  border-radius: 8px; border: 1.5px solid #e2e8f0;
  background: #f8fafc; font-size: 0.75rem; font-weight: 500;
  cursor: pointer; transition: all 0.18s;
  display: flex; align-items: center; justify-content: center; gap: 4px;
}
.status-opt-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.status-opt-btn.active.active      { background: #dcfce7; border-color: #16a34a; color: #16a34a; font-weight: 700; }
.status-opt-btn.maintenance.active { background: #fef3c7; border-color: #d97706; color: #d97706; font-weight: 700; }
.status-opt-btn.broken.active      { background: #fee2e2; border-color: #dc2626; color: #dc2626; font-weight: 700; }
.status-opt-btn:not(.active):hover { background: #f1f5f9; }

/* Spec grid */
.spec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
.spec-item { background: #f8fafc; border-radius: 8px; padding: 8px 10px; }
.spec-label { font-size: 0.65rem; color: #94a3b8; margin-bottom: 2px; }
.spec-value { font-size: 0.8rem; color: #1e293b; font-weight: 600; }

/* Maintenance list in panel */
.maint-loading { font-size: 0.82rem; color: #94a3b8; text-align: center; padding: 12px; }
.maint-empty   { font-size: 0.82rem; color: #94a3b8; text-align: center; padding: 12px; }
.maint-list { display: flex; flex-direction: column; gap: 8px; }
.maint-item { display: flex; align-items: flex-start; gap: 8px; background: #f8fafc; border-radius: 10px; padding: 9px 10px; border-left: 3px solid #2d7a3a; }
.maint-info { flex: 1; }
.maint-title { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
.maint-date  { font-size: 0.7rem; color: #94a3b8; margin-top: 2px; display: flex; align-items: center; gap: 4px; }
.maint-note  { font-size: 0.72rem; color: #64748b; margin-top: 3px; font-style: italic; }
.btn-del-maint { width: 26px; height: 26px; border-radius: 6px; border: 1px solid #fecaca; background: #fff5f5; color: #ef4444; font-size: 0.7rem; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.btn-del-maint:hover { background: #fee2e2; }

/* Panel actions */
.panel-actions { display: flex; gap: 10px; margin-top: auto; }
.btn-edit-device {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px; border: 1.5px solid #2d7a3a; border-radius: 9px;
  background: #fff; color: #2d7a3a; font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
}
.btn-edit-device:hover { background: #f0fdf4; }

/* ANIMATIONS */
.panel-slide-enter-active, .panel-slide-leave-active { transition: opacity 0.25s, transform 0.25s; }
.panel-slide-enter-from, .panel-slide-leave-to { opacity: 0; transform: translateX(24px); }

/* MODAL */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(3px); }
.modal-box { background: #fff; border-radius: 18px; width: 540px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden; }
.modal-wide { width: 780px; }
.modal-header { display: flex; align-items: center; gap: 10px; padding: 18px 22px; border-bottom: 1px solid #e2e8f0; }
.modal-title { font-size: 1rem; font-weight: 700; color: #1e293b; flex: 1; display: flex; align-items: center; gap: 8px; }
.modal-title i { color: #2d7a3a; }
.modal-close { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid #e2e8f0; background: #fff; color: #64748b; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; cursor: pointer; }
.modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1/-1; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: #475569; }
.req { color: #ef4444; }
.form-input { padding: 9px 12px; border: 1.5px solid #e2e8f0; border-radius: 9px; font-size: 0.85rem; color: #1e293b; outline: none; transition: border-color 0.2s; background: #fff; }
.form-input:focus { border-color: #2d7a3a; }
.form-textarea { resize: vertical; font-family: inherit; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 22px; border-top: 1px solid #e2e8f0; background: #f8fafc; }
.btn-cancel { padding: 9px 18px; border: 1.5px solid #e2e8f0; border-radius: 9px; background: #fff; color: #64748b; font-size: 0.84rem; font-weight: 500; cursor: pointer; }
.btn-save { display: inline-flex; align-items: center; gap: 7px; padding: 9px 22px; border: none; border-radius: 9px; background: linear-gradient(135deg, #2d7a3a, #1a5c28); color: #fff; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s; }
.btn-save:hover { opacity: 0.9; }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-add-inline { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border: none; border-radius: 8px; background: #2d7a3a; color: #fff; font-size: 0.8rem; font-weight: 600; cursor: pointer; }

/* DELETE MODAL */
.delete-modal-box { width: 420px; max-width: 95vw; border-radius: 20px; text-align: center; }
.delete-modal-icon-wrap { background: linear-gradient(135deg,#fee2e2,#fecaca); padding: 28px 0 18px; }
.delete-modal-icon { width: 60px; height: 60px; border-radius: 50%; background: #fff; display: flex; align-items: center; justify-content: center; margin: 0 auto; box-shadow: 0 4px 20px rgba(239,68,68,0.25); }
.delete-modal-icon i { font-size: 1.4rem; color: #ef4444; }
.delete-modal-content { padding: 20px 28px 12px; }
.delete-modal-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 10px; }
.delete-modal-desc { font-size: 0.87rem; color: #475569; line-height: 1.6; margin: 0; }
.delete-modal-footer { display: flex; gap: 10px; padding: 16px 22px; border-top: 1px solid #e2e8f0; background: #f8fafc; justify-content: center; }
.btn-confirm-delete { display: inline-flex; align-items: center; gap: 7px; padding: 10px 24px; border: none; border-radius: 9px; background: linear-gradient(135deg,#ef4444,#dc2626); color: #fff; font-size: 0.88rem; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(239,68,68,0.35); }
.btn-confirm-delete:hover { opacity: 0.9; }
.btn-confirm-delete:disabled { opacity: 0.6; cursor: not-allowed; }

/* MAINTENANCE TABLE */
.maint-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
.maint-table th { background: #f8fafc; padding: 10px 12px; text-align: left; font-size: 0.75rem; color: #64748b; font-weight: 600; border-bottom: 2px solid #e2e8f0; }
.maint-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #1e293b; }
.maint-table tr:hover td { background: #f8fafc; }
.type-badge { padding: 3px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; }
.type-badge.recurring { background: #ede9fe; color: #7c3aed; }
.type-badge.one_time  { background: #dbeafe; color: #2563eb; }
.maint-status { padding: 3px 8px; border-radius: 20px; font-size: 0.72rem; font-weight: 600; background: #f1f5f9; color: #64748b; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
