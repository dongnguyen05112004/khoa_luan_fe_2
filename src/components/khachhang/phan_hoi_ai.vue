<template>
  <div class="ai-page">
    <div class="page-header d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="page-title">Phản hồi từ Kinetic AI</h2>
        <p class="text-muted mb-0">Xem lại các chẩn đoán và lời khuyên từ huấn luyện viên AI của bạn.</p>
      </div>
      <button class="btn-generate" @click="generateAI" :disabled="generating">
        <i class="fas fa-magic" :class="{'fa-spin': generating}"></i>
        {{ generating ? 'Đang phân tích...' : 'Tạo phân tích mới' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-5 text-muted">
      <i class="fas fa-spinner fa-spin fa-2x mb-3"></i>
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="recommendations.length === 0" class="empty-state">
      <div class="empty-icon"><i class="fas fa-robot"></i></div>
      <h4>Chưa có phản hồi AI nào</h4>
      <p class="text-muted">Bấm nút "Tạo phân tích mới" để nhận lời khuyên từ AI dựa trên chỉ số sức khỏe của bạn.</p>
    </div>

    <div v-else class="ai-timeline">
      <div v-for="rec in recommendations" :key="rec.id" class="ai-card">
        <div class="ai-card-header">
          <div class="ai-date"><i class="far fa-clock me-2"></i>{{ formatDate(rec.created_at) }}</div>
          <span class="badge bg-primary-subtle text-primary">{{ rec.recommendation_type || 'Health & Fitness' }}</span>
        </div>
        <div class="ai-card-body">
          <h4 class="ai-title">{{ rec.title }}</h4>
          <div class="ai-diagnosis">
            <strong><i class="fas fa-stethoscope me-2"></i>Chẩn đoán:</strong>
            <p>{{ rec.ai_diagnosis }}</p>
          </div>
          <div class="ai-suggestions mt-3">
            <strong><i class="fas fa-lightbulb text-warning me-2"></i>Lời khuyên & Đề xuất:</strong>
            <ul>
              <li v-for="(tip, idx) in parseSuggestions(rec.ai_suggestions)" :key="idx">
                <i class="fas fa-check text-success me-2"></i><span>{{ tip }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="pagination-wrap mt-4" v-if="totalPages > 1">
        <button class="btn-page" :disabled="currentPage === 1" @click="fetchData(currentPage - 1)">Trang trước</button>
        <span class="mx-3">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button class="btn-page" :disabled="currentPage === totalPages" @click="fetchData(currentPage + 1)">Trang sau</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PhanHoiAi',
  data() {
    return {
      recommendations: [],
      loading: true,
      generating: false,
      currentPage: 1,
      totalPages: 1,
      userId: null
    }
  },
  async mounted() {
    try {
      const userRes = await axios.get('/api/customer/profile');
      this.userId = userRes.data.data.id;
      await this.fetchData();
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  },
  methods: {
    async fetchData(page = 1) {
      this.loading = true;
      try {
        const res = await axios.get(`/api/ai-recommendations?user_id=${this.userId}&page=${page}`);
        this.recommendations = res.data.data;
        this.currentPage = res.data.current_page;
        this.totalPages = res.data.last_page;
      } catch (e) {
        console.error("Lỗi khi tải danh sách AI", e);
      } finally {
        this.loading = false;
      }
    },
    async generateAI() {
      this.generating = true;
      try {
        await axios.post('/api/ai-recommendations/generate');
        await this.fetchData(1);
      } catch (e) {
        console.error("Lỗi khi tạo AI", e);
        const msg = e.response?.data?.error || e.response?.data?.message || 'Vui lòng kiểm tra lại thiết lập backend.';
        alert('Có lỗi khi tạo AI: ' + msg);
      } finally {
        this.generating = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },
    parseSuggestions(text) {
      if (!text) return [];
      return text.split('\n')
                 .map(s => s.replace(/^- /, '').replace(/^\* /, '').trim())
                 .filter(s => s.length > 0);
    }
  }
}
</script>

<style scoped>
.ai-page { max-width: 900px; margin: 0 auto; font-family: 'Segoe UI', sans-serif; padding-bottom: 50px; }
.page-title { font-weight: 800; color: #1e293b; font-size: 1.8rem;}
.btn-generate {
  background: linear-gradient(135deg, #2d7a3a, #22c55e);
  color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 600;
  display: flex; align-items: center; gap: 8px; transition: 0.2s;
  box-shadow: 0 4px 12px rgba(34,197,94,0.25);
}
.btn-generate:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(34,197,94,0.35); }
.btn-generate:disabled { opacity: 0.7; cursor: not-allowed; box-shadow: none; }

.empty-state { text-align: center; padding: 80px 20px; background: #fff; border-radius: 16px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); border: 1px dashed #cbd5e1;}
.empty-icon { font-size: 4rem; color: #e2e8f0; margin-bottom: 20px; }

.ai-timeline { display: flex; flex-direction: column; gap: 20px; }
.ai-card {
  background: #fff; border-radius: 16px; padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;
  transition: transform 0.2s, box-shadow 0.2s;
}
.ai-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }

.ai-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f8fafc; padding-bottom: 12px;}
.ai-date { font-weight: 600; color: #64748b; font-size: 0.9rem; }
.ai-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 16px;}

.ai-diagnosis {
  background: #f8fafc; padding: 16px; border-radius: 12px; border-left: 4px solid #6366f1;
}
.ai-diagnosis p { margin: 8px 0 0 0; color: #475569; line-height: 1.6; }

.ai-suggestions ul { list-style: none; padding: 0; margin-top: 12px; display: flex; flex-direction: column; gap: 10px; }
.ai-suggestions li { color: #334155; line-height: 1.5; display: flex; align-items: flex-start; }
.ai-suggestions li i { margin-top: 4px; flex-shrink: 0; }

.pagination-wrap { display: flex; justify-content: center; align-items: center; }
.btn-page { background: #fff; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.2s; font-weight: 600; color: #475569;}
.btn-page:hover:not(:disabled) { background: #f1f5f9; color: #1e293b; }
.btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
