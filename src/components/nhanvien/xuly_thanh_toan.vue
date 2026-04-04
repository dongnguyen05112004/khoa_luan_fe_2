<template>
  <div class="xltoan-page">

    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/nhanvien/thu_tien" class="bread-link">
        <i class="fas fa-arrow-left"></i> Giao dịch
      </router-link>
      <span class="bread-sep"><i class="fas fa-chevron-right"></i></span>
      <span class="bread-current">Thanh toán &amp; Xuất hóa đơn</span>
    </div>

    <!-- Page Title -->
    <h1 class="page-title">Thanh toán &amp; Xuất hóa đơn</h1>

    <!-- Two-column layout -->
    <div class="xl-layout">

      <!-- ===== LEFT PANEL ===== -->
      <div class="xl-left">

        <!-- Chi tiết thanh toán -->
        <div class="panel-card">
          <div class="panel-title">
            <i class="fas fa-receipt panel-ico"></i> Chi tiết thanh toán
          </div>

          <!-- Phương thức thanh toán -->
          <div class="field-group">
            <div class="field-label">Phương thức thanh toán</div>
            <div class="payment-methods">
              <button
                v-for="m in paymentMethods"
                :key="m.key"
                class="pm-btn"
                :class="{ active: selectedMethod === m.key }"
                @click="selectedMethod = m.key"
              >
                <i :class="m.icon" class="pm-icon"></i>
                <span class="pm-label">{{ m.label }}</span>
              </button>
            </div>
          </div>

          <!-- Mã khuyến mãi -->
          <div class="field-group">
            <div class="field-label">Mã khuyến mãi</div>
            <div class="promo-row">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Nhập mã ưu đãi..."
                class="promo-input"
              />
              <button class="btn-apply" @click="applyPromo">Áp dụng</button>
            </div>
            <div v-if="promoMsg" class="promo-msg" :class="promoMsgClass">
              {{ promoMsg }}
            </div>
          </div>

          <!-- Bank Transfer Info -->
          <transition name="slide-down">
            <div v-if="selectedMethod === 'transfer'" class="bank-transfer-section">
              <div class="bank-header">
                <div class="bank-header-text">
                  <div class="bank-section-title">Thông tin chuyển khoản</div>
                  <div class="bank-section-sub">Vui lòng quét mã QR hoặc nhập thông tin ngân hàng bên dưới để hoàn tất giao dịch.</div>
                </div>
                <div class="qr-wrap">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=VIETCOMBANK-1903456789012300-KP.PLT.20240921.001"
                    class="qr-img"
                    alt="QR Code"
                  />
                  <div class="qr-label">Scan QR</div>
                </div>
              </div>

              <div class="bank-info-grid">
                <div class="bank-info-item">
                  <div class="bi-label">NGÂN HÀNG</div>
                  <div class="bi-val">Vietcombank (VCB)</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">SỐ TIỀN HOÀN TOÁN</div>
                  <div class="bi-val bi-amount">{{ total.toLocaleString('vi-VN') }}.000 đ</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">ĐỊA ĐIỂM</div>
                  <div class="bi-val">Hồ Chí Minh - Quận 1</div>
                </div>
                <div class="bank-info-item">
                  <div class="bi-label">NỘI DUNG CHUYỂN KHOẢN</div>
                  <div class="bi-val bi-copy-row">
                    <span>KP.PLT.20240921.001</span>
                    <button class="btn-copy" @click="copyText('KP.PLT.20240921.001')" :class="{ copied: copiedKey === 'content' }" @click.stop="copyText('KP.PLT.20240921.001', 'content')">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
                <div class="bank-info-item bank-info-full">
                  <div class="bi-label">SỐ TÀI KHOẢN</div>
                  <div class="bi-val bi-copy-row">
                    <span>1903 4567 8901 23</span>
                    <button class="btn-copy" :class="{ copied: copiedKey === 'account' }" @click="copyText('1903456789012300', 'account')">
                      <i class="fas fa-copy"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="bank-note">
                <i class="fas fa-info-circle"></i>
                Lưu ý: Giao dịch có thể mất từ 3-5 phút để xác nhận.
              </div>

              <button class="btn-bank-confirm" @click="confirmPayment">
                <i class="fas fa-check-circle"></i> Xác nhận thanh toán
              </button>
            </div>
          </transition>
          <!-- Credit Card Form -->
          <transition name="slide-down">
            <div v-if="selectedMethod === 'card'" class="card-section">
              <div class="card-badge">THẺ TÍN DỤNG</div>

              <div class="card-field-group">
                <div class="card-field-label">TÊN CHỦ THẺ</div>
                <input v-model="cardName" type="text" placeholder="NGUYEN VAN A" class="card-input" style="text-transform: uppercase" />
              </div>

              <div class="card-field-group">
                <div class="card-field-label">SỐ THẺ</div>
                <div class="card-input-wrap">
                  <i class="fas fa-credit-card card-input-ico"></i>
                  <input v-model="cardNumber" type="text" placeholder="0000 0000 0000 0000" maxlength="19" class="card-input card-input-icon" @input="formatCardNumber" />
                </div>
              </div>

              <div class="card-row-2">
                <div class="card-field-group">
                  <div class="card-field-label">NGÀY HẾT HẠN (MM/YY)</div>
                  <input v-model="cardExpiry" type="text" placeholder="MM/YY" maxlength="5" class="card-input" @input="formatExpiry" />
                </div>
                <div class="card-field-group">
                  <div class="card-field-label">CVV</div>
                  <input v-model="cardCvv" type="password" placeholder="***" maxlength="4" class="card-input" />
                </div>
              </div>

              <button class="btn-bank-confirm" @click="confirmPayment">
                <i class="fas fa-check-circle"></i> Xác nhận thanh toán
              </button>
            </div>
          </transition>
        </div>

      </div>

      <!-- ===== RIGHT PANEL ===== -->
      <div class="xl-right">
        <div class="summary-card">

          <div class="summary-title">Thông tin giao dịch</div>

          <div class="summary-rows">
            <div class="sum-row">
              <span class="sum-label">Mã hợp đồng</span>
              <span class="sum-val sum-code">{{ contractId }}</span>
            </div>
            <div class="sum-row sum-service">
              <span class="sum-label">Dịch vụ</span>
              <div class="sum-service-detail">
                <div class="sum-service-name">{{ serviceName }}</div>
                <div class="sum-service-sub">{{ serviceSub }}</div>
              </div>
            </div>
          </div>

          <div class="sum-divider"></div>

          <div class="sum-calc-rows">
            <div class="calc-row">
              <span class="calc-label">Tạm tính</span>
              <span class="calc-val">{{ subtotal.toLocaleString('vi-VN') }}&nbsp;đ</span>
            </div>
            <div class="calc-row discount">
              <span class="calc-label">Giảm giá</span>
              <span class="calc-val">-{{ discount.toLocaleString('vi-VN') }}&nbsp;đ</span>
            </div>
          </div>

          <div class="sum-total-row">
            <span class="total-label">Tổng<br/>cộng</span>
            <span class="total-val">{{ total.toLocaleString('vi-VN') }}<br/><span class="total-unit">đ</span></span>
          </div>

          <button class="btn-confirm" @click="confirmPayment">
            <i class="fas fa-check-circle"></i> Xác nhận thanh toán
          </button>
          <button class="btn-print" @click="printInvoice">
            <i class="fas fa-print"></i> In hóa đơn (PDF)
          </button>

          <p class="summary-note">
            Giao dịch sẽ được ghi lại và lý lịch thanh toán được cập nhật.
          </p>

        </div>

        <!-- Ghi chú giao dịch -->
        <div class="note-card-right">
          <div class="note-title-right">GHI CHÚ GIAO DỊCH</div>
          <textarea v-model="note" class="note-textarea-right" placeholder="Nhập ghi chú hoặc yêu cầu xuất hóa đơn..." rows="4"></textarea>
        </div>

      </div>

    </div>

    <!-- Success overlay -->
    <div class="success-overlay" v-if="showSuccess" @click.self="showSuccess = false">
      <div class="success-modal">
        <div class="success-icon"><i class="fas fa-check-circle"></i></div>
        <div class="success-title">Thanh toán thành công!</div>
        <div class="success-sub">Giao dịch #{{ contractId }} đã được xác nhận.</div>
        <button class="btn-back-list" @click="$router.push('/nhanvien/thu_tien')">
          Quay về danh sách
        </button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'XuLyThanhToan',
  data() {
    return {
      selectedMethod: 'cash',
      promoCode: '',
      promoMsg: '',
      promoMsgClass: '',
      copiedKey: '',
      note: '',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: '',
      showSuccess: false,
      paymentMethods: [
        { key: 'cash',     label: 'Tiền mặt',    icon: 'fas fa-money-bill-wave' },
        { key: 'transfer', label: 'Chuyển khoản', icon: 'fas fa-university' },
        { key: 'card',     label: 'Thẻ tín dụng', icon: 'fas fa-credit-card' },
      ],
      contractId: 'CTR-2024-0042',
      serviceName: 'Platinum Elite Membership',
      serviceSub: 'Elite 12 tháng + PT 10 buổi',
      subtotal: 18500000,
      discount: 500000,
    }
  },
  computed: {
    total() {
      return this.subtotal - this.discount
    },
  },
  methods: {
    applyPromo() {
      if (this.promoCode.trim().toUpperCase() === 'SAVE10') {
        this.promoMsg = '✓ Áp dụng mã giảm giá thành công!'
        this.promoMsgClass = 'promo-ok'
        this.discount = 1000000
      } else if (this.promoCode.trim() === '') {
        this.promoMsg = 'Vui lòng nhập mã khuyến mãi.'
        this.promoMsgClass = 'promo-err'
      } else {
        this.promoMsg = '✗ Mã không hợp lệ hoặc đã hết hạn.'
        this.promoMsgClass = 'promo-err'
      }
    },
    confirmPayment() {
      this.showSuccess = true
    },
    printInvoice() {
      window.print()
    },
    copyText(text, key) {
      navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement('textarea')
        el.value = text
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
      })
      this.copiedKey = key
      setTimeout(() => { this.copiedKey = '' }, 2000)
    },
    formatCardNumber() {
      let val = this.cardNumber.replace(/\D/g, '').substring(0, 16)
      this.cardNumber = val.replace(/(\d{4})(?=\d)/g, '$1 ')
    },
    formatExpiry() {
      let val = this.cardExpiry.replace(/\D/g, '').substring(0, 4)
      if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2)
      this.cardExpiry = val
    },
  },
  mounted() {
    if (this.$route.query.txId) {
      this.contractId = this.$route.query.txId
    }
    if (this.$route.query.amount) {
      this.subtotal = Number(this.$route.query.amount)
    }
    if (this.$route.query.member) {
      this.serviceSub = this.$route.query.member
    }
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.xltoan-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 24px 28px 40px;
}

/* ===== BREADCRUMB ===== */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: #94a3b8;
}
.bread-link {
  color: #2d7a3a;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s;
}
.bread-link:hover { color: #133a1b; }
.bread-sep { color: #cbd5e1; font-size: 0.65rem; }
.bread-current { color: #64748b; }

/* ===== PAGE TITLE ===== */
.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 22px;
  letter-spacing: -0.3px;
}

/* ===== LAYOUT ===== */
.xl-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.xl-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.xl-right {
  width: 260px;
  flex-shrink: 0;
}

/* ===== PANEL CARD ===== */
.panel-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}
.panel-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.panel-ico { color: #2d7a3a; }

/* Field group */
.field-group { margin-bottom: 20px; }
.field-group:last-child { margin-bottom: 0; }
.field-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
}

/* Payment method buttons */
.payment-methods {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.pm-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: #fff;
  color: #64748b;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
}
.pm-btn:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.pm-btn.active {
  border-color: #2d7a3a;
  background: #f0fdf4;
  color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.12);
}
.pm-icon { font-size: 1.1rem; }
.pm-label { font-size: 0.76rem; font-weight: 600; white-space: nowrap; }

/* Promo */
.promo-row {
  display: flex;
  gap: 0;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.promo-row:focus-within { border-color: #2d7a3a; }
.promo-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 9px 13px;
  font-size: 0.84rem;
  color: #334155;
  font-family: inherit;
  background: #f8fafc;
}
.promo-input::placeholder { color: #94a3b8; }
.btn-apply {
  background: #2d7a3a;
  color: #fff;
  border: none;
  padding: 9px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-apply:hover { background: #245f2e; }
.promo-msg { font-size: 0.78rem; margin-top: 7px; }
.promo-ok  { color: #16a34a; }
.promo-err { color: #dc2626; }

/* Note */
.note-title {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.note-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.83rem;
  color: #334155;
  font-family: inherit;
  resize: none;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.note-textarea:focus { border-color: #2d7a3a; background: #fff; }

/* ===== SUMMARY CARD ===== */
.summary-card {
  background: linear-gradient(160deg, #1a4d24 0%, #1c5e2e 70%, #0f3418 100%);
  border-radius: 16px;
  padding: 22px 20px 18px;
  color: #fff;
  box-shadow: 0 4px 24px rgba(26, 77, 36, 0.4);
}
.summary-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 16px;
  letter-spacing: 0.3px;
}
.summary-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.sum-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.55);
  flex-shrink: 0;
}
.sum-val { font-size: 0.8rem; font-weight: 600; color: rgba(255, 255, 255, 0.9); }
.sum-code { font-family: 'Courier New', monospace; font-size: 0.78rem; }
.sum-service-detail { text-align: right; }
.sum-service-name { font-size: 0.82rem; font-weight: 700; color: #fff; }
.sum-service-sub  { font-size: 0.7rem; color: rgba(255, 255, 255, 0.55); margin-top: 2px; }

.sum-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin-bottom: 12px;
}
.sum-calc-rows { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calc-label { font-size: 0.77rem; color: rgba(255, 255, 255, 0.6); }
.calc-val   { font-size: 0.84rem; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.discount .calc-val { color: #86efac; }

/* Total */
.sum-total-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}
.total-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}
.total-val {
  font-size: 1.7rem;
  font-weight: 800;
  color: #fff;
  text-align: right;
  line-height: 1.15;
}
.total-unit { font-size: 1rem; font-weight: 600; }

/* Action buttons */
.btn-confirm {
  width: 100%;
  padding: 12px;
  background: #fff;
  color: #1a4d24;
  border: none;
  border-radius: 10px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 9px;
  transition: all 0.2s;
}
.btn-confirm:hover { background: #f0fdf4; transform: translateY(-1px); }

.btn-print {
  width: 100%;
  padding: 11px;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
  transition: all 0.2s;
}
.btn-print:hover { border-color: rgba(255, 255, 255, 0.7); color: #fff; }

.summary-note {
  font-size: 0.66rem;
  color: rgba(255, 255, 255, 0.38);
  text-align: center;
  margin: 0;
  line-height: 1.5;
}

/* ===== SUCCESS OVERLAY ===== */
.success-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.success-modal {
  background: #fff;
  border-radius: 16px;
  padding: 36px 40px;
  text-align: center;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
.success-icon { font-size: 3rem; color: #16a34a; margin-bottom: 12px; }
.success-title { font-size: 1.2rem; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
.success-sub { font-size: 0.85rem; color: #64748b; margin-bottom: 22px; }
.btn-back-list {
  padding: 11px 28px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-back-list:hover { background: #245f2e; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .xltoan-page { padding: 16px; }
  .xl-layout   { flex-direction: column; }
  .xl-right    { width: 100%; }
}

/* ===== BANK TRANSFER ===== */
.bank-transfer-section {
  margin-top: 20px;
  border-top: 1.5px solid #e2e8f0;
  padding-top: 18px;
}
.bank-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
}
.bank-section-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 5px;
}
.bank-section-sub {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.5;
  max-width: 260px;
}
.qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}
.qr-img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  padding: 4px;
  background: #fff;
}
.qr-label {
  font-size: 0.65rem;
  color: #94a3b8;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.bank-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}
.bank-info-full { grid-column: 1 / -1; }
.bank-info-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 12px;
}
.bi-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.bi-val {
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f172a;
}
.bi-amount { color: #16a34a; font-size: 0.95rem; }
.bi-copy-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.btn-copy {
  width: 26px;
  height: 26px;
  border: 1.5px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #64748b;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.btn-copy:hover  { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.btn-copy.copied { border-color: #16a34a; color: #16a34a; background: #dcfce7; }

.bank-note {
  font-size: 0.74rem;
  color: #64748b;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 9px 12px;
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
}
.bank-note i { color: #f59e0b; flex-shrink: 0; }

.btn-bank-confirm {
  width: 100%;
  padding: 12px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}
.btn-bank-confirm:hover { background: #245f2e; transform: translateY(-1px); }

/* Slide transition */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ===== CREDIT CARD FORM ===== */
.card-section {
  margin-top: 20px;
  border-top: 1.5px solid #e2e8f0;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.card-badge {
  display: inline-flex;
  align-items: center;
  background: #dcfce7;
  color: #16a34a;
  border: 1.5px solid #86efac;
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.8px;
  align-self: flex-start;
}
.card-field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card-field-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}
.card-input {
  width: 100%;
  padding: 10px 13px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.85rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.card-input:focus {
  border-color: #2d7a3a;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.08);
}
.card-input::placeholder { color: #94a3b8; }

.card-input-wrap {
  position: relative;
}
.card-input-ico {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.85rem;
  pointer-events: none;
}
.card-input-icon {
  padding-left: 36px;
}

.card-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* ===== RIGHT NOTE CARD ===== */
.note-card-right {
  background: #fff;
  border-radius: 13px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  margin-top: 14px;
}
.note-title-right {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.note-textarea-right {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  resize: none;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.note-textarea-right:focus { border-color: #2d7a3a; background: #fff; }
</style>
