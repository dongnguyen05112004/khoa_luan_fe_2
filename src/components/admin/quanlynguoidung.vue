<template>
  <div class="acc-mgr">
    <!-- Page Header -->
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title">Quản trị tài khoản hệ thống</h1>
        <p class="page-desc">Phân quyền và quản lý danh sách vận hành viên SmartGym AI.</p>
      </div>
      <button class="btn-create" @click="openCreateModal">
        <i class="fas fa-plus"></i>
        Tạo tài khoản mới
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="search-wrap">
        <i class="fas fa-search search-icon"></i>
        <input
          v-model="searchQuery"
          type="text"
          class="search-input"
          placeholder="Tìm kiếm theo tên, email hoặc mã ID..."
        />
      </div>
      <button class="btn-filter" @click="showFilterPanel = !showFilterPanel">
        <i class="fas fa-sliders-h"></i>
        Lọc
      </button>
      <div class="stats-card">
        <div>
          <div class="stats-label">TỔNG TÀI KHOẢN</div>
          <div class="stats-number">{{ totalAccounts.toLocaleString('vi-VN') }}</div>
        </div>
        <div class="stats-icon"><i class="fas fa-user-plus"></i></div>
      </div>
    </div>

    <!-- Filter Panel -->
    <div class="filter-panel" v-show="showFilterPanel">
      <div class="filter-group">
        <label>Vai trò</label>
        <select v-model="filterRole" class="filter-select">
          <option value="">Tất cả</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="STAFF">STAFF</option> 
          <option value="TRAINER">TRAINER</option>
          <option value="MEMBER">MEMBER</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Trạng thái</label>
        <select v-model="filterStatus" class="filter-select">
          <option value="">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Đã khoá</option>
        </select>
      </div>
      <button class="btn-reset-filter" @click="resetFilter">
        <i class="fas fa-times"></i> Xoá bộ lọc
      </button>
    </div>

    <!-- Table -->
    <div class="table-card">
      <table class="acc-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>THÀNH VIÊN</th>
            <th>EMAIL</th>
            <th>VAI TRÒ</th>
            <th>TRẠNG THÁI</th>
            <th>HÀNH ĐỘNG</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="acc in paginatedAccounts" :key="acc.id" class="table-row">
            <td class="col-id">{{ acc.code || acc.card_number || acc.id }}</td>
            <td class="col-member">
              <div class="member-cell">
                <img :src="acc.avatar" :alt="acc.full_name || acc.name" class="member-avatar" />
                <span class="member-name">{{ acc.full_name || acc.name }}</span>
              </div>
            </td>
            <td class="col-email">{{ acc.email }}</td>
            <td class="col-role">
              <span class="role-badge" :class="'role-' + getRoleClass(acc)">{{ getRoleName(acc) }}</span>
            </td>
            <td class="col-status">
              <span class="status-dot" :class="acc.state === 'active' ? 'dot-active' : 'dot-locked'"></span>
              <span :class="acc.state === 'active' ? 'text-active' : 'text-locked'">
                {{ acc.state === 'active' ? 'Hoạt động' : 'Đã khoá' }}
              </span>
            </td>
            <td class="col-actions">
              <button class="action-btn view" title="Xem chi tiết" @click="openDetailModal(acc)">
                <i class="fas fa-eye"></i>
              </button>
              <button class="action-btn edit" title="Chỉnh sửa" @click="openEditModal(acc)">
                <i class="fas fa-pen"></i>
              </button>
              <button class="action-btn lock" :title="acc.state === 'active' ? 'Khoá tài khoản' : 'Mở khoá'" @click="toggleLock(acc)">
                <i :class="acc.state === 'active' ? 'fas fa-lock' : 'fas fa-lock-open'"></i>
              </button>
              <button class="action-btn key" title="Đặt lại mật khẩu" @click="resetPassword(acc)">
                <i class="fas fa-key"></i>
              </button>
              <button class="action-btn delete" title="Xoá tài khoản" @click="deleteAccount(acc)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredAccounts.length === 0">
            <td colspan="6" class="no-data">
              <i class="fas fa-user-slash"></i>
              <p>Không tìm thấy tài khoản phù hợp</p>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination-bar">
        <span class="pagination-info">
          Hiển thị {{ paginationRange }} trong tổng số {{ filteredAccounts.length.toLocaleString('vi-VN') }} tài khoản
        </span>
        <div class="pagination-controls">
          <button class="pg-btn" :disabled="currentPage === 1" @click="currentPage--">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="p in visiblePages" :key="p"
            class="pg-btn"
            :class="{ 'pg-active': p === currentPage, 'pg-ellipsis': p === '...' }"
            :disabled="p === '...'"
            @click="p !== '...' && (currentPage = p)"
          >{{ p }}</button>
          <button class="pg-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- AI Security Tip -->
    <div class="ai-tip-card" v-if="showTip">
      <div class="ai-tip-icon"><i class="fas fa-sparkles"></i></div>
      <div class="ai-tip-body">
        <div class="ai-tip-title">
          Gợi ý bảo mật hệ thống
          <span class="ai-tip-dot"></span>
        </div>
        <p class="ai-tip-text">
          SmartGym AI phát hiện 3 tài khoản Admin chưa đổi mật khẩu trong hơn 90 ngày.
          Đề xuất thực hiện yêu cầu đặt lại mật khẩu định kỳ cho các tài khoản đặc quyền để duy trì tiêu chuẩn bảo mật SOC2.
        </p>
        <div class="ai-tip-actions">
          <a href="#" class="tip-link" @click.prevent="">Xem chi tiết báo cáo</a>
          <a href="#" class="tip-dismiss" @click.prevent="showTip = false">Bỏ qua</a>
        </div>
      </div>
    </div>

    <!-- ======================== -->
    <!-- MODAL: TẠO TÀI KHOẢN    -->
    <!-- ======================== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showCreateModal" @click.self="showCreateModal = false">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-header-icon create-icon"><i class="fas fa-user-plus"></i></div>
            <div>
              <h2>Tạo tài khoản mới</h2>
              <p>Điền thông tin để tạo tài khoản vận hành mới.</p>
            </div>
            <button class="modal-close" @click="showCreateModal = false"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-user form-label-icon"></i> Họ và tên <span class="required">*</span></label>
                <input v-model="newAcc.name" type="text" placeholder="Nhập họ và tên..." :class="{ 'input-error': createErrors.name }" @input="createErrors.name = ''" />
                <span class="error-msg" v-if="createErrors.name">{{ createErrors.name }}</span>
              </div>
              <div class="form-group">
                <label><i class="fas fa-envelope form-label-icon"></i> Email <span class="required">*</span></label>
                <input v-model="newAcc.email" type="email" placeholder="ten@smartgym.ai" :class="{ 'input-error': createErrors.email }" @input="createErrors.email = ''" />
                <span class="error-msg" v-if="createErrors.email">{{ createErrors.email }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-shield-alt form-label-icon"></i> Vai trò <span class="required">*</span></label>
                <select v-model="newAcc.role_id">
                  <option :value="1">ADMIN</option>
                  <option :value="2">MANAGER</option>
                  <option :value="3">STAFF</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="fas fa-lock form-label-icon"></i> Mật khẩu <span class="required">*</span></label>
                <div class="input-with-icon">
                  <input v-model="newAcc.password" :type="showNewPw ? 'text' : 'password'" placeholder="Nhập mật khẩu..." :class="{ 'input-error': createErrors.password }" @input="createErrors.password = ''" />
                  <button class="input-eye-btn" type="button" @click="showNewPw = !showNewPw">
                    <i :class="showNewPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>
                <span class="error-msg" v-if="createErrors.password">{{ createErrors.password }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showCreateModal = false">Huỷ</button>
            <button class="btn-save" @click="createAccount">
              <i class="fas fa-check"></i> Tạo tài khoản
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ======================== -->
    <!-- MODAL: CHỈNH SỬA        -->
    <!-- ======================== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showEditModal" @click.self="closeEditModal">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-header-icon edit-icon"><i class="fas fa-user-edit"></i></div>
            <div>
              <h2>Chỉnh sửa tài khoản</h2>
              <p>Cập nhật thông tin tài khoản <strong>{{ editAcc.code }}</strong></p>
            </div>
            <button class="modal-close" @click="closeEditModal"><i class="fas fa-times"></i></button>
          </div>

          <!-- Avatar preview -->
          <div class="edit-avatar-row">
            <img :src="editAcc.avatar" class="edit-avatar" :alt="editAcc.full_name || editAcc.name" />
            <div class="edit-avatar-info">
              <div class="edit-avatar-name">{{ editAcc.full_name || editAcc.name || 'Tên tài khoản' }}</div>
              <div class="edit-avatar-code">{{ editAcc.code || editAcc.id }}</div>
            </div>
            <span class="status-badge-inline" :class="editAcc.state === 'active' ? 'badge-active' : 'badge-locked'">
              {{ editAcc.state === 'active' ? '● Hoạt động' : '● Đã khoá' }}
            </span>
          </div>

          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-user form-label-icon"></i> Họ và tên <span class="required">*</span></label>
                <input v-model="editAcc.full_name" type="text" placeholder="Nhập họ và tên..." :class="{ 'input-error': editErrors.name }" @input="editErrors.name = ''; refreshAvatar()" />
                <span class="error-msg" v-if="editErrors.name">{{ editErrors.name }}</span>
              </div>
              <div class="form-group">
                <label><i class="fas fa-envelope form-label-icon"></i> Email <span class="required">*</span></label>
                <input v-model="editAcc.email" type="email" placeholder="ten@smartgym.ai" :class="{ 'input-error': editErrors.email }" @input="editErrors.email = ''" />
                <span class="error-msg" v-if="editErrors.email">{{ editErrors.email }}</span>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label><i class="fas fa-shield-alt form-label-icon"></i> Vai trò <span class="required">*</span></label>
                <select v-model="editAcc.role_id">
                  <option :value="1">ADMIN</option>
                  <option :value="2">MANAGER</option>
                  <option :value="3">STAFF</option>
                </select>
              </div>
              <div class="form-group">
                <label><i class="fas fa-toggle-on form-label-icon"></i> Trạng thái</label>
                <div class="status-toggle-wrap">
                  <button
                    class="status-toggle-btn"
                    :class="editAcc.state === 'active' ? 'toggle-active' : 'toggle-locked'"
                    @click="editAcc.state = editAcc.state === 'active' ? 'banned' : 'active'"
                  >
                    <i :class="editAcc.state === 'active' ? 'fas fa-check-circle' : 'fas fa-ban'"></i>
                    {{ editAcc.state === 'active' ? 'Hoạt động' : 'Đã khoá' }}
                    <span class="toggle-hint">(nhấn để đổi)</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Change password section -->
            <div class="change-pw-section">
              <div class="change-pw-toggle" @click="showChangePw = !showChangePw">
                <i class="fas fa-key"></i>
                Đặt lại mật khẩu mới
                <i :class="showChangePw ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="pw-chevron"></i>
              </div>
              <div class="change-pw-body" v-show="showChangePw">
                <div class="form-row">
                  <div class="form-group">
                    <label>Mật khẩu mới</label>
                    <div class="input-with-icon">
                      <input v-model="editAcc.newPassword" :type="showEditPw ? 'text' : 'password'" placeholder="Nhập mật khẩu mới..." />
                      <button class="input-eye-btn" type="button" @click="showEditPw = !showEditPw">
                        <i :class="showEditPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Xác nhận mật khẩu</label>
                    <div class="input-with-icon">
                      <input v-model="editAcc.confirmPassword" :type="showEditPw ? 'text' : 'password'" placeholder="Nhập lại mật khẩu..." :class="{ 'input-error': editErrors.password }" />
                      <button class="input-eye-btn" type="button" @click="showEditPw = !showEditPw">
                        <i :class="showEditPw ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                    <span class="error-msg" v-if="editErrors.password">{{ editErrors.password }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeEditModal">Huỷ bỏ</button>
            <button class="btn-save" @click="saveEdit">
              <i class="fas fa-save"></i> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ======================== -->
    <!-- MODAL: CHI TIẾT USER    -->
    <!-- ======================== -->
    <transition name="modal-fade">
      <div class="modal-overlay" v-if="showDetailModal" @click.self="showDetailModal = false">
        <div class="modal-box modal-box-wide">
          <div class="modal-header">
            <div class="modal-header-icon detail-icon"><i class="fas fa-id-card"></i></div>
            <div>
              <h2>Chi tiết người dùng</h2>
              <p>{{ detailUser.full_name || detailUser.name }} — <span class="text-muted">{{ detailUser.email }}</span></p>
            </div>
            <button class="modal-close" @click="showDetailModal = false"><i class="fas fa-times"></i></button>
          </div>

          <!-- Tabs -->
          <div class="detail-tabs">
            <button
              v-for="tab in detailTabs" :key="tab.key"
              class="detail-tab-btn"
              :class="{ 'tab-active': activeDetailTab === tab.key }"
              @click="switchDetailTab(tab.key)"
            >
              <i :class="tab.icon"></i> {{ tab.label }}
            </button>
          </div>

          <!-- Loading -->
          <div v-if="detailLoading" class="detail-loading">
            <i class="fas fa-spinner fa-spin"></i> Đang tải dữ liệu...
          </div>

          <!-- Tab: Đăng ký -->
          <div v-else-if="activeDetailTab === 'subscriptions'" class="detail-content">
            <div v-if="userSubscriptions.length === 0" class="detail-empty">
              <i class="fas fa-calendar-times"></i>
              <p>Chưa có lịch sử đăng ký nào</p>
            </div>
            <table v-else class="detail-table">
              <thead><tr><th>Gói tập</th><th>Ngày bắt đầu</th><th>Ngày kết thúc</th><th>Trạng thái</th></tr></thead>
              <tbody>
                <tr v-for="s in userSubscriptions" :key="s.id">
                  <td>{{ s.plan_name || s.plan?.name || '—' }}</td>
                  <td>{{ formatDate(s.start_date) }}</td>
                  <td>{{ formatDate(s.end_date) }}</td>
                  <td><span class="detail-badge" :class="s.status === 'active' ? 'badge-active' : 'badge-locked'">{{ s.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tab: Check-in -->
          <div v-else-if="activeDetailTab === 'checkins'" class="detail-content">
            <div v-if="userCheckins.length === 0" class="detail-empty">
              <i class="fas fa-door-open"></i>
              <p>Chưa có lịch sử check-in nào</p>
            </div>
            <table v-else class="detail-table">
              <thead><tr><th>#</th><th>Thời gian vào</th><th>Thời gian ra</th><th>Ghi chú</th></tr></thead>
              <tbody>
                <tr v-for="(c, idx) in userCheckins" :key="c.id">
                  <td>{{ idx + 1 }}</td>
                  <td>{{ formatDateTime(c.check_in_time || c.checked_in_at) }}</td>
                  <td>{{ formatDateTime(c.check_out_time || c.checked_out_at) }}</td>
                  <td>{{ c.note || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tab: Chỉ số sức khỏe -->
          <div v-else-if="activeDetailTab === 'health'" class="detail-content">
            <div v-if="userHealthMetrics.length === 0" class="detail-empty">
              <i class="fas fa-heartbeat"></i>
              <p>Chưa có chỉ số sức khỏe nào</p>
            </div>
            <table v-else class="detail-table">
              <thead><tr><th>Ngày đo</th><th>Cân nặng (kg)</th><th>Chiều cao (cm)</th><th>BMI</th><th>Mỡ cơ thể (%)</th></tr></thead>
              <tbody>
                <tr v-for="h in userHealthMetrics" :key="h.id">
                  <td>{{ formatDate(h.recorded_at || h.date) }}</td>
                  <td>{{ h.weight ?? '—' }}</td>
                  <td>{{ h.height ?? '—' }}</td>
                  <td>{{ h.bmi ?? '—' }}</td>
                  <td>{{ h.body_fat ?? '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showDetailModal = false">Đóng</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="toast-fade">
      <div class="toast-msg" v-if="toast.show">
        <i :class="toast.icon"></i> {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<script>
// Thêm import axios ở đầu script (nếu bạn dùng axios)
import axios from 'axios';

export default {
  name: 'QuanLyNguoiDung',
  data() {
    return {
      // 1. Khởi tạo danh sách bằng mảng rỗng thay vì dữ liệu cứng
      accounts: [],
      
      searchQuery: '',
      filterRole: '',
      filterStatus: '',
      showFilterPanel: false,
      currentPage: 1,
      perPage: 4,
      showTip: true,

      // Create modal
      showCreateModal: false,
      newAcc: { name: '', email: '', role_id: null, password: '' },
      createErrors: { name: '', email: '', password: '' },
      showNewPw: false,

      // Edit modal
      showEditModal: false,
      editAcc: {},
      editErrors: { name: '', email: '', password: '' },
      showChangePw: false,
      showEditPw: false,

      // Detail modal
      showDetailModal: false,
      detailUser: {},
      detailLoading: false,
      activeDetailTab: 'subscriptions',
      detailTabs: [
        { key: 'subscriptions', label: 'Đăng ký',         icon: 'fas fa-calendar-check' },
        { key: 'checkins',      label: 'Check-in',         icon: 'fas fa-door-open' },
        { key: 'health',        label: 'Chỉ số sức khỏe',  icon: 'fas fa-heartbeat' },
      ],
      userSubscriptions: [],
      userCheckins: [],
      userHealthMetrics: [],

      // Toast
      toast: { show: false, message: '', icon: '' },
    }
  },
  
  // 2. Gọi hàm lấy dữ liệu từ API ngay khi component được tạo
  mounted() {
    this.fetchAdminUsers();
  },

  computed: {
    // Để nguyên các computed property (pagination, totalPages, ...)
    totalAccounts() { return this.accounts.length },
    filteredAccounts() {
      const q = this.searchQuery.toLowerCase()
      return this.accounts.filter(a => {
        const code = a.code || String(a.id) || '';
        const roleName = this.getRoleName(a);
        const nameFallback = a.full_name || a.name || '';
        const mq = !q || nameFallback.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || code.toLowerCase().includes(q)
        const mr = !this.filterRole || roleName === this.filterRole
        const ms = !this.filterStatus || a.state === this.filterStatus
        return mq && mr && ms
      })
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredAccounts.length / this.perPage)) },
    paginatedAccounts() {
      const s = (this.currentPage - 1) * this.perPage
      return this.filteredAccounts.slice(s, s + this.perPage)
    },
    paginationRange() {
      const s = (this.currentPage - 1) * this.perPage + 1
      const e = Math.min(this.currentPage * this.perPage, this.filteredAccounts.length)
      return `${s} - ${e}`
    },
    visiblePages() {
      const pages = [], total = this.totalPages, cur = this.currentPage
      if (total <= 5) { for (let i = 1; i <= total; i++) pages.push(i) }
      else {
        pages.push(1)
        if (cur > 3) pages.push('...')
        for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
        if (cur < total - 2) pages.push('...')
        pages.push(total)
      }
      return pages
    }
  },
  watch: {
    filteredAccounts() { this.currentPage = 1 },
  },
  methods: {
    // 3a. Lấy danh sách Users thông thường (resource index)
    async fetchAccounts() {
      try {
        const response = await axios.get('/api/users');
        const list = response.data.data || response.data;
        this.accounts = list.map(a => ({
          ...a,
          avatar: a.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.full_name || a.name || 'User')}&background=2d7a3a&color=ffffff&bold=true&size=40`
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách:", error);
        this.showToast('fas fa-exclamation-circle', 'Không thể tải danh sách tài khoản!');
      }
    },

    // 3b. Lấy danh sách Users qua route admin-get-user (có middleware viewAny)
    async fetchAdminUsers() {
      try {
        const response = await axios.get('/api/users/admin-get-user?per_page=1000');
        const list = response.data.data || response.data;
        this.accounts = list.map(a => ({
          ...a,
          avatar: a.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(a.full_name || a.name || 'User')}&background=2d7a3a&color=ffffff&bold=true&size=40`
        }));
      } catch (error) {
        console.error("Lỗi khi tải danh sách (admin):", error);
        this.showToast('fas fa-exclamation-circle', 'Không thể tải danh sách tài khoản!');
      }
    },

    // ---- Create ----
    openCreateModal() {
      this.newAcc = { name: '', email: '', role_id: null, password: '' }
      this.createErrors = { name: '', email: '', password: '' }
      this.showNewPw = false
      this.showCreateModal = true
    },
    
    // 4. Hàm gọi API POST để thêm User mới
    async createAccount() {
      let valid = true
      if (!this.newAcc.name.trim()) { this.createErrors.name = 'Vui lòng nhập họ và tên'; valid = false }
      if (!this.newAcc.email.trim()) { this.createErrors.email = 'Vui lòng nhập email'; valid = false }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newAcc.email)) { this.createErrors.email = 'Email không hợp lệ'; valid = false }
      if (!this.newAcc.password.trim()) { this.createErrors.password = 'Vui lòng nhập mật khẩu'; valid = false }
      
      if (!valid) return

      try {
        const response = await axios.post('/api/users', this.newAcc);
        
        // Cập nhật lại danh sách sau khi thêm hoặc đẩy user trả về từ server vào List
        this.accounts.unshift({
          ...response.data.data,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.data.name)}&background=2d7a3a&color=ffffff&bold=true&size=40`
        });

        this.showCreateModal = false;
        this.showToast('fas fa-check-circle', 'Tạo tài khoản thành công!');
      } catch (error) {
        console.error("Lỗi tạo user:", error);
        // Có thể bắt lỗi Validation từ Laravel tại đây (error.response.data.errors)
        this.showToast('fas fa-times-circle', 'Tạo tài khoản thất bại!');
      }
    },

    // ---- Edit ----
    openEditModal(acc) {
      this.editAcc = { ...acc, newPassword: '', confirmPassword: '' }
      this.editErrors = { name: '', email: '', password: '' }
      this.showChangePw = false
      this.showEditPw = false
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
    },
    refreshAvatar() {
      const nm = this.editAcc.full_name || this.editAcc.name;
      if (nm) {
        this.editAcc.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nm)}&background=2d7a3a&color=ffffff&bold=true&size=40`
      }
    },

    // 5. Hàm gọi API PUT để sửa User
    async saveEdit() {
      let valid = true
      if (!this.editAcc.name.trim()) { this.editErrors.name = 'Vui lòng nhập họ và tên'; valid = false }
      if (!this.editAcc.email.trim()) { this.editErrors.email = 'Vui lòng nhập email'; valid = false }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editAcc.email)) { this.editErrors.email = 'Email không hợp lệ'; valid = false }
      if (this.showChangePw && this.editAcc.newPassword) {
        if (this.editAcc.newPassword !== this.editAcc.confirmPassword) {
          this.editErrors.password = 'Mật khẩu xác nhận không khớp'; valid = false
        }
      }
      
      if (!valid) return

      try {
        // Nếu có nhập mật khẩu mới thì gửi lên, ngược lại loại bỏ trường password khỏi payload
        const payload = {
          name: this.editAcc.name,
          email: this.editAcc.email,
          role_id: this.editAcc.role_id,
          state: this.editAcc.state
        };
        if (this.showChangePw && this.editAcc.newPassword) {
          payload.password = this.editAcc.newPassword;
        }

        const response = await axios.put(`/api/users/${this.editAcc.id}`, payload);
        
        // Cập nhật lại UI sau khi call API thành công
        const idx = this.accounts.findIndex(a => a.id === this.editAcc.id)
        if (idx !== -1) {
          this.accounts[idx] = { ...this.accounts[idx], ...response.data.data };
          this.refreshAvatar(); // refresh avatar nếu cần
        }

        this.showEditModal = false;
        this.showToast('fas fa-check-circle', `Đã cập nhật tài khoản ${this.editAcc.name}`);
      } catch (error) {
        console.error("Lỗi cập nhật user:", error);
        this.showToast('fas fa-times-circle', 'Cập nhật thất bại!');
      }
    },

    // ---- Actions ----
    // 6. Cập nhật trạng thái Khoá/Mở khoá gọi chung API PUT
    async toggleLock(acc) {
      const newStatus = acc.state === 'active' ? 'banned' : 'active';
      try {
        await axios.put(`/api/users/${acc.id}`, { state: newStatus });
        acc.state = newStatus;
        this.showToast(
          acc.state === 'banned' ? 'fas fa-lock' : 'fas fa-lock-open',
          acc.state === 'banned' ? `Đã khoá tài khoản ${acc.name}` : `Đã mở khoá tài khoản ${acc.name}`
        );
      } catch (error) {
        this.showToast('fas fa-exclamation-triangle', 'Không thể đổi trạng thái tài khoản!');
      }
    },

    // 7. Xoá user — DELETE /api/users/{id}
    async deleteAccount(acc) {
      if (!confirm(`Bạn có chắc muốn xoá tài khoản "${acc.name}" không?`)) return;
      try {
        await axios.delete(`/api/users/${acc.id}`);
        this.accounts = this.accounts.filter(a => a.id !== acc.id);
        this.showToast('fas fa-trash', `Đã xoá tài khoản ${acc.name}`);
      } catch (error) {
        console.error('Lỗi xoá user:', error);
        this.showToast('fas fa-times-circle', 'Xoá tài khoản thất bại!');
      }
    },

    // 8. Mở modal chi tiết & tải dữ liệu tab đầu tiên
    async openDetailModal(acc) {
      this.detailUser = acc;
      this.activeDetailTab = 'subscriptions';
      this.userSubscriptions = [];
      this.userCheckins = [];
      this.userHealthMetrics = [];
      this.showDetailModal = true;
      await this.loadDetailTab('subscriptions', acc.id);
    },

    async switchDetailTab(tabKey) {
      this.activeDetailTab = tabKey;
      await this.loadDetailTab(tabKey, this.detailUser.id);
    },

    async loadDetailTab(tabKey, userId) {
      this.detailLoading = true;
      try {
        if (tabKey === 'subscriptions') {
          const res = await axios.get(`/api/users/${userId}/subscriptions`);
          this.userSubscriptions = res.data.data || res.data;
        } else if (tabKey === 'checkins') {
          const res = await axios.get(`/api/users/${userId}/checkins`);
          this.userCheckins = res.data.data || res.data;
        } else if (tabKey === 'health') {
          const res = await axios.get(`/api/users/${userId}/health-metrics`);
          this.userHealthMetrics = res.data.data || res.data;
        }
      } catch (error) {
        console.error(`Lỗi tải tab ${tabKey}:`, error);
        this.showToast('fas fa-exclamation-circle', 'Không thể tải dữ liệu chi tiết!');
      } finally {
        this.detailLoading = false;
      }
    },

    // Helpers định dạng ngày giờ
    formatDate(val) {
      if (!val) return '—';
      return new Date(val).toLocaleDateString('vi-VN');
    },
    formatDateTime(val) {
      if (!val) return '—';
      return new Date(val).toLocaleString('vi-VN');
    },
    getRoleName(acc) {
      if (acc.role_name) return acc.role_name.toUpperCase();
      if (acc.role && acc.role.name) return acc.role.name.toUpperCase();
      if (typeof acc.role === 'string') return acc.role.toUpperCase();
      switch (Number(acc.role_id)) {
        case 1: return 'ADMIN';
        case 2: return 'MANAGER';
        case 3: return 'STAFF';
        case 4: return 'TRAINER';
        case 5: return 'MEMBER';
        default: return 'UNKNOWN';
      }
    },
    getRoleClass(acc) {
      return this.getRoleName(acc).toLowerCase();
    },

    resetPassword(acc) {
      this.showToast('fas fa-key', `Đã gửi yêu cầu đặt lại mật khẩu cho ${acc.name}`);
    },
    resetFilter() {
      this.filterRole = ''; this.filterStatus = ''; this.searchQuery = ''
    },
    showToast(icon, message) {
      this.toast = { show: true, icon, message }
      setTimeout(() => { this.toast.show = false }, 3000)
    },
  },
}
</script>


<style scoped>
/* ===== PAGE ===== */
.acc-mgr { display: flex; flex-direction: column; gap: 20px; font-family: 'Segoe UI', sans-serif; }

/* HEADER */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.page-title { font-size: 1.7rem; font-weight: 700; color: #0f1e12; margin: 0 0 4px; }
.page-desc { font-size: 0.875rem; color: #64748b; margin: 0; }
.btn-create {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  color: #fff; border: none; border-radius: 10px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 14px rgba(45,122,58,0.35); white-space: nowrap;
}
.btn-create:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,122,58,0.45); }

/* TOOLBAR */
.toolbar { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.search-wrap { flex: 1; min-width: 220px; position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.85rem; }
.search-input {
  width: 100%; padding: 10px 14px 10px 38px; border: 1.5px solid #e2e8f0;
  border-radius: 10px; font-size: 0.875rem; outline: none; background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
}
.search-input:focus { border-color: #2d7a3a; box-shadow: 0 0 0 3px rgba(45,122,58,0.12); }
.btn-filter {
  display: inline-flex; align-items: center; gap: 7px; padding: 10px 18px;
  border: 1.5px solid #e2e8f0; border-radius: 10px; background: #fff;
  color: #475569; font-size: 0.875rem; font-weight: 500; cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.btn-filter:hover { background: #f1f5f9; border-color: #cbd5e1; }
.stats-card {
  display: flex; align-items: center; gap: 14px; padding: 12px 20px;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04); white-space: nowrap;
}
.stats-label { font-size: 0.68rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; }
.stats-number { font-size: 1.55rem; font-weight: 800; color: #0f1e12; margin-top: 2px; }
.stats-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1rem;
}

/* FILTER */
.filter-panel {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  padding: 14px 20px; background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 12px;
}
.filter-group { display: flex; align-items: center; gap: 8px; }
.filter-group label { font-size: 0.8rem; font-weight: 600; color: #475569; }
.filter-select { padding: 7px 12px; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.8rem; background: #fff; color: #1e293b; outline: none; }
.btn-reset-filter {
  margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; border: none; border-radius: 8px;
  background: #fee2e2; color: #dc2626; font-size: 0.8rem; font-weight: 600; cursor: pointer;
}
.btn-reset-filter:hover { background: #fecaca; }

/* TABLE */
.table-card { background: #fff; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 2px 12px rgba(0,0,0,0.04); overflow: hidden; }
.acc-table { width: 100%; border-collapse: collapse; }
.acc-table thead tr { background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; }
.acc-table thead th { padding: 13px 16px; font-size: 0.72rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.6px; text-align: left; white-space: nowrap; }
.table-row { border-bottom: 1px solid #f1f5f9; transition: background 0.15s; }
.table-row:last-child { border-bottom: none; }
.table-row:hover { background: #f8fdf9; }
.acc-table td { padding: 14px 16px; font-size: 0.875rem; vertical-align: middle; }
.col-id { font-size: 0.8rem; color: #64748b; font-weight: 600; white-space: nowrap; }
.member-cell { display: flex; align-items: center; gap: 10px; }
.member-avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; border: 2px solid #e2e8f0; flex-shrink: 0; }
.member-name { font-weight: 600; color: #1e293b; }
.col-email { color: #475569; font-size: 0.82rem; }
.role-badge { display: inline-block; padding: 4px 11px; border-radius: 20px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.4px; }
.role-admin   { background: #dcfce7; color: #15803d; }
.role-manager { background: #e8f0fe; color: #1a56db; }
.role-staff   { background: #fef9c3; color: #92400e; }
.col-status { display: flex; align-items: center; gap: 6px; white-space: nowrap; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot-active { background: #22c55e; box-shadow: 0 0 0 2px rgba(34,197,94,0.2); }
.dot-locked { background: #ef4444; box-shadow: 0 0 0 2px rgba(239,68,68,0.2); }
.text-active { color: #15803d; font-weight: 600; font-size: 0.85rem; }
.text-locked { color: #dc2626; font-weight: 600; font-size: 0.85rem; }
.col-actions { white-space: nowrap; }
.action-btn { width: 32px; height: 32px; border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem; margin-right: 4px; display: inline-flex; align-items: center; justify-content: center; transition: transform 0.15s; }
.action-btn:hover { transform: scale(1.15); }
.action-btn.view   { background: #eff6ff; color: #2563eb; }
.action-btn.edit   { background: #f0fdf4; color: #16a34a; }
.action-btn.lock   { background: #fef3c7; color: #d97706; }
.action-btn.key    { background: #fdf4ff; color: #9333ea; }
.action-btn.delete { background: #fef2f2; color: #dc2626; }
.no-data { text-align: center; padding: 48px; color: #94a3b8; }
.no-data i { font-size: 2rem; margin-bottom: 10px; display: block; }
.no-data p { font-size: 0.9rem; margin: 0; }

/* PAGINATION */
.pagination-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 10px; }
.pagination-info { font-size: 0.8rem; color: #64748b; }
.pagination-controls { display: flex; align-items: center; gap: 4px; }
.pg-btn { min-width: 34px; height: 34px; border: 1.5px solid #e2e8f0; border-radius: 8px; background: #fff; color: #475569; font-size: 0.82rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s; padding: 0 8px; }
.pg-btn:hover:not(:disabled):not(.pg-active) { background: #f1f5f9; border-color: #cbd5e1; }
.pg-btn:disabled { opacity: 0.4; cursor: default; }
.pg-active { background: linear-gradient(135deg, #2d7a3a, #1a5c28) !important; border-color: transparent !important; color: #fff !important; }
.pg-ellipsis { cursor: default; border-color: transparent; background: transparent; }

/* AI TIP */
.ai-tip-card { display: flex; align-items: flex-start; gap: 16px; padding: 20px 24px; background: #fff; border-radius: 16px; border: 1.5px solid #e2e8f0; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.ai-tip-icon { width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #6366f1, #a855f7); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; flex-shrink: 0; }
.ai-tip-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; }
.ai-tip-dot { width: 8px; height: 8px; border-radius: 50%; background: #6366f1; display: inline-block; animation: pulse 1.5s infinite; }
.ai-tip-text { font-size: 0.82rem; color: #64748b; margin: 0 0 10px; line-height: 1.6; }
.ai-tip-actions { display: flex; gap: 16px; align-items: center; }
.tip-link { font-size: 0.8rem; color: #2d7a3a; font-weight: 600; text-decoration: none; border-bottom: 1.5px solid #2d7a3a; }
.tip-dismiss { font-size: 0.8rem; color: #94a3b8; text-decoration: none; cursor: pointer; }
.tip-dismiss:hover { color: #475569; }

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(15, 30, 20, 0.45);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff; border-radius: 20px;
  width: 540px; max-width: 95vw; max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 70px rgba(0,0,0,0.22);
}
.modal-box-wide { width: 700px; }

/* Detail modal */
.detail-icon { background: linear-gradient(135deg, #0ea5e9, #0284c7); }
.text-muted { color: #94a3b8; }
.detail-tabs {
  display: flex; gap: 4px; padding: 12px 24px;
  border-bottom: 1px solid #f1f5f9; background: #f8fafc;
}
.detail-tab-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border: 1.5px solid transparent; border-radius: 8px;
  background: transparent; color: #64748b; font-size: 0.82rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.detail-tab-btn:hover { background: #e2e8f0; color: #1e293b; }
.tab-active { background: #fff !important; border-color: #e2e8f0 !important; color: #0284c7 !important; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
.detail-loading { display: flex; align-items: center; gap: 10px; padding: 40px; justify-content: center; color: #64748b; font-size: 0.9rem; }
.detail-content { padding: 16px 24px 8px; }
.detail-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 36px; color: #94a3b8; }
.detail-empty i { font-size: 2rem; }
.detail-empty p { font-size: 0.875rem; margin: 0; }
.detail-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.detail-table thead tr { background: #f8fafc; }
.detail-table thead th { padding: 10px 12px; font-size: 0.71rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; text-align: left; border-bottom: 1.5px solid #e2e8f0; }
.detail-table tbody tr { border-bottom: 1px solid #f1f5f9; transition: background 0.12s; }
.detail-table tbody tr:hover { background: #f0f9ff; }
.detail-table tbody td { padding: 10px 12px; color: #334155; }
.detail-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; }
.modal-header {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}
.modal-header h2 { font-size: 1.05rem; font-weight: 700; color: #1e293b; margin: 0 0 3px; }
.modal-header p { font-size: 0.8rem; color: #64748b; margin: 0; }
.modal-header-icon {
  width: 42px; height: 42px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1rem; flex-shrink: 0;
}
.create-icon { background: linear-gradient(135deg, #2d7a3a, #1a5c28); }
.edit-icon   { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.modal-close {
  position: absolute; top: 18px; right: 18px;
  width: 32px; height: 32px; border: none; border-radius: 8px;
  background: #f1f5f9; color: #64748b; font-size: 0.85rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
}
.modal-close:hover { background: #e2e8f0; }

/* Edit avatar row */
.edit-avatar-row {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 24px; background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}
.edit-avatar { width: 52px; height: 52px; border-radius: 50%; border: 3px solid #e2e8f0; object-fit: cover; }
.edit-avatar-name { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
.edit-avatar-code { font-size: 0.78rem; color: #94a3b8; margin-top: 2px; }
.status-badge-inline {
  margin-left: auto; padding: 5px 12px; border-radius: 20px;
  font-size: 0.75rem; font-weight: 700;
}
.badge-active { background: #dcfce7; color: #15803d; }
.badge-locked { background: #fee2e2; color: #dc2626; }

.modal-body { padding: 20px 24px; display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 500px) { .form-row { grid-template-columns: 1fr; } }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.78rem; font-weight: 600; color: #64748b; display: flex; align-items: center; gap: 5px; }
.form-label-icon { font-size: 0.72rem; color: #94a3b8; }
.required { color: #ef4444; }
.form-group input, .form-group select {
  padding: 9px 13px; border: 1.5px solid #e2e8f0; border-radius: 10px;
  font-size: 0.875rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  background: #fff; color: #1e293b;
}
.form-group input:focus, .form-group select:focus {
  border-color: #2d7a3a; box-shadow: 0 0 0 3px rgba(45,122,58,0.12);
}
.input-error { border-color: #ef4444 !important; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important; }
.error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 2px; }
.input-with-icon { position: relative; }
.input-with-icon input { width: 100%; box-sizing: border-box; padding-right: 40px; }
.input-eye-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 0.85rem;
  display: flex; align-items: center; justify-content: center;
}
.input-eye-btn:hover { color: #475569; }

/* Status toggle */
.status-toggle-wrap { display: flex; align-items: center; }
.status-toggle-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 14px; border-radius: 10px; border: 1.5px solid;
  font-size: 0.82rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s; width: 100%;
}
.toggle-active { background: #f0fdf4; border-color: #86efac; color: #15803d; }
.toggle-locked { background: #fef2f2; border-color: #fca5a5; color: #dc2626; }
.toggle-hint { font-size: 0.7rem; font-weight: 400; color: #94a3b8; margin-left: auto; }

/* Change password */
.change-pw-section { border: 1.5px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
.change-pw-toggle {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; font-size: 0.82rem; font-weight: 600;
  color: #475569; cursor: pointer; background: #f8fafc;
  user-select: none; transition: background 0.15s;
}
.change-pw-toggle:hover { background: #f1f5f9; }
.change-pw-toggle i:first-child { color: #9333ea; }
.pw-chevron { margin-left: auto; font-size: 0.7rem; }
.change-pw-body { padding: 16px; border-top: 1px solid #f1f5f9; }

.modal-footer {
  display: flex; gap: 10px; justify-content: flex-end;
  padding: 16px 24px 20px; border-top: 1px solid #f1f5f9;
}
.btn-cancel {
  padding: 10px 20px; border: 1.5px solid #e2e8f0; border-radius: 10px;
  background: #fff; color: #64748b; font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: background 0.2s;
}
.btn-cancel:hover { background: #f1f5f9; }
.btn-save {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 10px 22px; border: none; border-radius: 10px;
  background: linear-gradient(135deg, #2d7a3a, #1a5c28); color: #fff;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 12px rgba(45,122,58,0.3);
}
.btn-save:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(45,122,58,0.4); }

/* TOAST */
.toast-msg {
  position: fixed; bottom: 90px; right: 28px;
  background: #1e293b; color: #fff; padding: 12px 20px; border-radius: 12px;
  font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 9999;
}
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(10px); }

/* MODAL TRANSITION */
.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from .modal-box, .modal-fade-leave-to .modal-box { transform: scale(0.95) translateY(16px); }

@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>
