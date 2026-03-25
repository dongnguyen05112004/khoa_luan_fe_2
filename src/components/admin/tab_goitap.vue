<template>
  <div class="tab-content">

    <!-- KPI row (5 cols) -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">TỔNG DOANH THU GÓI</div>
        <div class="kpi-val">$142,800</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +12.5%</div>
        <div class="kpi-bar-mini green"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">TỶ LỆ CHUYỂN ĐỔI VIP</div>
        <div class="kpi-val">24.8%</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +3.2%</div>
        <div class="kpi-bar-mini purple"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">GIÁ TRỊ TB/GÓI (ARPU)</div>
        <div class="kpi-val">$84.50</div>
        <div class="kpi-badge down"><i class="fas fa-caret-down"></i> -2.10</div>
        <div class="kpi-bar-mini gray"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">GÓI PT ĐANG HOẠT ĐỘNG</div>
        <div class="kpi-val">582</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +18%</div>
        <div class="kpi-bar-mini green"></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">GÓI PT ĐANG CHỜ DUYỆT</div>
        <div class="kpi-val">43 <span class="new-tag">Mới</span></div>
      </div>
    </div>

    <!-- Section heading -->
    <div class="section-head">
      <div>
        <h2 class="section-title">HIỆU QUẢ GÓI TẬP (PHÂN TÍCH CHUYÊN SÂU)</h2>
        <p class="section-sub">Hiệu quả khai thác các gói sản phẩm tập luyện</p>
      </div>
      <div class="head-actions">
        <button class="btn-outline">Xuất PDF</button>
        <button class="btn-primary">Phân tích sâu</button>
      </div>
    </div>

    <!-- Chart + AI panel -->
    <div class="body-grid">
      <div class="chart-area">
        <!-- Legend -->
        <div class="chart-card">
          <div class="chart-top">
            <strong class="chart-title">Doanh thu theo loại gói tập</strong>
            <div class="legend-inline">
              <span class="leg-dot green"></span> Cơ bản
              <span class="leg-dot purple ml"></span> VIP
              <span class="leg-dot indigo ml"></span> PT 1-kèm-1
            </div>
          </div>
          <!-- Bar chart SVG -->
          <svg viewBox="0 0 440 160" class="bar-svg" preserveAspectRatio="none">
            <line v-for="y in [20,60,100,140]" :key="y" x1="0" :y1="y" x2="440" :y2="y" stroke="#f1f5f9" stroke-width="1"/>
            <!-- Groups for each month T1-T5 -->
            <g v-for="(d,i) in barData" :key="i">
              <rect :x="i*88 + 8"  :y="160-d.a" width="18" :height="d.a" fill="#2d7a3a" rx="3"/>
              <rect :x="i*88 + 30" :y="160-d.b" width="18" :height="d.b" fill="#7c3aed" rx="3"/>
              <rect :x="i*88 + 52" :y="160-d.c" width="18" :height="d.c" fill="#6366f1" rx="3"/>
              <text :x="i*88 + 38" y="158" text-anchor="middle" font-size="10" fill="#94a3b8">THÁNG {{ i+1 }}</text>
            </g>
          </svg>
        </div>

        <!-- Bottom 2 cards -->
        <div class="bottom2">
          <div class="donut2-card">
            <div class="d2-title">Tỷ lệ số lượng đăng ký theo gói</div>
            <div class="d2-body">
              <svg viewBox="0 0 100 100" class="donut2-svg">
                <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" stroke-width="14"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#2d7a3a" stroke-width="14" stroke-dasharray="135.7 226.2" stroke-dashoffset="0"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#7c3aed" stroke-width="14" stroke-dasharray="70.1 226.2" stroke-dashoffset="-135.7"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#6366f1" stroke-width="14" stroke-dasharray="38.5 226.2" stroke-dashoffset="-205.8"/>
                <text x="50" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#1e293b">QUY MÔ</text>
              </svg>
              <div class="d2-legend">
                <div><span class="leg-dot green sm"></span> Cơ bản: 52%</div>
                <div><span class="leg-dot purple sm"></span> VIP: 31%</div>
                <div><span class="leg-dot indigo sm"></span> PT: 17%</div>
              </div>
            </div>
          </div>
          <div class="impact-card">
            <div class="impact-title">Tác động duy trì</div>
            <p class="impact-body">Người dùng gói VIP có tỷ lệ gia hạn cao hơn <strong>42%</strong> so với gói Cơ bản trong quý này.</p>
            <a href="#" class="impact-link">Xem chi tiết hành vi →</a>
          </div>
        </div>
      </div>

      <!-- AI panel -->
      <div class="ai-panel">
        <div class="ai-panel-head">
          <i class="fas fa-robot"></i>
          <strong>BẢNG PHÂN TÍCH SÂU TỪ AI</strong>
        </div>
        <div class="ai-highlight">
          <div class="ai-hl-title"><i class="fas fa-fire text-orange"></i> Gói VIP: Tăng trưởng nhanh</div>
          <div class="ai-hl-sub">vượt mục tiêu 15% so với tháng trước</div>
        </div>
        <p class="ai-desc">Dữ liệu cho thấy xu hướng hội viên dịch chuyển từ <strong>Cơ bản → VIP</strong> đang tăng mạnh ở nhóm khách hàng trẻ (18–25 tuổi).</p>
        <div class="ai-quote">"Dự báo: Doanh thu từ PT 1-kèm-1 sẽ tăng thêm 8% nếu áp dụng các gói chiều sâu vào mùa cao điểm."</div>

        <div class="ai-strategy-head"><i class="fas fa-chess"></i> CHIẾN LƯỢC ĐỀ XUẤT</div>
        <div class="strategy-item">
          <div class="strategy-row">
            <strong>Đề xuất: Tạo gói Combo mùa hè mới</strong>
            <span class="stag orange">Tác động cao</span>
          </div>
          <p class="strategy-desc">Combo Cơ bản + 3 buổi PT miễn phí cho khách hàng mới gia hạn.</p>
        </div>
        <div class="strategy-item danger">
          <div class="strategy-row">
            <strong>Cảnh báo rời bỏ</strong>
            <span class="stag red">Nghiêm trọng</span>
          </div>
          <p class="strategy-desc">Tỷ lệ này gói PT tăng 0 khung gói cao điểm do thiếu hút nhân sự HLV.</p>
        </div>
        <button class="btn-strategy">Khởi tạo chiến lược AI chi tiết</button>

        <div class="coso-card">
          <div class="coso-label">Cơ sở tiêu biểu</div>
          <div class="coso-val">Chi nhánh Quận 1</div>
          <span class="coso-badge">+24% HĐ suất / m²</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabGoiTap',
  data() {
    return {
      barData: [
        { a: 70, b: 50, c: 30 },
        { a: 85, b: 65, c: 40 },
        { a: 60, b: 70, c: 50 },
        { a: 90, b: 75, c: 55 },
        { a: 80, b: 90, c: 60 },
      ],
    }
  },
}
</script>

<style scoped>
.tab-content { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; }
.kpi-row { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
.kpi-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-label { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:5px; }
.kpi-val { font-size:1.4rem; font-weight:800; color:#1e293b; }
.kpi-badge { display:inline-flex; align-items:center; gap:3px; font-size:.7rem; font-weight:600; padding:2px 7px; border-radius:20px; margin-top:4px; }
.kpi-badge.up   { background:#dcfce7; color:#16a34a; }
.kpi-badge.down { background:#fee2e2; color:#dc2626; }
.kpi-bar-mini { height:3px; border-radius:2px; margin-top:8px; }
.kpi-bar-mini.green  { background:linear-gradient(90deg,#bbf7d0,#16a34a); }
.kpi-bar-mini.purple { background:linear-gradient(90deg,#ede9fe,#7c3aed); }
.kpi-bar-mini.gray   { background:#e2e8f0; }
.new-tag { font-size:.65rem; font-weight:700; background:#fef9c3; color:#a16207; padding:1px 6px; border-radius:20px; margin-left:4px; }
.section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.section-title { margin:0; font-size:1.15rem; font-weight:900; color:#1e293b; letter-spacing:-.3px; }
.section-sub { margin:4px 0 0; font-size:.78rem; color:#94a3b8; }
.head-actions { display:flex; gap:10px; }
.btn-outline { background:#fff; border:1.5px solid #2d7a3a; color:#2d7a3a; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.btn-primary { background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.body-grid { display:grid; grid-template-columns:1fr 280px; gap:16px; }
.chart-area { display:flex; flex-direction:column; gap:14px; }
.chart-card { background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.chart-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; flex-wrap:wrap; gap:8px; }
.chart-title { font-size:.88rem; font-weight:700; color:#1e293b; }
.legend-inline { display:flex; align-items:center; gap:8px; font-size:.75rem; color:#64748b; }
.leg-dot { width:10px; height:10px; border-radius:2px; display:inline-block; }
.leg-dot.green  { background:#2d7a3a; }
.leg-dot.purple { background:#7c3aed; }
.leg-dot.indigo { background:#6366f1; }
.ml { margin-left:10px; }
.sm { margin-right:4px; }
.bar-svg { width:100%; height:160px; display:block; }
.bottom2 { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.donut2-card { background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.d2-title { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:12px; }
.d2-body { display:flex; align-items:center; gap:14px; }
.donut2-svg { width:90px; height:90px; transform:rotate(-90deg); overflow:visible; flex-shrink:0; }
.d2-legend { display:flex; flex-direction:column; gap:6px; font-size:.75rem; color:#475569; }
.impact-card { background:linear-gradient(135deg,#166534,#1a5c28); border-radius:12px; padding:18px; color:#fff; box-shadow:0 2px 10px rgba(0,0,0,.1); }
.impact-title { font-size:.88rem; font-weight:700; margin-bottom:8px; }
.impact-body { font-size:.8rem; line-height:1.6; color:#bbf7d0; margin:0 0 12px; }
.impact-link { font-size:.75rem; color:#4ade80; text-decoration:none; }
/* AI Panel */
.ai-panel { background:#fff; border-radius:14px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); border:1.5px solid #ede9fe; display:flex; flex-direction:column; gap:12px; }
.ai-panel-head { display:flex; align-items:center; gap:8px; font-size:.8rem; font-weight:700; color:#7c3aed; }
.ai-highlight { background:#f0fdf4; border-radius:10px; padding:10px 14px; border-left:3px solid #16a34a; }
.ai-hl-title { font-size:.82rem; font-weight:700; color:#1e293b; }
.ai-hl-sub { font-size:.72rem; color:#94a3b8; margin-top:2px; }
.text-orange { color:#f97316; }
.ai-desc { font-size:.78rem; color:#475569; line-height:1.6; margin:0; }
.ai-quote { background:#f8fafc; border-left:3px solid #7c3aed; padding:10px 12px; font-size:.76rem; color:#475569; line-height:1.5; border-radius:0 6px 6px 0; font-style:italic; }
.ai-strategy-head { display:flex; align-items:center; gap:6px; font-size:.72rem; font-weight:700; color:#64748b; letter-spacing:.4px; }
.strategy-item { border-radius:10px; padding:10px 12px; background:#f8fafc; }
.strategy-item.danger { background:#fff5f5; }
.strategy-row { display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap; }
.strategy-row strong { font-size:.78rem; color:#1e293b; }
.stag { font-size:.65rem; font-weight:700; padding:2px 8px; border-radius:20px; white-space:nowrap; }
.stag.orange { background:#ffedd5; color:#c2410c; }
.stag.red    { background:#fee2e2; color:#dc2626; }
.strategy-desc { font-size:.73rem; color:#64748b; margin:5px 0 0; }
.btn-strategy { background:#1e293b; color:#fff; border:none; border-radius:8px; padding:10px 14px; font-size:.78rem; font-weight:600; cursor:pointer; text-align:center; }
.btn-strategy:hover { opacity:.88; }
.coso-card { background:#f0fdf4; border-radius:10px; padding:12px 14px; }
.coso-label { font-size:.65rem; color:#94a3b8; font-weight:600; }
.coso-val { font-size:1rem; font-weight:800; color:#1e293b; margin:2px 0; }
.coso-badge { font-size:.7rem; font-weight:700; color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:20px; }
</style>
