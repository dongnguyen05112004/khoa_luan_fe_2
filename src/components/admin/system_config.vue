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
                <label class="upload-zone border-dashed rounded d-flex flex-column align-items-center justify-content-center gap-1 p-2">
                  <template v-if="logoPreview">
                    <img :src="logoPreview" alt="Logo" class="img-fluid rounded" style="max-height: 100px; object-fit: contain;" />
                    <span class="very-small text-muted mt-2">Click để đổi ảnh (PNG, JPG)</span>
                  </template>
                  <template v-else>
                    <i class="fas fa-cloud-upload-alt fa-2x text-muted"></i>
                    <span class="small text-muted">Kéo thả hoặc Click để tải lên</span>
                    <span class="very-small text-muted">PNG, JPG (MAX 5MB)</span>
                  </template>
                  <input type="file" accept="image/png,image/jpeg" class="d-none" @change="handleLogoUpload" />
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
              <i class="fas fa-shield-alt text-success"></i> Vận hành & Bảo mật
            </h6>
            <div class="row g-4">
              <div class="col-md-12">
                <div class="p-3 border rounded bg-light d-flex align-items-center justify-content-between gap-3">
                  <div>
                    <label class="form-check-label fw-bold small mb-0" for="auditSwitch" style="cursor: pointer;">Ghi nhật ký hệ thống (Audit Log)</label>
                    <p class="very-small text-muted mb-0 mt-1">Lưu lại mọi thao tác của nhân viên để đối soát khi cần thiết.</p>
                  </div>
                  <div class="form-check form-switch mb-0 ps-0">
                    <input class="form-check-input ms-0" type="checkbox" v-model="config.audit" id="auditSwitch" style="width: 2.5rem; height: 1.25rem; cursor: pointer; float: none;">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-4">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-university text-success"></i> Cấu hình Thanh toán (VietQR)
            </h6>
            <div class="row g-4">
              <!-- Bank 1 -->
              <div class="col-md-6">
                <div class="p-3 rounded border" :class="config.active_bank === '1' ? 'border-success bg-success-subtle' : 'bg-light'">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small fw-bold">TÀI KHOẢN 1</span>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="config.active_bank" value="1">
                      <label class="form-check-label very-small fw-bold">SỬ DỤNG</label>
                    </div>
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">NGÂN HÀNG</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_name_1">
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">SỐ TÀI KHOẢN</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_acc_1">
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">CHỦ TÀI KHOẢN</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_owner_1">
                  </div>
                  <div>
                    <label class="very-small text-muted fw-bold">MÃ VIETQR (BANK ID)</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_id_1" placeholder="VD: 970418">
                  </div>
                </div>
              </div>
              <!-- Bank 2 -->
              <div class="col-md-6">
                <div class="p-3 rounded border" :class="config.active_bank === '2' ? 'border-success bg-success-subtle' : 'bg-light'">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="small fw-bold">TÀI KHOẢN 2</span>
                    <div class="form-check">
                      <input class="form-check-input" type="radio" v-model="config.active_bank" value="2">
                      <label class="form-check-label very-small fw-bold">SỬ DỤNG</label>
                    </div>
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">NGÂN HÀNG</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_name_2">
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">SỐ TÀI KHOẢN</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_acc_2">
                  </div>
                  <div class="mb-2">
                    <label class="very-small text-muted fw-bold">CHỦ TÀI KHOẢN</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_owner_2">
                  </div>
                  <div>
                    <label class="very-small text-muted fw-bold">MÃ VIETQR (BANK ID)</label>
                    <input type="text" class="form-control form-control-sm" v-model="config.bank_id_2" placeholder="VD: 970436">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm mb-5">
          <div class="card-body p-4">
            <h6 class="fw-bold d-flex align-items-center gap-2 mb-4">
              <i class="fas fa-robot text-primary"></i> Cấu hình AI & Nền tảng trí tuệ nhân tạo
            </h6>
            
            <div class="mb-4">
              <label class="form-label very-small fw-bold text-secondary">CHỌN NHÀ CUNG CẤP AI (AI PROVIDER)</label>
              <div class="d-flex gap-4 mt-2">
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="config.ai_provider" value="gemini" id="providerGemini">
                  <label class="form-check-label fw-bold small" for="providerGemini">
                    <i class="fab fa-google text-primary me-1"></i> Google Gemini
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" v-model="config.ai_provider" value="groq" id="providerGroq">
                  <label class="form-check-label fw-bold small" for="providerGroq">
                    <i class="fas fa-bolt text-warning me-1"></i> Groq (Llama 3)
                  </label>
                </div>
              </div>
            </div>

            <!-- Gemini Config -->
            <div v-if="config.ai_provider === 'gemini'" class="p-3 rounded bg-light border-start border-primary border-4">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label very-small fw-bold text-secondary">GEMINI API KEY</label>
                  <div class="input-group bg-white rounded shadow-sm overflow-hidden border">
                    <input :type="showKey ? 'text' : 'password'" class="form-control border-0" v-model="config.gemini_api_key" placeholder="Nhập Gemini API Key...">
                    <button class="btn btn-white border-0" @click="showKey = !showKey">
                      <i :class="showKey ? 'fas fa-eye-slash' : 'fas fa-eye text-muted'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label very-small fw-bold text-secondary">MODEL</label>
                  <select class="form-select border shadow-sm" v-model="config.gemini_model">
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Nhanh)</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Mạnh)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Groq Config -->
            <div v-if="config.ai_provider === 'groq'" class="p-3 rounded bg-light border-start border-warning border-4">
              <div class="row g-3">
                <div class="col-md-8">
                  <label class="form-label very-small fw-bold text-secondary">GROQ API KEY</label>
                  <div class="input-group bg-white rounded shadow-sm overflow-hidden border">
                    <input :type="showKey ? 'text' : 'password'" class="form-control border-0" v-model="config.groq_api_key" placeholder="Nhập Groq API Key...">
                    <button class="btn btn-white border-0" @click="showKey = !showKey">
                      <i :class="showKey ? 'fas fa-eye-slash' : 'fas fa-eye text-muted'"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label very-small fw-bold text-secondary">MODEL</label>
                  <select class="form-select border shadow-sm" v-model="config.groq_model">
                    <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
                    <option value="llama3-8b-8192">Llama 3 8B</option>
                    <option value="mixtral-8x7b-32768">Mixtral 8x7B</option>
                  </select>
                </div>
              </div>
            </div>
            
            <p class="very-small text-muted mt-3 mb-0">
              <i class="fas fa-info-circle me-1"></i> Các API Key đều được mã hóa 2 lớp trước khi lưu xuống Database.
            </p>
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
  
  // AI Configs
  ai_provider: 'gemini',
  gemini_api_key: '',
  gemini_model: 'gemini-1.5-flash',
  groq_api_key: '',
  groq_model: 'llama-3.3-70b-versatile',
  
  // Bank Configs
  bank_name_1: 'BIDV',
  bank_acc_1: '5602059675',
  bank_owner_1: 'NGUYEN HUU DONG',
  bank_id_1: '970418',
  
  bank_name_2: 'Vietcombank',
  bank_acc_2: '1032067073',
  bank_owner_2: 'TRAN MINH QUANG',
  bank_id_2: '970436',
  
  active_bank: '1'
};

export default {
  data() {
    return {
      showKey: false,
      showPasswordModal: false,
      adminPassword: '',
      config: { ...DEFAULT_CONFIG },
      selectedLogoFile: null,
      logoPreview: null
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
            } else if (item.setting_key === 'logo') {
              this.logoPreview = item.setting_value;
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
        this.selectedLogoFile = null;
        this.logoPreview = null;
        this.save(); // Tự động bật modal yêu cầu mật khẩu để lưu lên DB
      }
    },
    handleLogoUpload(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Kích thước ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
          return;
        }
        this.selectedLogoFile = file;
        this.logoPreview = URL.createObjectURL(file);
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

        const formData = new FormData();
        formData.append('password', this.adminPassword);
        formData.append('settings', JSON.stringify(settingsPayload));
        
        if (this.selectedLogoFile) {
          formData.append('logo_file', this.selectedLogoFile);
        }

        const res = await axios.post('/api/system-settings/bulk-update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        alert(res.data.message || 'Cập nhật cấu hình thành công!');
        this.showPasswordModal = false;
        this.selectedLogoFile = null;
        window.location.reload();
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