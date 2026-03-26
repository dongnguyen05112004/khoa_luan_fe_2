<template>
  <div class="tab-content">

    <!-- KPI row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">TỔNG THIẾT BỊ</div>
        <div class="kpi-val">142</div>
        <div class="kpi-badge up"><i class="fas fa-caret-up"></i> +4%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">CẦN BẢO TRÌ</div>
        <div class="kpi-val red">12</div>
        <div class="kpi-sub-text">0.4%</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">HIỆU SUẤT VẬN HÀNH</div>
        <div class="kpi-val">92%</div>
        <div class="kpi-sub-text">↑ 1nt</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">NGÂN SÁCH BẢO TRÌ</div>
        <div class="kpi-val">45.2M</div>
        <div class="kpi-sub-text">VND/Tháng</div>
      </div>
    </div>

    <!-- Filter + CTA -->
    <div class="filter-bar">
      <div class="filter-group">
        <div class="filter-select">
          <span>Thiết bị (Equipment)</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="filter-date">
          <i class="fas fa-calendar-alt"></i>
          <span>11/01/2023 → 11/30/2023</span>
        </div>
      </div>
      <button class="btn-refresh"><i class="fas fa-sync-alt"></i> Khởi tạo dữ liệu</button>
    </div>

    <!-- Section title -->
    <h3 class="data-title">Dữ liệu thô từ hệ thống</h3>

    <!-- Equipment table -->
    <div class="equip-card">
      <table class="equip-table">
        <thead>
          <tr>
            <th>ID MÁY</th>
            <th>TÊN MÁY</th>
            <th>TRẠNG THÁI</th>
            <th>NGÀY BẢO TRÌ</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in equipment" :key="e.id">
            <td class="eid">{{ e.id }}</td>
            <td class="ename">{{ e.name }}</td>
            <td><span class="status-tag" :class="e.stClass">{{ e.status }}</span></td>
            <td class="edate">{{ e.date }}</td>
            <td><button class="btn-view"><i class="fas fa-eye"></i></button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- AI analysis block -->
    <div class="ai-block">
      <div class="ai-block-head">
        <div class="ai-block-icon"><i class="fas fa-robot"></i></div>
        <strong>Phân tích chiến lược từ Gemini AI</strong>
      </div>
      <div class="ai-cols">
        <div class="ai-col">
          <div class="ai-col-title">TÌNH TRẠNG HIỆN TẠI</div>
          <p>Hệ thống ghi nhận 8.4% thiết bị đang trong tình trạng cảnh báo hoặc ngưng hoạt động. Các cụm máy cardio (máy chạy bộ) có tần suất sử dụng nhiệt độ cao, cần điều chỉnh lưng gió điều hòa khu vực này.</p>
        </div>
        <div class="ai-col">
          <div class="ai-col-title">DỰ BÁO CHI PHÍ BẢO TRÌ</div>
          <p>Dựa trên dữ liệu lịch sử, dự kiến ngân sách bảo trì tháng tới sẽ tăng 15% do chu kỳ thay đại cắp cho các giàn tạ Matrix. Nghị đàm phán sớm với nhà cung cấp để kiện hiệu bảo trì định kỳ hàng năm.</p>
        </div>
        <div class="ai-col">
          <div class="ai-col-title">ĐỀ XUẤT LỊCH SỬA CHỮA</div>
          <p>Ưu tiên xử lý 2 máy chạy bộ mã EQP-0089 và EQP-0091 trong 48h tới để đảm bảo công suất phục vụ giờ cao điểm. Các thiết bị tạ tay có thể đời lịch bảo trì sang tuần thứ 3 của tháng để tối ưu nhân sự kỹ thuật.</p>
        </div>
      </div>
      <div class="ai-footer-note">
        <i class="fas fa-circle-notch fa-spin"></i> AI đang liên tục cập nhật dữ liệu từ cảm biến IOT thiết bị...
      </div>
    </div>

    <!-- Bottom action bar -->
    <div class="bottom-bar">
      <label class="checkbox-label">
        <input type="checkbox" checked /> Lưu vào lịch sX báo cáo
      </label>
      <div class="export-btns">
        <button class="btn-excel"><i class="fas fa-file-excel"></i> Xuất Excel</button>
        <button class="btn-pdf"><i class="fas fa-file-pdf"></i> Xuất PDF</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'TabBaoCao',
  data() {
    return {
      equipment: [
        { id: 'EQP-0642', name: 'Máy chạy bộ ProForm L6', status: 'Tốt', stClass: 'st-green', date: '12/12/2023' },
        { id: 'EQP-0089', name: 'Giàn tạ đa năng Matrix G3', status: 'Hỏng', stClass: 'st-red', date: '28/10/2023' },
        { id: 'EQP-0112', name: 'Xe đạp tập Peloton Bike+', status: 'Tốt', stClass: 'st-green', date: '15/01/2024' },
      ],
    }
  },
}
</script>

<style scoped>
.tab-content { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; }
.kpi-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
.kpi-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.kpi-label { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.kpi-val { font-size:1.55rem; font-weight:800; color:#1e293b; }
.kpi-val.red { color:#dc2626; }
.kpi-badge { display:inline-flex; align-items:center; gap:3px; font-size:.7rem; font-weight:600; padding:2px 8px; border-radius:20px; margin-top:4px; }
.kpi-badge.up { background:#dcfce7; color:#16a34a; }
.kpi-sub-text { font-size:.72rem; color:#94a3b8; margin-top:4px; }
.filter-bar { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.filter-group { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
.filter-select { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; font-size:.8rem; color:#475569; cursor:pointer; }
.filter-date { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:7px 14px; font-size:.8rem; color:#475569; }
.filter-date i { color:#2d7a3a; }
.btn-refresh { display:flex; align-items:center; gap:6px; background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.data-title { margin:0; font-size:.9rem; font-weight:700; color:#1e293b; }
.equip-card { background:#fff; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.06); overflow:hidden; }
.equip-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.equip-table th { text-align:left; font-size:.65rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:12px 16px; border-bottom:1px solid #f1f5f9; background:#fafafa; }
.equip-table td { padding:14px 16px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.eid { font-family:monospace; font-size:.8rem; color:#64748b; font-weight:600; }
.ename { font-weight:600; color:#1e293b; }
.edate { color:#64748b; }
.status-tag { font-size:.7rem; font-weight:700; padding:3px 10px; border-radius:20px; }
.st-green { background:#dcfce7; color:#16a34a; }
.st-red   { background:#fee2e2; color:#dc2626; }
.btn-view { background:#f1f5f9; border:none; border-radius:6px; width:30px; height:30px; cursor:pointer; color:#64748b; display:flex; align-items:center; justify-content:center; }
.btn-view:hover { background:#e2e8f0; }
.ai-block { background:linear-gradient(135deg,#4f46e5,#7c3aed); border-radius:14px; padding:22px; color:#fff; }
.ai-block-head { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
.ai-block-icon { width:32px; height:32px; background:rgba(255,255,255,.2); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:.9rem; }
.ai-block-head strong { font-size:.95rem; }
.ai-cols { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.ai-col-title { font-size:.68rem; font-weight:700; color:rgba(255,255,255,.65); letter-spacing:.4px; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,.2); padding-bottom:6px; }
.ai-col p { font-size:.75rem; color:rgba(255,255,255,.85); line-height:1.65; margin:0; }
.ai-footer-note { margin-top:14px; font-size:.72rem; color:rgba(255,255,255,.6); display:flex; align-items:center; gap:6px; }
.bottom-bar { display:flex; align-items:center; justify-content:space-between; padding:10px 0 0; border-top:1px solid #e2e8f0; flex-wrap:wrap; gap:10px; }
.checkbox-label { display:flex; align-items:center; gap:7px; font-size:.8rem; color:#475569; cursor:pointer; }
.export-btns { display:flex; gap:10px; }
.btn-excel { display:flex; align-items:center; gap:6px; background:#fff; border:1.5px solid #e2e8f0; color:#1e293b; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.btn-pdf { display:flex; align-items:center; gap:6px; background:#1e293b; color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
</style>
