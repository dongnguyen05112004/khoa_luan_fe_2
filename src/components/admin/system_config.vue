<template>
  <div class="system-config-container w-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1">Cấu hình hệ thống</h4>
        <p class="text-muted small mb-0">Quản lý các thông số vận hành, nhận diện thương hiệu và bảo mật nền tảng SmartGym AI.</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-xl-12">
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-store text-success"></i> Thông tin thương hiệu
            </h6>
            <div class="row">
              <div class="col-lg-8">
                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label very-small fw-bold text-secondary">TÊN PHÒNG GYM</label>
                    <input type="text" class="form-control border-light-subtle" v-model="config.gymName">
                  </div>
                  <div class="col-md-12">
                    <label class="form-label very-small fw-bold text-secondary">SLOGAN</label>
                    <input type="text" class="form-control border-light-subtle" placeholder="Nhập slogan thương hiệu..." v-model="config.slogan">
                  </div>
                  <div class="col-md-12">
                    <label class="form-label very-small fw-bold text-secondary">HOTLINE</label>
                    <input type="text" class="form-control border-light-subtle" v-model="config.hotline">
                  </div>
                </div>
              </div>
              <div class="col-lg-4">
                <label class="form-label very-small fw-bold text-secondary">LOGO THƯƠNG HIỆU</label>
                <label class="upload-zone border-dashed rounded d-flex flex-column align-items-center justify-content-center gap-1">
                  <i class="fas fa-cloud-upload-alt fa-2x text-muted"></i>
                  <span class="small text-muted">Kéo thả hoặc Click để tải lên</span>
                  <span class="very-small text-muted">PNG, JPG (MAX 5MB)</span>
                  <input type="file" accept="image/png,image/jpeg" class="d-none" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-globe text-success"></i> Ngôn ngữ & Vùng
            </h6>
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label very-small fw-bold text-secondary">NGÔN NGỮ MẶC ĐỊNH</label>
                <select class="form-select border-light-subtle" v-model="config.lang">
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label very-small fw-bold text-secondary">MÚI GIỜ HỆ THỐNG</label>
                <select class="form-select border-light-subtle" v-model="config.timezone">
                  <option value="7">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-microchip text-success"></i> Tham số Vận hành
            </h6>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="p-4 rounded bg-light border-0">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small fw-bold">Tự động đóng check-in</span>
                    <span class="badge bg-success-subtle text-success fw-normal">PHÚT</span>
                  </div>
                  <input type="number" class="form-control border-0 bg-white shadow-sm fs-4 fw-bold" v-model="config.checkIn">
                  <p class="very-small text-muted mt-2 mb-0">THỜI GIAN TỐI ĐA MỖI PHIÊN TẬP</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-4 rounded bg-light border-0">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small fw-bold">Lượt đăng ký tối đa</span>
                    <span class="badge bg-success-subtle text-success fw-normal">KHÁCH/NGÀY</span>
                  </div>
                  <input type="number" class="form-control border-0 bg-white shadow-sm fs-4 fw-bold" v-model="config.maxReg">
                  <p class="very-small text-muted mt-2 mb-0">GIỚI HẠN CÔNG SUẤT PHÒNG MÁY</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-5">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-shield-alt text-primary"></i> Kỹ thuật & Bảo mật
            </h6>
            <div class="vstack gap-3">
              <div class="d-flex justify-content-between align-items-center p-3 rounded bg-light">
                <div class="d-flex align-items-center gap-3">
                  <div class="icon-sm bg-white rounded shadow-sm d-flex align-items-center justify-content-center p-2">
                    <i class="fas fa-history text-primary"></i>
                  </div>
                  <div>
                    <div class="small fw-bold">Ghi nhật ký hệ thống (Audit Logs)</div>
                    <div class="very-small text-muted">Lưu lại mọi thao tác của quản trị viên để đối soát</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="config.audit" checked>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center p-3 rounded bg-light">
                <div class="d-flex align-items-center gap-3">
                  <div class="icon-sm bg-white rounded shadow-sm d-flex align-items-center justify-content-center p-2">
                    <i class="fas fa-robot text-primary"></i>
                  </div>
                  <div>
                    <div class="small fw-bold">Thông báo AI thời gian thực</div>
                    <div class="very-small text-muted">Gửi cảnh báo thông minh dựa trên hành vi người dùng</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="config.ai" checked>
                </div>
              </div>

              <div class="p-3 rounded bg-light">
                <div class="small fw-bold mb-2"><i class="fas fa-key text-primary me-2"></i>Gemini API Key</div>
                <div class="input-group bg-white rounded shadow-sm overflow-hidden border-0">
                  <input :type="showKey ? 'text' : 'password'" class="form-control border-0" v-model="config.apiKey">
                  <button class="btn btn-white border-0" @click="showKey = !showKey">
                    <i :class="showKey ? 'fas fa-eye-slash' : 'fas fa-eye text-muted'"></i>
                  </button>
                </div>
                <p class="very-small text-muted mt-2 mb-0">Khóa bảo mật để kích hoạt các tính năng AI nâng cao</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Xác Nhận Mật Khẩu -->
    <div v-if="showPasswordModal" class="modal-backdrop fade show" style="background-color: rgba(0,0,0,0.5); z-index: 1050;"></div>
    <div v-if="showPasswordModal" class="modal d-block" tabindex="-1" style="z-index: 1055;">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg">
          <div class="modal-header bg-light border-0">
            <h5 class="modal-title fw-bold text-danger">
              <i class="fas fa-exclamation-triangle me-2"></i>Xác nhận quản trị
            </h5>
            <button type="button" class="btn-close" @click="showPasswordModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <p class="text-muted small mb-3">Vui lòng nhập mật khẩu tài khoản Admin để xác nhận lưu tất cả các thay đổi cấu hình hệ thống.</p>
            <div class="input-group bg-light rounded overflow-hidden border">
              <span class="input-group-text bg-transparent border-0 text-muted">
                <i class="fas fa-lock"></i>
              </span>
              <input type="password" class="form-control border-0 bg-transparent shadow-none" v-model="adminPassword" placeholder="Nhập mật khẩu của bạn..." @keyup.enter="confirmSave">
            </div>
          </div>
          <div class="modal-footer border-0 p-4 pt-0">
            <button type="button" class="btn btn-light fw-bold" @click="showPasswordModal = false">Hủy</button>
            <button type="button" class="btn btn-danger fw-bold px-4" @click="confirmSave">Xác nhận Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <footer class="sticky-bottom bg-white border-top p-3 mx-n4 mb-n4 mt-5 d-flex justify-content-between align-items-center shadow-lg">
      <span class="very-small text-muted"><i class="fas fa-info-circle me-1"></i>Mọi thay đổi sẽ có hiệu lực ngay lập tức trên toàn hệ thống</span>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary px-4 fw-bold small" @click="restoreDefaults">Khôi phục mặc định</button>
        <button class="btn btn-success px-4 fw-bold small" @click="save">Lưu tất cả thay đổi</button>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';

const DEFAULT_CONFIG = {
  gymName: 'SmartGym Elite Fitness Center',
  slogan: 'Nơi khởi nguồn sức mạnh',
  hotline: '1900 8888',
  lang: 'vi',
  timezone: '7',
  checkIn: 120,
  maxReg: 500,
  audit: true,
  ai: true,
  apiKey: 'sk-gemini-8v2k3l9n0x7m1p4q5r6t8u9w0z'
};

export default {
  data() {
    return {
      showKey: false,
      showPasswordModal: false,
      adminPassword: '',
      config: { ...DEFAULT_CONFIG }
    }
  },
  mounted() {
    this.fetchConfig();
  },
  methods: {
    async fetchConfig() {
      try {
        const { data } = await axios.get('/api/system-settings');
        if (Array.isArray(data)) {
          data.forEach(item => {
            if (this.config.hasOwnProperty(item.setting_key)) {
              if (item.setting_value === 'true') {
                this.config[item.setting_key] = true;
              } else if (item.setting_value === 'false') {
                this.config[item.setting_key] = false;
              } else {
                this.config[item.setting_key] = item.setting_value;
              }
            }
          });
        }
      } catch (error) {
        console.error('Lỗi khi tải cấu hình:', error);
      }
    },
    restoreDefaults() {
      if (confirm('Bạn có chắc chắn muốn khôi phục về các cài đặt mặc định ban đầu? Bạn sẽ cần nhập mật khẩu để hệ thống tiến hành lưu lại.')) {
        this.config = { ...DEFAULT_CONFIG };
        this.save(); // Tự động bật modal yêu cầu mật khẩu để lưu lên DB
      }
    },
    save() { 
      this.adminPassword = '';
      this.showPasswordModal = true; 
    },
    async confirmSave() {
      if (!this.adminPassword) {
        alert('Vui lòng nhập mật khẩu xác nhận.');
        return;
      }
      try {
        const settingsPayload = Object.keys(this.config).map(key => {
          return {
            setting_key: key,
            setting_value: String(this.config[key])
          };
        });

        const res = await axios.post('/api/system-settings/bulk-update', {
          settings: settingsPayload,
          password: this.adminPassword
        });

        alert(res.data.message || 'Cập nhật cấu hình thành công!');
        this.showPasswordModal = false;
        this.fetchConfig();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          alert('Lỗi: ' + error.response.data.message);
        } else {
          alert('Đã xảy ra lỗi khi cập nhật hệ thống.');
        }
        console.error(error);
      }
    }
  }
}
</script>

<style scoped>
.very-small { 
  font-size: 0.72rem; 
}
.upload-zone {
  border: 2px dashed #dee2e6 !important;
  background-color: #f8f9fa;
  cursor: pointer;
  min-height: 148px;
  transition: border-color 0.2s, background 0.2s;
  border-radius: 10px;
}
.upload-zone:hover {
  border-color: #2d7a3a !important;
  background-color: #f0faf2;
}
.bg-success-subtle {
  background-color: #e8f5e9 !important;
}
.form-check-input:checked { 
  background-color: #2d7a3a; 
  border-color: #2d7a3a; 
}
.mx-n4 { 
  margin-left: -1.75rem; 
  margin-right: -1.75rem; 
}
.mb-n4 { 
  margin-bottom: -1.75rem; 
}
.form-control:focus, 
.form-select:focus {
   border-color: #2d7a3a; 
   box-shadow: none; 
   }
</style>