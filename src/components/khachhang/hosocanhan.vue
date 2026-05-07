<template>
  <div class="ho-so-page">

    <!-- ===== HEADER CARD ===== -->
    <div class="profile-header-card">
      <div class="profile-header-inner">
        <!-- Avatar -->
        <div class="avatar-wrap">
          <img
            :src="user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2d7a3a&color=ffffff&bold=true&size=120`"
            alt="Avatar"
            class="profile-avatar"
          />
          <span class="status-badge" :class="user.status === 'active' ? 'active' : 'inactive'">
            {{ userStateLabel(user.status) }}
          </span>
        </div>

        <!-- Info -->
        <div class="profile-info">
          <h2 class="profile-name">{{ user.name }}</h2>
          <p class="profile-id"><i class="fas fa-id-badge me-1"></i> ID: #{{ user.memberId }}</p>
          <div class="profile-badges">
            <span class="badge-tag gold"><i class="fas fa-star me-1"></i>{{ user.memberType }}</span>
            <span class="badge-tag green"><i class="fas fa-infinity me-1"></i>{{ user.access }}</span>
          </div>
        </div>

        <!-- Edit button -->
        <button class="btn-edit-profile" @click="openEditModal">
          <i class="fas fa-pen"></i>
        </button>
      </div>

      <!-- Tabs -->
      <ul class="nav nav-tabs px-4 border-0">
        <li class="nav-item" v-for="tab in tabs" :key="tab.key">
          <button
            class="nav-link border-0 text-secondary fw-semibold"
            style="background: transparent;"
            :class="{ 'active text-success border-bottom border-success border-3': activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </li>
      </ul>
    </div>

    <!-- ===== TAB: THÔNG TIN CHUNG ===== -->
    <div v-if="activeTab === 'general'" class="tab-content">
      <div class="row g-4">

        <!-- LEFT COLUMN -->
        <div class="col-lg-6 d-flex flex-column gap-4">

          <!-- Personal Details -->
          <div class="info-card">
            <div class="info-card-label">THÔNG TIN CÁ NHÂN</div>
            <div class="info-grid">
              <div class="info-field">
                <div class="field-label">SỐ ĐIỆN THOẠI</div>
                <div class="field-value">{{ user.phone }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">NGÀY SINH</div>
                <div class="field-value">{{ user.dob }} <span class="field-age">({{ user.age }} Tuổi)</span></div>
              </div>
              <div class="info-field">
                <div class="field-label">GIỚI TÍNH</div>
                <div class="field-value">{{ user.gender }}</div>
              </div>
              <div class="info-field">
                <div class="field-label">MỤC TIÊU</div>
                <div class="field-value goal">{{ user.goal }}</div>
              </div>
            </div>
          </div>

          <!-- Medical History -->
          <div class="info-card">
            <div class="info-card-label">TIỀN SỬ BỆNH LÝ</div>
            <div
              v-for="(item, idx) in user.medicalHistory"
              :key="idx"
              class="medical-item"
              :class="item.status"
            >
              <div class="medical-icon-wrap">
                <i :class="item.icon"></i>
              </div>
              <div>
                <div class="medical-title">{{ item.title }}</div>
                <div class="medical-desc">{{ item.description }}</div>
              </div>
            </div>
          </div>

          <!-- AI Analysis -->
          <div class="ai-card">
            <div class="ai-card-header">
              <div class="ai-avatar">
                <i class="fas fa-brain"></i>
              </div>
              <div class="ai-title">Phân tích từ Kinetic AI</div>
              <button 
                class="btn-generate-ai" 
                @click="generateAI" 
                :disabled="generatingAI"
              >
                <i class="fas fa-magic" :class="{'fa-spin': generatingAI}"></i>
                {{ generatingAI ? 'Đang phân tích...' : 'Cập nhật AI' }}
              </button>
            </div>
            
            <div v-if="user.aiRecommendation">
              <div class="ai-rec-title">{{ user.aiRecommendation.title }}</div>
              <div class="ai-rec-diagnosis">{{ user.aiRecommendation.diagnosis }}</div>
              <ul class="ai-suggestions">
                <li v-for="(tip, i) in user.aiRecommendation.suggestions" :key="i">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
            <div v-else class="text-center py-4 text-muted" style="font-size: 0.85rem;">
              <p class="mb-0">Chưa có phân tích AI nào. Hãy bấm "Cập nhật AI" để tạo mới.</p>
            </div>
          </div>

        </div>

        <!-- RIGHT COLUMN: Biometric Markers -->
        <div class="col-lg-6 d-flex flex-column gap-3">
          <div class="info-card-label ms-1">CHỈ SỐ CƠ THỂ</div>

          <div
            v-for="metric in biometrics"
            :key="metric.key"
            class="biometric-card"
            :class="{ 'bmi-highlight': metric.key === 'bmi' }"
          >
            <div class="biometric-icon" :style="{ background: metric.iconBg }">
              <i :class="metric.icon"></i>
            </div>
            <div class="biometric-info">
              <div class="biometric-label">{{ metric.label }}</div>
              <div class="biometric-value">
                {{ metric.value }}
                <span class="biometric-unit">{{ metric.unit }}</span>
                <span v-if="metric.key === 'bmi'" class="bmi-badge overweight">THỪ CÂN</span>
              </div>
            </div>
            <div
              v-if="metric.change !== undefined && metric.key !== 'bmi'"
              class="biometric-change"
              :class="metric.change < 0 ? 'neg' : 'pos'"
            >
              <i :class="metric.change < 0 ? 'fas fa-caret-down' : 'fas fa-caret-up'"></i>
              {{ Math.abs(metric.change) }}
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ===== TAB: CHỈ SỐ SỨC KHỎE ===== -->
    <div v-if="activeTab === 'health'" class="tab-content">
      <ChiSoSucKhoe :showOnlyHealth="true" />
    </div>

    <!-- ===== TAB: LỊCH SỬ ĐO LƯỜNG ===== -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <ChiSoSucKhoe :showOnlyHistory="true" />
    </div>

    <!-- ===== TOAST SUCCESS ===== -->
    <transition name="toast-fade">
      <div class="save-toast" v-if="saveSuccess">
        <i class="fas fa-check-circle me-2"></i> Hồ sơ đã được lưu thành công!
      </div>
    </transition>

    <!-- ===== ACTION FOOTER ===== -->
    <div class="profile-footer">
      <div class="save-error" v-if="saveError && !showEditModal">{{ saveError }}</div>
      <button class="btn-cancel" @click="handleCancel">Hủy bỏ</button>
      <button class="btn-save" @click="handleSave" :disabled="saving">
        <i class="fas fa-spinner fa-spin me-2" v-if="saving"></i>
        <i class="fas fa-save me-2" v-else></i>
        {{ saving ? 'Đang lưu...' : 'Lưu hồ sơ' }}
      </button>
    </div>

    <!-- ===== EDIT MODAL ===== -->
    <div class="modal-overlay" v-if="showEditModal" @click.self="showEditModal = false">
      <div class="edit-modal">
        <div class="edit-modal-header">
          <h5><i class="fas fa-user-edit me-2"></i>Chỉnh sửa hồ sơ</h5>
          <button class="btn-modal-close" @click="showEditModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="edit-modal-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label-sm">Họ và tên</label>
              <input type="text" class="form-control form-control-sm" v-model="editForm.name" />
            </div>
            <div class="col-6">
              <label class="form-label-sm">Số điện thoại</label>
              <input type="text" class="form-control form-control-sm" v-model="editForm.phone" />
            </div>
            <div class="col-6">
              <label class="form-label-sm">Ngày sinh</label>
              <input type="date" class="form-control form-control-sm" v-model="editForm.dob" />
            </div>
            <div class="col-6">
              <label class="form-label-sm">Giới tính</label>
              <select class="form-select form-select-sm" v-model="editForm.gender">
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
            <div class="col-6">
              <label class="form-label-sm">Mục tiêu</label>
              <input type="text" class="form-control form-control-sm" v-model="editForm.goal" />
            </div>
            <div class="col-6">
              <label class="form-label-sm">Liên hệ khẩn cấp</label>
              <input type="text" class="form-control form-control-sm" v-model="editForm.emergency_contact" placeholder="Tên - SĐT" />
            </div>
            <div class="col-12">
              <label class="form-label-sm">Ghi chú sức khỏe</label>
              <textarea class="form-control form-control-sm" v-model="editForm.health_notes" rows="2"></textarea>
            </div>
          </div>
        </div>
        <div class="edit-modal-footer">
          <div class="save-error" v-if="saveError">{{ saveError }}</div>
          <div class="edit-modal-footer-btns">
            <button class="btn-cancel" @click="showEditModal = false" :disabled="saving">Hủy</button>
            <button class="btn-save" @click="saveEdit" :disabled="saving">
              <i class="fas fa-spinner fa-spin me-1" v-if="saving"></i>
              <i class="fas fa-check me-1" v-else></i>
              {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import ChiSoSucKhoe from './chisosuckhoe.vue'
import { userStateLabel } from '@/utils/i18n'

export default {
  name: 'HoSoCaNhan',
  components: {
    ChiSoSucKhoe
  },
  data() {
    return {
      activeTab: 'general',
      showEditModal: false,
      tabs: [
        { key: 'general', label: 'Thông tin chung' },
        { key: 'health',  label: 'Chỉ số sức khỏe' },
        { key: 'history', label: 'Lịch sử đo lường' },
      ],
      user: {
        name:       '',
        memberId:   '',
        status:     '',
        memberType: 'Chưa có gói tập',
        access:     '',
        phone:      '',
        dob:        '',
        age:        null,
        gender:     '',
        goal:       '',
        healthNotes: '',
        emergencyContact: '',
        avatar:     '',
        medicalHistory: [],
        aiRecommendation: null,
      },
      biometrics: [
        { key: 'weight', label: 'CÂN NẶNG', value: '--', unit: 'kg', icon: 'fas fa-shopping-bag', iconBg: '#e8f5e9', change: undefined },
        { key: 'height', label: 'CHIỀU CAO', value: '--', unit: 'cm', icon: 'fas fa-arrows-alt-v', iconBg: '#e8f5e9', change: undefined },
        { key: 'fat', label: '% MỠ (BODY FAT)', value: '--', unit: '%', icon: 'fas fa-percent', iconBg: '#fff3e0', change: undefined },
        { key: 'muscle', label: '% CƠ (MUSCLE)', value: '--', unit: '%', icon: 'fas fa-bolt', iconBg: '#e8f5e9', change: undefined },
        { key: 'bmi', label: 'BMI', value: '--', unit: '', icon: 'fas fa-chart-bar', iconBg: '#e8f5e9', change: undefined },
      ],
      editForm: {
        name:   '',
        phone:  '',
        dob:    '',
        gender: '',
        goal:   '',
        health_notes: '',
        emergency_contact: ''
      },
      loading: true,
      saving: false,
      saveSuccess: false,
      saveError: '',
      generatingAI: false
    }
  },
  async mounted() {
    await this.fetchProfile();
  },
  methods: {
    userStateLabel,
    async fetchProfile() {
      this.loading = true;
      try {
        const response = await axios.get('/api/customer/profile');
        const data = response.data.data;
        
        const profile = data.member_profile || {};
        const sub = data.active_subscription || {};
        const plan = sub.plan || {};
        const metrics = data.health_metrics || [];
        const aiRecs = data.ai_recommendations || [];

        // Parse goal from health_notes
        let healthNotesText = profile.health_notes || '';
        let extractedGoal = '';
        const goalMatch = healthNotesText.match(/^Mục tiêu:\s*(.*)/m);
        if (goalMatch) {
            extractedGoal = goalMatch[1];
            healthNotesText = healthNotesText.replace(/^Mục tiêu:\s*(.*)\n?/m, '').trim();
        }

        // Calculate age
        let age = null;
        let dobStr = '';
        if (profile.date_of_birth) {
            const dobDate = new Date(profile.date_of_birth);
            const today = new Date();
            age = today.getFullYear() - dobDate.getFullYear();
            if (today.getMonth() < dobDate.getMonth() || (today.getMonth() === dobDate.getMonth() && today.getDate() < dobDate.getDate())) {
                age--;
            }
            dobStr = `${String(dobDate.getDate()).padStart(2, '0')}/${String(dobDate.getMonth() + 1).padStart(2, '0')}/${dobDate.getFullYear()}`;
        }
        
        // Parse medical status
        let medicalStatus = 'warning';
        let medicalIcon = 'fas fa-exclamation-triangle';
        let healthLower = healthNotesText.toLowerCase();
        
        if (healthLower.includes('tốt') || healthLower.includes('bình thường') || healthLower.includes('khỏe') || healthLower.includes('ổn định') || healthLower.includes('ổn')) {
            medicalStatus = 'good';
            medicalIcon = 'fas fa-heartbeat';
        }

        // Parse AI recommendation
        let latestAi = null;
        if (aiRecs && aiRecs.length > 0) {
            const latest = aiRecs[0];
            let suggestionsArray = [];
            if (latest.ai_suggestions) {
                suggestionsArray = latest.ai_suggestions.split('\n')
                                    .map(s => s.replace(/^- /, '').replace(/^\* /, '').trim())
                                    .filter(s => s.length > 0);
            }
            latestAi = {
                title: latest.title,
                diagnosis: latest.ai_diagnosis,
                suggestions: suggestionsArray
            };
        }

        // Map user data
        this.user = {
          name: data.full_name || '',
          memberId: data.card_number || `ID-${data.id}`,
          status: data.state || 'active',
          memberType: plan.full_name || 'Chưa đăng ký gói',
          access: plan.description || '',
          phone: data.phone || '',
          dob: dobStr,
          rawDob: profile.date_of_birth || '',
          age: age,
          gender: data.gender === 'male' ? 'Nam' : (data.gender === 'female' ? 'Nữ' : 'Khác'),
          rawGender: data.gender || '',
          goal: extractedGoal,
          healthNotes: healthNotesText,
          emergencyContact: profile.emergency_contact || '',
          avatar: data.avatar || '',
          medicalHistory: healthNotesText ? [{ title: 'Ghi chú sức khỏe', description: healthNotesText, status: medicalStatus, icon: medicalIcon }] : [],
          aiRecommendation: latestAi
        };

        // Map biometrics
        if (metrics.length > 0) {
            const latest = metrics[0];
            const prev = metrics.length > 1 ? metrics[1] : null;

            this.biometrics = [
              { key: 'weight', label: 'CÂN NẶNG', value: latest.weight, unit: 'kg', icon: 'fas fa-shopping-bag', iconBg: '#e8f5e9', change: prev ? parseFloat((latest.weight - prev.weight).toFixed(1)) : undefined },
              { key: 'height', label: 'CHIỀU CAO', value: latest.height, unit: 'cm', icon: 'fas fa-arrows-alt-v', iconBg: '#e8f5e9', change: prev ? parseFloat((latest.height - prev.height).toFixed(1)) : undefined },
              { key: 'fat', label: '% MỠ (BODY FAT)', value: latest.body_fat_percentage, unit: '%', icon: 'fas fa-percent', iconBg: '#fff3e0', change: prev ? parseFloat((latest.body_fat_percentage - prev.body_fat_percentage).toFixed(1)) : undefined },
              { key: 'muscle', label: '% CƠ (MUSCLE)', value: latest.muscle_mass_kg, unit: '%', icon: 'fas fa-bolt', iconBg: '#e8f5e9', change: prev ? parseFloat((latest.muscle_mass_kg - prev.muscle_mass_kg).toFixed(1)) : undefined },
              { key: 'bmi', label: 'BMI (BODY MASS INDEX)', value: latest.bmi, unit: '', icon: 'fas fa-chart-bar', iconBg: '#e8f5e9', change: prev ? parseFloat((latest.bmi - prev.bmi).toFixed(1)) : undefined },
            ];
        }

      } catch (error) {
        console.error('Lỗi lấy hồ sơ:', error);
      } finally {
        this.loading = false;
      }
    },
    openEditModal() {
      this.editForm = {
        name:   this.user.name,
        phone:  this.user.phone,
        dob:    this.user.rawDob,
        gender: this.user.rawGender || 'male',
        goal:   this.user.goal,
        health_notes: this.user.healthNotes,
        emergency_contact: this.user.emergencyContact
      }
      this.showEditModal = true
    },
    async saveEdit() {
      if (this.saving) return
      this.saving = true
      this.saveError = ''
      try {
        // Gửi thẳng lên API – BE sẽ ghép goal vào health_notes
        const payload = {
          name:              this.editForm.name,
          phone:             this.editForm.phone,
          gender:            this.editForm.gender,
          date_of_birth:     this.editForm.dob     || undefined,
          goal:              this.editForm.goal     || undefined,
          health_notes:      this.editForm.health_notes || undefined,
          emergency_contact: this.editForm.emergency_contact || undefined,
        }
        await axios.post('/api/customer/profile/update', payload)
        this.showEditModal = false
        // Tải lại dữ liệu mới từ server
        await this.fetchProfile()
        this.saveSuccess = true
        setTimeout(() => { this.saveSuccess = false }, 3000)
      } catch (error) {
        console.error('Lỗi khi lưu hồ sơ:', error)
        this.saveError = error.response?.data?.message || 'Có lỗi xảy ra khi lưu hồ sơ.'
      } finally {
        this.saving = false
      }
    },
    async handleSave() {
      // Lưu trực tiếp các trường hiện tại của user (không qua modal)
      this.saving = true
      this.saveError = ''
      try {
        const payload = {
          name:              this.user.name,
          phone:             this.user.phone,
          gender:            this.user.rawGender,
          date_of_birth:     this.user.rawDob     || undefined,
          goal:              this.user.goal        || undefined,
          health_notes:      this.user.healthNotes || undefined,
          emergency_contact: this.user.emergencyContact || undefined,
        }
        await axios.post('/api/customer/profile/update', payload)
        await this.fetchProfile()
        this.saveSuccess = true
        setTimeout(() => { this.saveSuccess = false }, 3000)
      } catch (error) {
        console.error('Lỗi khi lưu hồ sơ:', error)
        this.saveError = error.response?.data?.message || 'Có lỗi xảy ra khi lưu hồ sơ.'
      } finally {
        this.saving = false
      }
    },
    handleCancel() {
      this.$router.go(-1)
    },
    userStateLabel,
    async generateAI() {
      this.generatingAI = true;
      try {
        await axios.post('/api/ai-recommendations/generate');
        await this.fetchProfile();
      } catch (error) {
        console.error('Lỗi khi tạo AI:', error);
        const msg = error.response?.data?.error || error.response?.data?.message || 'Vui lòng thử lại sau.';
        alert('Có lỗi xảy ra khi gọi AI: ' + msg);
      } finally {
        this.generatingAI = false;
      }
    },
  },
}
</script>

<style scoped>
/* ── Root ── */
.ho-so-page {
  font-family: 'Segoe UI', sans-serif;
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: 40px;
}

/* ── HEADER CARD ── */
.profile-header-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
  margin-bottom: 24px;
  overflow: hidden;
}
.profile-header-inner {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px 28px 16px;
  position: relative;
}

/* Avatar */
.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}
.profile-avatar {
  width: 90px;
  height: 90px;
  border-radius: 14px;
  object-fit: cover;
  border: 3px solid #e8f5e9;
  box-shadow: 0 2px 12px rgba(45,122,58,0.18);
}
.status-badge {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.55rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border-radius: 20px;
  white-space: nowrap;
}
.status-badge.active  { background: #22c55e; color: #fff; }
.status-badge.inactive{ background: #94a3b8; color: #fff; }

/* Info */
.profile-info { flex: 1; }
.profile-name {
  font-size: 1.45rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}
.profile-id {
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 10px;
}
.profile-badges { display: flex; gap: 8px; flex-wrap: wrap; }
.badge-tag {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  letter-spacing: 0.02em;
}
.badge-tag.gold  { background: #fff8e1; color: #b45309; border: 1px solid #fcd34d; }
.badge-tag.green { background: #f0fdf4; color: #15803d; border: 1px solid #86efac; }

/* Edit button */
.btn-edit-profile {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 34px; height: 34px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.8rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-edit-profile:hover { background: #e8f5e9; color: #2d7a3a; }

/* ── TABS ── */
.profile-tabs {
  display: flex;
  gap: 0;
  padding: 0 28px;
  border-top: 1px solid #f1f5f9;
}
.tab-btn {
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  padding: 14px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.tab-btn.active { color: #2d7a3a; border-bottom-color: #2d7a3a; }
.tab-btn:hover:not(.active) { color: #475569; }

/* ── TAB CONTENT ── */
.tab-content { animation: fadeIn 0.25s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── INFO CARDS ── */
.info-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
}
.info-card-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #94a3b8;
  margin-bottom: 16px;
  text-transform: uppercase;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.info-field {
  background: #f8fafc;
  border-radius: 10px;
  padding: 14px 16px;
  border: 1px solid #f1f5f9;
}
.field-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin-bottom: 6px;
  text-transform: uppercase;
}
.field-value      { font-size: 1rem; font-weight: 600; color: #1e293b; }
.field-value.goal { color: #2d7a3a; }
.field-age        { font-size: 0.82rem; color: #64748b; font-weight: 400; }

/* ── MEDICAL HISTORY ── */
.medical-item {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  border-radius: 10px;
  padding: 14px 16px;
  margin-top: 4px;
  transition: all 0.3s;
}
.medical-item.warning {
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-left: 4px solid #ef4444;
}
.medical-item.warning .medical-icon-wrap {
  background: #fee2e2;
  color: #ef4444;
}
.medical-item.good {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #22c55e;
}
.medical-item.good .medical-icon-wrap {
  background: #dcfce7;
  color: #22c55e;
}
.medical-icon-wrap {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
}
.medical-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}
.medical-desc { font-size: 0.78rem; color: #64748b; line-height: 1.5; }

/* ── AI CARD ── */
.ai-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  border: 1px solid #e8f5e9;
}
.ai-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.ai-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 1rem;
  flex-shrink: 0;
}
.ai-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  flex: 1;
}
.btn-generate-ai {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  transition: all 0.2s;
}
.btn-generate-ai:hover:not(:disabled) { background: #dcfce7; }
.btn-generate-ai:disabled { opacity: 0.7; cursor: not-allowed; }

.ai-rec-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}
.ai-rec-diagnosis {
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 12px;
  line-height: 1.5;
  background: #f8fafc;
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid #6366f1;
}

.ai-suggestions { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.ai-suggestions li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.83rem;
  color: #475569;
  line-height: 1.5;
}
.ai-suggestions li i { color: #22c55e; margin-top: 2px; flex-shrink: 0; }

/* ── BIOMETRIC CARDS ── */
.biometric-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 10px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
}
.biometric-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.biometric-card.bmi-highlight {
  border: 2px solid #22c55e;
  background: #f0fdf4;
}
.biometric-icon {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  color: #2d7a3a;
  flex-shrink: 0;
}
.biometric-info { flex: 1; }
.biometric-label {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.biometric-value {
  font-size: 1.45rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
}
.biometric-unit { font-size: 0.9rem; font-weight: 500; color: #94a3b8; }
.biometric-change {
  font-size: 0.88rem;
  font-weight: 700;
  min-width: 44px;
  text-align: right;
}
.biometric-change.neg { color: #ef4444; }
.biometric-change.pos { color: #22c55e; }

/* BMI badge */
.bmi-badge {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 2px 8px;
  border-radius: 20px;
}
.bmi-badge.overweight { background: #fef9c3; color: #b45309; border: 1px solid #fde68a; }

/* ── FOOTER ── */
.profile-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  padding-top: 24px;
  margin-top: 8px;
}
.btn-cancel {
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 10px;
  transition: background 0.2s;
}
.btn-cancel:hover { background: #f1f5f9; }
.btn-save {
  background: linear-gradient(135deg, #2d7a3a, #22c55e);
  color: #fff;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 10px 28px;
  border-radius: 12px;
  cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 14px rgba(34,197,94,0.35);
  transition: opacity 0.2s, transform 0.15s;
}
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-save:active { transform: scale(0.97); }

/* ── EMPTY TAB ── */
.empty-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
  font-size: 0.9rem;
  gap: 14px;
}
.empty-icon { font-size: 3rem; opacity: 0.25; }

/* ── EDIT MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease;
}
.edit-modal {
  background: #fff;
  border-radius: 18px;
  width: 480px;
  max-width: 95vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  overflow: hidden;
  animation: slideUp 0.25s ease;
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.edit-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}
.edit-modal-header h5 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.btn-modal-close {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: #f1f5f9;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
}
.btn-modal-close:hover { background: #fee2e2; color: #ef4444; }
.edit-modal-body { padding: 20px 24px; }
.form-label-sm { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
.edit-modal-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}
.edit-modal-footer-btns { display: flex; justify-content: flex-end; gap: 12px; }

/* ── SAVE ERROR ── */
.save-error {
  font-size: 0.8rem;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 12px;
  width: 100%;
}

/* ── SAVE TOAST ── */
.save-toast {
  position: fixed;
  top: 24px;
  right: 24px;
  background: #16a34a;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(22,163,74,0.35);
  z-index: 2000;
  display: flex;
  align-items: center;
}
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.3s ease; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateY(-12px); }

/* ── DISABLED BUTTONS ── */
.btn-save:disabled { opacity: 0.65; cursor: not-allowed; transform: none !important; }
.btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
