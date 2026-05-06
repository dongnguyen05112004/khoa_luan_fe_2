<template>
  <div class="ai-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Gợi ý lộ trình tập luyện bằng AI</h1>
      <div class="header-right">
        <span class="header-date"><i class="fas fa-calendar"></i> Hôm nay, 24 Tháng 5, 2024</span>
        <div class="header-search"><i class="fas fa-search"></i><input type="text" placeholder="Tìm kiếm..." /></div>
        <button class="btn-bell"><i class="fas fa-bell"></i></button>
      </div>
    </div>

    <!-- Quick Switch Members -->
    <div class="member-switch-bar">
      <div class="switch-label">
        <span class="switch-title">CHUYỂN NHANH HỘI VIÊN</span>
        <span class="switch-sub">PT phụ trách: 5 hội viên</span>
      </div>
      <div class="member-tabs">
        <div
          v-for="m in members"
          :key="m.id"
          class="member-tab"
          :class="{ active: selectedMember && selectedMember.id === m.id }"
          @click="selectMember(m)"
        >
          <img :src="m.avatar" :alt="m.name" class="tab-avatar" />
          <div class="tab-info" v-if="selectedMember && selectedMember.id === m.id">
            <div class="tab-name">{{ m.name }}</div>
            <div class="tab-code">{{ m.code }}</div>
          </div>
          <div class="tab-info" v-else>
            <div class="tab-name-sm">{{ m.shortName }}</div>
            <div class="tab-code">{{ m.code }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Member Info Card -->
    <div class="member-info-card" v-if="selectedMember">
      <div class="member-info-left">
        <div class="member-avatar-wrap">
          <img :src="selectedMember.avatar" :alt="selectedMember.name" class="member-big-avatar" />
        </div>
        <div class="member-detail">
          <div class="member-name-row">
            <span class="member-name">{{ selectedMember.name }} - {{ selectedMember.code }}</span>
            <span class="badge-active">ACTIVE</span>
          </div>
          <div class="member-meta">
            <span><i class="fas fa-bullseye"></i> Mục tiêu gốc: <b>{{ selectedMember.goal }}</b></span>
            <span><i class="fas fa-calendar-alt"></i> Ngày tạo lộ trình: <b>24/05/2024</b></span>
            <span><i class="fas fa-signal"></i> LEVEL: <b>{{ selectedMember.level }}</b></span>
          </div>
        </div>
      </div>
      <button class="btn-history"><i class="fas fa-history"></i> Xem lịch sử</button>
    </div>

    <!-- Main Body -->
    <div class="main-body" v-if="selectedMember">
      <!-- Left Column -->
      <div class="left-col">
        <!-- Workout Frequency -->
        <div class="stat-card freq-card">
          <div class="freq-label"><i class="fas fa-calendar-check"></i> TẦN SUẤT TẬP THỰC TẾ (30 NGÀY QUA)</div>
          <div class="freq-value">18 buổi</div>
        </div>

        <!-- Current Stats -->
        <div class="stat-card">
          <div class="section-title-sm">Chỉ số hiện tại</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">Cân nặng</div>
              <div class="stat-val">72.5 <span class="stat-unit">kg</span></div>
              <div class="stat-change positive">+0.8kg</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">BMI</div>
              <div class="stat-val">22.9</div>
              <div class="stat-change normal">BÌNH THƯỜNG</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Tỷ lệ mỡ</div>
              <div class="stat-val">24.2 <span class="stat-unit">%</span></div>
              <div class="stat-change warn">HƠI CAO</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Chiều cao</div>
              <div class="stat-val">178 <span class="stat-unit">cm</span></div>
              <div class="stat-change neutral">—</div>
            </div>
          </div>
          <!-- Muscle mass highlight -->
          <div class="muscle-box">
            <div class="muscle-label"><i class="fas fa-running"></i> KHỐI LƯỢNG CƠ BẮP</div>
            <div class="muscle-val">34.8 <span class="muscle-unit">kg</span></div>
            <div class="muscle-trend"><i class="fas fa-arrow-up"></i> Tăng 1.2kg (30 ngày)</div>
          </div>
        </div>

        <!-- Nutrition -->
        <div class="stat-card nutrition-card">
          <div class="nutrition-header">
            <i class="fas fa-utensils"></i>
            <span>Dinh dưỡng để xuất</span>
          </div>
          <div class="nutrition-cal">2200 <span class="nut-unit">kcal/ngày</span></div>
          <div class="nut-bar">
            <div class="nut-seg dam" style="width:40%"></div>
            <div class="nut-seg tinh" style="width:35%"></div>
            <div class="nut-seg beo" style="width:25%"></div>
          </div>
          <div class="nut-legend">
            <span class="nut-dot dam"></span> ĐẠM 40%
            <span class="nut-dot tinh"></span> TINH BỘT 35%
            <span class="nut-dot beo"></span> BÉO 25%
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-col">
        <!-- AI Analysis -->
        <div class="stat-card ai-card">
          <div class="ai-card-header">
            <div class="ai-icon-wrap"><i class="fas fa-brain"></i></div>
            <div>
              <div class="ai-title">Phân tích thể trạng AI</div>
              <div class="ai-model">AI MODEL V4.2 OPTIMIZER</div>
            </div>
            <div class="ai-recommend-badge">
              <div class="arb-label">TẦN SUẤT KHUYẾN NGHỊ</div>
              <div class="arb-val">4 buổi/tuần</div>
            </div>
          </div>
          <div class="ai-quote">
            "Cơ thể đang ở trạng thái <span class="highlight-text">Skinny Fat</span>, mặc dù chỉ số BMI ở
            mức bình thường nhưng tỷ lệ mỡ nội tạng cao. Cần tập trung vào việc giảm mỡ song song với việc kích
            thích tăng trưởng khối lượng cơ bắp thông qua các bài tập kháng lực cường độ trung bình."
          </div>
          <div class="strategy-row">
            <div class="strategy-col">
              <div class="strategy-title">CHIẾN LƯỢC ƯU TIÊN</div>
              <div class="strategy-item good"><i class="fas fa-check-circle"></i> Tăng mật độ cơ (Hypertrophy)</div>
              <div class="strategy-item good"><i class="fas fa-check-circle"></i> Kiểm soát Insulin qua dinh dưỡng</div>
            </div>
            <div class="strategy-col">
              <div class="strategy-title">CẦN HẠN CHẾ</div>
              <div class="strategy-item bad"><i class="fas fa-times-circle"></i> Cardio cường độ quá cao (>60p)</div>
              <div class="strategy-item bad"><i class="fas fa-times-circle"></i> Cắt giảm Calo quá đột ngột</div>
            </div>
          </div>
        </div>

        <!-- 12-Week Plan -->
        <div class="stat-card plan-card">
          <div class="plan-header">
            <div>
              <div class="plan-title">Lộ trình 12 tuần để xuất</div>
              <div class="plan-sub">Cá nhân hóa theo mục tiêu tăng cơ giảm mỡ</div>
            </div>
            <a href="#" class="plan-detail-link">Xem chi tiết <i class="fas fa-arrow-right"></i></a>
          </div>
          <div class="plan-phases">
            <div class="phase-card ph1">
              <div class="phase-badge">TUẦN 1-4</div>
              <div class="phase-name">Thích nghi</div>
              <div class="phase-desc">Xây dựng nền tảng thể lực và kích hoạt hệ trao đổi chất.</div>
            </div>
            <div class="phase-card ph2">
              <div class="phase-badge">TUẦN 5-8</div>
              <div class="phase-name">Tăng cơ</div>
              <div class="phase-desc">Tăng cường độ tập để tối ưu hóa phì đại cơ bắp.</div>
            </div>
            <div class="phase-card ph3">
              <div class="phase-badge">TUẦN 9-12</div>
              <div class="phase-name">Định hình</div>
              <div class="phase-desc">Giảm tỷ lệ mỡ toàn thể để làm rõ các khối cơ.</div>
            </div>
          </div>
        </div>

        <!-- Activate Footer -->
        <div class="activate-footer">
          <div class="activate-info">
            <i class="fas fa-paper-plane"></i>
            <span>Xác nhận để áp dụng lộ trình này vào lịch tập của hội viên.</span>
          </div>
          <button class="btn-activate" @click="activatePlan">
            <i class="fas fa-bolt"></i> KÍCH HOẠT LỘ TRÌNH
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoiYAIPT',
  data() {
    return {
      members: [
        { id: 1, name: 'Nguyễn Minh Anh', shortName: 'Lê Văn C', code: 'HV2045', goal: 'Giảm cân & Tăng cơ', level: 'INTERMEDIATE', avatar: 'https://ui-avatars.com/api/?name=Nguyen+Minh+Anh&background=2d7a3a&color=fff&bold=true&size=48' },
        { id: 2, name: 'Lê Văn C', shortName: 'Lê Văn C', code: 'HV1092', goal: 'Tăng cơ', level: 'BEGINNER', avatar: 'https://ui-avatars.com/api/?name=Le+Van+C&background=6366f1&color=fff&bold=true&size=48' },
        { id: 3, name: 'Trần Thị B', shortName: 'Trần Thị B', code: 'HV1301', goal: 'Giảm cân', level: 'BEGINNER', avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+B&background=ec4899&color=fff&bold=true&size=48' },
        { id: 4, name: 'Phạm Văn D', shortName: 'Phạm Văn D', code: 'HVA221', goal: 'Tăng cơ', level: 'ADVANCED', avatar: 'https://ui-avatars.com/api/?name=Pham+Van+D&background=f59e0b&color=fff&bold=true&size=48' },
        { id: 5, name: 'Hoàng Thu E', shortName: 'Hoàng Thu E', code: 'HV2091', goal: 'Định hình', level: 'INTERMEDIATE', avatar: 'https://ui-avatars.com/api/?name=Hoang+Thu+E&background=14b8a6&color=fff&bold=true&size=48' },
      ],
      selectedMember: null,
    }
  },
  mounted() {
    this.selectedMember = this.members[0]
  },
  methods: {
    selectMember(m) { this.selectedMember = m },
    activatePlan() { alert('Đã kích hoạt lộ trình cho ' + this.selectedMember.name) },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
* { box-sizing: border-box; }
.ai-page { font-family: 'Inter', 'Segoe UI', sans-serif; min-height: 100vh; }

/* Header */
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.page-title { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
.header-right { display: flex; align-items: center; gap: 12px; }
.header-date { font-size: 0.8rem; color: #64748b; display: flex; align-items: center; gap: 6px; }
.header-search { display: flex; align-items: center; gap: 7px; background: #fff; border: 1px solid #e2e8f0; border-radius: 9px; padding: 7px 13px; }
.header-search i { color: #94a3b8; font-size: 0.8rem; }
.header-search input { border: none; outline: none; font-size: 0.8rem; color: #475569; width: 130px; background: transparent; }
.btn-bell { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e2e8f0; background: #fff; color: #64748b; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

/* Member Switch Bar */
.member-switch-bar { background: #fff; border-radius: 14px; padding: 14px 18px; margin-bottom: 14px; display: flex; align-items: center; gap: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.switch-label { flex-shrink: 0; }
.switch-title { font-size: 0.7rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; display: block; margin-bottom: 2px; }
.switch-sub { font-size: 0.7rem; color: #cbd5e1; }
.member-tabs { display: flex; gap: 8px; flex-wrap: wrap; }
.member-tab { display: flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; background: #f8fafc; cursor: pointer; transition: all 0.2s; }
.member-tab:hover { border-color: #2d7a3a; background: #f0faf2; }
.member-tab.active { border-color: #2d7a3a; background: #f0faf2; }
.tab-avatar { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
.tab-name { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
.tab-name-sm { font-size: 0.8rem; font-weight: 600; color: #1e293b; }
.tab-code { font-size: 0.68rem; color: #94a3b8; }
.tab-info { display: flex; flex-direction: column; }

/* Member Info Card */
.member-info-card { background: #fff; border-radius: 14px; padding: 16px 20px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.member-info-left { display: flex; align-items: center; gap: 14px; }
.member-big-avatar { width: 48px; height: 48px; border-radius: 50%; border: 2px solid #c6e9cf; object-fit: cover; }
.member-name-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
.member-name { font-size: 1rem; font-weight: 700; color: #0f172a; }
.badge-active { font-size: 0.65rem; font-weight: 700; background: #dcfce7; color: #16a34a; border-radius: 6px; padding: 2px 8px; }
.member-meta { display: flex; align-items: center; gap: 16px; font-size: 0.77rem; color: #64748b; }
.member-meta b { color: #334155; }
.member-meta i { color: #2d7a3a; margin-right: 3px; }
.btn-history { display: flex; align-items: center; gap: 7px; padding: 9px 16px; background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 0.8rem; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
.btn-history:hover { background: #f0faf2; border-color: #2d7a3a; color: #2d7a3a; }

/* Main Body */
.main-body { display: grid; grid-template-columns: 320px 1fr; gap: 16px; align-items: start; }
.left-col { display: flex; flex-direction: column; gap: 14px; }
.right-col { display: flex; flex-direction: column; gap: 14px; }

/* Stat Cards */
.stat-card { background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

/* Freq Card */
.freq-card { border-left: 4px solid #2d7a3a; }
.freq-label { font-size: 0.68rem; font-weight: 600; color: #94a3b8; letter-spacing: 0.4px; margin-bottom: 6px; display: flex; align-items: center; gap: 7px; }
.freq-label i { color: #2d7a3a; }
.freq-value { font-size: 1.6rem; font-weight: 800; color: #0f172a; }

/* Section Title */
.section-title-sm { font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }

/* Stats Grid */
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.stat-item { padding: 10px 12px; background: #f8fafc; border-radius: 10px; }
.stat-label { font-size: 0.68rem; color: #94a3b8; font-weight: 500; margin-bottom: 3px; }
.stat-val { font-size: 1.1rem; font-weight: 700; color: #0f172a; }
.stat-unit { font-size: 0.72rem; color: #94a3b8; font-weight: 400; }
.stat-change { font-size: 0.68rem; font-weight: 600; margin-top: 2px; }
.stat-change.positive { color: #16a34a; }
.stat-change.normal { color: #2d7a3a; }
.stat-change.warn { color: #dc2626; }
.stat-change.neutral { color: #94a3b8; }

/* Muscle Box */
.muscle-box { background: linear-gradient(135deg, #1c5e2e, #2d7a3a); border-radius: 12px; padding: 14px 16px; color: #fff; position: relative; overflow: hidden; }
.muscle-box::after { content: '✦'; position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 2.5rem; opacity: 0.08; }
.muscle-label { font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.7); letter-spacing: 0.5px; margin-bottom: 4px; }
.muscle-val { font-size: 1.6rem; font-weight: 800; color: #fff; }
.muscle-unit { font-size: 0.8rem; font-weight: 400; }
.muscle-trend { font-size: 0.72rem; color: #86efac; margin-top: 3px; }
.muscle-trend i { margin-right: 3px; }

/* Nutrition */
.nutrition-header { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 700; color: #334155; margin-bottom: 8px; }
.nutrition-header i { color: #a855f7; }
.nutrition-cal { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
.nut-unit { font-size: 0.78rem; color: #94a3b8; font-weight: 400; }
.nut-bar { display: flex; border-radius: 6px; overflow: hidden; height: 8px; margin-bottom: 8px; }
.nut-seg.dam { background: #2d7a3a; }
.nut-seg.tinh { background: #8b5cf6; }
.nut-seg.beo { background: #f59e0b; }
.nut-legend { display: flex; gap: 10px; font-size: 0.67rem; color: #64748b; font-weight: 600; align-items: center; flex-wrap: wrap; }
.nut-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 3px; }
.nut-dot.dam { background: #2d7a3a; }
.nut-dot.tinh { background: #8b5cf6; }
.nut-dot.beo { background: #f59e0b; }

/* AI Card */
.ai-card-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }
.ai-icon-wrap { width: 44px; height: 44px; background: linear-gradient(135deg, #8b5cf6, #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.1rem; flex-shrink: 0; }
.ai-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; }
.ai-model { font-size: 0.68rem; color: #94a3b8; margin-top: 2px; }
.ai-recommend-badge { margin-left: auto; background: #fdf4ff; border: 1.5px solid #e9d5ff; border-radius: 10px; padding: 8px 12px; text-align: right; }
.arb-label { font-size: 0.63rem; font-weight: 700; color: #9333ea; letter-spacing: 0.4px; }
.arb-val { font-size: 0.92rem; font-weight: 800; color: #7c3aed; }
.ai-quote { background: #f8fafc; border-left: 3px solid #6366f1; border-radius: 0 10px 10px 0; padding: 13px 15px; font-size: 0.82rem; color: #334155; line-height: 1.65; margin-bottom: 16px; }
.highlight-text { color: #f59e0b; font-weight: 700; }
.strategy-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.strategy-title { font-size: 0.67rem; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 8px; }
.strategy-item { font-size: 0.78rem; font-weight: 500; display: flex; align-items: flex-start; gap: 7px; margin-bottom: 5px; }
.strategy-item.good { color: #15803d; }
.strategy-item.good i { color: #22c55e; margin-top: 1px; flex-shrink: 0; }
.strategy-item.bad { color: #dc2626; }
.strategy-item.bad i { color: #ef4444; margin-top: 1px; flex-shrink: 0; }

/* Plan Card */
.plan-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.plan-title { font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
.plan-sub { font-size: 0.73rem; color: #94a3b8; }
.plan-detail-link { font-size: 0.78rem; font-weight: 600; color: #2d7a3a; text-decoration: none; display: flex; align-items: center; gap: 5px; white-space: nowrap; }
.plan-detail-link:hover { text-decoration: underline; }
.plan-phases { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.phase-card { border-radius: 12px; padding: 13px 14px; }
.ph1 { background: #eff6ff; border-top: 3px solid #3b82f6; }
.ph2 { background: #faf5ff; border-top: 3px solid #8b5cf6; }
.ph3 { background: #fff7ed; border-top: 3px solid #f97316; }
.phase-badge { font-size: 0.63rem; font-weight: 700; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px; }
.ph1 .phase-badge { color: #3b82f6; }
.ph2 .phase-badge { color: #8b5cf6; }
.ph3 .phase-badge { color: #f97316; }
.phase-name { font-size: 0.9rem; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
.phase-desc { font-size: 0.72rem; color: #64748b; line-height: 1.5; }

/* Activate Footer */
.activate-footer { background: #fff; border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.activate-info { display: flex; align-items: center; gap: 12px; font-size: 0.82rem; color: #64748b; }
.activate-info i { font-size: 1.4rem; color: #94a3b8; }
.btn-activate { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: none; border-radius: 12px; color: #fff; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s; letter-spacing: 0.4px; box-shadow: 0 4px 15px rgba(99,102,241,0.35); }
.btn-activate:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
.btn-activate:active { transform: translateY(0); }
</style>
