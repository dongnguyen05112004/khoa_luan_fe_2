<template>
  <div class="progress-page">

    <!-- ===== HEADER ===== -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Theo dõi Tiến trình</h1>
        <p class="page-sub">Phân tích xu hướng thể trạng & thành tích tập luyện của bạn</p>
      </div>
      <div class="period-btns">
        <button v-for="p in periods" :key="p.key" class="period-btn"
          :class="{ active: activePeriod === p.key }" @click="changePeriod(p.key)">
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- ===== LOADING ===== -->
    <div v-if="loading" class="loading-wrap">
      <i class="fas fa-spinner fa-spin fa-2x"></i>
      <p>Đang tải dữ liệu tiến trình...</p>
    </div>

    <template v-else>
      <!-- ===== ROW 1: CHART + AI ===== -->
      <div class="main-row">

        <!-- Chart Card -->
        <div class="chart-card">
          <div class="chart-card-header">
            <div>
              <div class="chart-card-title">Body Composition Trends</div>
              <div class="chart-card-sub">Biến động Cân nặng, % Mỡ & Cơ bắp theo thời gian</div>
            </div>
            <div class="chart-legend">
              <span class="leg-item"><span class="leg-dot" style="background:#22c55e"></span>Cân nặng</span>
              <span class="leg-item"><span class="leg-dot" style="background:#f97316"></span>% Mỡ</span>
              <span class="leg-item"><span class="leg-dot" style="background:#06b6d4"></span>Cơ bắp</span>
            </div>
          </div>
          <div class="chart-wrap">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div v-if="!hasChartData" class="no-data-msg">
            <i class="fas fa-chart-line"></i>
            <p>Chưa có dữ liệu đo lường. Vui lòng liên hệ HLV để cập nhật.</p>
          </div>
        </div>

        <!-- Right Panel -->
        <div class="right-panel">

          <!-- AI Card -->
          <div class="ai-card" v-if="aiRec">
            <div class="ai-card-badge"><i class="fas fa-robot me-1"></i>AI RECOMMENDATION</div>
            <div class="ai-card-title">{{ aiRec.title }}</div>
            <p class="ai-card-body">{{ aiRec.ai_diagnosis }}</p>
            <router-link to="/khachhang/phan_hoi_ai" class="ai-card-link">
              Xem kế hoạch chi tiết <i class="fas fa-arrow-right ms-1"></i>
            </router-link>
          </div>
          <div class="ai-card ai-card-empty" v-else>
            <div class="ai-card-badge"><i class="fas fa-robot me-1"></i>AI RECOMMENDATION</div>
            <p class="text-muted small mt-2">Chưa có phân tích AI. Hãy vào trang <router-link to="/khachhang/phan_hoi_ai">Phản hồi AI</router-link> để tạo.</p>
          </div>

          <!-- Monthly Wins -->
          <div class="wins-card">
            <div class="wins-title">{{ periodLabel.toUpperCase() }} WINS</div>

            <div class="win-row">
              <div class="win-icon-wrap red"><i class="fas fa-fire"></i></div>
              <div class="win-info">
                <div class="win-label">Giảm Mỡ</div>
                <div class="win-value" :class="deltas.fat_delta < 0 ? 'green' : 'red'">
                  {{ deltas.fat_delta > 0 ? '+' : '' }}{{ deltas.fat_delta }}kg
                </div>
              </div>
              <span class="win-badge" :class="deltas.fat_delta < 0 ? 'badge-green' : 'badge-gray'">
                {{ deltas.fat_delta < 0 ? 'TOP 5%' : 'N/A' }}
              </span>
            </div>

            <div class="win-row">
              <div class="win-icon-wrap teal"><i class="fas fa-dumbbell"></i></div>
              <div class="win-info">
                <div class="win-label">Tăng Cơ</div>
                <div class="win-value" :class="deltas.muscle_delta > 0 ? 'green' : 'red'">
                  {{ deltas.muscle_delta > 0 ? '+' : '' }}{{ deltas.muscle_delta }}kg
                </div>
              </div>
              <span class="win-badge" :class="deltas.muscle_delta > 0 ? 'badge-gold' : 'badge-gray'">
                {{ deltas.muscle_delta > 0 ? 'ELITE' : 'N/A' }}
              </span>
            </div>

            <div class="win-row">
              <div class="win-icon-wrap blue"><i class="fas fa-weight"></i></div>
              <div class="win-info">
                <div class="win-label">Cân nặng</div>
                <div class="win-value" :class="deltas.weight_delta < 0 ? 'green' : 'red'">
                  {{ deltas.weight_delta > 0 ? '+' : '' }}{{ deltas.weight_delta }}kg
                </div>
              </div>
              <span class="win-badge badge-blue">HEALTHY</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ===== ROW 2: STAT CARDS ===== -->
      <div class="stat-row">

        <div class="stat-card">
          <div class="stat-label">BASAL METABOLIC RATE</div>
          <div class="stat-value">{{ stats.bmr ? stats.bmr.toLocaleString() : '--' }} <span class="stat-unit">kcal</span></div>
          <div class="stat-bar"><div class="stat-bar-fill green" style="width:70%"></div></div>
        </div>

        <div class="stat-card">
          <div class="stat-label">CHỈ SỐ BMI</div>
          <div class="stat-value">{{ latestMetric ? latestMetric.bmi : '--' }}</div>
          <div class="stat-sub">{{ latestMetric ? latestMetric.bmi_label : '—' }}</div>
          <div class="stat-bar"><div class="stat-bar-fill blue" :style="{ width: bmiBarWidth }"></div></div>
        </div>

        <div class="stat-card">
          <div class="stat-label">SỐ BUỔI TẬP</div>
          <div class="stat-value">{{ stats.checkin_count ?? '--' }} <span class="stat-unit">buổi</span></div>
          <div class="stat-sub">{{ periodLabel }}</div>
          <div class="stat-bar"><div class="stat-bar-fill teal" :style="{ width: checkinBarWidth }"></div></div>
        </div>

        <div class="stat-card">
          <div class="stat-label">BODY AGE SCORE</div>
          <div class="stat-value">{{ stats.body_age ?? '--' }} <span class="stat-unit">yrs</span></div>
          <div class="stat-sub">{{ stats.plan_name }}</div>
          <div class="stat-bar"><div class="stat-bar-fill purple" style="width:55%"></div></div>
        </div>

      </div>

      <!-- ===== ROW 3: CHECKIN ACTIVITY ===== -->
      <div class="activity-card">
        <div class="activity-header">
          <div class="activity-title"><i class="fas fa-calendar-check me-2 text-success"></i>Hoạt động Check-in</div>
          <div class="activity-sub">{{ stats.checkin_count }} buổi · Trung bình {{ stats.avg_duration_min }} phút/buổi · Tổng {{ stats.total_workout_hrs }} giờ</div>
        </div>
        <div v-if="Object.keys(checkinByWeek).length" class="checkin-bars">
          <div v-for="(count, week) in checkinByWeek" :key="week" class="checkin-bar-col">
            <div class="checkin-bar-wrap">
              <div class="checkin-bar-fill" :style="{ height: barHeight(count) + '%' }" :title="`${count} buổi`"></div>
            </div>
            <div class="checkin-bar-label">{{ week }}</div>
            <div class="checkin-bar-count">{{ count }}</div>
          </div>
        </div>
        <div v-else class="no-data-msg small">
          <i class="fas fa-calendar-times"></i>
          <p>Chưa có buổi check-in nào trong khoảng thời gian này.</p>
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js/auto'

export default {
  name: 'GiamSatMucTieu',
  data() {
    return {
      loading: true,
      activePeriod: 'monthly',
      periods: [
        { key: 'weekly',    label: 'Weekly' },
        { key: 'monthly',   label: 'Monthly' },
        { key: 'quarterly', label: 'Quarterly' },
      ],
      chartInstance: null,
      chartData: [],
      latestMetric: null,
      deltas: { fat_delta: 0, muscle_delta: 0, weight_delta: 0 },
      stats: { bmr: null, body_age: null, bmi: null, bmi_label: null, checkin_count: 0, avg_duration_min: 0, total_workout_hrs: 0, days_left: 0, plan_name: '' },
      aiRec: null,
      checkinByWeek: {},
    }
  },
  computed: {
    hasChartData() { return this.chartData.length > 0 },
    periodLabel() {
      return { weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly' }[this.activePeriod] || 'Monthly'
    },
    bmiBarWidth() {
      if (!this.latestMetric?.bmi) return '0%'
      const pct = Math.min(Math.max(((this.latestMetric.bmi - 10) / 25) * 100, 5), 100)
      return pct + '%'
    },
    checkinBarWidth() {
      const max = this.activePeriod === 'weekly' ? 7 : this.activePeriod === 'quarterly' ? 36 : 12
      const pct = Math.min(((this.stats.checkin_count || 0) / max) * 100, 100)
      return pct + '%'
    },
  },
  async mounted() {
    await this.fetchProgress()
  },
  beforeUnmount() {
    if (this.chartInstance) this.chartInstance.destroy()
  },
  methods: {
    async changePeriod(p) {
      this.activePeriod = p
      await this.fetchProgress()
    },
    async fetchProgress() {
      this.loading = true
      try {
        const res = await axios.get(`/api/customer/progress?period=${this.activePeriod}`)
        const d = res.data.data
        this.chartData    = d.chart_data      || []
        this.latestMetric = d.latest_metric   || null
        this.deltas       = d.deltas          || { fat_delta: 0, muscle_delta: 0, weight_delta: 0 }
        this.stats        = d.stats           || {}
        this.aiRec        = d.ai_recommendation || null
        this.checkinByWeek= d.checkin_by_week || {}
      } catch (e) {
        console.error('Lỗi lấy dữ liệu tiến trình:', e)
      } finally {
        this.loading = false
        // Phải đợi loading = false trước để Vue render <template v-else> (chứa canvas) vào DOM
        this.$nextTick(() => this.renderChart())
      }
    },
    renderChart() {
      if (!this.$refs.chartCanvas) return
      if (this.chartInstance) { this.chartInstance.destroy(); this.chartInstance = null }
      if (!this.chartData.length) return

      const labels = this.chartData.map(d => d.date)
      const weight = this.chartData.map(d => d.weight)
      const fat    = this.chartData.map(d => d.fat)
      const muscle = this.chartData.map(d => d.muscle)

      const ctx = this.$refs.chartCanvas.getContext('2d')
      const gWeight = ctx.createLinearGradient(0, 0, 0, 220)
      gWeight.addColorStop(0, 'rgba(34,197,94,0.18)')
      gWeight.addColorStop(1, 'rgba(34,197,94,0.01)')

      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Cân nặng (kg)', data: weight,
              borderColor: '#22c55e', backgroundColor: gWeight,
              borderWidth: 2.5, fill: true, tension: 0.45,
              pointBackgroundColor: '#22c55e', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 4, pointHoverRadius: 6,
              yAxisID: 'y'
            },
            {
              label: '% Mỡ', data: fat,
              borderColor: '#f97316', backgroundColor: 'transparent',
              borderWidth: 2, borderDash: [5, 4], fill: false, tension: 0.45,
              pointBackgroundColor: '#f97316', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 3.5,
              yAxisID: 'y1'
            },
            {
              label: 'Cơ (kg)', data: muscle,
              borderColor: '#06b6d4', backgroundColor: 'transparent',
              borderWidth: 2, fill: false, tension: 0.45,
              pointBackgroundColor: '#06b6d4', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 3.5,
              yAxisID: 'y'
            },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              mode: 'index', intersect: false,
              backgroundColor: 'rgba(255,255,255,0.96)',
              titleColor: '#1e293b', bodyColor: '#475569',
              borderColor: '#e2e8f0', borderWidth: 1, padding: 10,
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } }, border: { display: false } },
            y:  { display: true,  position: 'left',  grid: { color: '#f1f5f9' }, ticks: { display: false }, border: { display: false } },
            y1: { display: false, position: 'right' }
          },
          interaction: { mode: 'nearest', axis: 'x', intersect: false }
        }
      })
    },
    barHeight(count) {
      const max = Math.max(...Object.values(this.checkinByWeek), 1)
      return Math.max((count / max) * 100, 8)
    },
  }
}
</script>

<style scoped>
.progress-page {
  font-family: 'Segoe UI', sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 48px;
}

/* ── Header ── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
}
.page-title { font-size: 1.9rem; font-weight: 800; color: #1e293b; margin: 0; }
.page-sub   { font-size: 0.85rem; color: #64748b; margin: 4px 0 0; }

.period-btns { display: flex; gap: 6px; }
.period-btn {
  background: none; border: 1px solid #e2e8f0; border-radius: 24px;
  padding: 7px 20px; font-size: 0.84rem; font-weight: 600;
  color: #64748b; cursor: pointer; transition: all 0.2s;
}
.period-btn.active { background: #2d7a3a; border-color: #2d7a3a; color: #fff; }
.period-btn:hover:not(.active) { border-color: #2d7a3a; color: #2d7a3a; }

/* ── Loading ── */
.loading-wrap {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px; padding: 80px 0;
  color: #94a3b8; font-size: 0.9rem;
}

/* ── Main Row ── */
.main-row {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  margin-bottom: 20px;
}
@media (max-width: 800px) { .main-row { grid-template-columns: 1fr; } }

/* Chart Card */
.chart-card {
  background: #fff; border-radius: 18px;
  padding: 24px 24px 16px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
}
.chart-card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  flex-wrap: wrap; gap: 10px; margin-bottom: 18px;
}
.chart-card-title { font-size: 1rem; font-weight: 700; color: #1e293b; }
.chart-card-sub   { font-size: 0.76rem; color: #94a3b8; margin-top: 2px; }
.chart-legend { display: flex; gap: 14px; flex-wrap: wrap; }
.leg-item { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #64748b; }
.leg-dot  { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.chart-wrap { position: relative; height: 240px; }

/* Right Panel */
.right-panel { display: flex; flex-direction: column; gap: 16px; }

/* AI Card */
.ai-card {
  background: #fff; border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
  border-left: 3px solid #6366f1;
}
.ai-card-badge {
  font-size: 0.62rem; font-weight: 700; letter-spacing: 0.09em;
  color: #6366f1; text-transform: uppercase; margin-bottom: 8px;
}
.ai-card-title { font-size: 1rem; font-weight: 800; color: #1e293b; margin-bottom: 8px; }
.ai-card-body  { font-size: 0.8rem; color: #475569; line-height: 1.55; margin: 0 0 12px; }
.ai-card-link  {
  font-size: 0.8rem; font-weight: 700; color: #2d7a3a;
  text-decoration: none; display: inline-block;
}
.ai-card-link:hover { text-decoration: underline; }
.ai-card-empty { border-left-color: #e2e8f0; }

/* Monthly Wins */
.wins-card {
  background: #fff; border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
}
.wins-title {
  font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em;
  color: #94a3b8; margin-bottom: 14px;
}
.win-row {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 0; border-bottom: 1px solid #f8fafc;
}
.win-row:last-child { border-bottom: none; }
.win-icon-wrap {
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 0.85rem;
}
.win-icon-wrap.red  { background: #fff0f0; color: #ef4444; }
.win-icon-wrap.teal { background: #f0fdfa; color: #14b8a6; }
.win-icon-wrap.blue { background: #eff6ff; color: #3b82f6; }
.win-info { flex: 1; }
.win-label { font-size: 0.74rem; color: #94a3b8; font-weight: 600; }
.win-value { font-size: 1.1rem; font-weight: 800; }
.win-value.green { color: #16a34a; }
.win-value.red   { color: #ef4444; }
.win-badge {
  font-size: 0.6rem; font-weight: 800; padding: 3px 8px;
  border-radius: 20px; letter-spacing: 0.05em;
}
.badge-green { background: #dcfce7; color: #15803d; }
.badge-gold  { background: #fef3c7; color: #b45309; }
.badge-blue  { background: #dbeafe; color: #1d4ed8; }
.badge-gray  { background: #f1f5f9; color: #94a3b8; }

/* ── Stat Row ── */
.stat-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
@media (max-width: 700px) { .stat-row { grid-template-columns: 1fr 1fr; } }
@media (max-width: 400px) { .stat-row { grid-template-columns: 1fr; } }

.stat-card {
  background: #fff; border-radius: 16px;
  padding: 18px 20px;
  box-shadow: 0 2px 14px rgba(0,0,0,0.07);
}
.stat-label {
  font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em;
  color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;
}
.stat-value {
  font-size: 1.7rem; font-weight: 800; color: #1e293b;
  line-height: 1.15; margin-bottom: 4px;
}
.stat-unit { font-size: 0.9rem; font-weight: 500; color: #94a3b8; }
.stat-sub  { font-size: 0.72rem; color: #64748b; margin-bottom: 10px; }
.stat-bar  { height: 4px; background: #f1f5f9; border-radius: 4px; overflow: hidden; margin-top: 10px; }
.stat-bar-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
.stat-bar-fill.green  { background: #22c55e; }
.stat-bar-fill.blue   { background: #3b82f6; }
.stat-bar-fill.teal   { background: #14b8a6; }
.stat-bar-fill.purple { background: #a855f7; }

/* ── Activity Card ── */
.activity-card {
  background: #fff; border-radius: 18px;
  padding: 22px 24px;
  box-shadow: 0 2px 20px rgba(0,0,0,0.07);
}
.activity-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.activity-title  { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
.activity-sub    { font-size: 0.78rem; color: #64748b; }

.checkin-bars {
  display: flex; gap: 10px; align-items: flex-end;
  min-height: 90px;
}
.checkin-bar-col {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; gap: 4px;
}
.checkin-bar-wrap {
  width: 100%; height: 80px; background: #f8fafc;
  border-radius: 8px; display: flex; align-items: flex-end; overflow: hidden;
}
.checkin-bar-fill {
  width: 100%; background: linear-gradient(180deg, #22c55e, #16a34a);
  border-radius: 8px 8px 0 0; transition: height 0.5s ease;
  min-height: 6px;
}
.checkin-bar-label { font-size: 0.65rem; color: #94a3b8; font-weight: 600; }
.checkin-bar-count { font-size: 0.72rem; font-weight: 700; color: #1e293b; }

/* ── No data ── */
.no-data-msg {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 8px;
  padding: 40px 0; color: #94a3b8; font-size: 0.85rem;
}
.no-data-msg i { font-size: 1.8rem; }
.no-data-msg p { margin: 0; }
</style>
