<template>
  <div class="pt-schedule-page">
    <!-- Header -->
    <header class="ps-header">
      <h1 class="ps-title">Quản Lý Lịch Tập</h1>
      <div class="ps-actions">
        <button class="btn-outline" @click="openAddModal"><i class="far fa-calendar-check"></i> Đặt lịch</button>
        <button class="btn-icon"><i class="far fa-bell"></i><span class="dot"></span></button>
        <div class="ps-profile" v-if="myProfile">
          <img :src="myProfile.avatar" alt="Avatar" class="ps-avatar" />
          <div class="ps-profile-info">
            <div class="ps-name">{{ myProfile.name }}</div>
            <div class="ps-role">Huấn luyện viên</div>
          </div>
        </div>
      </div>
    </header>

    <div class="ps-main">
      <!-- Left Column: Calendar Grid -->
      <div class="ps-calendar-col">
        <div class="psc-header">
          <div class="psc-title">Lịch tập<br/>Tuần</div>
          <div class="psc-legend">
            <span class="legend-item"><span class="box done"></span> Hoàn thành</span>
            <span class="legend-item"><span class="box booked"></span> Đã đặt lịch</span>
            <span class="legend-item"><span class="box cancelled"></span> Đã hủy</span>
          </div>
          <div class="psc-nav">
            <button class="btn-nav" @click="goToday">Hôm nay</button>
            <button class="btn-nav icon" @click="prevWeek"><i class="fas fa-chevron-left"></i></button>
            <button class="btn-nav icon" @click="nextWeek"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="psc-grid-wrapper">
          <div class="psc-grid">
            <!-- Header Row -->
            <div class="psc-row psc-header-row">
              <div class="psc-cell time-col"></div>
              <div class="psc-cell day-head" v-for="d in weekDays" :key="d.dateStr" :class="{today: d.isToday}">
                {{ d.shortDay }}
                <div class="day-num">{{ d.num }}</div>
              </div>
            </div>

            <!-- Time Rows -->
            <div class="psc-row" v-for="h in hours" :key="h">
              <div class="psc-cell time-col">{{ formatHour(h) }}</div>
              <div class="psc-cell day-cell" v-for="d in weekDays" :key="d.dateStr" @click="openModalForCell(d.dateStr, h)">
                <template v-for="s in getSessions(d.dateStr, h)" :key="s.id">
                  <div class="session-block" :class="[s.status, {active: activeSession && activeSession.id === s.id}]" @click.stop="selectSession(s)">
                    {{ formatName(s.memberName) }}
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Detail Panel -->
      <div class="ps-detail-col">
        <h2 class="psd-title">Thông tin Chi tiết Buổi tập</h2>
        <div class="psd-content" v-if="activeSession">
          <div class="psd-user">
            <img :src="activeMemberData.avatar" alt="Avatar" class="psd-avatar" />
            <div class="psd-user-info">
              <div class="psd-name">{{ activeMemberData.name }}</div>
              <div class="psd-goal">Goal: {{ activeMemberData.goal }}</div>
            </div>
          </div>

          <div class="psd-contract-info">
            <div class="psd-line"><strong>Hợp đồng:</strong> PT {{ activeMemberData.total }} buổi</div>
            <div class="psd-line mt"><strong>Số buổi còn lại:</strong> <span class="big-num">{{ activeMemberData.remaining }}</span> / {{ activeMemberData.total }}</div>
            <div class="psd-progress">
              <div class="psd-progress-bar" :style="{width: ((activeMemberData.total - activeMemberData.remaining)/activeMemberData.total*100) + '%'}"></div>
            </div>
          </div>

          <div class="psd-status-sec">
            <label>Trạng thái</label>
            <select v-model="activeSession.status" class="status-select" @change="updateSessionStatus">
              <option value="confirmed">Đã đặt lịch</option>
              <option value="done">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <button v-if="activeSession.status !== 'done' && activeSession.status !== 'cancelled'" class="btn-complete" @click="markAsDone">
            Xác nhận HOÀN THÀNH ✨<br/><small>(Trừ 01 buổi)</small>
          </button>
        </div>
        <div class="psd-empty" v-else>
          Chọn một buổi tập trên lịch để xem chi tiết
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal-overlay" v-if="showModal" @click.self="showModal=false">
      <div class="modal-box">
        <div class="modal-head">
          <h3>Tạo Lịch mới</h3>
          <button class="btn-close" @click="showModal=false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Hội viên</label>
            <div class="select-wrapper">
              <i class="fas fa-search search-icon"></i>
              <select v-model="form.contractId" class="form-control with-icon">
                <option value="" disabled>Tìm kiếm hội viên...</option>
                <option v-for="m in members" :key="m.contractId" :value="m.contractId">{{ m.name }}</option>
              </select>
            </div>
          </div>
          
          <div class="contract-card" v-if="selectedFormMember">
            <div class="cc-title">Hợp đồng PT #{{ selectedFormMember.contractId }}</div>
            <div class="cc-text">Số buổi còn lại: <strong>{{ selectedFormMember.remaining }} / {{ selectedFormMember.total }}</strong></div>
          </div>

          <div class="form-group">
            <label>Đặt làm</label>
            <div class="datetime-row">
              <input type="date" v-model="form.date" class="form-control" @change="checkConflict" />
              <input type="time" v-model="form.time" class="form-control" @change="checkConflict" />
            </div>
          </div>

          <div class="conflict-warn" v-if="conflictMsg">
            <i class="fas fa-exclamation-triangle"></i> {{ conflictMsg }}
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn-confirm" :disabled="!form.contractId || !form.date || !form.time" @click="saveBooking">Xác nhận Đặt lịch</button>
          <button class="btn-danger" @click="showModal=false">Đóng</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
const COLORS = ['#2d7a3a','#1a7de2','#ec4899','#f59e0b','#9333ea','#0891b2']

function authHeaders() {
  const token = localStorage.getItem('token')
  return { headers: { Authorization: `Bearer ${token}` } }
}

export default {
  name: 'PtSessionScheduling',
  data() {
    return {
      currentDate: new Date(),
      hours: Array.from({length: 17}, (_,i) => i + 6), // 6 AM to 10 PM
      myProfile: null,
      myTrainerId: null,
      members: [],
      sessions: [],
      activeSession: null,
      showModal: false,
      form: { contractId: '', date: '', time: '' },
      conflictMsg: ''
    }
  },
  computed: {
    weekDays() {
      const now = new Date(this.currentDate)
      const day = now.getDay()
      const diff = now.getDate() - day + (day === 0 ? -6 : 1)
      const mon = new Date(now.setDate(diff))
      const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
      
      const realToday = new Date()
      
      return Array.from({length:7}, (_,i) => {
        const d = new Date(mon)
        d.setDate(mon.getDate() + i)
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        const isToday = d.toDateString() === realToday.toDateString()
        return { shortDay: labels[i], num: d.getDate(), dateStr: ds, isToday }
      })
    },
    activeMemberData() {
      if(!this.activeSession) return null
      return this.members.find(m => m.id === this.activeSession.memberId)
    },
    selectedFormMember() {
      if(!this.form.contractId) return null
      return this.members.find(m => m.contractId === this.form.contractId)
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const meRes = await axios.get(`${API}/me`, authHeaders())
        this.myProfile = {
          name: meRes.data.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(meRes.data.name)}&background=0f172a&color=fff`
        }

        const trRes = await axios.get(`${API}/trainers`, authHeaders())
        const trainers = Array.isArray(trRes.data) ? trRes.data : (trRes.data?.data || [])
        const myTrainer = trainers.find(t => t.user_id == meRes.data.id)
        if (!myTrainer) return
        this.myTrainerId = myTrainer.id

        const cRes = await axios.get(`${API}/pt-contracts?trainer_id=${this.myTrainerId}&per_page=100`, authHeaders())
        const contracts = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || [])
        this.members = contracts.map((c, idx) => ({
          id: c.user?.id,
          contractId: c.id,
          name: c.user?.name || 'Hội viên',
          goal: c.user?.member_profile?.health_notes || 'Giảm cân',
          remaining: (c.total_sessions||0) - (c.used_sessions||0),
          total: c.total_sessions || 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name||'HV')}&background=${COLORS[idx%COLORS.length].replace('#','')}&color=fff`,
        }))

        this.loadBookings()
      } catch (e) {
        console.error(e)
      }
    },
    async loadBookings() {
      if (!this.myTrainerId) return
      try {
        const res = await axios.get(`${API}/pt-bookings?trainer_id=${this.myTrainerId}`, authHeaders())
        const raw = res.data?.data || res.data || []
        this.sessions = raw.map(b => {
          let ds = '';
          let hr = 0;
          if (b.schedule_time) {
            const parts = b.schedule_time.split(/[-T :.Z]/);
            ds = `${parts[0]}-${parts[1]}-${parts[2]}`;
            hr = parseInt(parts[3], 10);
          }
          return {
            id: b.id,
            memberId: b.contract?.user?.id || b.contract?.user_id,
            memberName: b.contract?.user?.name || 'HV',
            dateStr: ds,
            hour: hr,
            status: b.status === 'pending' ? 'confirmed' : b.status // map pending to booked in ui
          }
        })
      } catch(e) {}
    },
    formatHour(h) {
      if(h === 12) return '12 PM'
      return h > 12 ? `${h-12} PM` : `${h} AM`
    },
    formatName(name) {
      if (!name) return 'HV'
      const parts = name.split(' ')
      if (parts.length > 1 && !isNaN(parts[parts.length-1])) {
        // if name ends with a number (like Hội viên 107), show HV + number
        return `HV ${parts[parts.length-1]}`
      }
      return parts[parts.length-1]
    },
    getSessions(dateStr, hour) {
      return this.sessions.filter(s => s.dateStr === dateStr && s.hour === hour)
    },
    selectSession(s) {
      this.activeSession = s
    },
    goToday() { this.currentDate = new Date() },
    prevWeek() {
      const d = new Date(this.currentDate)
      d.setDate(d.getDate() - 7)
      this.currentDate = d
    },
    nextWeek() {
      const d = new Date(this.currentDate)
      d.setDate(d.getDate() + 7)
      this.currentDate = d
    },
    openAddModal() {
      this.form = { contractId: '', date: '', time: '' }
      this.conflictMsg = ''
      this.showModal = true
    },
    openModalForCell(dateStr, hour) {
      this.form = { 
        contractId: '', 
        date: dateStr, 
        time: `${String(hour).padStart(2,'0')}:00` 
      }
      this.conflictMsg = ''
      this.showModal = true
    },
    checkConflict() {
      if(!this.form.date || !this.form.time) return
      const h = parseInt(this.form.time.split(':')[0])
      const existing = this.getSessions(this.form.date, h)
      if(existing.length > 0) {
        this.conflictMsg = `Trùng lịch: ${existing[0].memberName} có buổi tập lúc này!`
      } else {
        this.conflictMsg = ''
      }
    },
    async saveBooking() {
      if(!this.form.contractId || !this.form.date || !this.form.time) return
      const scheduleTime = `${this.form.date} ${this.form.time}:00`
      try {
        await axios.post(`${API}/pt-bookings`, {
          contract_id: this.form.contractId,
          trainer_id: this.myTrainerId,
          schedule_time: scheduleTime,
          status: 'confirmed'
        }, authHeaders())
        alert('Đặt lịch thành công!')
        this.showModal = false
        this.loadBookings()
      } catch(e) {
        alert(e.response?.data?.message || 'Đã có lỗi xảy ra khi đặt lịch!')
        console.error(e)
      }
    },
    async updateSessionStatus() {
      if(!this.activeSession) return
      try {
        await axios.put(`${API}/pt-bookings/${this.activeSession.id}`, {
          status: this.activeSession.status
        }, authHeaders())
        this.loadBookings()
      } catch(e) {}
    },
    async markAsDone() {
      if(!this.activeSession) return
      try {
        await axios.put(`${API}/pt-bookings/${this.activeSession.id}`, { status: 'done' }, authHeaders())
        this.activeSession.status = 'done'
        this.loadBookings()
        
        // update member's local state for remaining count
        const member = this.members.find(m => m.id === this.activeSession.memberId)
        if(member && member.remaining > 0) {
          member.remaining -= 1
        }
      } catch(e) {}
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.pt-schedule-page {
  font-family: 'Inter', sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  color: #1e293b;
  margin: -24px;
}

/* Header */
.ps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  border-bottom: 1px solid #e2e8f0;
}
.ps-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1a5c28; /* dark green from mockup */
  margin: 0;
}
.ps-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}
.btn-text {
  background: none;
  border: none;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-outline {
  border: 1px solid #10b981;
  background: #f0fdf4;
  color: #059669;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #64748b;
  position: relative;
  cursor: pointer;
}
.dot {
  position: absolute;
  top: 0;
  right: -2px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid #fff;
}
.ps-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 12px;
  padding-left: 20px;
  border-left: 1px solid #e2e8f0;
}
.ps-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
}
.ps-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
}
.ps-role {
  font-size: 0.75rem;
  color: #64748b;
}

/* Main Body */
.ps-main {
  display: grid;
  grid-template-columns: 1fr 320px;
  flex: 1;
  min-height: 0;
}

/* Calendar Column */
.ps-calendar-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
}
.psc-header {
  display: flex;
  align-items: center;
  padding: 24px 32px;
}
.psc-title {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  color: #1e293b;
  margin-right: 48px;
}
.psc-legend {
  display: flex;
  gap: 24px;
  flex: 1;
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
  white-space: nowrap;
}
.box {
  width: 14px;
  height: 14px;
  border-radius: 3px;
}
.box.done { background: #10b981; }
.box.booked { background: #22c55e; }
.box.cancelled { background: #cbd5e1; }

.psc-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-nav {
  background: #fff;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 6px;
}
.btn-nav.icon {
  padding: 8px 12px;
}
.btn-nav:hover {
  background: #f8fafc;
}

/* Grid */
.psc-grid-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 32px 32px;
}
.psc-grid {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e2e8f0;
  border-left: 1px solid #e2e8f0;
}
.psc-row {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
}
.psc-cell {
  flex: 1;
  border-right: 1px solid #e2e8f0;
}
.psc-header-row .day-head {
  padding: 16px;
  text-align: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: #334155;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.day-num {
  font-size: 1.1rem;
}
.day-head.today {
  color: #10b981;
}
.time-col {
  width: 80px;
  flex: none;
  padding: 16px 12px;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
  display: flex;
  justify-content: flex-end;
  background: #fdfdfd;
}
.day-cell {
  padding: 6px;
  position: relative;
  min-height: 60px;
  cursor: pointer;
  transition: background 0.1s;
}
.day-cell:hover {
  background: #f8fafc;
}

/* Session Block */
.session-block {
  padding: 6px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  transition: transform 0.1s;
}
.session-block:hover { filter: brightness(0.95); }
.session-block.active { transform: scale(1.03); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
.session-block.done { background: #10b981; }
.session-block.confirmed, .session-block.booked { background: #22c55e; }
.session-block.cancelled { background: #cbd5e1; }

/* Right Panel */
.ps-detail-col {
  padding: 32px 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.psd-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
}
.psd-user {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}
.psd-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
}
.psd-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}
.psd-goal {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 4px;
}

.psd-contract-info {
  margin-bottom: 32px;
  font-size: 0.95rem;
  color: #334155;
}
.psd-line strong {
  color: #1e293b;
  font-weight: 600;
}
.psd-line.mt {
  margin-top: 16px;
}
.big-num {
  font-size: 1.25rem;
  font-weight: 800;
}
.psd-progress {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  margin-top: 12px;
  overflow: hidden;
}
.psd-progress-bar {
  height: 100%;
  background: #10b981;
  border-radius: 4px;
}

.psd-status-sec {
  margin-bottom: 32px;
}
.psd-status-sec label {
  display: block;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
}
.status-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  background: #fff;
}

.btn-complete {
  width: 100%;
  background: #10b981;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  transition: all 0.2s;
  line-height: 1.4;
}
.btn-complete:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-complete small { font-size: 0.8rem; font-weight: 500; opacity: 0.9; }

.psd-empty {
  color: #94a3b8;
  font-size: 0.95rem;
  text-align: center;
  padding: 60px 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: #fff;
  width: 460px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  overflow: hidden;
  animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes modalIn {
  from { transform: scale(0.95) translateY(10px); opacity: 0; }
  to { transform: scale(1) translateY(0); opacity: 1; }
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
}
.modal-head h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  color: #1e293b;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #94a3b8;
  cursor: pointer;
}
.modal-body {
  padding: 0 24px 24px;
}
.form-group {
  margin-bottom: 24px;
}
.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 8px;
}
.select-wrapper {
  position: relative;
}
.search-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
  color: #94a3b8;
}
.form-control {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.form-control:focus {
  border-color: #10b981;
}
.form-control.with-icon {
  padding-right: 36px;
  appearance: none;
}
.contract-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}
.cc-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #1e293b;
}
.cc-text {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 6px;
}
.cc-text strong {
  color: #0f172a;
}
.datetime-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.conflict-warn {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.modal-foot {
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #f1f5f9;
}
.btn-confirm {
  flex: 1;
  background: #e2e8f0;
  color: #64748b;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: not-allowed;
  transition: all 0.2s;
}
.btn-confirm:not(:disabled) {
  background: #e2e8f0;
  color: #0f172a;
  cursor: pointer;
}
.btn-confirm:not(:disabled):hover {
  background: #cbd5e1;
}
.btn-danger {
  background: #ef4444;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-danger:hover {
  background: #dc2626;
}
</style>
