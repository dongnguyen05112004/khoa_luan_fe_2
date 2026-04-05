<template>
  <div class="tab-content">

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">TỔNG PHẢN HỒI (30 NGÀY)</div>
        <div class="kpi-val">1,248</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +12%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CHỈ SỐ HÀI LÒNG (CSAT)</div>
        <div class="kpi-val">4.8/5</div>
        <div class="stars">★★★★★</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">TỶ LỆ TIÊU CỰC</div>
        <div class="kpi-val">3.2%</div>
        <div class="kpi-badge down"><i class="fas fa-caret-down"></i> -0.5%</div>
      </div>
      <div class="kpi-card accent-purple">
        <div class="kpi-label-white">Phân tích AI tức thì</div>
        <div class="ai-kpi-tag"><i class="fas fa-robot"></i> Phân tích tày mốc đang ưu tiên</div>
        <button class="btn-live">PHÂN TÍCH TRỰC TIẾP</button>
      </div>
    </div>

    <!-- Filters + CTA -->
    <div class="filter-bar">
      <div class="filter-group">
        <div class="filter-select"><span>Chi nhánh</span><span class="fval">Tất cả chi nhánh</span><i class="fas fa-chevron-down"></i></div>
        <div class="filter-select"><span>Chủ đề</span><span class="fval">Tất cả chủ đề</span><i class="fas fa-chevron-down"></i></div>
        <div class="filter-select"><span>Mức độ Khẩn Cấp</span><span class="fval">Mọi cấp độ</span><i class="fas fa-chevron-down"></i></div>
      </div>
      <button class="btn-ai-report"><i class="fas fa-robot"></i> Tạo Báo Cáo AI</button>
    </div>

    <!-- Body -->
    <div class="body-grid">
      <!-- Left: Sentiment + Keywords -->
      <div class="left-col">
        <div class="sentiment-card">
          <div class="card-title">Phân Tích Sắc Thái <i class="fas fa-info-circle info-ic"></i></div>
          <div class="donut-wrap">
            <svg viewBox="0 0 160 160" class="donut-svg">
              <circle cx="80" cy="80" r="58" fill="none" stroke="#f1f5f9" stroke-width="22"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#16a34a" stroke-width="22" stroke-dasharray="273.3 364.4" stroke-dashoffset="0"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#eab308" stroke-width="22" stroke-dasharray="54.7 364.4" stroke-dashoffset="-273.3"/>
              <circle cx="80" cy="80" r="58" fill="none" stroke="#dc2626" stroke-width="22" stroke-dasharray="36.4 364.4" stroke-dashoffset="-328"/>
              <text x="80" y="74" text-anchor="middle" font-size="20" font-weight="800" fill="#1e293b">91%</text>
              <text x="80" y="90" text-anchor="middle" font-size="9" fill="#94a3b8">TÍCH CỰC</text>
            </svg>
          </div>
          <div class="legend-col">
            <div class="leg-row"><span class="dot green"></span> Tích cực (Khen ngợi) <strong>75%</strong></div>
            <div class="leg-row"><span class="dot yellow"></span> Trung lập <strong>15%</strong></div>
            <div class="leg-row"><span class="dot red"></span> Tiêu cực (Phản nàn) <strong>10%</strong></div>
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
        </div>
      </div>

      <!-- Right: Urgent feed -->
      <div class="feed-col">
        <div class="feed-head">
          <strong>Dòng Thời Gian Phản Hồi Khẩn Cấp</strong>
          <div class="feed-meta">
            <span class="ai-live-tag"><i class="fas fa-robot"></i> AI CẬP NHẬT 2 PHÚT TRƯỚC</span>
            <span class="sort-label">Sắp xếp theo:</span>
            <span class="sort-val">Ưu tiên nhất</span>
          </div>
        </div>
        <div class="feedback-list">
          <div class="fb-item" v-for="fb in feedbacks" :key="fb.name">
            <div class="fb-header">
              <div class="fb-avatar" :style="{background: fb.avatarBg}">{{ fb.initials }}</div>
              <div class="fb-meta">
                <div class="fb-name">{{ fb.name }}</div>
                <div class="fb-branch">{{ fb.branch }} • {{ fb.time }}</div>
              </div>
              <span class="urgency-tag" :class="fb.urgClass">{{ fb.urgency }}</span>
            </div>
            <p class="fb-text">"{{ fb.text }}"</p>
            <div class="fb-tags">
              <span class="hashtag" v-for="t in fb.tags" :key="t">#{{ t }}</span>
            </div>
            <div class="ai-reply">
              <i class="fas fa-robot ai-ic"></i>
              <div>
                <strong>TƯ VẤN AI</strong>
                <p>{{ fb.aiReply }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="feed-footer">
          <i class="fas fa-robot"></i> AI đang phân tích 24 phản hồi mới
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabPhanHoi',
  data() {
    return {
      keywords: [
        { text: 'Vệ sinh phòng tập', count: 420, pct: 100, color: '#2d7a3a' },
        { text: 'Chất lượng máy móc', count: 312, pct: 74, color: '#6366f1' },
        { text: 'Thái độ Huấn luyện viên', count: 245, pct: 58, color: '#0ea5e9' },
        { text: 'Giá cả gói tập', count: 112, pct: 27, color: '#f59e0b' },
      ],
      feedbacks: [
        {
          name: 'Trần Hoàng', initials: 'TH', avatarBg: '#bfdbfe', branch: 'Phòng tập Q1', time: '15 phút trước',
          urgency: 'KHẨN CẤP', urgClass: 'urg-red',
          text: 'Máy chạy bộ số 3 ở tầng 1 phát ra tiếng két két rất lớn khi chạy tốc độ cao. Tôi suýt bị trượt chân và có thể bị ngã. Đề nghị kỹ thuật kiểm tra ngay tránh tai nạn.',
          tags: ['MayMoc', 'AnToan'],
          aiReply: 'Cần kiểm tra máy chạy số 3 và báo tì toàn bộ tình trạng máy cardio tại chi nhánh Q1 trong hôm nay.',
        },
        {
          name: 'Lê Mai Anh', initials: 'LA', avatarBg: '#bbf7d0', branch: 'Phòng tập Q7', time: '1 giờ trước',
          urgency: 'TRUNG BÌNH', urgClass: 'urg-yellow',
          text: 'Cực kỳ hài lòng với PT Tuấn ở chi nhánh Q7. Hướng dẫn rất tận tâm, theo sát từng buổi tập của mình. Nhờ vậy mà mình đã giảm được 2kg chỉ sau 1 tháng.',
          tags: ['CoachTuan', 'GiamCan', 'PT_Q7'],
          aiReply: 'Ghi nhận thành tích của Coach Tuấn vào hệ thống thưởng tháng. Sử dụng lời khen này làm nội dung truyền thông cho Q7.',
        },
        {
          name: 'Nguyễn Quốc', initials: 'NQ', avatarBg: '#fde68a', branch: 'Phòng tập Q3', time: '3 giờ trước',
          urgency: 'TRUNG BÌNH', urgClass: 'urg-yellow',
          text: 'Phòng tắm hôm qua hơi có mùi lạ, hình như hệ thống thông gió đang gặp vấn đề. Nhờ phòng tập xem lại giúp.',
          tags: ['VeSinh', 'CoSoVatChat'],
          aiReply: 'Nhắc nhở đội ngũ tập vụ kiểm tra khu vực nhà tắm mỗi 2 tiếng thay vì 4 tiếng như hiện tại.',
        },
      ],
    }
  },
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
