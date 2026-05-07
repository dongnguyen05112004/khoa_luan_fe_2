<template>
  <div class="tk-page">
    <!-- Page Header -->
    <div class="tk-page-header">
      <div class="tk-header-left">
        <div class="tk-breadcrumb">ADMIN › HỆ THỐNG</div>
        <h1 class="tk-title">Quản lý tài khoản nhân viên và hội viên</h1>
      </div>
      <div class="tk-header-actions">
        <button class="tk-btn-filter" @click="showFilter = !showFilter">
          <i class="fas fa-sliders-h"></i> Lọc dữ liệu
          <span v-if="activeFilterCount" class="tk-filter-badge">{{ activeFilterCount }}</span>
        </button>
        <!-- Filter Dropdown -->
        <div class="tk-filter-dropdown" v-if="showFilter" v-click-outside="() => showFilter = false">
          <div class="tk-filter-title">Lọc theo</div>
          <div class="tk-filter-group">
            <label class="tk-filter-label">CHỨC VỤ / VAI TRÒ</label>
            <select v-model="filterRole" class="tk-filter-select">
              <option value="">Tất cả</option>
              <option v-for="r in roles" :key="r.id" :value="r.name">{{ roleLabel(r.name) }}</option>
            </select>
          </div>
          <div class="tk-filter-group">
            <label class="tk-filter-label">TRẠNG THÁI</label>
            <select v-model="filterStatus" class="tk-filter-select">
              <option value="">Đang hoạt động</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Tạm ngưng</option>
              <option value="banned">Bị khóa</option>
            </select>
          </div>
          <div class="tk-filter-actions">
            <button class="tk-filter-reset" @click="resetFilter">Xóa bộ lọc</button>
            <button class="tk-filter-apply" @click="applyFilter">Áp dụng</button>
          </div>
        </div>
        <button class="tk-btn-add" @click="showAddModal = true">
          <i class="fas fa-user-plus"></i> Thêm nhân sự
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="tk-stats-row">
      <div class="tk-stat-card">
        <div class="tk-stat-icon staff-icon">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="tk-stat-body">
          <div class="tk-stat-change positive">+6% so với tháng trước</div>
          <div class="tk-stat-label">TỔNG NHÂN VIÊN</div>
          <div class="tk-stat-value">{{ stats.totalStaff }}</div>
        </div>
      </div>
      <div class="tk-stat-card">
        <div class="tk-stat-icon member-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="tk-stat-body">
          <div class="tk-stat-change positive">+128 mới</div>
          <div class="tk-stat-label">HỘI VIÊN ĐANG HOẠT ĐỘNG</div>
          <div class="tk-stat-value">{{ stats.activeMembers.toLocaleString() }}</div>
        </div>
      </div>
      <div class="tk-stat-card">
        <div class="tk-stat-icon health-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="tk-stat-body">
          <div class="tk-stat-change neutral" style="color: transparent">—</div>
          <div class="tk-stat-label">SỨC KHỪE HỆ THỐNG</div>
          <div class="tk-stat-value green-val">{{ stats.operationalHealth }}</div>
          <div class="tk-stat-sub optimal">Tốt ưu</div>
        </div>
        <div class="tk-stat-toggle">
          <div class="toggle-pill on"></div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="tk-error-bar">
      <i class="fas fa-exclamation-triangle"></i> {{ errorMsg }}
      <button class="tk-err-retry" @click="fetchUsers(currentPage)"><i class="fas fa-redo"></i> Thử lại</button>
    </div>

    <!-- Table Card -->
    <div class="tk-table-card">
      <!-- Toolbar -->
      <div class="tk-toolbar">
        <div class="tk-search-wrap">
          <i class="fas fa-search tk-search-icon"></i>
          <input v-model="searchQuery" type="text" class="tk-search-input" placeholder="Tìm kiếm theo tên, ID..." />
        </div>
        <div class="tk-toolbar-right">

        </div>
      </div>

      <!-- Table -->
      <div v-if="loading" class="tk-loading">
        <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
      </div>
      <table v-else class="tk-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>HỌ VÀ TÊN</th>
            <th>CHỨC VỤ</th>
            <th>NGÀY GIA NHẬP</th>
            <th>TRẠNG THÁI</th>
            <th>THAO TÁC</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="person in paginatedList" :key="person.id" class="tk-tr">
            <td class="tk-td-id">#{{ person.id }}</td>
            <td class="tk-td-name">
              <div class="tk-name-cell">
                <img :src="person.avatar" :alt="person.name" class="tk-avatar" />
                <div>
                  <div>{{ person.name }}</div>
                  <div class="tk-email-sub">{{ person.email }}</div>
                </div>
              </div>
            </td>
            <td class="tk-td-role">
              <span class="tk-chucvu" :class="getChucVuClass(person)">
                <i :class="getRoleIcon(person)"></i>
                {{ person.chucVu }}
              </span>
            </td>
            <td class="tk-td-date">{{ person.ngayGiaNhap }}</td>
            <td class="tk-td-status">
              <span class="tk-status-dot" :class="getStatusDotClass(person.trangThai)"></span>
              <span class="tk-status-text" :class="getStatusTextClass(person.trangThai)">{{ person.trangThai }}</span>
            </td>
            <td class="tk-td-action">
              <button class="tk-btn-detail" @click="openDetail(person)">
                Xem chi tiết
              </button>
            </td>
          </tr>
          <tr v-if="!loading && paginatedList.length === 0">
            <td colspan="6" class="tk-empty">
              <i class="fas fa-user-slash"></i>
              <p>Không tìm thấy kết quả phù hợp</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="tk-pagination">
        <span class="tk-pag-info">
          Hiện thị {{ pagStart }}-{{ pagEnd }} trong {{ filteredList.length.toLocaleString() }} kết quả
        </span>
        <div class="tk-pag-controls">
          <button class="tk-pag-btn" :disabled="currentPage === 1" @click="currentPage--">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button v-for="p in visiblePages" :key="p" class="tk-pag-btn"
            :class="{ 'tk-pag-active': p === currentPage, 'tk-pag-ellipsis': p === '...' }" :disabled="p === '...'"
            @click="p !== '...' && (currentPage = p)">{{ p }}</button>
          <button class="tk-pag-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- ===================================================== -->
    <!-- MODAL: THÊM NHÂN SỰ MỚI                              -->
    <!-- ===================================================== -->
    <transition name="modal-fade">
      <div class="tk-overlay" v-if="showAddModal" @click.self="showAddModal = false">
        <div class="tk-modal add-modal">
          <button class="tkm-close" @click="showAddModal = false"><i class="fas fa-times"></i></button>
          <div class="tkm-header">
            <h2 class="tkm-title"><i class="fas fa-user-plus" style="color:#2d7a3a;margin-right:8px"></i>Thêm nhân sự /
              hội viên mới</h2>
          </div>
          <div class="add-form-body">
            <div class="add-error" v-if="addError">{{ addError }}</div>
            <div class="add-row">
              <div class="add-fg">
                <label class="add-lbl">HỌ VÀ TÊN <span class="req">*</span></label>
                <input v-model="addForm.name" class="add-fi" placeholder="Nguyễn Văn A" />
              </div>
              <div class="add-fg">
                <label class="add-lbl">EMAIL <span class="req">*</span></label>
                <input v-model="addForm.email" type="email" class="add-fi" placeholder="email@example.com" />
              </div>
            </div>
            <div class="add-row">
              <div class="add-fg">
                <label class="add-lbl">MẬT KHẨU <span class="req">*</span></label>
                <input v-model="addForm.password" type="password" class="add-fi" placeholder="Tối thiểu 8 ký tự" />
              </div>
              <div class="add-fg">
                <label class="add-lbl">SỐ ĐIỆN THOẠI</label>
                <input v-model="addForm.phone" class="add-fi" placeholder="0901234567" />
              </div>
            </div>
            <div class="add-row">
              <div class="add-fg">
                <label class="add-lbl">CHỨC VỤ / VAI TRÒ <span class="req">*</span></label>
                <select v-model="addForm.role_id" class="add-fi">
                  <option value="" disabled>-- Chọn chức vụ --</option>
                  <option v-for="r in roles" :key="r.id" :value="r.id">{{ roleLabel(r.name) }}</option>
                </select>
              </div>
              <div class="add-fg">
                <label class="add-lbl">GIỚI TÍNH</label>
                <select v-model="addForm.gender" class="add-fi">
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
            <div class="add-row">
              <div class="add-fg">
                <label class="add-lbl">TRẠNG THÁI</label>
                <select v-model="addForm.state" class="add-fi">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm ngưng</option>
                  <option value="banned">Bị khóa</option>
                </select>
              </div>
            </div>
          </div>
          <div class="add-footer">
            <button class="tkm-btn-close" style="background:#f3f4f6;color:#374151"
              @click="showAddModal = false">Hủy</button>
            <button class="tkm-btn-close" :disabled="addLoading" @click="submitAdd">
              <i class="fas fa-spinner fa-spin" v-if="addLoading"></i>
              <i class="fas fa-check" v-else></i>
              {{ addLoading ? 'Đang lưu...' : 'Lưu nhân sự' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===================================================== -->
    <!-- MODAL: HỒ SƠ HỘI VIÊN                                -->
    <!-- ===================================================== -->
    <transition name="modal-fade">
      <div class="tk-overlay" v-if="showMemberModal" @click.self="showMemberModal = false">
        <div class="tk-modal member-modal">
          <!-- Header -->
          <div class="tkm-header">
            <h2 class="tkm-title">Hồ sơ Chi tiết Hội viên - {{ selectedPerson?.name }}</h2>
            <button class="tkm-close" @click="showMemberModal = false"><i class="fas fa-times"></i></button>
          </div>

          <div class="tkm-body member-body">
            <!-- Loading state -->
            <div v-if="loadingDetail" class="tkm-loading-detail">
              <i class="fas fa-spinner fa-spin"></i> Đang tải thông tin...
            </div>

            <!-- Left: Thông tin cá nhân -->
            <div class="tkm-left" v-if="!loadingDetail">
              <div class="tkm-section-header">
                <span class="tkm-section-title">Thông tin cá nhân</span>
                <button class="tkm-edit-btn"><i class="fas fa-edit"></i></button>
              </div>

              <div class="tkm-info-grid">
                <div class="tkm-info-group">
                  <div class="tkm-info-label">HỌ TÊN</div>
                  <div class="tkm-info-value">{{ selectedPerson?.name }}</div>
                </div>
                <div class="tkm-info-group">
                  <div class="tkm-info-label">SỐ ĐIỆN THOẠI</div>
                  <div class="tkm-info-value">{{ selectedPerson?.detail?.phone || selectedPerson?.phone || '—' }}</div>
                </div>
                <div class="tkm-info-group">
                  <div class="tkm-info-label">ĐỊA CHỈ EMAIL</div>
                  <div class="tkm-info-value">{{ selectedPerson?.detail?.email || selectedPerson?.email || '—' }}</div>
                </div>
                <div class="tkm-info-group">
                  <div class="tkm-info-label">SỐ BUỔI TẬP</div>
                  <div class="tkm-info-value">
                    {{ selectedPerson?.detail?.sobuoiTap || 0 }} buổi
                  </div>
                </div>
              </div>

              <div class="tkm-goal-box">
                <div class="tkm-info-label">GHI CHÚ SỨC KHỎE</div>
                <div class="tkm-goal-text">"{{ selectedPerson?.detail?.mucTieu || 'Chưa có thông tin' }}"</div>
              </div>

              <!-- Medical alert -->
              <div class="tkm-medical-alert">
                <i class="fas fa-heart-pulse tkm-medical-icon"></i>
                <div class="tkm-medical-content">
                  <div class="tkm-medical-title">TIỀN SỬ Y TẾ & LƯU Ý</div>
                  <div class="tkm-medical-text">{{ selectedPerson?.detail?.tienSuYTe || 'Không có thông tin y tế đặc biệt.' }}</div>
                </div>
              </div>
            </div>

            <!-- Right: Dịch vụ đang dùng -->
            <div class="tkm-right" v-if="!loadingDetail">
              <div class="tkm-section-title" style="margin-bottom: 14px;">Dịch vụ đang dùng</div>

              <div v-if="selectedPerson?.detail?.dichVu?.length">
                <div class="tkm-service-card membership" v-for="sv in selectedPerson.detail.dichVu" :key="sv.id">
                  <div class="tkm-service-name">{{ sv.name }}</div>
                  <div class="tkm-service-expire" v-if="sv.expire">Hết hạn {{ sv.expire }}</div>
                  <div class="tkm-service-remain" v-if="sv.remain">Còn lại: {{ sv.remain }} buổi</div>
                  <span class="tkm-service-badge" :class="sv.badgeClass">{{ sv.badgeLabel }}</span>
                </div>
              </div>
              <div v-else class="tkm-no-service">Chưa có dịch vụ nào đang hoạt động.</div>

              <button class="tkm-add-service-btn">
                <i class="fas fa-plus-circle"></i> Đăng ký thêm dịch vụ
              </button>
            </div>
          </div>

          <div class="tkm-footer">
            <button class="tkm-btn-close" @click="showMemberModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ===================================================== -->
    <!-- MODAL: HỒ SƠ NHÂN VIÊN                               -->
    <!-- ===================================================== -->
    <transition name="modal-fade">
      <div class="tk-overlay" v-if="showStaffModal" @click.self="showStaffModal = false">
        <div class="tk-modal staff-modal">
          <!-- Close -->
          <button class="tkm-close staff-close" @click="showStaffModal = false"><i class="fas fa-times"></i></button>

          <!-- Staff Identity -->
          <div class="tkm-staff-identity">
            <div class="tkm-staff-avatar-wrap">
              <img :src="selectedPerson?.avatar" :alt="selectedPerson?.name" class="tkm-staff-avatar" />
              <span class="tkm-staff-status-dot"
                :class="selectedPerson?.trangThai === 'ĐANG LÀM VIỆC' ? 'dot-green' : 'dot-yellow'"></span>
            </div>
            <div class="tkm-staff-info">
              <div class="tkm-staff-name-row">
                <span class="tkm-staff-name">{{ selectedPerson?.name }}</span>
                <span class="tkm-staff-code">{{ selectedPerson?.id }}</span>
              </div>
              <div class="tkm-staff-title">{{ selectedPerson?.detail?.chucDanh }}</div>
              <div class="tkm-staff-meta">
                <span><i class="fas fa-map-marker-alt"></i> {{ selectedPerson?.detail?.chiNhanh }}</span>
                <span><i class="fas fa-calendar-alt"></i> Địa nhập {{ selectedPerson?.detail?.namsanXuat }}</span>
              </div>
            </div>
          </div>

          <!-- Section: Nhân sự -->
          <div class="tkm-section-label">THÔNG TIN NHÂN SỰ</div>
          <div class="tkm-staff-info-grid">
            <div class="tkm-staff-info-card">
              <div class="tkm-info-label">Lương cơ bản</div>
              <div class="tkm-staff-salary">{{ selectedPerson?.detail?.luongCoBan }}</div>
            </div>
            <div class="tkm-staff-info-card">
              <div class="tkm-info-label">Loại hợp đồng</div>
              <div class="tkm-staff-contract">{{ selectedPerson?.detail?.loaiHopDong }}</div>
            </div>
          </div>

          <!-- Section: Chứng chỉ -->
          <div class="tkm-section-label">CHỨNG CHỈ CHUYÊN MÔN</div>
          <div class="tkm-certs">
            <span class="tkm-cert-tag" v-for="cert in selectedPerson?.detail?.chungChi" :key="cert">{{ cert }}</span>
          </div>

          <!-- Section: Hiệu suất -->
          <div class="tkm-section-label">
            HIỆU SUẤT CÔNG VIỆC
            <span class="tkm-perf-sub">Số buổi tập / tháng</span>
          </div>
          <div class="tkm-chart">
            <div class="tkm-chart-bars">
              <div v-for="(bar, idx) in selectedPerson?.detail?.hieuSuat" :key="idx" class="tkm-bar-col">
                <div class="tkm-bar" :style="{ height: bar.value + 'px' }"
                  :class="{ 'tkm-bar-highlight': bar.highlight }"></div>
                <div class="tkm-bar-label">{{ bar.month }}</div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="tkm-staff-footer">
            <button class="tkm-btn-cancel" @click="showStaffModal = false">Đóng</button>
            <button class="tkm-btn-notify">
              <i class="fas fa-paper-plane"></i> Gửi thông báo
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { userApi, rolesApi } from '@/services/accountApi.js'

export default {
  name: 'TaiKhoanNhanVienHoiVien',
  data() {
    return {
      searchQuery: '',
      currentPage: 1,
      perPage: 10,
      showMemberModal: false,
      showStaffModal: false,
      selectedPerson: null,
      loadingDetail: false,
      loading: false,
      errorMsg: '',

      // Filter
      showFilter: false,
      filterRole: '',
      filterStatus: '',
      appliedRole: '',
      appliedStatus: '',

      // Roles list
      roles: [],

      // Modal form: add new user
      showAddModal: false,
      addForm: { name: '', email: '', password: '', role_id: '', phone: '', gender: 'male', state: 'active' },
      addLoading: false,
      addError: '',

      stats: {
        totalStaff: 0,
        activeMembers: 0,
        operationalHealth: '—',
      },

      // Dữ liệu từ API
      people: [],

      // Pagination từ server
      totalItems: 0,
      serverTotalPages: 1,

      // Roles (staff = role_id khác member)
      // Ta phân biệt: role.name = 'member' -> hội viên, còn lại -> nhân viên
    }
  },

  computed: {
    activeFilterCount() {
      let c = 0
      if (this.appliedRole) c++
      if (this.appliedStatus) c++
      return c
    },
    filteredList() {
      const q = this.searchQuery.toLowerCase()
      let list = this.people
      if (q) {
        list = list.filter(p =>
          (p.name || '').toLowerCase().includes(q) ||
          String(p.id).toLowerCase().includes(q) ||
          (p.chucVu || '').toLowerCase().includes(q) ||
          (p.email || '').toLowerCase().includes(q)
        )
      }
      if (this.appliedRole) {
        list = list.filter(p => p.roleName === this.appliedRole)
      }
      if (this.appliedStatus) {
        list = list.filter(p => p.state === this.appliedStatus)
      }
      return list
    },
    totalPages() {
      return this.serverTotalPages
    },
    paginatedList() {
      // Data đã được phân trang từ server, nhưng nếu filter local thì slice
      if (this.searchQuery) {
        const s = 0
        return this.filteredList.slice(s, this.perPage)
      }
      return this.people
    },
    pagStart() {
      return (this.currentPage - 1) * this.perPage + 1
    },
    pagEnd() {
      return Math.min(this.currentPage * this.perPage, this.totalItems)
    },
    visiblePages() {
      const pages = [], total = this.totalPages, cur = this.currentPage
      if (total <= 5) {
        for (let i = 1; i <= total; i++) pages.push(i)
      } else {
        pages.push(1)
        if (cur > 3) pages.push('...')
        for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
        if (cur < total - 2) pages.push('...')
        pages.push(total)
      }
      return pages
    },
  },

  watch: {
    currentPage(newPage) {
      this.fetchUsers(newPage)
    },
    searchQuery(val) {
      this.currentPage = 1
      this.fetchUsers(1, val)
    },
  },

  mounted() {
    this.fetchUsers(1)
    this.fetchRoles()
  },

  methods: {
    // ─── Map role name → nhãn tiếng Việt ────────────────────
    roleLabel(name) {
      const map = {
        admin: 'Quản trị viên',
        manager: 'Quản lý',
        staff: 'Nhân viên',
        trainer: 'Huấn luyện viên',
        receptionist: 'Lễ tân',
        member: 'Hội viên',
      }
      return map[name] || (name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Không rõ')
    },

    // ─── Map dữ liệu API → định dạng FE ─────────────────────
    mapUser(u) {
      const roleName = u.role ? u.role.name : ''
      const isMember = roleName === 'member'

      // Xác định chức vụ hiển thị (tiếng Việt)
      const chucVu = this.roleLabel(roleName)

      // Trạng thái
      const stateMap = { active: 'ĐANG HOẠT ĐỘNG', inactive: 'TẠM NGƯNG', banned: 'BỊ KHÓA' }
      const trangThai = stateMap[u.state] || u.state || 'KHÔNG RÕ'

      // Avatar
      const displayName = u.full_name || u.name || 'User'
      const bgColor = isMember ? '7c3aed' : '2d7a3a'
      const avatar = u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=${bgColor}&color=ffffff&bold=true&size=40`

      // Ngày gia nhập
      const created = u.created_at ? new Date(u.created_at).toLocaleDateString('vi-VN') : '—'

      return {
        id: u.id,
        name: displayName,
        email: u.email,
        phone: u.phone,
        role: isMember ? 'member' : 'staff',
        roleName,
        chucVu,
        ngayGiaNhap: created,
        trangThai,
        avatar,
        state: u.state,
        _raw: u,
      }
    },

    // ─── Fetch roles từ BE ───────────────────────────────────
    async fetchRoles() {
      try {
        const res = await rolesApi.getAll()
        const data = res.data
        this.roles = Array.isArray(data) ? data : (data?.data || [])
      } catch (e) {
        console.warn('fetchRoles failed, dùng danh sách mặc định:', e.message)
        // Fallback nếu BE chưa có endpoint /roles
        this.roles = [
          { id: 1, name: 'admin' },
          { id: 2, name: 'manager' },
          { id: 3, name: 'staff' },
          { id: 4, name: 'trainer' },
          { id: 5, name: 'receptionist' },
          { id: 6, name: 'member' },
        ]
      }
    },

    // ─── Gọi API lấy danh sách User ──────────────────────────
    async fetchUsers(page = 1, search = this.searchQuery) {
      this.loading = true
      this.errorMsg = ''
      try {
        const params = { page, per_page: this.perPage }
        if (search) params.search = search
        if (this.appliedRole) params.role = this.appliedRole
        if (this.appliedStatus) params.state = this.appliedStatus

        const res = await userApi.getAll(params)
        const data = res.data

        // Hỗ trợ cả response paginated (data.data) và plain array
        let list = []
        if (data && data.data && Array.isArray(data.data)) {
          list = data.data
          this.totalItems = data.meta?.total ?? data.total ?? list.length
          this.serverTotalPages = data.meta?.last_page ?? data.last_page ?? 1
        } else if (Array.isArray(data)) {
          list = data
          this.totalItems = list.length
          this.serverTotalPages = Math.max(1, Math.ceil(list.length / this.perPage))
        }

        this.people = list.map(u => this.mapUser(u))

        // Tính stats
        const staffCount = this.people.filter(p => p.role === 'staff').length
        const memberCount = this.people.filter(p => p.role === 'member' && p.state === 'active').length
        this.stats.totalStaff = staffCount
        this.stats.activeMembers = this.totalItems - staffCount
        this.stats.operationalHealth = '98%'

      } catch (err) {
        console.error('fetchUsers error:', err)
        this.errorMsg = err?.response?.data?.message || err.message || 'Lỗi tải dữ liệu'
      } finally {
        this.loading = false
      }
    },

    // ─── Mở modal chi tiết ───────────────────────────────────
    async openDetail(person) {
      this.selectedPerson = { ...person }
      this.loadingDetail = true

      if (person.role === 'member') {
        this.showMemberModal = true
        this.showStaffModal = false
      } else {
        this.showStaffModal = true
        this.showMemberModal = false
      }

      try {
        const res = await userApi.getOne(person.id)
        const u = res.data?.data ?? res.data

        const emp = u.employee_profile
        const mem = u.member_profile
        const sub = u.active_subscription

        if (person.role === 'member') {
          // Build member detail
          this.selectedPerson.detail = {
            phone: u.phone || '—',
            email: u.email || '—',
            sobuoiTap: 0,
            mucTieu: mem?.health_notes || 'Chưa có thông tin',
            tienSuYTe: mem?.health_notes || 'Chưa có thông tin',
            dichVu: sub ? [{
              id: sub.id,
              name: sub.plan?.name || 'Gói tập',
              expire: sub.end_date ? new Date(sub.end_date).toLocaleDateString('vi-VN') : null,
              remain: null,
              badgeClass: sub.status === 'active' ? 'badge-active-green' : 'badge-yellow',
              badgeLabel: sub.status === 'active' ? 'ĐANG HOẠT ĐỘNG' : 'TẠM NGƯNG',
            }] : [],
          }
        } else {
          // Build staff detail
          const salary = emp?.salary
            ? Number(emp.salary).toLocaleString('vi-VN') + ' VND'
            : '—'

          this.selectedPerson.detail = {
            chucDanh: emp?.position || u.role?.name || '—',
            chiNhanh: u.branch?.name || '—',
            namsanXuat: emp?.hire_date
              ? new Date(emp.hire_date).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })
              : '—',
            luongCoBan: salary,
            loaiHopDong: emp?.department || 'Toàn thời gian',
            chungChi: [],
            hieuSuat: [
              { month: 'T1', value: 50, highlight: false },
              { month: 'T2', value: 65, highlight: false },
              { month: 'T3', value: 80, highlight: false },
              { month: 'T4', value: 72, highlight: true },
              { month: 'T5', value: 58, highlight: false },
            ],
          }
        }
      } catch (err) {
        console.error('openDetail error:', err)
        // Giữ dữ liệu cơ bản đã có
      } finally {
        this.loadingDetail = false
      }
    },

    // ─── Thêm mới User ───────────────────────────────────────
    async submitAdd() {
      if (!this.addForm.name || !this.addForm.email || !this.addForm.password) {
        this.addError = 'Vui lòng điền đầy đủ họ tên, email và mật khẩu.'
        return
      }
      if (!this.addForm.role_id) {
        this.addError = 'Vui lòng chọn chức vụ / vai trò.'
        return
      }
      this.addLoading = true
      this.addError = ''
      try {
        await userApi.create(this.addForm)
        this.showAddModal = false
        this.addForm = { name: '', email: '', password: '', role_id: '', phone: '', gender: 'male', state: 'active' }
        await this.fetchUsers(1)
      } catch (err) {
        const msg = err?.response?.data?.message
        if (err?.response?.data?.errors) {
          this.addError = Object.values(err.response.data.errors).flat().join(', ')
        } else {
          this.addError = msg || 'Lỗi khi thêm nhân sự'
        }
      } finally {
        this.addLoading = false
      }
    },

    // ─── Bộ lọc ──────────────────────────────────────────────
    applyFilter() {
      this.appliedRole = this.filterRole
      this.appliedStatus = this.filterStatus
      this.currentPage = 1
      this.showFilter = false
      this.fetchUsers(1)
    },
    resetFilter() {
      this.filterRole = ''
      this.filterStatus = ''
      this.appliedRole = ''
      this.appliedStatus = ''
      this.currentPage = 1
      this.showFilter = false
      this.fetchUsers(1)
    },

    // ─── CSS helpers ─────────────────────────────────────────
    getChucVuClass(person) {
      const cv = (person.roleName || '').toLowerCase()
      if (cv === 'member') return 'chucvu-member'
      if (cv === 'admin') return 'chucvu-admin'
      if (cv === 'manager') return 'chucvu-manager'
      if (cv === 'trainer') return 'chucvu-trainer'
      if (cv.includes('lễ tân') || cv === 'receptionist') return 'chucvu-letan'
      return 'chucvu-staff'
    },
    getRoleIcon(person) {
      const cv = (person.roleName || '').toLowerCase()
      if (cv === 'member') return 'fas fa-id-card'
      if (cv === 'admin') return 'fas fa-crown'
      if (cv === 'manager') return 'fas fa-user-tie'
      if (cv === 'trainer') return 'fas fa-dumbbell'
      if (cv === 'receptionist') return 'fas fa-concierge-bell'
      return 'fas fa-user'
    },
    getStatusDotClass(status) {
      if (!status) return ''
      if (status.includes('LÀM VIỆC') || status.includes('HOẠT ĐỘNG')) return 'dot-green'
      if (status.includes('TẠM') || status.includes('TAM') || status.includes('NGƯNG')) return 'dot-yellow'
      return 'dot-gray'
    },
    getStatusTextClass(status) {
      if (!status) return ''
      if (status.includes('LÀM VIỆC') || status.includes('HOẠT ĐỘNG')) return 'txt-green'
      if (status.includes('TẠM') || status.includes('TAM') || status.includes('NGƯNG')) return 'txt-yellow'
      return 'txt-gray'
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== ROOT ===== */
.tk-page {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 100%;
}

/* ===== LOADING & ERROR ===== */
.tk-loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
  font-size: 0.9rem;
}

.tk-loading i {
  margin-right: 8px;
  color: #2d7a3a;
}

.tk-error-bar {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 12px 18px;
  color: #dc2626;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tk-err-retry {
  margin-left: auto;
  background: #fff;
  border: 1.5px solid #fca5a5;
  border-radius: 7px;
  color: #dc2626;
  font-size: 0.8rem;
  padding: 5px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
}

.tk-err-retry:hover {
  background: #fef2f2;
}

.tk-email-sub {
  font-size: 0.72rem;
  color: #9ca3af;
  margin-top: 1px;
}

.tkm-loading-detail {
  grid-column: 1 / -1;
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

.tkm-loading-detail i {
  margin-right: 8px;
  color: #2d7a3a;
}

.tkm-no-service {
  font-size: 0.82rem;
  color: #9ca3af;
  font-style: italic;
  padding: 12px 0;
}

/* ===== ADD MODAL ===== */
.add-modal {
  width: 560px;
  max-width: 100%;
  padding: 0;
}

.add-form-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.add-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.add-fg {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.add-lbl {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #9ca3af;
  text-transform: uppercase;
}

.req {
  color: #ef4444;
}

.add-fi {
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: 0.875rem;
  outline: none;
  font-family: inherit;
  background: #fff;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.add-fi:focus {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.1);
}

.add-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 10px 14px;
  color: #dc2626;
  font-size: 0.82rem;
}

.add-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 24px;
  border-top: 1px solid #f3f4f6;
}


.tk-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.tk-breadcrumb {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 4px;
}

.tk-title {
  font-size: 1.65rem;
  font-weight: 700;
  color: #0f1e12;
  margin: 0;
}

.tk-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.tk-btn-filter {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border: 1.5px solid #d1d5db;
  border-radius: 9px;
  background: #fff;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.tk-btn-filter:hover {
  border-color: #2d7a3a;
  background: #f0faf3;
}

.tk-filter-badge {
  background: #2d7a3a;
  color: #fff;
  border-radius: 10px;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 6px;
  margin-left: 2px;
}

.tk-header-actions {
  position: relative;
}

.tk-filter-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 120px;
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  width: 280px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tk-filter-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #0f172a;
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 10px;
}

.tk-filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.tk-filter-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  text-transform: uppercase;
}

.tk-filter-select {
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: 0.85rem;
  outline: none;
  font-family: inherit;
  background: #f9fafb;
  cursor: pointer;
}

.tk-filter-select:focus {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.1);
}

.tk-filter-actions {
  display: flex;
  gap: 8px;
  padding-top: 4px;
}

.tk-filter-reset {
  flex: 1;
  padding: 8px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}

.tk-filter-reset:hover {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #dc2626;
}

.tk-filter-apply {
  flex: 1;
  padding: 8px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: opacity .15s;
}

.tk-filter-apply:hover {
  opacity: .88;
}

.tk-btn-add {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45, 122, 58, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.tk-btn-add:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(45, 122, 58, 0.45);
}

/* ===== STATS CARDS ===== */
.tk-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.tk-stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 22px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f4f8;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  position: relative;
  overflow: hidden;
}

.tk-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2d7a3a, #4ade80);
  opacity: 0.6;
}

.tk-stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.staff-icon {
  background: #e8f5e9;
  color: #2d7a3a;
}

.member-icon {
  background: #eff6ff;
  color: #2563eb;
}

.health-icon {
  background: #f0fdf4;
  color: #059669;
}

.tk-stat-body {
  flex: 1;
}

.tk-stat-change {
  font-size: 0.72rem;
  font-weight: 600;
  margin-bottom: 2px;
}

.tk-stat-change.positive {
  color: #059669;
}

.tk-stat-change.neutral {
  color: transparent;
}

.tk-stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.tk-stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #0f1e12;
  line-height: 1.1;
}

.tk-stat-value.green-val {
  color: #2d7a3a;
}

.tk-stat-sub.optimal {
  font-size: 0.72rem;
  color: #2d7a3a;
  font-weight: 600;
  margin-top: 2px;
}

.tk-stat-toggle {
  position: absolute;
  top: 16px;
  right: 16px;
}

.toggle-pill {
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: #d1d5db;
  position: relative;
  cursor: pointer;
}

.toggle-pill.on {
  background: #2d7a3a;
}

.toggle-pill.on::after {
  content: '';
  position: absolute;
  right: 3px;
  top: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

/* ===== TABLE CARD ===== */
.tk-table-card {
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f4f8;
  overflow: hidden;
}

/* Toolbar */
.tk-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #f3f4f6;
  gap: 12px;
}

.tk-search-wrap {
  position: relative;
  flex: 1;
  max-width: 320px;
}

.tk-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 0.82rem;
}

.tk-search-input {
  width: 100%;
  padding: 9px 14px 9px 36px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: 0.85rem;
  outline: none;
  background: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
  font-family: inherit;
}

.tk-search-input:focus {
  border-color: #2d7a3a;
  box-shadow: 0 0 0 3px rgba(45, 122, 58, 0.1);
  background: #fff;
}

.tk-toolbar-right {
  display: flex;
  gap: 8px;
}

.tk-icon-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.tk-icon-btn:hover {
  background: #f3f4f6;
}

/* Table */
.tk-table {
  width: 100%;
  border-collapse: collapse;
}

.tk-table thead tr {
  background: #f9fafb;
  border-bottom: 1.5px solid #f3f4f6;
}

.tk-table thead th {
  padding: 11px 16px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #6b7280;
  text-align: left;
  white-space: nowrap;
}

.tk-tr {
  border-bottom: 1px solid #f9fafb;
  transition: background 0.15s;
}

.tk-tr:hover {
  background: #f9fafb;
}

.tk-tr:last-child {
  border-bottom: none;
}

.tk-table td {
  padding: 12px 16px;
  vertical-align: middle;
}

.tk-td-id {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
}

.tk-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tk-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.tk-name-cell span {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.tk-chucvu {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.76rem;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

.tk-chucvu i {
  font-size: 0.7rem;
}

.chucvu-staff {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.chucvu-member {
  background: #f5f3ff;
  color: #7c3aed;
  border: 1px solid #ddd6fe;
}

.chucvu-letan {
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
}

.chucvu-admin {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.chucvu-manager {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.chucvu-trainer {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

.tk-td-date {
  font-size: 0.82rem;
  color: #374151;
  white-space: nowrap;
}

.tk-status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  vertical-align: middle;
}

.dot-green {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

.dot-yellow {
  background: #f59e0b;
  box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
}

.dot-gray {
  background: #9ca3af;
}

.tk-status-text {
  font-size: 0.78rem;
  font-weight: 600;
  vertical-align: middle;
}

.txt-green {
  color: #15803d;
}

.txt-yellow {
  color: #b45309;
}

.txt-gray {
  color: #6b7280;
}

.tk-btn-detail {
  padding: 8px 18px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgba(45, 122, 58, 0.3);
}

.tk-btn-detail:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(45, 122, 58, 0.4);
}

.tk-empty {
  text-align: center;
  padding: 48px;
  color: #9ca3af;
  font-size: 0.9rem;
}

.tk-empty i {
  font-size: 2rem;
  margin-bottom: 12px;
  display: block;
}

/* Pagination */
.tk-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1.5px solid #f3f4f6;
  flex-wrap: wrap;
  gap: 10px;
}

.tk-pag-info {
  font-size: 0.8rem;
  color: #6b7280;
}

.tk-pag-controls {
  display: flex;
  gap: 4px;
  align-items: center;
}

.tk-pag-btn {
  min-width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s;
  padding: 0 8px;
  font-family: inherit;
}

.tk-pag-btn:hover:not(:disabled) {
  border-color: #2d7a3a;
  color: #2d7a3a;
}

.tk-pag-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tk-pag-active {
  background: #2d7a3a !important;
  color: #fff !important;
  border-color: #2d7a3a !important;
}

.tk-pag-ellipsis {
  border-color: transparent;
  background: transparent;
  cursor: default;
}

/* ===== OVERLAY ===== */
.tk-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 30, 18, 0.55);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* ===== MODAL BASE ===== */
.tk-modal {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.tk-modal::-webkit-scrollbar {
  width: 5px;
}

.tk-modal::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 4px;
}

.tkm-close {
  position: absolute;
  top: 14px;
  right: 16px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: #f3f4f6;
  color: #374151;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 5;
}

.tkm-close:hover {
  background: #e5e7eb;
}

/* ===== MEMBER MODAL ===== */
.member-modal {
  width: 680px;
  max-width: 100%;
  padding: 0;
}

.tkm-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #f3f4f6;
  padding-right: 52px;
}

.tkm-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.tkm-body.member-body {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 0;
}

.tkm-left {
  padding: 20px 24px;
  border-right: 1px solid #f3f4f6;
}

.tkm-right {
  padding: 20px 20px;
  background: #fafafa;
  border-radius: 0 0 0 0;
}

.tkm-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.tkm-section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #111827;
}

.tkm-edit-btn {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  color: #6b7280;
  font-size: 0.78rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tkm-edit-btn:hover {
  border-color: #2d7a3a;
  color: #2d7a3a;
}

.tkm-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
  margin-bottom: 16px;
}

.tkm-info-group {}

.tkm-info-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.tkm-info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tkm-badge-progress {
  display: inline-block;
  padding: 2px 8px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
}

.tkm-goal-box {
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 14px;
}

.tkm-goal-text {
  font-size: 0.85rem;
  color: #374151;
  margin-top: 4px;
  font-style: italic;
  line-height: 1.5;
}

.tkm-medical-alert {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #fff8f0;
  border: 1.5px solid #fde9c2;
  border-radius: 10px;
  padding: 12px 14px;
}

.tkm-medical-icon {
  color: #ea580c;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.tkm-medical-title {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #ea580c;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.tkm-medical-text {
  font-size: 0.82rem;
  color: #92400e;
  line-height: 1.4;
}

/* Services */
.tkm-service-card {
  background: #fff;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
  position: relative;
}

.tkm-service-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.tkm-service-expire,
.tkm-service-remain {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 6px;
}

.tkm-service-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.badge-active-green {
  background: #dcfce7;
  color: #15803d;
}

.badge-purple {
  background: #f5f3ff;
  color: #7c3aed;
}

.badge-yellow {
  background: #fef9c3;
  color: #a16207;
}

.tkm-add-service-btn {
  width: 100%;
  padding: 10px;
  border: 1.5px dashed #d1d5db;
  border-radius: 10px;
  background: transparent;
  color: #6b7280;
  font-size: 0.82rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  margin-top: 4px;
  transition: border-color 0.2s, color 0.2s;
  font-family: inherit;
}

.tkm-add-service-btn:hover {
  border-color: #2d7a3a;
  color: #2d7a3a;
}

.tkm-footer {
  padding: 14px 24px;
  border-top: 1px solid #f3f4f6;
  display: flex;
  justify-content: flex-end;
}

.tkm-btn-close {
  padding: 9px 24px;
  background: #111827;
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.tkm-btn-close:hover {
  background: #374151;
}

/* ===== STAFF MODAL ===== */
.staff-modal {
  width: 520px;
  max-width: 100%;
  padding: 24px 28px 20px;
}

.staff-close {
  position: absolute;
  top: 16px;
  right: 18px;
}

.tkm-staff-identity {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 22px;
  padding-right: 30px;
}

.tkm-staff-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.tkm-staff-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #e5e7eb;
}

.tkm-staff-status-dot {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.tkm-staff-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 2px;
}

.tkm-staff-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
}

.tkm-staff-code {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9ca3af;
}

.tkm-staff-title {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 6px;
}

.tkm-staff-meta {
  display: flex;
  gap: 14px;
  font-size: 0.78rem;
  color: #6b7280;
}

.tkm-staff-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tkm-staff-meta i {
  font-size: 0.72rem;
}

.tkm-section-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 10px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tkm-perf-sub {
  font-size: 0.68rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.tkm-staff-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 4px;
}

.tkm-staff-info-card {
  background: #f9fafb;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid #f3f4f6;
}

.tkm-staff-salary {
  font-size: 1.05rem;
  font-weight: 700;
  color: #059669;
  margin-top: 4px;
}

.tkm-staff-contract {
  font-size: 0.9rem;
  font-weight: 600;
  color: #111827;
  margin-top: 4px;
}

/* Certs */
.tkm-certs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
}

.tkm-cert-tag {
  display: inline-block;
  padding: 5px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
  background: #fff;
}

/* Chart */
.tkm-chart {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 12px 12px;
  margin-bottom: 4px;
  border: 1px solid #f3f4f6;
  min-height: 110px;
}

.tkm-chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 14px;
  height: 100px;
  padding: 0 8px;
}

.tkm-bar-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.tkm-bar {
  width: 100%;
  max-width: 36px;
  background: #d1fae5;
  border-radius: 5px 5px 0 0;
  min-height: 8px;
  transition: height 0.4s ease;
}

.tkm-bar.tkm-bar-highlight {
  background: #2d7a3a;
}

.tkm-bar-label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #9ca3af;
  letter-spacing: 0.05em;
}

/* Staff modal footer */
.tkm-staff-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 22px;
}

.tkm-btn-cancel {
  padding: 9px 24px;
  background: #fff;
  color: #374151;
  border: 1.5px solid #d1d5db;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: inherit;
}

.tkm-btn-cancel:hover {
  border-color: #2d7a3a;
  color: #2d7a3a;
}

.tkm-btn-notify {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 22px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff;
  border: none;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(45, 122, 58, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
  font-family: inherit;
}

.tkm-btn-notify:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(45, 122, 58, 0.45);
}

/* Responsive */
@media (max-width: 768px) {
  .tk-stats-row {
    grid-template-columns: 1fr;
  }

  .tkm-body.member-body {
    grid-template-columns: 1fr;
  }

  .tkm-left {
    border-right: none;
    border-bottom: 1px solid #f3f4f6;
  }

  .staff-modal,
  .member-modal {
    width: 100%;
    max-width: 100%;
  }
}
</style>
