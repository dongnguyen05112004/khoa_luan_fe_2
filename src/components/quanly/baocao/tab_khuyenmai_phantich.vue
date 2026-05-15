<template>
  <div class="premium-analytics-container">
    
    <!-- ── HEADER SECTION ── -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="title-group">
          <h1 class="main-title">Phân Tích Hiệu Quả Khuyến Mãi</h1>
          <p class="subtitle">Tối ưu hóa chiến dịch marketing dựa trên dữ liệu ROI và AI Strategic Insights</p>
        </div>
        <div class="header-actions">
          <button class="btn-secondary" @click="exportReport">
            <i class="fas fa-file-export"></i> Xuất Báo Cáo
          </button>
          <button class="btn-ai-glow" @click="fetchPromotionAnalysis" :disabled="isLoadingAnalysis">
            <div class="ai-icon-pulse" v-if="isLoadingAnalysis"></div>
            <i class="fas" :class="isLoadingAnalysis ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'"></i>
            <span>{{ isLoadingAnalysis ? 'Đang phân tích...' : 'Phân tích chiến lược AI' }}</span>
          </button>
        </div>
      </div>
    </header>

    <!-- ── KPI QUICK STATS ── -->
    <section class="quick-stats-grid">
      <!-- Thẻ Doanh thu - Đưa lên đầu -->
      <div class="stat-card">
        <div class="stat-icon icon-bg-2">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ topStats[1].label }}</span>
          <div class="stat-value-row">
            <h2 class="stat-value">{{ topStats[1].value }}</h2>
            <span class="stat-sub">{{ topStats[1].sub }}</span>
          </div>
        </div>
      </div>

      <!-- Thẻ Số chiến dịch -->
      <div class="stat-card">
        <div class="stat-icon icon-bg-1">
          <i class="fas fa-bullhorn"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">CHIẾN DỊCH ĐANG HOẠT ĐỘNG</span>
          <div class="stat-value-row">
            <h2 class="stat-value">{{ activeCampaignsCount }}</h2>
            <span class="stat-sub">Đang triển khai</span>
          </div>
        </div>
      </div>
      
       
    </section>

    <!-- ── AI ANALYSIS RESULT (GLASS CARD) ── -->
    <transition name="fade-slide">
      <section v-if="analysisData && !isLoadingAnalysis" class="ai-report-section">
        <div class="glass-card result-main">
          <div class="result-header">
            <div class="report-badge">AI ANALYTICS REPORT</div>
            <h3 class="report-title">{{ analysisData.ai_analysis?.title || 'Báo cáo chiến lược' }}</h3>
          </div>

          <div class="result-body">
            <div class="diagnosis-box">
              <div class="box-icon"><i class="fas fa-stethoscope"></i></div>
              <div class="box-content">
                <h4>Chẩn đoán hệ thống</h4>
                <p>{{ analysisData.ai_analysis?.ai_diagnosis }}</p>
              </div>
            </div>

            <div class="highlights-grid">
              <div class="highlight-item performer">
                <i class="fas fa-medal"></i>
                <div class="hl-text">
                  <label>Chiến dịch hiệu quả nhất</label>
                  <span>{{ analysisData.ai_analysis?.top_performer || 'N/A' }}</span>
                </div>
              </div>
              <div class="highlight-item roi">
                <i class="fas fa-chart-pie"></i>
                <div class="hl-text">
                  <label>Phân tích ROI</label>
                  <span>{{ analysisData.ai_analysis?.roi_analysis || 'N/A' }}</span>
                </div>
              </div>
              <div class="highlight-item action">
                <i class="fas fa-bolt"></i>
                <div class="hl-text">
                  <label>Hành động ưu tiên</label>
                  <span class="text-indigo">{{ analysisData.ai_analysis?.recommendation || 'N/A' }}</span>
                </div>
              </div>
            </div>

            <div class="suggestions-list">
              <h4>Gợi ý tối ưu hóa</h4>
              <div class="suggestion-items">
                <div v-for="(sug, idx) in formatSuggestions(analysisData.ai_analysis?.ai_suggestions)" :key="idx" class="sug-pill">
                  <i class="fas fa-lightbulb"></i> {{ sug }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary metrics from analysis -->
        <div class="analysis-summary-grid mt-4">
            <div class="mini-summary-card">
                <label>Doanh thu tạo ra</label>
                <span class="val">{{ formatCurrency(analysisData.summary?.total_revenue_generated) }}</span>
            </div>
            <div class="mini-summary-card">
                <label>Chi phí chiết khấu</label>
                <span class="val">{{ formatCurrency(analysisData.summary?.total_discount_cost) }}</span>
            </div>
            <div class="mini-summary-card">
                <label>ROI Trung bình</label>
                <span class="val">{{ analysisData.summary?.avg_roi?.toFixed(2) }}x</span>
            </div>
            <div class="mini-summary-card">
                <label>Tổng lượt chuyển đổi</label>
                <span class="val">{{ analysisData.summary?.total_usage }}</span>
            </div>
        </div>
      </section>
    </transition>

    <!-- ── LOADING SKELETON ── -->
    <section v-if="isLoadingAnalysis" class="ai-report-section">
      <div class="glass-card skeleton-pulse" style="height: 400px;"></div>
    </section>

    <!-- ── CAMPAIGN COMPARISON TABLE ── -->
    <section class="campaign-section mt-5">
      <div class="section-header">
        <h3 class="section-title"><i class="fas fa-table"></i> Hiệu suất chi tiết từng chiến dịch</h3>
        <div class="search-filter">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Tìm kiếm chiến dịch..." />
        </div>
      </div>

      <div class="table-responsive">
        <table class="premium-table">
          <thead>
            <tr>
              <th>Chiến Dịch</th>
              <th>Loại</th>
              <th>Lượt Dùng</th>
              <th>Chuyển Đổi</th>
              <th>Trạng Thái</th>
              <th>ROI</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in mappedCampaigns" :key="c.id">
              <td>
                <div class="campaign-cell">
                  <div class="camp-icon" :class="c.iconBg"><i :class="c.icon"></i></div>
                  <div class="camp-name-group">
                    <span class="camp-name">{{ c.name || c.title || 'Không có tên' }}</span>
                    <span class="camp-tag-v2" v-if="c.tag"><i class="fas fa-magic"></i> {{ c.tag }}</span>
                  </div>
                </div>
              </td>
              <td><span class="type-badge">{{ c.type }}</span></td>
              <td><span class="font-bold">{{ c.uses }}</span></td>
              <td><span class="text-muted">{{ c.ctr }}</span></td>
              <td><span class="status-badge" :class="c.statusClass">{{ c.status }}</span></td>
              <td>
                <div class="roi-indicator">
                  <div class="roi-bar-bg"><div class="roi-bar-fill" :style="{width: getRoiWidth(c.roi)}"></div></div>
                  <span class="roi-val">{{ c.roi }}</span>
                </div>
              </td>
              <td>
                <button class="btn-icon" title="Xem chi tiết"><i class="fas fa-external-link-alt"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TabKhuyenMaiPhanTich',
  data() {
    return {
      topStats: [
        { label: 'CHIẾN DỊCH ĐANG HOẠT ĐỘNG', value: '0', sub: 'Đang triển khai' },
        { label: 'DOANH THU TỪ KM', value: '—', sub: 'Tổng thu thực tế' },
      ],
      campaigns: [],
      analysisData: null,
      isLoadingAnalysis: false,
      loading: false,
      errorMsg: '',
    }
  },

  computed: {
    activeCampaignsCount() {
      return this.mappedCampaigns.filter(c => c.statusClass === 'status-running').length;
    },
    mappedCampaigns() {
      const now = new Date()
      const iconMap = [
        { icon: 'fas fa-fire',     iconBg: 'bg-orange' },
        { icon: 'fas fa-gem',      iconBg: 'bg-indigo' },
        { icon: 'fas fa-rocket',   iconBg: 'bg-blue' },
        { icon: 'fas fa-gift',     iconBg: 'bg-pink' },
      ]

      return this.campaigns.map((c, i) => {
        const start = c.start_date ? new Date(c.start_date) : null
        const end   = c.end_date   ? new Date(c.end_date)   : null
        const isRunning = (start && end) ? (now >= start && now <= end) : c.active
        const ic = iconMap[i % iconMap.length]
        const metric = this.analysisData?.metrics?.find(m => m.promotion_id === c.id || m.code === c.code);
        
        return {
          id:          c.id,
          name:        c.name || c.title,
          title:       c.title,
          type:        c.target || 'KHUYẾN MÃI',
          tag:         metric?.roi >= 3 ? 'LỢI NHUẬN CAO' : (i === 0 ? 'CHIẾN DỊCH CHỦ LỰC' : ''),
          icon:        ic.icon,
          iconBg:      ic.iconBg,
          uses:        metric ? metric.usage_count : (c.usage_limit ? String(c.usage_limit) : '0'),
          ctr:         metric ? metric.conversion_rate : '—',
          status:      isRunning ? 'Đang chạy' : (end && now > end ? 'Đã kết thúc' : 'Sắp diễn ra'),
          statusClass: isRunning ? 'status-running' : 'status-done',
          roi:         metric ? metric.roi + 'x' : '—',
        }
      })
    }
  },

  mounted() {
    this.fetchPromotions();
    // Auto fetch analysis on mount if needed
  },

  methods: {
    getStatIcon(i) {
      const icons = ['fas fa-percentage', 'fas fa-bullhorn', 'fas fa-coins'];
      return icons[i] || 'fas fa-chart-line';
    },
    formatCurrency(val) {
      if (!val) return '0 VNĐ';
      return new Intl.NumberFormat('vi-VN').format(val) + ' VNĐ';
    },
    formatSuggestions(sug) {
      if (!sug) return [];
      return sug.split('\n').map(s => s.replace(/^- /, '').replace(/^\* /, '').trim()).filter(s => s.length > 0);
    },
    getRoiWidth(roi) {
      if (roi === '—') return '0%';
      const val = parseFloat(roi);
      return Math.min(val * 20, 100) + '%';
    },
    async fetchPromotionAnalysis() {
      this.isLoadingAnalysis = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://127.0.0.1:8000/api/manager/promotion-analysis', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.data) {
          this.analysisData = res.data.data;
          this.updateTopStats(res.data.data.summary, res.data.data.ai_analysis);
        }
      } catch (error) {
        console.error('Lỗi khi lấy phân tích khuyến mãi:', error);
      } finally {
        this.isLoadingAnalysis = false;
      }
    },
    updateTopStats(summary, ai) {
      if (!summary) return;
      this.topStats[1].value = this.formatCurrency(summary.total_revenue_generated);
    },
    async fetchPromotions() {
      this.loading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/promotions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.campaigns = res.data;
      } catch (error) {
        console.error('Lỗi fetch promotions:', error);
      } finally {
        this.loading = false;
      }
    },
    exportReport() {
      alert('Đang trích xuất báo cáo dữ liệu...')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.premium-analytics-container {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 24px;
  background-color: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
}

/* ── HEADER ── */
.dashboard-header {
  margin-bottom: 32px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  margin-bottom: 4px;
}
.subtitle {
  color: #64748b;
  font-size: 0.95rem;
}
.header-actions {
  display: flex;
  gap: 12px;
}

/* Buttons */
.btn-secondary {
  padding: 10px 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.88rem;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-secondary:hover {
  background: #f1f5f9;
}

.btn-ai-glow {
  position: relative;
  padding: 10px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  overflow: hidden;
  transition: all 0.3s;
}
.btn-ai-glow:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.5);
}
.btn-ai-glow:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* ── STAT CARDS ── */
.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
.stat-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}
.stat-icon {
  width: 54px;
  height: 54px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}
.icon-bg-0 { background: #eef2ff; color: #4f46e5; }
.icon-bg-1 { background: #fff7ed; color: #f59e0b; }
.icon-bg-2 { background: #f0fdf4; color: #10b981; }

.stat-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.stat-value {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}
.stat-sub {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* AI Score Card Specific */
.ai-score-card {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
}
.ai-score-card .stat-label { color: #cbd5e1; }
.ai-score-card .stat-status { font-size: 0.75rem; color: #10b981; display: flex; align-items: center; gap: 4px; }

.ai-score-ring {
  position: relative;
  width: 50px;
  height: 50px;
}
.circular-chart { display: block; width: 100%; height: 100%; }
.circle-bg { fill: none; stroke: #334155; stroke-width: 3; }
.circle { fill: none; stroke: #10b981; stroke-width: 3; stroke-linecap: round; }
.percentage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: 800;
  font-size: 0.9rem;
}

/* ── AI REPORT SECTION ── */
.ai-report-section {
  margin-bottom: 32px;
}
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 32px;
  box-shadow: 0 10px 40px rgba(99, 102, 241, 0.08);
}
.result-header {
  margin-bottom: 24px;
}
.report-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #eef2ff;
  color: #6366f1;
  font-size: 0.7rem;
  font-weight: 800;
  border-radius: 20px;
  margin-bottom: 8px;
}
.report-title {
  font-size: 1.4rem;
  font-weight: 800;
  margin: 0;
}

.diagnosis-box {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  border: 1px solid #f1f5f9;
}
.box-icon {
  width: 40px;
  height: 40px;
  background: #f5f3ff;
  color: #7c3aed;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}
.box-content h4 { margin: 0 0 4px 0; font-size: 1rem; }
.box-content p { margin: 0; color: #475569; font-size: 0.92rem; line-height: 1.6; }

.highlights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.highlight-item {
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.highlight-item.performer { background: #fffbeb; }
.highlight-item.performer i { color: #f59e0b; }
.highlight-item.roi { background: #f0fdf4; }
.highlight-item.roi i { color: #10b981; }
.highlight-item.action { background: #f5f3ff; }
.highlight-item.action i { color: #8b5cf6; }

.hl-text label { display: block; font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
.hl-text span { font-size: 0.9rem; font-weight: 800; color: #1e293b; }

.suggestions-list h4 { font-size: 0.95rem; margin-bottom: 12px; }
.suggestion-items { display: flex; flex-wrap: wrap; gap: 8px; }
.sug-pill {
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}
.sug-pill i { color: #f59e0b; }

.analysis-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
}
.mini-summary-card {
    background: white;
    padding: 12px 20px;
    border-radius: 14px;
    border: 1px solid #f1f5f9;
}
.mini-summary-card label { display: block; font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
.mini-summary-card .val { font-size: 0.95rem; font-weight: 800; color: #1e293b; }

/* ── TABLE SECTION ── */
.campaign-section {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.section-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
}
.search-filter {
  position: relative;
  width: 280px;
}
.search-filter i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.search-filter input {
  width: 100%;
  padding: 10px 14px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.88rem;
}

.premium-table {
  width: 100%;
  border-collapse: collapse;
}
.premium-table th {
  text-align: left;
  padding: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  border-bottom: 1px solid #f1f5f9;
}
.premium-table td {
  padding: 20px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}

.campaign-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.camp-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}
.bg-orange { background: #fff7ed; color: #f97316; }
.bg-indigo { background: #eef2ff; color: #6366f1; }
.bg-blue { background: #eff6ff; color: #3b82f6; }
.bg-pink { background: #fdf2f8; color: #ec4899; }

.camp-name { 
  font-weight: 800; 
  display: block; 
  color: #0f172a; 
  font-size: 0.95rem;
  margin-bottom: 2px;
}
.camp-tag-v2 { 
  font-size: 0.65rem; 
  color: #7c3aed; 
  font-weight: 700; 
  text-transform: uppercase;
  background: #f5f3ff;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.type-badge {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
}
.status-running { background: #dcfce7; color: #166534; }
.status-done { background: #f1f5f9; color: #475569; }

.roi-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
}
.roi-bar-bg {
  width: 60px;
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
}
.roi-bar-fill {
  height: 100%;
  background: #10b981;
}
.roi-val { font-weight: 700; color: #1e293b; }

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-icon:hover {
  background: #f8fafc;
  color: #6366f1;
}

/* Animations */
.skeleton-pulse {
  background: linear-gradient(-45deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 400% 400%;
  animation: pulse-shimmer 1.5s ease-in-out infinite;
}
@keyframes pulse-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.5s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 24px; }
.mt-5 { margin-top: 40px; }
.font-bold { font-weight: 700; }
.text-muted { color: #94a3b8; }
.text-indigo { color: #6366f1; }

@media (max-width: 1200px) {
  .quick-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .highlights-grid { grid-template-columns: 1fr; }
  .analysis-summary-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
