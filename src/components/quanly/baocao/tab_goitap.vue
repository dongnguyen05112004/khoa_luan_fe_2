<template>
  <div class="tab-content kinetic-light">

    <!-- Section heading -->
    <div class="section-head">
      <div class="head-left">
        <h2 class="section-title">Phân Tích Gói Tập <span class="badge-premium">PREMIUM AI</span></h2>
        <p class="section-sub">Hiệu quả khai thác và phân bổ các gói sản phẩm tập luyện</p>
      </div>
      <div class="head-actions">
        <button class="btn-outline-glow"><i class="fas fa-file-pdf"></i> Xuất PDF</button>
        <button class="btn-primary-glow"><i class="fas fa-chart-line"></i> Phân tích sâu</button>
      </div>
    </div>

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card premium-card">
        <div class="kpi-icon-wrap bg-gradient-green"><i class="fas fa-dollar-sign"></i></div>
        <div class="kpi-info">
          <div class="kpi-label">DOANH THU GÓI</div>
          <div class="kpi-val">142.800.000 VNĐ</div>
          <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +12.5% vs tháng trước</div>
        </div>
      </div>
      <div class="kpi-card premium-card">
        <div class="kpi-icon-wrap bg-gradient-purple"><i class="fas fa-crown"></i></div>
        <div class="kpi-info">
          <div class="kpi-label">TỶ LỆ CHUYỂN ĐỔI VIP</div>
          <div class="kpi-val">24.8%</div>
          <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +3.2% vs tháng trước</div>
        </div>
      </div>
      <div class="kpi-card premium-card">
        <div class="kpi-icon-wrap bg-gradient-blue"><i class="fas fa-tags"></i></div>
        <div class="kpi-info">
          <div class="kpi-label">GIÁ TRỊ TB/GÓI (ARPU)</div>
          <div class="kpi-val">84.500 VNĐ</div>
          <div class="kpi-badge down"><i class="fas fa-caret-down"></i> -2.10 vs tháng trước</div>
        </div>
      </div>
      <div class="kpi-card premium-card">
        <div class="kpi-icon-wrap bg-gradient-orange"><i class="fas fa-user-check"></i></div>
        <div class="kpi-info">
          <div class="kpi-label">GÓI ĐANG HOẠT ĐỘNG</div>
          <div class="kpi-val">582 <span class="kpi-sub-val">(+43 Mới)</span></div>
          <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +18% vs quý trước</div>
        </div>
      </div>
    </div>

    <!-- Chart + AI panel -->
    <div class="body-grid">
      <div class="chart-area">
        <!-- Main Chart -->
        <div class="chart-card premium-card main-chart-wrapper">
          <div class="chart-top">
            <strong class="chart-title"><i class="fas fa-chart-bar"></i> Doanh thu theo loại gói tập</strong>
            <div class="legend-inline">
              <span class="leg-item"><span class="leg-dot bg-green"></span> Cơ bản</span>
              <span class="leg-item"><span class="leg-dot bg-purple"></span> VIP</span>
              <span class="leg-item"><span class="leg-dot bg-indigo"></span> PT 1-kèm-1</span>
            </div>
          </div>
          <div class="chart-container">
            <svg viewBox="0 0 440 160" class="bar-svg" preserveAspectRatio="none">
              <!-- Grid lines -->
              <line v-for="y in [20,60,100,140]" :key="'grid'+y" x1="0" :y1="y" x2="440" :y2="y" stroke="#f1f5f9" stroke-width="1"/>
              
              <!-- Data groups -->
              <g v-for="(d,i) in barData" :key="'bar'+i" class="bar-group">
                <!-- Hover bg -->
                <rect class="bar-hover-bg" :x="i*88" y="0" width="80" height="140" fill="rgba(0,0,0,0.0)" rx="8"/>
                <!-- Bars -->
                <rect class="bar-rect" :x="i*88 + 12" :y="140-d.a" width="16" :height="d.a" fill="url(#grad-green)" rx="3"/>
                <rect class="bar-rect" :x="i*88 + 32" :y="140-d.b" width="16" :height="d.b" fill="url(#grad-purple)" rx="3"/>
                <rect class="bar-rect" :x="i*88 + 52" :y="140-d.c" width="16" :height="d.c" fill="url(#grad-indigo)" rx="3"/>
                <text :x="i*88 + 40" y="156" text-anchor="middle" font-size="10" font-weight="600" fill="#64748b">T{{ i+1 }}</text>
              </g>

              <!-- Defs for gradients -->
              <defs>
                <linearGradient id="grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#34d399" />
                  <stop offset="100%" stop-color="#059669" />
                </linearGradient>
                <linearGradient id="grad-purple" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#a78bfa" />
                  <stop offset="100%" stop-color="#7c3aed" />
                </linearGradient>
                <linearGradient id="grad-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#818cf8" />
                  <stop offset="100%" stop-color="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <!-- Bottom 2 cards -->
        <div class="bottom2">
          <!-- Donut Chart -->
          <div class="donut2-card premium-card">
            <div class="d2-title"><i class="fas fa-chart-pie"></i> Cơ cấu đăng ký gói</div>
            <div class="d2-body">
              <div class="donut-wrapper">
                <svg viewBox="0 0 100 100" class="donut2-svg">
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#f1f5f9" stroke-width="12"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#10b981" stroke-width="12" stroke-dasharray="135.7 226.2" stroke-dashoffset="0" class="donut-segment"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#8b5cf6" stroke-width="12" stroke-dasharray="70.1 226.2" stroke-dashoffset="-135.7" class="donut-segment"/>
                  <circle cx="50" cy="50" r="36" fill="none" stroke="#6366f1" stroke-width="12" stroke-dasharray="38.5 226.2" stroke-dashoffset="-205.8" class="donut-segment"/>
                </svg>
                <div class="donut-center-text">
                  <span class="donut-val">100%</span>
                  <span class="donut-lbl">QUY MÔ</span>
                </div>
              </div>
              <div class="d2-legend">
                <div class="leg-row"><span class="leg-dot bg-green"></span> <span>Cơ bản</span> <strong class="ms-auto">52%</strong></div>
                <div class="leg-row"><span class="leg-dot bg-purple"></span> <span>VIP</span> <strong class="ms-auto">31%</strong></div>
                <div class="leg-row"><span class="leg-dot bg-indigo"></span> <span>PT</span> <strong class="ms-auto">17%</strong></div>
              </div>
            </div>
          </div>

          <!-- Impact Card -->
          <div class="impact-card premium-card glow-green">
            <div class="impact-icon"><i class="fas fa-bolt"></i></div>
            <div class="impact-content">
              <div class="impact-title">Tác động duy trì</div>
              <p class="impact-body">Người dùng gói <strong class="text-purple">VIP</strong> có tỷ lệ gia hạn cao hơn <strong class="text-green-light">42%</strong> so với gói Cơ bản trong quý này.</p>
              <a href="#" class="impact-link">Xem chi tiết hành vi <i class="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Unified Card -->
      <div class="ai-side-panel">
        <div class="ai-card-unified premium-card ai-glow">
          <div class="ai-card-header-unified">
            <div class="ai-avatar-unified">
              <i class="fas fa-brain"></i>
            </div>
            <div class="ai-title-unified">
              <strong v-if="aiReport">{{ aiReport.title || 'Phân tích từ SmartGym AI' }}</strong>
              <strong v-else>Phân tích từ SmartGym AI</strong>
            </div>
          </div>
          
          <button class="btn-generate-ai-unified" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
            <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
            <span>{{ isAiLoading ? 'AI Đang phân tích...' : 'Cập nhật phân tích AI' }}</span>
          </button>

          <div class="ai-content-scroll" v-if="aiReport">
            <div class="ai-rec-diagnosis-unified">
              <i class="fas fa-quote-left quote-icon"></i>
              {{ aiReport.ai_diagnosis }}
            </div>
            <div class="ai-suggestions-unified" v-if="aiReport.ai_suggestions">
              <div class="suggestion-hd"><i class="fas fa-bullseye"></i> CHIẾN LƯỢC ĐỀ XUẤT</div>
              <div class="suggestion-item-unified" v-for="(tip, i) in parsedTips" :key="i">
                <i class="fas fa-check-circle"></i>
                <span>{{ tip }}</span>
              </div>
            </div>
          </div>
          <div v-else class="ai-empty-unified">
            <div class="empty-icon"><i class="fas fa-robot"></i></div>
            <p>Chưa có dữ liệu phân tích. Nhấn <strong>"Cập nhật phân tích AI"</strong> để kích hoạt AI Engine đánh giá hiệu quả gói tập.</p>
          </div>

          <div class="coso-card">
            <div class="coso-icon"><i class="fas fa-building"></i></div>
            <div class="coso-info">
              <div class="coso-label">Cơ sở tiêu biểu</div>
              <div class="coso-val">Chi nhánh Quận 1</div>
            </div>
            <span class="coso-badge"><i class="fas fa-arrow-up"></i> 24%</span>
          </div>
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
  computed: {
    parsedTips() {
      if (!this.aiReport || !this.aiReport.ai_suggestions) return [];
      return this.aiReport.ai_suggestions
        .split('\n')
        .map(t => t.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.tab-content.kinetic-light {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Inter', sans-serif;
  background-color: transparent;
  color: #1e293b;
  min-height: calc(100vh - 100px);
}

/* Premium Light Card Base */
.premium-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.premium-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* Headers & Actions */
.section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}
.head-left { display: flex; flex-direction: column; gap: 4px; }
.section-title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.badge-premium {
  font-size: 0.65rem;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  color: #fff;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}
.section-sub {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
}
.head-actions {
  display: flex;
  gap: 12px;
}
.btn-outline-glow {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.btn-outline-glow:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #1e293b;
}
.btn-primary-glow {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
}
.btn-primary-glow:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

/* KPIs */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .kpi-row { grid-template-columns: 1fr; }
}
.kpi-card {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.kpi-icon-wrap {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.4rem;
  color: #fff;
  flex-shrink: 0;
}
.bg-gradient-green { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
.bg-gradient-purple { background: linear-gradient(135deg, #a855f7, #7c3aed); box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25); }
.bg-gradient-blue { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); }
.bg-gradient-orange { background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25); }

.kpi-info { display: flex; flex-direction: column; gap: 4px; }
.kpi-label { font-size: 0.7rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }
.kpi-val { font-size: 1.4rem; font-weight: 800; color: #0f172a; }
.kpi-sub-val { font-size: 0.8rem; font-weight: 600; color: #64748b; }
.kpi-badge { font-size: 0.7rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }
.kpi-badge.up { color: #10b981; }
.kpi-badge.down { color: #ef4444; }

/* Main Content Grid */
.body-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
}
@media (max-width: 1100px) {
  .body-grid { grid-template-columns: 1fr; }
}

.chart-area {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Bar Chart Card */
.main-chart-wrapper {
  padding: 24px;
}
.chart-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}
.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  display: flex; align-items: center; gap: 8px;
}
.chart-title i { color: #6366f1; }
.legend-inline {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.8rem;
  color: #475569;
  font-weight: 600;
}
.leg-item { display: flex; align-items: center; gap: 6px; }
.leg-dot { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.bg-green { background: #10b981; box-shadow: 0 2px 6px rgba(16,185,129,0.3); }
.bg-purple { background: #8b5cf6; box-shadow: 0 2px 6px rgba(139,92,246,0.3); }
.bg-indigo { background: #6366f1; box-shadow: 0 2px 6px rgba(99,102,241,0.3); }

.chart-container {
  width: 100%;
  height: 200px;
}
.bar-svg { width: 100%; height: 100%; display: block; overflow: visible; }
.bar-group { cursor: pointer; }
.bar-group:hover .bar-hover-bg { fill: rgba(0,0,0,0.02); }
.bar-rect { transition: height 0.3s ease, y 0.3s ease; }
.bar-group:hover .bar-rect { filter: brightness(1.1); }

/* Bottom 2 Cards (Donut + Impact) */
.bottom2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
@media (max-width: 768px) {
  .bottom2 { grid-template-columns: 1fr; }
}

/* Donut Card */
.donut2-card { padding: 20px; }
.d2-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.d2-title i { color: #10b981; }
.d2-body {
  display: flex;
  align-items: center;
  gap: 24px;
}
.donut-wrapper {
  position: relative;
  width: 100px; height: 100px;
  flex-shrink: 0;
}
.donut2-svg {
  width: 100%; height: 100%;
  transform: rotate(-90deg);
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.05));
}
.donut-segment { transition: stroke-dasharray 0.5s ease; cursor: pointer; }
.donut-segment:hover { stroke-width: 14; filter: brightness(1.1); }
.donut-center-text {
  position: absolute;
  inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.donut-val { font-size: 1rem; font-weight: 800; color: #0f172a; }
.donut-lbl { font-size: 0.55rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px; }

.d2-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.leg-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #334155;
  font-weight: 500;
}
.ms-auto { margin-left: auto; color: #0f172a; font-weight: 700; }

/* Impact Card */
.impact-card {
  padding: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
}
.impact-card::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(circle at top right, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  pointer-events: none;
}
.impact-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: #ffffff;
  color: #059669;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 12px;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.15);
}
.impact-title { font-size: 1rem; font-weight: 800; color: #065f46; margin-bottom: 8px; }
.impact-body { font-size: 0.85rem; line-height: 1.6; color: #064e3b; margin: 0 0 16px; font-weight: 500; }
.text-purple { color: #7c3aed; font-weight: 800; }
.text-green-light { color: #059669; font-weight: 800; }
.impact-link {
  font-size: 0.8rem; font-weight: 700; color: #059669;
  text-decoration: none; display: flex; align-items: center; gap: 6px;
  transition: gap 0.2s;
}
.impact-link:hover { gap: 10px; color: #047857; }

/* AI Unified Card */
.ai-side-panel {
  display: flex;
  flex-direction: column;
}
.ai-card-unified {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  background: #ffffff;
}
.ai-glow {
  position: relative;
  overflow: hidden;
}
.ai-glow::before {
  content: ''; position: absolute; top: -50px; left: -50px; width: 150px; height: 150px;
  background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.ai-card-header-unified {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ai-avatar-unified {
  width: 48px; height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
  position: relative;
}
.ai-avatar-unified::after {
  content: ''; position: absolute; inset: -4px; border-radius: 16px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.ai-title-unified {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.3;
}

.btn-generate-ai-unified {
  background: #f1f5f9 !important;
  border: 1px solid #e2e8f0 !important;
  color: #4f46e5 !important;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: all 0.3s ease;
  width: 100%;
}
.btn-generate-ai-unified:hover:not(:disabled) {
  background: #4f46e5 !important;
  color: #fff !important;
  border-color: #4f46e5 !important;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}
.btn-generate-ai-unified:disabled {
  opacity: 0.7; cursor: not-allowed;
}

.ai-content-scroll {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.ai-rec-diagnosis-unified {
  font-size: 0.9rem;
  color: #334155;
  line-height: 1.6;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #6366f1;
  position: relative;
  font-weight: 500;
}
.quote-icon {
  position: absolute; top: -10px; left: 10px;
  background: #ffffff;
  color: #6366f1;
  padding: 0 4px;
  font-size: 0.8rem;
}

.ai-suggestions-unified {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.suggestion-hd {
  font-size: 0.7rem;
  font-weight: 800;
  color: #6366f1;
  letter-spacing: 0.5px;
  display: flex; align-items: center; gap: 6px;
}
.suggestion-item-unified {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  font-weight: 500;
}
.suggestion-item-unified i { color: #10b981; margin-top: 2px; font-size: 1rem; }

.ai-empty-unified {
  text-align: center;
  padding: 40px 20px;
  color: #64748b;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.empty-icon { font-size: 2rem; color: #94a3b8; }
.ai-empty-unified p { margin: 0; font-size: 0.85rem; line-height: 1.5; }

.coso-card {
  margin-top: auto;
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.coso-icon {
  width: 36px; height: 36px;
  border-radius: 8px;
  background: #ffffff;
  color: #10b981;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.1);
}
.coso-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.coso-label { font-size: 0.7rem; color: #64748b; font-weight: 600; }
.coso-val { font-size: 0.95rem; font-weight: 800; color: #065f46; }
.coso-badge {
  font-size: 0.75rem; font-weight: 800; color: #059669;
  background: #dcfce7; padding: 4px 8px; border-radius: 6px;
  display: flex; align-items: center; gap: 4px;
}
</style>

