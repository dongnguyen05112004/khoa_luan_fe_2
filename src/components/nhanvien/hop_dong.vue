<template>
  <div class="hd-page">

    <!-- ===== Toast Notification ===== -->
    <transition name="toast-slide">
      <div v-if="toast" class="hd-toast" :class="toast.type === 'error' ? 'toast-error' : 'toast-success'">
        <i :class="toast.type === 'error' ? 'fas fa-times-circle' : 'fas fa-check-circle'"></i>
        {{ toast.msg }}
      </div>
    </transition>

    <!-- ===== Page Header ===== -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Quản lý Hợp đồng &amp; Gia hạn</h1>
        <p class="page-subtitle">Theo dõi vòng đời gói tập và quản lý gia hạn hiệu quả.</p>
      </div>
    </div>

    <!-- ===== Two-Column Layout ===== -->
    <div class="hd-layout">

      <!-- ========== LEFT COL ========== -->
      <div class="hd-main">

        <!-- Current Contract Card -->
        <div class="contract-card">
          <div class="contract-card-head">
            <span class="cc-title">Hợp đồng hiện tại</span>
            <span class="badge-active">ĐANG HỪU LỰC</span>
          </div>
          <div class="cc-grid">
            <div class="cc-field">
              <div class="cc-label">TÊN HỘI VIÊN</div>
              <div class="cc-value">{{ currentContract.memberName }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">GÓI TẬP</div>
              <div class="cc-value">{{ currentContract.package }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">NGÀY BẬT ĐẦU</div>
              <div class="cc-value">{{ currentContract.startDate }}</div>
            </div>
            <div class="cc-field">
              <div class="cc-label">NGÀY HẾT HẠN</div>
              <div class="cc-value cc-red">{{ currentContract.endDate }}</div>
            </div>
          </div>
          <div class="lifecycle-row">
            <span class="lifecycle-label">Tiến trình hợp đồng</span>
            <span class="lifecycle-pct">{{ currentContract.progress }}% Hoàn thành</span>
          </div>
          <div class="lifecycle-bar">
            <div class="lifecycle-fill" :style="{ width: currentContract.progress + '%' }"></div>
          </div>
          <div class="cc-warning" v-if="currentContract.warningMsg">
            <i class="fas fa-circle warning-dot"></i>
            {{ currentContract.warningMsg }}
          </div>
        </div>

        <!-- Contract List -->
        <div class="list-card">
          <div class="list-head">
            <span class="list-title">Danh sách hợp đồng</span>
            <div class="list-actions">
              <button class="btn-filter"><i class="fas fa-filter"></i> Lọc</button>
              <button class="btn-export"><i class="fas fa-file-export"></i> Xuất file</button>
            </div>
          </div>

          <!-- Search + Status tabs -->
          <div class="list-toolbar">
            <div class="list-search">
              <i class="fas fa-search"></i>
              <input
                v-model="searchQ"
                type="text"
                placeholder="Tìm theo tên, ID, SĐT..."
                class="list-search-input"
              />
            </div>
            <div class="list-tabs">
              <button
                v-for="t in tabs"
                :key="t.key"
                class="tab-btn"
                :class="{ active: activeTab === t.key, [t.cls]: true }"
                @click="setTab(t.key)"
              >{{ t.label }}</button>
            </div>
          </div>

          <!-- Table -->
          <div class="hd-table-wrap">
            <table class="hd-table">
              <thead>
                <tr>
                  <th>MÃ HỢP ĐỒNG</th>
                  <th>HỘI VIÊN</th>
                  <th>GÓI TẬP</th>
                  <th>TRẠNG THÁI</th>
                  <th>NGÀY HẾT HẠN</th>
                  <th>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="c in paginatedContracts"
                  :key="c.id"
                  :class="{ 'row-highlighted': highlightedContractId === c.id }"
                >
                  <td>
                    <span class="contract-id">{{ c.contractId }}</span>
                  </td>
                  <td>
                    <div class="member-cell">
                      <img
                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(c.memberName)}&background=${c.avatarBg}&color=fff&bold=true&size=60`"
                        class="member-avatar"
                        :alt="c.memberName"
                      />
                      <span class="member-name">{{ c.memberName }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="pkg-name">{{ c.package }}</div>
                  </td>
                  <td>
                    <span class="status-badge" :class="c.statusClass">{{ c.status }}</span>
                  </td>
                  <td>
                    <div class="expiry-date" :class="{ 'expiry-red': c.statusClass === 'st-expired' }">
                      {{ c.expiryDate }}
                    </div>
                  </td>
                  <td>
                    <div class="action-btns">
                      <button
                        class="action-btn"
                        :class="{ 'action-btn-selected': selectedContractId === c.id }"
                        title="Chọn để gia hạn / hủy"
                        @click="selectContract(c)"
                      ><i class="fas fa-hand-pointer"></i></button>
                      <button class="action-btn" title="Xem chi tiết" @click="viewDetail(c)"><i class="fas fa-eye"></i></button>
                      <button class="action-btn action-btn-danger" title="Xóa" @click="doRemove(c)"><i class="fas fa-trash-alt"></i></button>
                    </div>
                  </td>
                </tr>
                <tr v-if="loading">
                  <td colspan="6" class="empty-row">
                    <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
                  </td>
                </tr>
                <tr v-else-if="paginatedContracts.length === 0">
                  <td colspan="6" class="empty-row">
                    <i class="fas fa-file-contract"></i> Không tìm thấy hợp đồng phù hợp.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar">
            <span class="pagination-info">Hiển thị 1 đến {{ paginatedContracts.length }} trong tổng {{ filteredContracts.length }} hợp đồng</span>
            <div class="pagination-controls">
              <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
                <i class="fas fa-chevron-left"></i>
              </button>
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-btn"
                :class="{ active: currentPage === p }"
                @click="currentPage = p"
              >{{ p }}</button>
              <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ========== RIGHT COL ========== -->
      <div class="hd-sidebar">

        <!-- Gia hạn -->
        <div class="side-card renew-card">
          <div class="side-card-title">
            <i class="fas fa-sync-alt"></i> Gia hạn Hợp đồng
          </div>
          <!-- Hiển thị hợp đồng đang được chọn -->
          <div v-if="selectedContractId" class="selected-info">
            <i class="fas fa-check-circle"></i>
            Đã chọn: {{ contracts.find(c => c.id === selectedContractId)?.contractId || '#—' }}
          </div>
          <div v-else class="selected-hint">
            <i class="fas fa-info-circle"></i>
            Nhấn <i class="fas fa-hand-pointer"></i> trong bảng để chọn hợp đồng
          </div>
          <div class="side-field">
            <div class="side-label">GÓI GIA HẠN <span style="color:#ef4444">*</span></div>
            <select class="side-select" v-model="selectedPlanId">
              <option value="">-- Chọn gói --</option>
              <option v-for="p in plans" :key="p.id" :value="p.id">{{ p.plan_name }} ({{ p.duration_days }}d)</option>
            </select>
          </div>
          <div class="side-field">
            <div class="side-label">NGÀY BẮT ĐẦU MỚI <span style="color:#ef4444">*</span></div>
            <div class="date-input-wrap">
              <input type="date" class="side-date" v-model="renewDate" />
            </div>
          </div>
          <button class="btn-renew" :disabled="renewLoading" @click="doRenew">
            <i v-if="renewLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Gia hạn hợp đồng</span>
          </button>
        </div>

        <!-- Hủy hợp đồng -->
        <div class="side-card cancel-card">
          <div class="side-card-title cancel-title">
            <i class="fas fa-times-circle"></i> Hủy hợp đồng
          </div>
          <div class="side-label cancel-label">LÝ DO HUỶ (BẮT BUỘC)</div>
          <textarea
            v-model="cancelReason"
            class="cancel-textarea"
            placeholder="Mô tả lý do hội viên muốn huỷ hợp đồng..."
            rows="4"
          ></textarea>
          <button class="btn-cancel-link" @click="doCancel">Hủy hợp đồng</button>
        </div>

        <!-- Billing Support -->
        <div class="side-card billing-card">
          <div class="billing-row">
            <div class="billing-icon"><i class="fas fa-headset"></i></div>
            <div class="billing-info">
              <div class="billing-title">HỔ TRỢ THANH TOÁN</div>
              <div class="billing-sub">Yêu cầu xử lý thủ công</div>
            </div>
            <i class="fas fa-chevron-right billing-arrow"></i>
          </div>
        </div>

      </div>
    </div>

    <!-- ===== Modal Chi Tiết Hợp Đồng ===== -->
    <transition name="modal-fade">
      <div v-if="showDetail" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-box">
          <div class="modal-head">
            <span class="modal-title">Chi tiết Hợp đồng</span>
            <button class="modal-close" @click="closeDetail"><i class="fas fa-times"></i></button>
          </div>
          <div v-if="detailLoading" class="modal-body" style="text-align:center;padding:40px">
            <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;color:#16a34a"></i>
            <p style="margin-top:12px;color:#64748b">Đang tải...</p>
          </div>
          <div v-else-if="detailContract" class="modal-body">
            <div class="detail-grid">
              <div class="detail-item">
                <div class="detail-label">MÃ HỢP ĐỒNG</div>
                <div class="detail-value mono">{{ detailContract.contractId }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">TRẠNG THÁI</div>
                <div class="detail-value"><span class="status-badge" :class="detailContract.statusClass">{{ detailContract.status }}</span></div>
              </div>
              <div class="detail-item">
                <div class="detail-label">HỘI VIÊN</div>
                <div class="detail-value">{{ detailContract.memberName }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">GÓI DỊCH VỤ</div>
                <div class="detail-value">{{ detailContract.package }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">NGÀY BẮT ĐẦU</div>
                <div class="detail-value">{{ detailContract.startDate }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-label">NGÀY HẾT HẠN</div>
                <div class="detail-value cc-red">{{ detailContract.expiryDate }}</div>
              </div>
              <div class="detail-item" v-if="detailContract.price">
                <div class="detail-label">GIÁ TRỊ HỢP ĐỒNG</div>
                <div class="detail-value">{{ Number(detailContract.price).toLocaleString('vi-VN') }} đ</div>
              </div>
            </div>
            <!-- Thanh tiến trình -->
            <div class="lifecycle-row" style="margin-top:16px">
              <span class="lifecycle-label">Tiến trình hợp đồng</span>
              <span class="lifecycle-pct">{{ calcProgress(detailContract._start, detailContract._end) }}%</span>
            </div>
            <div class="lifecycle-bar">
              <div class="lifecycle-fill" :style="{ width: calcProgress(detailContract._start, detailContract._end) + '%' }"></div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-modal-select" @click="selectContract(detailContract); closeDetail()">
              <i class="fas fa-hand-pointer"></i> Chọn để gia hạn / hủy
            </button>
            <button class="btn-modal-close" @click="closeDetail">Đóng</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios'
import { contractApi } from '@/services/contractApi'
import { contractStatusLabel, contractStatusClass } from '@/utils/i18n'

// Màu avatar ngẫu nhiên cho mỗi hội viên
const AVATAR_COLORS = ['f59e0b','16a34a','14b8a6','ec4899','6366f1','8b5cf6','0ea5e9','d97706','a855f7','ef4444']

export default {
  name: 'HopDong',
  data() {
    return {
      // ── Trạng thái loading / lỗi ──────────────────────────────────
      loading: false,
      error: null,
      toast: null,          // { msg, type: 'success'|'error' }
      toastTimer: null,

      // ── Danh sách hợp đồng (từ API) ──────────────────────────────
      contracts: [],
      totalFromApi: 0,      // tổng bản ghi server trả về
      serverPage: 1,        // trang hiện tại trên server (per_page mặc định)

      // ── Tìm kiếm / lọc / phân trang ──────────────────────────────
      searchQ: '',
      activeTab: 'all',
      currentPage: 1,
      perPage: 5,

      // ── Hợp đồng hiện tại (widget trái-trên) ─────────────────────
      currentContract: {
        memberName: '—',
        package: '—',
        startDate: '—',
        endDate: '—',
        progress: 0,
        warningMsg: '',
      },

      // ── Stats (tổng quan) ─────────────────────────────────────────
      stats: null,

      // ── Tabs ──────────────────────────────────────────────────────
      tabs: [
        { key: 'all',       label: 'Tất cả',        cls: 'tab-all'       },
        { key: 'active',    label: 'Đang hiệu lực', cls: 'tab-active'    },
        { key: 'expired',   label: 'Đã hết hạn',    cls: 'tab-expired'   },
        { key: 'cancelled', label: 'Đã huỷ',         cls: 'tab-pending'   },
      ],

      // ── Modal chi tiết ────────────────────────────────────────────
      showDetail: false,
      detailContract: null,
      detailLoading: false,

      // ── Gia hạn ───────────────────────────────────────────────────
      selectedContractId: null,   // id hợp đồng đang chọn
      selectedPlanId: '',          // plan_id bắt buộc theo BE
      renewDate: new Date().toISOString().slice(0, 10),
      renewLoading: false,
      plans: [],                  // danh sách gói duy nhất từ contracts

      // ── Hủy hợp đồng ──────────────────────────────────────────────
      cancelReason: '',

      // ── Navigate từ dashboard (query param: select, search) ──────────────
      fromDashboard: false,
      highlightedContractId: null,
    }
  },

  computed: {
    // ── Lọc phía client (trên dữ liệu đã fetch) ──────────────────
    filteredContracts() {
      let list = this.contracts
      const q = this.searchQ.trim().toLowerCase()
      if (q) {
        list = list.filter(c =>
          (c.memberName || '').toLowerCase().includes(q) ||
          (c.contractId || '').toLowerCase().includes(q)
        )
      }
      if (this.activeTab !== 'all') {
        const map = { active: 'active', expired: 'expired', cancelled: 'cancelled' }
        list = list.filter(c => c.rawStatus === map[this.activeTab])
      }
      return list
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredContracts.length / this.perPage))
    },
    paginatedContracts() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredContracts.slice(start, start + this.perPage)
    },
    visiblePages() {
      const pages = []
      const total = this.totalPages
      let start = Math.max(1, this.currentPage - 1)
      let end   = Math.min(total, start + 2)
      if (end - start < 2) start = Math.max(1, end - 2)
      for (let i = start; i <= end; i++) pages.push(i)
      return pages
    },
  },

  methods: {
    // ── Helpers ─────────────────────────────────────────────────────
    showToast(msg, type = 'success') {
      if (this.toastTimer) clearTimeout(this.toastTimer)
      this.toast = { msg, type }
      this.toastTimer = setTimeout(() => { this.toast = null }, 3500)
    },

    formatDate(dateStr) {
      if (!dateStr) return '—'
      const d = new Date(dateStr)
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    },

    statusClass(status) {
      return contractStatusClass(status)
    },

    statusLabel(status) {
      return contractStatusLabel(status)
    },

    avatarColor(id) {
      return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length]
    },

    /** Tính % tiến trình hợp đồng */
    calcProgress(start, end) {
      if (!start || !end) return 0
      const s = new Date(start).getTime()
      const e = new Date(end).getTime()
      const now = Date.now()
      if (now >= e) return 100
      if (now <= s) return 0
      return Math.round(((now - s) / (e - s)) * 100)
    },

    /** Tính số ngày còn lại */
    daysLeft(endDate) {
      if (!endDate) return null
      const diff = new Date(endDate).getTime() - Date.now()
      return Math.ceil(diff / 86400000)
    },

    /** Map 1 bản ghi API → object dùng trong template
     *
     * BE (formatContract) trả về các field phẳng (flat):
     *   member_name, plan_id, package (= plan_name), start_date, end_date ...
     * Không có object lồng user{} hay plan{}
     */
    mapContract(c) {
      // BE trả về member_name (flat) - không phải user.name
      const memberName = c.member_name
        || c.user?.full_name || c.user?.name
        || `Hội viên #${c.user_id}`
      // BE trả về 'package' = plan_name, hoặc nếu raw thì c.plan.plan_name
      const pkg = c.package
        || c.plan?.plan_name || c.plan?.name
        || `Gói #${c.plan_id}`
      const rawStatus = c.status || 'pending'
      return {
        id:           c.id,
        contractId:   c.contract_number || `#CN-${String(c.id).padStart(4, '0')}`,
        memberName,
        avatarBg:     this.avatarColor(c.id),
        package:      pkg,
        status:       this.statusLabel(rawStatus),
        rawStatus,
        statusClass:  this.statusClass(rawStatus),
        startDate:    this.formatDate(c.start_date),
        expiryDate:   this.formatDate(c.end_date),
        price:        c.price,
        lifecycle:    c.lifecycle,
        daysLeft:     c.days_left,
        expiryWarning: c.expiry_warning,
        // raw dates để tính toán
        _start: c.start_date,
        _end:   c.end_date,
      }
    },

    // ── FETCH danh sách hợp đồng ─────────────────────────────────
    async fetchContracts() {
      this.loading = true
      this.error = null
      try {
        const params = { per_page: 100 }                // lấy đủ để lọc client
        if (this.activeTab !== 'all') params.status = this.activeTab

        const res = await contractApi.getAll(params)
        const data = res.data

        // BE trả về { data: [...], meta: { total, ... } } hoặc mảng trực tiếp
        const list = Array.isArray(data) ? data
                   : (data.data ?? data.contracts ?? [])

        this.contracts = list.map(c => this.mapContract(c))
        this.totalFromApi = data.meta?.total ?? list.length

        // Build danh sách gói duy nhất từ dữ liệu trả về
        this.buildPlansList(list)

        // Cập nhật widget "hợp đồng hiện tại" (lấy hợp đồng active đầu tiên)
        const active = this.contracts.find(c => c.rawStatus === 'active')
        if (active) {
          const days = this.daysLeft(active._end)
          this.currentContract = {
            memberName: active.memberName,
            package:    active.package,
            startDate:  active.startDate,
            endDate:    active.expiryDate,
            progress:   this.calcProgress(active._start, active._end),
            warningMsg: days !== null && days <= 30
              ? `Hợp đồng hết hạn trong ${days} ngày. Khuyến nghị gia hạn ngay.`
              : '',
          }
        }
      } catch (err) {
        console.error('[HopDong] fetchContracts:', err)
        this.error = err.response?.data?.message || 'Không thể tải danh sách hợp đồng.'
        this.showToast(this.error, 'error')
      } finally {
        this.loading = false
      }
    },

    // ── FETCH stats tổng quan ─────────────────────────────────────
    async fetchStats() {
      try {
        const res = await contractApi.getStats()
        this.stats = res.data
      } catch (err) {
        console.warn('[HopDong] fetchStats (bỏ qua):', err.message)
      }
    },

    // ── XEM CHI TIẾT ─────────────────────────────────────────────
    async viewDetail(contract) {
      this.showDetail   = true
      this.detailLoading = true
      this.detailContract = contract   // hiển thị ngay dữ liệu cũ trước
      try {
        const res = await contractApi.getOne(contract.id)
        const raw = res.data?.contract ?? res.data
        if (raw) this.detailContract = { ...contract, ...this.mapContract(raw), _raw: raw }
      } catch (err) {
        this.showToast('Không thể tải chi tiết hợp đồng.', 'error')
      } finally {
        this.detailLoading = false
      }
    },

    closeDetail() {
      this.showDetail = false
      this.detailContract = null
    },

    // ── BUILD DANH SÁCH GÓI (fallback: trích từ contracts) ────────
    buildPlansList(rawList) {
      const seen = new Set()
      const plans = []
      rawList.forEach(c => {
        // BE formatContract dùng plan_id + package (= plan_name)
        // raw list có thể có c.plan.plan_name hoặc c.package
        const id   = c.plan_id
        const name = c.plan?.plan_name || c.package
        const dur  = c.plan?.duration_days
        if (id && name && !seen.has(id)) {
          seen.add(id)
          plans.push({ id, plan_name: name, duration_days: dur || '' })
        }
      })
      // Chỉ ghi đè nếu chưa load từ /membership-plans/active
      if (plans.length > 0 && this.plans.length === 0) this.plans = plans
    },

    // ── FETCH danh sách gói từ /api/membership-plans/active ────────
    async fetchPlans() {
      try {
        const res = await axios.get('/api/membership-plans/active')
        const list = Array.isArray(res.data) ? res.data : (res.data.data ?? [])
        if (list.length > 0) this.plans = list   // [{ id, plan_name, duration_days, price }]
      } catch (err) {
        console.warn('[HopDong] fetchPlans (fallback sang buildPlansList):', err.message)
      }
    },

    // ── GIA HẠN ──────────────────────────────────────────────────
    async doRenew() {
      // Validate
      if (!this.selectedContractId) {
        this.showToast('Vui lòng nhấn ☝ để chọn hợp đồng cần gia hạn.', 'error')
        return
      }
      if (!this.selectedPlanId) {
        this.showToast('Vui lòng chọn gói gia hạn.', 'error')
        return
      }
      if (!this.renewDate) {
        this.showToast('Vui lòng chọn ngày bắt đầu mới.', 'error')
        return
      }

      const chosen = this.contracts.find(c => c.id === this.selectedContractId)
      const planName = this.plans.find(p => p.id == this.selectedPlanId)?.plan_name
        || `Gói #${this.selectedPlanId}`
      const confirm = window.confirm(
        `Xác nhận gia hạn hợp đồng ${chosen?.contractId}?\n` +
        `Gói: ${planName}\n` +
        `Ngày bắt đầu mới: ${this.renewDate}`
      )
      if (!confirm) return

      this.renewLoading = true
      try {
        // BE yêu cầu: plan_id* (bắt buộc), new_start_date* (bắt buộc)
        const payload = {
          plan_id:        Number(this.selectedPlanId),
          new_start_date: this.renewDate,
        }
        await contractApi.renew(this.selectedContractId, payload)
        this.showToast('Gia hạn hợp đồng thành công!', 'success')
        // Reset form
        this.selectedContractId = null
        this.selectedPlanId = ''
        this.renewDate = new Date().toISOString().slice(0, 10)
        // Reload danh sách
        await this.fetchContracts()
      } catch (err) {
        const msg = err.response?.data?.message
          || err.response?.data?.errors
          || 'Gia hạn thất bại.'
        this.showToast(typeof msg === 'object' ? JSON.stringify(msg) : msg, 'error')
      } finally {
        this.renewLoading = false
      }
    },

    // ── HỦY HỢP ĐỒNG ─────────────────────────────────────────────
    async doCancel() {
      const id = this.selectedContractId
      if (!id) {
        this.showToast('Vui lòng chọn hợp đồng cần hủy từ danh sách.', 'error')
        return
      }
      if (!this.cancelReason.trim() || this.cancelReason.trim().length < 5) {
        this.showToast('Lý do hủy phải có ít nhất 5 ký tự.', 'error')
        return
      }
      try {
        await contractApi.cancel(id, this.cancelReason.trim())
        this.showToast('Đã hủy hợp đồng thành công.', 'success')
        this.cancelReason = ''
        this.selectedContractId = null
        await this.fetchContracts()
      } catch (err) {
        const msg = err.response?.data?.message || 'Hủy hợp đồng thất bại.'
        this.showToast(msg, 'error')
      }
    },

    // ── XÓA HỢP ĐỒNG ─────────────────────────────────────────────
    async doRemove(contract) {
      if (!confirm(`Xác nhận xóa hợp đồng ${contract.contractId}?`)) return
      try {
        await contractApi.remove(contract.id)
        this.showToast(`Đã xóa hợp đồng ${contract.contractId}.`, 'success')
        this.contracts = this.contracts.filter(c => c.id !== contract.id)
      } catch (err) {
        const msg = err.response?.data?.message || 'Xóa hợp đồng thất bại.'
        this.showToast(msg, 'error')
      }
    },

    // ── CHỌN HỢP ĐỒNG để gia hạn / hủy ─────────────────────────
    selectContract(contract) {
      this.selectedContractId = contract.id
      this.renewDate = new Date().toISOString().slice(0, 10)
      this.cancelReason = ''
      this.showToast(`Đã chọn: ${contract.contractId} – ${contract.memberName}`, 'success')
    },

    // ── TAB + PAGINATION ──────────────────────────────────────────
    setTab(key) {
      this.activeTab = key
      this.currentPage = 1
    },
  },

  watch: {
    searchQ()    { this.currentPage = 1 },
    activeTab()  { this.currentPage = 1 },
  },

  async mounted() {
    await Promise.all([
      this.fetchContracts(),
      this.fetchStats(),
      this.fetchPlans(),   // load danh sách gói cho dropdown gia hạn
    ])

    // ── Tự động chọn hợp đồng khi được navigate từ Dashboard ──────────────
    const selectId = this.$route?.query?.select
    const searchName = this.$route?.query?.search

    if (selectId) {
      this.fromDashboard = true
      this.highlightedContractId = Number(selectId)

      // Điền tên vào ô tìm kiếm để lấy kết quả thu hẹp
      if (searchName) this.searchQ = searchName

      // Tìm hợp đồng trong danh sách đã fetch
      const found = this.contracts.find(c => c.id === Number(selectId))
      if (found) {
        this.selectContract(found)
        // Scroll đến sidebar (panel gia hạn) để người dùng thấy ngầy
        this.$nextTick(() => {
          const sidebar = document.querySelector('.hd-sidebar')
          if (sidebar) sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  },
}
</script>

<style scoped>

/* ===== BASE ===== */
.hd-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  padding: 28px 28px 40px;
}

/* ===== PAGE HEADER ===== */
.page-header {
  margin-bottom: 22px;
}
.page-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}
.page-subtitle {
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 0;
}

/* ===== TWO-COLUMN LAYOUT ===== */
.hd-layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}
.hd-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hd-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* ===== CURRENT CONTRACT CARD ===== */
.contract-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px 18px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}
.contract-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.cc-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #334155;
}
.badge-active {
  background: #dcfce7;
  color: #16a34a;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.5px;
}
.cc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
  margin-bottom: 18px;
}
.cc-label {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.cc-value {
  font-size: 0.96rem;
  font-weight: 600;
  color: #0f172a;
}
.cc-red { color: #ef4444; }

.lifecycle-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
}
.lifecycle-label { font-size: 0.77rem; color: #64748b; }
.lifecycle-pct   { font-size: 0.77rem; color: #16a34a; font-weight: 600; }

.lifecycle-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 14px;
}
.lifecycle-fill {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #f97316);
  border-radius: 10px;
  transition: width 0.4s;
}

.cc-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.8rem;
  color: #92400e;
}
.warning-dot {
  color: #f59e0b;
  font-size: 0.5rem;
  margin-top: 1px;
}

/* ===== CONTRACT LIST CARD ===== */
.list-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}
.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f1f5f9;
}
.list-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f172a;
}
.list-actions { display: flex; gap: 8px; }
.btn-filter,
.btn-export {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.btn-filter:hover,
.btn-export:hover { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }

/* Search + Tabs toolbar */
.list-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  flex-wrap: wrap;
}
.list-search {
  position: relative;
  flex: 1;
  min-width: 160px;
}
.list-search i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.8rem;
}
.list-search-input {
  width: 100%;
  padding: 7px 12px 7px 30px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.83rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.list-search-input:focus { border-color: #2d7a3a; background: #fff; }

.list-tabs {
  display: flex;
  gap: 4px;
}
.tab-btn {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
}
.tab-btn:hover { border-color: #cbd5e1; background: #f8fafc; }
.tab-btn.tab-all.active     { background: #2d7a3a; border-color: #2d7a3a; color: #fff; }
.tab-btn.tab-active.active  { background: #dcfce7; border-color: #16a34a; color: #16a34a; }
.tab-btn.tab-expired.active { background: #fee2e2; border-color: #ef4444; color: #dc2626; }
.tab-btn.tab-pending.active { background: #fef3c7; border-color: #f59e0b; color: #b45309; }

/* Table */
.hd-table-wrap { overflow-x: auto; }
.hd-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.84rem;
}
.hd-table th {
  padding: 10px 16px;
  text-align: left;
  font-size: 0.66rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.hd-table td {
  padding: 13px 16px;
  border-bottom: 1px solid #f8fafc;
  vertical-align: middle;
}
.hd-table tr:last-child td { border-bottom: none; }
.hd-table tbody tr:hover td { background: #fafbfc; }
.hd-table tbody tr.row-highlighted td {
  background: #f0fdf4;
  border-bottom-color: #bbf7d0;
}
.hd-table tbody tr.row-highlighted td:first-child {
  border-left: 3px solid #2d7a3a;
}

.contract-id {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #334155;
}
.member-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}
.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.member-name { font-size: 0.84rem; font-weight: 500; color: #0f172a; }

.pkg-name { font-size: 0.82rem; color: #334155; }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}
.st-active  { background: #dcfce7; color: #16a34a; }
.st-expired { background: #fee2e2; color: #dc2626; }
.st-pending { background: #fef3c7; color: #b45309; }

.expiry-date { font-size: 0.82rem; color: #334155; font-weight: 500; }
.expiry-red  { color: #dc2626; }

.action-btns { display: flex; gap: 5px; }
.action-btn {
  width: 28px;
  height: 28px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 0.72rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}
.action-btn:hover { background: #f0fdf4; border-color: #2d7a3a; color: #2d7a3a; }

.empty-row {
  text-align: center;
  padding: 36px !important;
  color: #94a3b8;
  font-size: 0.875rem;
}
.empty-row i { margin-right: 8px; }

/* Pagination */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 8px;
}
.pagination-info { font-size: 0.78rem; color: #64748b; }
.pagination-controls { display: flex; gap: 4px; }
.page-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 5px;
  border: 1.5px solid #e2e8f0;
  border-radius: 7px;
  background: #fff;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
}
.page-btn:hover:not(:disabled) { border-color: #2d7a3a; color: #2d7a3a; background: #f0fdf4; }
.page-btn.active { background: #2d7a3a; border-color: #2d7a3a; color: #fff; font-weight: 700; }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

/* ===== SIDEBAR CARDS ===== */
.side-card {
  background: #fff;
  border-radius: 13px;
  padding: 16px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
}
.side-card-title {
  font-size: 0.87rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.side-card-title i { color: #16a34a; }

.side-field { margin-bottom: 12px; }
.side-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.side-select {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  cursor: pointer;
  transition: border-color 0.2s;
}
.side-select:focus { border-color: #2d7a3a; }

.date-input-wrap { position: relative; }
.side-date {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.82rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: border-color 0.2s;
}
.side-date:focus { border-color: #2d7a3a; }

.btn-renew {
  width: 100%;
  padding: 11px;
  background: #1a4d24;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.87rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 4px;
}
.btn-renew:hover:not(:disabled) { background: #133a1b; transform: translateY(-1px); }
.btn-renew:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }


/* Cancel card */
.cancel-card { border: 1.5px solid #fecaca; }
.cancel-title { color: #dc2626 !important; }
.cancel-title i { color: #dc2626 !important; }
.cancel-label { margin-bottom: 8px; }
.cancel-textarea {
  width: 100%;
  padding: 9px 10px;
  border: 1.5px solid #fecaca;
  border-radius: 8px;
  font-size: 0.81rem;
  color: #334155;
  font-family: inherit;
  outline: none;
  resize: none;
  background: #fff5f5;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.cancel-textarea:focus { border-color: #ef4444; }
.btn-cancel-link {
  display: block;
  width: 100%;
  text-align: right;
  background: none;
  border: none;
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  margin-top: 8px;
  padding: 0;
  transition: color 0.15s;
}
.btn-cancel-link:hover { color: #991b1b; }

/* Billing card */
.billing-card { cursor: pointer; transition: box-shadow 0.2s; }
.billing-card:hover { box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1); }
.billing-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.billing-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #16a34a;
  font-size: 0.85rem;
  flex-shrink: 0;
}
.billing-title { font-size: 0.85rem; font-weight: 700; color: #0f172a; }
.billing-sub   { font-size: 0.73rem; color: #16a34a; margin-top: 1px; }
.billing-arrow { color: #16a34a; font-size: 0.78rem; margin-left: auto; }

/* ===== ACTION BUTTON VARIANTS ===== */
.action-btn-selected {
  background: #dcfce7 !important;
  border-color: #16a34a !important;
  color: #16a34a !important;
}
.action-btn-danger:hover { background: #fee2e2 !important; border-color: #ef4444 !important; color: #dc2626 !important; }

/* ===== SELECTED CONTRACT INFO ===== */
.selected-info {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #166534;
  margin-bottom: 12px;
}
.selected-info i  { color: #16a34a; }
.selected-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 0.76rem;
  color: #0369a1;
  margin-bottom: 12px;
}
.selected-hint i { font-size: 0.75rem; }

/* ===== TOAST ===== */
.hd-toast {
  position: fixed;
  top: 18px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.87rem;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  min-width: 220px;
  max-width: 380px;
  pointer-events: none;
}
.toast-success { background: #f0fdf4; border: 1.5px solid #86efac; color: #166534; }
.toast-error   { background: #fef2f2; border: 1.5px solid #fca5a5; color: #991b1b; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 0.3s ease; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateX(40px); }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(2px);
}
.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 22px;
  border-bottom: 1px solid #f1f5f9;
}
.modal-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.modal-close {
  width: 30px; height: 30px;
  border: none; background: #f1f5f9;
  border-radius: 50%; color: #64748b;
  font-size: 0.8rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.modal-close:hover { background: #fee2e2; color: #dc2626; }
.modal-body { padding: 22px; }
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 20px;
}
.detail-item {}
.detail-label {
  font-size: 0.61rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 3px;
}
.detail-value { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
.detail-value.mono { font-family: 'Courier New', monospace; font-size: 0.85rem; }
.modal-foot {
  display: flex;
  gap: 10px;
  padding: 14px 22px;
  border-top: 1px solid #f1f5f9;
  justify-content: flex-end;
}
.btn-modal-select {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 18px;
  background: #1a4d24; color: #fff;
  border: none; border-radius: 8px;
  font-size: 0.84rem; font-weight: 700;
  font-family: inherit; cursor: pointer;
  transition: all 0.18s;
}
.btn-modal-select:hover { background: #133a1b; }
.btn-modal-close {
  padding: 9px 18px;
  background: #f1f5f9; color: #475569;
  border: none; border-radius: 8px;
  font-size: 0.84rem; font-weight: 600;
  font-family: inherit; cursor: pointer;
  transition: all 0.18s;
}
.btn-modal-close:hover { background: #e2e8f0; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(0.95); }

/* ===== RESPONSIVE ===== */
@media (max-width: 900px) {
  .hd-page   { padding: 16px; }
  .hd-layout { flex-direction: column; }
  .hd-sidebar { width: 100%; }
  .detail-grid { grid-template-columns: 1fr; }
}

</style>
