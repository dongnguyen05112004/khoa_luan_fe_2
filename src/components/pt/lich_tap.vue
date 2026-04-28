<template>
  <div class="lt-page">
    <div class="lt-header">
      <h1 class="lt-title">Quản lý lịch tập</h1>
      <div class="lt-header-center">
        <div class="lt-search"><i class="fas fa-search"></i><input placeholder="Tìm kiếm hội viên..." /></div>
      </div>
      <div class="lt-header-right">
        <button class="lt-icon-btn"><i class="fas fa-bell"></i><span class="lt-dot"></span></button>
        <button class="lt-icon-btn"><i class="fas fa-history"></i></button>
        <button class="lt-icon-btn"><i class="fas fa-user-circle"></i></button>
      </div>
    </div>

    <div class="lt-body">
      <!-- LEFT -->
      <div class="lt-left">
        <!-- Mini Calendar -->
        <div class="mini-cal">
          <div class="mc-head">
            <span class="mc-month">Tháng {{ calMonth }},<br/>{{ calYear }}</span>
            <div class="mc-nav">
              <button @click="prevMonth"><i class="fas fa-chevron-left"></i></button>
              <button @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>
          <div class="mc-days-header">
            <span v-for="d in ['T2','T3','T4','T5','T6','T7','CN']" :key="d">{{ d }}</span>
          </div>
          <div class="mc-grid">
            <span v-for="(d,i) in calDays" :key="i"
              :class="['mc-day', d===0?'empty':'', d===today&&calMonth===curMonth&&calYear===curYear?'today':'', selectedDay===d&&d!==0?'selected':'']"
              @click="d&&(selectedDay=d)">{{ d||'' }}</span>
          </div>
        </div>

        <!-- Members -->
        <div class="member-list-card">
          <div class="mlc-title">Hội viên đang quản lý</div>
          <div v-for="m in members" :key="m.id" class="mlc-item" :class="{active: selectedMember===m.id}" @click="selectMember(m)">
            <div class="mlc-bar" :style="{background: m.color}"></div>
            <img :src="m.avatar" class="mlc-avatar" />
            <div class="mlc-info">
              <div class="mlc-name">{{ m.name }}</div>
              <div class="mlc-meta">{{ m.goal }} · {{ m.time }}</div>
            </div>
          </div>
        </div>

        <!-- AI Optimizer -->
        <div class="ai-card">
          <div class="ai-card-header"><i class="fas fa-robot"></i> AI OPTIMIZER</div>
          <div class="ai-card-text">{{ aiSuggestion }}</div>
          <button class="ai-apply-btn">ÁP DỤNG NGAY</button>
          <i class="fas fa-cog ai-cog"></i>
        </div>
      </div>

      <!-- MIDDLE: Weekly Calendar -->
      <div class="lt-middle">
        <div class="wc-header">
          <div class="wc-title">Lịch biểu tuần</div>
          <div class="wc-tabs">
            <button :class="['wc-tab', viewMode==='week'?'active':'']" @click="viewMode='week'">Tuần này</button>
            <button :class="['wc-tab', viewMode==='month'?'active':'']" @click="viewMode='month'">Tháng</button>
          </div>
        </div>
        <div class="wc-grid">
          <!-- Day headers -->
          <div class="wc-time-col"></div>
          <div v-for="day in weekDays" :key="day.label" class="wc-day-head" :class="{today: day.isToday}">
            <div class="wcd-label">{{ day.label }}</div>
            <div class="wcd-num">{{ day.num }}</div>
          </div>

          <!-- Time rows -->
          <template v-for="hour in hours" :key="hour">
            <div class="wc-time-label">{{ String(hour).padStart(2,'0') }}:00</div>
            <div v-for="day in weekDays" :key="day.label+'_'+hour" class="wc-cell">
              <template v-for="s in getSessionsAt(day.dateStr, hour)" :key="s.id">
                <div :class="['wc-session', 'st-'+s.status]" @click="selectSession(s)">
                  <div class="wcs-status">{{ statusLabel(s.status) }}</div>
                  <div class="wcs-name">{{ s.memberName }}</div>
                  <span v-if="s.status==='pending'" class="wcs-time-badge">{{ String(hour).padStart(2,'0') }}:{{ s.min||'00' }}</span>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>

      <!-- RIGHT: Detail Panel -->
      <div class="lt-right">
        <div class="dr-title">Chi tiết buổi tập</div>
        <template v-if="activeSession">
          <div class="dr-member">
            <img :src="activeMemberData.avatar" class="dr-avatar" />
            <div class="dr-member-name">{{ activeMemberData.name }}</div>
            <div class="dr-member-goal">Mục tiêu: {{ activeMemberData.goal }}</div>
          </div>
          <div class="dr-contract-card">
            <div class="dcc-label">TRẠNG THÁI HỢP ĐỒNG PT</div>
            <div class="dcc-val">Còn lại: <strong>{{ activeMemberData.remaining }}/{{ activeMemberData.total }} buổi</strong></div>
          </div>
          <div class="dr-warning" v-if="activeSession.conflict">
            <i class="fas fa-exclamation-triangle"></i>
            <div><strong>Cảnh báo trùng lịch</strong><br/><span>{{ activeSession.conflict }}</span></div>
          </div>
          <button class="dr-btn-done" @click="markDone"><i class="fas fa-check-circle"></i> Hoàn thành buổi tập</button>
          <div class="dr-actions-row">
            <button class="dr-btn-outline"><i class="fas fa-calendar-alt"></i> Đổi lịch</button>
            <button class="dr-btn-cancel" @click="cancelSession"><i class="fas fa-times-circle"></i> Hủy lịch</button>
          </div>
          <div class="dr-note-section">
            <div class="dr-note-label">GHI CHÚ CỦA HLV</div>
            <textarea v-model="activeSession.note" class="dr-note-input" placeholder="Nhập ghi chú cho buổi tập này..."></textarea>
          </div>
        </template>
        <div v-else class="dr-empty">
          <i class="fas fa-calendar-check"></i>
          <p>Chọn buổi tập để xem chi tiết</p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="tf">
      <div v-if="toast.show" :class="['lt-toast', toast.type]">
        <i :class="toast.type==='success'?'fas fa-check-circle':'fas fa-exclamation-circle'"></i> {{ toast.text }}
      </div>
    </transition>
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
  name: 'LichTapPT',
  data() {
    const now = new Date()
    return {
      viewMode: 'week',
      selectedDay: now.getDate(),
      calMonth: now.getMonth() + 1,
      calYear: now.getFullYear(),
      curMonth: now.getMonth() + 1,
      curYear: now.getFullYear(),
      today: now.getDate(),
      selectedMember: null,
      activeSession: null,
      toast: { show: false, text: '', type: 'success' },
      toastTimer: null,
      hours: [6,7,8,9,10,11,12,13,14,15,16,17],
      members: [],
      sessions: [],
      myTrainerId: null,
      aiSuggestion: 'Đang phân tích lịch...',
      loadingBookings: false,
    }
  },
  computed: {
    weekDays() {
      const now = new Date()
      const mon = new Date(now)
      mon.setDate(now.getDate() - ((now.getDay()||7) - 1))
      const labels = ['THỨ\n2','THỨ\n3','THỨ\n4','THỨ\n5','THỨ\n6','THỨ\n7','CN']
      return Array.from({length:7}, (_,i) => {
        const d = new Date(mon); d.setDate(mon.getDate()+i)
        const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        return { label: labels[i], num: String(d.getDate()).padStart(2,'0'), dateStr: ds, isToday: d.toDateString()===now.toDateString() }
      })
    },
    sessionsWithDates() {
      return this.sessions
    },
    calDays() {
      const first = new Date(this.calYear, this.calMonth-1, 1).getDay()
      const offset = first===0 ? 6 : first-1
      const total = new Date(this.calYear, this.calMonth, 0).getDate()
      const arr = Array(offset).fill(0)
      for(let i=1;i<=total;i++) arr.push(i)
      while(arr.length%7!==0) arr.push(0)
      return arr
    },
    activeMemberData() {
      if(!this.activeSession) return null
      return this.members.find(m=>m.id===this.activeSession.memberId) || null
    },
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        const meRes = await axios.get(`${API}/me`, authHeaders())
        const me = meRes.data

        const trRes = await axios.get(`${API}/trainers`, authHeaders())
        const trainers = Array.isArray(trRes.data) ? trRes.data : (trRes.data?.data || [])
        const myTrainer = trainers.find(t => t.user_id == me.id)
        if (!myTrainer) {
          console.warn('Không tìm thấy trainer record cho user id:', me.id)
          return
        }
        this.myTrainerId = myTrainer.id

        const cRes = await axios.get(`${API}/pt-contracts?trainer_id=${myTrainer.id}&status=active&per_page=100`, authHeaders())
        const contracts = Array.isArray(cRes.data) ? cRes.data : (cRes.data?.data || [])
        this.members = contracts.map((c, idx) => ({
          id: c.user?.id,
          contractId: c.id,
          name: c.user?.name || 'Hội viên',
          goal: 'Tập luyện',
          time: '',
          color: COLORS[idx % COLORS.length],
          remaining: (c.total_sessions||0) - (c.used_sessions||0),
          total: c.total_sessions || 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name||'HV')}&background=${COLORS[idx%COLORS.length].replace('#','')}&color=fff&bold=true&size=64`,
        }))

        await this.loadBookings()
        this.updateAiSuggestion()
      } catch (e) {
        console.error('loadData error', e)
      }
    },
    async loadBookings() {
      if (!this.myTrainerId) return
      this.loadingBookings = true
      try {
        const res = await axios.get(`${API}/pt-bookings?trainer_id=${this.myTrainerId}`, authHeaders())
        const raw = res.data?.data || res.data || []
        this.sessions = raw.map(b => {
          const dt = new Date(b.schedule_time)
          const ds = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
          const memberId = b.contract?.user?.id || b.contract?.user_id
          const member = this.members.find(m => m.id === memberId)
          return {
            id: b.id,
            memberId,
            memberName: b.contract?.user?.name || 'Hội viên',
            dateStr: ds,
            hour: dt.getHours(),
            min: String(dt.getMinutes()).padStart(2,'0'),
            status: b.status === 'confirmed' ? 'booked' : b.status,
            note: b.notes || '',
            conflict: null,
            color: member?.color || '#2d7a3a',
          }
        })
      } catch(e) {
        console.error('loadBookings error', e)
      } finally {
        this.loadingBookings = false
      }
    },
    updateAiSuggestion() {
      const pending = this.sessions.filter(s => s.status === 'pending').length
      const done = this.sessions.filter(s => s.status === 'done').length
      this.aiSuggestion = `Tuần này: ${done} buổi hoàn thành, ${pending} buổi chờ xác nhận. Các khung giờ sáng sớm (6-8h) còn trống phù hợp để sắp xếp thêm.`
    },
    getSessionsAt(dateStr, hour) {
      return this.sessions.filter(s => s.dateStr === dateStr && s.hour === hour)
    },
    selectMember(m) { this.selectedMember = m.id },
    selectSession(s) { this.activeSession = s },
    statusLabel(st) {
      return { booked:'ĐÃ ĐẶT', done:'HOÀN THÀNH', pending:'CHỜ XÁC NHẬN', cancelled:'HỦY', confirmed:'ĐÃ ĐẶT' }[st] || st.toUpperCase()
    },
    async markDone() {
      if (!this.activeSession) return
      try {
        await axios.put(`${API}/pt-bookings/${this.activeSession.id}`, { status: 'done' }, authHeaders())
        this.activeSession.status = 'done'
        this.showToast('Đã hoàn thành buổi tập!')
        this.updateAiSuggestion()
      } catch(e) {
        this.showToast('Cập nhật thất bại', 'error')
      }
    },
    async cancelSession() {
      if (!this.activeSession) return
      if (!confirm('Bạn có chắc muốn hủy buổi tập này?')) return
      try {
        await axios.put(`${API}/pt-bookings/${this.activeSession.id}`, { status: 'cancelled' }, authHeaders())
        this.activeSession.status = 'cancelled'
        this.showToast('Đã hủy buổi tập')
      } catch(e) {
        this.showToast('Hủy thất bại', 'error')
      }
    },
    showToast(text, type='success') {
      clearTimeout(this.toastTimer)
      this.toast={show:true,text,type}
      this.toastTimer=setTimeout(()=>this.toast.show=false,3000)
    },
    prevMonth() { if(this.calMonth===1){this.calMonth=12;this.calYear--}else this.calMonth-- },
    nextMonth() { if(this.calMonth===12){this.calMonth=1;this.calYear++}else this.calMonth++ },
  }
}
</script>


<style scoped>
*{box-sizing:border-box}
.lt-page{display:flex;flex-direction:column;height:100%;font-family:'Inter','Segoe UI',sans-serif;color:#1e293b;margin:-24px;background:#f2f6f3}

/* Header */
.lt-header{display:flex;align-items:center;gap:16px;padding:12px 20px;background:#fff;border-bottom:1px solid #e5eae7;position:sticky;top:0;z-index:10}
.lt-title{font-size:1.05rem;font-weight:800;color:#0f172a;margin:0;white-space:nowrap}
.lt-header-center{flex:1}
.lt-search{display:flex;align-items:center;gap:8px;background:#f4f7f5;border:1px solid #e2e8e4;border-radius:20px;padding:7px 16px;max-width:280px}
.lt-search i{color:#94a3b8;font-size:.8rem}
.lt-search input{border:none;background:transparent;outline:none;font-size:.83rem;color:#475569;width:100%}
.lt-header-right{display:flex;gap:8px}
.lt-icon-btn{position:relative;width:34px;height:34px;border-radius:50%;border:1px solid #e2e8e4;background:#f4f7f5;color:#64748b;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.85rem;transition:all .2s}
.lt-icon-btn:hover{background:#e8f5e9;color:#2d7a3a}
.lt-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:#ef4444;border:2px solid #fff}

/* Body */
.lt-body{display:grid;grid-template-columns:190px 1fr 210px;gap:0;flex:1;min-height:0;overflow:hidden}

/* LEFT */
.lt-left{display:flex;flex-direction:column;gap:12px;padding:14px 12px;background:#fff;border-right:1px solid #e8edf0;overflow-y:auto}
.lt-left::-webkit-scrollbar{width:3px}
.lt-left::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}

/* Mini Calendar */
.mini-cal{background:#fff;border:1px solid #e8edf0;border-radius:12px;padding:12px}
.mc-head{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
.mc-month{font-size:.82rem;font-weight:700;color:#0f172a;line-height:1.3}
.mc-nav{display:flex;gap:2px}
.mc-nav button{width:22px;height:22px;border:none;background:transparent;color:#64748b;cursor:pointer;border-radius:5px;font-size:.65rem;display:flex;align-items:center;justify-content:center}
.mc-nav button:hover{background:#f0fdf4;color:#2d7a3a}
.mc-days-header{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;margin-bottom:4px}
.mc-days-header span{font-size:.6rem;font-weight:700;color:#94a3b8;text-align:center}
.mc-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:2px}
.mc-day{font-size:.72rem;color:#475569;text-align:center;padding:4px 2px;border-radius:50%;cursor:pointer;transition:all .15s;aspect-ratio:1;display:flex;align-items:center;justify-content:center}
.mc-day:hover:not(.empty){background:#f0fdf4;color:#2d7a3a}
.mc-day.today{background:#2d7a3a;color:#fff;font-weight:700}
.mc-day.selected:not(.today){background:#dcfce7;color:#2d7a3a;font-weight:600}
.mc-day.empty{cursor:default;color:#cbd5e1}

/* Member List */
.member-list-card{background:#fff;border:1px solid #e8edf0;border-radius:12px;padding:12px}
.mlc-title{font-size:.75rem;font-weight:700;color:#0f172a;margin-bottom:10px}
.mlc-item{display:flex;align-items:center;gap:8px;padding:8px;border-radius:10px;cursor:pointer;transition:all .15s;border-left:3px solid transparent}
.mlc-item:hover{background:#f8fafc}
.mlc-item.active{background:#f0fdf4;border-left:3px solid #2d7a3a}
.mlc-bar{width:3px;height:32px;border-radius:4px;flex-shrink:0}
.mlc-avatar{width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0}
.mlc-name{font-size:.78rem;font-weight:600;color:#1e293b}
.mlc-meta{font-size:.65rem;color:#94a3b8;margin-top:1px}

/* AI Card */
.ai-card{background:linear-gradient(135deg,#5a3bc5,#7c3aed,#4f46e5);border-radius:12px;padding:14px;position:relative;overflow:hidden}
.ai-card-header{font-size:.72rem;font-weight:700;color:#e9d5ff;letter-spacing:.5px;margin-bottom:8px}
.ai-card-text{font-size:.72rem;color:rgba(255,255,255,.9);line-height:1.5;margin-bottom:12px}
.ai-apply-btn{background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:20px;padding:6px 14px;font-size:.68rem;font-weight:700;cursor:pointer;transition:all .2s;letter-spacing:.5px}
.ai-apply-btn:hover{background:rgba(255,255,255,.3)}
.ai-cog{position:absolute;bottom:12px;right:12px;font-size:1.3rem;color:rgba(255,255,255,.2)}

/* MIDDLE */
.lt-middle{display:flex;flex-direction:column;overflow:hidden;background:#f8fafb}
.wc-header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;background:#fff;border-bottom:1px solid #e8edf0}
.wc-title{font-size:.95rem;font-weight:700;color:#0f172a}
.wc-tabs{display:flex;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden}
.wc-tab{padding:6px 14px;font-size:.78rem;font-weight:600;background:#fff;border:none;cursor:pointer;color:#64748b;transition:all .15s}
.wc-tab.active{background:#2d7a3a;color:#fff}

.wc-grid{display:grid;grid-template-columns:56px repeat(7,1fr);overflow-y:auto;flex:1}
.wc-grid::-webkit-scrollbar{width:4px}
.wc-grid::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}

.wc-time-col{background:#fff}
.wc-day-head{background:#fff;border-bottom:2px solid #e8edf0;border-left:1px solid #f1f5f9;text-align:center;padding:10px 4px;position:sticky;top:0;z-index:2}
.wc-day-head.today{background:#f0fdf4}
.wcd-label{font-size:.6rem;font-weight:700;color:#94a3b8;white-space:pre-line;line-height:1.2}
.wcd-num{font-size:1.1rem;font-weight:700;color:#0f172a;margin-top:2px}
.wc-day-head.today .wcd-num{color:#2d7a3a}

.wc-time-label{background:#fff;border-right:1px solid #e8edf0;border-bottom:1px solid #f1f5f9;padding:6px 6px 0;font-size:.6rem;color:#94a3b8;text-align:right;height:72px;display:flex;align-items:flex-start;justify-content:flex-end}
.wc-cell{border-left:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;height:72px;padding:3px;position:relative;background:#fff;transition:background .15s}
.wc-cell:hover{background:#f0fdf4}

.wc-session{border-radius:6px;padding:5px 7px;font-size:.67rem;font-weight:600;cursor:pointer;height:100%;position:relative;transition:all .2s;border:1px solid transparent}
.wc-session:hover{filter:brightness(.95);transform:scale(1.02)}
.st-booked{background:#dbeafe;color:#1d4ed8;border-color:#bfdbfe}
.st-done{background:#dcfce7;color:#166534;border-color:#bbf7d0}
.st-pending{background:#e0f2fe;color:#0369a1;border-color:#bae6fd}
.st-cancelled{background:#fce7f3;color:#9d174d;border-color:#fbcfe8}
.wcs-status{font-size:.6rem;letter-spacing:.3px;opacity:.8}
.wcs-name{font-weight:700;margin-top:1px}
.wcs-time-badge{position:absolute;bottom:4px;right:4px;background:rgba(3,105,161,.15);border-radius:3px;padding:1px 4px;font-size:.6rem;color:#0369a1}

/* RIGHT */
.lt-right{padding:16px 14px;background:#fff;border-left:1px solid #e8edf0;overflow-y:auto;display:flex;flex-direction:column;gap:14px}
.lt-right::-webkit-scrollbar{width:3px}
.lt-right::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:4px}
.dr-title{font-size:.88rem;font-weight:700;color:#0f172a}
.dr-member{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
.dr-avatar{width:70px;height:70px;border-radius:50%;object-fit:cover;border:3px solid #c6e9cf}
.dr-member-name{font-size:.95rem;font-weight:700;color:#0f172a}
.dr-member-goal{font-size:.72rem;color:#64748b}
.dr-contract-card{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px}
.dcc-label{font-size:.62rem;font-weight:700;color:#16a34a;letter-spacing:.4px;margin-bottom:4px}
.dcc-val{font-size:.88rem;color:#0f172a}
.dcc-val strong{font-size:1.15rem;font-weight:800}
.dr-warning{display:flex;align-items:flex-start;gap:8px;background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:10px 12px;font-size:.72rem;color:#dc2626}
.dr-warning i{margin-top:2px;flex-shrink:0}
.dr-warning strong{display:block;margin-bottom:2px}
.dr-warning span{color:#7f1d1d;opacity:.85}
.dr-btn-done{display:flex;align-items:center;justify-content:center;gap:7px;background:linear-gradient(135deg,#2d7a3a,#1a5c28);color:#fff;border:none;border-radius:20px;padding:11px;font-size:.85rem;font-weight:700;cursor:pointer;transition:opacity .18s;font-family:inherit}
.dr-btn-done:hover{opacity:.88}
.dr-actions-row{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.dr-btn-outline{display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;font-size:.75rem;font-weight:600;border:1.5px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;cursor:pointer;transition:all .15s;font-family:inherit}
.dr-btn-outline:hover{background:#f8fafc;border-color:#cbd5e1}
.dr-btn-cancel{display:flex;align-items:center;justify-content:center;gap:5px;padding:8px;font-size:.75rem;font-weight:600;border:1.5px solid #fecaca;border-radius:10px;background:#fff;color:#dc2626;cursor:pointer;transition:all .15s;font-family:inherit}
.dr-btn-cancel:hover{background:#fef2f2}
.dr-note-section{display:flex;flex-direction:column;gap:5px}
.dr-note-label{font-size:.62rem;font-weight:700;color:#94a3b8;letter-spacing:.4px}
.dr-note-input{border:1.5px solid #e2e8f0;border-radius:9px;padding:9px 11px;font-size:.8rem;color:#475569;outline:none;resize:vertical;min-height:80px;background:#f8fafc;font-family:inherit;transition:border-color .18s}
.dr-note-input:focus{border-color:#2d7a3a;background:#fff}
.dr-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;flex:1;color:#94a3b8;text-align:center;padding:40px 0}
.dr-empty i{font-size:2.5rem;opacity:.4}
.dr-empty p{font-size:.82rem;margin:0}

/* Toast */
.lt-toast{position:fixed;top:24px;right:24px;z-index:9999;padding:11px 18px;border-radius:12px;font-size:.86rem;font-weight:600;display:flex;align-items:center;gap:8px;box-shadow:0 8px 28px rgba(0,0,0,.15)}
.lt-toast.success{background:#16a34a;color:#fff}
.lt-toast.error{background:#dc2626;color:#fff}
.tf-enter-active,.tf-leave-active{transition:all .3s}
.tf-enter-from,.tf-leave-to{opacity:0;transform:translateY(-10px)}
</style>
