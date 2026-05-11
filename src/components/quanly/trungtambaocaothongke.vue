<template>
  <div class="dashboard">

    <!-- ===== NAV TABS ===== -->
    <div class="nav-bar">
      <div class="nav-tabs-wrap">
        <button
          v-for="tab in navTabs"
          :key="tab.key"
          :class="['nav-tab', activeTab === tab.key ? 'active' : '']"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      <!-- <div class="nav-right">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm thông tin..." />
        </div>
        <button class="icon-btn"><i class="fas fa-bell"></i></button>
        <button class="icon-btn"><i class="fas fa-cog"></i></button>
      </div> -->
    </div>

    <!-- ===== KPI CARDS ===== -->
    <div class="kpi-row" v-if="showInlineDashboard">
      <div class="kpi-card" v-for="kpi in kpis" :key="kpi.label">
        <div class="kpi-card-inner">
          <div class="kpi-left">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
            <div class="kpi-meta">
              <span :class="['kpi-badge', kpi.trend > 0 ? 'up' : 'down']">
                <i :class="kpi.trend > 0 ? 'fas fa-caret-up' : 'fas fa-caret-down'"></i>
                {{ Math.abs(kpi.trend) }}%
              </span>
              <span v-if="kpi.tag" class="kpi-tag" :style="{ color: kpi.tagColor }">{{ kpi.tag }}</span>
            </div>
          </div>
          <div class="kpi-chart">
            <!-- Bar chart SVG -->
            <svg v-if="kpi.chartType === 'bar'" viewBox="0 0 56 36" preserveAspectRatio="none" class="kpi-svg">
              <rect
                v-for="(bar, i) in kpi.bars"
                :key="i"
                :x="i * 9"
                :y="36 - bar"
                width="6"
                :height="bar"
                :fill="kpi.barColor || '#2d7a3a'"
                rx="1.5"
                :opacity="i === kpi.bars.length - 1 ? 1 : 0.45"
              />
            </svg>
            <!-- Sparkline SVG -->
            <svg v-else viewBox="0 0 56 36" preserveAspectRatio="none" class="kpi-svg">
              <polyline :points="kpi.spark" fill="none" :stroke="kpi.barColor || '#2d7a3a'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <!-- ===== TAB CONTENT (non-tongquan tabs) ===== -->
    <transition name="tab-fade" mode="out-in">
      <component 
        :is="currentTabComponent" 
        :key="activeTab" 
        v-if="currentTabComponent" 
        :ai-report="aiReport"
        :is-ai-loading="isAiLoading"
        @generate-ai-report="generateAiReport"
      />
    </transition>

    <!-- ===== TỔNG QUAN INLINE ===== -->
    <div v-if="showInlineDashboard" class="inline-dashboard">
    <div class="ai-card-unified">
      <div class="ai-card-header-unified">
        <div class="ai-avatar-unified">
          <i class="fas fa-brain"></i>
        </div>
        <div class="ai-title-unified">
          <strong v-if="aiReport">{{ aiReport.title }}</strong>
          <strong v-else>Phân tích chiến lược từ SmartGym AI</strong>
        </div>
        <button class="btn-generate-ai-unified" @click="generateAiReport" :disabled="isAiLoading">
          <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
          {{ isAiLoading ? 'Đang phân tích...' : 'Tư vấn chiến lược AI' }}
        </button>
      </div>

      <div v-if="aiReport">
        <div class="ai-rec-diagnosis-unified">{{ aiReport.ai_diagnosis }}</div>
        <div class="ai-suggestions-unified" v-if="aiReport.ai_suggestions">
          <div class="suggestion-hd">ĐỀ XUẤT CHIẾN LƯỢC:</div>
          <div class="suggestion-item-unified" v-for="(tip, i) in aiReport.ai_suggestions.split('\n')" :key="i">
            <template v-if="tip.trim()">
              <i class="fas fa-check-circle"></i>
              <span>{{ tip.replace(/^- /, '').replace(/^\* /, '') }}</span>
            </template>
          </div>
        </div>
      </div>
      <div v-else class="ai-empty-unified">
        Chưa có báo cáo AI. Hãy nhấn nút "Tư vấn chiến lược AI" để Gemini phân tích dữ liệu vận hành tháng này.
      </div>

      <div class="ai-footer-unified">
        <button class="btn-ai-outline-unified"><i class="fas fa-file-export"></i> Xuất báo cáo chi tiết</button>
      </div>
    </div>

    <!-- ===== CHARTS ROW ===== -->
    <div class="charts-row">
      <!-- Revenue Line Chart -->
      <div class="chart-card big">
        <div class="chart-header">
          <div>
            <div class="chart-title">Doanh thu theo Ngày / Tháng</div>
            <div class="chart-sub">Biểu đồ đường – doanh thu (triệu VND)</div>
          </div>
          <div class="tab-group sm">
            <button :class="['tab-btn', chartMode === 'ngay' ? 'active' : '']" @click="chartMode = 'ngay'">Ngày</button>
            <button :class="['tab-btn', chartMode === 'thang' ? 'active' : '']" @click="chartMode = 'thang'">Tháng</button>
          </div>
        </div>
        <div class="linechart-wrap">
          <svg viewBox="0 0 500 160" preserveAspectRatio="none" class="linechart-svg">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#2d7a3a" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#2d7a3a" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line v-for="y in [20,60,100,140]" :key="y" x1="0" :y1="y" x2="500" :y2="y" stroke="#e2e8f0" stroke-width="1"/>
            <!-- Area fill -->
            <polygon :points="areaPoints" fill="url(#lineGrad)"/>
            <!-- Line -->
            <polyline :points="linePoints" fill="none" stroke="#2d7a3a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Dots -->
            <circle v-for="(pt, i) in chartDots" :key="i" :cx="pt.x" :cy="pt.y" r="4" fill="#fff" stroke="#2d7a3a" stroke-width="2"/>
          </svg>
          <div class="linechart-labels">
            <span v-for="l in chartLabels" :key="l">{{ l }}</span>
          </div>
        </div>
      </div>

      <!-- Check-in Heatmap -->
      <div class="chart-card small">
        <div class="chart-header">
          <div>
            <div class="chart-title">Lượt thích check-in theo không gian giờ</div>
          </div>
        </div>
        <div class="heatmap-wrap">
          <div class="heatmap-grid">
            <div v-for="(row, ri) in heatmap" :key="ri" class="heatmap-row">
              <div
                v-for="(val, ci) in row"
                :key="ci"
                class="heatmap-cell"
                :style="{ background: heatColor(val), opacity: 0.85 + val * 0.15 }"
                :title="`Giờ ${8 + ci}:00 — ${heatDays[ri]}: ${Math.round(val * 100)}%`"
              ></div>
            </div>
          </div>
          <div class="heatmap-x-labels">
            <span v-for="h in heatHours" :key="h">{{ h }}</span>
          </div>
          <div class="heatmap-legend">
            <span>Ít</span>
            <div class="legend-bar"></div>
            <span>Nhiều</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== BOTTOM ROW ===== -->
    <div class="bottom-row">
      <!-- Package breakdown -->
      <div class="pkg-card">
        <div class="pkg-title">Cơ cấu gói tập</div>
        <div class="pkg-sub">Số hội viên theo loại gói tập</div>
        <div class="pkg-list">
          <div class="pkg-item" v-for="pkg in packages" :key="pkg.name">
            <div class="pkg-dot" :style="{ background: pkg.color }"></div>
            <div class="pkg-info">
              <span class="pkg-name">{{ pkg.name }}</span>
              <div class="pkg-bar-wrap">
                <div class="pkg-bar" :style="{ width: pkg.pct + '%', background: pkg.color }"></div>
              </div>
            </div>
            <div class="pkg-pct">{{ pkg.pct }}%</div>
          </div>
        </div>
      </div>

      <!-- AI Insight highlight -->
      <div class="insight-card">
        <div class="insight-top">
          <i class="fas fa-lightbulb insight-ic"></i>
          <span class="insight-tag">AI Insight</span>
        </div>
        <div class="insight-value">1.28B</div>
        <div class="insight-label">Dự báo doanh thu tháng tới (VND)</div>
        <p class="insight-note">
          AI phân tích xu hướng 6 tháng gần đây. Tháng 4/2025 dự kiến tăng trưởng <strong>+9%</strong> so với tháng hiện tại, chủ yếu từ gói PT và hội viên mới đăng ký trong chiến dịch mùa hè.
        </p>
        <div class="insight-badge"><i class="fas fa-check-circle"></i> Độ tin cậy: 87%</div>
      </div>
    </div>
    </div><!-- end v-if showInlineDashboard -->

  </div>
</template>

<script>
import TabGiuChan            from './baocao/tab_giuchan.vue'
import TabGoiTap             from './baocao/tab_goitap.vue'
import TabKhuyenMai          from './baocao/tab_khuyenmai.vue'
import TabKhuyenMaiPhanTich  from './baocao/tab_khuyenmai_phantich.vue'
import TabPhanHoi            from './baocao/tab_phanhoi.vue'
import TabBaoCao             from './baocao/tab_baocao.vue'
import TabAI                 from './baocao/tab_ai.vue'
import axios from 'axios';

export default {
  name: 'AdminDashboard',
  components: { TabGiuChan, TabGoiTap, TabKhuyenMai, TabKhuyenMaiPhanTich, TabPhanHoi, TabBaoCao, TabAI },
  data() {
    return {
      aiReport: null,
      isAiLoading: false,
      activeTab: 'tongquan',
      chartMode: 'thang',
      navTabs: [
        { key: 'tongquan',    label: 'Tổng quan' },
        { key: 'giuchan',     label: 'Tỷ lệ giữ chân khách hàng' },
        { key: 'goitap',      label: 'Phân tích hiệu quả gói tập' },
        { key: 'khuyenmai',   label: 'Phân tích hiệu quả khuyến mãi' },
        { key: 'phanhoi',     label: 'Phân tích phản hồi khách hàng' },
        { key: 'baocao',      label: 'Báo cáo' },
        { key: 'ai',          label: '🤖 SmartGym AI' },
      ],
      kpis: [
        {
          label: 'Tổng doanh thu',
          value: '1.284.000.000đ',
          trend: 12.5,
          chartType: 'bar',
          barColor: '#2d7a3a',
          bars: [18, 22, 14, 28, 20, 26, 32],
        },
        {
          label: 'Lượt check-in',
          value: '8,432',
          trend: -2.1,
          chartType: 'bar',
          barColor: '#7c3aed',
          bars: [30, 20, 28, 16, 24, 18, 22],
        },
        {
          label: 'Tỷ lệ gia hạn',
          value: '78.4%',
          trend: 4.2,
          chartType: 'bar',
          barColor: '#2d7a3a',
          bars: [14, 20, 18, 24, 16, 28, 30],
        },
        {
          label: 'Chỉ số CSAT',
          value: '4.8/5',
          trend: 0,
          tag: '✦ High Perf.',
          tagColor: '#16a34a',
          chartType: 'line',
          barColor: '#16a34a',
          spark: '0,28 9,24 18,26 27,18 36,20 45,14 56,10',
        },
      ],
      chartLabels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
      chartRawY: [120, 98, 140, 110, 155, 90, 135, 148, 120, 160],
      heatDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      heatHours: ['8h', '10h', '12h', '14h', '16h', '18h', '20h'],
      heatmap: [
        [0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 0.6],
        [0.3, 0.4, 0.5, 0.6, 0.8, 1.0, 0.7],
        [0.2, 0.3, 0.4, 0.5, 0.7, 0.9, 0.6],
        [0.4, 0.5, 0.6, 0.7, 0.9, 1.0, 0.8],
        [0.5, 0.6, 0.7, 0.8, 1.0, 1.0, 0.9],
        [0.6, 0.7, 0.5, 0.4, 0.6, 0.8, 0.7],
        [0.3, 0.2, 0.3, 0.3, 0.4, 0.6, 0.5],
      ],
      packages: [
        { name: 'Gói cơ bản (Standard)', pct: 48, color: '#2d7a3a' },
        { name: 'Gói PT (Personal Trainer)', pct: 29, color: '#6366f1' },
        { name: 'Gói Nâng cao (Basic+)', pct: 15, color: '#0ea5e9' },
        { name: 'Gói khác', pct: 8, color: '#f59e0b' },
      ],
    }
  },
  watch: {
    activeTab() {
      this.fetchLatestAiReport();
    }
  },
  computed: {
    currentTabComponent() {
      const map = {
        tongquan:   null,                      // rendered inline (KPI + AI + Charts)
        giuchan:    'TabGiuChan',
        goitap:     'TabGoiTap',
        khuyenmai:  'TabKhuyenMaiPhanTich',
        phanhoi:    'TabPhanHoi',
        baocao:     'TabBaoCao',
        ai:         'TabAI',
      }
      return map[this.activeTab] || null
    },
    showInlineDashboard() {
      return this.activeTab === 'tongquan'
    },
    chartDots() {
      const n = this.chartRawY.length
      return this.chartRawY.map((v, i) => ({
        x: (i / (n - 1)) * 500,
        y: 160 - ((v - 80) / 90) * 140,
      }))
    },
    linePoints() {
      return this.chartDots.map(p => `${p.x},${p.y}`).join(' ')
    },
    areaPoints() {
      const pts = this.chartDots.map(p => `${p.x},${p.y}`).join(' ')
      return `0,160 ${pts} 500,160`
    },
  },
  mounted() {
    this.fetchLatestAiReport();
  },
  methods: {
    async fetchLatestAiReport() {
      try {
        const typeMap = {
          tongquan: 'Manager Overview',
          giuchan: 'Retention Analysis',
          goitap: 'Plan Effectiveness',
          khuyenmai: 'Promotion Effectiveness',
          phanhoi: 'Feedback Analysis',
          baocao: 'General Report'
        };
        // Fallback for old types
        const oldTypeMap = {
          tongquan: 'Business Report',
          giuchan: 'Retention Analysis',
          goitap: 'Subscription Analysis',
          khuyenmai: 'Promotion Analysis',
          phanhoi: 'Feedback Analysis',
          baocao: 'Equipment Analysis'
        };
        const currentType = typeMap[this.activeTab] || 'Manager Overview';
        const oldType = oldTypeMap[this.activeTab] || 'Business Report';

        const token = localStorage.getItem('token');
        let res = await axios.get('http://127.0.0.1:8000/api/ai-recommendations', {
          params: { type: currentType, per_page: 1 },
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Reset if no report found for this tab
        this.aiReport = null;

        if (res.data && res.data.data && res.data.data.length > 0) {
          this.aiReport = res.data.data[0];
        } else {
          // Thử tìm theo type cũ
          res = await axios.get('http://127.0.0.1:8000/api/ai-recommendations', {
            params: { type: oldType, per_page: 1 },
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data && res.data.data && res.data.data.length > 0) {
            this.aiReport = res.data.data[0];
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy báo cáo AI', error);
      }
    },
    async generateAiReport() {
      this.isAiLoading = true;
      try {
        const endpointMap = {
          tongquan: 'manager/overview',
          giuchan: 'manager/retention-analysis',
          goitap: 'manager/plan-effectiveness',
          khuyenmai: 'manager/promotion-effectiveness',
          phanhoi: 'manager/feedback-analysis',
          baocao: 'manager/general-report'
        };
        const endpoint = endpointMap[this.activeTab] || 'manager/overview';

        const token = localStorage.getItem('token');
        const res = await axios.post(`http://127.0.0.1:8000/api/${endpoint}`, 
          {}, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.data && res.data.data) {
          this.aiReport = res.data.data;
          alert(`Đã tạo phân tích bằng AI thành công!`);
        }
      } catch (error) {
        console.error('Lỗi khi tạo báo cáo AI', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi tạo báo cáo AI');
      } finally {
        this.isAiLoading = false;
      }
    },
    heatColor(val) {
      // Light to dark green gradient
      const r = Math.round(255 - val * (255 - 20))
      const g = Math.round(255 - val * (255 - 100))
      const b = Math.round(255 - val * (255 - 60))
      return `rgb(${r},${g},${b})`
    },
  },
}

</script>

<style scoped>
/* ============================
   ROOT
   ============================ */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
}

.inline-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ============================
   NAV BAR
   ============================ */
.nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 0;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;
}
.nav-tabs-wrap {
  display: flex;
  align-items: flex-end;
  gap: 0;
  flex-wrap: wrap;
}
.nav-tab {
  padding: 10px 16px;
  border: none;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2.5px solid transparent;
  margin-bottom: -2px;
  transition: color 0.18s, border-color 0.18s;
  white-space: nowrap;
}
.nav-tab:hover { color: #1e293b; }
.nav-tab.active {
  color: #2d7a3a;
  font-weight: 700;
  border-bottom-color: #2d7a3a;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
}
.search-box {
  display: flex;
  align-items: center;
  gap: 7px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.8rem;
  color: #94a3b8;
}
.search-box i { font-size: 0.78rem; }
.search-box input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.8rem;
  color: #475569;
  width: 160px;
}
.search-box input::placeholder { color: #94a3b8; }
.icon-btn {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 0.82rem;
  transition: background 0.15s;
}
.icon-btn:hover { background: #f1f5f9; }

/* ===== Chart tab-group inside chart cards ===== */
.tab-group {
  display: flex;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}
.tab-group.sm .tab-btn {
  padding: 4px 10px;
  font-size: 0.75rem;
}
.tab-btn {
  padding: 5px 13px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.18s;
}
.tab-btn.active {
  background: #fff;
  color: #2d7a3a;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* ============================
   KPI CARDS
   ============================ */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  position: relative;
  overflow: hidden;
}
.kpi-card-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
}
.kpi-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.kpi-label {
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.kpi-value {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
  line-height: 1.2;
  white-space: nowrap;
}
.kpi-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  flex-wrap: wrap;
}
.kpi-badge {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 20px;
}
.kpi-badge.up   { background: #dcfce7; color: #16a34a; }
.kpi-badge.down { background: #fee2e2; color: #dc2626; }
.kpi-tag {
  font-size: 0.7rem;
  font-weight: 600;
}
.kpi-chart {
  flex-shrink: 0;
  width: 56px;
  height: 36px;
}
.kpi-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ============================
   AI SECTION
   ============================ */
.ai-section {
  background: linear-gradient(120deg, #f0fdf4 60%, #e0f2fe 100%);
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.ai-text-block { flex: 1; }
.ai-section-title {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 10px;
  font-size: 0.95rem;
  color: #1e293b;
}
.ai-icon-hd {
  width: 30px; height: 30px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.ai-body {
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.65;
  margin: 0 0 14px;
}
.ai-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.btn-ai-primary {
  display: inline-flex; align-items: center; gap: 7px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none; border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem; font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-ai-primary:hover { opacity: 0.88; }
.btn-ai-outline {
  display: inline-flex; align-items: center; gap: 7px;
  background: #fff;
  color: #2d7a3a;
  border: 1.5px solid #2d7a3a; border-radius: 8px;
  padding: 8px 16px;
  font-size: 0.82rem; font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-ai-outline:hover { background: #f0fdf4; }
.ai-icon-right { flex-shrink: 0; }
.ai-glow-circle {
  width: 70px; height: 70px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
  color: #fff;
  box-shadow: 0 0 28px rgba(99,102,241,0.35);
  animation: glow-pulse 2.5s ease-in-out infinite;
}
@keyframes glow-pulse {
  0%, 100% { box-shadow: 0 0 22px rgba(99,102,241,0.3); }
  50%       { box-shadow: 0 0 38px rgba(99,102,241,0.55); }
}

/* ============================
   CHARTS ROW
   ============================ */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 14px;
}
.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 10px;
  flex-wrap: wrap;
}
.chart-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
}
.chart-sub {
  font-size: 0.72rem;
  color: #94a3b8;
  margin-top: 2px;
}
.linechart-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.linechart-svg {
  width: 100%;
  height: 160px;
  display: block;
}
.linechart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #94a3b8;
  padding: 0 2px;
}

/* ============================
   HEATMAP
   ============================ */
.heatmap-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.heatmap-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.heatmap-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}
.heatmap-cell {
  height: 22px;
  border-radius: 4px;
  transition: transform 0.15s;
  cursor: pointer;
}
.heatmap-cell:hover { transform: scale(1.15); }
.heatmap-x-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  font-size: 0.65rem;
  color: #94a3b8;
  text-align: center;
}
.heatmap-legend {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.68rem;
  color: #94a3b8;
  margin-top: 4px;
}
.legend-bar {
  flex: 1;
  height: 7px;
  border-radius: 4px;
  background: linear-gradient(90deg, #d1fae5, #166534);
}

/* ============================
   BOTTOM ROW
   ============================ */
.bottom-row {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 14px;
}
.pkg-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
}
.pkg-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #1e293b;
}
.pkg-sub {
  font-size: 0.73rem;
  color: #94a3b8;
  margin-bottom: 16px;
}
.pkg-list { display: flex; flex-direction: column; gap: 14px; }
.pkg-item {
  display: flex;
  align-items: center;
  gap: 11px;
}
.pkg-dot {
  width: 11px; height: 11px;
  border-radius: 50%;
  flex-shrink: 0;
}
.pkg-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.pkg-name {
  font-size: 0.8rem;
  color: #475569;
  font-weight: 500;
}
.pkg-bar-wrap {
  background: #f1f5f9;
  border-radius: 20px;
  height: 7px;
  overflow: hidden;
}
.pkg-bar {
  height: 100%;
  border-radius: 20px;
  transition: width 0.5s ease;
}
.pkg-pct {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e293b;
  min-width: 34px;
  text-align: right;
}

/* ============================
   INSIGHT CARD
   ============================ */
.insight-card {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 14px;
  padding: 22px;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.18);
}
.insight-top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.insight-ic {
  color: #fbbf24;
  font-size: 1rem;
}
.insight-tag {
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(99,102,241,0.3);
  color: #a5b4fc;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.4px;
}
.insight-value {
  font-size: 2.2rem;
  font-weight: 800;
  color: #4ade80;
  letter-spacing: -1px;
  line-height: 1.1;
}
.insight-label {
  font-size: 0.75rem;
  color: #94a3b8;
}
.insight-note {
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 4px 0 0;
}
.insight-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  font-size: 0.75rem;
  color: #4ade80;
  font-weight: 600;
}

/* AI Unified Card Style - KINETIC DARK VERSION */
.ai-card-unified {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 28px;
  padding: 32px;
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.2),
    0 4px 15px rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  color: #fff;
}

.ai-card-unified::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
  pointer-events: none;
}

.ai-card-header-unified {
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 1;
}

.ai-avatar-unified {
  width: 56px; height: 56px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1.5rem;
  flex-shrink: 0;
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.ai-title-unified {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ai-title-unified strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.ai-title-unified::after {
  content: 'SỨC MẠNH TỪ GEMINI AI';
  font-size: 0.65rem;
  font-weight: 900;
  color: #818cf8;
  letter-spacing: 0.2em;
  margin-top: 4px;
}

.btn-generate-ai-unified {
  background: linear-gradient(90deg, #4f46e5, #7c3aed) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 14px;
  padding: 12px 24px;
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  display: flex; align-items: center; gap: 10px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
  outline: none !important;
}

.btn-generate-ai-unified:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 12px 25px rgba(99, 102, 241, 0.5);
}

.btn-generate-ai-unified:active { transform: scale(0.98); }

.ai-rec-diagnosis-unified {
  font-size: 1rem;
  color: #e2e8f0;
  line-height: 1.8;
  background: rgba(255, 255, 255, 0.05);
  padding: 24px 28px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
  backdrop-filter: blur(5px);
  z-index: 1;
}

.ai-suggestions-unified {
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 1;
}

.suggestion-hd {
  font-size: 0.75rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 0.15em;
  margin-bottom: 8px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}

.suggestion-hd::after {
  content: '';
  height: 1px;
  flex: 1;
  background: rgba(255,255,255,0.1);
}

.suggestion-item-unified {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  font-size: 0.92rem;
  color: #cbd5e1;
  line-height: 1.6;
  padding: 12px 16px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.suggestion-item-unified:hover {
  background: rgba(99, 102, 241, 0.1);
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateX(6px);
  color: #fff;
}

.suggestion-item-unified i {
  color: #4ade80;
  margin-top: 4px;
  font-size: 1.1rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 5px rgba(74, 222, 128, 0.5));
}

.ai-empty-unified {
  text-align: center;
  padding: 50px 30px;
  color: #94a3b8;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 24px;
  border: 2px dashed rgba(255, 255, 255, 0.1);
}

.ai-footer-unified {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  z-index: 1;
}

.btn-ai-outline-unified {
  background: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #e2e8f0 !important;
  border-radius: 12px;
  padding: 10px 22px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  outline: none !important;
}

.btn-ai-outline-unified:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
}

.inline-dashboard { display:flex; flex-direction:column; gap:20px; }

/* ============================
   RESPONSIVE
   ============================ */
@media (max-width: 900px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .charts-row, .bottom-row { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .kpi-row { grid-template-columns: 1fr; }
}

/* ============================
   TAB TRANSITION
   ============================ */
.tab-fade-enter-active, .tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
