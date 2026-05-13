<template>
  <div class="tab-content kinetic-light">

    <!-- Section heading -->
    <div class="section-head">
      <div class="head-left">
        <h2 class="section-title">HIỆU QUẢ GÓI TẬP (PHÂN TÍCH CHUYÊN SÂU)</h2>
        <p class="section-sub">Hiệu quả khai thác các gói sản phẩm tập luyện</p>
      </div>
      <div class="head-actions">
        <button class="btn-pdf" @click="exportPDF">Xuất PDF</button>
        <button class="btn-deep-analyze" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
          <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
          {{ isAiLoading ? 'Đang phân tích...' : 'Phân tích AI' }}
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" style="text-align:center; padding:40px; color:#94a3b8;">
      <i class="fas fa-spinner fa-spin fa-2x"></i>
      <p style="margin-top:10px;">Đang tải dữ liệu gói tập...</p>
    </div>

    <template v-else>
      <!-- KPI row: 5 Cards, from real data -->
      <div class="kpi-row-v2">
        <div class="kpi-card-v2">
          <div class="kpi-label">TỔNG DOANH THU GÓI</div>
          <div class="kpi-val-wrap">
            <span class="kpi-val">{{ formatCurrency(totalRevenue) }}</span>
            <span class="kpi-badge up">Ước tính</span>
          </div>
          <div class="kpi-bar bg-green"></div>
        </div>

        <div class="kpi-card-v2">
          <div class="kpi-label">TỔNG GÓI ĐANG ACTIVE</div>
          <div class="kpi-val-wrap">
            <span class="kpi-val">{{ totalActiveSubs }}</span>
            <span class="kpi-badge up">Đang chạy</span>
          </div>
          <div class="kpi-bar bg-green-light"></div>
        </div>

        <div class="kpi-card-v2">
          <div class="kpi-label">GIÁ TB MỖI GÓI (ARPU)</div>
          <div class="kpi-val-wrap">
            <span class="kpi-val">{{ formatCurrency(avgPrice) }}</span>
          </div>
          <div class="kpi-bar bg-purple-light"></div>
        </div>

        <div class="kpi-card-v2">
          <div class="kpi-label">LOẠI GÓI BÁN CHẠY NHẤT</div>
          <div class="kpi-val-wrap">
            <span class="kpi-val" style="font-size:1rem;">{{ bestPlanName }}</span>
          </div>
          <div class="kpi-bar bg-green"></div>
        </div>

        <div class="kpi-card-v2">
          <div class="kpi-label">TỔNG GÓI TRONG HỆ THỐNG</div>
          <div class="kpi-val-wrap">
            <span class="kpi-val">{{ plans.length }}</span>
            <span class="kpi-badge neutral">Gói</span>
          </div>
          <div class="kpi-bar bg-grey"></div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="body-grid-v2">
        <div class="chart-area-v2">
          <!-- Plans Table -->
          <div class="chart-card-v2">
            <div class="chart-header">
              <h5 class="chart-title-v2">Doanh thu ước tính theo từng gói tập</h5>
            </div>
            <div v-if="plans.length > 0">
              <div v-for="plan in plans" :key="plan.name" style="margin-bottom: 14px;">
                <div style="display:flex; justify-content:space-between; font-size:0.8rem; margin-bottom:4px;">
                  <span style="font-weight:600; color:#1e293b;">{{ plan.name }}</span>
                  <span style="color:#2d7a3a; font-weight:700;">{{ formatCurrency(plan.revenue_est) }}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <div style="flex:1; background:#f1f5f9; border-radius:8px; height:8px; overflow:hidden;">
                    <div :style="{
                      width: totalRevenue > 0 ? (plan.revenue_est / totalRevenue * 100) + '%' : '0%',
                      background: 'linear-gradient(90deg, #2d7a3a, #4ade80)',
                      height: '100%',
                      borderRadius: '8px',
                      transition: 'width 0.6s ease'
                    }"></div>
                  </div>
                  <span style="font-size:0.72rem; color:#64748b; min-width:36px; text-align:right;">
                    {{ plan.total_subs }} đăng ký
                  </span>
                </div>
                <div style="font-size:0.7rem; color:#94a3b8; margin-top:2px;">
                  Active: {{ plan.active_subs }} | Giá: {{ formatCurrency(plan.price) }}
                </div>
              </div>
            </div>
            <div v-else style="text-align:center; padding:30px; color:#94a3b8;">
              <i class="fas fa-box-open fa-2x" style="margin-bottom:8px;"></i>
              <p>Chưa có dữ liệu gói tập</p>
            </div>
          </div>

          <div class="bottom-row-v2">
            <div class="donut-card-v2">
              <h6 class="card-subtitle">Tỷ lệ đăng ký theo gói</h6>
              <div class="donut-flex">
                <div class="donut-stats">
                  <div class="stat-line" v-for="(plan, i) in plans.slice(0,3)" :key="plan.name">
                    <span class="dot" :style="{background: planColors[i % planColors.length]}"></span>
                    {{ plan.name }}: {{ totalActiveSubs > 0 ? Math.round(plan.active_subs / totalActiveSubs * 100) : 0 }}%
                  </div>
                  <div class="stat-line" v-if="plans.length > 3">
                    <span class="dot bg-grey"></span>
                    Gói khác: {{ totalActiveSubs > 0 ? Math.round(otherSubs / totalActiveSubs * 100) : 0 }}%
                  </div>
                </div>
                <div class="donut-viz">
                  <div class="donut-center">
                    <div class="val">{{ totalActiveSubs }}</div>
                    <div class="lbl">ACTIVE</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="impact-card-v2">
              <h5 class="impact-title-v2">Tác động duy trì</h5>
              <p class="impact-text-v2" v-if="aiReport && aiReport.ai_diagnosis">
                {{ aiReport.ai_diagnosis.substring(0, 150) }}...
              </p>
              <p class="impact-text-v2" v-else>
                Gói {{ bestPlanName }} có lượng đăng ký cao nhất. Nhấn "Phân tích AI" để nhận chiến lược tối ưu chi tiết.
              </p>
            </div>
          </div>
        </div>

        <!-- AI Sidebar -->
        <div class="ai-sidebar-v2">
          <div class="ai-panel-inner">
            <div class="ai-header-v2">
              <span class="ai-dot"></span> BẢNG PHÂN TÍCH SÂU TỪ AI
            </div>

            <div v-if="aiReport">
              <div class="ai-insight-card" style="margin-bottom:12px;">
                <div class="insight-icon"><i class="fas fa-robot"></i></div>
                <div class="insight-body">
                  <strong>{{ aiReport.title }}</strong>
                  <p>Phân tích thực từ dữ liệu hệ thống</p>
                </div>
              </div>

              <div class="ai-narrative">{{ aiReport.ai_diagnosis }}</div>

              <div class="ai-strategy-section" v-if="aiReport.ai_suggestions" style="margin-top:14px;">
                <div class="strategy-label"><i class="fas fa-crosshairs"></i> CHIẾN LƯỢC ĐỀ XUẤT</div>
                <div class="strategy-item" v-for="(tip, i) in parsedTips" :key="i">
                  <div class="item-main">
                    <p>{{ tip }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="ai-insight-card">
                <div class="insight-icon"><i class="fas fa-sparkles"></i></div>
                <div class="insight-body">
                  <strong>Gói {{ bestPlanName }}: Bán chạy nhất</strong>
                  <p>{{ totalActiveSubs }} hội viên đang active</p>
                </div>
              </div>

              <div class="ai-narrative">
                Hệ thống có {{ plans.length }} gói tập với tổng doanh thu ước tính {{ formatCurrency(totalRevenue) }}. 
                Nhấn nút "Phân tích AI" để nhận chiến lược tối ưu hóa danh mục gói tập.
              </div>

              <div class="ai-prediction">
                "Nhấn 'Phân tích AI' để AI phân tích sâu hiệu quả từng gói và đề xuất chiến lược tối ưu doanh thu."
              </div>
            </div>

            <button class="btn-ai-action" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
              {{ isAiLoading ? 'Đang phân tích...' : 'Khởi tạo chiến lược AI chi tiết' }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

export default {
  name: 'TabGoiTap',
  props: ['aiReport', 'isAiLoading'],
  data() {
    return {
      isLoading: false,
      plans: [],
      planColors: ['#22c55e', '#065f46', '#8b5cf6', '#f59e0b', '#0ea5e9'],
    }
  },
  computed: {
    totalRevenue() {
      return this.plans.reduce((sum, p) => sum + (p.revenue_est || 0), 0);
    },
    totalActiveSubs() {
      return this.plans.reduce((sum, p) => sum + (p.active_subs || 0), 0);
    },
    avgPrice() {
      if (this.plans.length === 0) return 0;
      return this.plans.reduce((sum, p) => sum + (p.price || 0), 0) / this.plans.length;
    },
    bestPlanName() {
      if (this.plans.length === 0) return '—';
      const best = [...this.plans].sort((a, b) => b.total_subs - a.total_subs)[0];
      return best ? best.name : '—';
    },
    otherSubs() {
      return this.plans.slice(3).reduce((sum, p) => sum + (p.active_subs || 0), 0);
    },
    parsedTips() {
      if (!this.aiReport?.ai_suggestions) return [];
      return this.aiReport.ai_suggestions
        .split('\n')
        .map(t => t.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean);
    }
  },
  mounted() {
    this.fetchPlanData();
  },
  methods: {
    async fetchPlanData() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/membership-plans`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = Array.isArray(res.data) ? res.data : (res.data.data || []);
        this.plans = list.map(p => ({
          name: p.plan_name || p.name || 'Gói không tên',
          price: parseFloat(p.price) || 0,
          duration_days: p.duration_days || 30,
          total_subs: p.subscriptions_count || 0,
          active_subs: p.active_subscriptions_count || p.active_count || 0,
          revenue_est: (p.subscriptions_count || 0) * (parseFloat(p.price) || 0),
        }));
      } catch (err) {
        console.error('Lỗi tải dữ liệu gói tập:', err);
        // Fallback: try to get from plan-effectiveness AI endpoint
        try {
          const token = localStorage.getItem('token');
          const res = await axios.post(`${API}/manager/plan-effectiveness`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Just show whatever data we got
        } catch (_) {}
      } finally {
        this.isLoading = false;
      }
    },
    formatCurrency(value) {
      if (!value || value === 0) return '0đ';
      if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + ' tỷ';
      if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M đ';
      if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K đ';
      return value.toLocaleString('vi-VN') + 'đ';
    },
    exportPDF() {
      window.print();
    }
  }
}
</script>

<style scoped>
.tab-content { padding: 20px; background: #f8fafc; font-family: 'Inter', sans-serif; }

/* Header */
.section-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.section-title { font-size: 1.6rem; font-weight: 900; color: #1e293b; margin: 0; }
.section-sub { color: #64748b; margin: 5px 0 0; font-size: 0.95rem; }
.head-actions { display: flex; gap: 10px; align-items: center; }
.btn-pdf { background: #e2e8f0; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; color: #475569; }
.btn-deep-analyze { background: #418953; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.btn-deep-analyze:disabled { opacity: 0.6; cursor: not-allowed; }

/* KPI Row v2 */
.kpi-row-v2 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 30px; }
.kpi-card-v2 { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.03); position: relative; }
.kpi-label { font-size: 0.65rem; font-weight: 800; color: #94a3b8; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.3px; }
.kpi-val-wrap { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
.kpi-val { font-size: 1.5rem; font-weight: 900; color: #1e293b; }
.kpi-badge { font-size: 0.75rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.kpi-badge.up { color: #22c55e; background: #dcfce7; }
.kpi-badge.down { color: #ef4444; background: #fee2e2; }
.kpi-badge.neutral { color: #64748b; background: #f1f5f9; }
.kpi-bar { position: absolute; bottom: 15px; left: 20px; width: 60%; height: 3px; border-radius: 2px; }
.bg-green { background: #22c55e; }
.bg-green-light { background: #4ade80; }
.bg-purple-light { background: #a78bfa; }
.bg-grey { background: #cbd5e1; }
.bg-dark-green { background: #065f46; }

/* Grid Body v2 */
.body-grid-v2 { display: grid; grid-template-columns: 1fr 320px; gap: 20px; }
.chart-area-v2 { display: flex; flex-direction: column; gap: 20px; }
.chart-card-v2 { background: white; padding: 25px; border-radius: 16px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.chart-title-v2 { font-size: 1.1rem; font-weight: 800; margin: 0; }

/* Donut & Impact */
.bottom-row-v2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.donut-card-v2, .impact-card-v2 { background: white; padding: 20px; border-radius: 16px; }
.card-subtitle { font-size: 0.95rem; font-weight: 800; margin-bottom: 20px; }
.donut-flex { display: flex; justify-content: space-between; align-items: center; }
.donut-stats { font-size: 0.85rem; font-weight: 600; color: #475569; }
.stat-line { margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.donut-viz { width: 90px; height: 90px; border: 15px solid #8b5cf6; border-radius: 50%; border-left-color: #22c55e; transform: rotate(45deg); position: relative; }
.donut-center { transform: rotate(-45deg); position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.donut-center .val { font-size: 1rem; font-weight: 900; }
.donut-center .lbl { font-size: 0.5rem; color: #94a3b8; font-weight: 800; }

.impact-card-v2 { background: #418953; color: white; }
.impact-title-v2 { font-size: 1.1rem; font-weight: 800; margin-bottom: 10px; }
.impact-text-v2 { font-size: 0.9rem; opacity: 0.9; margin-bottom: 20px; line-height: 1.6; }

/* AI Sidebar v2 */
.ai-sidebar-v2 { border: 2px solid transparent; border-image: linear-gradient(to bottom, #6366f1, #3b82f6) 1; border-radius: 20px; background: white; padding: 2px; }
.ai-panel-inner { padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.ai-header-v2 { font-size: 0.75rem; font-weight: 800; color: #6366f1; display: flex; align-items: center; gap: 8px; }
.ai-dot { width: 6px; height: 6px; background: #6366f1; border-radius: 50%; display: inline-block; }

.ai-insight-card { background: #f0fdf4; padding: 15px; border-radius: 12px; display: flex; gap: 12px; align-items: center; }
.insight-icon { width: 35px; height: 35px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #22c55e; }
.insight-body strong { font-size: 0.85rem; display: block; }
.insight-body p { font-size: 0.75rem; color: #64748b; margin: 2px 0 0; }

.ai-narrative { font-size: 0.85rem; line-height: 1.6; color: #334155; }
.ai-prediction { background: #f1f5f9; padding: 15px; border-radius: 10px; font-style: italic; font-size: 0.8rem; border-left: 3px solid #8b5cf6; }

.ai-strategy-section { display: flex; flex-direction: column; gap: 10px; }
.strategy-label { font-size: 0.7rem; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 8px; }
.strategy-item { background: #f8fafc; padding: 10px 12px; border-radius: 10px; }
.strategy-item p { font-size: 0.78rem; color: #475569; margin: 0; line-height: 1.5; }

.btn-ai-action { background: #111827; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 800; font-size: 0.85rem; cursor: pointer; width: 100%; }
.btn-ai-action:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
