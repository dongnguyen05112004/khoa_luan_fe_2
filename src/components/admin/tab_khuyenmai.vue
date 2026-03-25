<template>
  <div class="tab-content">

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">TỶ LỆ CHUYỂN ĐỔI TRỰC TIẾP</div>
        <div class="kpi-val">12.4%</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +2.1% so với hôm qua</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">MÃ KHUYẾN MÃI ĐANG CHẠY</div>
        <div class="kpi-val">18</div>
        <div class="kpi-sub-text">Trên 4 nền tảng</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">DOANH THU ƯỚC TÍNH</div>
        <div class="kpi-val">$12,450</div>
        <div class="kpi-sub-text"><i class="fas fa-calendar-alt"></i> Tháng này</div>
      </div>
      <div class="kpi-card accent-dark">
        <div class="kpi-label-white">ĐIỂM TỐI ƯU AI</div>
        <div class="kpi-val white">94/100</div>
        <div class="kpi-sub-white">Phát hiện HĐ suất đỉnh cao</div>
      </div>
    </div>

    <!-- Section heading -->
    <div class="section-head">
      <div>
        <h2 class="section-title">PHÂN TÍCH HIỆU QUẢ KHUYẾN MÃI</h2>
        <p class="section-sub">Phân tích và tối ưu hóa chi phí tiếp thị phòng tập. Theo dõi phễu chuyển đổi và hiệu quả từng chiến dịch theo thời gian thực.</p>
      </div>
      <div class="head-actions">
        <button class="btn-outline">Xuất báo cáo</button>
        <button class="btn-primary"><i class="fas fa-plus"></i> Chiến dịch mới</button>
      </div>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-icon green"><i class="fas fa-ticket-alt"></i></div>
        <div class="stat-badge-row">
          <span class="stat-trend up">+12% so với nOm ngoài</span>
        </div>
        <div class="stat-label">Tổng mã đã dùng</div>
        <div class="stat-val">3,842</div>
        <p class="stat-desc">Số lượng mã khuyến mãi được quy đổi cho các gói thành viên và huấn luyện cá nhân.</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple"><i class="fas fa-coins"></i></div>
        <div class="stat-badge-row">
          <span class="stat-trend neutral">Trí Vệ</span>
        </div>
        <div class="stat-label">Doanh thu từ khuyến mãi</div>
        <div class="stat-val">$58,290</div>
        <p class="stat-desc">Tổng doanh thu trực tiếp tạo ra từ các lượt đăng ký và nâng cấp có sử dụng mã giảm giá.</p>
      </div>
      <div class="stat-card">
        <div class="stat-icon indigo"><i class="fas fa-percent"></i></div>
        <div class="stat-badge-row">
          <span class="stat-trend purple">TifIm nOng cao</span>
        </div>
        <div class="stat-label">Tỷ lệ chuyển đổi</div>
        <div class="stat-val">21.8%</div>
        <p class="stat-desc">Tỷ lệ chuyển đổi trung bình từ khách hàng tiềm năng trong trang đích sang mua thẻ thành viên.</p>
      </div>
    </div>

    <!-- Bottom grid -->
    <div class="bot-grid">
      <!-- Funnel -->
      <div class="funnel-card">
        <strong class="funnel-title">BIỂU ĐỒ PHỄU CHUYỂN ĐỔI</strong>
        <div class="funnel-item f1">
          <span class="funnel-label">PHÁT HÀNH (TIẾP CẬN)</span>
          <span class="funnel-val">142,500</span>
          <i class="fas fa-bullhorn funnel-ic"></i>
        </div>
        <div class="funnel-item f2">
          <span class="funnel-label">LƯỢT QUAN TÂM</span>
          <span class="funnel-val">32,140</span>
          <i class="fas fa-heart funnel-ic"></i>
        </div>
        <div class="funnel-item f3">
          <span class="funnel-label">LƯỢT CHUYỂN ĐỔI</span>
          <span class="funnel-val">6,842</span>
          <i class="fas fa-shopping-cart funnel-ic"></i>
        </div>
        <div class="ai-note">
          <i class="fas fa-robot ai-ic"></i>
          <div>
            <strong>THÔNG TIN THÔNG MINH TỪ AI</strong>
            <p>Phân tích các giai đoạn chuyển đổi cho thấy sự sụt giảm ở 'Quan tâm' và 'Mua hàng' đã được cải thiện 4% sau khi thay đổi nội dung sáng tạo cho chiến dịch 'Summer Blast'.</p>
          </div>
        </div>
      </div>

      <!-- Campaign table -->
      <div class="camp-card">
        <div class="camp-head">
          <strong>So sánh chiến dịch đang chạy</strong>
          <p class="camp-sub">Chi tiết hiệu suất theo nền tảng và loại chiến dịch.</p>
        </div>
        <table class="camp-table">
          <thead>
            <tr>
              <th>TÊN CHIẾN DỊCH</th>
              <th>LƯỢT DÙNG</th>
              <th>CTR</th>
              <th>TRẠNG THÁI</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in campaigns" :key="c.name">
              <td>
                <div class="camp-name-cell">
                  <span class="camp-icon" :style="{background: c.iconBg}">{{ c.icon }}</span>
                  <div>
                    <div class="cname">{{ c.name }}</div>
                    <div class="ctype">{{ c.type }}</div>
                  </div>
                </div>
              </td>
              <td class="num">{{ c.uses.toLocaleString() }}</td>
              <td class="num">{{ c.ctr }}%</td>
              <td><span class="status-tag" :class="c.statusClass">{{ c.status }}</span></td>
              <td class="num roi">{{ c.roi }}x</td>
            </tr>
          </tbody>
        </table>
        <div class="view-all"><a href="#">Xem tất cả 18 chiến dịch →</a></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabKhuyenMai',
  data() {
    return {
      campaigns: [
        { name: 'Summer Blast 2024', type: 'HIỆU QUẢ NHẤT', icon: '☀', iconBg: '#fef9c3', uses: 1240, ctr: 5.8, status: 'Đang chạy', statusClass: 'st-green', roi: 3.2 },
        { name: 'Retargeting Ad B', type: 'META ADS', icon: 'B', iconBg: '#dbeafe', uses: 842, ctr: 2.1, status: 'Đang chạy', statusClass: 'st-green', roi: 1.8 },
        { name: 'Influencer Collab', type: 'ORGANIC SOCIAL', icon: '✦', iconBg: '#ede9fe', uses: 412, ctr: 12.4, status: 'Đã kết thúc', statusClass: 'st-gray', roi: 2.4 },
        { name: 'Win-back Email', type: 'EMAIL MARKETING', icon: '✉', iconBg: '#d1fae5', uses: 211, ctr: 18.2, status: 'Đang chạy', statusClass: 'st-green', roi: 4.1 },
      ],
    }
  },
}
</script>

<style scoped>
.tab-content { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; }
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-card.accent-dark { background:linear-gradient(135deg,#1e293b,#0f172a); }
.kpi-label { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.kpi-label-white { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.kpi-val { font-size:1.55rem; font-weight:800; color:#1e293b; }
.kpi-val.white { color:#fff; }
.kpi-badge { display:inline-flex; align-items:center; gap:3px; font-size:.7rem; font-weight:600; padding:2px 8px; border-radius:20px; margin-top:4px; }
.kpi-badge.up { background:#dcfce7; color:#16a34a; }
.kpi-sub-text { font-size:.72rem; color:#94a3b8; margin-top:4px; }
.kpi-sub-white { font-size:.72rem; color:#94a3b8; margin-top:4px; }
.section-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
.section-title { margin:0; font-size:1.2rem; font-weight:900; color:#1e293b; letter-spacing:-.3px; }
.section-sub { margin:4px 0 0; font-size:.78rem; color:#94a3b8; max-width:520px; }
.head-actions { display:flex; gap:10px; }
.btn-outline { background:#fff; border:1.5px solid #2d7a3a; color:#2d7a3a; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.btn-primary { background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:5px; }

/* Stats */
.stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
.stat-card { background:#fff; border-radius:12px; padding:18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.stat-icon { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; font-size:.9rem; margin-bottom:8px; }
.stat-icon.green  { background:#16a34a; }
.stat-icon.purple { background:#7c3aed; }
.stat-icon.indigo { background:#6366f1; }
.stat-badge-row { margin-bottom:4px; }
.stat-trend { font-size:.68rem; font-weight:700; padding:2px 8px; border-radius:20px; }
.stat-trend.up      { background:#dcfce7; color:#16a34a; }
.stat-trend.neutral { background:#f1f5f9; color:#64748b; }
.stat-trend.purple  { background:#ede9fe; color:#7c3aed; }
.stat-label { font-size:.72rem; color:#94a3b8; margin-bottom:4px; }
.stat-val { font-size:1.6rem; font-weight:800; color:#1e293b; margin-bottom:6px; }
.stat-desc { font-size:.72rem; color:#94a3b8; line-height:1.5; margin:0; }

/* Bottom grid */
.bot-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }

/* Funnel */
.funnel-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); display:flex; flex-direction:column; gap:10px; }
.funnel-title { font-size:.75rem; font-weight:700; color:#1e293b; letter-spacing:.3px; }
.funnel-item { display:flex; align-items:center; justify-content:space-between; border-radius:10px; padding:12px 16px; color:#fff; }
.f1 { background:linear-gradient(135deg,#2d7a3a,#166534); }
.f2 { background:linear-gradient(135deg,#1e5c28,#0f3d1a); width:88%; }
.f3 { background:linear-gradient(135deg,#7c3aed,#6366f1); width:72%; }
.funnel-label { font-size:.72rem; font-weight:600; }
.funnel-val { font-size:1.1rem; font-weight:800; }
.funnel-ic { font-size:.9rem; opacity:.7; }
.ai-note { display:flex; gap:10px; background:#f5f3ff; border-radius:10px; padding:12px; margin-top:4px; }
.ai-ic { color:#7c3aed; font-size:.9rem; flex-shrink:0; margin-top:2px; }
.ai-note strong { font-size:.72rem; color:#7c3aed; display:block; margin-bottom:4px; }
.ai-note p { font-size:.72rem; color:#475569; margin:0; line-height:1.5; }

/* Campaign */
.camp-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.camp-head strong { font-size:.9rem; color:#1e293b; }
.camp-sub { font-size:.72rem; color:#94a3b8; margin:2px 0 16px; }
.camp-table { width:100%; border-collapse:collapse; font-size:.78rem; }
.camp-table th { text-align:left; font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:8px 8px; border-bottom:1px solid #f1f5f9; }
.camp-table td { padding:10px 8px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.camp-name-cell { display:flex; align-items:center; gap:8px; }
.camp-icon { width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.75rem; font-weight:700; flex-shrink:0; }
.cname { font-size:.78rem; font-weight:600; color:#1e293b; }
.ctype { font-size:.62rem; color:#94a3b8; }
.num { color:#1e293b; font-weight:600; }
.roi { color:#2d7a3a; font-weight:700; }
.status-tag { font-size:.65rem; font-weight:700; padding:2px 8px; border-radius:20px; white-space:nowrap; }
.st-green { background:#dcfce7; color:#16a34a; }
.st-gray  { background:#f1f5f9; color:#64748b; }
.view-all { text-align:center; margin-top:12px; }
.view-all a { font-size:.78rem; color:#2d7a3a; font-weight:600; text-decoration:none; }
</style>
