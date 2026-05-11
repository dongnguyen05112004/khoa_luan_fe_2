<template>
  <div class="cso-page">

    <div v-if="!showOnlyHistory" class="page-title-row">
      <div>
        <h1 class="page-title">Chỉ số sức khỏe</h1>
        <p class="page-sub">Báo cáo phân tích dữ liệu sinh trắc học hội viên.</p>
      </div>
      <div class="today-chip">
        <i class="fas fa-calendar-alt me-2"></i>
        Hôm nay: {{ todayStr }}
      </div>
    </div>

    <div v-if="loading" class="text-center py-5 text-muted">
      <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
      <p>Đang tải dữ liệu sức khỏe...</p>
    </div>

    <div v-else-if="!latestMetric" class="text-center py-5 text-muted">
      <i class="fas fa-folder-open fa-2x mb-3"></i>
      <p>Chưa có dữ liệu sức khỏe. Vui lòng liên hệ HLV để cập nhật.</p>
    </div>

    <div v-else>
      <!-- ===== METRIC CARDS ROW ===== -->
      <div v-if="!showOnlyHistory" class="metrics-row">

        <!-- Cân nặng -->
        <div class="metric-card">
          <div class="mc-top">
            <div class="mc-icon-wrap green">
              <i class="fas fa-weight"></i>
            </div>
            <span class="mc-delta" :class="weightDelta >= 0 ? 'up' : 'down'">
              {{ weightDelta > 0 ? '+' : '' }}{{ weightDelta }}KG
            </span>
          </div>
          <div class="mc-label">Cân nặng</div>
          <div class="mc-value">{{ latestMetric.weight }} <span class="mc-unit">kg</span></div>
          <div class="mc-hint gray">Biến động so với lần đo trước</div>
        </div>

        <!-- Chiều cao -->
        <div class="metric-card">
          <div class="mc-top">
            <div class="mc-icon-wrap blue">
              <i class="fas fa-arrows-alt-v"></i>
            </div> 
          </div>
          <div class="mc-label">Chiều cao</div>
          <div class="mc-value">{{ latestMetric.height }} <span class="mc-unit">cm</span></div>
          <div class="mc-hint gray"><i class="fas fa-sync-alt me-1"></i>Cập nhật {{ latestDate }}</div>
        </div>

        <!-- % Mỡ -->
        <div class="metric-card">
          <div class="mc-top">
            <div class="mc-icon-wrap orange">
              <i class="fas fa-percent"></i>
            </div>
            <span class="mc-delta" :class="fatDelta >= 0 ? 'up' : 'down'">
              {{ fatDelta > 0 ? '+' : '' }}{{ fatDelta }}%
            </span>
          </div>
          <div class="mc-label">% Mỡ</div>
          <div class="mc-value">{{ latestMetric.body_fat_percentage }} <span class="mc-unit">%</span></div>
          <div class="mc-hint gray">Biến động so với lần đo trước</div>
        </div>

        <!-- CƠ -->
        <div class="metric-card">
          <div class="mc-top">
            <div class="mc-icon-wrap teal">
              <i class="fas fa-dumbbell"></i>
            </div>
            <span class="mc-delta" :class="muscleDelta >= 0 ? 'up' : 'down'">
              {{ muscleDelta > 0 ? '+' : '' }}{{ muscleDelta }}
            </span>
          </div>
          <div class="mc-label">Lượng Cơ</div>
          <div class="mc-value">{{ latestMetric.muscle_mass_kg }} <span class="mc-unit">kg</span></div>
          <div class="mc-hint gray">Biến động so với lần đo trước</div>
        </div>

        <!-- BMI -->
        <div class="metric-card">
          <div class="mc-top">
            <div class="mc-icon-wrap purple">
              <i class="fas fa-shield-alt"></i>
            </div>
            <span class="mc-badge" :class="bmiStatus.class">{{ bmiStatus.label }}</span>
          </div>
          <div class="mc-label">BMI</div>
          <div class="mc-value">{{ latestMetric.bmi }}</div>
          <!-- BMI color bar -->
          <div class="bmi-bar-wrap">
            <div class="bmi-bar">
              <div class="bmi-seg blue-seg"></div>
              <div class="bmi-seg green-seg"></div>
              <div class="bmi-seg yellow-seg"></div>
              <div class="bmi-seg red-seg"></div>
              <div class="bmi-thumb" :style="{ left: bmiThumbLeft }"></div>
            </div>
          </div>
          <div class="mc-hint gray">Chỉ số lý tưởng: 18.5 – 24.9</div>
        </div>

      </div>

      <!-- ===== CHART + AI ROW ===== -->
      <div v-if="!showOnlyHistory" class="chart-ai-row">

        <!-- Chart Card -->
        <div class="chart-card">
          <div class="chart-header">
            <div>
              <div class="chart-title">Biến động Cân nặng &amp; % Mỡ</div>
              <div class="chart-sub">Phân tích xu hướng qua các lần đo</div>
            </div>
            <div class="chart-period-btns">
              <button
                v-for="p in periods"
                :key="p.key"
                class="period-btn"
                :class="{ active: activePeriod === p.key }"
                @click="activePeriod = p.key"
              >{{ p.label }}</button>
            </div>
          </div>

          <!-- Chart.js Canvas -->
          <div class="chart-canvas-wrap">
            <canvas ref="chartCanvas"></canvas>
          </div>

          <!-- Legend -->
          <div class="chart-legend">
            <span class="legend-item"><span class="leg-dot green"></span>Cân nặng (kg)</span>
            <span class="legend-item"><span class="leg-dash"></span>% Mỡ cơ thể</span>
          </div>
        </div>

          <!-- AI Panel -->
          <div class="ai-panel">
            <div class="ai-panel-title">
              <span class="ai-icon-wrap"><i class="fas fa-robot"></i></span>
              Phân tích AI
            </div>

            <div v-if="realAi" class="ai-remind-card" style="border-left-color: #6366f1;">
              <div class="ai-r-title">{{ realAi.title }}</div>
              <p class="ai-r-text mt-2 mb-0" style="color: #475569; font-weight: 500;">
                {{ realAi.ai_diagnosis }}
              </p>
            </div>

            <div v-else-if="fatDelta < 0" class="ai-highlight-card">
              <div class="ai-h-badge">Thành tích nổi bật!</div>
              <p class="ai-h-text">Bạn đã giảm <strong>{{ Math.abs(fatDelta) }}% mỡ</strong> so với lần đo trước. Tiếp tục phát huy!</p>
            </div>
            <div v-else-if="muscleDelta > 0" class="ai-highlight-card">
              <div class="ai-h-badge">Thành tích nổi bật!</div>
              <p class="ai-h-text">Bạn đã tăng <strong>{{ muscleDelta }}kg cơ</strong>. Quá trình tập luyện đang có hiệu quả!</p>
            </div>
            <div v-else class="ai-remind-card">
              <div class="ai-r-title">Lưu ý</div>
              <p class="ai-r-text">Các chỉ số của bạn có vẻ đang chững lại. Hãy xem xét thay đổi cường độ tập luyện!</p>
            </div>

            <div class="ai-remind-card">
              <div class="ai-r-title">Nhắc nhở</div>
              <p class="ai-r-text">Lần cập nhật gần nhất là {{ daysSinceLastUpdate }} ngày trước. Hãy duy trì đo InBody đều đặn.</p>
            </div>

            <router-link to="/khachhang/phan_hoi_ai" class="btn-inbody text-decoration-none text-center d-block">
              Xem toàn bộ phản hồi AI
              <i class="fas fa-arrow-right ms-2"></i>
            </router-link>

            <!-- Real AI Suggestions list -->
            <div v-if="realAi" class="mt-4">
              <div class="nutr-tag mb-2">ĐỀ XUẤT TỪ AI</div>
              <ul class="ai-tips-list m-0 p-0" style="list-style: none;">
                <li v-for="(tip, idx) in parseSuggestions(realAi.ai_suggestions)" :key="idx" class="d-flex align-items-start mb-2" style="font-size: 0.85rem; color: #475569;">
                  <i class="fas fa-check-circle text-success me-2 mt-1"></i>
                  <span>{{ tip }}</span>
                </li>
              </ul>
            </div>
            
            <div v-else class="nutrition-card mt-3">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=60&h=60&fit=crop&q=80" alt="Dinh dưỡng" class="nutr-img" />
              <div class="nutr-info">
                <div class="nutr-tag">GỢI Ý</div>
                <div class="nutr-title">{{ aiSuggestion.title }}</div>
                <div class="nutr-sub">{{ aiSuggestion.sub }}</div>
              </div>
              <button class="nutr-arrow"><i class="fas fa-chevron-right"></i></button>
            </div>

          </div>
      </div>

      <!-- ===== MEASUREMENT HISTORY ===== -->
      <div v-if="!showOnlyHealth" class="history-section">
        <div class="history-header">
          <span class="history-title">Lịch sử đo lường</span>
          <button class="btn-view-all">
            Xem tất cả bản ghi
            <i class="fas fa-external-link-alt ms-1"></i>
          </button>
        </div>

        <!-- Read-only notice -->
        <div class="readonly-notice">
          <i class="fas fa-lock me-2"></i>
          Chỉ số sức khỏe được cập nhật bởi Huấn luyện viên / Nhân viên lễ tân. Hội viên chỉ có thể xem.
        </div>

        <div class="table-wrap">
          <table class="health-table">
            <thead>
              <tr>
                <th>NGÀY ĐO</th>
                <th>CÂN NẶNG</th>
                <th>% MỠ</th>
                <th>CƠ (KG)</th>
                <th>BMI</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in history" :key="idx" :class="{ 'row-latest': idx === 0 }">
                <td class="td-date">{{ row.date }}</td>
                <td>{{ row.weight }} kg</td>
                <td>{{ row.fat }}%</td>
                <td class="td-muscle" :class="{ highlight: idx === 0 }">{{ row.muscle }}</td>
                <td>{{ row.bmi }}</td>
                <td>
                  <span class="status-chip" :class="row.statusClass">
                    {{ row.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import axios from 'axios'

export default {
  name: 'ChiSoSucKhoe',
  props: {
    showOnlyHealth: {
      type: Boolean,
      default: false
    },
    showOnlyHistory: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()

    return {
      loading: true,
      todayStr: `${dd}/${mm}/${yyyy}`,
      activePeriod: 'all',
      periods: [
        { key: 'week',    label: '7 Ngày' },
        { key: 'month',   label: '30 Ngày' },
        { key: 'all',     label: 'Tất cả' },
      ],
      chartData: {
        week: { labels: [], weight: [], fat: [] },
        month: { labels: [], weight: [], fat: [] },
        all: { labels: [], weight: [], fat: [] }
      },
      chartInstance: null,
      history: [],
      latestMetric: null,
      previousMetric: null,
      realAi: null,
    }
  },
  computed: {
    bmiValue() {
      return this.latestMetric ? parseFloat(this.latestMetric.bmi) : 0;
    },
    weightDelta() {
      if (!this.latestMetric || !this.previousMetric) return 0;
      return (this.latestMetric.weight - this.previousMetric.weight).toFixed(1);
    },
    fatDelta() {
      if (!this.latestMetric || !this.previousMetric) return 0;
      return (this.latestMetric.body_fat_percentage - this.previousMetric.body_fat_percentage).toFixed(1);
    },
    muscleDelta() {
      if (!this.latestMetric || !this.previousMetric) return 0;
      return (this.latestMetric.muscle_mass_kg - this.previousMetric.muscle_mass_kg).toFixed(1);
    },
    bmiStatus() {
       const bmi = this.bmiValue;
       if (bmi < 18.5) return { label: 'THIẾU CÂN', class: 'underweight blue' };
       if (bmi < 25) return { label: 'BÌNH THƯỜNG', class: 'normal green' };
       if (bmi < 30) return { label: 'THỪA CÂN', class: 'overweight yellow' };
       return { label: 'BÉO PHÌ', class: 'obese red' };
    },
    latestDate() {
       if (!this.latestMetric) return '';
       const d = new Date(this.latestMetric.record_date);
       return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    },
    daysSinceLastUpdate() {
       if (!this.latestMetric) return 0;
       const d = new Date(this.latestMetric.record_date);
       const today = new Date();
       const diffTime = Math.abs(today - d);
       return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    },
    aiSuggestion() {
      if (this.bmiValue >= 25) {
        return { title: 'Thực đơn giảm mỡ', sub: 'Tăng cường protein, cắt giảm carb' };
      } else if (this.bmiValue < 18.5) {
        return { title: 'Thực đơn tăng cân', sub: 'Bổ sung calo dồi dào, sinh tố protein' };
      }
      return { title: 'Thực đơn duy trì', sub: 'Cân bằng các nhóm chất dinh dưỡng' };
    },
    currentData() {
      return this.chartData[this.activePeriod]
    },
    bmiThumbLeft() {
      // BMI range: 10 to 35 maps to 0% - 100%
      const pct = Math.min(Math.max(((this.bmiValue - 10) / 25) * 100, 0), 100)
      return `calc(${pct}% - 6px)`
    },
  },
  async mounted() {
    await this.fetchHealthMetrics();
  },
  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  },
  watch: {
    activePeriod() {
      this.updateChart()
    }
  },
  methods: {
    async fetchHealthMetrics() {
      this.loading = true;
      try {
        // 1. Lấy thông tin user (Profile) để lấy user_id và AI
        const profileRes = await axios.get('/api/customer/profile');
        const userData = profileRes.data.data || profileRes.data;
        if (userData && userData.ai_recommendations && userData.ai_recommendations.length > 0) {
            this.realAi = userData.ai_recommendations[0];
        }

        const userId = userData.id;

        // 2. Lấy Health Metrics cho riêng user này
        const response = await axios.get(`/api/health-metrics?user_id=${userId}`);
        let data = response.data.data || response.data;
        
        if (data && data.length > 0) {
          // Sort data by record_date descending (newest first)
          data.sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
          
          this.history = data.map((item, idx) => ({
            date: this.formatDate(item.record_date),
            weight: item.weight,
            fat: item.body_fat_percentage,
            muscle: item.muscle_mass_kg,
            bmi: item.bmi,
            status: idx === 0 ? 'MỚI NHẤT' : 'ĐÃ LƯU',
            statusClass: idx === 0 ? 'chip-new' : 'chip-saved'
          }));

          this.latestMetric = data[0];
          this.previousMetric = data.length > 1 ? data[1] : data[0];

          this.processChartData(data);
          
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu sức khỏe:", error);
      } finally {
        this.loading = false;
        
        if (this.history && this.history.length > 0 && !this.showOnlyHistory) {
          this.$nextTick(() => {
            this.initChart();
          });
        }
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    },
    processChartData(data) {
      // For chart, we need oldest to newest (ascending)
      const ascendingData = [...data].reverse();
      
      const labels = ascendingData.map(item => this.formatDate(item.record_date));
      const weight = ascendingData.map(item => item.weight);
      const fat = ascendingData.map(item => item.body_fat_percentage);
      
      this.chartData.all = { labels, weight, fat };
      this.chartData.month = { 
        labels: labels.slice(-5), 
        weight: weight.slice(-5), 
        fat: fat.slice(-5) 
      };
      this.chartData.week = { 
        labels: labels.slice(-2), 
        weight: weight.slice(-2), 
        fat: fat.slice(-2) 
      };
    },
    initChart() {
      if (!this.$refs.chartCanvas) return;
      const ctx = this.$refs.chartCanvas.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 240)
      gradient.addColorStop(0, 'rgba(34, 197, 94, 0.18)')
      gradient.addColorStop(1, 'rgba(34, 197, 94, 0.01)')

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: this.getChartDataFormat(gradient),
        options: this.getChartOptions()
      })
    },
    updateChart() {
      if (this.chartInstance && this.$refs.chartCanvas) {
        const ctx = this.$refs.chartCanvas.getContext('2d')
        const gradient = ctx.createLinearGradient(0, 0, 0, 240)
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.18)')
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.01)')

        this.chartInstance.data = this.getChartDataFormat(gradient)
        this.chartInstance.update()
      }
    },
    getChartDataFormat(gradient) {
      return {
        labels: this.currentData.labels,
        datasets: [
          {
            label: 'Cân nặng (kg)',
            data: this.currentData.weight,
            borderColor: '#22c55e',
            backgroundColor: gradient,
            borderWidth: 2.5,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#22c55e',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: '% Mỡ cơ thể',
            data: this.currentData.fat,
            borderColor: '#94a3b8',
            borderWidth: 2,
            borderDash: [5, 4],
            fill: false,
            tension: 0.4,
            pointBackgroundColor: '#94a3b8',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 3.5,
            pointHoverRadius: 5,
            yAxisID: 'y1'
          }
        ]
      }
    },
    getChartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1e293b',
            bodyColor: '#475569',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            boxPadding: 4,
            usePointStyle: true,
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 11,
                weight: 'bold'
              }
            },
            border: {
              display: false
            }
          },
          y: {
            display: true,
            position: 'left',
            grid: {
              color: '#f1f5f9',
              drawBorder: false,
            },
            border: {
              display: false,
              dash: [4, 4]
            },
            ticks: {
              display: false
            }
          },
          y1: {
            display: false,
            position: 'right'
          }
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        }
      }
    },
    parseSuggestions(text) {
      if (!text) return [];
      return text.split('\n')
                 .map(s => s.replace(/^- /, '').replace(/^\* /, '').trim())
                 .filter(s => s.length > 0);
    }
  },
}
</script>

<style scoped>
/* ── Root ── */
.cso-page {
  font-family: 'Segoe UI', sans-serif;
  max-width: 980px;
  margin: 0 auto;
  padding-bottom: 48px;
}

/* ── Title Row ── */
.page-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.page-title { font-size: 1.8rem; font-weight: 800; color: #1e293b; margin: 0; }
.page-sub   { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }
.today-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 8px 18px;
  font-size: 0.83rem;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
}

/* ── METRIC CARDS ── */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
@media (max-width: 860px) { .metrics-row { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 560px) { .metrics-row { grid-template-columns: 1fr 1fr; } }

.metric-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 16px 14px;
  box-shadow: 0 1px 12px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.metric-card:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }

.mc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.mc-icon-wrap {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
}
.mc-icon-wrap.green  { background: #f0fdf4; color: #22c55e; }
.mc-icon-wrap.blue   { background: #eff6ff; color: #3b82f6; }
.mc-icon-wrap.orange { background: #fff7ed; color: #f97316; }
.mc-icon-wrap.teal   { background: #f0fdfa; color: #14b8a6; }
.mc-icon-wrap.purple { background: #faf5ff; color: #a855f7; }

.mc-delta {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
}
.mc-delta.up   { background: #dcfce7; color: #16a34a; }
.mc-delta.down { background: #fef2f2; color: #ef4444; }

.mc-badge {
  font-size: 0.63rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}
.mc-badge.stable { background: #eff6ff; color: #2563eb; }
.mc-badge.normal { background: #f0fdf4; color: #15803d; }
.mc-badge.blue { background: #eff6ff; color: #3b82f6; }
.mc-badge.green { background: #f0fdf4; color: #15803d; }
.mc-badge.yellow { background: #fef9c3; color: #ca8a04; }
.mc-badge.red { background: #fef2f2; color: #dc2626; }

.mc-label { font-size: 0.72rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.02em; text-transform: uppercase; }
.mc-value { font-size: 1.55rem; font-weight: 800; color: #1e293b; line-height: 1.15; }
.mc-unit  { font-size: 0.85rem; font-weight: 500; color: #94a3b8; }

.mc-hint       { font-size: 0.72rem; line-height: 1.4; }
.mc-hint.red   { color: #ef4444; }
.mc-hint.green { color: #22c55e; }
.mc-hint.gray  { color: #94a3b8; }

/* BMI bar */
.bmi-bar-wrap { padding: 4px 0 2px; }
.bmi-bar {
  display: flex;
  height: 6px;
  border-radius: 6px;
  overflow: visible;
  position: relative;
  gap: 2px;
}
.bmi-seg { flex: 1; height: 6px; border-radius: 3px; }
.blue-seg   { background: #60a5fa; }
.green-seg  { background: #4ade80; }
.yellow-seg { background: #facc15; }
.red-seg    { background: #f87171; }
.bmi-thumb {
  position: absolute;
  top: -3px;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #1e293b;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #1e293b;
  transition: left 0.4s ease;
}

/* ── CHART + AI ROW ── */
.chart-ai-row {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  margin-bottom: 28px;
}
@media (max-width: 780px) { .chart-ai-row { grid-template-columns: 1fr; } }

/* Chart Card */
.chart-card {
  background: #fff;
  border-radius: 18px;
  padding: 24px 24px 16px;
  box-shadow: 0 1px 16px rgba(0,0,0,0.07);
}
.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.chart-title { font-size: 1rem; font-weight: 700; color: #1e293b; }
.chart-sub   { font-size: 0.77rem; color: #94a3b8; margin-top: 2px; }

.chart-period-btns { display: flex; gap: 4px; }
.period-btn {
  background: none;
  border: 1px solid transparent;
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}
.period-btn.active {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}
.period-btn:hover:not(.active) { background: #f8fafc; color: #475569; }

/* Chart.js Canvas */
.chart-canvas-wrap {
  position: relative;
  width: 100%;
  height: 240px;
}
.chart-legend {
  display: flex;
  gap: 20px;
  padding-top: 14px;
  font-size: 0.78rem;
  color: #64748b;
}
.legend-item { display: flex; align-items: center; gap: 8px; }
.leg-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
}
.leg-dot.green { background: #22c55e; }
.leg-dash {
  width: 20px; height: 2px;
  background: repeating-linear-gradient(90deg, #94a3b8 0, #94a3b8 5px, transparent 5px, transparent 9px);
}

/* ── AI PANEL ── */
.ai-panel {
  background: #fff;
  border-radius: 18px;
  padding: 20px 18px;
  box-shadow: 0 1px 16px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.ai-panel-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}
.ai-icon-wrap {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 0.88rem;
  flex-shrink: 0;
}

/* AI cards */
.ai-highlight-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #22c55e;
  border-radius: 10px;
  padding: 12px 14px;
}
.ai-h-badge {
  font-size: 0.72rem;
  font-weight: 700;
  color: #15803d;
  margin-bottom: 5px;
}
.ai-h-text { font-size: 0.8rem; color: #166534; margin: 0; line-height: 1.5; }

.ai-remind-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
}
.ai-r-title { font-size: 0.78rem; font-weight: 700; color: #1e293b; margin-bottom: 4px; }
.ai-r-text  { font-size: 0.78rem; color: #64748b; margin: 0; line-height: 1.5; }

.btn-inbody {
  background: #1e293b;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 11px 16px;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; justify-content: space-between;
  transition: background 0.2s, transform 0.15s;
}
.btn-inbody:hover { background: #2d7a3a; transform: translateY(-1px); }

/* Nutrition card */
.nutrition-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f0fdf4;
  border-radius: 12px;
  padding: 12px 14px;
  cursor: pointer;
}
.nutr-img {
  width: 44px; height: 44px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}
.nutr-info { flex: 1; }
.nutr-tag  { font-size: 0.6rem; font-weight: 700; color: #2d7a3a; letter-spacing: 0.08em; margin-bottom: 2px; }
.nutr-title{ font-size: 0.83rem; font-weight: 700; color: #1e293b; }
.nutr-sub  { font-size: 0.72rem; color: #64748b; }
.nutr-arrow {
  background: #fff;
  border: none;
  width: 28px; height: 28px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #2d7a3a; font-size: 0.78rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  cursor: pointer;
  flex-shrink: 0;
}

/* ── HISTORY TABLE ── */
.history-section {
  background: #fff;
  border-radius: 18px;
  padding: 24px 24px 8px;
  box-shadow: 0 1px 16px rgba(0,0,0,0.07);
}
.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.history-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
}
.btn-view-all {
  background: none;
  border: none;
  color: #2d7a3a;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; gap: 4px;
}
.btn-view-all:hover { text-decoration: underline; }

/* Read-only notice */
.readonly-notice {
  display: flex;
  align-items: center;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 0.8rem;
  color: #92400e;
  font-weight: 500;
  margin-bottom: 18px;
}

/* Table */
.table-wrap { overflow-x: auto; }
.health-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.87rem;
}
.health-table thead tr {
  border-bottom: 2px solid #f1f5f9;
}
.health-table th {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: #94a3b8;
  padding: 0 16px 12px;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
.health-table td {
  padding: 16px 16px;
  color: #334155;
  border-bottom: 1px solid #f8fafc;
  font-weight: 500;
}
.health-table .row-latest td { background: #f0fdf4; }
.td-date { font-weight: 700; color: #1e293b; }
.td-muscle.highlight { color: #2d7a3a; font-weight: 700; }

/* Status chips */
.status-chip {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}
.chip-new   { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
.chip-saved { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; }
</style>

