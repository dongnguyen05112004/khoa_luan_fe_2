<template>
  <div class="confirm-online-page">
    <div class="page-header">
      <div class="title-wrap">
        <h1 class="page-title">Xác Nhận Thanh Toán Online</h1>
        <p class="page-subtitle">Duyệt các giao dịch chuyển khoản VietQR hoặc VNPay chờ xử lý.</p>
      </div>
      <div class="header-stats">
        <div class="stat-mini">
          <span class="stat-label">Chờ duyệt:</span>
          <span class="stat-val">{{ pendingCount }}</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filter-bar">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input v-model="searchQuery" type="text" placeholder="Tìm tên, mã GD..." @input="onSearch" />
      </div>
      <div class="method-filters">
        <button 
          v-for="m in methods" 
          :key="m.key" 
          class="filter-btn" 
          :class="{ active: activeMethod === m.key }"
          @click="setMethod(m.key)"
        >
          <i :class="m.icon"></i> {{ m.label }}
        </button>
      </div>
    </div>

    <!-- Main Table -->
    <div class="table-card">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="payments.length === 0" class="empty-state">
        <i class="fas fa-check-double mb-3"></i>
        <p>Không có giao dịch nào đang chờ xác nhận.</p>
      </div>

      <table v-else class="confirm-table">
        <thead>
          <tr>
            <th>MÃ GD</th>
            <th>HỘI VIÊN</th>
            <th>DỊCH VỤ</th>
            <th>SỐ TIỀN</th>
            <th>PHƯƠNG THỨC</th>
            <th>THỜI GIAN</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in payments" :key="p.id">
            <td><span class="tx-id">{{ p.txId }}</span></td>
            <td>
              <div class="member-info">
                <span class="m-name">{{ p.memberName }}</span>
                <span class="m-sub">{{ p.memberPhone }}</span>
              </div>
            </td>
            <td><span class="pkg-badge">{{ p.package }}</span></td>
            <td><span class="amount-val">{{ formatPrice(p.amount) }}đ</span></td>
            <td>
              <span class="method-tag" :class="p.payment_method">
                <i :class="p.methodIcon"></i> {{ p.method }}
              </span>
            </td>
            <td><span class="time-val">{{ p.date }}</span></td>
            <td>
              <div class="action-wrap">
                <button class="btn-confirm-action" @click="confirmPayment(p)" :disabled="confirmingId === p.id">
                  <i v-if="confirmingId === p.id" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-check-circle"></i>
                  Xác nhận
                </button>
                <button class="btn-detail-icon" @click="viewDetail(p)">
                  <i class="fas fa-info-circle"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Detail Modal -->
    <div class="modal-overlay" v-if="selectedPayment" @click.self="selectedPayment = null">
      <div class="detail-modal">
        <div class="modal-header">
          <h5>Chi tiết giao dịch {{ selectedPayment.txId }}</h5>
          <button @click="selectedPayment = null"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="d-item"><span class="label">Hội viên:</span><span class="val">{{ selectedPayment.memberName }}</span></div>
            <div class="d-item"><span class="label">SĐT:</span><span class="val">{{ selectedPayment.memberPhone }}</span></div>
            <div class="d-item"><span class="label">Gói:</span><span class="val">{{ selectedPayment.package }}</span></div>
            <div class="d-item"><span class="label">Số tiền:</span><span class="val fw-bold text-success">{{ formatPrice(selectedPayment.amount) }}đ</span></div>
            <div class="d-item"><span class="label">Nội dung:</span><span class="val text-primary fw-bold">{{ selectedPayment.note || 'Không có' }}</span></div>
          </div>
          <div class="modal-notice">
            <i class="fas fa-exclamation-circle"></i>
            Vui lòng kiểm tra biến động số dư ngân hàng trước khi bấm xác nhận.
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm-big" @click="confirmPayment(selectedPayment)" :disabled="confirmingId === selectedPayment.id">
            Xác nhận ngay
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentApi } from '@/services/paymentApi'

export default {
  name: 'XacNhanOnline',
  data() {
    return {
      payments: [],
      loading: true,
      pendingCount: 0,
      searchQuery: '',
      activeMethod: 'all',
      confirmingId: null,
      selectedPayment: null,
      methods: [
        { key: 'all',    label: 'Tất cả', icon: 'fas fa-list' },
        { key: 'vietqr', label: 'VietQR', icon: 'fas fa-qrcode' },
        { key: 'vnpay',  label: 'VNPay',  icon: 'fas fa-mobile-alt' },
      ]
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const params = {
          status: 'pending',
          search: this.searchQuery,
          per_page: 50
        }
        if (this.activeMethod !== 'all') {
          params.method = this.activeMethod
        }
        
        const res = await paymentApi.getAll(params)
        this.payments = res.data.data.filter(p => ['vietqr', 'vnpay', 'bank_transfer'].includes(p.payment_method))
        this.pendingCount = this.payments.length
      } catch (e) {
        console.error('Lỗi tải dữ liệu xác nhận:', e)
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(() => {
        this.fetchData()
      }, 500)
    },
    setMethod(key) {
      this.activeMethod = key
      this.fetchData()
    },
    formatPrice(val) {
      return Number(val).toLocaleString('vi-VN')
    },
    async confirmPayment(p) {
      if (!confirm(`Xác nhận đã nhận được tiền từ hội viên ${p.memberName}?`)) return
      this.confirmingId = p.id
      try {
        await paymentApi.confirm(p.id)
        this.selectedPayment = null
        await this.fetchData()
        alert('Đã xác nhận thanh toán thành công!')
      } catch (e) {
        alert(e.response?.data?.message || 'Lỗi khi xác nhận')
      } finally {
        this.confirmingId = null
      }
    },
    viewDetail(p) {
      this.selectedPayment = p
    }
  }
}
</script>

<style scoped>
.confirm-online-page {
  padding: 24px 30px;
  background: #f4f7f5;
  min-height: 100vh;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.page-title { font-size: 1.6rem; font-weight: 800; color: #0f4c2a; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.9rem; margin: 4px 0 0; }

.header-stats {
  background: #fff;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}
.stat-mini { display: flex; align-items: center; gap: 8px; }
.stat-label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
.stat-val { font-size: 1.2rem; font-weight: 800; color: #ef4444; }

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
}
.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}
.search-box i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.search-box input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.85rem;
  outline: none;
}

.method-filters { display: flex; gap: 8px; }
.filter-btn {
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn.active {
  background: #2d7a3a;
  color: #fff;
  border-color: #2d7a3a;
}

.table-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  overflow: hidden;
}
.confirm-table { width: 100%; border-collapse: collapse; }
.confirm-table th {
  background: #f8fafc;
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.confirm-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
}
.tx-id { font-family: monospace; font-weight: 700; color: #475569; }
.member-info { display: flex; flex-direction: column; }
.m-name { font-weight: 700; color: #1e293b; }
.m-sub { font-size: 0.75rem; color: #94a3b8; }
.pkg-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 8px;
}
.amount-val { font-weight: 800; color: #0f172a; }
.method-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
}
.method-tag.vietqr { background: #fff1f2; color: #e11d48; }
.method-tag.vnpay { background: #eff6ff; color: #2563eb; }

.action-wrap { display: flex; gap: 10px; align-items: center; }
.btn-confirm-action {
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: opacity 0.2s;
}
.btn-confirm-action:hover { opacity: 0.9; }
.btn-detail-icon {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  width: 32px; height: 32px;
  border-radius: 80px;
  cursor: pointer;
}

.empty-state { padding: 80px; text-align: center; color: #94a3b8; }
.empty-state i { font-size: 3rem; opacity: 0.5; }
.loading-state { padding: 80px; text-align: center; color: #64748b; }
.spinner {
  width: 30px; height: 30px;
  border: 3px solid #e2e8f0;
  border-top-color: #2d7a3a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.detail-modal {
  background: #fff;
  width: 100%; max-width: 450px;
  border-radius: 24px;
  overflow: hidden;
}
.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
}
.modal-header h5 { margin: 0; font-weight: 800; color: #0f172a; }
.modal-header button { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; }
.modal-body { padding: 24px; }
.detail-grid { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.d-item { display: flex; justify-content: space-between; font-size: 0.95rem; }
.d-item .label { color: #64748b; }
.d-item .val { font-weight: 600; color: #1e293b; }
.modal-notice {
  background: #fff7ed;
  color: #c2410c;
  padding: 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  display: flex; gap: 10px;
  line-height: 1.5;
}
.modal-footer { padding: 20px 24px; border-top: 1px solid #f1f5f9; }
.btn-confirm-big {
  width: 100%;
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}
</style>
