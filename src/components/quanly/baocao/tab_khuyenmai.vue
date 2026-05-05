<template>
  <div class="km-page">
    <!-- NAV BAR -->
    <div class="km-nav">
      <div class="km-search">
        <i class="fas fa-search"></i>
        <input v-model="search" placeholder="Tìm kiếm khuyến mãi..." />
      </div>
      <div class="km-tabs-wrap">
        <button v-for="t in tabs" :key="t.key"
          :class="['km-tab', activeTab===t.key?'active':'']"
          @click="activeTab=t.key; showCreate=false">{{ t.label }}</button>
      </div>
      
    </div>

    <!-- ======= TAB: TỔNG QUAN ======= -->
    <div v-if="activeTab==='tongquan'">

      <!-- CREATE FORM VIEW (replaces list when showCreate=true) -->
      <transition name="fade">
        <div v-if="showCreate" class="create-layout">
          <div class="create-form-panel">
            <div class="create-header">
              <h2 class="create-title">Tạo Chiến dịch Mới</h2>
              <p class="create-sub">Thiết kế chương trình khuyến mãi hiệu quả cao với các gợi ý thông số từ AI.</p>
            </div>
            <div class="create-body">
              <div class="fg">
                <label class="flbl">TÊN CHIẾN DỊCH</label>
                <input v-model="form.name" class="fi" placeholder="vd: Bứt phá Mùa hè 2024"/>
              </div>
              <div class="fg-row">
              <div class="fg">
                  <label class="flbl">MÃ GIẢM GIÁ</label>
                  <div class="code-wrap">
                    <input
                      :value="form.code"
                      @input="onCodeInput"
                      class="fi"
                      :class="{ 'fi-error': codeFormatError }"
                      placeholder="PEAK24"
                    />
                    <span class="unique-tag" v-if="form.code && !codeFormatError"><i class="fas fa-check-circle"></i> DUY NHẤT</span>
                    <span class="error-tag" v-if="codeFormatError"><i class="fas fa-exclamation-circle"></i> SAI ĐỊNH DẠNG</span>
                  </div>
                  <div class="code-error-msg" v-if="codeFormatError">
                    <i class="fas fa-exclamation-triangle"></i>
                    Mã giảm giá chỉ được chứa chữ cái, số và dấu gạch ngang (-). Không được chứa ký tự đặc biệt hay biểu tượng.
                  </div>
                </div>
                <div class="fg">
                  <label class="flbl">MỨC GIẢM GIÁ (%)</label>
                  <div class="pct-wrap">
                    <input v-model.number="form.discount" type="number" class="fi" placeholder="20"/>
                    <span class="pct-sfx">%</span>
                  </div>
                </div>
              </div>
              <div class="fg">
                <label class="flbl">THỜI GIAN HIỆU LỰC</label>
                <div class="date-row">
                  <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="form.startDate" type="date" class="fi di"/></div>
                  <i class="fas fa-arrow-right darr"></i>
                  <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="form.endDate" type="date" class="fi di"/></div>
                </div>
              </div>
              <div class="fg">
                <label class="flbl">ĐIỀU KIỆN ÁP DỤNG</label>
                <div class="conds">
                  <span class="ctag" v-for="(c,i) in form.conditions" :key="i">
                    <i :class="c.icon"></i> {{ c.label }}
                    <button class="cdel" @click="form.conditions.splice(i,1)"><i class="fas fa-times"></i></button>
                  </span>
                  <button class="btn-addcond" @click="condMenu=!condMenu"><i class="fas fa-plus"></i> Thêm Điều kiện</button>
                </div>
                <div class="cond-dd" v-if="condMenu">
                  <div class="copt" v-for="o in condOpts" :key="o.key" @click="addCond(o)">
                    <i :class="o.icon"></i> {{ o.label }}
                  </div>
                </div>
              </div>
              <div class="fg">
                <textarea v-model="form.desc" class="fta" placeholder="Mô tả thêm logic quy đổi..." rows="4"></textarea>
              </div>
            </div>
            <div class="create-footer">
              <div class="save-error" v-if="saveError" style="color:#dc2626;font-size:.78rem;flex:1;">{{ saveError }}</div>
              <button class="btn-cancel" @click="showCreate=false;saveError=''">Huỷ</button>
              <button class="btn-activate" @click="saveNew" :disabled="saving">
                <i class="fas fa-spinner fa-spin" v-if="saving"></i>
                <i class="fas fa-bolt" v-else></i>
                {{ saving ? 'Đang lưu...' : 'Kích hoạt Chiến dịch' }}
              </button>
            </div>
          </div>

          <!-- AI Panel -->
          <div class="ai-side">
            <div class="ai-badge-btn"><i class="fas fa-wand-magic-sparkles"></i> AI TỐI ƯU ĐANG HOẠT ĐỘNG</div>
            <div class="ai-pred-card">
              <div class="ai-pred-top">
                <div class="ai-pred-hd"><i class="fas fa-robot"></i> DỰ ĐOÁN TỪ AI</div>
                <svg viewBox="0 0 60 30" width="60" height="30">
                  <polyline points="0,25 10,20 20,22 30,12 40,8 50,5 60,2" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="ai-pred-lbl">Chuyển đổi ước tính</div>
              <div class="ai-pred-val">+{{ form.discount ? Math.round(form.discount*1.2) : 24 }}% <span class="ai-pred-tag">đã tối ưu</span></div>
              <blockquote class="ai-quote">"Dựa trên xu hướng thị trường hiện tại, mức <strong>giảm {{ form.discount||20 }}%</strong> kết hợp với <strong>Cam kết Năm</strong> thu hút lượng khách hàng 3 lần so với các tư dài ngắn hơn."</blockquote>
              <button class="btn-applyai">Áp dụng Tinh chỉnh AI</button>
            </div>
            <div class="tag-section">
              <div class="tag-hd">THẺ GỢI Ý</div>
              <div class="tags-wrap">
                <span class="stag" v-for="t in suggestTags" :key="t">#{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- CAMPAIGN LIST VIEW -->
      <div v-if="!showCreate" class="list-view">
        <div class="list-header">
          <div>
            <h2 class="list-title">Danh sách Chiến dịch</h2>
            <p class="list-sub">Quản lý và tối ưu hóa các chương trình ưu đãi của bạn.</p>
          </div>
          <button class="btn-add-camp" @click="showCreate=true">
            <i class="fas fa-plus"></i> Thêm chiến dịch mới
          </button>
        </div>

        <!-- Stats row -->
        <div class="list-stats">
          <div class="ls-card">
            <div class="ls-lbl">ĐANG HOẠT ĐỘNG</div>
            <div class="ls-val">{{ loading ? '...' : statsActive }}</div>
            <div class="ls-trend"><i class="fas fa-arrow-trend-up" style="color:#16a34a"></i> +{{ statsActive }} hiện tại</div>
          </div>
          <div class="ls-card">
            <div class="ls-lbl">TỔNG CHIẾN DỊCH</div>
            <div class="ls-val">{{ loading ? '...' : campaigns.length }}</div>
            <div class="ls-trend"><i class="fas fa-tag" style="color:#2563eb"></i> Tất cả chiến dịch</div>
          </div>
          <div class="ls-card">
            <div class="ls-lbl">TỶ LỆ HOẠT ĐỘNG</div>
            <div class="ls-val">{{ campaigns.length > 0 ? Math.round(statsActive / campaigns.length * 100) : 0 }}%</div>
            <div class="ls-trend" style="color:#7c3aed"><i class="fas fa-bolt"></i> Tỷ lệ hoạt động</div>
          </div>
          <div class="ai-suggest-card">
            <div class="ais-hd"><i class="fas fa-robot" style="color:#7c3aed"></i> ĐỀ XUẤT TỪ AI</div>
            <p class="ais-txt">Chạy khuyến mãi "Chuẩn bị cho mùa hè" để đạt tương tác cao.</p>
            <a href="#" class="ais-link">Khám phá chiến lược <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- Table -->
        <div class="camp-table-wrap">
          <!-- Error -->
          <div v-if="errorMsg" style="padding:16px 20px;background:#fef2f2;color:#dc2626;font-size:.82rem;display:flex;align-items:center;gap:10px;">
            <i class="fas fa-exclamation-triangle"></i> {{ errorMsg }}
            <button @click="fetchPromotions" style="margin-left:auto;background:#fff;border:1.5px solid #fca5a5;border-radius:7px;color:#dc2626;font-size:.8rem;padding:5px 12px;cursor:pointer;"><i class="fas fa-redo"></i> Thử lại</button>
          </div>
          <!-- Loading -->
          <div v-if="loading" style="text-align:center;padding:48px;color:#64748b;">
            <i class="fas fa-spinner fa-spin" style="color:#7c3aed;margin-right:8px;"></i> Đang tải chiến dịch...
          </div>
          <table v-else class="camp-table">
            <thead>
              <tr>
                <th>TÊN CHIẾN DỊCH</th>
                <th>MÃ GIẢM GIÁ</th>
                <th>THỜI GIAN</th>
                <th>MỨC GIẢM GIÁ</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredCamps.length === 0">
                <td colspan="6" style="text-align:center;padding:40px;color:#94a3b8;font-size:.85rem;">
                  <i class="fas fa-tag" style="font-size:1.5rem;margin-bottom:8px;display:block;"></i>
                  Chưa có chiến dịch nào. Hãy tạo chiến dịch mới!
                </td>
              </tr>
              <tr v-for="c in filteredCamps" :key="c.id">
                <td>
                  <div class="tc-name-cell">
                    <div class="tc-bar" :style="{ background: c.color }"></div>
                    <div>
                      <div class="tc-name">{{ c.name }}</div>
                      <div class="tc-target">{{ c.target }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="code-badge">{{ c.code }}</span></td>
                <td class="tc-date"><i class="fas fa-calendar-alt" style="color:#94a3b8;margin-right:4px"></i>{{ c.period }}</td>
                <td class="tc-discount">{{ c.discount }}</td>
                <td>
                  <div class="tc-status-wrap">
                    <label class="toggle" :title="c.status">
                      <input type="checkbox" :checked="c.active" @change="toggleStatus(c)"/>
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="tc-status-txt" :class="c.active?'st-on':'st-off'">{{ c.active?'Hoạt động':'Ngưng' }}</span>
                  </div>
                </td>
                <td class="tc-actions">
                  <button class="btn-act btn-edit-act" @click="openEdit(c)"><i class="fas fa-pen"></i> sửa</button>
                  <button class="btn-act" style="color:#dc2626" @click="deletePromo(c)"><i class="fas fa-trash"></i> xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-row">
          <span class="pg-info">Đang hiển thị {{ filteredCamps.length }} trên tổng số {{ campaigns.length }} chiến dịch</span>
        </div>

        <!-- AI Forecast Banner -->
        <div class="forecast-banner">
          <div class="forecast-icon">
            <svg viewBox="0 0 36 36" width="36" height="36">
              <circle cx="18" cy="18" r="18" fill="url(#fg)"/>
              <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
              <text x="18" y="23" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">AI</text>
            </svg>
          </div>
          <div class="forecast-text">
            <div class="forecast-title">Dự báo Hiệu suất Sắp tới</div>
            <div class="forecast-desc">Dựa trên dữ liệu lịch sử, các chiến dịch ra mắt từ ngày 10 đến 15 tháng 2 có <strong>tỷ lệ tương tác cao hơn 14%</strong> do nhu cầu chuẩn bị cho kỳ nghỉ xuân trong khu vực.</div>
          </div>
          <button class="btn-draft" @click="scheduleDraft">Lên lịch Bản nháp</button>
        </div>
      </div>
    </div>


    <!-- ======= TAB: LỊCH TRÌNH ======= -->
    <div v-if="activeTab==='lichtrinh'" class="lt-content">
      <div class="lt-head">
        <div>
          <h2 class="list-title">LỊCH TRÌNH CHIẾN DỊCH</h2>
          <p class="list-sub">Theo dõi tiến độ và trạng thái các chiến dịch đang chạy.</p>
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn-cancel" @click="filterMonth = !filterMonth">
            <i class="fas fa-calendar-alt"></i> {{ filterMonth ? 'Tất cả' : 'Tháng này' }}
          </button>
          <button class="btn-activate" style="padding:8px 16px" @click="openScheduleCreate">
            <i class="fas fa-plus"></i> Lên lịch mới
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filteredSchedule.length === 0" class="tl-empty">
        <i class="fas fa-calendar-times"></i>
        <p>Không có chiến dịch nào{{ filterMonth ? ' trong tháng này' : '' }}.</p>
      </div>

      <div class="tl-list">
        <div class="tl-item" v-for="(s, i) in filteredSchedule" :key="s.id">
          <div class="tl-dot" :class="s.dotCls"></div>
          <div class="tl-card">
            <div class="tl-card-top">
              <span class="tl-date">{{ s.date }}</span>
              <span class="tl-date" v-if="s.dateEnd" style="background:#e0f2fe;color:#0369a1">→ {{ s.dateEnd }}</span>
              <span class="tl-st" :class="s.stCls">{{ s.status }}</span>
              <div class="tl-actions">
                <button class="tl-btn-act" title="Chỉnh sửa" @click="openEdit(getCampaignById(s.id))">
                  <i class="fas fa-pen"></i>
                </button>
                <button class="tl-btn-act tl-btn-del" title="Xóa" @click="deletePromo(getCampaignById(s.id))">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <div class="tl-name">{{ s.name }}</div>
            <div class="tl-meta">
              <span><i class="fas fa-tag"></i> {{ s.code }}</span>
              <span><i class="fas fa-percent"></i> Giảm {{ s.disc }}%</span>
              <span v-if="s.usageLimit"><i class="fas fa-users"></i> Tối đa {{ s.usageLimit }} lượt</span>
              <span v-if="s.description" class="tl-desc-tag"><i class="fas fa-info-circle"></i> {{ s.description }}</span>
            </div>
            <div class="tl-prog-wrap"><div class="tl-prog" :style="{ width: s.prog + '%', background: s.pc }"></div></div>
            <div class="tl-prog-lbl">Tiến độ: {{ s.prog }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- MODAL: CHỈNH SỮA CHIẾN DỊCH                          -->
    <!-- ===================================================== -->
    <transition name="modal-km-fade">
      <div class="km-overlay" v-if="showEditModal" @click.self="closeEdit">
        <div class="km-modal">
          <!-- Header -->
          <div class="km-modal-header">
            <h3 class="km-modal-title"><i class="fas fa-pen" style="color:#6366f1;margin-right:8px"></i>Chỉnh sửa Chiến dịch</h3>
            <button class="km-modal-close" @click="closeEdit"><i class="fas fa-times"></i></button>
          </div>
          <!-- Body -->
          <div class="km-modal-body">
            <div class="edit-error" v-if="editError">{{ editError }}</div>
            <div class="fg">
              <label class="flbl">TÊN CHIẾN DỊCH <span style="color:#ef4444">*</span></label>
              <input v-model="editForm.name" class="fi" placeholder="Tên chiến dịch" />
            </div>
            <div class="fg-row">
              <div class="fg">
                <label class="flbl">MÃ GIẢM GIÁ</label>
                <input v-model="editForm.code" class="fi" placeholder="CODE" />
              </div>
              <div class="fg">
                <label class="flbl">MỨC GIẢM (%)</label>
                <div class="pct-wrap">
                  <input v-model.number="editForm.discount" type="number" class="fi" min="0" max="100" />
                  <span class="pct-sfx">%</span>
                </div>
              </div>
            </div>
            <div class="fg">
              <label class="flbl">THỚI GIAN HIỆU LỰC</label>
              <div class="date-row">
                <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="editForm.startDate" type="date" class="fi di" /></div>
                <i class="fas fa-arrow-right darr"></i>
                <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="editForm.endDate" type="date" class="fi di" /></div>
              </div>
            </div>
            <div class="fg">
              <label class="flbl">GIỚI HẠN SỬ DỤNG (lượt)</label>
              <input v-model.number="editForm.usage_limit" type="number" class="fi" placeholder="Để trống nếu không giới hạn" min="0" />
            </div>
            <div class="fg">
              <label class="flbl">MÔ TẢ</label>
              <textarea v-model="editForm.desc" class="fta" rows="3" placeholder="Mô tả chiến dịch..."></textarea>
            </div>
          </div>
          <!-- Footer -->
          <div class="km-modal-footer">
            <button class="btn-cancel" @click="closeEdit">Hủy</button>
            <button class="btn-activate" @click="submitEdit" :disabled="editing">
              <i class="fas fa-spinner fa-spin" v-if="editing"></i>
              <i class="fas fa-check" v-else></i>
              {{ editing ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { promotionApi } from '@/services/promotionApi.js'

export default {
  name: 'TabKhuyenMai',
  components: {},
  data() {
    return {
      activeTab: 'tongquan',
      showCreate: false,
      search: '',
      condMenu: false,

      // Loading states
      loading: false,
      errorMsg: '',
      saving: false,
      saveError: '',

      // Edit modal
      showEditModal: false,
      editingId: null,
      editForm: { name: '', code: '', discount: 20, startDate: '', endDate: '', usage_limit: '', desc: '' },
      editing: false,
      editError: '',

      // Schedule filter
      filterMonth: false,
      tabs: [
        { key: 'tongquan',  label: 'Tổng quan' },
        { key: 'lichtrinh', label: 'Lịch trình' },
      ],
      form: {
        name: '',
        code: '',
        discount: 20,
        startDate: '',
        endDate: '',
        conditions: [{ key: 'year', label: 'Gói năm', icon: 'fas fa-calendar-check' }],
        desc: '',
        usage_limit: ''
      },
      condOpts: [
        { key: 'year',     label: 'Gói năm',          icon: 'fas fa-calendar-check' },
        { key: 'month',    label: 'Gói tháng',         icon: 'fas fa-calendar-alt' },
        { key: 'new',      label: 'Hội viên mới',      icon: 'fas fa-user-plus' },
        { key: 'referral', label: 'Giới thiệu bạn bè', icon: 'fas fa-user-friends' },
        { key: 'birthday', label: 'Sinh nhật',         icon: 'fas fa-birthday-cake' },
        { key: 'pt',       label: 'Gói PT',            icon: 'fas fa-dumbbell' },
      ],
      suggestTags: ['DuyTri', 'TăngTrưởng_Q3', 'Sôm', 'ĐộcQuyền_SmartGym'],

      // Dữ liệu từ API
      campaigns: [],

      // Lịch trình (dùng từ campaigns)
      scheduleColors: ['#2d7a3a', '#6366f1', '#f59e0b', '#64748b', '#ec4899'],
    }
  },

  computed: {
    // Kiểm tra định dạng mã giảm giá: chỉ cho phép chữ, số, gạch ngang, gạch dưới
    codeFormatError() {
      if (!this.form.code) return false
      return !/^[A-Za-z0-9\-_]+$/.test(this.form.code)
    },
    filteredCamps() {
      const q = this.search.toLowerCase()
      return this.campaigns.filter(c =>
        !q || c.name.toLowerCase().includes(q) || (c.code || '').toLowerCase().includes(q)
      )
    },

    // Thống kê từ API data
    statsActive() {
      return this.campaigns.filter(c => c.active).length
    },

    // Tạo lịch trình từ campaigns
    schedule() {
      return this.campaigns.map((c, i) => {
        const now = new Date()
        const start = c.start_date ? new Date(c.start_date) : null
        const end = c.end_date ? new Date(c.end_date) : null

        let status = 'Lên kế hoạch'
        let stCls = 'sl-yellow'
        let dotCls = 'dot-yellow'
        let prog = 0
        let pc = '#f59e0b'

        if (start && end) {
          if (now >= start && now <= end) {
            status = 'Đang chạy'
            stCls = 'sl-green'
            dotCls = 'dot-green'
            pc = '#2d7a3a'
            const total = end - start
            const elapsed = now - start
            prog = Math.round((elapsed / total) * 100)
          } else if (now > end) {
            status = 'Đã kết thúc'
            stCls = 'sl-gray'
            dotCls = 'dot-gray'
            pc = '#64748b'
            prog = 100
          } else {
            status = 'Sắp diễn ra'
            stCls = 'sl-blue'
            dotCls = 'dot-blue'
            pc = '#6366f1'
          }
        }

        const dateLabel = c.start_date
          ? new Date(c.start_date).toLocaleDateString('vi-VN')
          : '—'

        return {
          id: c.id,
          date: dateLabel,
          dateEnd: c.end_date ? new Date(c.end_date).toLocaleDateString('vi-VN') : null,
          name: c.name,
          code: c.code || '—',
          disc: c._raw?.discount || 0,
          description: c.target !== 'Tất cả hội viên' ? c.target : '',
          usageLimit: c.usage_limit || null,
          status,
          stCls,
          dotCls,
          reach: c.usage_limit ? `${c.usage_limit} lượt` : '—',
          prog,
          pc,
        }
      })
    },

    // Lịch trình lọc theo tháng hiện tại nếu filterMonth = true
    filteredSchedule() {
      if (!this.filterMonth) return this.schedule
      const now = new Date()
      return this.schedule.filter(s => {
        const c = this.campaigns.find(x => x.id === s.id)
        if (!c) return false
        const start = c.start_date ? new Date(c.start_date) : null
        const end   = c.end_date   ? new Date(c.end_date)   : null
        if (!start) return false
        return (
          (start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()) ||
          (end && end.getMonth() === now.getMonth() && end.getFullYear() === now.getFullYear()) ||
          (start <= now && end && end >= now)
        )
      })
    },
  },

  mounted() {
    this.fetchPromotions()
  },

  methods: {
    // ─── Lấy danh sách khuyến mãi ────────────────────────────
    async fetchPromotions() {
      this.loading = true
      this.errorMsg = ''
      try {
        const res = await promotionApi.getAll()
        const data = res.data
        const list = Array.isArray(data) ? data : (data.data || [])

        this.campaigns = list.map((p, i) => this.mapPromotion(p, i))
      } catch (err) {
        console.error('fetchPromotions error:', err)
        this.errorMsg = err?.response?.data?.message || err.message || 'Lỗi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },

    // ─── Map API → định dạng FE ──────────────────────────────
    mapPromotion(p, idx = 0) {
      const colors = ['#2d7a3a', '#6366f1', '#f59e0b', '#ec4899', '#14b8a6']
      const now = new Date()
      const start = p.start_date ? new Date(p.start_date) : null
      const end = p.end_date ? new Date(p.end_date) : null
      const isActive = start && end ? (now >= start && now <= end) : true

      const period = (p.start_date && p.end_date)
        ? `${new Date(p.start_date).toLocaleDateString('vi-VN')} – ${new Date(p.end_date).toLocaleDateString('vi-VN')}`
        : (p.start_date ? new Date(p.start_date).toLocaleDateString('vi-VN') : 'Đang diễn ra')

      return {
        id: p.id,
        name: p.title || p.name,
        target: p.description || 'Tất cả hội viên',
        code: p.code || '—',
        period,
        discount: p.discount ? `GIẢM ${p.discount}%` : '—',
        active: isActive,
        color: colors[idx % colors.length],
        // Raw fields
        start_date: p.start_date,
        end_date: p.end_date,
        usage_limit: p.usage_limit,
        _raw: p,
      }
    },

    // ─── Lưu chiến dịch mới ──────────────────────────────────
    async saveNew() {
      if (!this.form.name) {
        this.saveError = 'Vui lòng nhập tên chiến dịch.'
        return
      }
      if (this.codeFormatError) {
        this.saveError = 'Mã giảm giá không hợp lệ. Chỉ được dùng chữ cái, số và dấu gạch ngang (-).'
        return
      }
      if (this.form.discount !== '' && this.form.discount !== null && Number(this.form.discount) <= 0) {
        this.saveError = 'Mức giảm giá phải lớn hơn 0%. Vui lòng nhập lại.'
        return
      }
      if (!this.form.startDate || !this.form.endDate) {
        this.saveError = 'Vui lòng nhập đầy đủ thời gian hiệu lực (ngày bắt đầu và ngày kết thúc).'
        return
      }
      if (new Date(this.form.startDate) >= new Date(this.form.endDate)) {
        this.saveError = 'Ngày bắt đầu phải nhỏ hơn ngày kết thúc.'
        return
      }
      this.saving = true
      this.saveError = ''
      try {
        const payload = {
          title: this.form.name,
          code: this.form.code || undefined,
          discount: this.form.discount != null && this.form.discount !== '' ? this.form.discount : undefined,
          description: this.form.desc || undefined,
          start_date: this.form.startDate || undefined,
          end_date: this.form.endDate || undefined,
          usage_limit: this.form.usage_limit || undefined,
        }
        const res = await promotionApi.create(payload)
        const newPromo = res.data?.data ?? res.data
        this.campaigns.unshift(this.mapPromotion(newPromo, 0))

        // Reset form
        this.form = { name: '', code: '', discount: 20, startDate: '', endDate: '', conditions: [], desc: '', usage_limit: '' }
        this.showCreate = false
      } catch (err) {
        console.error('saveNew error:', err)
        if (err?.response?.data?.errors) {
          this.saveError = Object.values(err.response.data.errors).flat().join(', ')
        } else {
          this.saveError = err?.response?.data?.message || 'Lỗi khi lưu chiến dịch'
        }
      } finally {
        this.saving = false
      }
    },

    // ─── Xóa chiến dịch ──────────────────────────────────────
    async deletePromo(c) {
      if (!confirm(`Xóa chiến dịch "${c.name}"?`)) return
      try {
        await promotionApi.remove(c.id)
        this.campaigns = this.campaigns.filter(x => x.id !== c.id)
      } catch (err) {
        alert(err?.response?.data?.message || 'Lỗi khi xóa chiến dịch')
      }
    },

    // ─── Toggle trạng thái ──────────────────────────────────
    async toggleStatus(c) {
      c.active = !c.active
    },

    // ─── Mở modal chỉnh sửa ─────────────────────────────────
    openEdit(c) {
      if (!c) return
      this.editingId = c.id
      this.editError = ''
      const raw = c._raw || {}
      this.editForm = {
        name:        raw.title       || c.name   || '',
        code:        raw.code        || (c.code !== '—' ? c.code : '') || '',
        discount:    raw.discount    != null ? raw.discount : 20,
        startDate:   raw.start_date  ? raw.start_date.substring(0, 10) : '',
        endDate:     raw.end_date    ? raw.end_date.substring(0, 10)   : '',
        usage_limit: raw.usage_limit || '',
        desc:        raw.description || '',
      }
      this.showEditModal = true
    },

    closeEdit() {
      this.showEditModal = false
      this.editingId = null
      this.editError = ''
    },

    // ─── Gửi PUT /api/promotions/{id} ───────────────────────
    async submitEdit() {
      if (!this.editForm.name) {
        this.editError = 'Vui lòng nhập tên chiến dịch.'
        return
      }
      this.editing = true
      this.editError = ''
      try {
        const payload = {
          title:       this.editForm.name,
          code:        this.editForm.code        || undefined,
          discount:    this.editForm.discount != null && this.editForm.discount !== '' ? this.editForm.discount : undefined,
          description: this.editForm.desc        || undefined,
          start_date:  this.editForm.startDate   || undefined,
          end_date:    this.editForm.endDate     || undefined,
          usage_limit: this.editForm.usage_limit || undefined,
        }
        const res = await promotionApi.update(this.editingId, payload)
        const updated = res.data?.data ?? res.data
        const idx = this.campaigns.findIndex(x => x.id === this.editingId)
        if (idx !== -1) this.campaigns.splice(idx, 1, this.mapPromotion(updated, idx))
        this.closeEdit()
      } catch (err) {
        console.error('submitEdit error:', err)
        this.editError = err?.response?.data?.errors
          ? Object.values(err.response.data.errors).flat().join(', ')
          : (err?.response?.data?.message || 'Lỗi khi cập nhật')
      } finally {
        this.editing = false
      }
    },

    // ─── Lấy campaign theo id (dùng cho tab Lịch trình) ─────
    getCampaignById(id) {
      return this.campaigns.find(c => c.id === id) || null
    },

    // ─── Nút "Lên lịch mới": chuyển tab + mở form tạo ──────
    openScheduleCreate() {
      this.activeTab = 'tongquan'
      this.$nextTick(() => { this.showCreate = true })
    },

    // ─── Xử lý nhập mã giảm giá: tự loại bỏ khoảng trắng ───
    onCodeInput(e) {
      // Tự loại bỏ toàn bộ khoảng trắng ngay khi gõ
      this.form.code = e.target.value.replace(/\s/g, '')
    },

    // ─── Điều kiện áp dụng ──────────────────────────────────
    addCond(o) {
      if (!this.form.conditions.find(c => c.key === o.key)) this.form.conditions.push({ ...o })
      this.condMenu = false
    },

    // ─── Lên lịch Bản nháp: điền dữ liệu AI gợi ý vào form ─
    scheduleDraft() {
      // Tính ngày bắt đầu = 10 ngày tới, ngày kết thúc = 40 ngày tới
      const pad = n => String(n).padStart(2, '0')
      const toDateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`
      const start = new Date()
      start.setDate(start.getDate() + 10)
      const end = new Date()
      end.setDate(end.getDate() + 40)

      // Điền sẵn thông số AI gợi ý vào form
      this.form = {
        name: 'Chuẩn bị cho Mùa hè ' + new Date().getFullYear(),
        code: 'SUMMER' + new Date().getFullYear(),
        discount: 15,
        startDate: toDateStr(start),
        endDate: toDateStr(end),
        conditions: [
          { key: 'new',   label: 'Hội viên mới',  icon: 'fas fa-user-plus' },
          { key: 'month', label: 'Gói tháng',     icon: 'fas fa-calendar-alt' },
        ],
        desc: 'Chiến dịch được AI gợi ý dựa trên xu hướng thị trường: ra mắt từ ngày 10 đến 15 tháng tới có tỷ lệ tương tác cao hơn 14%.',
        usage_limit: '',
      }
      this.saveError = ''

      // Chuyển sang tab Tổng quan và mở form tạo chiến dịch
      this.activeTab = 'tongquan'
      this.$nextTick(() => { this.showCreate = true })
    },
  },
}
</script>


<style scoped>
/* ======= ROOT ======= */
.km-page { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; color:#1e293b; }

/* ======= NAV ======= */
.km-nav { display:flex; align-items:center; gap:12px; background:#fff; border-radius:12px; padding:10px 16px; box-shadow:0 2px 10px rgba(0,0,0,0.05); flex-wrap:wrap; }
.km-search { display:flex; align-items:center; gap:8px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; padding:6px 12px; flex:1; min-width:160px; }
.km-search i { color:#94a3b8; font-size:.8rem; }
.km-search input { border:none; outline:none; background:transparent; font-size:.82rem; color:#475569; width:100%; }
.km-search input::placeholder { color:#94a3b8; }
.km-tabs-wrap { display:flex; gap:4px; }
.km-tab { padding:7px 16px; border:none; background:transparent; border-radius:8px; font-size:.84rem; font-weight:500; color:#64748b; cursor:pointer; transition:all .15s; }
.km-tab:hover { background:#f1f5f9; color:#1e293b; }
.km-tab.active { background:#f1f5f9; color:#1e293b; font-weight:700; border-bottom:2px solid #6366f1; }
.km-nav-right { display:flex; align-items:center; gap:8px; margin-left:auto; }
.btn-notif,.btn-help { position:relative; width:34px; height:34px; border-radius:9px; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; font-size:.85rem; cursor:pointer; }
.nd { position:absolute; top:6px; right:7px; width:7px; height:7px; background:#ef4444; border-radius:50%; border:1.5px solid #fff; }
.km-user { display:flex; align-items:center; gap:8px; padding-left:10px; border-left:1px solid #e2e8f0; }
.km-user-info { display:flex; flex-direction:column; text-align:right; }
.km-uname { font-size:.82rem; font-weight:600; }
.km-urole { font-size:.68rem; color:#94a3b8; }
.km-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#a855f7); color:#fff; font-weight:700; font-size:.78rem; display:flex; align-items:center; justify-content:center; }

/* ======= LIST VIEW ======= */
.list-view { display:flex; flex-direction:column; gap:18px; }
.list-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.list-title { font-size:1.5rem; font-weight:800; color:#0f172a; margin:0 0 4px; }
.list-sub { font-size:.78rem; color:#64748b; margin:0; }
.btn-add-camp { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border:none; border-radius:10px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.85rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(99,102,241,.35); transition:opacity .15s,transform .15s; }
.btn-add-camp:hover { opacity:.9; transform:translateY(-1px); }

/* Stats row */
.list-stats { display:grid; grid-template-columns:1fr 1fr 1fr 1.2fr; gap:14px; }
.ls-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.ls-lbl { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.ls-val { font-size:1.7rem; font-weight:800; color:#0f172a; margin-bottom:4px; }
.ls-trend { font-size:.72rem; color:#64748b; display:flex; align-items:center; gap:4px; }
.ai-suggest-card { background:linear-gradient(135deg,#ede9fe,#dbeafe); border:1px solid #c4b5fd; border-radius:12px; padding:16px 18px; }
.ais-hd { font-size:.65rem; font-weight:700; color:#7c3aed; letter-spacing:.4px; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
.ais-txt { font-size:.78rem; color:#475569; line-height:1.5; margin:0 0 8px; }
.ais-link { font-size:.75rem; font-weight:700; color:#7c3aed; text-decoration:none; display:flex; align-items:center; gap:5px; }

/* Table */
.camp-table-wrap { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.06); overflow:hidden; }
.camp-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.camp-table th { text-align:left; font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:12px 16px; border-bottom:1px solid #f1f5f9; background:#fafafa; }
.camp-table td { padding:14px 16px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.camp-table tr:last-child td { border-bottom:none; }
.camp-table tr:hover td { background:#fafafe; }
.tc-name-cell { display:flex; align-items:flex-start; gap:10px; }
.tc-bar { width:4px; height:40px; border-radius:4px; flex-shrink:0; margin-top:2px; }
.tc-name { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:3px; }
.tc-target { font-size:.7rem; color:#94a3b8; }
.code-badge { background:#f1f5f9; color:#475569; font-size:.72rem; font-weight:700; padding:4px 10px; border-radius:6px; font-family:monospace; }
.tc-date { font-size:.75rem; color:#475569; white-space:nowrap; }
.tc-discount { font-size:.82rem; font-weight:800; color:#2d7a3a; }
/* Toggle */
.tc-status-wrap { display:flex; align-items:center; gap:7px; }
.toggle { position:relative; width:38px; height:22px; cursor:pointer; }
.toggle input { opacity:0; width:0; height:0; }
.toggle-slider { position:absolute; inset:0; background:#cbd5e1; border-radius:20px; transition:.2s; }
.toggle-slider:before { content:''; position:absolute; width:16px; height:16px; left:3px; top:3px; background:#fff; border-radius:50%; transition:.2s; }
input:checked + .toggle-slider { background:#16a34a; }
input:checked + .toggle-slider:before { transform:translateX(16px); }
.tc-status-txt { font-size:.72rem; font-weight:600; }
.st-on  { color:#16a34a; }
.st-off { color:#94a3b8; }
/* Actions */
.tc-actions { display:flex; align-items:center; gap:8px; }
.btn-act { background:none; border:none; font-size:.78rem; color:#64748b; cursor:pointer; padding:0 2px; font-weight:500; }
.btn-act:hover { color:#1e293b; }
.btn-act-primary { padding:5px 12px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:7px; font-size:.73rem; font-weight:600; color:#475569; cursor:pointer; white-space:nowrap; transition:background .15s; }
.btn-act-primary:hover { background:#ede9fe; color:#7c3aed; border-color:#c4b5fd; }

/* Pagination */
.pagination-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.pg-info { font-size:.73rem; color:#64748b; }
.pg-btns { display:flex; gap:4px; }
.pg-btn { width:32px; height:32px; border-radius:8px; border:1.5px solid #e2e8f0; background:#fff; color:#475569; font-size:.8rem; font-weight:600; cursor:pointer; }
.pg-btn.active { background:#6366f1; color:#fff; border-color:#6366f1; }

/* Forecast banner */
.forecast-banner { display:flex; align-items:center; gap:16px; background:#fff; border-radius:12px; padding:16px 20px; box-shadow:0 2px 10px rgba(0,0,0,.06); flex-wrap:wrap; }
.forecast-text { flex:1; min-width:200px; }
.forecast-title { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:4px; }
.forecast-desc { font-size:.75rem; color:#475569; line-height:1.5; }
.btn-draft { padding:9px 20px; border:1.5px solid #2d7a3a; border-radius:9px; background:#fff; color:#2d7a3a; font-size:.82rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:background .15s; }
.btn-draft:hover { background:#f0fdf4; }

/* ======= CREATE FORM ======= */
.create-layout { display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:start; }
.create-form-panel { background:#fff; border-radius:16px; box-shadow:0 2px 16px rgba(0,0,0,.07); overflow:hidden; }
.create-header { padding:24px 28px 16px; border-bottom:1px solid #f1f5f9; }
.create-title { font-size:1.5rem; font-weight:800; color:#0f172a; margin:0 0 6px; }
.create-sub { font-size:.8rem; color:#64748b; margin:0; }
.create-body { padding:20px 28px; display:flex; flex-direction:column; gap:16px; }
.fg { display:flex; flex-direction:column; gap:6px; }
.fg-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.flbl { font-size:.65rem; font-weight:700; color:#94a3b8; letter-spacing:.5px; }
.fi { width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.88rem; color:#1e293b; outline:none; background:#fff; transition:border-color .2s; box-sizing:border-box; }
.fi:focus { border-color:#6366f1; }
.fi::placeholder { color:#cbd5e1; }
.code-wrap { position:relative; }
.unique-tag { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:.6rem; font-weight:700; color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:20px; display:flex; align-items:center; gap:3px; white-space:nowrap; }
.error-tag { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:.6rem; font-weight:700; color:#dc2626; background:#fee2e2; padding:2px 8px; border-radius:20px; display:flex; align-items:center; gap:3px; white-space:nowrap; }
.fi-error { border-color:#dc2626 !important; background:#fff8f8; }
.fi-error:focus { border-color:#dc2626 !important; }
.code-error-msg { font-size:.72rem; color:#dc2626; display:flex; align-items:flex-start; gap:5px; line-height:1.4; margin-top:2px; }
.code-error-msg i { margin-top:2px; flex-shrink:0; }
.pct-wrap { position:relative; }
.pct-sfx { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:#94a3b8; font-weight:600; }
.date-row { display:flex; align-items:center; gap:8px; }
.date-box { flex:1; position:relative; }
.dic { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:.78rem; pointer-events:none; }
.di { padding-left:32px; }
.darr { color:#94a3b8; font-size:.78rem; flex-shrink:0; }
.conds { display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.ctag { display:inline-flex; align-items:center; gap:5px; background:#ede9fe; color:#7c3aed; font-size:.74rem; font-weight:600; padding:5px 10px; border-radius:20px; }
.cdel { background:none; border:none; color:#7c3aed; cursor:pointer; font-size:.62rem; opacity:.7; padding:0; }
.btn-addcond { background:#f8fafc; border:1.5px dashed #cbd5e1; color:#64748b; font-size:.76rem; font-weight:600; padding:5px 12px; border-radius:20px; cursor:pointer; display:flex; align-items:center; gap:5px; }
.cond-dd { background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.1); margin-top:4px; overflow:hidden; }
.copt { display:flex; align-items:center; gap:8px; padding:9px 14px; font-size:.8rem; color:#475569; cursor:pointer; }
.copt:hover { background:#f8fafc; }
.copt i { color:#6366f1; font-size:.78rem; }
.fta { width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.84rem; color:#475569; outline:none; resize:vertical; background:#f8fafc; font-family:inherit; line-height:1.5; transition:border-color .2s; box-sizing:border-box; }
.fta:focus { border-color:#6366f1; background:#fff; }
.fta::placeholder { color:#cbd5e1; }
.create-footer { display:flex; justify-content:flex-end; gap:12px; padding:16px 28px 22px; border-top:1px solid #f1f5f9; }
.btn-cancel { padding:9px 22px; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; color:#64748b; font-size:.84rem; font-weight:500; cursor:pointer; }
.btn-activate { display:inline-flex; align-items:center; gap:7px; padding:9px 22px; border:none; border-radius:10px; background:linear-gradient(135deg,#6366f1,#7c3aed); color:#fff; font-size:.84rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(99,102,241,.3); transition:opacity .15s; }
.btn-activate:hover { opacity:.9; }

/* AI Side Panel */
.ai-side { display:flex; flex-direction:column; gap:14px; }
.ai-badge-btn { display:inline-flex; align-items:center; gap:7px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.7rem; font-weight:700; padding:9px 16px; border-radius:50px; letter-spacing:.3px; }
.ai-pred-card { background:#fff; border-radius:14px; padding:18px; box-shadow:0 2px 14px rgba(0,0,0,.07); border:1px solid #ede9fe; }
.ai-pred-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.ai-pred-hd { font-size:.68rem; font-weight:700; color:#7c3aed; display:flex; align-items:center; gap:5px; }
.ai-pred-lbl { font-size:.7rem; color:#94a3b8; margin-bottom:4px; }
.ai-pred-val { font-size:2rem; font-weight:800; color:#1e293b; display:flex; align-items:baseline; gap:8px; }
.ai-pred-tag { font-size:.65rem; font-weight:700; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:20px; }
.ai-quote { font-size:.76rem; color:#475569; line-height:1.6; margin:10px 0; padding:9px 12px; background:#f8fafc; border-radius:8px; border-left:3px solid #6366f1; font-style:italic; }
.btn-applyai { width:100%; padding:10px; border:none; border-radius:9px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.82rem; font-weight:700; cursor:pointer; }
.tag-section { background:#fff; border-radius:12px; padding:14px 16px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.tag-hd { font-size:.63rem; font-weight:700; color:#94a3b8; letter-spacing:.5px; margin-bottom:9px; }
.tags-wrap { display:flex; flex-wrap:wrap; gap:7px; }
.stag { font-size:.74rem; font-weight:600; background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:20px; cursor:pointer; }
.stag:hover { background:#ede9fe; color:#7c3aed; }

/* ======= LỊCH TRÌNH ======= */
.lt-content { display:flex; flex-direction:column; gap:18px; }
.lt-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.tl-list { display:flex; flex-direction:column; gap:12px; padding-left:14px; }
.tl-item { display:flex; gap:16px; position:relative; }
.tl-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; margin-top:8px; z-index:1; }
.dot-green  { background:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.2); }
.dot-blue   { background:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.2); }
.dot-yellow { background:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.2); }
.dot-gray   { background:#64748b; box-shadow:0 0 0 3px rgba(100,116,139,.2); }
.tl-card { background:#fff; border-radius:12px; padding:14px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); flex:1; }
.tl-card-top { display:flex; align-items:center; gap:10px; margin-bottom:7px; }
.tl-date { font-size:.7rem; font-weight:700; color:#475569; background:#f1f5f9; padding:3px 10px; border-radius:20px; }
.tl-st { font-size:.68rem; font-weight:700; padding:3px 10px; border-radius:20px; }
.sl-green  { background:#dcfce7; color:#16a34a; }
.sl-blue   { background:#dbeafe; color:#2563eb; }
.sl-yellow { background:#fef3c7; color:#d97706; }
.sl-gray   { background:#f1f5f9; color:#64748b; }
.tl-name { font-size:.9rem; font-weight:700; color:#1e293b; margin-bottom:7px; }
.tl-meta { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:9px; }
.tl-meta span { font-size:.73rem; color:#64748b; display:flex; align-items:center; gap:4px; }
.tl-meta i { color:#94a3b8; font-size:.66rem; }
.tl-prog-wrap { height:6px; background:#f1f5f9; border-radius:20px; overflow:hidden; margin-bottom:3px; }
.tl-prog { height:100%; border-radius:20px; }
.tl-prog-lbl { font-size:.67rem; color:#94a3b8; }

/* ======= TRANSITION ======= */
.fade-enter-active,.fade-leave-active { transition:opacity .2s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }

/* ======= NÚT SỬA TRONG BẢNG ======= */
.btn-edit-act { color:#6366f1 !important; }
.btn-edit-act:hover { color:#4f46e5 !important; }

/* ======= LỊCH TRÌNH - ACTIONS ======= */
.tl-card-top { flex-wrap:wrap; }
.tl-actions { margin-left:auto; display:flex; gap:4px; }
.tl-btn-act {
  width: 28px; height: 28px;
  border-radius: 7px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #6366f1;
  font-size: .72rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s, color .15s;
}
.tl-btn-act:hover { background:#ede9fe; border-color:#c4b5fd; }
.tl-btn-del { color: #dc2626; }
.tl-btn-del:hover { background:#fef2f2; border-color:#fca5a5; color:#dc2626; }
.tl-desc-tag { font-style:italic; }

/* Empty state cho lịch trình */
.tl-empty {
  text-align: center;
  padding: 48px;
  color: #94a3b8;
}
.tl-empty i { font-size: 2rem; margin-bottom: 10px; display: block; }
.tl-empty p { font-size: .85rem; margin: 0; }

/* ======= EDIT MODAL ======= */
.km-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}
.km-modal {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(0,0,0,.18);
  width: 560px;
  max-width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.km-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.km-modal-title { font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0; display:flex; align-items:center; }
.km-modal-close {
  width: 32px; height: 32px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  font-size: .85rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.km-modal-close:hover { background: #fee2e2; color: #dc2626; border-color: #fca5a5; }
.km-modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.km-modal-footer {
  padding: 14px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.edit-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 14px;
  color: #dc2626;
  font-size: .82rem;
}

/* modal transition */
.modal-km-fade-enter-active, .modal-km-fade-leave-active { transition: opacity .2s ease; }
.modal-km-fade-enter-from, .modal-km-fade-leave-to { opacity: 0; }
.modal-km-fade-enter-active .km-modal, .modal-km-fade-leave-active .km-modal { transition: transform .2s ease; }
.modal-km-fade-enter-from .km-modal { transform: scale(.95) translateY(16px); }
.modal-km-fade-leave-to .km-modal { transform: scale(.95) translateY(16px); }
</style>


