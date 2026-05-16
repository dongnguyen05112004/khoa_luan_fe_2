<template>
  <div class="ai-lotrinh-page py-4 bg-light min-vh-100" style="font-family: 'Inter', sans-serif;">
    <div class="container-fluid">

      <!-- Member Switch Bar -->
      <div class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body px-4 py-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center w-100 gap-4">
            <div class="flex-shrink-0 text-muted fw-bold" style="font-size: 0.75rem; letter-spacing: 0.5px;">
              CHUYỂN NHANH HỘI VIÊN
            </div>
            
            <div class="d-flex gap-3 overflow-auto flex-grow-1 member-tabs custom-scrollbar">
              <div
                v-for="m in members"
                :key="m.id"
                class="member-tab px-3 py-2 rounded-3 d-flex align-items-center gap-2"
                :class="{ 'active-member-tab': selectedMember && selectedMember.id === m.id }"
                @click="selectMember(m)"
                style="cursor: pointer; transition: all 0.2s; border: 1.5px solid transparent;"
              >
                <div class="position-relative">
                  <img :src="m.avatar" :alt="m.name" class="rounded-circle" style="width: 36px; height: 36px; object-fit: cover;" />
                  <span v-if="selectedMember && selectedMember.id === m.id" class="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle d-flex align-items-center justify-content-center" style="width: 14px; height: 14px;">
                    <i class="fas fa-check text-white" style="font-size: 7px;"></i>
                  </span>
                </div>
                <div class="d-flex flex-column lh-1">
                  <span class="fw-bold text-dark text-nowrap" style="font-size: 0.85rem;">
                    {{ selectedMember && selectedMember.id === m.id ? m.name : m.shortName }}
                  </span>
                  <span class="text-muted mt-1" style="font-size: 0.7rem;">{{ m.code }}</span>
                </div>
              </div>
            </div>

            <div class="flex-shrink-0 text-muted" style="font-size: 0.75rem;">
              PT phụ trách: {{ members.length }} hội viên
            </div>
          </div>
        </div>
      </div>

      <!-- Member Info Card -->
      <div v-if="selectedMember" class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div class="d-flex align-items-center gap-4">
            <div class="member-avatar-wrap d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7;">
              <img :src="selectedMember.avatar" :alt="selectedMember.name" class="rounded-circle shadow-sm" style="width: 54px; height: 54px; object-fit: cover;" />
            </div>
            <div>
              <div class="d-flex align-items-center gap-3 mb-2">
                <h4 class="mb-0 fw-bold text-dark">{{ selectedMember.name }} - {{ selectedMember.code }}</h4>
                <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1" style="font-size: 0.7rem;">ACTIVE</span>
              </div>
              <div class="d-flex align-items-center gap-4 text-muted" style="font-size: 0.85rem;">
                <span><i class="fas fa-bullseye me-1"></i> Mục tiêu gốc: <strong class="text-dark">{{ selectedMember.goal }}</strong></span>
                <span><i class="far fa-calendar-alt me-1"></i> Ngày tạo lộ trình: <strong class="text-dark">24/05/2024</strong></span>
                <span><i class="fas fa-chart-line me-1"></i> LEVEL: <strong class="text-dark">{{ selectedMember.level }}</strong></span>
              </div>
            </div>
          </div>
          <button class="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold text-dark d-flex align-items-center gap-2" @click="openHistory" style="font-size: 0.85rem;">
            <i class="fas fa-history"></i> Xem lịch sử
          </button>
        </div>
      </div>

      <!-- Main Body -->
      <div class="row g-4" v-if="selectedMember">
        
        <!-- Left Column -->
        <div class="col-lg-4 d-flex flex-column gap-4">
          
          <!-- Frequency Card -->
          <div class="card border-0 shadow-sm rounded-4 position-relative overflow-hidden">
            <div class="position-absolute top-0 bottom-0 start-0 bg-primary" style="width: 4px;"></div>
            <div class="card-body p-4 d-flex align-items-center gap-4">
              <div class="d-flex align-items-center justify-content-center rounded-3 text-primary" style="width: 50px; height: 50px; background-color: #eff6ff; font-size: 1.5rem;">
                <i class="far fa-calendar-check"></i>
              </div>
              <div>
                <div class="text-muted fw-bold mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">TẦN SUẤT TẬP THỰC TẾ (30 NGÀY QUA)</div>
                <h3 class="fw-bold mb-0 text-dark">18 buổi</h3>
              </div>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <h6 class="fw-bold text-dark mb-4 border-start border-3 border-success ps-2" style="border-color: #2d7a3a !important;">Chỉ số hiện tại</h6>
            
            <div class="row g-3 mb-4">
              <div class="col-6">
                <div class="bg-light rounded-4 p-3 h-100 border border-white shadow-sm">
                  <div class="text-muted fw-bold mb-2" style="font-size: 0.7rem;">CÂN NẶNG</div>
                  <div class="fw-bold text-dark fs-3 lh-1 mb-2">{{ healthMetrics?.weight || '--' }} <span class="fs-6 text-muted fw-normal" v-if="healthMetrics?.weight">kg</span></div> 
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded-4 p-3 h-100 border border-white shadow-sm">
                  <div class="text-muted fw-bold mb-2" style="font-size: 0.7rem;">BMI</div>
                  <div class="fw-bold text-dark fs-3 lh-1 mb-2">{{ healthMetrics?.bmi || '--' }}</div> 
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded-4 p-3 h-100 border border-white shadow-sm">
                  <div class="text-muted fw-bold mb-2" style="font-size: 0.7rem;">TỶ LỆ MỠ</div>
                  <div class="fw-bold text-dark fs-3 lh-1 mb-2">{{ healthMetrics?.body_fat_percentage || '--' }} <span class="fs-6 text-muted fw-normal" v-if="healthMetrics?.body_fat_percentage">%</span></div>
                   
                </div>
              </div>
              <div class="col-6">
                <div class="bg-light rounded-4 p-3 h-100 border border-white shadow-sm">
                  <div class="text-muted fw-bold mb-2" style="font-size: 0.7rem;">CHIỀU CAO</div>
                  <div class="fw-bold text-dark fs-3 lh-1 mb-2">{{ healthMetrics?.height || '--' }} <span class="fs-6 text-muted fw-normal" v-if="healthMetrics?.height">cm</span></div>
                  <div style="height: 18px;"></div>
                </div>
              </div>
            </div>

            <!-- Muscle Mass -->
            <div class="rounded-4 p-4 position-relative overflow-hidden text-white" style="background: #418953;">
              <i class="fas fa-dumbbell position-absolute" style="font-size: 6rem; right: -20px; bottom: -20px; transform: rotate(-30deg); opacity: 0.15;"></i>
              <div class="position-relative z-1">
                <div class="fw-bold mb-2" style="font-size: 0.7rem; letter-spacing: 0.5px; color: rgba(255,255,255,0.9);">KHỐI LƯỢNG CƠ BẮP</div>
                <div class="fw-bold fs-1 lh-1 mb-2">{{ healthMetrics?.muscle_mass_kg || '--' }} <span class="fs-6 fw-normal" style="color: rgba(255,255,255,0.9);" v-if="healthMetrics?.muscle_mass_kg">kg</span></div>
                <div v-if="healthMetrics" class="fw-bold" style="font-size: 0.8rem; color: #a7f3d0;"><i class="fas fa-arrow-trend-up"></i> Tăng 1.2kg (30 ngày)</div>
              </div>
            </div>
          </div>

          <!-- Nutrition -->
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <i class="fas fa-utensils" style="color: #8b5cf6;"></i>
              <h6 class="fw-bold text-dark mb-0">Dinh dưỡng đề xuất</h6>
            </div>
            
            <div class="fw-bold text-dark fs-2 lh-1 mb-3">2200 <span class="fs-6 text-muted fw-normal">kcal/ngày</span></div>
            
            <div class="progress mb-3 rounded-pill" style="height: 12px; border: 1px solid #f1f5f9;">
              <div class="progress-bar" style="width: 40%; background-color: #2d7a3a;"></div>
              <div class="progress-bar" style="width: 35%; background-color: #8b5cf6;"></div>
              <div class="progress-bar" style="width: 25%; background-color: #f59e0b;"></div>
            </div>
            
            <div class="d-flex justify-content-between text-muted fw-bold" style="font-size: 0.65rem;">
              <div class="d-flex align-items-center gap-1"><span class="rounded-circle" style="width:8px; height:8px; background-color: #2d7a3a;"></span> ĐẠM 40%</div>
              <div class="d-flex align-items-center gap-1"><span class="rounded-circle" style="width:8px; height:8px; background-color: #8b5cf6;"></span> TINH BỘT 35%</div>
              <div class="d-flex align-items-center gap-1"><span class="rounded-circle" style="width:8px; height:8px; background-color: #f59e0b;"></span> BÉO 25%</div>
            </div>
          </div>

        </div>

        <!-- Right Column -->
        <div class="col-lg-8 d-flex flex-column gap-4">
          
          <!-- AI Analysis Card -->
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div class="d-flex align-items-center gap-3">
                <div class="d-flex align-items-center justify-content-center text-white rounded-4 shadow-sm" style="width: 56px; height: 56px; background: linear-gradient(135deg, #6366f1, #3b82f6); font-size: 1.5rem;">
                  <i class="fas fa-brain"></i>
                </div>
                <div>
                  <div class="d-flex align-items-center gap-3 mb-1">
                    <h4 class="fw-bold text-dark mb-0">{{ aiRecommendation?.title || 'Phân tích thể trạng AI' }}</h4>
                    <button class="btn btn-sm text-primary bg-primary bg-opacity-10 border-0 rounded-pill d-flex align-items-center gap-2 px-3 fw-bold shadow-sm" style="font-size: 0.75rem;" @click="generateAiForCurrent" :disabled="isGeneratingAi">
                      <i class="fas fa-magic" :class="{'fa-spin': isGeneratingAi}"></i>
                      {{ isGeneratingAi ? 'Đang phân tích...' : 'Tạo phân tích AI' }}
                    </button>
                  </div>
                  <div class="text-muted fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">AI MODEL V4.2 OPTIMIZER</div>
                </div>
              </div>
              
               
            </div>

            <div class="bg-light rounded-4 p-4 mb-4 text-dark lh-lg" style="font-size: 1rem;">
              <div v-if="isGeneratingAi || loading" class="text-center text-muted py-2">
                <i class="fas fa-spinner fa-spin text-primary me-2"></i> Hệ thống đang thu thập và phân tích dữ liệu...
              </div>
              <div v-else-if="aiRecommendation?.ai_diagnosis">
                {{ aiRecommendation.ai_diagnosis }}
              </div>
              <div v-else class="text-center text-muted py-2" style="font-size: 0.9rem;">
                <i class="fas fa-robot mb-2 fs-3 text-secondary opacity-50"></i><br/>
                Chưa có dữ liệu phân tích. Nhấn "Tạo phân tích AI" để bắt đầu.
              </div>
            </div>

            <div class="row g-4">
              <div class="col-md-6">
                <div class="fw-bold text-muted mb-3" style="font-size: 0.75rem; letter-spacing: 0.5px;">CHIẾN LƯỢC ƯU TIÊN</div>
                <div v-if="isGeneratingAi || loading" class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải...</div>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-3" v-else-if="priorityStrategies.length > 0">
                  <li class="d-flex align-items-start gap-2 text-dark" style="font-size: 0.95rem;" v-for="(item, i) in priorityStrategies" :key="i">
                    <i class="fas fa-check-circle text-success mt-1" style="font-size: 1.1rem;"></i> <span>{{ item }}</span>
                  </li>
                </ul>
                <div v-else class="text-muted fst-italic" style="font-size: 0.85rem;">Chưa có dữ liệu</div>
              </div>
              <div class="col-md-6">
                <div class="fw-bold text-muted mb-3" style="font-size: 0.75rem; letter-spacing: 0.5px;">CẦN HẠN CHẾ</div>
                <div v-if="isGeneratingAi || loading" class="text-muted"><i class="fas fa-spinner fa-spin me-2"></i> Đang tải...</div>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-3" v-else-if="limitStrategies.length > 0">
                  <li class="d-flex align-items-start gap-2 text-dark" style="font-size: 0.95rem;" v-for="(item, i) in limitStrategies" :key="i">
                    <i class="fas fa-times-circle text-danger mt-1" style="font-size: 1.1rem;"></i> <span>{{ item }}</span>
                  </li>
                </ul>
                <div v-else class="text-muted fst-italic" style="font-size: 0.85rem;">Chưa có dữ liệu</div>
              </div>
            </div>

          </div>

          <!-- 12-Week Plan -->
          <div class="card border-0 shadow-sm rounded-4 p-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h4 class="fw-bold text-dark mb-1">Lộ trình 12 tuần đề xuất</h4>
                <div class="text-muted" style="font-size: 0.9rem;">Cá nhân hóa theo mục tiêu tăng cơ giảm mỡ</div>
              </div>
              
            </div>

            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="bg-light rounded-4 p-4 h-100 border border-white shadow-sm position-relative">
                  <div v-if="isGeneratingAi || loading" class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-4" style="z-index: 2;">
                    <i class="fas fa-spinner fa-spin text-success fs-4"></i>
                  </div>
                  <div class="badge bg-success bg-opacity-10 text-success rounded-2 mb-3 px-2 py-1" style="font-size: 0.65rem; letter-spacing: 0.5px;">TUẦN 1-4</div>
                  <h6 class="fw-bold text-dark mb-2">{{ roadmapPhases[0].title }}</h6>
                  <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.6;">{{ roadmapPhases[0].desc }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="rounded-4 p-4 h-100 border border-white shadow-sm position-relative" style="background-color: #faf5ff;">
                  <div v-if="isGeneratingAi || loading" class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-4" style="z-index: 2;">
                    <i class="fas fa-spinner fa-spin fs-4" style="color: #8b5cf6;"></i>
                  </div>
                  <div class="badge rounded-2 mb-3 px-2 py-1" style="color: #8b5cf6; font-size: 0.65rem; letter-spacing: 0.5px; background-color: #f3e8ff;">TUẦN 5-8</div>
                  <h6 class="fw-bold text-dark mb-2">{{ roadmapPhases[1].title }}</h6>
                  <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.6;">{{ roadmapPhases[1].desc }}</p>
                </div>
              </div>
              <div class="col-md-4">
                <div class="bg-light rounded-4 p-4 h-100 border border-white shadow-sm position-relative">
                  <div v-if="isGeneratingAi || loading" class="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75 d-flex align-items-center justify-content-center rounded-4" style="z-index: 2;">
                    <i class="fas fa-spinner fa-spin text-secondary fs-4"></i>
                  </div>
                  <div class="badge bg-secondary bg-opacity-10 text-secondary rounded-2 mb-3 px-2 py-1" style="font-size: 0.65rem; letter-spacing: 0.5px;">TUẦN 9-12</div>
                  <h6 class="fw-bold text-dark mb-2">{{ roadmapPhases[2].title }}</h6>
                  <p class="text-muted mb-0" style="font-size: 0.85rem; line-height: 1.6;">{{ roadmapPhases[2].desc }}</p>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between pt-4 mt-2">
              <div class="d-flex align-items-center gap-3 text-muted">
                <div class="d-flex align-items-center justify-content-center bg-light rounded-circle" style="width: 44px; height: 44px;">
                  <i class="fas fa-rocket" style="color: #94a3b8; font-size: 1.1rem;"></i>
                </div>
                <span style="font-size: 0.9rem; max-width: 250px; line-height: 1.4;">Xác nhận để áp dụng lộ trình này vào lịch tập của hội viên.</span>
              </div>
              <button class="btn btn-primary rounded-3 px-5 py-3 fw-bold border-0 shadow" style="background: #3b82f6; font-size: 0.95rem; letter-spacing: 0.5px;" @click="activatePlan" :disabled="isActivating">
                <i class="fas fa-spinner fa-spin me-2" v-if="isActivating"></i>
                {{ isActivating ? 'ĐANG KÍCH HOẠT...' : 'KÍCH HOẠT LỘ TRÌNH' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- History Modal -->
    <div class="modal fade show d-block" tabindex="-1" v-if="showHistoryModal" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content rounded-4 border-0 shadow">
          <div class="modal-header border-bottom-0 pb-0">
            <h5 class="modal-title fw-bold text-dark px-2 pt-2">Lịch sử chẩn đoán AI - {{ selectedMember?.name }}</h5>
            <button type="button" class="btn-close me-2" @click="showHistoryModal = false"></button>
          </div>
          <div class="modal-body p-4">
            <div v-if="loadingHistory" class="text-center text-muted py-5">
              <div class="spinner-border text-primary mb-3" role="status"></div>
              <div>Đang tải lịch sử...</div>
            </div>
            <div v-else-if="aiHistory.length === 0" class="text-center text-muted py-5">
              <i class="fas fa-folder-open mb-3 fs-1 text-light"></i>
              <div>Chưa có lịch sử chẩn đoán nào.</div>
            </div>
            <div v-else class="d-flex flex-column gap-3">
              <div v-for="hist in aiHistory" :key="hist.id" class="card bg-light border-0 rounded-4 p-4">
                <div class="d-flex align-items-center gap-2 text-muted mb-2" style="font-size: 0.8rem;">
                  <i class="far fa-clock"></i> {{ formatDate(hist.created_at) }}
                </div>
                <h6 class="fw-bold text-dark mb-3">{{ hist.title }}</h6>
                <div class="bg-white p-3 rounded-3 border-start border-3 border-primary text-dark mb-3" style="font-size: 0.9rem; line-height: 1.6;">
                  {{ hist.ai_diagnosis }}
                </div>
                <ul class="list-unstyled mb-0 d-flex flex-column gap-2 text-muted" style="font-size: 0.85rem;">
                  <li v-for="(sug, i) in (hist.ai_suggestions || '').split('\n').filter(s => s.trim().length > 0)" :key="i" class="d-flex align-items-start gap-2">
                    <i class="fas fa-check text-success mt-1"></i> <span>{{ sug.replace(/^- /, '').trim() }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API = '/api'
const COLORS = ['#2d7a3a','#1a7de2','#ec4899','#f59e0b','#9333ea','#0891b2']

export default {
  name: 'GoiYAIPT',
  data() {
    return {
      members: [],
      selectedMember: null,
      myTrainerId: null,
      healthMetrics: null,
      aiRecommendation: null,
      loading: false,
      isGeneratingAi: false,
      showHistoryModal: false,
      aiHistory: [],
      loadingHistory: false,
      isActivating: false,
    }
  },
  computed: {
    recommendedFrequency() {
      if (!this.aiRecommendation || !this.aiRecommendation.ai_suggestions) return 'Chưa có';
      const match = this.aiRecommendation.ai_suggestions.match(/\[FREQ\](.*)/i);
      return match ? match[1].trim() : 'Chưa có';
    },
    priorityStrategies() {
      if (!this.aiRecommendation || !this.aiRecommendation.ai_suggestions) return [];
      const lines = this.aiRecommendation.ai_suggestions.split('\n');
      const list = lines.filter(l => l.includes('[PRIORITY]')).map(l => l.replace(/\[PRIORITY\]/gi, '').trim());
      if (list.length > 0) return list;

      // Fallback cho model cũ
      const oldList = lines.filter(s => s.trim().length > 0 && !s.includes('[FREQ]') && !s.includes('[LIMIT]')).map(s => s.replace(/^- /, '').replace(/^\* /, '').trim());
      return oldList.filter(s => !s.toLowerCase().match(/hạn chế|tránh|không|đừng|giảm/));
    },
    limitStrategies() {
      if (!this.aiRecommendation || !this.aiRecommendation.ai_suggestions) return [];
      const lines = this.aiRecommendation.ai_suggestions.split('\n');
      const list = lines.filter(l => l.includes('[LIMIT]')).map(l => l.replace(/\[LIMIT\]/gi, '').trim());
      if (list.length > 0) return list;

      // Fallback cho model cũ
      const oldList = lines.filter(s => s.trim().length > 0 && !s.includes('[FREQ]') && !s.includes('[PRIORITY]') && !s.includes('[PHASE')).map(s => s.replace(/^- /, '').replace(/^\* /, '').trim());
      return oldList.filter(s => s.toLowerCase().match(/hạn chế|tránh|không|đừng|giảm/));
    },
    roadmapPhases() {
      const defaultPhases = [
        { title: 'Chưa xác định', desc: 'Đang chờ phân tích AI...' },
        { title: 'Chưa xác định', desc: 'Đang chờ phân tích AI...' },
        { title: 'Chưa xác định', desc: 'Đang chờ phân tích AI...' }
      ];
      if (!this.aiRecommendation || !this.aiRecommendation.ai_suggestions) return defaultPhases;
      
      const lines = this.aiRecommendation.ai_suggestions.split('\n');
      const phases = [];
      
      for (let i = 1; i <= 3; i++) {
        const line = lines.find(l => l.includes(`[PHASE${i}]`));
        if (line) {
          const content = line.replace(`[PHASE${i}]`, '').trim();
          const parts = content.split('|').map(s => s.trim());
          if (parts.length >= 2) {
            phases.push({ title: parts[0], desc: parts.slice(1).join(' | ') });
          } else {
            phases.push({ title: `Giai đoạn ${i}`, desc: parts[0] });
          }
        } else {
          phases.push(defaultPhases[i-1]);
        }
      }
      return phases;
    }
  },
  mounted() {
    this.loadMembers()
  },
  methods: {
    async loadMembers() {
      try {
        const meRes = await axios.get(`${API}/me`)
        const me = meRes.data

        const trRes = await axios.get(`${API}/trainers`)
        const trainers = Array.isArray(trRes.data) ? trRes.data : (trRes.data?.data || [])
        const myTrainer = trainers.find(t => t.user_id == me.id)
        if (!myTrainer) {
          console.warn('Không tìm thấy trainer record cho user id:', me.id)
          return
        }
        this.myTrainerId = myTrainer.id

        const cRes = await axios.get(`${API}/pt-contracts?trainer_id=${myTrainer.id}&per_page=100`)
        const contracts = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || [])
        const allMembers = contracts
          .filter(c => c.user)
          .map((c, idx) => ({
            id: c.user.id,
            name: c.user.full_name || 'Hội viên',
            shortName: c.user.full_name || 'Hội viên',
            code: `HV${c.user.id}`,
            goal: c.user.member_profile?.health_notes || 'Tập luyện',
            level: 'INTERMEDIATE',
            avatar: c.user.member_profile?.avatar ? `http://localhost:8000/storage/${c.user.member_profile.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user.full_name||'HV')}&background=${COLORS[idx%COLORS.length].replace('#','')}&color=fff&bold=true&size=48`,
          }))
        
        const uniqueMembers = [];
        const memberIds = new Set();
        for (const m of allMembers) {
          if (!memberIds.has(m.id)) {
            uniqueMembers.push(m);
            memberIds.add(m.id);
          }
        }
        this.members = uniqueMembers;

        if (this.members.length > 0) {
          this.selectMember(this.members[0])
        }
      } catch (e) {
        console.error('loadMembers error', e)
      }
    },
    async selectMember(m) { 
      this.selectedMember = m 
      this.healthMetrics = null
      this.aiRecommendation = null
      await this.loadMemberData(m.id)
    },
    async loadMemberData(userId) {
      this.loading = true;
      try {
        const hmRes = await axios.get(`${API}/users/${userId}/health-metrics`)
        const metrics = hmRes.data || []
        if (metrics.length > 0) {
          this.healthMetrics = metrics.sort((a,b) => new Date(b.record_date) - new Date(a.record_date))[0];
        }

        const aiRes = await axios.get(`${API}/ai-recommendations?user_id=${userId}&type=Health%20%26%20Fitness`)
        const aiList = aiRes.data?.data || []
        if (aiList.length > 0) {
          this.aiRecommendation = aiList[0]
        } else {
          await this.generateAi(userId)
        }
      } catch(e) {
        console.error('loadMemberData error', e)
      } finally {
        this.loading = false;
      }
    },
    async generateAiForCurrent() {
      if (!this.selectedMember) return;
      this.isGeneratingAi = true;
      await this.generateAi(this.selectedMember.id);
      this.isGeneratingAi = false;
    },
    async generateAi(userId) {
      try {
        const res = await axios.post(`${API}/ai-recommendations/generate`, { user_id: userId })
        this.aiRecommendation = res.data?.data;
      } catch(e) {
        if (e.response?.status === 401) {
          alert('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.')
          this.$router.push('/login')
          return
        }
        console.error('generateAi error', e)
      }
    },
    async activatePlan() { 
      if (!this.aiRecommendation) {
        alert('Vui lòng tạo phân tích AI trước khi kích hoạt.');
        return;
      }
      
      this.isActivating = true;
      try {
        // Cập nhật tiêu đề để hội viên biết đây là lộ trình chính thức từ PT
        await axios.put(`${API}/ai-recommendations/${this.aiRecommendation.id}`, {
          title: 'LỘ TRÌNH LUYỆN TẬP 12 TUẦN: ' + this.aiRecommendation.title
        });
        
        alert('Đã kích hoạt lộ trình cho ' + this.selectedMember.name + '. Hội viên đã có thể xem lộ trình này trong trang "Theo dõi tiến trình".');
        
        // Tải lại dữ liệu để cập nhật UI
        await this.loadMemberData(this.selectedMember.id);
      } catch (e) {
        console.error('Lỗi khi kích hoạt lộ trình', e);
        alert('Có lỗi xảy ra khi kích hoạt lộ trình. Vui lòng thử lại.');
      } finally {
        this.isActivating = false;
      }
    },
    async openHistory() {
      if (!this.selectedMember) return;
      this.showHistoryModal = true;
      this.loadingHistory = true;
      try {
        const res = await axios.get(`${API}/ai-recommendations?user_id=${this.selectedMember.id}&type=Health%20%26%20Fitness`);
        this.aiHistory = res.data?.data || [];
      } catch (e) {
        console.error('Lỗi tải lịch sử AI', e);
      } finally {
        this.loadingHistory = false;
      }
    },
    formatDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    formatSimpleDate(d) {
      if (!d) return '';
      return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  },
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.member-tab {
  background-color: #f8fafc;
}
.member-tab:hover {
  background-color: #f1f5f9;
}
.active-member-tab {
  background-color: #f0fdf4 !important;
  border-color: #22c55e !important;
}
</style>
