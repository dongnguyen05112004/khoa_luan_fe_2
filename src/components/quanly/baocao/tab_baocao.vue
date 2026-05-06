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

    <!-- AI Unified Card -->
    <div class="ai-card-unified">
      <div class="ai-card-header-unified">
        <div class="ai-avatar-unified">
          <i class="fas fa-brain"></i>
        </div>
        <div class="ai-title-unified">
          <strong v-if="aiReport">{{ aiReport.title }}</strong>
          <strong v-else>Phân tích chiến lược từ SmartGym AI</strong>
        </div>
        <button class="btn-generate-ai-unified" @click="$emit('generate-ai-report')" :disabled="isAiLoading">
          <i class="fas fa-magic" :class="{'fa-spin': isAiLoading}"></i>
          {{ isAiLoading ? 'Đang phân tích...' : 'Cập nhật AI' }}
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
        Chưa có báo cáo AI. Hãy nhấn nút "Cập nhật AI" để phân tích dữ liệu thiết bị.
      </div>
    </div>

    <!-- ===== TRA CỨU NHẬT KÝ ===== -->
    <div class="log-section">
      <div class="log-header">
        <div>
          <div class="log-title"><i class="fas fa-clipboard-list log-title-icon"></i> Tra cứu nhật ký hệ thống</div>
          <div class="log-sub">Lịch sử hoạt động và thay đổi dữ liệu trong hệ thống</div>
        </div>
        <div class="log-filters">
          <div class="log-filter-select">
            <i class="fas fa-user log-fi"></i>
            <span>Tất cả người dùng</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="log-filter-select">
            <i class="fas fa-tags log-fi"></i>
            <span>Tất cả hành động</span>
            <i class="fas fa-chevron-down"></i>
          </div>
          <div class="log-filter-date">
            <i class="fas fa-calendar-alt"></i>
            <span>01/03/2025 → 26/03/2025</span>
          </div>
          <button class="btn-log-search"><i class="fas fa-search"></i> Tìm kiếm</button>
        </div>
      </div>

      <div class="log-card">
        <table class="log-table">
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>NGƯỜI DÙNG</th>
              <th>HÀNH ĐỘNG</th>
              <th>ĐỐI TƯỢNG</th>
              <th>IP</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td class="log-time">{{ log.time }}</td>
              <td class="log-user">{{ log.user }}</td>
              <td><span class="log-action-tag" :class="log.actionClass">{{ log.action }}</span></td>
              <td class="log-obj">{{ log.object }}</td>
              <td class="log-ip">{{ log.ip }}</td>
              <td><span class="log-status" :class="log.statusClass">{{ log.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div class="log-pagination">
          <span class="log-page-info">Hiển thị 1–5 / 128 bản ghi</span>
          <div class="log-page-btns">
            <button class="log-pBtn" disabled><i class="fas fa-chevron-left"></i></button>
            <button class="log-pBtn active">1</button>
            <button class="log-pBtn">2</button>
            <button class="log-pBtn">3</button>
            <button class="log-pBtn"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
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
  props: ['aiReport', 'isAiLoading'],
  data() {
    return {
      equipment: [
        { id: 'EQP-0642', name: 'Máy chạy bộ ProForm L6', status: 'Tốt', stClass: 'st-green', date: '12/12/2023' },
        { id: 'EQP-0089', name: 'Giàn tạ đa năng Matrix G3', status: 'Hỏng', stClass: 'st-red', date: '28/10/2023' },
        { id: 'EQP-0112', name: 'Xe đạp tập Peloton Bike+', status: 'Tốt', stClass: 'st-green', date: '15/01/2024' },
      ],
      logs: [
        { id: 1, time: '26/03/2025 14:32', user: 'admin@smartgym.vn', action: 'Cập nhật', actionClass: 'act-update', object: 'Gói tập – Standard', ip: '192.168.1.10', status: 'Thành công', statusClass: 'ls-ok' },
        { id: 2, time: '26/03/2025 13:15', user: 'nv01@smartgym.vn', action: 'Đăng nhập', actionClass: 'act-login', object: 'Hệ thống', ip: '192.168.1.22', status: 'Thành công', statusClass: 'ls-ok' },
        { id: 3, time: '26/03/2025 11:48', user: 'admin@smartgym.vn', action: 'Xóa', actionClass: 'act-delete', object: 'Hội viên – HV00341', ip: '192.168.1.10', status: 'Thành công', statusClass: 'ls-ok' },
        { id: 4, time: '26/03/2025 10:05', user: 'nv02@smartgym.vn', action: 'Thêm mới', actionClass: 'act-create', object: 'Khuyến mãi – Hè 2025', ip: '192.168.1.35', status: 'Thành công', statusClass: 'ls-ok' },
        { id: 5, time: '25/03/2025 17:22', user: 'nv03@smartgym.vn', action: 'Đăng nhập', actionClass: 'act-login', object: 'Hệ thống', ip: '10.0.0.5', status: 'Thất bại', statusClass: 'ls-fail' },
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
/* AI Unified Card Style - KINETIC DARK VERSION */
.ai-card-unified {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 15px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.ai-card-header-unified {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ai-avatar-unified {
  width: 50px; height: 50px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1.3rem;
  flex-shrink: 0;
  box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3);
}
.ai-title-unified {
  font-size: 1.1rem;
  font-weight: 800;
  color: #fff;
  flex: 1;
}
.btn-generate-ai-unified {
  background: linear-gradient(90deg, #4f46e5, #7c3aed) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  outline: none !important;
}
.btn-generate-ai-unified:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(99, 102, 241, 0.4); }

.ai-rec-diagnosis-unified {
  font-size: 0.92rem;
  color: #e2e8f0;
  line-height: 1.7;
  background: rgba(255, 255, 255, 0.05);
  padding: 18px 22px;
  border-radius: 16px;
  border-left: 4px solid #6366f1;
}
.ai-suggestions-unified {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.suggestion-hd {
  font-size: 0.72rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.suggestion-item-unified {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.88rem;
  color: #cbd5e1;
  line-height: 1.5;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px 14px;
  border-radius: 10px;
}
.suggestion-item-unified i {
  color: #4ade80;
  margin-top: 3px;
  font-size: 1rem;
  flex-shrink: 0;
}
.ai-empty-unified {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}
.bottom-bar { display:flex; align-items:center; justify-content:space-between; padding:10px 0 0; border-top:1px solid #e2e8f0; flex-wrap:wrap; gap:10px; }
.checkbox-label { display:flex; align-items:center; gap:7px; font-size:.8rem; color:#475569; cursor:pointer; }
.export-btns { display:flex; gap:10px; }
.btn-excel { display:flex; align-items:center; gap:6px; background:#fff; border:1.5px solid #e2e8f0; color:#1e293b; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }
.btn-pdf { display:flex; align-items:center; gap:6px; background:#1e293b; color:#fff; border:none; border-radius:8px; padding:7px 16px; font-size:.8rem; font-weight:600; cursor:pointer; }

/* ===== LOG SECTION ===== */
.log-section { display:flex; flex-direction:column; gap:14px; }
.log-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.log-title { font-size:.95rem; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px; }
.log-title-icon { color:#2d7a3a; }
.log-sub { font-size:.73rem; color:#94a3b8; margin-top:3px; }
.log-filters { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.log-filter-select { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:7px 12px; font-size:.78rem; color:#475569; cursor:pointer; white-space:nowrap; }
.log-fi { color:#94a3b8; font-size:.75rem; }
.log-filter-date { display:flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; border-radius:8px; padding:7px 12px; font-size:.78rem; color:#475569; white-space:nowrap; }
.log-filter-date i { color:#2d7a3a; }
.btn-log-search { display:flex; align-items:center; gap:6px; background:#2d7a3a; color:#fff; border:none; border-radius:8px; padding:8px 16px; font-size:.8rem; font-weight:600; cursor:pointer; white-space:nowrap; }
.log-card { background:#fff; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.06); overflow:hidden; }
.log-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.log-table th { text-align:left; font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:12px 14px; border-bottom:1px solid #f1f5f9; background:#fafafa; }
.log-table td { padding:13px 14px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.log-time { font-size:.77rem; color:#64748b; white-space:nowrap; }
.log-user { font-size:.8rem; color:#1e293b; font-weight:500; }
.log-obj { color:#475569; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.log-ip { font-family:monospace; font-size:.78rem; color:#64748b; }
.log-action-tag { font-size:.7rem; font-weight:700; padding:3px 9px; border-radius:20px; }
.act-update { background:#fef9c3; color:#92400e; }
.act-login  { background:#dbeafe; color:#1d4ed8; }
.act-delete { background:#fee2e2; color:#dc2626; }
.act-create { background:#dcfce7; color:#16a34a; }
.log-status { font-size:.7rem; font-weight:700; padding:3px 9px; border-radius:20px; }
.ls-ok   { background:#dcfce7; color:#16a34a; }
.ls-fail { background:#fee2e2; color:#dc2626; }
.log-pagination { display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border-top:1px solid #f1f5f9; }
.log-page-info { font-size:.75rem; color:#94a3b8; }
.log-page-btns { display:flex; gap:4px; }
.log-pBtn { width:30px; height:30px; border:1px solid #e2e8f0; border-radius:7px; background:#fff; color:#475569; font-size:.78rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
.log-pBtn:hover { background:#f1f5f9; }
.log-pBtn.active { background:#2d7a3a; color:#fff; border-color:#2d7a3a; font-weight:700; }
.log-pBtn:disabled { opacity:.4; cursor:not-allowed; }
</style>
