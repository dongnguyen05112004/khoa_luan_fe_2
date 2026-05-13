<template>
  <div class="ai-dashboard">
    <!-- ===== HEADER HERO ===== -->
    <div class="ai-hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-icon-wrap">
          <i class="fas fa-brain"></i>
          <span class="hero-pulse"></span>
        </div>
        <div class="hero-text">
          <h2 class="hero-title">Trung tâm Phân tích AI <span class="hero-badge">SmartGym AI Engine</span></h2>
          <p class="hero-sub">Trợ lý AI tổng hợp dữ liệu thời gian thực và cung cấp phân tích chiến lược cho Quản lý.</p>
        </div>
      </div>
    </div>

    <!-- ===== NAVIGATION TABS ===== -->
    <div class="ai-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        class="nav-tab-btn" 
        :class="{ active: currentTab === tab.id }"
        @click="switchTab(tab.id)"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- ===== MAIN CONTENT AREA ===== -->
    <div class="ai-main-content">
      
      <!-- LOADING STATE -->
      <div v-if="loading" class="ai-loading-state">
        <div class="spinner-pulse"></div>
        <p>AI đang xử lý và tổng hợp dữ liệu...</p>
      </div>

      <!-- RESULT PANEL -->
      <div v-else-if="currentResult" class="ai-result-panel" :class="`theme-${currentTab}`">
        <div class="panel-header">
          <div class="panel-title-wrap">
            <i :class="getTabIcon(currentTab)"></i>
            <h3>{{ currentResult.title || 'Kết quả phân tích' }}</h3>
          </div>
          <div class="panel-actions" style="display:flex; gap:8px;">
            <button class="btn-rerun" @click="exportPDF" style="background: #2d7a3a; border-color: #2d7a3a;">
              <i class="fas fa-file-export"></i> Xuất PDF
            </button>
            <button class="btn-rerun" @click="runAnalysis(currentTab)">
              <i class="fas fa-sync-alt"></i> Phân tích lại
            </button>
          </div>
        </div>

        <div class="panel-grid">
          <!-- Main Diagnosis -->
          <div class="panel-card diagnosis-card">
            <div class="card-label"><i class="fas fa-comment-alt"></i> Đánh giá của AI</div>
            <p class="diagnosis-text">{{ currentResult.ai_diagnosis }}</p>
          </div>

          <!-- Suggestions / Action Plan -->
          <div class="panel-card suggestions-card">
            <div class="card-label"><i class="fas fa-lightbulb"></i> Đề xuất hành động</div>
            <ul class="suggestions-list">
              <li v-for="(tip, i) in parsedTips(currentResult.ai_suggestions)" :key="i">
                <i class="fas fa-check-circle"></i>
                <span>{{ tip }}</span>
              </li>
            </ul>
          </div>

          <!-- Dynamic Metrics based on Tab -->
          <div class="panel-card metrics-card">
            <div class="card-label"><i class="fas fa-chart-pie"></i> Chỉ số nổi bật</div>
            <div class="metrics-content">
              
              <!-- Tab 1: Overview -->
              <div v-if="currentTab === 'overview'" class="metrics-grid">
                <div class="metric-item">
                  <span class="m-val">{{ currentResult.overall_score || 'N/A' }}</span>
                  <span class="m-lbl">Điểm tổng quan</span>
                </div>
                <div class="metric-item full-width">
                  <span class="m-val small">{{ currentResult.key_highlights || 'N/A' }}</span>
                  <span class="m-lbl">Điểm sáng nổi bật</span>
                </div>
              </div>

              <!-- Tab 2: Retention -->
              <div v-if="currentTab === 'retention'" class="metrics-grid">
                <div class="metric-item" v-for="(val, key) in currentResult.key_metrics" :key="key">
                  <span class="m-val">{{ val }}</span>
                  <span class="m-lbl">{{ formatMetricKey(key) }}</span>
                </div>
              </div>

              <!-- Tab 3: Plans -->
              <div v-if="currentTab === 'plans'" class="metrics-grid">
                <div class="metric-item">
                  <span class="m-val green">{{ currentResult.best_plan || 'N/A' }}</span>
                  <span class="m-lbl">Gói bán chạy nhất</span>
                </div>
                <div class="metric-item">
                  <span class="m-val red">{{ currentResult.worst_plan || 'N/A' }}</span>
                  <span class="m-lbl">Gói kém hiệu quả</span>
                </div>
              </div>

              <!-- Tab 4: Promotions -->
              <div v-if="currentTab === 'promotions'" class="metrics-grid">
                <div class="metric-item">
                  <span class="m-val purple">{{ currentResult.best_promotion || 'N/A' }}</span>
                  <span class="m-lbl">Khuyến mãi hiệu quả</span>
                </div>
                <div class="metric-item full-width">
                  <span class="m-val small">{{ currentResult.recommendation || 'N/A' }}</span>
                  <span class="m-lbl">Đề xuất chính sách</span>
                </div>
              </div>

              <!-- Tab 5: Feedback -->
              <div v-if="currentTab === 'feedback'" class="metrics-grid">
                <div class="metric-item">
                  <span class="m-val" :class="getSentimentClass(currentResult.sentiment)">{{ currentResult.sentiment || 'N/A' }}</span>
                  <span class="m-lbl">Cảm xúc chung</span>
                </div>
                <div class="metric-item">
                  <span class="m-val small red">{{ currentResult.urgent_issues || 'Không có' }}</span>
                  <span class="m-lbl">Vấn đề khẩn cấp</span>
                </div>
              </div>

              <!-- Tab 6: General Report -->
              <div v-if="currentTab === 'general'" class="metrics-grid">
                <div class="metric-item full-width">
                  <span class="m-val">{{ currentResult.overall_health || 'N/A' }}</span>
                  <span class="m-lbl">Sức khoẻ vận hành</span>
                </div>
              </div>

              <!-- Tab 7: Health & Churn -->
              <div v-if="currentTab === 'health_churn'" class="metrics-grid">
                <div class="metric-item">
                  <span class="m-val red">{{ currentResult.churn_risk_count || '0' }}</span>
                  <span class="m-lbl">Hội viên nguy cơ rời bỏ</span>
                </div>
                <div class="metric-item">
                  <span class="m-val orange small">{{ currentResult.health_alert || 'Không' }}</span>
                  <span class="m-lbl">Cảnh báo sức khoẻ</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="panel-footer">
          <span><i class="far fa-clock"></i> Cập nhật: {{ formatDate(currentResult.created_at) }}</span>
        </div>
      </div>

      <!-- EMPTY STATE (NO ANALYSIS YET) -->
      <div v-else class="ai-empty-state">
        <i class="fas fa-feather-alt"></i>
        <p>Chưa có dữ liệu phân tích cho mục này.</p>
        <button class="btn-run-initial" @click="runAnalysis(currentTab)">
          <i class="fas fa-play"></i> Bắt đầu phân tích
        </button>
      </div>

    </div>

    <!-- ===== HISTORY SECTION ===== -->
    <div class="ai-history-section">
      <div class="section-title"><i class="fas fa-history"></i> Phân tích đã lưu gần đây</div>
      <div class="history-grid" v-if="history.length > 0">
        <div class="history-item" v-for="rec in history.slice(0, 4)" :key="rec.id">
          <span class="hist-type">{{ rec.recommendation_type }}</span>
          <div class="hist-title">{{ rec.title }}</div>
          <div class="hist-date">{{ formatDate(rec.created_at) }}</div>
        </div>
      </div>
      <div v-else class="history-empty">Chưa có lịch sử phân tích.</div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

const API = 'http://localhost:8000/api';

export default {
  name: 'TabAI',
  data() {
    return {
      currentTab: 'overview',
      loading: false,
      results: {
        overview: null,
        retention: null,
        plans: null,
        promotions: null,
        feedback: null,
        general: null,
        health_churn: null
      },
      history: [],
      tabs: [
        { id: 'overview', name: 'Tổng quan', icon: 'fas fa-eye', endpoint: 'manager/overview' },
        { id: 'retention', name: 'Giữ chân KH', icon: 'fas fa-user-shield', endpoint: 'manager/retention-analysis' },
        { id: 'plans', name: 'Gói tập', icon: 'fas fa-dumbbell', endpoint: 'manager/plan-effectiveness' },
        { id: 'promotions', name: 'Khuyến mãi', icon: 'fas fa-percentage', endpoint: 'manager/promotion-effectiveness' },
        { id: 'feedback', name: 'Phản hồi', icon: 'fas fa-comments', endpoint: 'manager/feedback-analysis' },
        { id: 'general', name: 'Báo cáo chung', icon: 'fas fa-chart-line', endpoint: 'manager/general-report' },
        { id: 'health_churn', name: 'Sức khoẻ & Churn', icon: 'fas fa-heartbeat', endpoint: 'manager/health-churn-report' }
      ]
    };
  },
  computed: {
    currentResult() {
      return this.results[this.currentTab];
    }
  },
  mounted() {
    this.fetchHistory();
    this.runAnalysis('overview'); // Tự động load Overview khi vào
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('token');
      return { Authorization: `Bearer ${token}` };
    },

    switchTab(tabId) {
      this.currentTab = tabId;
      if (!this.results[tabId]) {
        this.runAnalysis(tabId);
      }
    },

    async runAnalysis(tabId) {
      const tab = this.tabs.find(t => t.id === tabId);
      if (!tab) return;

      this.loading = true;
      try {
        const res = await axios.post(`${API}/${tab.endpoint}`, {}, { headers: this.authHeaders() });
        this.results[tabId] = res.data.data;
        this.fetchHistory();
      } catch (error) {
        console.error(`Lỗi phân tích AI cho ${tabId}:`, error);
        alert(error.response?.data?.message || 'Không thể tạo phân tích AI. Vui lòng thử lại.');
      } finally {
        this.loading = false;
      }
    },

    async fetchHistory() {
      try {
        const res = await axios.get(`${API}/ai-recommendations`, {
          params: { per_page: 10 },
          headers: this.authHeaders(),
        });
        this.history = res.data.data || [];
      } catch (e) {
        console.error('Lỗi khi tải lịch sử AI', e);
      }
    },

    parsedTips(text) {
      return (text || '').split('\n').map(t => t.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
    },

    formatDate(dt) {
      if (!dt) return '';
      const d = new Date(dt);
      return d.toLocaleString('vi-VN');
    },

    getTabIcon(tabId) {
      return this.tabs.find(t => t.id === tabId)?.icon || 'fas fa-brain';
    },

    formatMetricKey(key) {
      const map = {
        retention_rate: 'Tỉ lệ giữ chân',
        risk_group: 'Nhóm rủi ro',
        trend: 'Xu hướng'
      };
      return map[key] || key;
    },

    getSentimentClass(sentiment) {
      if (!sentiment) return '';
      if (sentiment.includes('Tích cực')) return 'green';
      if (sentiment.includes('Tiêu cực')) return 'red';
      return 'orange';
    },
    exportPDF() {
      window.print();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');

.ai-dashboard {
  font-family: 'Quicksand', sans-serif;
  padding: 20px;
  background-color: #0f172a; /* Dark background */
  color: #f1f5f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* ===== HERO ===== */
.ai-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
  border-radius: 16px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.hero-glow {
  position: absolute;
  top: -50px; right: -50px;
  width: 250px; height: 250px;
  background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
  pointer-events: none;
}
.hero-content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hero-icon-wrap {
  width: 60px; height: 60px;
  background: rgba(99, 102, 241, 0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.hero-icon-wrap i { font-size: 1.8rem; color: #818cf8; }
.hero-pulse {
  position: absolute; inset: -5px; border-radius: 50%;
  border: 2px solid rgba(99, 102, 241, 0.4);
  animation: pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 1; }
  100% { transform: scale(1.3); opacity: 0; }
}
.hero-title { margin: 0; font-size: 1.6rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 10px; }
.hero-badge {
  font-size: 0.7rem; background: #4f46e5; padding: 4px 10px; border-radius: 20px; font-weight: 700;
}
.hero-sub { margin: 8px 0 0; font-size: 0.9rem; color: #94a3b8; }

/* ===== NAVIGATION TABS ===== */
.ai-nav {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
}
.ai-nav::-webkit-scrollbar { height: 4px; }
.ai-nav::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

.nav-tab-btn {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  font-family: inherit; font-weight: 700; font-size: 0.85rem;
  transition: all 0.3s ease;
  white-space: nowrap;
}
.nav-tab-btn i { font-size: 1rem; }
.nav-tab-btn:hover {
  background: rgba(30, 41, 59, 0.8);
  color: #fff;
}
.nav-tab-btn.active {
  background: #4f46e5;
  color: #fff;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
  border-color: transparent;
}

/* ===== MAIN CONTENT ===== */
.ai-main-content {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 30px;
  min-height: 400px;
}

/* LOADING */
.ai-loading-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 15px;
}
.spinner-pulse {
  width: 40px; height: 40px; border-radius: 50%; background: #4f46e5;
  animation: pulse-spin 1.2s infinite ease-in-out;
}
@keyframes pulse-spin {
  0% { transform: scale(0.8); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.5; }
}
.ai-loading-state p { color: #94a3b8; font-size: 0.95rem; font-weight: 700; }

/* RESULT PANEL */
.ai-result-panel {
  display: flex; flex-direction: column; gap: 20px;
  animation: fadeIn 0.4s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;
}
.panel-title-wrap { display: flex; align-items: center; gap: 12px; }
.panel-title-wrap i { font-size: 1.5rem; color: #818cf8; }
.panel-title-wrap h3 { margin: 0; font-size: 1.3rem; font-weight: 800; }

.btn-rerun {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff; padding: 8px 16px; border-radius: 8px; font-weight: 700; font-size: 0.8rem;
  cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s;
}
.btn-rerun:hover { background: rgba(255, 255, 255, 0.1); }

/* GRID */
.panel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
@media (max-width: 992px) {
  .panel-grid { grid-template-columns: 1fr; }
}

.panel-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
}
.card-label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
.card-label i { color: #4f46e5; }

.diagnosis-text { font-size: 0.95rem; line-height: 1.6; color: #cbd5e1; margin: 0; font-weight: 500; }

.suggestions-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.suggestions-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.9rem; color: #cbd5e1; line-height: 1.4; }
.suggestions-list li i { color: #10b981; font-size: 1rem; margin-top: 2px; flex-shrink: 0; }

.metrics-card { grid-column: span 2; }
@media (max-width: 992px) {
  .metrics-card { grid-column: span 1; }
}

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
@media (max-width: 768px) {
  .metrics-grid { grid-template-columns: 1fr; }
}

.metric-item {
  background: rgba(30, 41, 59, 0.4);
  padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.03);
  display: flex; flex-direction: column; align-items: center; text-align: center; justify-content: center;
}
.metric-item.full-width { grid-column: span 2; }
@media (max-width: 768px) {
  .metric-item.full-width { grid-column: span 1; }
}
.m-val { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.m-val.small { font-size: 0.95rem; font-weight: 700; line-height: 1.4; }
.m-lbl { font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; }

/* Colors */
.green { color: #10b981 !important; }
.red { color: #ef4444 !important; }
.orange { color: #f97316 !important; }
.purple { color: #8b5cf6 !important; }

.panel-footer { font-size: 0.75rem; color: #64748b; display: flex; justify-content: flex-end; }

/* EMPTY STATE */
.ai-empty-state {
  display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 15px; color: #64748b;
}
.ai-empty-state i { font-size: 2.5rem; color: #334155; }
.ai-empty-state p { margin: 0; font-size: 0.95rem; font-weight: 700; }
.btn-run-initial {
  background: #4f46e5; border: none; color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.85rem;
  cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4); transition: 0.2s;
}
.btn-run-initial:hover { background: #4338ca; transform: translateY(-1px); }

/* HISTORY */
.ai-history-section { margin-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 25px; }
.section-title { font-size: 1rem; font-weight: 800; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; color: #fff; }
.section-title i { color: #6366f1; }

.history-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; }
@media (max-width: 992px) { .history-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 576px) { .history-grid { grid-template-columns: 1fr; } }

.history-item {
  background: rgba(30, 41, 59, 0.3); padding: 15px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.02);
}
.hist-type { font-size: 0.65rem; font-weight: 700; color: #818cf8; text-transform: uppercase; background: rgba(129, 140, 248, 0.1); padding: 2px 6px; border-radius: 4px; }
.hist-title { font-size: 0.8rem; font-weight: 700; color: #cbd5e1; margin: 8px 0; }
.hist-date { font-size: 0.7rem; color: #64748b; }
.history-empty { color: #64748b; font-size: 0.85rem; text-align: center; padding: 20px; }
</style>
