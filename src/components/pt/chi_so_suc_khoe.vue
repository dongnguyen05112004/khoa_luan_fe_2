<template>
  <div class="cssk-page">
    <!-- Page Title -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Cập nhật sức khỏe hội viên</h1>
        <div class="page-sub">Theo dõi và cập nhật chỉ số thể chất cho hội viên phụ trách</div>
      </div>
    </div>

    <!-- Member Selector -->
    <div class="member-selector-card">
      <div class="ms-top">
        <div class="ms-label">Chọn hội viên phụ trách</div>
        <div class="ms-count">PT phụ trách: {{ members.length }} hội viên</div>
      </div>
      <div class="ms-list">
        <div
          v-for="m in members"
          :key="m.id"
          class="ms-item"
          :class="{ selected: selectedMember && selectedMember.id === m.id }"
          @click="selectMember(m)"
        >
          <div class="ms-avatar-wrap">
            <img :src="m.avatar" :alt="m.name" class="ms-avatar" />
            <i v-if="selectedMember && selectedMember.id === m.id" class="fas fa-check-circle ms-check"></i>
          </div>
          <div class="ms-name">{{ m.name }}</div>
          <div class="ms-code">{{ m.code }}</div>
        </div>
      </div>
    </div>

    <!-- Main Content: Form + Chart -->
    <div class="main-grid" v-if="selectedMember">
      <!-- Left: Form -->
      <div class="form-card">
        <div class="form-card-header">
          <div class="form-card-bar"></div>
          <span class="form-card-title">Thông số mới</span>
        </div>
        <div class="form-updating-for">
          Đang cập nhật cho: <strong>{{ selectedMember.name }} - {{ selectedMember.code }}</strong>
        </div>

        <div class="metrics-grid">
          <div class="metric-group">
            <label class="metric-label">CÂN NẶNG (KG)</label>
            <input v-model="form.weight" type="number" step="0.1" class="metric-input" placeholder="70.5" />
          </div>
          <div class="metric-group">
            <label class="metric-label">CHIỀU CAO (CM)</label>
            <input v-model="form.height" type="number" step="0.1" class="metric-input" placeholder="175" />
          </div>
          <div class="metric-group">
            <label class="metric-label">BODY FAT (%)</label>
            <input v-model="form.bodyFat" type="number" step="0.1" class="metric-input" placeholder="18.2" />
          </div>
          <div class="metric-group">
            <label class="metric-label">CƠ BẮP (%)</label>
            <input v-model="form.muscle" type="number" step="0.1" class="metric-input" placeholder="42.5" />
          </div>
        </div>

        <!-- BMI Card -->
        <div class="bmi-card" v-if="bmi">
          <div class="bmi-left">
            <div class="bmi-label">CHỈ SỐ BMI DỰ KIẾN</div>
            <div class="bmi-value">{{ bmi }}</div>
          </div>
          <div class="bmi-badge" :class="bmiStatus.cls">{{ bmiStatus.text }}</div>
        </div>

        <div class="form-actions">
          <button class="btn-save" @click="saveMetrics" :disabled="saving">
            <i class="fas fa-save"></i>
            {{ saving ? 'Đang lưu...' : 'Lưu thông tin' }}
          </button>
          <button class="btn-cancel" @click="resetForm">Huỷ</button>
        </div>
      </div>

      <!-- Right: Chart + Stats -->
      <div class="right-col">
        <!-- Chart Card -->
        <div class="chart-card">
          <div class="chart-header">
            <div class="chart-title">Biểu đồ tiến trình (6 tháng qua)</div>
            <div class="chart-tabs">
              <button
                v-for="t in chartTabs"
                :key="t.key"
                class="chart-tab"
                :class="{ active: activeChartTab === t.key }"
                @click="activeChartTab = t.key"
              >{{ t.label }}</button>
            </div>
          </div>
          <div class="chart-area">
            <svg viewBox="0 0 520 200" class="line-chart" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line v-for="y in gridYs" :key="y" x1="40" :y1="y" x2="510" :y2="y" stroke="#e8f0ec" stroke-width="1"/>
              <!-- Y labels -->
              <text v-for="(lbl, i) in yLabels" :key="'yl'+i" x="35" :y="gridYs[i]+4" text-anchor="end" font-size="10" fill="#94a3b8">{{ lbl }}</text>
              <!-- Area fill -->
              <path :d="areaPath" fill="rgba(45,122,58,0.12)" />
              <!-- Line -->
              <path :d="linePath" fill="none" stroke="#2d7a3a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <!-- Dots -->
              <circle v-for="(pt, i) in chartPoints" :key="'dot'+i" :cx="pt.x" :cy="pt.y" r="5" fill="#fff" stroke="#2d7a3a" stroke-width="2.5"/>
              <!-- X labels -->
              <text v-for="(lbl, i) in xLabels" :key="'xl'+i" :x="chartPoints[i].x" y="195" text-anchor="middle" font-size="10" fill="#94a3b8">{{ lbl }}</text>
            </svg>
          </div>
        </div>

        <!-- Stats row -->
        <div class="stats-row">
          <div class="stat-mini green">
            <div class="stat-mini-icon"><i class="fas fa-chart-line"></i></div>
            <div class="stat-mini-body">
              <div class="stat-mini-label">THAY ĐỔI CÂN NẶNG</div>
              <div class="stat-mini-value">{{ weightChange }}</div>
              <div class="stat-mini-sub">với tháng trước</div>
            </div>
          </div>
          <div class="stat-mini purple">
            <div class="stat-mini-icon"><i class="fas fa-dumbbell"></i></div>
            <div class="stat-mini-body">
              <div class="stat-mini-label">CHỈ SỐ CƠ BẮP</div>
              <div class="stat-mini-value">{{ muscleChange }}</div>
              <div class="stat-mini-sub">với tháng trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state when no member selected -->
    <div class="empty-select" v-else>
      <i class="fas fa-user-circle"></i>
      <p>Chọn một hội viên để xem và cập nhật chỉ số sức khỏe</p>
    </div>

    <!-- Toast -->
    <transition name="toast-fade">
      <div v-if="toast.show" :class="['toast-msg', toast.type]">
        <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
        {{ toast.text }}
      </div>
    </transition>
  </div>
</template>

<script>
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export default {
  name: 'ChiSoSucKhoePT',
  data() {
    return {
      loading: false,
      saving: false,
      activeChartTab: 'weight',
      chartTabs: [
        { key: 'weight', label: 'Cân nặng' },
        { key: 'fat',    label: 'Body Fat' },
        { key: 'muscle', label: 'Cơ bắp' },
      ],
      members: [],
      selectedMember: null,
      metrics: [],
      form: { weight: '', height: '', bodyFat: '', muscle: '' },
      toast: { show: false, text: '', type: 'success' },
      toastTimer: null,
    }
  },
  mounted() {
    this.loadMembers()
  },
  computed: {
    bmi() {
      const w = parseFloat(this.form.weight)
      const h = parseFloat(this.form.height) / 100
      if (!w || !h) return null
      return (w / (h * h)).toFixed(1)
    },
    bmiStatus() {
      const v = parseFloat(this.bmi)
      if (v < 18.5) return { text: 'Thiếu cân', cls: 'blue' }
      if (v < 25)   return { text: 'Bình thường', cls: 'green' }
      if (v < 30)   return { text: 'Thừa cân', cls: 'yellow' }
      return { text: 'Béo phì', cls: 'red' }
    },
    chartData() {
      if (!this.selectedMember) return []
      if (this.activeChartTab === 'weight') return this.selectedMember.history
      if (this.activeChartTab === 'fat')    return this.selectedMember.fatHistory
      return this.selectedMember.muscleHistory
    },
    chartPoints() {
      const data = this.chartData
      if (!data.length) return []
      const minV = Math.min(...data) - 2
      const maxV = Math.max(...data) + 2
      const xStart = 50, xEnd = 505
      const yTop = 15, yBot = 175
      return data.map((v, i) => ({
        x: xStart + (i / Math.max(data.length - 1, 1)) * (xEnd - xStart),
        y: yBot - ((v - minV) / Math.max(maxV - minV, 0.1)) * (yBot - yTop),
        v,
      }))
    },
    linePath() {
      return this.chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
    },
    areaPath() {
      if (!this.chartPoints.length) return ''
      const pts = this.chartPoints
      const first = pts[0], last = pts[pts.length - 1]
      return `${this.linePath} L${last.x},180 L${first.x},180 Z`
    },
    gridYs() { return [20, 55, 90, 125, 160] },
    yLabels() {
      const data = this.chartData
      if (!data.length) return ['','','','','']
      const minV = Math.min(...data) - 2
      const maxV = Math.max(...data) + 2
      return this.gridYs.map(y => {
        const val = maxV - ((y - 20) / 140) * (maxV - minV)
        return val.toFixed(1)
      })
    },
    xLabels() {
      if (!this.metrics.length) return ['T1','T2','T3','T4','T5','Hiện tại']
      return this.metrics.slice(-6).map(m => {
        const d = new Date(m.record_date)
        return `${d.getDate()}/${d.getMonth()+1}`
      })
    },
    weightChange() {
      if (!this.selectedMember || this.selectedMember.history.length < 2) return '—'
      const h = this.selectedMember.history
      const diff = (h[h.length - 1] - h[h.length - 2]).toFixed(1)
      return (diff > 0 ? '+' : '') + diff + ' kg'
    },
    muscleChange() {
      if (!this.selectedMember || this.selectedMember.muscleHistory.length < 2) return '—'
      const h = this.selectedMember.muscleHistory
      const diff = (h[h.length - 1] - h[h.length - 2]).toFixed(1)
      return (diff > 0 ? '+' : '') + diff + ' kg'
    },
  },
  methods: {
    async loadMembers() {
      this.loading = true
      try {
        // Dùng /api/me để lấy user hiện tại chắc chắn nhất
        const meRes = await axios.get(`${API}/me`, authHeaders())
        const me = meRes.data

        // Tìm trainer record khớp với user đang đăng nhập
        const trRes = await axios.get(`${API}/trainers`, authHeaders())
        const trainers = Array.isArray(trRes.data) ? trRes.data : (trRes.data?.data || [])
        // Dùng == (không ===) để tránh type mismatch string vs number
        const myTrainer = trainers.find(t => t.user_id == me.id)

        if (!myTrainer) {
          this.showToast('Tài khoản này chưa có hồ sơ Trainer trong hệ thống', 'error')
          this.loading = false
          return
        }

        // PtContractController dùng paginate() nên trả {data:[...], ...}
        const cRes = await axios.get(`${API}/pt-contracts?trainer_id=${myTrainer.id}&status=active&per_page=100`, authHeaders())
        const contracts = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || [])

        this.members = contracts.map(c => ({
          id: c.user?.id,
          contractId: c.id,
          name: c.user?.name || 'Hội viên',
          code: `HV${String(c.user?.id || '').padStart(4,'0')}`,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name||'HV')}&background=2d7a3a&color=fff&bold=true&size=56`,
          remaining: (c.total_sessions||0) - (c.used_sessions||0),
          total: c.total_sessions || 0,
          history: [], fatHistory: [], muscleHistory: [],
        }))

        if (this.members.length === 0) {
          this.showToast('PT này chưa có hội viên đang active', 'error')
        }
      } catch (e) {
        console.error('loadMembers error', e)
        this.showToast('Không thể tải danh sách hội viên: ' + (e.response?.data?.message || e.message), 'error')
      } finally {
        this.loading = false
      }
    },
    async selectMember(m) {
      this.selectedMember = m
      this.form = { weight: '', height: '', bodyFat: '', muscle: '' }
      this.metrics = []
      try {
        const res = await axios.get(`${API}/health-metrics?user_id=${m.id}`, authHeaders())
        this.metrics = (res.data || []).slice().sort((a,b) => new Date(a.record_date) - new Date(b.record_date))
        const last6 = this.metrics.slice(-6)
        m.history       = last6.map(r => parseFloat(r.weight || 0))
        m.fatHistory    = last6.map(r => parseFloat(r.body_fat_percentage || 0))
        m.muscleHistory = last6.map(r => parseFloat(r.muscle_mass_kg || 0))

        if (this.metrics.length) {
          const latest = this.metrics[this.metrics.length - 1]
          this.form = {
            weight:  latest.weight || '',
            height:  latest.height || '',
            bodyFat: latest.body_fat_percentage || '',
            muscle:  latest.muscle_mass_kg || '',
          }
        }
      } catch (e) {
        console.error('loadMetrics error', e)
      }
    },
    resetForm() {
      if (this.selectedMember) this.selectMember(this.selectedMember)
      else this.form = { weight: '', height: '', bodyFat: '', muscle: '' }
    },
    async saveMetrics() {
      if (!this.form.weight || !this.form.height) {
        this.showToast('Vui lòng nhập cân nặng và chiều cao', 'error'); return
      }
      this.saving = true
      try {
        await axios.post(`${API}/health-metrics`, {
          user_id:             this.selectedMember.id,
          record_date:         new Date().toISOString().split('T')[0],
          weight:              parseFloat(this.form.weight),
          height:              parseFloat(this.form.height),
          body_fat_percentage: this.form.bodyFat ? parseFloat(this.form.bodyFat) : null,
          muscle_mass_kg:      this.form.muscle  ? parseFloat(this.form.muscle)  : null,
          bmi:                 this.bmi ? parseFloat(this.bmi) : null,
        }, authHeaders())
        this.showToast('Đã lưu chỉ số sức khỏe thành công!')
        await this.selectMember(this.selectedMember)
      } catch (e) {
        const msg = e.response?.data?.message || 'Lưu thất bại'
        this.showToast(msg, 'error')
      } finally {
        this.saving = false
      }
    },
    showToast(text, type = 'success') {
      clearTimeout(this.toastTimer)
      this.toast = { show: true, text, type }
      this.toastTimer = setTimeout(() => { this.toast.show = false }, 3500)
    },
  },
}
</script>

<style scoped>
.cssk-page {
  display: flex; flex-direction: column; gap: 20px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  color: #1e293b; position: relative;
}

/* Header */
.page-header { margin-bottom: 4px; }
.page-title { font-size: 1.4rem; font-weight: 800; color: #0f172a; margin: 0; }
.page-sub { font-size: 0.78rem; color: #94a3b8; margin-top: 3px; }

/* Member Selector */
.member-selector-card {
  background: #fff; border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
}
.ms-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.ms-label { font-size: 0.82rem; font-weight: 600; color: #475569; }
.ms-count { font-size: 0.78rem; color: #94a3b8; }
.ms-list { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 4px; }
.ms-list::-webkit-scrollbar { height: 3px; }
.ms-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
.ms-item {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 12px 16px; border-radius: 14px;
  border: 2px solid transparent;
  cursor: pointer; transition: all 0.2s;
  min-width: 90px; flex-shrink: 0;
  background: #f8fafc;
}
.ms-item:hover { background: #f0fdf4; border-color: #86efac; }
.ms-item.selected { background: #f0fdf4; border-color: #2d7a3a; }
.ms-avatar-wrap { position: relative; }
.ms-avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; }
.ms-item.selected .ms-avatar { border-color: #2d7a3a; }
.ms-check {
  position: absolute; bottom: -2px; right: -2px;
  font-size: 1rem; color: #2d7a3a; background: #fff; border-radius: 50%;
}
.ms-name { font-size: 0.78rem; font-weight: 600; color: #1e293b; text-align: center; white-space: nowrap; }
.ms-code { font-size: 0.68rem; color: #94a3b8; }

/* Main grid */
.main-grid {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  align-items: start;
}

/* Form Card */
.form-card {
  background: #fff; border-radius: 16px;
  padding: 22px 22px 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
  display: flex; flex-direction: column; gap: 16px;
}
.form-card-header { display: flex; align-items: center; gap: 8px; }
.form-card-bar { width: 4px; height: 20px; background: #2d7a3a; border-radius: 4px; border: 2px dashed #86efac; }
.form-card-title { font-size: 1rem; font-weight: 700; color: #0f172a; }
.form-updating-for { font-size: 0.75rem; color: #64748b; margin-top: -8px; }
.form-updating-for strong { color: #2d7a3a; }

.metrics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.metric-group { display: flex; flex-direction: column; gap: 5px; }
.metric-label { font-size: 0.68rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.4px; }
.metric-input {
  border: 1.5px solid #e2e8f0; border-radius: 9px;
  padding: 10px 13px; font-size: 1rem; font-weight: 600;
  color: #1e293b; outline: none;
  transition: border-color 0.18s; background: #f8fafc;
  font-family: inherit;
}
.metric-input:focus { border-color: #2d7a3a; background: #fff; }

.bmi-card {
  display: flex; align-items: center; justify-content: space-between;
  background: #f0fdf4; border-radius: 12px;
  padding: 14px 16px; border: 1px solid #bbf7d0;
}
.bmi-label { font-size: 0.68rem; font-weight: 700; color: #15803d; letter-spacing: 0.3px; }
.bmi-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-top: 2px; }
.bmi-badge {
  padding: 5px 14px; border-radius: 20px;
  font-size: 0.75rem; font-weight: 700;
}
.bmi-badge.green  { background: #dcfce7; color: #16a34a; }
.bmi-badge.yellow { background: #fef9c3; color: #ca8a04; }
.bmi-badge.red    { background: #fee2e2; color: #dc2626; }
.bmi-badge.blue   { background: #dbeafe; color: #2563eb; }

.form-actions { display: flex; flex-direction: column; gap: 8px; }
.btn-save {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff; border: none; border-radius: 10px;
  padding: 12px; font-size: 0.9rem; font-weight: 700;
  cursor: pointer; transition: opacity 0.18s;
  font-family: inherit;
}
.btn-save:hover:not(:disabled) { opacity: 0.88; }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-cancel {
  text-align: center; padding: 9px; font-size: 0.85rem;
  color: #64748b; font-weight: 500; cursor: pointer;
  background: none; border: none; transition: color 0.15s; font-family: inherit;
}
.btn-cancel:hover { color: #dc2626; }

/* Right col */
.right-col { display: flex; flex-direction: column; gap: 16px; }

/* Chart Card */
.chart-card {
  background: #fff; border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
}
.chart-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.chart-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.chart-tabs { display: flex; gap: 6px; }
.chart-tab {
  padding: 5px 12px; border-radius: 20px; border: 1.5px solid #e2e8f0;
  font-size: 0.75rem; font-weight: 600; color: #64748b;
  background: #f8fafc; cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.chart-tab:hover { border-color: #2d7a3a; color: #2d7a3a; }
.chart-tab.active { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }
.chart-area { width: 100%; height: 200px; }
.line-chart { width: 100%; height: 100%; }

/* Stats row */
.stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.stat-mini {
  background: #fff; border-radius: 14px; padding: 16px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.stat-mini-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.stat-mini.green .stat-mini-icon { background: #dcfce7; color: #16a34a; }
.stat-mini.purple .stat-mini-icon { background: #ede9fe; color: #7c3aed; }
.stat-mini-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.3px; }
.stat-mini-value { font-size: 1.3rem; font-weight: 800; color: #0f172a; line-height: 1.1; }
.stat-mini.green .stat-mini-value { color: #16a34a; }
.stat-mini.purple .stat-mini-value { color: #7c3aed; }
.stat-mini-sub { font-size: 0.68rem; color: #94a3b8; margin-top: 2px; }

/* Empty state */
.empty-select {
  text-align: center; padding: 60px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  color: #94a3b8;
}
.empty-select i { font-size: 3rem; opacity: 0.4; }
.empty-select p { font-size: 0.9rem; margin: 0; }

/* Toast */
.toast-msg {
  position: fixed; top: 24px; right: 24px; z-index: 9999;
  padding: 12px 20px; border-radius: 12px;
  font-size: 0.88rem; font-weight: 600;
  display: flex; align-items: center; gap: 9px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}
.toast-msg.success { background: #16a34a; color: #fff; }
.toast-msg.error   { background: #dc2626; color: #fff; }
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-12px); }
</style>
