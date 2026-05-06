<template>
  <div class="md-page">

    <!-- ===== TABS ===== -->
    <div class="md-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="md-tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- ===== TAB: MARKETPLACE ===== -->
    <div v-if="activeTab === 'marketplace'" class="tab-pane">

      <!-- Loading -->
      <div v-if="loadingPlans" class="md-loading">
        <i class="fas fa-spinner fa-spin me-2" style="color:#2d7a3a;"></i> Đang tải dữ liệu...
      </div>
      <template v-else>

      <!-- Cảnh báo mua chồng chéo -->
      <div class="mk-alert" v-if="hasActiveSubscription">
        <i class="fas fa-triangle-exclamation"></i>
        <span>Cảnh báo mua chồng chéo: Bạn đang có gói tập còn hiệu lực. Việc mua gói mới sẽ cộng dồn thời gian sử dụng.</span>
      </div>

      <!-- Header + plan-type toggle -->
      <div class="mk-header">
        <div>
          <h1 class="mk-title">Service Marketplace</h1>
          <p class="mk-sub">Nâng tầm trải nghiệm tập luyện với các gói dịch vụ cao cấp từ Kinetic Atelier.</p>
        </div>
        <div class="mk-type-toggle">
          <button
            v-for="t in planTypes"
            :key="t.key"
            class="mk-type-btn"
            :class="{ active: activePlanType === t.key }"
            @click="activePlanType = t.key"
          >{{ t.label }}</button>
        </div>
      </div>

      <!-- ── GÓI TẬP ── -->
      <div v-if="activePlanType === 'membership'">
        <div class="row g-3 mb-5">
          <div
            class="col-md-4"
            v-for="plan in membershipPlans"
            :key="plan.id"
          >
            <div class="mk-plan-card" :class="{ featured: plan.featured }">
              <!-- Top row -->
              <div class="mk-plan-top">
                <div class="mk-plan-tier">{{ plan.tier }}</div>
                <div class="mk-plan-duration-badge">{{ plan.durationLabel }}</div>
              </div>
              <!-- Name + price -->
              <div class="mk-plan-name">{{ plan.name }}</div>
              <div class="mk-plan-price">
                {{ formatPrice(plan.price) }} <span class="mk-plan-currency">VND</span>
              </div>
              <!-- Features -->
              <ul class="mk-plan-features">
                <li v-for="f in plan.features" :key="f" :class="{ highlight: f.startsWith('★') }">
                  <i class="fas fa-circle-check"></i>
                  <span>{{ f.replace('★ ', '') }}</span>
                </li>
              </ul>
              <!-- Date meta -->
              <div class="mk-plan-dates">
                <span><strong>BẮT ĐẦU:</strong> HÔM NAY</span>
                <span><strong>KẾT THÚC:</strong> {{ plan.endDate }}</span>
              </div>
              <!-- CTA -->
              <button
                class="mk-btn-register"
                :class="{ primary: plan.featured }"
                @click="openPurchase(plan)"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── GÓI PT ── -->
      <div v-if="activePlanType === 'pt'">
        <div class="mk-pt-list">
          <div class="mk-pt-card" v-for="pt in ptPackages" :key="pt.id">
            <div class="mk-pt-thumb">
              <i class="fas fa-dumbbell"></i>
              <span class="mk-pt-abbr">pt</span>
            </div>
            <div class="mk-pt-info">
              <div class="mk-pt-header-row">
                <span class="mk-pt-badge" :class="pt.badgeCls">{{ pt.badge }}</span>
                <span class="mk-pt-name">{{ pt.name }}</span>
              </div>
              <p class="mk-pt-desc">{{ pt.description }}</p>
              <div class="mk-pt-meta">TRỌN GÓI {{ pt.durationLabel }}</div>
              <div class="mk-pt-price">{{ formatPrice(pt.price) }} VND</div>
            </div>
            <button class="mk-btn-detail" @click="openPurchase(pt)">Xem chi tiết</button>
          </div>
        </div>
      </div>

      </template><!-- /v-else loading -->

    </div>

    <!-- ===== TAB: TRAINERS ===== -->
    <div v-if="activeTab === 'trainers'" class="tab-pane">

      <!-- Hero Header -->
      <div class="tr-hero">
        <h1 class="tr-hero-title">Đội ngũ Huấn luyện</h1>
        <p class="tr-hero-sub">
          Khám phá các chuyên gia hàng đầu được AI phân tích dựa trên<br class="d-none d-md-inline" />
          hiệu suất tập luyện và mức độ hài lòng của hội viên.
        </p>
      </div>

      <!-- Trainer Cards -->
      <div class="row g-4 mb-5">
        <div class="col-md-4" v-for="trainer in trainers" :key="trainer.id">
          <div class="tr-card">
            <!-- Photo + specialty badge + rating -->
            <div class="tr-photo-wrap">
              <img :src="trainer.photo" :alt="trainer.name" class="tr-photo" />
              <div class="tr-specialty-badge">{{ trainer.specialty }}</div>
              <div class="tr-rating-badge">
                <i class="fas fa-star"></i> {{ trainer.rating }}
              </div>
            </div>

            <!-- Card body -->
            <div class="tr-card-body">
              <!-- Name & price row -->
              <div class="tr-name-row">
                <div>
                  <div class="tr-name">{{ trainer.name }}</div>
                  <div class="tr-exp">{{ trainer.experience }} kinh nghiệm</div>
                </div>
                <div class="tr-price-block">
                  <span class="tr-price-label">SUẤT TẬP</span>
                  <div class="tr-price">
                    {{ trainer.price }}<span class="tr-price-unit">/h</span>
                  </div>
                </div>
              </div>

              <!-- Skill tags -->
              <div class="tr-tags">
                <span class="tr-tag" v-for="tag in trainer.tags" :key="tag">{{ tag }}</span>
              </div>

              <!-- CTA -->
              <button class="btn-book" @click="openBook(trainer)">
                Đặt Lịch Ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== Chỉ số Hiệu năng HLV ===== -->
      <div class="row g-4 align-items-stretch">
        <!-- Left: description -->
        <div class="col-lg-4">
          <div class="perf-desc-card h-100">
            <h2 class="perf-title">Chỉ số Hiệu năng HLV</h2>
            <p class="perf-sub">
              Hệ thống AI theo dõi tiến độ của các hội viên dưới sự hướng dẫn
              của từng huấn luyện viên để đảm bảo chất lượng cam kết.
            </p>
            <ul class="perf-list">
              <li><i class="fas fa-circle-dot"></i> <span><strong>98%</strong> Tỷ lệ duy trì hội viên</span></li>
              <li><i class="fas fa-circle-dot"></i> <span><strong>4.9/5</strong> Điểm đánh giá trung bình</span></li>
              <li><i class="fas fa-circle-dot"></i> <span><strong>15+</strong> Chứng chỉ quốc tế</span></li>
            </ul>
          </div>
        </div>

        <!-- Middle: Tăng trưởng cơ bắp -->
        <div class="col-lg-4">
          <div class="perf-metric-card h-100">
            <div class="perf-metric-header">
              <span class="perf-metric-label">TĂNG TRƯỞNG CƠ BẮP</span>
              <i class="fas fa-arrow-trend-up" style="color:#2d7a3a;"></i>
            </div>
            <div class="perf-metric-big">
              <span class="perf-metric-val">+15%</span>
              <span class="perf-metric-vs">vs tháng trước</span>
            </div>
            <!-- Mini bar chart -->
            <div class="mini-chart">
              <div class="mini-bar" v-for="(h, idx) in barData" :key="idx"
                   :style="{ height: h + 'px', background: idx === barData.length - 1 ? '#2d7a3a' : '#a7f3c0' }">
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Mức độ hài lòng -->
        <div class="col-lg-4">
          <div class="perf-metric-card h-100">
            <div class="perf-metric-header">
              <span class="perf-metric-label">MỨC ĐỘ HÀI LÒNG</span>
            </div>
            <div class="sat-avatars">
              <img
                v-for="(av, idx) in satisfactionAvatars"
                :key="idx"
                :src="av"
                class="sat-avatar"
                :style="{ left: idx * 22 + 'px' }"
              />
            </div>
            <div class="sat-count">+1,200 Phản hồi</div>
            <blockquote class="sat-quote">
              "Đội ngũ HLV chuyên nghiệp, luôn theo sát và động viên mình mỗi khi nản chí."
            </blockquote>
          </div>
        </div>
      </div>

    </div><!-- /trainers tab -->

    <!-- ===== BOOKING MODAL ===== -->
    <transition name="modal-fade">
      <div class="md-overlay" v-if="showBook" @click.self="showBook = false">
        <div class="md-modal">
          <div class="md-modal-header">
            <h5 class="md-modal-title">
              <i class="fas fa-calendar-check me-2" style="color:#2d7a3a;"></i>
              Đặt lịch – {{ bookTarget ? bookTarget.name : '' }}
            </h5>
            <button class="md-modal-close" @click="showBook = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="md-modal-body" v-if="bookTarget">
            <div class="d-flex align-items-center gap-3 mb-4">
              <img :src="bookTarget.photo" class="book-avatar" />
              <div>
                <div class="fw-bold" style="color:#1e293b;">{{ bookTarget.name }}</div>
                <div style="font-size:.8rem;color:#64748b;">{{ bookTarget.specialty }}</div>
                <div class="tr-price mt-1" style="font-size:1.1rem;">
                  {{ bookTarget.price }}<span class="tr-price-unit">/buổi</span>
                </div>
              </div>
            </div>
            <div class="row g-3">
              <div class="col-6">
                <label class="form-label-sm">Số buổi muốn mua</label>
                <input type="number" class="form-control form-control-sm" v-model.number="bookForm.sessions" min="1" max="100" />
              </div>
              <div class="col-6">
                <label class="form-label-sm">Tổng tiền</label>
                <div class="form-control form-control-sm" style="background:#f8fafc;color:#2d7a3a;font-weight:700;">
                  {{ formatPrice(bookTarget.rawPrice * bookForm.sessions) }} đ
                </div>
              </div>
              <div class="col-12">
                <label class="form-label-sm">Ghi chú</label>
                <textarea class="form-control form-control-sm" rows="2" v-model="bookForm.note" placeholder="Mục tiêu, chấn thương cần lưu ý..."></textarea>
              </div>
            </div>
            <div class="purchase-notice mt-3">
              <i class="fas fa-info-circle"></i>
              Hợp đồng PT sẽ được kích hoạt sau khi thanh toán tại quầy lễ tân.
            </div>
          </div>
          <div class="md-modal-footer">
            <button class="btn-cancel" @click="showBook = false">Hủy</button>
            <button class="btn-book-confirm" @click="confirmBook" :disabled="booking">
              <i class="fas fa-spinner fa-spin me-1" v-if="booking"></i>
              <i class="fas fa-check me-1" v-else></i>
              {{ booking ? 'Đang xử lý...' : 'Xác nhận đặt lịch' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===== PURCHASE MODAL (marketplace) ===== -->
    <transition name="modal-fade">
      <div class="md-overlay" v-if="showPurchase" @click.self="showPurchase = false">
        <div class="md-modal">
          <div class="md-modal-header">
            <h5 class="md-modal-title">
              <i class="fas fa-shopping-cart me-2" style="color:#2d7a3a;"></i>
              {{ purchaseTarget?.isPt ? 'Đăng ký PT' : 'Đăng ký gói tập' }}
            </h5>
            <button class="md-modal-close" @click="showPurchase = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="md-modal-body" v-if="purchaseTarget">
            <div class="purchase-info-card">
              <div style="font-size:.68rem;font-weight:700;letter-spacing:.05em;color:#94a3b8;margin-bottom:4px;">{{ purchaseTarget.tier || purchaseTarget.badge || 'GÓI DỊCH VỤ' }}</div>
              <div style="font-size:1.1rem;font-weight:800;color:#0f172a;margin-bottom:4px;">{{ purchaseTarget.name }}</div>
              <div style="font-size:.8rem;color:#64748b;margin-bottom:8px;" v-if="purchaseTarget.durationLabel">
                <i class="fas fa-clock me-1"></i>{{ purchaseTarget.durationLabel }}
              </div>
              <div style="font-size:1.5rem;font-weight:800;color:#0f4c2a;">{{ formatPrice(purchaseTarget.price) }} <span style="font-size:.8rem;color:#64748b;">VND</span></div>
            </div>

            <div class="mt-3" v-if="!purchaseTarget.isPt">
              <label class="form-label-sm">Mã khuyến mãi (tùy chọn)</label>
              <div class="promo-input-wrap">
                <input type="text" class="form-control form-control-sm" v-model="promoCode"
                       placeholder="Nhập mã..." @keyup.enter="applyPromo" />
                <button class="btn-apply-promo" @click="applyPromo" :disabled="applyingPromo">
                  <i class="fas fa-spinner fa-spin" v-if="applyingPromo"></i>
                  <span v-else>Áp dụng</span>
                </button>
              </div>
              <div v-if="promoResult" class="promo-result" :class="promoResult.valid ? 'valid' : 'invalid'">
                <i :class="promoResult.valid ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                {{ promoResult.message }}
              </div>
            </div>

            <div class="book-total mt-3">
              Tổng thanh toán:
              <strong style="color:#2d7a3a;">{{ formatPrice(finalPrice) }} VND</strong>
            </div>
            <div class="purchase-notice mt-2">
              <i class="fas fa-info-circle"></i>
              Sau khi đăng ký, vui lòng đến quầy lễ tân để thanh toán và kích hoạt gói.
            </div>
          </div>
          <div class="md-modal-footer">
            <button class="btn-cancel" @click="showPurchase = false">Hủy</button>
            <button class="btn-book-confirm" @click="confirmPurchase" :disabled="purchasing">
              <i class="fas fa-spinner fa-spin me-1" v-if="purchasing"></i>
              <i class="fas fa-check me-1" v-else></i>
              {{ purchasing ? 'Đang xử lý...' : 'Xác nhận đăng ký' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MuaDichVu',
  data() {
    return {
      activeTab: 'marketplace',
      tabs: [
        { key: 'marketplace', label: 'Marketplace' },
        { key: 'trainers',    label: 'Trainers' },
      ],
      trainers: [],

      // ── Perf section ──
      barData: [30, 45, 35, 55, 42, 60, 75],
      satisfactionAvatars: [
        'https://ui-avatars.com/api/?name=A&background=2d7a3a&color=fff&size=32&bold=true',
        'https://ui-avatars.com/api/?name=B&background=4ade80&color=fff&size=32&bold=true',
        'https://ui-avatars.com/api/?name=C&background=16a34a&color=fff&size=32&bold=true',
      ],

      // ── Booking modal ──
      showBook: false,
      bookTarget: null,
      booking: false,
      bookForm: { sessions: 1, note: '' },

      // ── Promo ──
      promoCode: '',
      promoResult: null,
      appliedPromotionId: null,
      applyingPromo: false,

      // ── Loading ──
      loadingPlans: false,
      loadingTrainers: false,
      errorPlans: '',

      // ── Active subscription (từ API) ──
      hasActiveSubscription: false,
      activeSubscription: null,
      activePtContract: null,
      activePlanType: 'membership',
      planTypes: [
        { key: 'membership', label: 'Gói tập' },
        { key: 'pt',         label: 'Gói PT'  },
      ],
      membershipPlans: [], // được fetch từ API
      ptPackages: [
        {
          id: 10,
          badge: 'ĐỀ XUẤT GIẢM CÂN',
          badgeCls: 'badge-green',
          name: 'PT Transformation 24',
          description: 'Lộ trình 24 buổi chuyên sâu tập trung vào việc đốt mỡ và xây dựng cơ bắp nền tảng.',
          durationLabel: '3 THÁNG',
          price: 12000000,
        },
        {
          id: 11,
          badge: 'PHỔ BIẾN NHẤT',
          badgeCls: 'badge-blue',
          name: 'PT Performance 12',
          description: 'Gói 12 buổi linh hoạt, phù hợp với người bận rộn muốn duy trì thể trạng tốt.',
          durationLabel: '1 THÁNG',
          price: 6000000,
        },
        {
          id: 12,
          badge: 'PHỤC HỒI CHỨC NĂNG',
          badgeCls: 'badge-orange',
          name: 'PT Recovery Pro',
          description: 'Chương trình phục hồi 8 buổi cùng HLV chuyên về vật lý trị liệu và chấn thương thể thao.',
          durationLabel: '6 TUẦN',
          price: 4500000,
        },
      ],

      // ── Purchase confirm modal ──
      showPurchase: false,
      purchaseTarget: null,
      purchasing: false,
    }
  },

  computed: {
    finalPrice() {
      if (!this.purchaseTarget) return 0
      if (this.promoResult?.valid && this.promoResult.finalPrice != null) {
        return this.promoResult.finalPrice
      }
      return this.purchaseTarget.price || 0
    },
  },

  mounted() {
    this.fetchAll()
  },

  methods: {
    // ──────────────── FETCH DATA ────────────────
    async fetchAll() {
      await Promise.all([ this.fetchPlans(), this.fetchTrainers(), this.fetchMyActive() ])
    },

    async fetchPlans() {
      this.loadingPlans = true
      this.errorPlans = ''
      try {
        const res = await axios.get('/api/services/membership-plans')
        const list = res.data.data || []
        const midIdx = Math.floor(list.length / 2)
        const tiers = ['THÀNH VIÊN CƠ BẢN', 'THÀNH VIÊN TRUNG THÀNH', 'THÀNH VIÊN NĂNG ĐỘNG', 'GÓI CAO CẤP', 'GÓI ĐẶC BIỆT']
        this.membershipPlans = list.map((p, i) => ({
          ...p,
          name:          p.plan_name,
          durationLabel: p.duration_label,
          tier:          tiers[i] || `GÓI ${i + 1}`,
          featured:      false,
          endDate:       this.calcEndDate(p.duration_days),
          features:      this.parseFeatures(p.description, p.value),
        }))
      } catch {
        this.errorPlans = 'Không tải được danh sách gói tập.'
      } finally {
        this.loadingPlans = false
      }
    },

    async fetchTrainers() {
      this.loadingTrainers = true
      try {
        const res = await axios.get('/api/services/trainers')
        const list = res.data.data || []
        this.trainers  = list.map(t => this.mapTrainer(t))
        this.ptPackages = list.map(t => this.mapTrainerAsPt(t))
      } catch { /* silent */ } finally {
        this.loadingTrainers = false
      }
    },

    async fetchMyActive() {
      try {
        const res = await axios.get('/api/services/my-active')
        this.activeSubscription = res.data.active_plan || null
        this.activePtContract   = res.data.active_pt_contract || null
        this.hasActiveSubscription = !!this.activeSubscription
      } catch { /* silent */ }
    },

    // ──────────────── MAPPERS ────────────────
    mapTrainer(t) {
      const tags = t.specialization
        ? t.specialization.split(',').map(s => s.trim()).filter(Boolean)
        : []
      return {
        id:         t.id,
        name:       t.name || 'HLV',
        experience: t.experience ? `${t.experience} năm` : '',
        specialty:  (t.specialization || 'HUẤN LUYỆN VIÊN').toUpperCase(),
        rating:     4.8,
        price:      t.pt_rate ? `${Math.round(t.pt_rate / 1000)}k` : 'Liên hệ',
        rawPrice:   t.pt_rate || 0,
        tags:       tags.slice(0, 3),
        photo:      t.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name || 'HLV')}&background=1a3a2a&color=fff&bold=true&size=220`,
        _raw:       t,
      }
    },

    mapTrainerAsPt(t) {
      const spec = (t.specialization || '').toLowerCase()
      let badge = 'PHỔ BIẾN NHẤT'; let badgeCls = 'badge-blue'
      if (spec.includes('giảm') || spec.includes('fat') || spec.includes('cardio')) { badge = 'ĐỀ XUẤT GIẢM CÂN'; badgeCls = 'badge-green' }
      else if (spec.includes('yoga') || spec.includes('phục hồi')) { badge = 'PHỤC HỒI CHỨC NĂNG'; badgeCls = 'badge-orange' }
      return {
        id:           t.id,
        badge, badgeCls,
        name:         `PT – ${t.name}`,
        description:  t.description || `Huấn luyện cá nhân với ${t.name}. Chuyên môn: ${t.specialization || 'Đa dạng'}.`,
        durationLabel:'TÙY CHỌN',
        price:        t.pt_rate || 0,
        _raw:         t,
        isPt:         true,
      }
    },

    // ──────────────── HELPERS ────────────────
    calcEndDate(days) {
      const d = new Date(); d.setDate(d.getDate() + (days || 0))
      return d.toLocaleDateString('vi-VN')
    },

    parseFeatures(description, value) {
      const lines = (description || '').split(/[\n•;]/).map(l => l.trim()).filter(l => l.length > 3)
      const result = lines.slice(0, 4)
      if (value && result.length < 3) result.push(value)
      return result.length ? result : ['Truy cập phòng tập 24/7']
    },

    formatPrice(num) {
      return Number(num || 0).toLocaleString('vi-VN')
    },

    // ──────────────── BOOK PT (trainer tab) ────────────────
    openBook(trainer) {
      this.bookTarget = trainer
      this.bookForm   = { sessions: 1, note: '' }
      this.showBook   = true
    },

    async confirmBook() {
      if (this.bookForm.sessions < 1) { alert('Vui lòng nhập số buổi tập.'); return }
      this.booking = true
      try {
        await axios.post('/api/services/purchase-pt', {
          trainer_id:     this.bookTarget._raw?.id || this.bookTarget.id,
          total_sessions: this.bookForm.sessions,
        })
        alert(`Đăng ký gói PT với ${this.bookTarget.name} thành công!\nVui lòng đến quầy lễ tân để xác nhận thanh toán.`)
        this.showBook = false
        this.fetchMyActive()
      } catch (err) {
        alert(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      } finally {
        this.booking = false
      }
    },

    // ──────────────── PURCHASE (marketplace) ────────────────
    openPurchase(plan) {
      this.purchaseTarget    = plan
      this.promoCode         = ''
      this.promoResult       = null
      this.appliedPromotionId = null
      this.showPurchase      = true
    },

    async applyPromo() {
      if (!this.promoCode.trim()) return
      this.applyingPromo = true
      try {
        const res = await axios.get(`/api/promotions/check?code=${encodeURIComponent(this.promoCode)}`)
        const promo = res.data
        if (promo?.is_valid) {
          const discounted = Math.round(this.purchaseTarget.price * (1 - promo.discount / 100))
          this.appliedPromotionId = promo.id
          this.promoResult = { valid: true, message: `Áp dụng thành công! Giảm ${promo.discount}%`, finalPrice: discounted }
        } else {
          this.promoResult = { valid: false, message: 'Mã không hợp lệ hoặc đã hết hạn.' }
          this.appliedPromotionId = null
        }
      } catch {
        this.promoResult = { valid: false, message: 'Mã không hợp lệ hoặc đã hết hạn.' }
        this.appliedPromotionId = null
      } finally {
        this.applyingPromo = false
      }
    },

    async confirmPurchase() {
      if (!this.purchaseTarget) return
      this.purchasing = true
      try {
        if (this.purchaseTarget.isPt) {
          await axios.post('/api/services/purchase-pt', {
            trainer_id:     this.purchaseTarget._raw?.id || this.purchaseTarget.id,
            total_sessions: 12,
          })
        } else {
          await axios.post('/api/services/purchase-plan', {
            plan_id:      this.purchaseTarget.id,
            promotion_id: this.appliedPromotionId || undefined,
          })
        }
        alert('Đăng ký thành công! Vui lòng đến quầy lễ tân để thanh toán và kích hoạt.')
        this.showPurchase = false
        this.fetchMyActive()
      } catch (err) {
        alert(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.')
      } finally {
        this.purchasing = false
      }
    },
  },
}
</script>

<style scoped>
/* ── Root ── */
.md-page {
  font-family: 'Segoe UI', sans-serif;
  max-width: 960px;
  margin: 0 auto;
  padding-bottom: 48px;
  color: #1e293b;
}

/* ── TABS ── */
.md-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 32px;
}
.md-tab-btn {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  padding: 12px 22px;
  font-size: .92rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: color .18s, border-color .18s;
}
.md-tab-btn.active { color: #2d7a3a; border-bottom-color: #2d7a3a; }
.md-tab-btn:hover:not(.active) { color: #475569; }

/* ── TAB PANE ── */
.tab-pane { animation: fadeUp .22s ease; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── HERO ── */
.tr-hero { margin-bottom: 32px; }
.tr-hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #0f4c2a;
  margin-bottom: 10px;
  line-height: 1.2;
}
.tr-hero-sub {
  font-size: .9rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* ── TRAINER CARD ── */
.tr-card {
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,.09);
  background: #fff;
  transition: transform .2s, box-shadow .2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tr-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(0,0,0,.13); }

/* Photo */
.tr-photo-wrap {
  position: relative;
  overflow: hidden;
  height: 210px;
  background: #1a3a2a;
}
.tr-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform .35s;
}
.tr-card:hover .tr-photo { transform: scale(1.04); }

.tr-specialty-badge {
  position: absolute;
  bottom: 12px;
  left: 14px;
  background: rgba(0,0,0,.55);
  color: #4ade80;
  font-size: .6rem;
  font-weight: 800;
  letter-spacing: .06em;
  padding: 4px 12px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
}
.tr-rating-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,.55);
  color: #fbbf24;
  font-size: .72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
}
.tr-rating-badge .fas { font-size: .6rem; }

/* Card body */
.tr-card-body {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.tr-name-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}
.tr-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2px;
}
.tr-exp { font-size: .75rem; color: #94a3b8; }

.tr-price-block { text-align: right; flex-shrink: 0; }
.tr-price-label {
  font-size: .56rem;
  font-weight: 700;
  letter-spacing: .05em;
  color: #94a3b8;
  display: block;
  margin-bottom: 2px;
}
.tr-price {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f4c2a;
}
.tr-price-unit { font-size: .75rem; font-weight: 600; color: #64748b; }

/* Tags */
.tr-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tr-tag {
  font-size: .7rem;
  font-weight: 600;
  padding: 4px 11px;
  border-radius: 20px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

/* CTA Button */
.btn-book {
  width: 100%;
  padding: 11px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d7a3a, #16a34a);
  color: #fff;
  font-size: .88rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: .02em;
  margin-top: auto;
  transition: opacity .18s, transform .18s;
  box-shadow: 0 4px 14px rgba(22,163,74,.3);
}
.btn-book:hover { opacity: .92; transform: translateY(-1px); }

/* ── PERFORMANCE SECTION ── */
.perf-desc-card {
  padding: 28px 26px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,.07);
}
.perf-title {
  font-size: 1.55rem;
  font-weight: 800;
  color: #0f4c2a;
  margin-bottom: 10px;
  line-height: 1.25;
}
.perf-sub {
  font-size: .83rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
}
.perf-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.perf-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: .85rem;
  color: #475569;
}
.perf-list li i { color: #2d7a3a; font-size: .5rem; flex-shrink: 0; }
.perf-list strong { color: #0f172a; }

.perf-metric-card {
  padding: 24px 22px;
  background: #f8fafc;
  border-radius: 18px;
  box-shadow: 0 2px 14px rgba(0,0,0,.05);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.perf-metric-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.perf-metric-label {
  font-size: .6rem;
  font-weight: 700;
  letter-spacing: .07em;
  color: #94a3b8;
  text-transform: uppercase;
}
.perf-metric-big { display: flex; align-items: baseline; gap: 8px; }
.perf-metric-val {
  font-size: 2.1rem;
  font-weight: 800;
  color: #0f4c2a;
}
.perf-metric-vs { font-size: .75rem; color: #94a3b8; }

/* Mini bar chart */
.mini-chart {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 76px;
  padding-top: 8px;
}
.mini-bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  min-height: 8px;
  transition: height .4s ease;
}

/* Satisfaction */
.sat-avatars {
  position: relative;
  height: 36px;
  margin-bottom: 4px;
}
.sat-avatar {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  object-fit: cover;
  top: 0;
}
.sat-count {
  font-size: .9rem;
  font-weight: 700;
  color: #0f172a;
  margin-top: 8px;
}
.sat-quote {
  font-size: .78rem;
  color: #64748b;
  line-height: 1.6;
  font-style: italic;
  border-left: 3px solid #2d7a3a;
  padding-left: 12px;
  margin: 6px 0 0;
}

/* ── MODAL ── */
.md-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}
.md-modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0,0,0,.18);
  width: 500px;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.md-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.md-modal-title { font-size: .95rem; font-weight: 700; color: #0f172a; margin: 0; }
.md-modal-close {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: .8rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.md-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.md-modal-body {
  padding: 20px 22px;
  overflow-y: auto;
  flex: 1;
}
.md-modal-footer {
  padding: 12px 22px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Book avatar */
.book-avatar {
  width: 60px; height: 60px;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #e8f5e9;
}
.book-total {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: .85rem;
  color: #475569;
}

/* Buttons */
.btn-cancel {
  padding: 9px 20px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #fff;
  color: #64748b;
  font-size: .84rem;
  font-weight: 500;
  cursor: pointer;
}
.btn-book-confirm {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 22px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #2d7a3a, #16a34a);
  color: #fff;
  font-size: .84rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(22,163,74,.3);
  transition: opacity .15s;
}
.btn-book-confirm:hover:not(:disabled) { opacity: .9; }
.btn-book-confirm:disabled { opacity: .7; cursor: not-allowed; }

/* Form labels */
.form-label-sm {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .05em;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 6px;
  display: block;
}

/* ── MODAL TRANSITION ── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity .2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .md-modal, .modal-fade-leave-active .md-modal { transition: transform .2s ease; }
.modal-fade-enter-from .md-modal { transform: scale(.95) translateY(16px); }
.modal-fade-leave-to .md-modal   { transform: scale(.95) translateY(16px); }

/* ══════════════════════════════════════════
   MARKETPLACE STYLES
══════════════════════════════════════════ */

/* Alert */
.mk-alert {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fff7ed;
  border: 1.5px solid #fed7aa;
  border-left: 5px solid #f97316;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: .84rem;
  color: #7c3a00;
  margin-bottom: 28px;
  line-height: 1.5;
}
.mk-alert i { color: #f97316; flex-shrink: 0; margin-top: 2px; }

/* Header */
.mk-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}
.mk-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
}
.mk-sub { font-size: .83rem; color: #64748b; margin: 0; }

/* Plan type toggle */
.mk-type-toggle {
  display: flex;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  align-self: flex-start;
}
.mk-type-btn {
  padding: 8px 22px;
  border: none;
  background: #fff;
  color: #64748b;
  font-size: .84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s, color .15s;
}
.mk-type-btn.active {
  background: #0f4c2a;
  color: #fff;
}
.mk-type-btn:not(.active):hover { background: #f8fafc; }

/* Plan cards */
.mk-plan-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 18px;
  padding: 24px 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: 100%;
  transition: box-shadow .2s, transform .2s;
}
.mk-plan-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,.09); transform: translateY(-3px); }
.mk-plan-card.featured {
  border: 2px solid #2d7a3a;
  box-shadow: 0 6px 24px rgba(45,122,58,.18);
}

.mk-plan-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.mk-plan-tier {
  font-size: .6rem;
  font-weight: 700;
  letter-spacing: .06em;
  color: #64748b;
  text-transform: uppercase;
  flex: 1;
  line-height: 1.3;
}
.mk-plan-duration-badge {
  font-size: .72rem;
  font-weight: 800;
  color: #0f4c2a;
  background: #d1fae5;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}
.mk-plan-card.featured .mk-plan-duration-badge {
  background: #0f4c2a;
  color: #fff;
}

.mk-plan-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
}
.mk-plan-price {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.mk-plan-currency { font-size: .85rem; font-weight: 600; color: #64748b; }

/* Feature list */
.mk-plan-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.mk-plan-features li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: .82rem;
  color: #475569;
  line-height: 1.45;
}
.mk-plan-features li i { color: #2d7a3a; flex-shrink: 0; margin-top: 2px; font-size: .75rem; }
.mk-plan-features li.highlight { color: #15803d; font-weight: 600; }
.mk-plan-features li.highlight i { color: #15803d; }

/* Dates */
.mk-plan-dates {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  font-size: .68rem;
  color: #94a3b8;
}
.mk-plan-dates strong { color: #475569; }

/* Register button */
.mk-btn-register {
  width: 100%;
  padding: 11px;
  border: 1.5px solid #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #475569;
  font-size: .86rem;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, border-color .15s;
}
.mk-btn-register:hover { background: #f1f5f9; border-color: #94a3b8; }
.mk-btn-register.primary {
  background: linear-gradient(135deg, #2d7a3a, #16a34a);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 14px rgba(22,163,74,.3);
}
.mk-btn-register.primary:hover { opacity: .92; }

/* ── PT PACKAGES ── */
.mk-pt-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mk-pt-card {
  background: #fff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: box-shadow .2s, transform .2s;
}
.mk-pt-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,.08); transform: translateY(-2px); }

.mk-pt-thumb {
  width: 90px;
  height: 90px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0f4c2a, #2d7a3a);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: rgba(255,255,255,.25);
  font-size: 1.5rem;
  position: relative;
}
.mk-pt-abbr {
  position: absolute;
  bottom: 10px;
  font-size: 1rem;
  font-weight: 800;
  color: rgba(255,255,255,.6);
  letter-spacing: .04em;
}

.mk-pt-info { flex: 1; }
.mk-pt-header-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
.mk-pt-badge {
  font-size: .6rem;
  font-weight: 800;
  letter-spacing: .05em;
  padding: 3px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}
.badge-green  { background: #d1fae5; color: #15803d; }
.badge-blue   { background: #dbeafe; color: #1d4ed8; }
.badge-orange { background: #fff7ed; color: #c2410c; }

.mk-pt-name { font-size: 1rem; font-weight: 800; color: #0f172a; }
.mk-pt-desc { font-size: .8rem; color: #64748b; line-height: 1.5; margin: 0 0 8px; }
.mk-pt-meta { font-size: .65rem; font-weight: 700; letter-spacing: .05em; color: #94a3b8; margin-bottom: 3px; }
.mk-pt-price { font-size: 1.2rem; font-weight: 800; color: #0f172a; }

.mk-btn-detail {
  padding: 10px 22px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #2d7a3a, #16a34a);
  color: #fff;
  font-size: .84rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(22,163,74,.25);
  transition: opacity .15s;
}
.mk-btn-detail:hover { opacity: .9; }

/* ── LOADING ── */
.md-loading {
  text-align: center;
  padding: 48px;
  font-size: .9rem;
  color: #64748b;
}

/* ── PURCHASE INFO CARD ── */
.purchase-info-card {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 14px;
  padding: 18px 20px;
}

/* ── PROMO ── */
.promo-input-wrap {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.btn-apply-promo {
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background: #0f4c2a;
  color: #fff;
  font-size: .78rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity .15s;
}
.btn-apply-promo:hover:not(:disabled) { opacity: .85; }
.btn-apply-promo:disabled { opacity: .6; cursor: not-allowed; }
.promo-result {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 7px;
  font-size: .78rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
}
.promo-result.valid   { background: #dcfce7; color: #15803d; }
.promo-result.invalid { background: #fef2f2; color: #dc2626; }

/* ── PURCHASE NOTICE ── */
.purchase-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: .78rem;
  color: #64748b;
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 14px;
  line-height: 1.5;
}
.purchase-notice i { color: #2d7a3a; flex-shrink: 0; margin-top: 2px; }
</style>
