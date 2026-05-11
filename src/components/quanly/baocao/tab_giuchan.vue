<template>
  <div class="tab-content">

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card accent-green">
        <div class="kpi-label">TỶ LỆ AN TOÀN TỔNG THỂ</div>
        <div class="kpi-val">{{ riskPercentages.green || 0 }}%</div>
        <div class="kpi-badge up" v-if="riskPercentages.green >= 50"><i class="fas fa-check"></i> Ổn định</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">SỐ LƯỢNG NGUY CƠ CAO (ĐỎ)</div>
        <div class="kpi-val red">{{ riskCounts.red || 0 }} <span class="unit">Hội viên</span></div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">NHÓM CẦN LƯU Ý (VÀNG)</div>
        <div class="kpi-val">{{ riskCounts.yellow || 0 }} <span class="unit-badge yellow">{{ riskPercentages.yellow || 0 }}%</span></div>
      </div>
      <div class="kpi-card accent-dark">
        <div class="kpi-label">TỔNG PHÂN TÍCH</div>
        <div class="kpi-val white">{{ totalMembers }}</div>
        <div class="kpi-line-mini">
          <svg viewBox="0 0 80 18" preserveAspectRatio="none"><polyline points="0,14 15,10 30,12 45,6 60,8 80,4" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>

    <!-- Section header -->
    <div class="section-bar">
      <h3 class="section-title">Phân tích tỷ lệ giữ chân hội viên</h3>
      <div class="section-actions">
        <div class="filter-select">
          <span>Chi nhánh Quận 1</span><i class="fas fa-chevron-down"></i>
        </div>
        <div class="filter-select">
          <span>30 ngày qua</span><i class="fas fa-chevron-down"></i>
        </div>
        <button class="btn-export"><i class="fas fa-download"></i> Xuất báo cáo</button>
      </div>
    </div>

    <!-- Main body -->
    <div class="body-grid">
      <!-- Donut chart -->
      <div class="donut-card">
        <div class="donut-header">
          <strong>Phân khúc rủi ro rời bỏ</strong>
          <i class="fas fa-info-circle info-ic"></i>
        </div>
        <div class="donut-sub">Phân loại rủi ro bằng AI</div>
        <div class="donut-wrap">
          <svg viewBox="0 0 160 160" class="donut-svg">
            <!-- Background ring -->
            <circle cx="80" cy="80" r="58" fill="none" stroke="#f1f5f9" stroke-width="22"/>
            <!-- Segments (circumference ≈ 364.4) -->
            <!-- An toàn -->
            <circle cx="80" cy="80" r="58" fill="none" stroke="#16a34a" stroke-width="22"
              :stroke-dasharray="donutDashArrays.green" stroke-dashoffset="0" stroke-linecap="butt"/>
            <!-- Cần lưu ý -->
            <circle cx="80" cy="80" r="58" fill="none" stroke="#eab308" stroke-width="22"
              :stroke-dasharray="donutDashArrays.yellow" :stroke-dashoffset="donutDashArrays.yellowOffset" stroke-linecap="butt"/>
            <!-- Nguy cơ cao -->
            <circle cx="80" cy="80" r="58" fill="none" stroke="#dc2626" stroke-width="22"
              :stroke-dasharray="donutDashArrays.red" :stroke-dashoffset="donutDashArrays.redOffset" stroke-linecap="butt"/>
            <text x="80" y="74" text-anchor="middle" font-size="22" font-weight="800" fill="#1e293b">{{ totalMembers }}</text>
            <text x="80" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">TỔNG ĐÁNH GIÁ</text>
          </svg>
        </div>
        <div class="donut-legend">
          <div class="legend-item"><span class="dot red"></span> Nguy cơ cao (Đỏ) <strong>{{ riskPercentages.red || 0 }}%</strong></div>
          <div class="legend-item"><span class="dot yellow"></span> Cần lưu ý (Vàng) <strong>{{ riskPercentages.yellow || 0 }}%</strong></div>
          <div class="legend-item"><span class="dot green"></span> An toàn (Xanh) <strong>{{ riskPercentages.green || 0 }}%</strong></div>
        </div>
      </div>

      <!-- At-risk member list -->
      <div class="list-card">
        <div class="list-header">
          <strong>Danh sách hội viên rủi ro cần chú ý</strong>
          <button class="btn-ai-badge" @click="runChurnPrediction" :disabled="isAiPredicting">
            <i class="fas" :class="isAiPredicting ? 'fa-spinner fa-spin' : 'fa-robot'"></i> 
            {{ isAiPredicting ? 'ĐANG PHÂN TÍCH...' : 'AI PHÂN TÍCH RỦI RO' }}
          </button>
        </div>
        <table class="member-table">
          <thead>
            <tr>
              <th>ID HỘI VIÊN</th>
              <th>NHÃN RỦI RO</th>
              <th>BIẾN ĐỘNG CHỈ SỐ</th>
              <th>ĐIỂM SỨC KHỎE</th>
              <th>HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in members" :key="m.id">
              <td>
                <div class="member-id-cell">
                  <div class="avatar" :style="{background: m.avatarColor}">{{ m.initials }}</div>
                  <div>
                    <div class="mid">{{ m.id }}</div>
                    <div class="mname">{{ m.name }}</div>
                  </div>
                </div>
              </td>
              <td><span class="tag" :class="m.riskClass">{{ m.risk }}</span></td>
              <td>
                <div class="metric-cell">
                  <span :class="m.metricBad ? 'red-text' : 'green-text'">{{ m.metric }}</span>
                  <span class="metric-label">check-in</span>
                </div>
              </td>
              <td>
                <div class="health-cell">
                  <span :class="m.healthClass">{{ m.health }}</span>
                </div>
              </td>
              <td>
                <button class="btn-action" @click="openModal(m)">Xem tư vấn AI</button>
              </td>
            </tr>
            <tr v-if="members.length === 0">
              <td colspan="5" class="text-center py-4 text-muted">Chưa có dữ liệu phân tích. Vui lòng chạy "AI Phân Tích Rủi Ro".</td>
            </tr>
          </tbody>
        </table>
        <div class="table-footer">
          <span class="table-note">Đang hiển thị {{ members.length }} hội viên</span>
        </div>
      </div>
    </div>

    <!-- AI Consultation Modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-title-box">
            <div class="avatar-lg" :style="{background: selectedMember?.avatarColor}">{{ selectedMember?.initials }}</div>
            <div>
              <h4 style="margin:0; font-size:1.1rem;">AI Tư vấn - {{ selectedMember?.name }}</h4>
              <span class="tag" :class="selectedMember?.riskClass" style="margin-top:4px;">{{ selectedMember?.risk }}</span>
            </div>
          </div>
          <button class="btn-close" @click="closeModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="ai-box">
            <strong class="text-purple"><i class="fas fa-brain"></i> CHUẨN ĐOÁN RỦI RO</strong>
            <p>{{ selectedMember?.diagnosis || 'Không có chẩn đoán' }}</p>
          </div>
          <div class="ai-box action-box mt-3">
            <strong class="text-green"><i class="fas fa-bolt"></i> HÀNH ĐỘNG ĐỀ XUẤT TỪ AI</strong>
            <ul class="suggestion-list">
              <li v-for="(sug, idx) in selectedMember?.suggestions" :key="idx">
                <i class="fas fa-check-circle text-green mr-2"></i> {{ sug }}
              </li>
              <li v-if="!selectedMember?.suggestions?.length" class="text-muted">Không có đề xuất hành động.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TabGiuChan',
  data() {
    return {
      isAiPredicting: false,
      members: [],
      selectedMember: null,
      showModal: false,
    }
  },
  computed: {
    totalMembers() {
      return this.members.length;
    },
    riskCounts() {
      const counts = { red: 0, yellow: 0, green: 0 };
      this.members.forEach(m => {
        if (m.riskClass === 'tag-red') counts.red++;
        else if (m.riskClass === 'tag-yellow') counts.yellow++;
        else if (m.riskClass === 'tag-green') counts.green++;
      });
      return counts;
    },
    riskPercentages() {
      const total = this.totalMembers || 1;
      return {
        red: Math.round((this.riskCounts.red / total) * 100),
        yellow: Math.round((this.riskCounts.yellow / total) * 100),
        green: Math.round((this.riskCounts.green / total) * 100),
      };
    },
    donutDashArrays() {
      const total = 364.4;
      const greenVal = (this.riskPercentages.green / 100) * total;
      const yellowVal = (this.riskPercentages.yellow / 100) * total;
      const redVal = (this.riskPercentages.red / 100) * total;
      
      return {
        green: `${greenVal} ${total}`,
        yellow: `${yellowVal} ${total}`,
        red: `${redVal} ${total}`,
        greenOffset: 0,
        yellowOffset: -greenVal,
        redOffset: -(greenVal + yellowVal)
      };
    }
  },
  mounted() {
    this.fetchChurnPredictions();
  },
  methods: {
    async fetchChurnPredictions() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://127.0.0.1:8000/api/ai-recommendations', {
          params: { type: 'Churn Prediction', per_page: 500 },
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data && res.data.data && res.data.data.length > 0) {
          const colors = ['#bfdbfe', '#fde68a', '#a7f3d0', '#fbcfe8', '#ddd6fe'];
          this.members = res.data.data.map((rec, index) => {
            const riskLevel = rec.title.replace('Dự báo rủi ro rời bỏ: Mức độ ', '');
            let riskClass = 'tag-yellow';
            let healthClass = 'health-yellow';
            if (riskLevel === 'Đỏ') {
              riskClass = 'tag-red';
              healthClass = 'health-red';
            } else if (riskLevel === 'Xanh') {
              riskClass = 'tag-green';
              healthClass = 'health-green';
            }
            return {
              id: `#SG-${rec.user_id}`,
              name: rec.user ? rec.user.full_name : 'Hội viên ' + rec.user_id,
              initials: rec.user && rec.user.full_name ? rec.user.full_name.substring(0, 2).toUpperCase() : 'HV',
              avatarColor: colors[index % colors.length],
              risk: riskLevel === 'Đỏ' ? 'Nguy cơ cao' : (riskLevel === 'Xanh' ? 'An toàn' : 'Cần lưu ý'),
              riskClass: riskClass,
              metric: 'Phân tích từ AI',
              metricBad: riskLevel === 'Đỏ',
              health: 'Cập nhật',
              healthClass: healthClass,
              diagnosis: rec.ai_diagnosis,
              suggestions: rec.ai_suggestions ? rec.ai_suggestions.split('\n').map(s => s.replace(/^- /, '').replace(/^\* /, '')).filter(s => s.trim() !== '') : []
            };
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu Churn Prediction', error);
      }
    },
    async runChurnPrediction() {
      this.isAiPredicting = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://127.0.0.1:8000/api/admin/churn-prediction', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Phân tích AI hoàn tất! ' + res.data.count + ' hội viên đã được đánh giá.');
        this.fetchChurnPredictions();
      } catch (error) {
        console.error('Lỗi phân tích AI', error);
        alert(error.response?.data?.message || 'Có lỗi xảy ra khi phân tích AI');
      } finally {
        this.isAiPredicting = false;
      }
    },
    openModal(member) {
      this.selectedMember = member;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedMember = null;
    }
  }
}
</script>

<style scoped>
.tab-content { display: flex; flex-direction: column; gap: 20px; font-family: 'Segoe UI', sans-serif; }

/* KPI */
.kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
.kpi-card { background:#fff; border-radius:14px; padding:18px 20px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-card.accent-green { background: linear-gradient(135deg,#f0fdf4,#dcfce7); border:1px solid #bbf7d0; }
.kpi-card.accent-dark  { background: linear-gradient(135deg,#1e293b,#0f172a); }
.kpi-label { font-size:.65rem; font-weight:700; color:#94a3b8; letter-spacing:.5px; margin-bottom:6px; }
.kpi-val { font-size:1.7rem; font-weight:800; color:#1e293b; line-height:1.1; }
.kpi-val.red { color:#dc2626; }
.kpi-val.white { color:#fff; }
.unit { font-size:.85rem; font-weight:400; color:#64748b; }
.kpi-badge { display:inline-flex; align-items:center; gap:3px; font-size:.72rem; font-weight:600; padding:2px 8px; border-radius:20px; margin-top:6px; }
.kpi-badge.up { background:#dcfce7; color:#16a34a; }
.unit-badge { font-size:.75rem; font-weight:600; color:#dc2626; }
.unit-badge.down { color:#dc2626; }
.kpi-line-mini { margin-top:8px; height:18px; }
.kpi-line-mini svg { width:100%; height:100%; }

/* Section bar */
.section-bar { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.section-title { margin:0; font-size:1rem; font-weight:700; color:#1e293b; }
.section-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.filter-select { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:6px 12px; font-size:.8rem; color:#475569; cursor:pointer; }
.filter-select i { font-size:.7rem; }
.btn-export { display:flex; align-items:center; gap:6px; background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:7px 14px; font-size:.8rem; font-weight:600; cursor:pointer; }
.btn-export:hover { opacity:.88; }

/* Body */
.body-grid { display:grid; grid-template-columns:260px 1fr; gap:16px; }

/* Donut */
.donut-card { background:#fff; border-radius:14px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.donut-header { display:flex; align-items:center; gap:8px; margin-bottom:2px; }
.donut-header strong { font-size:.86rem; color:#1e293b; }
.info-ic { color:#94a3b8; font-size:.8rem; }
.donut-sub { font-size:.72rem; color:#94a3b8; margin-bottom:14px; }
.donut-wrap { display:flex; justify-content:center; }
.donut-svg { width:160px; height:160px; transform:rotate(-90deg); }
.donut-svg text { transform:rotate(90deg) translateX(-160px); transform-origin:80px 80px; }
.donut-legend { display:flex; flex-direction:column; gap:8px; margin-top:16px; }
.legend-item { display:flex; align-items:center; gap:8px; font-size:.8rem; color:#475569; }
.legend-item strong { margin-left:auto; color:#1e293b; }
.dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
.dot.red { background:#dc2626; }
.dot.yellow { background:#eab308; }
.dot.green { background:#16a34a; }

/* List */
.list-card { background:#fff; border-radius:14px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); overflow:hidden; }
.list-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:8px; }
.list-header strong { font-size:.9rem; color:#1e293b; }
.btn-ai-badge { display:flex; align-items:center; gap:5px; background:#ede9fe; color:#7c3aed; border:none; border-radius:20px; padding:4px 12px; font-size:.7rem; font-weight:700; cursor:pointer; }
.member-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.member-table th { text-align:left; font-size:.65rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:8px 10px; border-bottom:1px solid #f1f5f9; }
.member-table td { padding:12px 10px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.member-id-cell { display:flex; align-items:center; gap:8px; }
.avatar { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.65rem; font-weight:700; color:#1e293b; flex-shrink:0; }
.mid { font-weight:700; font-size:.78rem; color:#1e293b; }
.mname { font-size:.7rem; color:#94a3b8; }
.tag { display:inline-block; padding:2px 8px; border-radius:20px; font-size:.68rem; font-weight:700; }
.tag-red { background:#fee2e2; color:#dc2626; }
.tag-yellow { background:#fef9c3; color:#a16207; }
.tag-green { background:#dcfce7; color:#16a34a; }
.metric-cell { display:flex; flex-direction:column; gap:2px; }
.metric-label { font-size:.65rem; color:#94a3b8; }
.red-text { color:#dc2626; font-weight:700; }
.green-text { color:#16a34a; font-weight:700; }
.health-red { color:#dc2626; font-size:.75rem; font-weight:600; }
.health-yellow { color:#a16207; font-size:.75rem; font-weight:600; }
.health-green { color:#16a34a; font-size:.75rem; font-weight:600; }
.btn-action { background:linear-gradient(135deg,#6366f1,#7c3aed); color:#fff; border:none; border-radius:8px; padding:5px 10px; font-size:.72rem; font-weight:600; cursor:pointer; white-space:nowrap; }
.btn-action:hover { opacity:.88; }
.table-footer { display:flex; align-items:center; justify-content:space-between; margin-top:14px; flex-wrap:wrap; gap:8px; }
.table-note { font-size:.72rem; color:#94a3b8; }
.pagination { display:flex; gap:4px; }
.pg-btn { width:28px; height:28px; border:1px solid #e2e8f0; background:#fff; border-radius:6px; font-size:.75rem; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center; }
.pg-btn.active { background:#2d7a3a; color:#fff; border-color:#2d7a3a; }

/* Modal AI Styles */
.modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,.6); display:flex; align-items:center; justify-content:center; z-index:1000; backdrop-filter:blur(4px); }
.modal-content { background:#fff; width:90%; max-width:600px; border-radius:16px; overflow:hidden; box-shadow:0 20px 40px rgba(0,0,0,.15); display:flex; flex-direction:column; animation:slideUp .3s ease; }
@keyframes slideUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
.modal-header { padding:20px 24px; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; background:#f8fafc; }
.modal-title-box { display:flex; align-items:center; gap:12px; }
.avatar-lg { width:46px; height:46px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:800; color:#1e293b; }
.btn-close { background:none; border:none; font-size:1.2rem; color:#94a3b8; cursor:pointer; }
.btn-close:hover { color:#1e293b; }
.modal-body { padding:24px; max-height:60vh; overflow-y:auto; }
.ai-box { background:#f8fafc; border-radius:12px; padding:16px; border:1px solid #e2e8f0; }
.ai-box strong { font-size:.85rem; display:block; margin-bottom:10px; }
.ai-box p { margin:0; font-size:.85rem; color:#475569; line-height:1.6; }
.action-box { background:#f0fdf4; border-color:#bbf7d0; }
.suggestion-list { margin:0; padding:0; list-style:none; display:flex; flex-direction:column; gap:8px; }
.suggestion-list li { font-size:.85rem; color:#16a34a; display:flex; align-items:flex-start; line-height:1.5; }
.text-purple { color:#7c3aed; }
.text-green { color:#16a34a; }
.mr-2 { margin-right:8px; margin-top:2px; }
.mt-3 { margin-top:16px; }
</style>
