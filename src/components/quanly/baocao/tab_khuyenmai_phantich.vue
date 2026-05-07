<template>
  <div class="kp-wrap">

    <!-- ── Top Stats Bar ── -->
    <div class="top-stats-bar">
      <div class="ts-item" v-for="s in topStats" :key="s.label">
        <div class="ts-label">{{ s.label }}</div>
        <div class="ts-value" :class="s.valClass">{{ s.value }}</div>
        <div class="ts-sub" v-if="s.sub">{{ s.sub }}</div>
      </div>
      <!-- AI Score – special green card -->
      <div class="ts-item ts-ai">
        <div class="ts-ai-score">94<span class="ts-ai-denom">/100</span></div>
        <div class="ts-ai-label">ĐIỂM TỐI ƯU AI</div>
        <div class="ts-ai-sub"><i class="fas fa-arrow-up"></i> Phiên hiệu suất đỉnh cao</div>
      </div>
    </div>

    <!-- ── Page Header ── -->
    <div class="kp-header">
      <div class="kp-header-left">
        <h2 class="kp-title">PHÂN TÍCH HIỆU QUẢ KHUYẾN MÃI</h2>
        <p class="kp-sub">Phân tích và tối ưu hóa chi phí tiếp thị phòng tập. Theo dõi phễu chuyển đổi và hiệu quả từng chiến dịch theo thời gian thực.</p>
      </div>
      <div class="kp-header-actions">
        <button class="btn-export"><i class="fas fa-file-export"></i> Xuất báo cáo</button>
        <button class="btn-new"><i class="fas fa-plus"></i> Chiến dịch mới</button>
      </div>
    </div>

    <!-- ── KPI Cards Row ── -->
    <div class="kpi-row">
      <div class="kpi-card" v-for="k in kpiCards" :key="k.label">
        <div class="kpi-top-row">
          <div class="kpi-icon-box" :class="k.iconBg"><i :class="k.icon"></i></div>
          <span class="kpi-badge-trend" :class="k.trendClass">{{ k.trend }}</span>
        </div>
        <div class="kpi-value">{{ k.value }}</div>
        <div class="kpi-label">{{ k.label }}</div>
        <div class="kpi-desc">{{ k.desc }}</div>
      </div>
    </div>

    <!-- ── Funnel + Campaign Table ── -->
    <div class="body-row">

      <!-- LEFT: Funnel Chart -->
      <div class="funnel-panel premium-card">
        <div class="panel-title"><i class="fas fa-filter"></i> BIỂU ĐỒ PHỄU CHUYỂN ĐỔI</div>

        <!-- Funnel Steps -->
        <div class="funnel-steps">
          <div class="funnel-step" v-for="(step, i) in funnelSteps" :key="i">
            <div class="funnel-bar-wrap">
              <div
                class="funnel-bar"
                :class="step.cls"
                :style="{ width: step.pct + '%' }"
              >
                <span class="funnel-bar-label">{{ step.label }}</span>
                <span class="funnel-bar-icon"><i :class="step.icon"></i></span>
              </div>
            </div>
            <div class="funnel-value">{{ step.value }}</div>
          </div>
        </div>

        <!-- AI Insight Box -->
        <div class="funnel-ai-box">
          <div class="funnel-ai-icon"><i class="fas fa-wand-magic-sparkles"></i></div>
          <div class="funnel-ai-text">
            <div class="funnel-ai-title">THÔNG TIN THÔNG MINH TỪ AI</div>
            <p>Phân tích các giai đoạn chuyển đổi cho thấy sự rút giảm giữa 'Quan tâm' và 'Mua hàng' đó được cải thiện 4% sau khi thay đổi nội dung sáng tạo cho chiến dịch 'Summer Blast'.</p>
          </div>
        </div>
      </div>

      <!-- RIGHT: Campaign Comparison Table -->
      <div class="campaign-panel premium-card">
        <div class="panel-title-row">
          <div class="panel-title"><i class="fas fa-chart-bar"></i> So sánh chiến dịch đang chạy</div>
          <div class="panel-sub">Chi tiết hiệu suất theo nền tảng và loại chiến dịch.</div>
        </div>

        <!-- Table Header -->
        <div class="camp-table">
          <div class="camp-thead">
            <div class="camp-th">TÊN CHIẾN DỊCH</div>
            <div class="camp-th center">LƯỢT DÙNG</div>
            <div class="camp-th center">CTR</div>
            <div class="camp-th center">TRẠNG THÁI</div>
            <div class="camp-th center">ROI</div>
          </div>
          <div class="camp-tbody">
            <div class="camp-row" v-for="c in mappedCampaigns" :key="c.id || c.name">
              <div class="camp-td camp-name-cell">
                <div class="camp-icon-box" :class="c.iconBg"><i :class="c.icon"></i></div>
                <div>
                  <div class="camp-name">{{ c.name }}</div>
                  <div class="camp-type">{{ c.type }}</div>
                  <span class="camp-tag" v-if="c.tag">{{ c.tag }}</span>
                </div>
              </div>
              <div class="camp-td center camp-uses">{{ c.uses }}</div>
              <div class="camp-td center camp-ctr">{{ c.ctr }}</div>
              <div class="camp-td center">
                <span class="camp-status" :class="c.statusClass">{{ c.status }}</span>
              </div>
              <div class="camp-td center camp-roi">{{ c.roi }}</div>
            </div>
          </div>
        </div>

        <!-- View all link -->
        <div class="camp-view-all">
          <a href="#" class="camp-view-link">Xem tất cả 18 chiến dịch <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TabKhuyenMaiPhanTich',
  data() {
    return {
      topStats: [
        { label: 'Tỉ lệ chuyển đổi trực tiếp', value: '12.4%', sub: '+2.1% so với hôm qua' },
        { label: 'Mã khuyến mãi đang chạy', value: '18', sub: 'Trên 4 nền tảng' },
        { label: 'Doanh thu ước tính', value: '286.500.000 VNĐ', sub: 'Tháng này' },
      ],
      kpiCards: [
        { label: 'Tổng mã đã dùng', value: '3,842', trend: '+12% so với năm ngoái', trendClass: 'trend-green', icon: 'fas fa-ticket-alt', iconBg: 'icon-green', desc: 'Số lượng mã khuyến mãi được quy đổi bởi các cặp thành viên giảm giá.' },
        { label: 'Doanh thu từ khuyến mãi', value: '1.164.800.000 VNĐ', trend: 'Tri Vũ', trendClass: 'trend-blue', icon: 'fas fa-coins', iconBg: 'icon-blue', desc: 'Tổng doanh thu trực tiếp tạo ra từ các lượt đăng ký có sử dụng giảm giá.' },
        { label: 'Tỷ lệ chuyển đổi', value: '21.8%', trend: 'Tiềm năng cao', trendClass: 'trend-purple', icon: 'fas fa-percent', iconBg: 'icon-purple', desc: 'Tỷ lệ chuyển đổi tổng từ khách hàng tiếp cận sang mua thẻ thành viên.' },
      ],
      funnelSteps: [
        { label: 'PHÁT HÀNH (TIẾP CẬN)', value: '142,500', pct: 100, cls: 'funnel-green',  icon: 'fas fa-bullhorn' },
        { label: 'LƯỢT QUAN TÂM',        value: '32,140',  pct: 70,  cls: 'funnel-teal',   icon: 'fas fa-eye' },
        { label: 'LƯỢT CHUYỂN ĐỔI',      value: '6,842',   pct: 40,  cls: 'funnel-purple', icon: 'fas fa-shopping-cart' },
      ],
      loading: false,
      errorMsg: '',
      showEditModal: false,
      editingId: null,
      editForm: { name: '', code: '', discount: 20, startDate: '', endDate: '', usage_limit: '', desc: '' },
      editing: false,
      editError: '',
      campaigns: [],
    }
  },

  computed: {
    mappedCampaigns() {
      const iconMap = [
        { icon: 'fas fa-sun',      iconBg: 'icon-yellow' },
        { icon: 'fab fa-facebook', iconBg: 'icon-blue'   },
        { icon: 'fas fa-user-tie', iconBg: 'icon-orange' },
        { icon: 'fas fa-envelope', iconBg: 'icon-purple' },
        { icon: 'fas fa-tag',      iconBg: 'icon-green'  },
      ]
      const now = new Date()
      return this.campaigns.map((c, i) => {
        const start = c.start_date ? new Date(c.start_date) : null
        const end   = c.end_date   ? new Date(c.end_date)   : null
        const isRunning = (start && end) ? (now >= start && now <= end) : c.active
        const ic = iconMap[i % iconMap.length]
        return {
          id:          c.id,
          name:        c.name,
          type:        c.target || 'KHUYẾN MÃI',
          tag:         i === 0 ? 'HIỆU QUẢ NHẤT' : '',
          icon:        ic.icon,
          iconBg:      ic.iconBg,
          uses:        c.usage_limit ? String(c.usage_limit) : '—',
          ctr:         c._raw?.discount ? `${c._raw.discount}%` : '—',
          status:      isRunning ? 'Đang chạy' : (end && now > end ? 'Đã kết thúc' : 'Sắp diễn ra'),
          statusClass: isRunning ? 'status-running' : 'status-done',
          roi:         '—',
        }
      })
    },
    statsActive() {
      return this.campaigns.filter(c => c.active).length
    },
  },

  mounted() {
    this.fetchPromotions()
  },

  methods: {
    async fetchPromotions() {
      this.loading = true
      this.errorMsg = ''
      try {
        const { promotionApi } = await import('@/services/promotionApi.js')
        const res  = await promotionApi.getAll()
        const data = res.data
        const list = Array.isArray(data) ? data : (data.data || [])
        this.campaigns = list.map((p, i) => this.mapPromotion(p, i))
      } catch (err) {
        console.error('fetchPromotions error:', err)
        this.errorMsg = err?.response?.data?.message || err.message || 'Lỗi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },

    mapPromotion(p, idx = 0) {
      const colors   = ['#2d7a3a', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6']
      const now      = new Date()
      const start    = p.start_date ? new Date(p.start_date) : null
      const end      = p.end_date   ? new Date(p.end_date)   : null
      const isActive = (start && end) ? (now >= start && now <= end) : true
      const period   = (p.start_date && p.end_date)
        ? `${new Date(p.start_date).toLocaleDateString('vi-VN')} – ${new Date(p.end_date).toLocaleDateString('vi-VN')}`
        : (p.start_date ? new Date(p.start_date).toLocaleDateString('vi-VN') : 'Đang diễn ra')
      return {
        id:          p.id,
        name:        p.title || p.name,
        target:      p.description || 'Tất cả hội viên',
        code:        p.code || '—',
        period,
        discount:    p.discount ? `GIẢM ${p.discount}%` : '—',
        active:      isActive,
        color:       colors[idx % colors.length],
        start_date:  p.start_date,
        end_date:    p.end_date,
        usage_limit: p.usage_limit,
        _raw:        p,
      }
    },

    async deletePromo(c) {
      if (!c) return
      if (!confirm(`Xóa chiến dịch "${c.name}"?`)) return
      try {
        const { promotionApi } = await import('@/services/promotionApi.js')
        await promotionApi.remove(c.id)
        this.campaigns = this.campaigns.filter(x => x.id !== c.id)
      } catch (err) {
        alert(err?.response?.data?.message || 'Lỗi khi xóa chiến dịch')
      }
    },

    openEdit(c) {
      if (!c) return
      this.editingId = c.id
      this.editError = ''
      const raw = c._raw || {}
      this.editForm = {
        name:        raw.title       || c.name || '',
        code:        raw.code        || (c.code !== '—' ? c.code : '') || '',
        discount:    raw.discount    != null ? raw.discount : 20,
        startDate:   raw.start_date  ? raw.start_date.substring(0, 10) : '',
        endDate:     raw.end_date    ? raw.end_date.substring(0, 10)   : '',
        usage_limit: raw.usage_limit || '',
        desc:        raw.description || '',
      }
      this.showEditModal = true
    },

    closeEdit() {
      this.showEditModal = false
      this.editingId = null
      this.editError = ''
    },

    async submitEdit() {
      if (!this.editForm.name) { this.editError = 'Vui lòng nhập tên chiến dịch.'; return }
      this.editing = true
      this.editError = ''
      try {
        const { promotionApi } = await import('@/services/promotionApi.js')
        const payload = {
          title:       this.editForm.name,
          code:        this.editForm.code        || undefined,
          discount:    this.editForm.discount    || undefined,
          description: this.editForm.desc        || undefined,
          start_date:  this.editForm.startDate   || undefined,
          end_date:    this.editForm.endDate     || undefined,
          usage_limit: this.editForm.usage_limit || undefined,
        }
        const res     = await promotionApi.update(this.editingId, payload)
        const updated = res.data?.data ?? res.data
        const idx     = this.campaigns.findIndex(x => x.id === this.editingId)
        if (idx !== -1) this.campaigns.splice(idx, 1, this.mapPromotion(updated, idx))
        this.closeEdit()
      } catch (err) {
        this.editError = err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : (err?.response?.data?.message || 'Lỗi khi cập nhật')
      } finally {
        this.editing = false
      }
    },

    getCampaignById(id) {
      return this.campaigns.find(c => c.id === id) || null
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

/* ─── Root ─── */
.kp-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Inter', sans-serif;
  color: #1e293b;
}

/* ─── Top Stats Bar ─── */
.top-stats-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr) 180px;
  gap: 12px;
}
.ts-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.ts-label {
  font-size: 0.68rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.ts-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.1;
}
.ts-sub {
  font-size: 0.72rem;
  color: #10b981;
  font-weight: 600;
}

/* AI Score Card */
.ts-ai {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-color: #16a34a;
  color: #fff;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 4px 20px rgba(22,163,74,0.3);
}
.ts-ai-score {
  font-size: 2.4rem;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}
.ts-ai-denom {
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.8;
}
.ts-ai-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.5px;
}
.ts-ai-sub {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.75);
}

/* ─── Page Header ─── */
.kp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}
.kp-title {
  margin: 0 0 6px;
  font-size: 1.45rem;
  font-weight: 900;
  color: #0f172a;
  letter-spacing: -0.5px;
}
.kp-sub {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  max-width: 520px;
  line-height: 1.6;
}
.kp-header-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
  align-items: center;
}
.btn-export {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: #fff;
  font-size: 0.83rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-export:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}
.btn-new {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #16a34a, #15803d);
  font-size: 0.83rem;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(22,163,74,0.3);
  transition: all 0.2s;
}
.btn-new:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(22,163,74,0.4);
}

/* ─── KPI Cards ─── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.kpi-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: all 0.25s;
}
.kpi-card:hover {
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  transform: translateY(-2px);
  border-color: #cbd5e1;
}
.kpi-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.kpi-icon-box {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.9rem;
}
.icon-green  { background: #dcfce7; color: #16a34a; }
.icon-blue   { background: #dbeafe; color: #2563eb; }
.icon-purple { background: #ede9fe; color: #7c3aed; }
.icon-yellow { background: #fef9c3; color: #ca8a04; }
.icon-orange { background: #ffedd5; color: #ea580c; }

.kpi-badge-trend {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
}
.trend-green  { background: #dcfce7; color: #16a34a; }
.trend-blue   { background: #dbeafe; color: #2563eb; }
.trend-purple { background: #ede9fe; color: #7c3aed; }

.kpi-value {
  font-size: 1.7rem;
  font-weight: 900;
  color: #0f172a;
  line-height: 1.1;
}
.kpi-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #334155;
}
.kpi-desc {
  font-size: 0.72rem;
  color: #94a3b8;
  line-height: 1.5;
}

/* ─── Body Row: Funnel + Table ─── */
.body-row {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
  align-items: start;
}

/* Premium Card Base */
.premium-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.04);
}

.panel-title {
  font-size: 0.78rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 18px;
}
.panel-title i { color: #7c3aed; }

/* ─── Funnel Panel ─── */
.funnel-panel {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 0;
}
.funnel-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}
.funnel-step {
  display: flex;
  align-items: center;
  gap: 12px;
}
.funnel-bar-wrap {
  flex: 1;
}
.funnel-bar {
  height: 52px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  transition: width 0.6s cubic-bezier(.22,.68,0,1.2);
}
.funnel-bar-label {
  font-size: 0.63rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.3px;
}
.funnel-bar-icon {
  color: rgba(255,255,255,0.8);
  font-size: 0.85rem;
}
.funnel-green  { background: linear-gradient(90deg, #16a34a, #22c55e); }
.funnel-teal   { background: linear-gradient(90deg, #7c3aed, #8b5cf6); }
.funnel-purple { background: linear-gradient(90deg, #a855f7, #c084fc); }

.funnel-value {
  font-size: 0.95rem;
  font-weight: 800;
  color: #0f172a;
  min-width: 68px;
  text-align: right;
}

/* AI insight box */
.funnel-ai-box {
  display: flex;
  gap: 12px;
  background: #f8f5ff;
  border: 1px solid #e9d5ff;
  border-radius: 12px;
  padding: 14px;
}
.funnel-ai-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.funnel-ai-title {
  font-size: 0.62rem;
  font-weight: 800;
  color: #7c3aed;
  letter-spacing: 0.4px;
  margin-bottom: 5px;
}
.funnel-ai-text p {
  margin: 0;
  font-size: 0.73rem;
  color: #475569;
  line-height: 1.55;
}

/* ─── Campaign Panel ─── */
.campaign-panel {
  padding: 22px;
  display: flex;
  flex-direction: column;
}
.panel-title-row {
  margin-bottom: 16px;
}
.panel-title-row .panel-title {
  margin-bottom: 4px;
}
.panel-sub {
  font-size: 0.73rem;
  color: #94a3b8;
}

/* Table */
.camp-table {
  flex: 1;
}
.camp-thead {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr 0.8fr;
  gap: 4px;
  padding: 0 6px 10px;
  border-bottom: 1px solid #f1f5f9;
}
.camp-th {
  font-size: 0.63rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.4px;
}
.camp-th.center { text-align: center; }

.camp-tbody {
  display: flex;
  flex-direction: column;
}
.camp-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr 0.8fr;
  gap: 4px;
  padding: 12px 6px;
  border-bottom: 1px solid #f8fafc;
  align-items: center;
  transition: background 0.15s;
}
.camp-row:hover { background: #f8fafc; border-radius: 10px; }
.camp-row:last-child { border-bottom: none; }

.camp-td { font-size: 0.82rem; color: #334155; }
.camp-td.center { text-align: center; }

.camp-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.camp-icon-box {
  width: 34px; height: 34px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem;
  flex-shrink: 0;
}
.camp-name {
  font-size: 0.83rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.3;
}
.camp-type {
  font-size: 0.62rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.3px;
}
.camp-tag {
  display: inline-block;
  font-size: 0.58rem;
  font-weight: 800;
  color: #16a34a;
  background: #dcfce7;
  padding: 1px 6px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}

.camp-uses {
  font-weight: 700;
  color: #1e293b;
}
.camp-ctr {
  font-weight: 600;
  color: #475569;
}
.camp-roi {
  font-weight: 800;
  color: #16a34a;
}

/* Status Badge */
.camp-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
}
.status-running {
  background: #dcfce7;
  color: #16a34a;
}
.status-running::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #16a34a;
  animation: pulse-dot 1.5s infinite;
}
.status-done {
  background: #f1f5f9;
  color: #64748b;
}

/* View All */
.camp-view-all {
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  text-align: center;
}
.camp-view-link {
  font-size: 0.78rem;
  font-weight: 700;
  color: #7c3aed;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s;
}
.camp-view-link:hover { gap: 10px; color: #6d28d9; }

/* ─── Animations ─── */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* ─── Responsive ─── */
@media (max-width: 1100px) {
  .body-row { grid-template-columns: 1fr; }
  .top-stats-bar { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .kpi-row { grid-template-columns: 1fr; }
  .top-stats-bar { grid-template-columns: 1fr 1fr; }
  .camp-thead, .camp-row { grid-template-columns: 2fr 1fr 1fr; }
  .camp-th:nth-child(3), .camp-td:nth-child(3),
  .camp-th:nth-child(5), .camp-td:nth-child(5) { display: none; }
}
</style>
