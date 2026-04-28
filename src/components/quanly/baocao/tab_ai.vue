<template>
  <div class="ai-tab">

    <!-- ===== HEADER HERO ===== -->
    <div class="ai-hero">
      <div class="hero-glow"></div>
      <div class="hero-content">
        <div class="hero-icon-wrap">
          <i class="fas fa-robot"></i>
          <span class="hero-pulse"></span>
        </div>
        <div class="hero-text">
          <h2 class="hero-title">SmartGym AI <span class="hero-badge">Powered by Groq</span></h2>
          <p class="hero-sub">Phân tích thông minh theo thời gian thực – sức khoẻ hội viên, nguy cơ rời bỏ &amp; báo cáo quản lý.</p>
        </div>
        <div class="hero-stats">
          <div class="hstat">
            <div class="hstat-val">{{ totalGenerated }}</div>
            <div class="hstat-label">Phân tích đã tạo</div>
          </div>
          <div class="hstat-divider"></div>
          <div class="hstat">
            <div class="hstat-val">Groq</div>
            <div class="hstat-label">AI Engine</div>
          </div>
          <div class="hstat-divider"></div>
          <div class="hstat">
            <div class="hstat-val">3</div>
            <div class="hstat-label">Tính năng AI</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== 3 FEATURE CARDS ===== -->
    <div class="feature-grid">

      <!-- Card 1: Gợi ý sức khoẻ cá nhân -->
      <div class="feat-card feat-health">
        <div class="feat-card-top">
          <div class="feat-icon health-icon"><i class="fas fa-heartbeat"></i></div>
          <div class="feat-info">
            <div class="feat-title">Gợi ý sức khoẻ cá nhân</div>
            <div class="feat-sub">Dành cho hội viên đang đăng nhập</div>
          </div>
          <span class="feat-tag feat-tag-green">Cá nhân hoá</span>
        </div>
        <p class="feat-desc">AI phân tích chỉ số sức khoẻ &amp; mục tiêu cá nhân của hội viên hiện tại để đưa ra chẩn đoán và gợi ý cải thiện.</p>
        <button class="feat-btn feat-btn-green" @click="generateHealthRec" :disabled="healthLoading">
          <i class="fas" :class="healthLoading ? 'fa-spinner fa-spin' : 'fa-magic'"></i>
          {{ healthLoading ? 'Đang phân tích...' : 'Tạo gợi ý sức khoẻ' }}
        </button>
        <!-- Result -->
        <div v-if="healthResult" class="feat-result">
          <div class="res-title"><i class="fas fa-check-circle res-ic green"></i>{{ healthResult.title }}</div>
          <div class="res-diag">{{ healthResult.ai_diagnosis }}</div>
          <div class="res-tips" v-if="healthResult.ai_suggestions">
            <div class="res-tip" v-for="(tip, i) in parsedTips(healthResult.ai_suggestions)" :key="i">
              <i class="fas fa-arrow-right tip-arrow"></i><span>{{ tip }}</span>
            </div>
          </div>
          <div class="res-meta">{{ formatDate(healthResult.created_at) }}</div>
        </div>
        <div v-if="healthError" class="feat-error"><i class="fas fa-exclamation-triangle"></i> {{ healthError }}</div>
      </div>

      <!-- Card 2: Dự báo rời bỏ (Churn) -->
      <div class="feat-card feat-churn">
        <div class="feat-card-top">
          <div class="feat-icon churn-icon"><i class="fas fa-users-slash"></i></div>
          <div class="feat-info">
            <div class="feat-title">Dự báo rời bỏ hội viên</div>
            <div class="feat-sub">Dành cho Admin / Manager</div>
          </div>
          <span class="feat-tag feat-tag-red">Quản lý</span>
        </div>
        <p class="feat-desc">AI phân tích lịch sử check-in, thời hạn đăng ký &amp; mục tiêu để phân loại rủi ro rời bỏ: Đỏ / Vàng / Xanh.</p>
        <button class="feat-btn feat-btn-red" @click="runChurn" :disabled="churnLoading">
          <i class="fas" :class="churnLoading ? 'fa-spinner fa-spin' : 'fa-chart-pie'"></i>
          {{ churnLoading ? 'Đang phân tích...' : 'Phân tích nguy cơ rời bỏ' }}
        </button>
        <!-- Result summary -->
        <div v-if="churnResult" class="feat-result">
          <div class="res-title"><i class="fas fa-check-circle res-ic red"></i>Phân tích hoàn tất – {{ churnResult.count }} hội viên</div>
          <div class="churn-badges">
            <span class="cbadge cb-red"><i class="fas fa-circle"></i> Đỏ: {{ countRisk('Đỏ') }}</span>
            <span class="cbadge cb-yellow"><i class="fas fa-circle"></i> Vàng: {{ countRisk('Vàng') }}</span>
            <span class="cbadge cb-green"><i class="fas fa-circle"></i> Xanh: {{ countRisk('Xanh') }}</span>
          </div>
          <div class="churn-list">
            <div class="churn-row" v-for="(item, i) in churnItems.slice(0, 4)" :key="i">
              <span class="churn-id">ID {{ item.user_id }}</span>
              <span class="churn-risk-tag" :class="riskClass(item.title)">{{ riskLabel(item.title) }}</span>
              <span class="churn-diag">{{ item.ai_diagnosis }}</span>
            </div>
          </div>
          <div v-if="churnItems.length > 4" class="churn-more">+{{ churnItems.length - 4 }} hội viên khác. Xem tab "Giữ chân" để biết thêm.</div>
        </div>
        <div v-if="churnError" class="feat-error"><i class="fas fa-exclamation-triangle"></i> {{ churnError }}</div>
      </div>

      <!-- Card 3: Báo cáo quản lý -->
      <div class="feat-card feat-report">
        <div class="feat-card-top">
          <div class="feat-icon report-icon"><i class="fas fa-chart-line"></i></div>
          <div class="feat-info">
            <div class="feat-title">Báo cáo chiến lược quản lý</div>
            <div class="feat-sub">Doanh thu, giữ chân &amp; tư vấn</div>
          </div>
          <span class="feat-tag feat-tag-purple">Chiến lược</span>
        </div>
        <p class="feat-desc">AI tổng hợp doanh thu tháng, tỷ lệ gia hạn, gói tập nổi bật và đánh giá khách hàng để đưa ra tư vấn chiến lược kinh doanh.</p>
        <button class="feat-btn feat-btn-purple" @click="generateReport" :disabled="reportLoading">
          <i class="fas" :class="reportLoading ? 'fa-spinner fa-spin' : 'fa-brain'"></i>
          {{ reportLoading ? 'Đang phân tích...' : 'Tạo báo cáo AI' }}
        </button>
        <!-- Result -->
        <div v-if="reportResult" class="feat-result">
          <div class="res-title"><i class="fas fa-check-circle res-ic purple"></i>{{ reportResult.title }}</div>
          <div class="res-diag">{{ reportResult.ai_diagnosis }}</div>
          <div class="res-tips" v-if="reportResult.ai_suggestions">
            <div class="res-tip" v-for="(tip, i) in parsedTips(reportResult.ai_suggestions)" :key="i">
              <i class="fas fa-arrow-right tip-arrow"></i><span>{{ tip }}</span>
            </div>
          </div>
          <div class="res-meta">{{ formatDate(reportResult.created_at) }}</div>
        </div>
        <div v-if="reportError" class="feat-error"><i class="fas fa-exclamation-triangle"></i> {{ reportError }}</div>
      </div>

    </div>

    <!-- ===== HISTORY TABLE ===== -->
    <div class="history-section">
      <div class="history-header">
        <div>
          <div class="history-title"><i class="fas fa-history"></i> Lịch sử phân tích AI</div>
          <div class="history-sub">Các phân tích gần đây được lưu trong hệ thống</div>
        </div>
        <button class="btn-refresh-hist" @click="fetchHistory" :disabled="histLoading">
          <i class="fas" :class="histLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'"></i>
          Làm mới
        </button>
      </div>

      <div class="history-card">
        <div class="hist-loading" v-if="histLoading"><i class="fas fa-spinner fa-spin"></i> Đang tải...</div>
        <table class="hist-table" v-else-if="history.length > 0">
          <thead>
            <tr>
              <th>LOẠI PHÂN TÍCH</th>
              <th>TIÊU ĐỀ</th>
              <th>CHẨN ĐOÁN</th>
              <th>USER ID</th>
              <th>THỜI GIAN</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="rec in history" :key="rec.id">
              <td><span class="type-badge" :class="typeClass(rec.recommendation_type)">{{ rec.recommendation_type }}</span></td>
              <td class="hist-title-cell">{{ rec.title }}</td>
              <td class="hist-diag-cell">{{ rec.ai_diagnosis }}</td>
              <td class="hist-uid">{{ rec.user_id }}</td>
              <td class="hist-date">{{ formatDate(rec.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="hist-empty" v-else>
          <i class="fas fa-robot"></i>
          <p>Chưa có phân tích AI nào. Hãy nhấn vào một trong các nút trên để bắt đầu.</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

export default {
  name: 'TabAI',
  data() {
    return {
      // Health
      healthLoading: false,
      healthResult: null,
      healthError: null,
      // Churn
      churnLoading: false,
      churnResult: null,
      churnItems: [],
      churnError: null,
      // Report
      reportLoading: false,
      reportResult: null,
      reportError: null,
      // History
      histLoading: false,
      history: [],
      totalGenerated: 0,
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    authHeaders() {
      const token = localStorage.getItem('token');
      return { Authorization: `Bearer ${token}` };
    },

    async generateHealthRec() {
      this.healthLoading = true;
      this.healthError = null;
      this.healthResult = null;
      try {
        const res = await axios.post(`${API}/ai-recommendations/generate`, {}, { headers: this.authHeaders() });
        this.healthResult = res.data.data;
        this.fetchHistory();
      } catch (e) {
        this.healthError = e.response?.data?.message || 'Lỗi khi gọi AI. Vui lòng thử lại.';
      } finally {
        this.healthLoading = false;
      }
    },

    async runChurn() {
      this.churnLoading = true;
      this.churnError = null;
      this.churnResult = null;
      this.churnItems = [];
      try {
        const res = await axios.post(`${API}/admin/churn-prediction`, {}, { headers: this.authHeaders() });
        this.churnResult = res.data;
        this.churnItems = Array.isArray(res.data.data) ? res.data.data : [];
        this.fetchHistory();
      } catch (e) {
        this.churnError = e.response?.data?.message || 'Lỗi khi phân tích churn. Vui lòng thử lại.';
      } finally {
        this.churnLoading = false;
      }
    },

    async generateReport() {
      this.reportLoading = true;
      this.reportError = null;
      this.reportResult = null;
      try {
        const res = await axios.post(`${API}/admin/manager-report`, {}, { headers: this.authHeaders() });
        this.reportResult = res.data.data;
        this.fetchHistory();
      } catch (e) {
        this.reportError = e.response?.data?.message || 'Lỗi khi tạo báo cáo. Vui lòng thử lại.';
      } finally {
        this.reportLoading = false;
      }
    },

    async fetchHistory() {
      this.histLoading = true;
      try {
        const res = await axios.get(`${API}/ai-recommendations`, {
          params: { per_page: 15 },
          headers: this.authHeaders(),
        });
        this.history = res.data.data || [];
        this.totalGenerated = res.data.total || this.history.length;
      } catch (e) {
        console.error('Lỗi khi tải lịch sử AI', e);
      } finally {
        this.histLoading = false;
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

    typeClass(type) {
      if (!type) return 'type-default';
      if (type.includes('Health')) return 'type-health';
      if (type.includes('Churn')) return 'type-churn';
      if (type.includes('Business')) return 'type-report';
      return 'type-default';
    },

    riskLabel(title) {
      if (!title) return '?';
      if (title.includes('Đỏ')) return 'Đỏ';
      if (title.includes('Vàng')) return 'Vàng';
      if (title.includes('Xanh')) return 'Xanh';
      return title;
    },

    riskClass(title) {
      if (!title) return 'cb-yellow';
      if (title.includes('Đỏ')) return 'risk-red';
      if (title.includes('Xanh')) return 'risk-green';
      return 'risk-yellow';
    },

    countRisk(level) {
      return this.churnItems.filter(item => (item.title || '').includes(level)).length;
    },
  },
};
</script>

<style scoped>
/* ===================== ROOT ===================== */
.ai-tab { display:flex; flex-direction:column; gap:24px; font-family:'Segoe UI',sans-serif; }

/* ===================== HERO ===================== */
.ai-hero {
  position:relative; overflow:hidden;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%);
  border-radius:20px; padding:28px 32px;
  color:#fff;
}
.hero-glow {
  position:absolute; top:-60px; right:-60px;
  width:220px; height:220px; border-radius:50%;
  background: radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%);
  pointer-events:none;
}
.hero-content { position:relative; display:flex; align-items:center; gap:22px; flex-wrap:wrap; }
.hero-icon-wrap { position:relative; flex-shrink:0; }
.hero-icon-wrap i { font-size:2.2rem; color:#a78bfa; display:block; }
.hero-pulse {
  position:absolute; inset:-6px; border-radius:50%;
  border:2px solid rgba(167,139,250,0.4);
  animation:pulse-ring 2s ease-out infinite;
}
@keyframes pulse-ring { 0%{transform:scale(1);opacity:1} 100%{transform:scale(1.6);opacity:0} }
.hero-text { flex:1; min-width:0; }
.hero-title { margin:0; font-size:1.4rem; font-weight:900; }
.hero-badge {
  background:linear-gradient(90deg,#4f46e5,#7c3aed);
  font-size:.65rem; font-weight:700; padding:3px 10px;
  border-radius:20px; margin-left:8px; vertical-align:middle; letter-spacing:.5px;
}
.hero-sub { margin:6px 0 0; font-size:.82rem; color:#94a3b8; line-height:1.5; }
.hero-stats { display:flex; align-items:center; gap:0; }
.hstat { text-align:center; padding:0 20px; }
.hstat-val { font-size:1.4rem; font-weight:900; color:#a78bfa; }
.hstat-label { font-size:.65rem; color:#64748b; margin-top:2px; }
.hstat-divider { width:1px; height:36px; background:rgba(255,255,255,.1); }

/* ===================== FEATURE GRID ===================== */
.feature-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }

.feat-card {
  background:#fff; border-radius:18px;
  padding:22px; box-shadow:0 4px 20px rgba(0,0,0,.06);
  display:flex; flex-direction:column; gap:14px;
  border-top:3px solid transparent; transition:transform .2s,box-shadow .2s;
}
.feat-card:hover { transform:translateY(-3px); box-shadow:0 8px 28px rgba(0,0,0,.1); }
.feat-health { border-top-color:#16a34a; }
.feat-churn  { border-top-color:#dc2626; }
.feat-report { border-top-color:#7c3aed; }

.feat-card-top { display:flex; align-items:center; gap:12px; }
.feat-icon {
  width:42px; height:42px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  font-size:1.1rem; color:#fff; flex-shrink:0;
}
.health-icon { background:linear-gradient(135deg,#16a34a,#4ade80); }
.churn-icon  { background:linear-gradient(135deg,#dc2626,#f87171); }
.report-icon { background:linear-gradient(135deg,#7c3aed,#a78bfa); }

.feat-info { flex:1; min-width:0; }
.feat-title { font-size:.9rem; font-weight:800; color:#1e293b; }
.feat-sub   { font-size:.7rem; color:#94a3b8; margin-top:2px; }

.feat-tag { font-size:.62rem; font-weight:700; padding:3px 9px; border-radius:20px; white-space:nowrap; }
.feat-tag-green  { background:#dcfce7; color:#16a34a; }
.feat-tag-red    { background:#fee2e2; color:#dc2626; }
.feat-tag-purple { background:#ede9fe; color:#7c3aed; }

.feat-desc { font-size:.78rem; color:#64748b; line-height:1.6; margin:0; }

.feat-btn {
  display:flex; align-items:center; justify-content:center; gap:8px;
  border:none; border-radius:10px; padding:11px 16px;
  font-size:.82rem; font-weight:700; cursor:pointer;
  transition:all .25s; letter-spacing:.2px;
}
.feat-btn:disabled { opacity:.55; cursor:not-allowed; transform:none !important; }
.feat-btn-green  { background:linear-gradient(135deg,#16a34a,#22c55e); color:#fff; }
.feat-btn-green:hover:not(:disabled)  { box-shadow:0 4px 14px rgba(22,163,74,.35); }
.feat-btn-red    { background:linear-gradient(135deg,#dc2626,#f87171); color:#fff; }
.feat-btn-red:hover:not(:disabled)    { box-shadow:0 4px 14px rgba(220,38,38,.35); }
.feat-btn-purple { background:linear-gradient(135deg,#7c3aed,#a78bfa); color:#fff; }
.feat-btn-purple:hover:not(:disabled) { box-shadow:0 4px 14px rgba(124,58,237,.35); }

/* Result box */
.feat-result {
  background:#f8fafc; border-radius:12px; padding:14px 16px;
  display:flex; flex-direction:column; gap:8px;
  border:1px solid #e2e8f0; animation:fadeIn .3s ease;
}
@keyframes fadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
.res-title { font-size:.82rem; font-weight:800; color:#1e293b; display:flex; align-items:center; gap:6px; }
.res-ic { font-size:.85rem; }
.res-ic.green  { color:#16a34a; }
.res-ic.red    { color:#dc2626; }
.res-ic.purple { color:#7c3aed; }
.res-diag { font-size:.77rem; color:#475569; line-height:1.55; }
.res-tips { display:flex; flex-direction:column; gap:5px; }
.res-tip { display:flex; align-items:flex-start; gap:6px; font-size:.74rem; color:#475569; }
.tip-arrow { color:#6366f1; font-size:.65rem; margin-top:3px; flex-shrink:0; }
.res-meta { font-size:.65rem; color:#94a3b8; text-align:right; }

/* Churn specifics */
.churn-badges { display:flex; gap:8px; flex-wrap:wrap; }
.cbadge { font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:20px; display:flex; align-items:center; gap:4px; }
.cb-red    { background:#fee2e2; color:#dc2626; }
.cb-yellow { background:#fef9c3; color:#a16207; }
.cb-green  { background:#dcfce7; color:#16a34a; }
.churn-list { display:flex; flex-direction:column; gap:6px; }
.churn-row { display:flex; align-items:center; gap:8px; font-size:.74rem; }
.churn-id { font-family:monospace; font-weight:700; color:#64748b; min-width:50px; }
.churn-risk-tag { font-size:.65rem; font-weight:700; padding:2px 7px; border-radius:20px; white-space:nowrap; }
.risk-red    { background:#fee2e2; color:#dc2626; }
.risk-yellow { background:#fef9c3; color:#a16207; }
.risk-green  { background:#dcfce7; color:#16a34a; }
.churn-diag { color:#475569; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.churn-more { font-size:.7rem; color:#94a3b8; text-align:center; }

/* Error */
.feat-error {
  background:#fff1f2; border:1px solid #fecdd3; border-radius:10px;
  padding:10px 14px; font-size:.77rem; color:#dc2626;
  display:flex; align-items:center; gap:7px;
}

/* ===================== HISTORY ===================== */
.history-section { display:flex; flex-direction:column; gap:12px; }
.history-header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.history-title { font-size:.95rem; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:7px; }
.history-title i { color:#6366f1; }
.history-sub { font-size:.72rem; color:#94a3b8; margin-top:3px; }
.btn-refresh-hist {
  display:flex; align-items:center; gap:6px;
  background:#f1f5f9; border:1px solid #e2e8f0;
  color:#475569; border-radius:8px; padding:7px 14px;
  font-size:.78rem; font-weight:600; cursor:pointer; transition:background .15s;
}
.btn-refresh-hist:hover:not(:disabled) { background:#e2e8f0; }
.btn-refresh-hist:disabled { opacity:.5; cursor:not-allowed; }

.history-card { background:#fff; border-radius:14px; box-shadow:0 2px 10px rgba(0,0,0,.06); overflow:hidden; }
.hist-loading { padding:30px; text-align:center; color:#94a3b8; font-size:.85rem; }
.hist-table { width:100%; border-collapse:collapse; font-size:.78rem; }
.hist-table th {
  text-align:left; font-size:.62rem; font-weight:700; color:#94a3b8;
  letter-spacing:.4px; padding:12px 14px; border-bottom:1px solid #f1f5f9; background:#fafafa;
}
.hist-table td { padding:12px 14px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.hist-table tr:last-child td { border-bottom:none; }

.type-badge { font-size:.65rem; font-weight:700; padding:3px 9px; border-radius:20px; white-space:nowrap; }
.type-health  { background:#dcfce7; color:#16a34a; }
.type-churn   { background:#fee2e2; color:#dc2626; }
.type-report  { background:#ede9fe; color:#7c3aed; }
.type-default { background:#f1f5f9; color:#64748b; }

.hist-title-cell { font-weight:600; color:#1e293b; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hist-diag-cell  { color:#64748b; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.hist-uid  { font-family:monospace; font-size:.75rem; color:#64748b; }
.hist-date { font-size:.72rem; color:#94a3b8; white-space:nowrap; }

.hist-empty { padding:40px; text-align:center; color:#94a3b8; }
.hist-empty i { font-size:2rem; margin-bottom:10px; display:block; opacity:.3; }
.hist-empty p { margin:0; font-size:.82rem; }
</style>
