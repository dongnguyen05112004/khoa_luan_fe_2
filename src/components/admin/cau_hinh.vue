<template>
 
</template>

<script>
export default {
  name: 'CauHinh',
  data() {
    return {
      saved: false,
      config: {
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        dateFormat: 'DD/MM/YYYY',
        sessionTimeout: 30,
        sessionWarning: 5,
        rememberDays: 7,
        minPasswordLength: 8,
        requireSpecialChar: true,
        enable2FA: false,
      },
    }
  },
  methods: {
    saveAll() {
      this.saved = true
      setTimeout(() => { this.saved = false }, 3000)
    },
  },
}
</script>

<style scoped>
.page-wrapper { padding: 0; }

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
}
.page-desc { color: #64748b; font-size: 0.875rem; margin: 0; }

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2d7a3a;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-save:hover { background: #1a5c28; }

/* Grid */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
}

/* Card */
.config-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}
.config-card-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.config-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #fff;
  flex-shrink: 0;
}
.bg-blue   { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.bg-green  { background: linear-gradient(135deg, #22c55e, #15803d); }
.bg-purple { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
.bg-orange { background: linear-gradient(135deg, #f97316, #c2410c); }

.config-card-title { font-weight: 700; color: #1e293b; font-size: 0.95rem; }
.config-card-sub   { font-size: 0.78rem; color: #64748b; margin-top: 2px; }

.config-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }

/* Form rows */
.form-row { display: flex; flex-direction: column; gap: 6px; }
.form-row label { font-size: 0.82rem; font-weight: 600; color: #475569; }
.form-row select, .form-row input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 0.875rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.form-row select:focus, .form-row input:focus { border-color: #2d7a3a; }
.input-unit-wrap { display: flex; align-items: center; gap: 8px; }
.input-unit-wrap input { width: auto; flex: 1; }
.input-unit { font-size: 0.82rem; color: #64748b; white-space: nowrap; }

/* Toggle */
.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px solid #f1f5f9;
}
.toggle-label { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
.toggle-sub   { font-size: 0.75rem; color: #94a3b8; margin-top: 2px; }

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: #e2e8f0;
  position: relative;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
}
.toggle-switch.on { background: #2d7a3a; }
.toggle-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  transition: left 0.25s;
}
.toggle-switch.on .toggle-thumb { left: 23px; }

/* Info rows */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  padding: 6px 0;
  border-bottom: 1px solid #f8fafc;
  color: #475569;
}
.info-row strong { color: #1e293b; }

/* Toast */
.toast-msg {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a5c28;
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  z-index: 9999;
}
.toast-fade-enter-active, .toast-fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-fade-enter-from, .toast-fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
