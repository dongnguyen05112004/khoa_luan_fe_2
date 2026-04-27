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

      <!-- AI Unified Card -->
      <div class="ai-card-unified">
        <div class="ai-card-header-unified">
          <div class="ai-avatar-unified">
            <i class="fas fa-brain"></i>
          </div>
          <div class="ai-title-unified">
            <strong v-if="aiReport">{{ aiReport.title }}</strong>
            <strong v-else>Phân tích từ SmartGym AI</strong>
          </div>
          <button class="btn-generate-ai-unified" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
            <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
            {{ isAiLoading ? 'Đang phân tích...' : 'Cập nhật AI' }}
          </button>
        </div>

        <div v-if="aiReport">
          <div class="ai-rec-diagnosis-unified">{{ aiReport.ai_diagnosis }}</div>
          <div class="ai-suggestions-unified" v-if="aiReport.ai_suggestions">
            <div class="suggestion-hd">CHIẾN LƯỢC ĐỀ XUẤT:</div>
            <div class="suggestion-item-unified" v-for="(tip, i) in aiReport.ai_suggestions.split('\n')" :key="i">
              <template v-if="tip.trim()">
                <i class="fas fa-check-circle"></i>
                <span>{{ tip.replace(/^- /, '').replace(/^\* /, '') }}</span>
              </template>
            </div>
          </div>
        </div>
        <div v-else class="ai-empty-unified">
          Chưa có phân tích AI. Nhấn "Cập nhật AI" để Gemini đánh giá hiệu quả kinh doanh các gói tập.
        </div>

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
  props: ['aiReport', 'isAiLoading'],
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

/* AI Unified Card Style - KINETIC DARK VERSION */
.ai-card-unified {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #fff;
}
.ai-card-header-unified {
  display: flex;
  align-items: center;
  gap: 12px;
}
.ai-avatar-unified {
  width: 44px; height: 44px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1.2rem;
  flex-shrink: 0;
  box-shadow: 0 6px 12px rgba(99, 102, 241, 0.3);
}
.ai-title-unified {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  flex: 1;
}
.btn-generate-ai-unified {
  background: linear-gradient(90deg, #4f46e5, #7c3aed) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: all 0.3s;
  outline: none !important;
}
.ai-rec-diagnosis-unified {
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.6;
  background: rgba(255, 255, 255, 0.04);
  padding: 14px 18px;
  border-radius: 12px;
  border-left: 3px solid #6366f1;
}
.ai-suggestions-unified {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.suggestion-hd {
  font-size: 0.65rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.suggestion-item-unified {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: #cbd5e1;
  line-height: 1.4;
}
.suggestion-item-unified i {
  color: #4ade80;
  margin-top: 2px;
  font-size: 0.9rem;
}
.ai-empty-unified {
  text-align: center;
  padding: 30px;
  color: #94a3b8;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
.coso-card { background:#f0fdf4; border-radius:10px; padding:12px 14px; }
.coso-label { font-size:.65rem; color:#94a3b8; font-weight:600; }
.coso-val { font-size:1rem; font-weight:800; color:#1e293b; margin:2px 0; }
.coso-badge { font-size:.7rem; font-weight:700; color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:20px; }
</style>
