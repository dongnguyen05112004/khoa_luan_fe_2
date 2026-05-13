<template>
  <div class="tab-content">

    <!-- Section Header -->
    <div class="section-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <h3 style="margin:0; font-size:1.1rem; font-weight:800;">Phân tích phản hồi khách hàng</h3>
      <button class="btn-ai-report" @click="exportReport"><i class="fas fa-file-export"></i> Xuất báo cáo</button>
    </div>

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">TỔNG PHẢN HỒI</div>
        <div class="kpi-val">{{ totalFeedbacks.toLocaleString() }}</div>
        <div class="kpi-badge up" v-if="totalFeedbacks > 0"><i class="fas fa-check"></i> Cập nhật mới nhất</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CHỈ SỐ HÀI LÒNG (CSAT)</div>
        <div class="kpi-val">{{ csatScore }}/5</div>
        <div class="stars">
          <i class="fas fa-star" v-for="i in 5" :key="i" :style="{ color: i <= Math.round(csatScore) ? '#f59e0b' : '#e2e8f0' }"></i>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">TỶ LỆ TIÊU CỰC</div>
        <div class="kpi-val">{{ negativePct }}%</div>
        <div class="kpi-badge down" v-if="negativePct > 10"><i class="fas fa-exclamation-triangle"></i> Cần chú ý</div>
      </div>
      <div class="kpi-card accent-purple">
        <div class="kpi-label-white">Phân tích AI tức thì</div>
        <div class="ai-kpi-tag" v-if="aiReport"><i class="fas fa-robot"></i> {{ aiReport.title }}</div>
        <div class="ai-kpi-tag" v-else><i class="fas fa-robot"></i> Phân tích các phản hồi ưu tiên</div>
        <button class="btn-live" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
          <i class="fas" :class="isAiLoading ? 'fa-spinner fa-spin' : 'fa-magic'"></i>
          {{ isAiLoading ? 'ĐANG CHẠY...' : 'PHÂN TÍCH TRỰC TIẾP' }}
        </button>
      </div>
    </div>

    <!-- AI Unified Card (Global analysis) -->
    <div class="ai-card-unified" style="margin-bottom: 20px;">
      <div class="ai-card-header-unified">
        <div class="ai-avatar-unified">
          <i class="fas fa-brain"></i>
        </div>
        <div class="ai-title-unified">
          <strong v-if="aiReport">{{ aiReport.title }}</strong>
          <strong v-else>Phân tích sắc thái khách hàng từ AI</strong>
        </div>
        <button class="btn-generate-ai-unified" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
          <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
          {{ isAiLoading ? 'Đang phân tích...' : 'Cập nhật AI' }}
        </button>
      </div>

      <div v-if="aiReport">
        <div class="ai-rec-diagnosis-unified">{{ aiReport.ai_diagnosis }}</div>
        <div class="ai-suggestions-unified" v-if="aiReport.ai_suggestions">
          <div class="suggestion-hd">HÀNH ĐỘNG ĐỀ XUẤT:</div>
          <div class="suggestion-item-unified" v-for="(tip, i) in aiReport.ai_suggestions.split('\n')" :key="i">
            <template v-if="tip.trim()">
              <i class="fas fa-check-circle"></i>
              <span>{{ tip.replace(/^- /, '').replace(/^\* /, '') }}</span>
            </template>
          </div>
        </div>
      </div>
      <div v-else class="ai-empty-unified">
        Chưa có phân tích AI. Hãy nhấn nút "Cập nhật AI" để tổng hợp sắc thái và các vấn đề nóng từ phản hồi khách hàng.
      </div>
    </div>

    <!-- Body -->
    <div class="body-grid" v-if="!isLoading">
      <!-- Left: Sentiment + Keywords -->
      <div class="left-col">
        <div class="sentiment-card">
          <div class="card-title">Phân Tích Sắc Thái <i class="fas fa-info-circle info-ic"></i></div>
          <div class="donut-wrap">
            <svg viewBox="0 0 160 160" class="donut-svg">
              <circle cx="80" cy="80" r="58" fill="none" stroke="#f1f5f9" stroke-width="22"/>
              <!-- Positive -->
              <circle cx="80" cy="80" r="58" fill="none" stroke="#16a34a" stroke-width="22" :stroke-dasharray="donutDashArray" stroke-dashoffset="0"/>
              <!-- Neutral -->
              <circle cx="80" cy="80" r="58" fill="none" stroke="#eab308" stroke-width="22" :stroke-dasharray="neutralDashArray" :stroke-dashoffset="neutralDashOffset"/>
              <!-- Negative -->
              <circle cx="80" cy="80" r="58" fill="none" stroke="#dc2626" stroke-width="22" :stroke-dasharray="negativeDashArray" :stroke-dashoffset="negativeDashOffset"/>
              
              <text x="80" y="74" text-anchor="middle" font-size="20" font-weight="800" fill="#1e293b">{{ positivePct }}%</text>
              <text x="80" y="90" text-anchor="middle" font-size="9" fill="#94a3b8">TÍCH CỰC</text>
            </svg>
          </div>
          <div class="legend-col">
            <div class="leg-row"><span class="dot green"></span> Tích cực <strong>{{ sentimentStats.positive }}%</strong></div>
            <div class="leg-row"><span class="dot yellow"></span> Trung lập <strong>{{ sentimentStats.neutral }}%</strong></div>
            <div class="leg-row"><span class="dot red"></span> Tiêu cực <strong>{{ sentimentStats.negative }}%</strong></div>
          </div>
        </div>

        <div class="keyword-card">
          <div class="card-title">Từ Khóa Thảo Luận</div>
          <div class="kw-list">
            <div class="kw-item" v-for="kw in keywords" :key="kw.text">
              <span>{{ kw.text }}</span>
              <div class="kw-bar-wrap"><div class="kw-bar" :style="{width: kw.pct + '%', background: kw.color}"></div></div>
              <span class="kw-count">{{ kw.count }} lượt</span>
            </div>
          </div>
          <div v-if="keywords.length === 0" class="text-center small text-muted py-3">Chưa có dữ liệu từ khóa</div>
        </div>
      </div>

      <!-- Right: Urgent feed -->
      <div class="feed-col">
        <div class="feed-head">
          <strong>Dòng Thời Gian Phản Hồi</strong>
          <div class="feed-meta">
            <span class="ai-live-tag"><i class="fas fa-robot"></i> AI CẬP NHẬT TỨC THÌ</span>
          </div>
        </div>
        <div class="feedback-list">
          <div class="fb-item" v-for="fb in feedbacks" :key="fb.id">
            <div class="fb-header">
              <div class="fb-avatar" :style="{background: fb.avatarBg}">{{ fb.initials }}</div>
              <div class="fb-meta">
                <div class="fb-name">{{ fb.name }}</div>
                <div class="fb-branch">{{ fb.branch }} • {{ fb.time }}</div>
              </div>
              <span class="urgency-tag" :class="fb.urgClass" v-if="fb.urgency !== 'THƯỜNG'">{{ fb.urgency }}</span>
            </div>
            <p class="fb-text">"{{ fb.text }}"</p>
            <div class="fb-tags">
              <span class="hashtag" v-for="t in fb.tags" :key="t">#{{ t }}</span>
            </div>
            <div class="ai-reply">
              <i class="fas fa-robot ai-ic"></i>
              <div>
                <strong>DỰ THẢO HÀNH ĐỘNG AI</strong>
                <p>{{ fb.aiReply }}</p>
              </div>
            </div>
          </div>
          <div v-if="feedbacks.length === 0" class="ai-empty-unified">Chưa có phản hồi nào từ khách hàng</div>
        </div>
      </div>
    </div>
    <div v-else class="ai-empty-unified py-5">
       <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
       <p>Đang tải dữ liệu phản hồi...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TabPhanHoi',
  props: ['aiReport', 'isAiLoading'],
  data() {
    return {
      keywords: [],
      feedbacks: [],
      isLoading: false,
    }
  },
  computed: {
    totalFeedbacks() {
      return this.feedbacks.length;
    },
    csatScore() {
      if (this.totalFeedbacks === 0) return 0;
      const sum = this.feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0);
      return (sum / this.totalFeedbacks).toFixed(1);
    },
    negativePct() {
      if (this.totalFeedbacks === 0) return 0;
      const negCount = this.feedbacks.filter(f => f.ai_sentiment === 'Negative' || f.rating <= 2).length;
      return ((negCount / this.totalFeedbacks) * 100).toFixed(1);
    },
    sentimentStats() {
      if (this.totalFeedbacks === 0) return { positive: 0, neutral: 0, negative: 0 };
      const pos = this.feedbacks.filter(f => f.ai_sentiment === 'Positive' || f.rating >= 4).length;
      const neg = this.feedbacks.filter(f => f.ai_sentiment === 'Negative' || f.rating <= 2).length;
      const neu = this.totalFeedbacks - pos - neg;
      
      return {
        positive: Math.round((pos / this.totalFeedbacks) * 100),
        neutral: Math.round((neu / this.totalFeedbacks) * 100),
        negative: Math.round((neg / this.totalFeedbacks) * 100)
      };
    },
    positivePct() {
      return this.sentimentStats.positive;
    },
    donutDashArray() {
      const p = this.positivePct;
      const total = 364.4; // Circumference
      return `${(p / 100) * total} ${total}`;
    },
    neutralDashOffset() {
      const pPos = this.positivePct;
      const total = 364.4;
      return -((pPos / 100) * total);
    },
    neutralDashArray() {
      const p = this.sentimentStats.neutral;
      const total = 364.4;
      return `${(p / 100) * total} ${total}`;
    },
    negativeDashOffset() {
      const pPos = this.sentimentStats.positive;
      const pNeu = this.sentimentStats.neutral;
      const total = 364.4;
      return -(((pPos + pNeu) / 100) * total);
    },
    negativeDashArray() {
      const p = this.sentimentStats.negative;
      const total = 364.4;
      return `${(p / 100) * total} ${total}`;
    }
  },
  mounted() {
    this.fetchFeedbacks();
  },
  methods: {
    async fetchFeedbacks() {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/member-feedbacks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const list = res.data.data || res.data;
        
        // Map feedbacks
        this.feedbacks = list.map(item => ({
          ...item,
          name: item.user?.full_name || item.user?.name || 'Hội viên ẩn danh',
          initials: (item.user?.name || 'HV').substring(0, 2).toUpperCase(),
          avatarBg: this.getAvatarColor(item.id),
          branch: item.user?.branch?.name || 'Hệ thống SmartGym',
          time: this.formatDate(item.created_at),
          urgency: this.mapUrgency(item.ai_severity),
          urgClass: this.mapUrgencyClass(item.ai_severity),
          text: item.comment,
          tags: item.ai_topic ? [item.ai_topic] : ['Chung'],
          aiReply: item.ai_action_plan || 'AI đang phân tích phản hồi này...',
        }));

        // Extract keywords from ai_topic
        this.extractKeywords(list);

      } catch (error) {
        console.error('Lỗi khi tải phản hồi:', error);
      } finally {
        this.isLoading = false;
      }
    },
    extractKeywords(list) {
      const topics = {};
      list.forEach(item => {
        if (item.ai_topic) {
          topics[item.ai_topic] = (topics[item.ai_topic] || 0) + 1;
        }
      });
      
      const colors = ['#2d7a3a', '#6366f1', '#0ea5e9', '#f59e0b', '#dc2626'];
      let maxCount = 0;
      const sortedTopics = Object.keys(topics).sort((a, b) => topics[b] - topics[a]);
      if (sortedTopics.length > 0) maxCount = topics[sortedTopics[0]];

      this.keywords = sortedTopics.slice(0, 5).map((topic, i) => ({
        text: topic,
        count: topics[topic],
        pct: maxCount > 0 ? Math.round((topics[topic] / maxCount) * 100) : 0,
        color: colors[i % colors.length]
      }));
    },
    mapUrgency(severity) {
      const map = {
        'Critical': 'KHẨN CẤP',
        'High': 'CAO',
        'Medium': 'TRUNG BÌNH',
        'Low': 'THẤP'
      };
      return map[severity] || 'THƯỜNG';
    },
    mapUrgencyClass(severity) {
      if (severity === 'Critical' || severity === 'High') return 'urg-red';
      if (severity === 'Medium') return 'urg-yellow';
      return '';
    },
    getAvatarColor(id) {
      const colors = ['#bfdbfe', '#bbf7d0', '#fde68a', '#e9d5ff', '#fed7aa'];
      return colors[id % colors.length];
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    exportReport() {
      window.print();
    }
  }
}
</script>

<style scoped>
.tab-content { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; }
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-card.accent-purple { background:linear-gradient(135deg,#7c3aed,#6366f1); }
.kpi-label { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.kpi-label-white { font-size:.62rem; font-weight:700; color:rgba(255,255,255,.7); letter-spacing:.4px; margin-bottom:6px; }
.kpi-val { font-size:1.55rem; font-weight:800; color:#1e293b; }
.stars { color:#f59e0b; font-size:1rem; margin-top:2px; }
.kpi-badge { display:inline-flex; align-items:center; gap:3px; font-size:.7rem; font-weight:600; padding:2px 8px; border-radius:20px; margin-top:4px; }
.kpi-badge.up { background:#dcfce7; color:#16a34a; }
.kpi-badge.down { background:#fee2e2; color:#dc2626; }
.ai-kpi-tag { font-size:.72rem; color:rgba(255,255,255,.85); margin-bottom:8px; display:flex; align-items:center; gap:4px; }
.btn-live { background:#fff; color:#7c3aed; border:none; border-radius:8px; padding:6px 12px; font-size:.72rem; font-weight:700; cursor:pointer; letter-spacing:.3px; }
.filter-bar { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.filter-group { display:flex; gap:8px; flex-wrap:wrap; }
.filter-select { display:flex; align-items:center; gap:5px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; font-size:.75rem; color:#94a3b8; cursor:pointer; }
.fval { color:#1e293b; font-weight:500; margin:0 2px; }
.btn-ai-report { background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-size:.8rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:6px; }
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

.body-grid { display:grid; grid-template-columns:260px 1fr; gap:16px; }
.left-col { display:flex; flex-direction:column; gap:14px; }
.sentiment-card,.keyword-card { background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.card-title { font-size:.85rem; font-weight:700; color:#1e293b; margin-bottom:14px; display:flex; align-items:center; gap:6px; }
.info-ic { color:#94a3b8; font-size:.78rem; }
.donut-wrap { display:flex; justify-content:center; }
.donut-svg { width:140px; height:140px; transform:rotate(-90deg); }
.donut-svg text { transform:rotate(90deg); transform-origin:80px 80px; }
.legend-col { display:flex; flex-direction:column; gap:7px; margin-top:14px; }
.leg-row { display:flex; align-items:center; gap:8px; font-size:.78rem; color:#475569; }
.leg-row strong { margin-left:auto; color:#1e293b; }
.dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.dot.green  { background:#16a34a; }
.dot.yellow { background:#eab308; }
.dot.red    { background:#dc2626; }
.kw-list { display:flex; flex-direction:column; gap:10px; }
.kw-item { display:flex; align-items:center; gap:8px; font-size:.76rem; color:#475569; }
.kw-item > span:first-child { min-width:130px; }
.kw-bar-wrap { flex:1; background:#f1f5f9; border-radius:20px; height:6px; overflow:hidden; }
.kw-bar { height:100%; border-radius:20px; }
.kw-count { min-width:54px; text-align:right; color:#94a3b8; font-size:.7rem; }
.feed-col { display:flex; flex-direction:column; gap:14px; }
.feed-head { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:8px; }
.feed-head strong { font-size:.9rem; color:#1e293b; }
.feed-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.ai-live-tag { display:flex; align-items:center; gap:4px; background:#ede9fe; color:#7c3aed; padding:3px 10px; border-radius:20px; font-size:.68rem; font-weight:700; }
.sort-label { font-size:.72rem; color:#94a3b8; }
.sort-val { font-size:.72rem; font-weight:600; color:#2d7a3a; }
.feedback-list { display:flex; flex-direction:column; gap:14px; }
.fb-item { background:#fff; border-radius:12px; padding:16px; box-shadow:0 2px 8px rgba(0,0,0,.05); border-left:3px solid #e2e8f0; }
.fb-header { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.fb-avatar { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.72rem; font-weight:700; color:#1e293b; flex-shrink:0; }
.fb-name { font-size:.82rem; font-weight:700; color:#1e293b; }
.fb-branch { font-size:.7rem; color:#94a3b8; }
.urgency-tag { margin-left:auto; font-size:.65rem; font-weight:700; padding:2px 8px; border-radius:20px; white-space:nowrap; }
.urg-red    { background:#fee2e2; color:#dc2626; }
.urg-yellow { background:#fef9c3; color:#a16207; }
.fb-text { font-size:.78rem; color:#475569; line-height:1.6; margin:0 0 8px; }
.fb-tags { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; }
.hashtag { font-size:.68rem; background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:20px; }
.ai-reply { display:flex; gap:8px; background:#f5f3ff; border-radius:8px; padding:10px 12px; }
.ai-ic { color:#7c3aed; font-size:.82rem; flex-shrink:0; margin-top:2px; }
.ai-reply strong { font-size:.65rem; color:#7c3aed; display:block; margin-bottom:2px; }
.ai-reply p { font-size:.73rem; color:#475569; margin:0; line-height:1.5; }
.feed-footer { background:#f8fafc; border-radius:8px; padding:8px 14px; font-size:.72rem; color:#94a3b8; display:flex; align-items:center; gap:6px; text-align:center; justify-content:center; }
</style>
