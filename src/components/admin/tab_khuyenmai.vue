<template>
  <div class="km-page">
    <!-- NAV BAR -->
    <div class="km-nav">
      <div class="km-search">
        <i class="fas fa-search"></i>
        <input v-model="search" placeholder="Tìm kiếm khuyến mãi..." />
      </div>
      <div class="km-tabs-wrap">
        <button v-for="t in tabs" :key="t.key"
          :class="['km-tab', activeTab===t.key?'active':'']"
          @click="activeTab=t.key; showCreate=false">{{ t.label }}</button>
      </div>
      <div class="km-nav-right">
        <button class="btn-notif"><i class="fas fa-bell"></i><span class="nd"></span></button>
        <button class="btn-help"><i class="fas fa-question-circle"></i></button>
        <div class="km-user">
          <div class="km-user-info">
            <span class="km-uname">Alex Rivera</span>
            <span class="km-urole">Quản lý Marketing</span>
          </div>
          <div class="km-avatar">AR</div>
        </div>
      </div>
    </div>

    <!-- ======= TAB: TỔNG QUAN ======= -->
    <div v-if="activeTab==='tongquan'">

      <!-- CREATE FORM VIEW (replaces list when showCreate=true) -->
      <transition name="fade">
        <div v-if="showCreate" class="create-layout">
          <div class="create-form-panel">
            <div class="create-header">
              <h2 class="create-title">Tạo Chiến dịch Mới</h2>
              <p class="create-sub">Thiết kế chương trình khuyến mãi hiệu quả cao với các gợi ý thông số từ AI.</p>
            </div>
            <div class="create-body">
              <div class="fg">
                <label class="flbl">TÊN CHIẾN DỊCH</label>
                <input v-model="form.name" class="fi" placeholder="vd: Bứt phá Mùa hè 2024"/>
              </div>
              <div class="fg-row">
                <div class="fg">
                  <label class="flbl">MÃ GIẢM GIÁ</label>
                  <div class="code-wrap">
                    <input v-model="form.code" class="fi" placeholder="PEAK24"/>
                    <span class="unique-tag" v-if="form.code"><i class="fas fa-check-circle"></i> DUY NHẤT</span>
                  </div>
                </div>
                <div class="fg">
                  <label class="flbl">MỨC GIẢM GIÁ (%)</label>
                  <div class="pct-wrap">
                    <input v-model.number="form.discount" type="number" class="fi" placeholder="20"/>
                    <span class="pct-sfx">%</span>
                  </div>
                </div>
              </div>
              <div class="fg">
                <label class="flbl">THỜI GIAN HIỆU LỰC</label>
                <div class="date-row">
                  <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="form.startDate" type="date" class="fi di"/></div>
                  <i class="fas fa-arrow-right darr"></i>
                  <div class="date-box"><i class="fas fa-calendar-alt dic"></i><input v-model="form.endDate" type="date" class="fi di"/></div>
                </div>
              </div>
              <div class="fg">
                <label class="flbl">ĐIỀU KIỆN ÁP DỤNG</label>
                <div class="conds">
                  <span class="ctag" v-for="(c,i) in form.conditions" :key="i">
                    <i :class="c.icon"></i> {{ c.label }}
                    <button class="cdel" @click="form.conditions.splice(i,1)"><i class="fas fa-times"></i></button>
                  </span>
                  <button class="btn-addcond" @click="condMenu=!condMenu"><i class="fas fa-plus"></i> Thêm Điều kiện</button>
                </div>
                <div class="cond-dd" v-if="condMenu">
                  <div class="copt" v-for="o in condOpts" :key="o.key" @click="addCond(o)">
                    <i :class="o.icon"></i> {{ o.label }}
                  </div>
                </div>
              </div>
              <div class="fg">
                <textarea v-model="form.desc" class="fta" placeholder="Mô tả thêm logic quy đổi..." rows="4"></textarea>
              </div>
            </div>
            <div class="create-footer">
              <button class="btn-cancel" @click="showCreate=false">Huỷ</button>
              <button class="btn-activate" @click="saveNew"><i class="fas fa-bolt"></i> Kích hoạt Chiến dịch</button>
            </div>
          </div>

          <!-- AI Panel -->
          <div class="ai-side">
            <div class="ai-badge-btn"><i class="fas fa-wand-magic-sparkles"></i> AI TỐI ƯU ĐANG HOẠT ĐỘNG</div>
            <div class="ai-pred-card">
              <div class="ai-pred-top">
                <div class="ai-pred-hd"><i class="fas fa-robot"></i> DỰ ĐOÁN TỪ AI</div>
                <svg viewBox="0 0 60 30" width="60" height="30">
                  <polyline points="0,25 10,20 20,22 30,12 40,8 50,5 60,2" fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="ai-pred-lbl">Chuyển đổi ước tính</div>
              <div class="ai-pred-val">+{{ form.discount ? Math.round(form.discount*1.2) : 24 }}% <span class="ai-pred-tag">đã tối ưu</span></div>
              <blockquote class="ai-quote">"Dựa trên xu hướng thị trường hiện tại, mức <strong>giảm {{ form.discount||20 }}%</strong> kết hợp với <strong>Cam kết Năm</strong> thu hút lượng khách hàng 3 lần so với các tư dài ngắn hơn."</blockquote>
              <button class="btn-applyai">Áp dụng Tinh chỉnh AI</button>
            </div>
            <div class="tag-section">
              <div class="tag-hd">THẺ GỢI Ý</div>
              <div class="tags-wrap">
                <span class="stag" v-for="t in suggestTags" :key="t">#{{ t }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- CAMPAIGN LIST VIEW -->
      <div v-if="!showCreate" class="list-view">
        <div class="list-header">
          <div>
            <h2 class="list-title">Danh sách Chiến dịch</h2>
            <p class="list-sub">Quản lý và tối ưu hóa các chương trình ưu đãi của bạn.</p>
          </div>
          <button class="btn-add-camp" @click="showCreate=true">
            <i class="fas fa-plus"></i> Thêm chiến dịch mới
          </button>
        </div>

        <!-- Stats row -->
        <div class="list-stats">
          <div class="ls-card">
            <div class="ls-lbl">ĐANG HOẠT ĐỘNG</div>
            <div class="ls-val">12</div>
            <div class="ls-trend"><i class="fas fa-arrow-trend-up" style="color:#16a34a"></i> +2 trong tháng này</div>
          </div>
          <div class="ls-card">
            <div class="ls-lbl">TỔNG LƯỢT TIẾP CẬN</div>
            <div class="ls-val">45.2k</div>
            <div class="ls-trend"><i class="fas fa-users" style="color:#2563eb"></i> Khán giả Toàn cầu</div>
          </div>
          <div class="ls-card">
            <div class="ls-lbl">TỶ LỆ CHUYỂN ĐỔI TRUNG BÌNH</div>
            <div class="ls-val">8.4%</div>
            <div class="ls-trend" style="color:#7c3aed"><i class="fas fa-bolt"></i> Đã tối ưu bởi AI</div>
          </div>
          <div class="ai-suggest-card">
            <div class="ais-hd"><i class="fas fa-robot" style="color:#7c3aed"></i> ĐỀ XUẤT TỪ AI</div>
            <p class="ais-txt">Chạy khuyến mãi "Chuẩn bị cho mùa hè" để đạt tương tác cao.</p>
            <a href="#" class="ais-link">Khám phá chiến lược <i class="fas fa-arrow-right"></i></a>
          </div>
        </div>

        <!-- Table -->
        <div class="camp-table-wrap">
          <table class="camp-table">
            <thead>
              <tr>
                <th>TÊN CHIẾN DỊCH</th>
                <th>MÃ GIẢM GIÁ</th>
                <th>THỜI GIAN</th>
                <th>MỨC GIẢM GIÁ</th>
                <th>TRẠNG THÁI</th>
                <th>HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in filteredCamps" :key="c.id">
                <td>
                  <div class="tc-name-cell">
                    <div class="tc-bar" :style="{ background: c.color }"></div>
                    <div>
                      <div class="tc-name">{{ c.name }}</div>
                      <div class="tc-target">{{ c.target }}</div>
                    </div>
                  </div>
                </td>
                <td><span class="code-badge">{{ c.code }}</span></td>
                <td class="tc-date"><i class="fas fa-calendar-alt" style="color:#94a3b8;margin-right:4px"></i>{{ c.period }}</td>
                <td class="tc-discount">{{ c.discount }}</td>
                <td>
                  <div class="tc-status-wrap">
                    <label class="toggle" :title="c.status">
                      <input type="checkbox" :checked="c.active" @change="toggleStatus(c)"/>
                      <span class="toggle-slider"></span>
                    </label>
                    <span class="tc-status-txt" :class="c.active?'st-on':'st-off'">{{ c.active?'Hoạt động':'Ngừng' }}</span>
                  </div>
                </td>
                <td class="tc-actions">
                  <button class="btn-act">edit</button>
                  <button class="btn-act" style="color:#dc2626">delete</button>
                  <button class="btn-act-primary">Xem Phân tích</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-row">
          <span class="pg-info">Đang hiển thị 1 đến {{ filteredCamps.length }} trên tổng số {{ campaigns.length }} chiến dịch</span>
          <div class="pg-btns">
            <button class="pg-btn active">1</button>
            <button class="pg-btn">2</button>
            <button class="pg-btn">3</button>
          </div>
        </div>

        <!-- AI Forecast Banner -->
        <div class="forecast-banner">
          <div class="forecast-icon">
            <svg viewBox="0 0 36 36" width="36" height="36">
              <circle cx="18" cy="18" r="18" fill="url(#fg)"/>
              <defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs>
              <text x="18" y="23" text-anchor="middle" font-size="14" fill="#fff" font-weight="bold">AI</text>
            </svg>
          </div>
          <div class="forecast-text">
            <div class="forecast-title">Dự báo Hiệu suất Sắp tới</div>
            <div class="forecast-desc">Dựa trên dữ liệu lịch sử, các chiến dịch ra mắt từ ngày 10 đến 15 tháng 2 có <strong>tỷ lệ tương tác cao hơn 14%</strong> do nhu cầu chuẩn bị cho kỳ nghỉ xuân trong khu vực.</div>
          </div>
          <button class="btn-draft">Lên lịch Bản nháp</button>
        </div>
      </div>
    </div>

    <!-- ======= TAB: PHÂN TÍCH ======= -->
    <TabKhuyenMaiPhanTich v-if="activeTab==='phantich'" />

    <!-- ======= TAB: LỊCH TRÌNH ======= -->
    <div v-if="activeTab==='lichtrinh'" class="lt-content">
      <div class="lt-head">
        <h2 class="list-title">LỊCH TRÌNH CHIẾN DỊCH</h2>
        <div style="display:flex;gap:10px">
          <button class="btn-cancel"><i class="fas fa-calendar-alt"></i> Tháng này</button>
          <button class="btn-activate" style="padding:8px 16px"><i class="fas fa-plus"></i> Lên lịch mới</button>
        </div>
      </div>
      <div class="tl-list">
        <div class="tl-item" v-for="(s,i) in schedule" :key="i">
          <div class="tl-dot" :class="s.dotCls"></div>
          <div class="tl-card">
            <div class="tl-card-top">
              <span class="tl-date">{{ s.date }}</span>
              <span class="tl-st" :class="s.stCls">{{ s.status }}</span>
            </div>
            <div class="tl-name">{{ s.name }}</div>
            <div class="tl-meta">
              <span><i class="fas fa-tag"></i> {{ s.code }}</span>
              <span><i class="fas fa-percent"></i> Giảm {{ s.disc }}%</span>
              <span><i class="fas fa-users"></i> {{ s.reach }}</span>
            </div>
            <div class="tl-prog-wrap"><div class="tl-prog" :style="{ width:s.prog+'%', background:s.pc }"></div></div>
            <div class="tl-prog-lbl">Tiến độ: {{ s.prog }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TabKhuyenMaiPhanTich from './tab_khuyenmai_phantich.vue'
export default {
  name: 'TabKhuyenMai',
  components: { TabKhuyenMaiPhanTich },
  data() {
    return {
      activeTab: 'tongquan',
      showCreate: false,
      search: '',
      condMenu: false,
      tabs: [
        { key: 'tongquan',  label: 'Tổng quan' },
        { key: 'phantich',  label: 'Phân tích' },
        { key: 'lichtrinh', label: 'Lịch trình' },
      ],
      form: { name:'', code:'PEAK24', discount:20, startDate:'', endDate:'', conditions:[{ key:'year', label:'Gói năm', icon:'fas fa-calendar-check' }], desc:'' },
      condOpts: [
        { key:'year',      label:'Gói năm',          icon:'fas fa-calendar-check' },
        { key:'month',     label:'Gói tháng',         icon:'fas fa-calendar-alt' },
        { key:'new',       label:'Hội viên mới',      icon:'fas fa-user-plus' },
        { key:'referral',  label:'Giới thiệu bạn bè', icon:'fas fa-user-friends' },
        { key:'birthday',  label:'Sinh nhật',         icon:'fas fa-birthday-cake' },
        { key:'pt',        label:'Gói PT',            icon:'fas fa-dumbbell' },
      ],
      suggestTags: ['DuyTri','TăngTrưởng_Q3','Sôm','ĐộcQuyền_SmartGym'],
      campaigns: [
        { id:1, name:'Cắt mỡ đón Tết 2024', target:'Thành viên cũ quay lại', code:'SHRED24', period:'01 Th01 – 31 Th01', discount:'GIẢM 25%', active:true,  color:'#2d7a3a' },
        { id:2, name:'Bùng nổ vóc dáng hè', target:'Đối tượng: Sinh viên đại học', code:'SUMMER50', period:'01 Th06 – 31 Th08', discount:'Tặng $50', active:false, color:'#6366f1' },
        { id:3, name:'Chương trình Giới thiệu Elite', target:'Top 10% Thành viên tích cực', code:'ELITEVIP', period:'Đang diễn ra', discount:'1 Tháng Miễn phí', active:true, color:'#2d7a3a' },
      ],
      schedule: [
        { date:'01/04/2025', name:'Chiến dịch Bứt phá Hè', code:'SUMMER25', disc:30, status:'Đang chạy', stCls:'sl-green', dotCls:'dot-green', reach:'12,400', prog:62, pc:'#2d7a3a' },
        { date:'15/04/2025', name:'Khuyến mãi Sinh nhật SmartGym', code:'BDAY25', disc:20, status:'Sắp diễn ra', stCls:'sl-blue', dotCls:'dot-blue', reach:'5,200', prog:0, pc:'#6366f1' },
        { date:'01/05/2025', name:'Ưu đãi Tháng Lao Động', code:'LABOR25', disc:15, status:'Lên kế hoạch', stCls:'sl-yellow', dotCls:'dot-yellow', reach:'8,000', prog:0, pc:'#f59e0b' },
        { date:'01/03/2025', name:'Win-back Email Q1', code:'WINBACK25', disc:25, status:'Đã kết thúc', stCls:'sl-gray', dotCls:'dot-gray', reach:'7,100', prog:100, pc:'#64748b' },
      ],
    }
  },
  computed: {
    filteredCamps() {
      const q = this.search.toLowerCase()
      return this.campaigns.filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
    },
  },
  methods: {
    addCond(o) {
      if (!this.form.conditions.find(c=>c.key===o.key)) this.form.conditions.push({...o})
      this.condMenu = false
    },
    toggleStatus(c) { c.active = !c.active },
    saveNew() {
      if (!this.form.name) return
      this.campaigns.push({ id:Date.now(), name:this.form.name, target:'Tất cả hội viên', code:this.form.code||'NEW', period:this.form.startDate+' – '+this.form.endDate, discount:`GIẢM ${this.form.discount}%`, active:true, color:'#7c3aed' })
      this.form = { name:'', code:'PEAK24', discount:20, startDate:'', endDate:'', conditions:[], desc:'' }
      this.showCreate = false
    },
  },
}
</script>

<style scoped>
/* ======= ROOT ======= */
.km-page { display:flex; flex-direction:column; gap:20px; font-family:'Segoe UI',sans-serif; color:#1e293b; }

/* ======= NAV ======= */
.km-nav { display:flex; align-items:center; gap:12px; background:#fff; border-radius:12px; padding:10px 16px; box-shadow:0 2px 10px rgba(0,0,0,0.05); flex-wrap:wrap; }
.km-search { display:flex; align-items:center; gap:8px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:9px; padding:6px 12px; flex:1; min-width:160px; }
.km-search i { color:#94a3b8; font-size:.8rem; }
.km-search input { border:none; outline:none; background:transparent; font-size:.82rem; color:#475569; width:100%; }
.km-search input::placeholder { color:#94a3b8; }
.km-tabs-wrap { display:flex; gap:4px; }
.km-tab { padding:7px 16px; border:none; background:transparent; border-radius:8px; font-size:.84rem; font-weight:500; color:#64748b; cursor:pointer; transition:all .15s; }
.km-tab:hover { background:#f1f5f9; color:#1e293b; }
.km-tab.active { background:#f1f5f9; color:#1e293b; font-weight:700; border-bottom:2px solid #6366f1; }
.km-nav-right { display:flex; align-items:center; gap:8px; margin-left:auto; }
.btn-notif,.btn-help { position:relative; width:34px; height:34px; border-radius:9px; border:1.5px solid #e2e8f0; background:#fff; color:#64748b; font-size:.85rem; cursor:pointer; }
.nd { position:absolute; top:6px; right:7px; width:7px; height:7px; background:#ef4444; border-radius:50%; border:1.5px solid #fff; }
.km-user { display:flex; align-items:center; gap:8px; padding-left:10px; border-left:1px solid #e2e8f0; }
.km-user-info { display:flex; flex-direction:column; text-align:right; }
.km-uname { font-size:.82rem; font-weight:600; }
.km-urole { font-size:.68rem; color:#94a3b8; }
.km-avatar { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#a855f7); color:#fff; font-weight:700; font-size:.78rem; display:flex; align-items:center; justify-content:center; }

/* ======= LIST VIEW ======= */
.list-view { display:flex; flex-direction:column; gap:18px; }
.list-header { display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.list-title { font-size:1.5rem; font-weight:800; color:#0f172a; margin:0 0 4px; }
.list-sub { font-size:.78rem; color:#64748b; margin:0; }
.btn-add-camp { display:inline-flex; align-items:center; gap:7px; padding:10px 20px; border:none; border-radius:10px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.85rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(99,102,241,.35); transition:opacity .15s,transform .15s; }
.btn-add-camp:hover { opacity:.9; transform:translateY(-1px); }

/* Stats row */
.list-stats { display:grid; grid-template-columns:1fr 1fr 1fr 1.2fr; gap:14px; }
.ls-card { background:#fff; border-radius:12px; padding:16px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.ls-lbl { font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; margin-bottom:6px; }
.ls-val { font-size:1.7rem; font-weight:800; color:#0f172a; margin-bottom:4px; }
.ls-trend { font-size:.72rem; color:#64748b; display:flex; align-items:center; gap:4px; }
.ai-suggest-card { background:linear-gradient(135deg,#ede9fe,#dbeafe); border:1px solid #c4b5fd; border-radius:12px; padding:16px 18px; }
.ais-hd { font-size:.65rem; font-weight:700; color:#7c3aed; letter-spacing:.4px; margin-bottom:8px; display:flex; align-items:center; gap:5px; }
.ais-txt { font-size:.78rem; color:#475569; line-height:1.5; margin:0 0 8px; }
.ais-link { font-size:.75rem; font-weight:700; color:#7c3aed; text-decoration:none; display:flex; align-items:center; gap:5px; }

/* Table */
.camp-table-wrap { background:#fff; border-radius:14px; box-shadow:0 2px 12px rgba(0,0,0,.06); overflow:hidden; }
.camp-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.camp-table th { text-align:left; font-size:.62rem; font-weight:700; color:#94a3b8; letter-spacing:.4px; padding:12px 16px; border-bottom:1px solid #f1f5f9; background:#fafafa; }
.camp-table td { padding:14px 16px; border-bottom:1px solid #f8fafc; vertical-align:middle; }
.camp-table tr:last-child td { border-bottom:none; }
.camp-table tr:hover td { background:#fafafe; }
.tc-name-cell { display:flex; align-items:flex-start; gap:10px; }
.tc-bar { width:4px; height:40px; border-radius:4px; flex-shrink:0; margin-top:2px; }
.tc-name { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:3px; }
.tc-target { font-size:.7rem; color:#94a3b8; }
.code-badge { background:#f1f5f9; color:#475569; font-size:.72rem; font-weight:700; padding:4px 10px; border-radius:6px; font-family:monospace; }
.tc-date { font-size:.75rem; color:#475569; white-space:nowrap; }
.tc-discount { font-size:.82rem; font-weight:800; color:#2d7a3a; }
/* Toggle */
.tc-status-wrap { display:flex; align-items:center; gap:7px; }
.toggle { position:relative; width:38px; height:22px; cursor:pointer; }
.toggle input { opacity:0; width:0; height:0; }
.toggle-slider { position:absolute; inset:0; background:#cbd5e1; border-radius:20px; transition:.2s; }
.toggle-slider:before { content:''; position:absolute; width:16px; height:16px; left:3px; top:3px; background:#fff; border-radius:50%; transition:.2s; }
input:checked + .toggle-slider { background:#16a34a; }
input:checked + .toggle-slider:before { transform:translateX(16px); }
.tc-status-txt { font-size:.72rem; font-weight:600; }
.st-on  { color:#16a34a; }
.st-off { color:#94a3b8; }
/* Actions */
.tc-actions { display:flex; align-items:center; gap:8px; }
.btn-act { background:none; border:none; font-size:.78rem; color:#64748b; cursor:pointer; padding:0 2px; font-weight:500; }
.btn-act:hover { color:#1e293b; }
.btn-act-primary { padding:5px 12px; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:7px; font-size:.73rem; font-weight:600; color:#475569; cursor:pointer; white-space:nowrap; transition:background .15s; }
.btn-act-primary:hover { background:#ede9fe; color:#7c3aed; border-color:#c4b5fd; }

/* Pagination */
.pagination-row { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.pg-info { font-size:.73rem; color:#64748b; }
.pg-btns { display:flex; gap:4px; }
.pg-btn { width:32px; height:32px; border-radius:8px; border:1.5px solid #e2e8f0; background:#fff; color:#475569; font-size:.8rem; font-weight:600; cursor:pointer; }
.pg-btn.active { background:#6366f1; color:#fff; border-color:#6366f1; }

/* Forecast banner */
.forecast-banner { display:flex; align-items:center; gap:16px; background:#fff; border-radius:12px; padding:16px 20px; box-shadow:0 2px 10px rgba(0,0,0,.06); flex-wrap:wrap; }
.forecast-text { flex:1; min-width:200px; }
.forecast-title { font-size:.82rem; font-weight:700; color:#1e293b; margin-bottom:4px; }
.forecast-desc { font-size:.75rem; color:#475569; line-height:1.5; }
.btn-draft { padding:9px 20px; border:1.5px solid #2d7a3a; border-radius:9px; background:#fff; color:#2d7a3a; font-size:.82rem; font-weight:700; cursor:pointer; white-space:nowrap; transition:background .15s; }
.btn-draft:hover { background:#f0fdf4; }

/* ======= CREATE FORM ======= */
.create-layout { display:grid; grid-template-columns:1fr 320px; gap:20px; align-items:start; }
.create-form-panel { background:#fff; border-radius:16px; box-shadow:0 2px 16px rgba(0,0,0,.07); overflow:hidden; }
.create-header { padding:24px 28px 16px; border-bottom:1px solid #f1f5f9; }
.create-title { font-size:1.5rem; font-weight:800; color:#0f172a; margin:0 0 6px; }
.create-sub { font-size:.8rem; color:#64748b; margin:0; }
.create-body { padding:20px 28px; display:flex; flex-direction:column; gap:16px; }
.fg { display:flex; flex-direction:column; gap:6px; }
.fg-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.flbl { font-size:.65rem; font-weight:700; color:#94a3b8; letter-spacing:.5px; }
.fi { width:100%; padding:11px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.88rem; color:#1e293b; outline:none; background:#fff; transition:border-color .2s; box-sizing:border-box; }
.fi:focus { border-color:#6366f1; }
.fi::placeholder { color:#cbd5e1; }
.code-wrap { position:relative; }
.unique-tag { position:absolute; right:10px; top:50%; transform:translateY(-50%); font-size:.6rem; font-weight:700; color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:20px; display:flex; align-items:center; gap:3px; white-space:nowrap; }
.pct-wrap { position:relative; }
.pct-sfx { position:absolute; right:14px; top:50%; transform:translateY(-50%); color:#94a3b8; font-weight:600; }
.date-row { display:flex; align-items:center; gap:8px; }
.date-box { flex:1; position:relative; }
.dic { position:absolute; left:11px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:.78rem; pointer-events:none; }
.di { padding-left:32px; }
.darr { color:#94a3b8; font-size:.78rem; flex-shrink:0; }
.conds { display:flex; flex-wrap:wrap; gap:7px; align-items:center; }
.ctag { display:inline-flex; align-items:center; gap:5px; background:#ede9fe; color:#7c3aed; font-size:.74rem; font-weight:600; padding:5px 10px; border-radius:20px; }
.cdel { background:none; border:none; color:#7c3aed; cursor:pointer; font-size:.62rem; opacity:.7; padding:0; }
.btn-addcond { background:#f8fafc; border:1.5px dashed #cbd5e1; color:#64748b; font-size:.76rem; font-weight:600; padding:5px 12px; border-radius:20px; cursor:pointer; display:flex; align-items:center; gap:5px; }
.cond-dd { background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; box-shadow:0 8px 24px rgba(0,0,0,.1); margin-top:4px; overflow:hidden; }
.copt { display:flex; align-items:center; gap:8px; padding:9px 14px; font-size:.8rem; color:#475569; cursor:pointer; }
.copt:hover { background:#f8fafc; }
.copt i { color:#6366f1; font-size:.78rem; }
.fta { width:100%; padding:12px 14px; border:1.5px solid #e2e8f0; border-radius:10px; font-size:.84rem; color:#475569; outline:none; resize:vertical; background:#f8fafc; font-family:inherit; line-height:1.5; transition:border-color .2s; box-sizing:border-box; }
.fta:focus { border-color:#6366f1; background:#fff; }
.fta::placeholder { color:#cbd5e1; }
.create-footer { display:flex; justify-content:flex-end; gap:12px; padding:16px 28px 22px; border-top:1px solid #f1f5f9; }
.btn-cancel { padding:9px 22px; border:1.5px solid #e2e8f0; border-radius:10px; background:#fff; color:#64748b; font-size:.84rem; font-weight:500; cursor:pointer; }
.btn-activate { display:inline-flex; align-items:center; gap:7px; padding:9px 22px; border:none; border-radius:10px; background:linear-gradient(135deg,#6366f1,#7c3aed); color:#fff; font-size:.84rem; font-weight:700; cursor:pointer; box-shadow:0 4px 14px rgba(99,102,241,.3); transition:opacity .15s; }
.btn-activate:hover { opacity:.9; }

/* AI Side Panel */
.ai-side { display:flex; flex-direction:column; gap:14px; }
.ai-badge-btn { display:inline-flex; align-items:center; gap:7px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.7rem; font-weight:700; padding:9px 16px; border-radius:50px; letter-spacing:.3px; }
.ai-pred-card { background:#fff; border-radius:14px; padding:18px; box-shadow:0 2px 14px rgba(0,0,0,.07); border:1px solid #ede9fe; }
.ai-pred-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
.ai-pred-hd { font-size:.68rem; font-weight:700; color:#7c3aed; display:flex; align-items:center; gap:5px; }
.ai-pred-lbl { font-size:.7rem; color:#94a3b8; margin-bottom:4px; }
.ai-pred-val { font-size:2rem; font-weight:800; color:#1e293b; display:flex; align-items:baseline; gap:8px; }
.ai-pred-tag { font-size:.65rem; font-weight:700; background:#dcfce7; color:#16a34a; padding:2px 8px; border-radius:20px; }
.ai-quote { font-size:.76rem; color:#475569; line-height:1.6; margin:10px 0; padding:9px 12px; background:#f8fafc; border-radius:8px; border-left:3px solid #6366f1; font-style:italic; }
.btn-applyai { width:100%; padding:10px; border:none; border-radius:9px; background:linear-gradient(135deg,#7c3aed,#6366f1); color:#fff; font-size:.82rem; font-weight:700; cursor:pointer; }
.tag-section { background:#fff; border-radius:12px; padding:14px 16px; box-shadow:0 2px 10px rgba(0,0,0,.05); }
.tag-hd { font-size:.63rem; font-weight:700; color:#94a3b8; letter-spacing:.5px; margin-bottom:9px; }
.tags-wrap { display:flex; flex-wrap:wrap; gap:7px; }
.stag { font-size:.74rem; font-weight:600; background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:20px; cursor:pointer; }
.stag:hover { background:#ede9fe; color:#7c3aed; }

/* ======= LỊCH TRÌNH ======= */
.lt-content { display:flex; flex-direction:column; gap:18px; }
.lt-head { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.tl-list { display:flex; flex-direction:column; gap:12px; padding-left:14px; }
.tl-item { display:flex; gap:16px; position:relative; }
.tl-dot { width:14px; height:14px; border-radius:50%; flex-shrink:0; margin-top:8px; z-index:1; }
.dot-green  { background:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,.2); }
.dot-blue   { background:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.2); }
.dot-yellow { background:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,.2); }
.dot-gray   { background:#64748b; box-shadow:0 0 0 3px rgba(100,116,139,.2); }
.tl-card { background:#fff; border-radius:12px; padding:14px 18px; box-shadow:0 2px 10px rgba(0,0,0,.06); flex:1; }
.tl-card-top { display:flex; align-items:center; gap:10px; margin-bottom:7px; }
.tl-date { font-size:.7rem; font-weight:700; color:#475569; background:#f1f5f9; padding:3px 10px; border-radius:20px; }
.tl-st { font-size:.68rem; font-weight:700; padding:3px 10px; border-radius:20px; }
.sl-green  { background:#dcfce7; color:#16a34a; }
.sl-blue   { background:#dbeafe; color:#2563eb; }
.sl-yellow { background:#fef3c7; color:#d97706; }
.sl-gray   { background:#f1f5f9; color:#64748b; }
.tl-name { font-size:.9rem; font-weight:700; color:#1e293b; margin-bottom:7px; }
.tl-meta { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:9px; }
.tl-meta span { font-size:.73rem; color:#64748b; display:flex; align-items:center; gap:4px; }
.tl-meta i { color:#94a3b8; font-size:.66rem; }
.tl-prog-wrap { height:6px; background:#f1f5f9; border-radius:20px; overflow:hidden; margin-bottom:3px; }
.tl-prog { height:100%; border-radius:20px; }
.tl-prog-lbl { font-size:.67rem; color:#94a3b8; }

/* ======= TRANSITION ======= */
.fade-enter-active,.fade-leave-active { transition:opacity .2s ease; }
.fade-enter-from,.fade-leave-to { opacity:0; }
</style>
