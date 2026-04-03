<template>
  <div class="pt-wrap">
    <!-- Header row -->
    <div class="pt-header">
      <div>
        <div class="pt-eyebrow">TRUNG TÂM PHÂN TÍCH DOANH NGHIỆP</div>
        <h2 class="pt-title">Phân tích Khuyến mãi</h2>
        <p class="pt-sub">Theo dõi hiệu suất thời gian thực và tối ưu hóa chiến dịch dựa trên AI.</p>
      </div>
      <div class="pt-header-right">
        <button class="btn-period"><i class="fas fa-calendar-alt"></i> 30 ngày qua <i class="fas fa-chevron-down"></i></button>
        <button class="btn-dl"><i class="fas fa-download"></i></button>
      </div>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi-c" v-for="k in kpis" :key="k.label">
        <div class="kpi-top">
          <div class="kpi-icon-box" :class="k.ic"><i :class="k.icon"></i></div>
          <span class="kpi-trend" :class="k.trendClass">{{ k.trend }}</span>
        </div>
        <div class="kpi-lbl">{{ k.label }}</div>
        <div class="kpi-val">{{ k.value }}</div>
        <div class="kpi-bar"><div class="kpi-bar-fill" :style="{ width: k.pct + '%', background: k.barColor }"></div></div>
      </div>
    </div>

    <!-- Chart + AI card -->
    <div class="chart-row">
      <!-- Bar Chart -->
      <div class="chart-card">
        <div class="chart-head">
          <span class="chart-title">So sánh Hiệu suất Chiến dịch</span>
          <div class="chart-legend">
            <span class="leg-dot green"></span><span class="leg-txt">Chuyển đổi</span>
            <span class="leg-dot purple"></span><span class="leg-txt">Lượt nhập</span>
          </div>
        </div>
        <div class="bar-chart">
          <div class="bar-group" v-for="g in chartData" :key="g.label">
            <div class="bars">
              <div class="bar green-bar" :style="{ height: g.conv + 'px' }" :title="g.conv + '%'"></div>
              <div class="bar purple-bar" :style="{ height: g.enter + 'px' }" :title="g.enter + '%'"></div>
            </div>
            <div class="bar-label">{{ g.label }}</div>
          </div>
        </div>
      </div>

      <!-- AI Strategy Card -->
      <div class="ai-strat-card">
        <div class="ai-strat-badge"><i class="fas fa-wand-magic-sparkles"></i> CHIẾN LƯỢC TỐI ƯU BỞI AI</div>
        <div class="ai-strat-title">Cải tiến New Year VIP</div>
        <p class="ai-strat-desc">Dựa trên 24 tháng lịch sử, hồ sơ chiến dịch này có 92% xác suất vượt qua các khách hàng tiềm năng hiện tại trong Quý.</p>
        <div class="ai-strat-metrics">
          <div class="ai-metric">
            <span class="ai-metric-lbl">Chuyển đổi kỳ vọng</span>
            <span class="ai-metric-val green">+18.5%</span>
          </div>
          <div class="ai-metric">
            <span class="ai-metric-lbl">Doanh thu dự kiến</span>
            <span class="ai-metric-val">$85.4k</span>
          </div>
        </div>
        <button class="btn-apply">Áp dụng chiến lược ngay</button>
      </div>
    </div>

    <!-- Growth signal -->
    <div class="growth-card">
      <div class="growth-icon"><i class="fas fa-arrow-trend-up"></i></div>
      <div>
        <div class="growth-title">TÍN HIỆU TĂNG TRƯỞNG</div>
        <div class="growth-text">Các phiên tối (6PM–9PM) đang cho thấy tỉ lệ quy đổi voucher cao hơn 45% trong tuần này.</div>
      </div>
    </div>

    <!-- Recent campaigns -->
    <div class="recent-section">
      <div class="recent-title">Chi tiết chiến dịch gần đây</div>
      <div class="recent-list">
        <div class="recent-item" v-for="c in recent" :key="c.name">
          <div class="recent-icon" :class="c.ic"><i :class="c.icon"></i></div>
          <div class="recent-info">
            <div class="recent-name">{{ c.name }}</div>
            <div class="recent-tags">
              <span v-for="t in c.tags" :key="t" class="recent-tag">{{ t }}</span>
            </div>
          </div>
          <div class="recent-stats">
            <div class="rs"><div class="rs-lbl">SỬ DỤNG</div><div class="rs-val">{{ c.uses }}</div></div>
            <div class="rs"><div class="rs-lbl">CTR</div><div class="rs-val">{{ c.ctr }}</div></div>
            <div class="rs"><div class="rs-lbl">ROI</div><div class="rs-val green-txt">{{ c.roi }}</div></div>
          </div>
          <div class="recent-avatars">
            <div class="av" v-for="(a, i) in c.avatars" :key="i" :style="{ background: a }"></div>
          </div>
          <button class="btn-more"><i class="fas fa-ellipsis-v"></i></button>
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
      kpis: [
        { label: 'Số lần sử dụng', value: '12,482', trend: '+12.4%', trendClass: 'tr-green', icon: 'fas fa-ticket-alt', ic: 'ic-green', barColor: '#16a34a', pct: 74 },
        { label: 'Doanh thu tạo ra', value: '$42,910.00', trend: '+8.1%', trendClass: 'tr-green', icon: 'fas fa-coins', ic: 'ic-blue', barColor: '#2563eb', pct: 60 },
        { label: 'Tỷ lệ chuyển đổi (%)', value: '24.8%', trend: '+3.2%', trendClass: 'tr-green', icon: 'fas fa-percent', ic: 'ic-purple', barColor: '#7c3aed', pct: 82 },
        { label: 'Khuyến mãi đang chạy', value: '14', trend: 'Ổn định', trendClass: 'tr-gray', icon: 'fas fa-tag', ic: 'ic-orange', barColor: '#f59e0b', pct: 50 },
      ],
      chartData: [
        { label: 'SUMMER BLITZ', conv: 80, enter: 100 },
        { label: 'FLASH SALE',   conv: 50, enter: 70  },
        { label: 'NEW YEAR VIP', conv: 120, enter: 140 },
        { label: 'REFER-A-FRIEND', conv: 60, enter: 80 },
        { label: 'LOYALTY TIER', conv: 70, enter: 95  },
      ],
      recent: [
        { name: 'Summer Blitz 2024', tags: ['Kết thúc sau 4 ngày', 'Tập trung Mạng xã hội'], uses: '4,120', ctr: '12.4%', roi: '3.2x', ic: 'ic-green', icon: 'fas fa-sun', avatars: ['#6366f1','#2d7a3a','#f59e0b'] },
        { name: 'Khuyến mãi Flash Cuối tuần', tags: ['Hoàn thành', 'Email Marketing'], uses: '1,890', ctr: '8.1%', roi: '2.4x', ic: 'ic-purple', icon: 'fas fa-bolt', avatars: ['#7c3aed','#ec4899'] },
      ],
    }
  },
}
</script>

<style scoped>
.pt-wrap { display:flex; flex-direction:column; gap:18px; font-family:'Segoe UI',sans-serif; color:#1e293b; }
.pt-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.pt-eyebrow { font-size:.65rem; font-weight:700; color:#7c3aed; letter-spacing:.6px; margin-bottom:4px; }
.pt-title { font-size:1.6rem; font-weight:800; color:#0f172a; margin:0 0 4px; }
.pt-sub { font-size:.78rem; color:#64748b; margin:0; max-width:380px; }
.pt-header-right { display:flex; align-items:center; gap:8px; flex-shrink:0; }
.btn-period { display:flex; align-items:center; gap:6px; padding:7px 14px; border:1.5px solid #e2e8f0; border-radius:9px; background:#fff; font-size:.8rem; color:#475569; cursor:pointer; }
.btn-dl { width:34px; height:34px; border:1.5px solid #e2e8f0; border-radius:9px; background:#fff; color:#475569; cursor:pointer; font-size:.85rem; }

/* KPI */
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi-c { background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.kpi-icon-box { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:.82rem; }
.ic-green  { background:#dcfce7; color:#16a34a; }
.ic-blue   { background:#dbeafe; color:#2563eb; }
.ic-purple { background:#ede9fe; color:#7c3aed; }
.ic-orange { background:#fef3c7; color:#d97706; }
.kpi-trend { font-size:.68rem; font-weight:700; padding:2px 7px; border-radius:20px; }
.tr-green { background:#dcfce7; color:#16a34a; }
.tr-gray  { background:#f1f5f9; color:#64748b; }
.kpi-lbl { font-size:.68rem; color:#94a3b8; margin-bottom:4px; }
.kpi-val { font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:8px; }
.kpi-bar { height:4px; background:#f1f5f9; border-radius:20px; overflow:hidden; }
.kpi-bar-fill { height:100%; border-radius:20px; }

/* Chart row */
.chart-row { display:grid; grid-template-columns:1fr 260px; gap:16px; }
.chart-card { background:#fff; border-radius:14px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.chart-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; flex-wrap:wrap; gap:8px; }
.chart-title { font-size:.9rem; font-weight:700; color:#1e293b; }
.chart-legend { display:flex; align-items:center; gap:10px; }
.leg-dot { width:10px; height:10px; border-radius:50%; }
.leg-dot.green  { background:#2d7a3a; }
.leg-dot.purple { background:#7c3aed; }
.leg-txt { font-size:.72rem; color:#64748b; margin-right:4px; }
.bar-chart { display:flex; align-items:flex-end; gap:12px; height:160px; padding-bottom:24px; position:relative; }
.bar-group { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
.bars { display:flex; gap:4px; align-items:flex-end; height:130px; }
.bar { width:16px; border-radius:4px 4px 0 0; transition:height .4s; }
.green-bar  { background:linear-gradient(180deg,#2d7a3a,#166534); }
.purple-bar { background:linear-gradient(180deg,#7c3aed,#6366f1); }
.bar-label { font-size:.55rem; color:#94a3b8; font-weight:600; text-align:center; white-space:nowrap; }

/* AI Strategy */
.ai-strat-card { background:linear-gradient(135deg,#5b21b6 0%,#4f46e5 100%); border-radius:14px; padding:18px; color:#fff; display:flex; flex-direction:column; gap:12px; }
.ai-strat-badge { font-size:.62rem; font-weight:700; background:rgba(255,255,255,.2); padding:4px 10px; border-radius:20px; display:inline-flex; align-items:center; gap:5px; width:fit-content; }
.ai-strat-title { font-size:1rem; font-weight:800; }
.ai-strat-desc { font-size:.72rem; color:rgba(255,255,255,.82); line-height:1.55; margin:0; }
.ai-strat-metrics { display:flex; flex-direction:column; gap:8px; background:rgba(255,255,255,.1); border-radius:10px; padding:10px 12px; }
.ai-metric { display:flex; justify-content:space-between; align-items:center; }
.ai-metric-lbl { font-size:.7rem; color:rgba(255,255,255,.75); }
.ai-metric-val { font-size:.85rem; font-weight:800; }
.ai-metric-val.green { color:#4ade80; }
.btn-apply { padding:10px; border:2px solid rgba(255,255,255,.7); border-radius:9px; background:transparent; color:#fff; font-size:.82rem; font-weight:700; cursor:pointer; transition:background .15s; }
.btn-apply:hover { background:rgba(255,255,255,.15); }

/* Growth */
.growth-card { display:flex; align-items:center; gap:14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px 18px; }
.growth-icon { width:36px; height:36px; border-radius:50%; background:#16a34a; color:#fff; display:flex; align-items:center; justify-content:center; font-size:.9rem; flex-shrink:0; }
.growth-title { font-size:.65rem; font-weight:700; color:#16a34a; letter-spacing:.5px; margin-bottom:4px; }
.growth-text { font-size:.78rem; color:#475569; }

/* Recent */
.recent-section {}
.recent-title { font-size:.92rem; font-weight:700; color:#1e293b; margin-bottom:12px; }
.recent-list { display:flex; flex-direction:column; gap:10px; }
.recent-item { background:#fff; border-radius:12px; padding:14px 16px; box-shadow:0 2px 10px rgba(0,0,0,.06); display:flex; align-items:center; gap:14px; }
.recent-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:.9rem; flex-shrink:0; }
.recent-info { flex:1; min-width:0; }
.recent-name { font-size:.85rem; font-weight:700; color:#1e293b; margin-bottom:4px; }
.recent-tags { display:flex; gap:6px; flex-wrap:wrap; }
.recent-tag { font-size:.65rem; color:#64748b; background:#f1f5f9; padding:2px 7px; border-radius:20px; }
.recent-stats { display:flex; gap:20px; }
.rs { display:flex; flex-direction:column; align-items:center; gap:2px; }
.rs-lbl { font-size:.6rem; font-weight:700; color:#94a3b8; letter-spacing:.3px; }
.rs-val { font-size:.88rem; font-weight:800; color:#1e293b; }
.green-txt { color:#16a34a; }
.recent-avatars { display:flex; }
.av { width:24px; height:24px; border-radius:50%; margin-left:-6px; border:2px solid #fff; }
.btn-more { width:30px; height:30px; border:1.5px solid #e2e8f0; border-radius:8px; background:#fff; color:#64748b; cursor:pointer; font-size:.8rem; }
</style>
