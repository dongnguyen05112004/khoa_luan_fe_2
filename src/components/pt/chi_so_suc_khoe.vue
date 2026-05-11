<template>
  <div class="health-metrics-container p-4">
    <!-- Header: Chọn hội viên -->
    <div class="card mb-4 border-0 shadow-sm rounded-4">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="fw-bold mb-0">Chọn hội viên phụ trách</h5>
          <span class="text-muted small">PT phụ trách: {{ members.length }} hội viên</span>
        </div>
        <div class="member-list d-flex gap-3 overflow-auto pb-2">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="member-card p-3 text-center rounded-4 cursor-pointer transition-all"
            :class="{ 'active-member': selectedMember?.id === member.id }"
            @click="selectMember(member)"
          >
            <div class="avatar-wrapper mb-2 position-relative">
              <img :src="member.avatar" :alt="member.name" class="rounded-circle shadow-sm">
              <div v-if="selectedMember?.id === member.id" class="check-badge">
                <i class="fa-solid fa-check text-white"></i>
              </div>
            </div>
            <div class="member-name fw-bold small text-truncate" style="max-width: 100px;">{{ member.name }}</div>
            <div class="member-id text-muted x-small">{{ member.code }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Left Column: Thông số mới -->
      <div class="col-lg-4">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-body p-4 d-flex flex-column">
            <h5 class="fw-bold d-flex align-items-center mb-1">
              <span class="accent-bar me-2"></span> Thông số mới
            </h5>
            <p class="text-muted small mb-4">
              Đang cập nhật cho: <span class="text-success fw-bold">{{ selectedMember?.name }} - {{ selectedMember?.code }}</span>
            </p>

            <div class="row g-3">
              <div class="col-6">
                <label class="form-label x-small fw-bold text-uppercase text-muted">Cân nặng (kg)</label>
                <input type="number" v-model="form.weight" class="form-control custom-input" placeholder="0.0">
              </div>
              <div class="col-6">
                <label class="form-label x-small fw-bold text-uppercase text-muted">Chiều cao (cm)</label>
                <input type="number" v-model="form.height" class="form-control custom-input" placeholder="0">
              </div>
              <div class="col-6">
                <label class="form-label x-small fw-bold text-uppercase text-muted">Body Fat (%)</label>
                <input type="number" v-model="form.bodyFat" class="form-control custom-input" placeholder="0.0">
              </div>
              <div class="col-6">
                <label class="form-label x-small fw-bold text-uppercase text-muted">Cơ bắp (%)</label>
                <input type="number" v-model="form.muscle" class="form-control custom-input" placeholder="0.0">
              </div>
            </div>

            <div class="bmi-box mt-4 p-3 rounded-4 d-flex justify-content-between align-items-center shadow-sm">
              <div>
                <div class="x-small fw-bold text-purple text-uppercase">Chỉ số BMI dự kiến</div>
                <div class="h3 fw-bold mb-0 text-dark">{{ calculatedBMI }}</div>
              </div>
              <div class="bmi-status px-3 py-1 rounded-pill small fw-bold" :class="bmiStatusClass">
                {{ bmiStatusText }}
              </div>
            </div>

            <div class="mt-auto pt-4 d-grid gap-2">
              <button class="btn btn-success rounded-3 py-3 fw-bold shadow-sm btn-hover-scale" @click="saveMetrics">Lưu thông tin</button>
              <button class="btn btn-light rounded-3 py-2 fw-bold text-muted border-0" @click="resetForm">Hủy</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Biểu đồ và Thống kê -->
      <div class="col-lg-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <h5 class="fw-bold mb-0">Biểu đồ tiến trình (6 tháng qua)</h5>
              <div class="btn-group btn-group-sm bg-light rounded-pill p-1 shadow-sm">
                <button 
                  v-for="tab in ['Cân nặng', 'Body Fat', 'Cơ bắp']" 
                  :key="tab"
                  class="btn rounded-pill border-0 px-3 transition-all py-2"
                  :class="activeTab === tab ? 'bg-white shadow-sm fw-bold text-success' : 'text-muted'"
                  @click="activeTab = tab"
                >
                  {{ tab }}
                </button>
              </div>
            </div>

            <div class="chart-wrapper rounded-4 p-2 mb-4">
              <div style="height: 320px; position: relative;">
                <canvas id="progressChart"></canvas>
              </div>
            </div>

            <div class="row g-3">
              <!-- Cân nặng -->
              <div class="col-md-4">
                <div class="card border-0 bg-light rounded-4 stat-card transition-all h-100">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center mb-2">
                      <div class="icon-box bg-white text-success rounded-3 shadow-sm p-2 me-2">
                        <i class="fa-solid fa-weight-scale h5 mb-0"></i>
                      </div>
                      <span class="x-small text-muted text-uppercase fw-bold">Cân nặng</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2">
                      <span class="h4 fw-bold mb-0">{{ latestMetrics.weight || 0 }}</span>
                      <span class="small text-muted">kg</span>
                    </div>
                    <div class="mt-1">
                      <span class="badge rounded-pill x-small px-2" :class="parseFloat(weightChange) <= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                        {{ weightChange }} kg
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Body Fat -->
              <div class="col-md-4">
                <div class="card border-0 bg-light rounded-4 stat-card transition-all h-100">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center mb-2">
                      <div class="icon-box bg-white text-warning rounded-3 shadow-sm p-2 me-2">
                        <i class="fa-solid fa-droplet h5 mb-0"></i>
                      </div>
                      <span class="x-small text-muted text-uppercase fw-bold">Body Fat</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2">
                      <span class="h4 fw-bold mb-0">{{ latestMetrics.body_fat_percentage || 0 }}</span>
                      <span class="small text-muted">%</span>
                    </div>
                    <div class="mt-1">
                      <span class="badge rounded-pill x-small px-2" :class="parseFloat(bodyFatChange) <= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                         {{ bodyFatChange }} %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Cơ bắp -->
              <div class="col-md-4">
                <div class="card border-0 bg-light rounded-4 stat-card transition-all h-100">
                  <div class="card-body p-3">
                    <div class="d-flex align-items-center mb-2">
                      <div class="icon-box bg-white text-purple rounded-3 shadow-sm p-2 me-2">
                        <i class="fa-solid fa-child-muscle h5 mb-0"></i>
                      </div>
                      <span class="x-small text-muted text-uppercase fw-bold">Cơ bắp</span>
                    </div>
                    <div class="d-flex align-items-baseline gap-2">
                      <span class="h4 fw-bold mb-0">{{ latestMetrics.muscle_mass_kg || 0 }}</span>
                      <span class="small text-muted">%</span>
                    </div>
                    <div class="mt-1">
                      <span class="badge rounded-pill x-small px-2" :class="parseFloat(muscleChange) >= 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'">
                        {{ muscleChange }} %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bảng lịch sử đo -->
            <div class="mt-4">
              <h6 class="fw-bold mb-3 d-flex align-items-center">
                <i class="fa-solid fa-history me-2 text-primary"></i> Lịch sử đo lường gần đây
              </h6>
              <div class="table-responsive rounded-3 border">
                <table class="table table-hover mb-0 small">
                  <thead class="table-light">
                    <tr>
                      <th class="border-0">Ngày đo</th>
                      <th class="border-0">Cân nặng</th>
                      <th class="border-0">Body Fat</th>
                      <th class="border-0">Cơ bắp</th>
                      <th class="border-0 text-center">BMI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="m in [...healthMetrics].reverse().slice(0, 5)" :key="m.id">
                      <td class="fw-medium">{{ formatDate(m.record_date) }}</td>
                      <td>{{ m.weight }} kg</td>
                      <td>{{ m.body_fat_percentage || '-' }} %</td>
                      <td>{{ m.muscle_mass_kg || '-' }} %</td>
                      <td class="text-center">
                        <span class="badge bg-light text-dark border">{{ m.bmi || '-' }}</span>
                      </td>
                    </tr>
                    <tr v-if="healthMetrics.length === 0">
                      <td colspan="5" class="text-center py-4 text-muted italic">
                        Chưa có dữ liệu lịch sử cho hội viên này
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { healthMetricApi } from '@/services/healthMetricApi';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const COLORS = ['#2d7a3a','#1a7de2','#ec4899','#f59e0b','#9333ea','#0891b2'];

function authHeaders() {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
}

// State
const members = ref([]);
const selectedMember = ref(null);
const activeTab = ref('Cân nặng');
const healthMetrics = ref([]);
const myTrainerId = ref(null);
const isLoading = ref(false);

const form = ref({
  weight: null,
  height: null,
  bodyFat: null,
  muscle: null
});

let chartInstance = null;

// Logic tính BMI
const calculatedBMI = computed(() => {
  if (form.value.weight && form.value.height) {
    const heightInMeters = form.value.height / 100;
    return (form.value.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }
  return '0.0';
});

const bmiStatusText = computed(() => {
  const bmi = parseFloat(calculatedBMI.value);
  if (bmi <= 0) return '---';
  if (bmi < 18.5) return 'Cân nặng thấp';
  if (bmi < 25) return 'Bình thường';
  if (bmi < 30) return 'Tiền béo phì';
  return 'Béo phì';
});

const bmiStatusClass = computed(() => {
  const bmi = parseFloat(calculatedBMI.value);
  if (bmi <= 0) return 'bg-light text-muted';
  if (bmi < 18.5) return 'bg-warning-subtle text-warning';
  if (bmi < 25) return 'bg-success-subtle text-success';
  return 'bg-danger-subtle text-danger';
});

// Fetch Data
const loadMembers = async () => {
  try {
    const meRes = await axios.get(`${API}/me`, authHeaders());
    const trRes = await axios.get(`${API}/trainers`, authHeaders());
    const trainers = Array.isArray(trRes.data) ? trRes.data : (trRes.data?.data || []);
    const myTrainer = trainers.find(t => t.user_id == meRes.data.id);
    if (!myTrainer) return;
    myTrainerId.value = myTrainer.id;

    const cRes = await axios.get(`${API}/pt-contracts?trainer_id=${myTrainerId.value}&per_page=100`, authHeaders());
    const contracts = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || []);
    members.value = contracts.map((c, idx) => {
      const memberName = c.user?.full_name || c.user?.name || 'Hội viên';
      return {
        id: c.user?.id,
        name: memberName,
        code: c.user?.member_profile?.card_number || `HV-${c.user?.id}`,
        avatar: c.user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberName)}&background=${COLORS[idx % COLORS.length].replace('#', '')}&color=fff`,
      };
    });

    if (members.value.length > 0) {
      selectMember(members.value[0]);
    }
  } catch (error) {
    console.error('Error loading members:', error);
  }
};

const loadHealthMetrics = async (userId) => {
  if (!userId) return;
  isLoading.value = true;
  try {
    const res = await healthMetricApi.getAll({ user_id: userId });
    healthMetrics.value = res.data.reverse(); // Reverse to show chronological order in chart
    
    // Pre-fill form with latest values for reference and quick update
    if (healthMetrics.value.length > 0) {
      const latest = healthMetrics.value[healthMetrics.value.length - 1];
      form.value = {
        weight: latest.weight,
        height: latest.height,
        bodyFat: latest.body_fat_percentage,
        muscle: latest.muscle_mass_kg
      };
    } else {
      resetForm();
    }
    
    updateChartData();
  } catch (error) {
    console.error('Error loading health metrics:', error);
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleDateString('vi-VN');
};

const selectMember = (member) => {
  selectedMember.value = member;
  resetForm();
  loadHealthMetrics(member.id);
};

const resetForm = () => {
  form.value = {
    weight: null,
    height: form.value.height, // Keep height
    bodyFat: null,
    muscle: null
  };
};

const saveMetrics = async () => {
  if (!selectedMember.value) {
    alert('Vui lòng chọn hội viên');
    return;
  }
  if (!form.value.weight) {
    alert('Vui lòng nhập cân nặng');
    return;
  }

  try {
    const data = {
      user_id: selectedMember.value.id,
      record_date: new Date().toISOString().split('T')[0],
      weight: form.value.weight,
      height: form.value.height,
      body_fat_percentage: form.value.bodyFat,
      muscle_mass_kg: form.value.muscle,
      bmi: parseFloat(calculatedBMI.value)
    };

    await healthMetricApi.create(data);
    alert('Đã lưu thông số sức khỏe thành công!');
    loadHealthMetrics(selectedMember.value.id);
    resetForm();
  } catch (error) {
    console.error('Error saving metrics:', error);
    alert('Lỗi: ' + (error.response?.data?.message || 'Không thể lưu thông số'));
  }
};

// Statistics Logic
const latestMetrics = computed(() => {
  if (healthMetrics.value.length === 0) return { weight: 0, body_fat_percentage: 0, muscle_mass_kg: 0 };
  return healthMetrics.value[healthMetrics.value.length - 1];
});

const weightChange = computed(() => {
  if (healthMetrics.value.length < 2) return '0.0';
  const latest = healthMetrics.value[healthMetrics.value.length - 1].weight;
  const previous = healthMetrics.value[healthMetrics.value.length - 2].weight;
  const diff = (latest - previous).toFixed(1);
  return `${diff > 0 ? '+' : ''}${diff}`;
});

const bodyFatChange = computed(() => {
  if (healthMetrics.value.length < 2) return '0.0';
  const latest = healthMetrics.value[healthMetrics.value.length - 1].body_fat_percentage;
  const previous = healthMetrics.value[healthMetrics.value.length - 2].body_fat_percentage;
  if (latest === null || previous === null) return '0.0';
  const diff = (latest - previous).toFixed(1);
  return `${diff > 0 ? '+' : ''}${diff}`;
});

const muscleChange = computed(() => {
  if (healthMetrics.value.length < 2) return '0.0';
  const latest = healthMetrics.value[healthMetrics.value.length - 1].muscle_mass_kg;
  const previous = healthMetrics.value[healthMetrics.value.length - 2].muscle_mass_kg;
  if (latest === null || previous === null) return '0.0';
  const diff = (latest - previous).toFixed(1);
  return `${diff > 0 ? '+' : ''}${diff}`;
});

// Logic Chart
const initChart = () => {
  const ctx = document.getElementById('progressChart');
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = healthMetrics.value.map(m => {
    const d = new Date(m.record_date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  let chartData = [];
  let unit = '';
  
  if (activeTab.value === 'Cân nặng') {
    chartData = healthMetrics.value.map(m => m.weight);
    unit = 'kg';
  } else if (activeTab.value === 'Body Fat') {
    chartData = healthMetrics.value.map(m => m.body_fat_percentage);
    unit = '%';
  } else if (activeTab.value === 'Cơ bắp') {
    chartData = healthMetrics.value.map(m => m.muscle_mass_kg);
    unit = '%';
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: activeTab.value,
        data: chartData,
        borderColor: '#4CAF50',
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(76, 175, 80, 0)');
          gradient.addColorStop(1, 'rgba(76, 175, 80, 0.15)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#FFF',
        pointBorderColor: '#4CAF50',
        pointBorderWidth: 3,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#4CAF50',
        pointHoverBorderColor: '#FFF'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#333',
          padding: 12,
          bodyFont: { size: 14 },
          displayColors: false,
          callbacks: {
            label: (context) => `${context.dataset.label}: ${context.parsed.y} ${unit}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
          ticks: { color: '#adb5bd', font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#adb5bd', font: { size: 11 } }
        }
      }
    }
  });
};

const updateChartData = () => {
  nextTick(() => {
    initChart();
  });
};

watch(activeTab, () => {
  updateChartData();
});

onMounted(() => {
  loadMembers();
});
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.health-metrics-container {
  font-family: 'Inter', sans-serif;
  background-color: #f4f7f6;
  min-height: 100vh;
  color: #2d3436;
}

.x-small {
  font-size: 0.75rem;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Member list styling */
.member-list::-webkit-scrollbar {
  height: 6px;
}
.member-list::-webkit-scrollbar-thumb {
  background: #dfe6e9;
  border-radius: 10px;
}
.member-list::-webkit-scrollbar-track {
  background: transparent;
}

.member-card {
  min-width: 140px;
  background: #fff;
  border: 2px solid transparent;
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.active-member {
  border-color: #4CAF50;
  background: #f0fdf4;
}

.avatar-wrapper img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border: 3px solid #fff;
}

.check-badge {
  position: absolute;
  bottom: 0;
  right: 5px;
  background: #4CAF50;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

/* Custom Input */
.custom-input {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  color: #2d3436;
}

.custom-input:focus {
  background-color: #fff;
  border-color: #4CAF50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.accent-bar {
  width: 5px;
  height: 24px;
  background: linear-gradient(to bottom, #4CAF50, #81c784);
  display: inline-block;
  border-radius: 10px;
}

.bmi-box {
  background: linear-gradient(135deg, #f8f7ff 0%, #f1efff 100%);
  border: 1px solid rgba(111, 66, 193, 0.05);
}

.text-purple {
  color: #6f42c1;
}

.btn-hover-scale:hover {
  transform: scale(1.02);
  filter: brightness(1.1);
}

.stat-card:hover {
  background-color: #fff !important;
  box-shadow: 0 8px 15px rgba(0,0,0,0.05);
}

.icon-box {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Media Queries */
@media (max-width: 768px) {
  .member-card { min-width: 120px; }
  .chart-wrapper { overflow-x: auto; }
}
</style>
