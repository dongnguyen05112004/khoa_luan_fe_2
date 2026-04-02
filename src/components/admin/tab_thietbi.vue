<template>
  <div class="thietbi-page">
    <!-- ===== PAGE HEADER ===== -->
    <div class="page-header">
      <div class="page-title-block">
        <div class="page-breadcrumb">
          <span class="bc-root">Admin</span>
          <i class="fas fa-chevron-right bc-sep"></i>
          <span class="bc-cur">Hệ thống</span>
        </div>
        <h1 class="page-title">Quản trị thiết bị và giám sát vận hành</h1>
      </div>
      <div class="page-actions">
        <button class="btn-filter">
          <i class="fas fa-filter"></i> Lọc dữ liệu
        </button>
        <button class="btn-add" @click="showAddModal = true">
          <i class="fas fa-plus"></i> Thêm thiết bị
        </button>
      </div>
    </div>

    <!-- ===== KPI CARDS ===== -->
    <div class="kpi-row">
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.key" :class="kpi.accent">
        <div class="kpi-card-inner">
          <div class="kpi-icon-wrap">
            <i :class="kpi.icon"></i>
          </div>
          <div class="kpi-data">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-sub" v-if="kpi.sub">{{ kpi.sub }}</div>
          </div>
        </div>
        <div class="kpi-border-accent"></div>
      </div>
    </div>

    <!-- ===== SEARCH & FILTER ROW ===== -->
    <div class="toolbar">
      <div class="search-box">
        <i class="fas fa-search search-ic"></i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm mã máy hoặc tên thiết bị..."
          class="search-input"
        />
      </div>
      <div class="toolbar-right">
        <button class="btn-tool" @click="toggleFilter">
          <i class="fas fa-filter"></i> Lọc
        </button>
        <div class="status-dropdown-wrap">
          <select v-model="filterStatus" class="status-select">
            <option value="">Trạng thái</option>
            <option value="hoatdong">Hoạt động</option>
            <option value="baotri">Bảo trì</option>
            <option value="hong">Hỏng</option>
          </select>
        </div>
        <button class="btn-export">
          <i class="fas fa-robot"></i> Xuất báo cáo AI
        </button>
      </div>
    </div>

    <!-- ===== MAIN CONTENT: GRID + DETAIL PANEL ===== -->
    <div class="content-area" :class="{ 'with-panel': selectedDevice }">

      <!-- Device Grid -->
      <div class="device-grid">
        <div
          class="device-card"
          v-for="device in filteredDevices"
          :key="device.id"
          :class="{ 'is-selected': selectedDevice && selectedDevice.id === device.id }"
          @click="selectDevice(device)"
        >
          <div class="device-img-wrap">
            <div class="device-status-badge" :class="device.status">
              {{ device.statusLabel }}
            </div>
            <div class="device-img-placeholder" :style="{ background: device.imgBg }">
              <i :class="device.imgIcon" class="device-img-icon"></i>
            </div>
          </div>
          <div class="device-info">
            <div class="device-name">{{ device.name }}</div>
            <div class="device-meta">
              <span class="device-meta-item">
                <i class="fas fa-tag"></i> {{ device.code }}
              </span>
              <span class="device-meta-item">
                <i class="fas fa-map-marker-alt"></i> {{ device.area }}
              </span>
            </div>
          </div>
          <button class="btn-detail" @click.stop="selectDevice(device)">
            <i class="fas fa-eye"></i> Chi tiết
          </button>
        </div>
      </div>

      <!-- Detail Panel -->
      <transition name="panel-slide">
        <div class="detail-panel" v-if="selectedDevice">
          <div class="panel-header">
            <div class="panel-title">Thống số vận hành</div>
            <div class="panel-device-code">{{ selectedDevice.code }} • {{ selectedDevice.lastUpdated }}</div>
            <button class="panel-close" @click="selectedDevice = null">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- Circular gauge -->
          <div class="gauge-wrap">
            <svg viewBox="0 0 120 120" class="gauge-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e8f5e9" stroke-width="10"/>
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="url(#gaugeGrad)"
                stroke-width="10"
                stroke-linecap="round"
                stroke-dasharray="314"
                :stroke-dashoffset="gaugeDashOffset"
                transform="rotate(-90 60 60)"
              />
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#2d7a3a"/>
                  <stop offset="100%" stop-color="#4ade80"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="gauge-center">
              <div class="gauge-pct">{{ selectedDevice.efficiency }}%</div>
              <div class="gauge-label">SỨC KHỎE</div>
            </div>
          </div>

          <!-- AI Insight -->
          <div class="ai-insight-box">
            <div class="ai-insight-header">
              <i class="fas fa-robot ai-ic"></i>
              <span class="ai-insight-title">AI Insight</span>
              <i class="fas fa-arrow-up-right-from-square ai-link-ic"></i>
            </div>
            <p class="ai-insight-text">{{ selectedDevice.aiInsight }}</p>
          </div>

          <!-- Tabs -->
          <div class="panel-tabs">
            <button
              v-for="t in panelTabs"
              :key="t.key"
              :class="['panel-tab-btn', panelTab === t.key ? 'active' : '']"
              @click="panelTab = t.key"
            >{{ t.label }}</button>
          </div>

          <!-- Tab: Lịch sử sửa chữa -->
          <div class="panel-tab-content" v-if="panelTab === 'lichsu'">
            <div class="history-list">
              <div
                class="history-item"
                v-for="(item, i) in selectedDevice.history"
                :key="i"
              >
                <div class="history-info">
                  <div class="history-title">{{ item.title }}</div>
                  <div class="history-desc">{{ item.desc }}</div>
                </div>
                <div class="history-date">{{ item.date }}</div>
              </div>
            </div>
          </div>

          <!-- Tab: Thông số kỹ thuật -->
          <div class="panel-tab-content" v-if="panelTab === 'thongso'">
            <div class="spec-grid">
              <div class="spec-item" v-for="(spec, i) in selectedDevice.specs" :key="i">
                <div class="spec-label">{{ spec.label }}</div>
                <div class="spec-value">{{ spec.value }}</div>
              </div>
            </div>
          </div>

          <!-- Panel Actions -->
          <div class="panel-actions">
            <button class="btn-baohong">
              <i class="fas fa-exclamation-triangle"></i> Báo hỏng
            </button>
            <button class="btn-baotri">
              <i class="fas fa-calendar-check"></i> Lịch bảo trì
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ===== ADD DEVICE MODAL ===== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showAddModal" @click.self="showAddModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <span class="modal-title"><i class="fas fa-plus-circle"></i> Thêm thiết bị mới</span>
            <button class="modal-close" @click="showAddModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label>Tên thiết bị</label>
                <input v-model="newDevice.name" type="text" placeholder="VD: Máy chạy bộ NordicTrack" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Mã thiết bị</label>
                <input v-model="newDevice.code" type="text" placeholder="VD: TBM-001" class="form-input"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Khu vực</label>
                <input v-model="newDevice.area" type="text" placeholder="VD: Cardio B" class="form-input"/>
              </div>
              <div class="form-group">
                <label>Loại thiết bị</label>
                <select v-model="newDevice.type" class="form-input">
                  <option value="">-- Chọn loại --</option>
                  <option>Cardio</option>
                  <option>Strength</option>
                  <option>Flexibility</option>
                </select>
              </div>
            </div>
            <div class="form-group full">
              <label>Thương hiệu</label>
              <input v-model="newDevice.brand" type="text" placeholder="VD: Matrix, Life Fitness..." class="form-input"/>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showAddModal = false">Huỷ</button>
            <button class="btn-save" @click="saveDevice">
              <i class="fas fa-save"></i> Lưu thiết bị
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'TabThietBi',
  data() {
    return {
      searchQuery: '',
      filterStatus: '',
      selectedDevice: null,
      panelTab: 'lichsu',
      showAddModal: false,
      newDevice: { name: '', code: '', area: '', type: '', brand: '' },

      panelTabs: [
        { key: 'lichsu', label: 'Lịch sử sửa chữa' },
        { key: 'thongso', label: 'Thông số kỹ thuật' },
      ],

      kpis: [
        {
          key: 'total',
          label: 'TỔNG MÁY',
          value: '120',
          sub: '',
          icon: 'fas fa-dumbbell',
          accent: 'accent-green',
        },
        {
          key: 'running',
          label: 'ĐANG VẬN HÀNH',
          value: '98',
          sub: '',
          icon: 'fas fa-bolt',
          accent: 'accent-blue',
        },
        {
          key: 'efficiency',
          label: 'HIỆU SUẤT AI',
          value: '94.2%',
          sub: 'Optimal',
          icon: 'fas fa-chart-line',
          accent: 'accent-purple',
        },
      ],

      devices: [
        {
          id: 1,
          name: 'Máy chạy bộ Matrix T75',
          code: 'TBM-001',
          area: 'Cardio A',
          status: 'hoatdong',
          statusLabel: 'HOẠT ĐỘNG',
          imgBg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          imgIcon: 'fas fa-walking',
          efficiency: 82,
          lastUpdated: '2 PHÚT TRƯỚC',
          aiInsight: 'Cần bảo trì sau 12 ngày. Dây curoa có dấu hiệu mòn dần, nên kiểm tra sớm.',
          history: [
            { title: 'Thay dây đai truyền động', desc: 'Phụ tùng chính hãng Matrix', date: '12/01\n021' },
            { title: 'Bảo trị định kỳ Quý 1', desc: 'Vệ sinh cần biên, bôi trơn vòn chạy', date: '05/02\n021' },
            { title: 'Thay màn hình hiển thị', desc: 'Màn hình LCD bị hỏng, thay mới', date: '20/12\n020' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'Matrix' },
            { label: 'Model', value: 'T75-2022' },
            { label: 'Công suất motor', value: '4.0 HP' },
            { label: 'Tốc độ tối đa', value: '22 km/h' },
            { label: 'Độ nghiêng', value: '0–15%' },
            { label: 'Năm mua', value: '2022' },
          ],
        },
        {
          id: 2,
          name: 'Dàn tạ đa năng LifeFitness',
          code: 'TBS-002',
          area: 'Strength B',
          status: 'baotri',
          statusLabel: 'BẢO TRÌ',
          imgBg: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d44 100%)',
          imgIcon: 'fas fa-times',
          efficiency: 55,
          lastUpdated: '15 PHÚT TRƯỚC',
          aiInsight: 'Thiết bị đang trong giai đoạn bảo trì định kỳ. Dự kiến hoàn thành sau 2 ngày.',
          history: [
            { title: 'Bảo trì định kỳ Q2', desc: 'Siết chặt bulông, kiểm tra cáp', date: '01/04\n025' },
            { title: 'Vệ sinh toàn bộ', desc: 'Lau dầu, vệ sinh khung sắt', date: '10/01\n025' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'LifeFitness' },
            { label: 'Model', value: 'Optima Series' },
            { label: 'Tải trọng tối đa', value: '200 kg' },
            { label: 'Loại', value: 'Cable Crossover' },
            { label: 'Trọng lượng', value: '320 kg' },
            { label: 'Năm mua', value: '2021' },
          ],
        },
        {
          id: 3,
          name: 'Squat Rack Hammer',
          code: 'TBS-003',
          area: 'Free Weight',
          status: 'hoatdong',
          statusLabel: 'HOẠT ĐỘNG',
          imgBg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          imgIcon: 'fas fa-dumbbell',
          efficiency: 91,
          lastUpdated: '5 PHÚT TRƯỚC',
          aiInsight: 'Thiết bị hoạt động tốt. Không phát hiện dấu hiệu bất thường trong 30 ngày qua.',
          history: [
            { title: 'Kiểm tra định kỳ', desc: 'Tất cả bulong chắc chắn, an toàn', date: '15/03\n025' },
            { title: 'Sơn lại khung', desc: 'Chống gỉ sét, sơn lại toàn bộ', date: '01/11\n024' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'Hammer Strength' },
            { label: 'Model', value: 'HD Elite' },
            { label: 'Tải trọng', value: '360 kg' },
            { label: 'Vật liệu', value: 'Thép không gỉ' },
            { label: 'Chiều rộng', value: '120 cm' },
            { label: 'Năm mua', value: '2020' },
          ],
        },
        {
          id: 4,
          name: 'Xe đạp tập Life Fitness IC7',
          code: 'TBC-004',
          area: 'Cardio B',
          status: 'hoatdong',
          statusLabel: 'HOẠT ĐỘNG',
          imgBg: 'linear-gradient(135deg, #e8f5e9 0%, #a5d6a7 100%)',
          imgIcon: 'fas fa-bicycle',
          efficiency: 76,
          lastUpdated: '10 PHÚT TRƯỚC',
          aiInsight: 'Kiểm tra hệ thống phanh khuyến nghị trong 7 ngày tới để đảm bảo an toàn.',
          history: [
            { title: 'Thay yên xe', desc: 'Yên xe bị mòn, thay mới loại dầy', date: '28/02\n025' },
            { title: 'Điều chỉnh lực cản', desc: 'Hiệu chỉnh hệ thống từ tính', date: '05/01\n025' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'Life Fitness' },
            { label: 'Model', value: 'IC7' },
            { label: 'Loại kháng lực', value: 'Từ tính' },
            { label: 'Tải trọng', value: '150 kg' },
            { label: 'Màn hình', value: 'LCD kết nối Bluetooth' },
            { label: 'Năm mua', value: '2023' },
          ],
        },
        {
          id: 5,
          name: 'Máy kéo cáp lực Technogym',
          code: 'TBS-005',
          area: 'Strength A',
          status: 'hoatdong',
          statusLabel: 'HOẠT ĐỘNG',
          imgBg: 'linear-gradient(135deg, #fff3e0 0%, #ffe082 100%)',
          imgIcon: 'fas fa-arrows-alt-v',
          efficiency: 88,
          lastUpdated: '8 PHÚT TRƯỚC',
          aiInsight: 'Dây cáp đã hoạt động 14 tháng. AI khuyến nghị kiểm tra độ mòn trong tháng này.',
          history: [
            { title: 'Thay dây cáp', desc: 'Dây cáp inox chính hãng', date: '10/09\n024' },
            { title: 'Tra dầu ròng rọc', desc: 'Bảo dưỡng định kỳ', date: '01/06\n024' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'Technogym' },
            { label: 'Model', value: 'Selection Pro' },
            { label: 'Phạm vi tải', value: '5–105 kg' },
            { label: 'Cáp', value: 'Inox 7 sợi' },
            { label: 'Năm mua', value: '2023' },
          ],
        },
        {
          id: 6,
          name: 'Máy chạy bộ NordicTrack X22i',
          code: 'TBM-006',
          area: 'Cardio A',
          status: 'hong',
          statusLabel: 'HỎNG',
          imgBg: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          imgIcon: 'fas fa-exclamation-triangle',
          efficiency: 0,
          lastUpdated: '2 GIỜ TRƯỚC',
          aiInsight: 'Máy ngừng hoạt động do lỗi motor. Cần liên hệ kỹ thuật viên ngay hôm nay.',
          history: [
            { title: 'Báo lỗi motor E6', desc: 'Máy tự dừng, mã lỗi E6', date: '01/04\n025' },
            { title: 'Bảo trì Q1', desc: 'Vệ sinh bụi, dây curoa bình thường', date: '05/01\n025' },
          ],
          specs: [
            { label: 'Thương hiệu', value: 'NordicTrack' },
            { label: 'Model', value: 'X22i' },
            { label: 'Công suất', value: '4.5 HP' },
            { label: 'Độ nghiêng', value: '-6% đến +40%' },
            { label: 'Tốc độ tối đa', value: '20 km/h' },
            { label: 'Năm mua', value: '2021' },
          ],
        },
      ],
    }
  },
  computed: {
    filteredDevices() {
      return this.devices.filter(d => {
        const q = this.searchQuery.toLowerCase()
        const matchSearch = !q || d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)
        const matchStatus = !this.filterStatus || d.status === this.filterStatus
        return matchSearch && matchStatus
      })
    },
    gaugeDashOffset() {
      if (!this.selectedDevice) return 314
      const pct = this.selectedDevice.efficiency / 100
      return 314 * (1 - pct)
    },
  },
  methods: {
    selectDevice(device) {
      this.selectedDevice = this.selectedDevice && this.selectedDevice.id === device.id ? null : device
      this.panelTab = 'lichsu'
    },
    toggleFilter() {
      // Future: expand filter panel
    },
    saveDevice() {
      if (!this.newDevice.name || !this.newDevice.code) return
      this.devices.push({
        id: Date.now(),
        name: this.newDevice.name,
        code: this.newDevice.code,
        area: this.newDevice.area || 'Chưa phân khu',
        status: 'hoatdong',
        statusLabel: 'HOẠT ĐỘNG',
        imgBg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        imgIcon: 'fas fa-dumbbell',
        efficiency: 100,
        lastUpdated: 'VỪA THÊM',
        aiInsight: 'Thiết bị mới. AI đang thu thập dữ liệu vận hành.',
        history: [],
        specs: [
          { label: 'Thương hiệu', value: this.newDevice.brand || 'N/A' },
          { label: 'Loại', value: this.newDevice.type || 'N/A' },
          { label: 'Năm mua', value: new Date().getFullYear() },
        ],
      })
      this.newDevice = { name: '', code: '', area: '', type: '', brand: '' }
      this.showAddModal = false
    },
  },
}
</script>

<style scoped>
/* ========================
   PAGE ROOT
   ======================== */
.thietbi-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
}

/* ========================
   PAGE HEADER
   ======================== */
.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  margin-bottom: 4px;
}
.bc-root { color: #94a3b8; }
.bc-sep  { font-size: 0.55rem; color: #cbd5e1; }
.bc-cur  { color: #2d7a3a; font-weight: 600; }
.page-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.4px;
}
.page-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;
}
.btn-filter {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #475569;
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.18s;
}
.btn-filter:hover { background: #f8fafc; }
.btn-add {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.18s, transform 0.15s;
  box-shadow: 0 3px 12px rgba(45,122,58,0.3);
}
.btn-add:hover { opacity: 0.9; transform: translateY(-1px); }

/* ========================
   KPI CARDS
   ======================== */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}
.kpi-card-inner {
  display: flex; align-items: center; gap: 16px;
}
.kpi-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}
.kpi-card.accent-green .kpi-icon-wrap { background: #dcfce7; color: #16a34a; }
.kpi-card.accent-blue  .kpi-icon-wrap { background: #dbeafe; color: #2563eb; }
.kpi-card.accent-purple .kpi-icon-wrap { background: #ede9fe; color: #7c3aed; }
.kpi-label {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.kpi-value {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  line-height: 1.1;
}
.kpi-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: #16a34a;
  margin-top: 2px;
}
.kpi-border-accent {
  position: absolute;
  top: 0; left: 0;
  width: 4px; height: 100%;
  border-radius: 14px 0 0 14px;
}
.kpi-card.accent-green  .kpi-border-accent { background: #16a34a; }
.kpi-card.accent-blue   .kpi-border-accent { background: #2563eb; }
.kpi-card.accent-purple .kpi-border-accent { background: #7c3aed; }

/* ========================
   TOOLBAR
   ======================== */
.toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 14px;
  flex: 1;
  min-width: 220px;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: #2d7a3a; }
.search-ic { color: #94a3b8; font-size: 0.85rem; }
.search-input {
  border: none; outline: none;
  background: transparent;
  font-size: 0.85rem;
  color: #475569;
  width: 100%;
}
.search-input::placeholder { color: #94a3b8; }
.toolbar-right {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.btn-tool {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  color: #475569;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
}
.status-select {
  padding: 8px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff;
  font-size: 0.82rem;
  color: #475569;
  cursor: pointer;
  outline: none;
}
.btn-export {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.18s;
}
.btn-export:hover { opacity: 0.88; }

/* ========================
   CONTENT AREA
   ======================== */
.content-area {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  transition: grid-template-columns 0.3s ease;
}
.content-area.with-panel {
  grid-template-columns: 1fr 360px;
}

/* ========================
   DEVICE GRID
   ======================== */
.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  align-content: start;
}
.device-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
}
.device-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
.device-card.is-selected {
  border-color: #2d7a3a;
  box-shadow: 0 6px 24px rgba(45,122,58,0.2);
}
.device-img-wrap {
  position: relative;
  height: 140px;
}
.device-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}
.device-img-icon {
  font-size: 3.5rem;
  color: rgba(0,0,0,0.25);
}
.device-status-badge {
  position: absolute;
  top: 10px; left: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  letter-spacing: 0.4px;
}
.device-status-badge.hoatdong { background: #dcfce7; color: #16a34a; }
.device-status-badge.baotri   { background: #fef3c7; color: #d97706; }
.device-status-badge.hong     { background: #fee2e2; color: #dc2626; }
.device-info {
  padding: 12px 14px 6px;
  flex: 1;
}
.device-name {
  font-size: 0.87rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
  line-height: 1.3;
}
.device-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.device-meta-item {
  font-size: 0.72rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 5px;
}
.device-meta-item i { font-size: 0.65rem; }
.btn-detail {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 10px 14px 14px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-detail:hover { opacity: 0.9; }

/* ========================
   DETAIL PANEL
   ======================== */
.detail-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-self: start;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
.panel-header {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
}
.panel-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
}
.panel-device-code {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 3px;
  position: absolute;
  top: 22px; left: 0;
}
.panel-close {
  position: absolute; top: 0; right: 0;
  width: 28px; height: 28px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.75rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}
.panel-close:hover { background: #fee2e2; color: #dc2626; }

/* Gauge */
.gauge-wrap {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 18px auto 0;
}
.gauge-svg { width: 100%; height: 100%; }
.gauge-center {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.gauge-pct {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -1px;
}
.gauge-label {
  font-size: 0.6rem;
  font-weight: 600;
  color: #94a3b8;
  letter-spacing: 1px;
}

/* AI Insight */
.ai-insight-box {
  background: linear-gradient(120deg, #f0fdf4, #e0f2fe);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 12px 14px;
}
.ai-insight-header {
  display: flex; align-items: center; gap: 7px;
  margin-bottom: 6px;
}
.ai-ic { color: #6366f1; font-size: 0.85rem; }
.ai-insight-title {
  font-size: 0.8rem; font-weight: 700; color: #1e293b; flex: 1;
}
.ai-link-ic { font-size: 0.7rem; color: #94a3b8; }
.ai-insight-text {
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.55;
  margin: 0;
}

/* Panel Tabs */
.panel-tabs {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}
.panel-tab-btn {
  flex: 1;
  padding: 6px 10px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.18s;
  white-space: nowrap;
}
.panel-tab-btn.active {
  background: #fff;
  color: #2d7a3a;
  font-weight: 700;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

/* History List */
.panel-tab-content { flex: 1; }
.history-list { display: flex; flex-direction: column; gap: 10px; }
.history-item {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  background: #f8fafc;
  border-radius: 10px;
  padding: 10px 12px;
  border-left: 3px solid #2d7a3a;
}
.history-title { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
.history-desc { font-size: 0.73rem; color: #64748b; margin-top: 2px; }
.history-date {
  font-size: 0.68rem;
  color: #94a3b8;
  white-space: pre-line;
  text-align: right;
  flex-shrink: 0;
}

/* Spec Grid */
.spec-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.spec-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 9px 12px;
}
.spec-label { font-size: 0.68rem; color: #94a3b8; font-weight: 500; margin-bottom: 3px; }
.spec-value { font-size: 0.82rem; color: #1e293b; font-weight: 600; }

/* Panel Actions */
.panel-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}
.btn-baohong {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px;
  border: 1.5px solid #dc2626;
  border-radius: 9px;
  background: #fff;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-baohong:hover { background: #fee2e2; }
.btn-baotri {
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 10px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-baotri:hover { opacity: 0.9; }

/* ========================
   ANIMATIONS
   ======================== */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.panel-slide-enter-from {
  opacity: 0; transform: translateX(24px);
}
.panel-slide-leave-to {
  opacity: 0; transform: translateX(24px);
}

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15,23,42,0.45);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}
.modal-box {
  background: #fff;
  border-radius: 18px;
  width: 520px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-header {
  display: flex; align-items: center; gap: 10px;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}
.modal-title {
  font-size: 1rem; font-weight: 700; color: #1e293b; flex: 1;
  display: flex; align-items: center; gap: 8px;
}
.modal-title i { color: #2d7a3a; }
.modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.8rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.modal-body { padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: #475569; }
.form-input {
  padding: 9px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}
.form-input:focus { border-color: #2d7a3a; }
.modal-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
.btn-cancel {
  padding: 9px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  background: #fff; color: #64748b;
  font-size: 0.84rem; font-weight: 500;
  cursor: pointer;
}
.btn-save {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 22px;
  border: none;
  border-radius: 9px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  font-size: 0.84rem; font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.btn-save:hover { opacity: 0.9; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
