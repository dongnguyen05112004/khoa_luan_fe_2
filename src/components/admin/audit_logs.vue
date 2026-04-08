<template>
  <div class="audit-logs-page">
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2">
      <div class="search-bar-pill d-flex align-items-center px-3 py-2 rounded-pill">
        <i class="fas fa-search text-gray-400 me-2"></i>
        <input type="text" class="border-0 bg-transparent flex-grow-1 small text-dark outline-none search-input" placeholder="Tìm kiếm hành động hoặc ID...">
      </div>
      <div class="d-flex align-items-center gap-4 pe-2">
        <button class="btn btn-link p-0 position-relative text-decoration-none fs-5 icon-btn">
          <i class="far fa-bell"></i>
          <span class="position-absolute top-0 start-100 translate-middle bg-danger border border-white rounded-circle notification-dot"></span>
        </button>
        <button class="btn btn-link p-0 text-decoration-none fs-5 icon-btn">
          <i class="far fa-question-circle"></i>
        </button>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold title-green mb-1">Trung tâm Tra cứu Nhật ký Hệ thống</h4>
        <p class="text-muted small mb-0">Theo dõi và giám sát mọi biến động dữ liệu thời gian thực</p>
      </div>
      
      <div class="dropdown">
        <button class="btn btn-action-green btn-sm px-4 py-2 rounded-3 fw-bold shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fas fa-download me-2"></i> Xuất báo cáo
        </button>
        <ul class="dropdown-menu shadow-sm border-0 mt-2 rounded-3 py-2">
          <li>
            <a class="dropdown-item fw-bold text-muted small py-2 d-flex align-items-center cursor-pointer" @click.prevent="exportExcel">
              <i class="fas fa-file-csv fs-5 me-3 text-success"></i> Xuất file Excel (CSV)
            </a>
          </li>
          <li>
            <a class="dropdown-item fw-bold text-muted small py-2 d-flex align-items-center cursor-pointer" @click.prevent="exportPDF">
              <i class="fas fa-file-pdf fs-5 me-3 text-danger"></i> Xuất file PDF
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="stat-card card-border-cyan bg-white h-100 px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2">TOTAL LOGS TODAY</div>
          <div class="d-flex align-items-end justify-content-between">
            <h2 class="mb-0 fw-bolder text-dark">1,284</h2>
            <span class="text-green-500 small fw-bold">+12% <i class="fas fa-arrow-trend-up"></i></span>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-border-purple bg-white h-100 px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2">HIGH SEVERITY CHANGES</div>
          <div class="d-flex align-items-end justify-content-between">
            <h2 class="mb-0 fw-bolder text-purple">42</h2>
            <span class="text-red-500 small fw-bold animate-pulse">Attention !</span>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card card-border-cyan bg-white h-100 px-4 py-3">
          <div class="text-gray-500 very-small fw-bold text-uppercase mb-2">LAST ADMIN ACTION</div>
          <div class="d-flex align-items-center gap-3 mt-1">
            <div class="avatar-orange d-flex align-items-center justify-content-center rounded-circle"><i class="fas fa-user text-white"></i></div>
            <div>
              <div class="fw-bold text-dark small">Cấu hình API</div>
              <div class="very-small text-gray-400">2 phút trước</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm overflow-hidden rounded-4">
      <div class="table-responsive">
        <table class="table mb-0 align-middle table-borderless table-hover">
          <thead class="table-header-gray text-gray-500 very-small fw-bold text-uppercase">
            <tr>
              <th class="ps-4 py-3 border-0">Timestamp</th>
              <th class="py-3 border-0">Actor</th>
              <th class="py-3 border-0">Action</th>
              <th class="py-3 border-0">Target Object</th>
              <th class="py-3 border-0">IP Address</th>
              <th class="pe-4 py-3 border-0 text-end"></th>
            </tr>
          </thead>
          <tbody class="small">
            <tr v-for="log in logs" :key="log.id" class="cursor-pointer border-bottom">
              <td class="ps-4 text-gray-500 py-3">{{ log.timestamp }}</td>
              <td class="fw-bold py-3">
                <div class="d-flex align-items-center gap-2">
                  <div class="actor-avatar d-flex align-items-center justify-content-center text-white rounded-circle" :style="{ backgroundColor: log.avatarBg }">
                    {{ log.actorInitials }}
                  </div>
                  {{ log.actorName }}
                </div>
              </td>
              <td class="py-3">
                <span class="status-dot" :style="{ backgroundColor: log.actionHex }"></span>
                <span class="fw-bold" :style="{ color: log.actionHex }">{{ log.actionType }}</span>
              </td>
              <td class="text-gray-400 py-3">{{ log.targetObject }}</td>
              <td class="text-gray-400 py-3">{{ log.ipAddress }}</td>
              <td class="pe-4 text-end py-3"><i class="fas fa-angle-right text-gray-400 fs-5"></i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default {
  name: 'AuditLogs',
  data() {
    return {
      logs: [
        { id: 1, timestamp: '2023-10-24 14:22:05', actorInitials: 'H', actorName: 'Hung Tran', avatarBg: '#547665', actionType: 'UPDATE_MEMBER', actionHex: '#8b5cf6', targetObject: 'MBR_992812', ipAddress: '192.168.1.45' },
        { id: 2, timestamp: '2023-10-24 14:15:30', actorInitials: 'L', actorName: 'Linh Pham', avatarBg: '#a7cdbd', actionType: 'CREATE_PLAN', actionHex: '#10b981', targetObject: 'PLN_KICK_OFF', ipAddress: '114.23.1.89' },
        { id: 3, timestamp: '2023-10-24 13:58:12', actorInitials: 'SY', actorName: 'HS Thong AI', avatarBg: '#448c68', actionType: 'AUTO_BACKUP', actionHex: '#0ea5e9', targetObject: 'DB_SNAPSHOT_02', ipAddress: 'localhost' },
        { id: 4, timestamp: '2023-10-24 13:40:01', actorInitials: 'T', actorName: 'Admin Tuan', avatarBg: '#e89c68', actionType: 'DELETE_CAMPAIGN', actionHex: '#8b5cf6', targetObject: 'CMP_BLACK_FRI', ipAddress: '45.76.122.9' },
      ]
    }
  },
  methods: {
    // 1. XUẤT FILE EXCEL (CSV)
    exportExcel() {
      const headers = ['TIMESTAMP', 'ACTOR', 'ACTION', 'TARGET OBJECT', 'IP ADDRESS'];
      const rows = this.logs.map(log => [
        log.timestamp,
        log.actorName,
        log.actionType,
        log.targetObject,
        log.ipAddress
      ]);

      let csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "SmartGym_AuditLogs.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    exportPDF() {
      const doc = new jsPDF();
      
      // Tiêu đề báo cáo
      doc.setFontSize(18);
      doc.setTextColor(45, 122, 58); 
      doc.text("BAO CAO NHAT KY HE THONG", 14, 20);

      // Ngày xuất
      const dateStr = new Date().toLocaleDateString();
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Ngay xuat: ${dateStr}`, 14, 28);

      // Cấu hình bảng
      const tableColumn = ["TIMESTAMP", "ACTOR", "ACTION", "TARGET", "IP ADDRESS"];
      const tableRows = this.logs.map(log => [
        log.timestamp,
        log.actorName,
        log.actionType,
        log.targetObject,
        log.ipAddress
      ]);

      doc.autoTable({
        startY: 35,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid', 
        headStyles: {
          fillColor: [45, 122, 58],
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: {
          fontSize: 9,
          cellPadding: 3
        },
        columnStyles: {
          0: { cellWidth: 35 },
          2: { fontStyle: 'bold' }
        }
      });

      doc.save(`SmartGym_AuditLogs_${dateStr}.pdf`);
    }
  }
}
</script>

<style scoped>
.audit-logs-page { 
font-family: 'Inter', sans-serif; 
}
.search-bar-pill { 
  background-color: #f1f5f9; 
  width: 400px; }
.title-green { color: #3b7b59; 
}
.very-small { 
  font-size: 0.7rem; 
}
.stat-card { 
  border-radius: 12px; 
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
  border: 2px solid #38bdf8; 
}
.card-border-purple { 
  border-color: #a855f7 !important; 
}
.text-purple { 
  color: #8b5cf6 !important; 
}
.text-green-500 { 
  color: #10b981 !important; 
}
.text-red-500 { 
  color: #ef4444 !important; 
}
.avatar-orange { 
  width: 38px; 
  height: 38px; 
  background-color: #fdba74; 
}
.actor-avatar { 
  width: 32px; 
  height: 32px; 
  font-weight: bold; 
  font-size: 0.75rem; 
}
.filter-input-group { 
  background-color: #f1f5f9; 
}
.btn-action-green { 
  background-color: #4b8965; 
  color: white; 
  border: none; 
}
.btn-action-green:hover { 
  background-color: #3b6d51; 
}
.btn-filter { 
  background-color: #e2e8f0; 
  border: none; 
}
.status-dot { 
  display: inline-block; 
  width: 8px; 
  height: 8px; 
  border-radius: 50%; 
  margin-right: 8px; 
}
.table-header-gray { 
  background-color: #f8fafc; 
}
.cursor-pointer { 
  cursor: pointer; 
}
.animate-pulse { 
  animation: pulse 2s infinite; 
}
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>