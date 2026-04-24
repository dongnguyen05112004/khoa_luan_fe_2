import os
import re

src_dir = r"c:\xampp\htdocs\khoaluan_fe_2\src\components\khachhang"
hoso_path = os.path.join(src_dir, "hosocanhan.vue")
chiso_path = os.path.join(src_dir, "chisosuckhoe.vue")

with open(chiso_path, "r", encoding="utf-8") as f:
    chiso_content = f.read()

with open(hoso_path, "r", encoding="utf-8") as f:
    hoso_content = f.read()

# 1. Extract templates from chisosuckhoe.vue
metrics_row_match = re.search(r'(<!-- ===== METRIC CARDS ROW ===== -->.*?)<!-- ===== MEASUREMENT HISTORY ===== -->', chiso_content, re.DOTALL)
metrics_row = metrics_row_match.group(1) if metrics_row_match else ""

history_section_match = re.search(r'(<div class="history-section">.*?)</div>\s*</div>\s*</div>\s*</template>', chiso_content, re.DOTALL)
history_section = history_section_match.group(1) if history_section_match else ""

# 2. Extract logic from chisosuckhoe.vue
computed_match = re.search(r'computed:\s*\{(.*?)\},\s*async mounted', chiso_content, re.DOTALL)
computed_code = computed_match.group(1) if computed_match else ""

methods_match = re.search(r'methods:\s*\{(.*)\}\s*\}', chiso_content, re.DOTALL)
methods_code = methods_match.group(1) if methods_match else ""
methods_code = re.sub(r'async fetchHealthMetrics\(\) \{.*?\},', '', methods_code, flags=re.DOTALL) # remove fetchHealthMetrics

style_match = re.search(r'<style scoped>(.*?)</style>', chiso_content, re.DOTALL)
style_code = style_match.group(1) if style_match else ""

# 3. Update hosocanhan.vue
hoso_content = hoso_content.replace("{ key: 'history', label: 'Lịch sử tập luyện' }", "{ key: 'history', label: 'Lịch sử đo lường' }")
hoso_content = hoso_content.replace("<!-- ===== TAB: LỊCH SỬ TẬP LUYỆN ===== -->", "<!-- ===== TAB: LỊCH SỬ ĐO LƯỜNG ===== -->")

health_tab_old = '''    <!-- ===== TAB: CHỈ SỐ SỨC KHỎE ===== -->
    <div v-if="activeTab === 'health'" class="tab-content">
      <div class="empty-tab">
        <i class="fas fa-heartbeat empty-icon"></i>
        <p>Dữ liệu chỉ số sức khỏe đang được cập nhật...</p>
      </div>
    </div>'''

health_tab_new = f'''    <!-- ===== TAB: CHỈ SỐ SỨC KHỎE ===== -->
    <div v-if="activeTab === 'health'" class="tab-content">
      <div v-if="loading" class="text-center py-5 text-muted">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <p>Đang tải dữ liệu sức khỏe...</p>
      </div>
      <div v-else-if="!latestMetric" class="text-center py-5 text-muted">
        <i class="fas fa-folder-open fa-2x mb-3"></i>
        <p>Chưa có dữ liệu sức khỏe. Vui lòng liên hệ HLV để cập nhật.</p>
      </div>
      <div v-else>
{metrics_row}
      </div>
    </div>'''
hoso_content = hoso_content.replace(health_tab_old, health_tab_new)

history_tab_old = '''    <!-- ===== TAB: LỊCH SỬ ĐO LƯỜNG ===== -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div class="empty-tab">
        <i class="fas fa-dumbbell empty-icon"></i>
        <p>Chưa có lịch sử tập luyện nào.</p>
      </div>
    </div>'''

history_tab_new = f'''    <!-- ===== TAB: LỊCH SỬ ĐO LƯỜNG ===== -->
    <div v-if="activeTab === 'history'" class="tab-content">
      <div v-if="loading" class="text-center py-5 text-muted">
        <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
        <p>Đang tải dữ liệu...</p>
      </div>
      <div v-else-if="history.length === 0" class="empty-tab">
        <i class="fas fa-folder-open empty-icon"></i>
        <p>Chưa có dữ liệu lịch sử đo lường.</p>
      </div>
      <div v-else>
{history_section}
      </div>
    </div>'''
hoso_content = hoso_content.replace(history_tab_old, history_tab_new)

# Add imports
hoso_content = hoso_content.replace("import axios from 'axios'", "import axios from 'axios'\nimport Chart from 'chart.js/auto'")

# Add data vars
data_vars = '''      activePeriod: 'all',
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
'''
hoso_content = hoso_content.replace("loading: true", data_vars + "      loading: true")

# Add computed properties
if "computed: {" not in hoso_content:
    hoso_content = hoso_content.replace("  async mounted() {", f"  computed: {{{computed_code}}},\n  async mounted() {{")
else:
    print("Computed already exists, handle manually")

# Add watch
watch_code = '''  watch: {
    activePeriod() {
      this.updateChart()
    },
    activeTab(newTab) {
      if (newTab === 'health') {
        this.(() => {
          if (!this.chartInstance && this.history.length > 0) {
            this.initChart();
          }
        });
      }
    }
  },'''
hoso_content = hoso_content.replace("  async mounted() {", watch_code + "\n  async mounted() {")

# Add beforeUnmount
unmount_code = '''  beforeUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy()
    }
  },'''
hoso_content = hoso_content.replace("  methods: {", unmount_code + "\n  methods: {")

# Inject fetch logic inside fetchProfile
history_mapping = '''
        if (metrics.length > 0) {
          // Store raw history
          let rawHistory = [...metrics].sort((a, b) => new Date(b.record_date) - new Date(a.record_date));
          this.history = rawHistory.map((item, idx) => ({
            date: this.formatDate(item.record_date),
            weight: item.weight,
            fat: item.body_fat_percentage,
            muscle: item.muscle_mass_kg,
            bmi: item.bmi,
            status: idx === 0 ? 'MỚI NHẤT' : 'ĐÃ LƯU',
            statusClass: idx === 0 ? 'chip-new' : 'chip-saved'
          }));

          this.latestMetric = rawHistory[0];
          this.previousMetric = rawHistory.length > 1 ? rawHistory[1] : rawHistory[0];

          this.processChartData(rawHistory);
        }
'''
hoso_content = re.sub(r'// Map biometrics.*?(?=\} catch)', history_mapping, hoso_content, flags=re.DOTALL)

# Add methods
hoso_content = hoso_content.replace("  methods: {", "  methods: {\n" + methods_code)

# Remove the title from metrics_row logic
hoso_content = hoso_content.replace("this.fetchHealthMetrics();", "")

# Append styles
hoso_content = hoso_content.replace("</style>", style_code + "\n</style>")

with open(hoso_path, "w", encoding="utf-8") as f:
    f.write(hoso_content)

print("Patch applied successfully")
