<template>
  <div class="start-page">
    <!-- NAVBAR -->
    <nav class="sg-navbar">
      <div class="sg-brand">
        <span class="sg-brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="sg-brand-name">SmartGym AI</span>
      </div>
      <div class="sg-nav-actions">
        <router-link to="/dangnhap" class="btn-signin">Sign In</router-link>
        <router-link to="/dangnhap" class="btn-signup">Sign Up</router-link>
      </div>
    </nav>

    <!-- HERO -->
    <section class="sg-hero">
      <div class="sg-hero-content">
        <p class="sg-hero-label">TRANSFORM TODAY</p>
        <h1 class="sg-hero-title">Elevate Your<br>Strength</h1>
        <p class="sg-hero-desc">
          Unlock your full potential with SmartGym AI's personalized<br>
          training ecosystem. Real-time insights, expert plans, and<br>
          elite results.
        </p>
        <div class="sg-hero-btns">
          <button class="btn-trial">Start Free Trial</button>
          <button class="btn-demo">Watch Demo</button>
        </div>
      </div>
    </section>

    <!-- EXPERIENCE EXCELLENCE -->
    <section class="sg-features">
      <h2 class="sg-section-title">Experience Excellence</h2>
      <p class="sg-section-sub">Combining advanced technology and human fitness expertise.</p>
      <div class="sg-cards">
        <div class="sg-card">
          <div class="sg-card-img-wrap">
            <img src="../../assets/gym_equipment.png" alt="Equipment" />
          </div>
          <h3>State-of-the-art equipment</h3>
          <p>Access the latest fitness technology and hardware designed for maximum training efficiency.</p>
        </div>
        <div class="sg-card">
          <div class="sg-card-img-wrap">
            <img src="../../assets/gym_classes.png" alt="Classes" />
          </div>
          <h3>Inspiring classes</h3>
          <p>Join a community of motivated individuals in our expert-led sessions across all fitness levels.</p>
        </div>
        <div class="sg-card">
          <div class="sg-card-img-wrap">
            <img src="../../assets/ai_coaching.png" alt="AI Coaching" />
          </div>
          <h3>AI-powered coaching</h3>
          <p>Get real-time feedback and personalized workout plans driven by your individual biometric data.</p>
        </div>
      </div>
    </section>

    <!-- TODAY'S SCHEDULE -->
    <section class="sg-schedule">
      <div class="sg-schedule-header">
        <h2>Today's Schedule</h2>
        <a href="#" class="sg-view-all">View Full Calendar</a>
      </div>
      <div class="sg-schedule-list">
        <div class="sg-schedule-item" v-for="item in schedule" :key="item.id">
          <div class="sg-time-badge" :class="item.period">
            <span class="sg-time">{{ item.time }}</span>
            <span class="sg-period">{{ item.period }}</span>
          </div>
          <div class="sg-schedule-info">
            <div class="sg-schedule-name">{{ item.name }}</div>
            <div class="sg-schedule-coach">{{ item.coach }} · {{ item.location }}</div>
          </div>
          <button class="btn-join">Join</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'StartPage',
  data() {
    return {
      schedule: [
        { id: 1, time: '08:00', period: 'AM', name: 'Power Lifting Fundamentals', coach: 'Coach Marcus', location: 'Studio A' },
        { id: 2, time: '12:30', period: 'PM', name: 'Zen Flow Yoga',             coach: 'Coach Sarah',  location: 'Zen Deck' },
      ],
    }
  },
}
</script>

<style scoped>
/* ---- Base ---- */
.start-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'Segoe UI', sans-serif;
  color: #1e293b;
}

/* ---- Navbar ---- */
.sg-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 48px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
}
.sg-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sg-brand-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.2px;
}
.sg-nav-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.btn-signin {
  padding: 7px 18px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}
.btn-signin:hover { background: #f1f5f9; color: #1e293b; }
.btn-signup {
  padding: 7px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: #3b82f6;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-signup:hover { background: #2563eb; color: #fff; }

/* ---- Hero ---- */
.sg-hero {
  margin: 28px 48px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1e293b 0%, #2d3a4a 60%, #3a4a5c 100%);
  padding: 60px 52px 52px;
  position: relative;
  overflow: hidden;
  min-height: 300px;
}
.sg-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 80% 50%, rgba(59,130,246,0.15) 0%, transparent 60%);
}
.sg-hero-content { position: relative; z-index: 1; max-width: 420px; }
.sg-hero-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #60a5fa;
  text-transform: uppercase;
  margin-bottom: 14px;
}
.sg-hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
  margin-bottom: 18px;
}
.sg-hero-desc {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.7);
  line-height: 1.65;
  margin-bottom: 28px;
}
.sg-hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.btn-trial {
  padding: 11px 26px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: #3b82f6;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}
.btn-trial:hover { background: #2563eb; transform: translateY(-1px); }
.btn-demo {
  padding: 11px 26px;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-demo:hover { background: rgba(255,255,255,0.2); }

/* ---- Features ---- */
.sg-features {
  padding: 40px 48px 20px;
}
.sg-section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}
.sg-section-sub {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 28px;
}
.sg-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.sg-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}
.sg-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  transform: translateY(-3px);
}
.sg-card-img-wrap {
  width: 100%;
  height: 170px;
  overflow: hidden;
  background: #e8ede8;
}
.sg-card-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.sg-card h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 16px 16px 6px;
}
.sg-card p {
  font-size: 0.82rem;
  color: #64748b;
  margin: 0 16px 18px;
  line-height: 1.55;
}

/* ---- Schedule ---- */
.sg-schedule {
  padding: 32px 48px 48px;
}
.sg-schedule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.sg-schedule-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}
.sg-view-all {
  font-size: 0.82rem;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}
.sg-view-all:hover { text-decoration: underline; }
.sg-schedule-list { display: flex; flex-direction: column; gap: 12px; }
.sg-schedule-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 20px;
  transition: box-shadow 0.2s;
}
.sg-schedule-item:hover { box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
.sg-time-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  height: 52px;
  border-radius: 10px;
  background: #f0f9ff;
  padding: 4px 8px;
}
.sg-time-badge.AM { background: #eff6ff; }
.sg-time-badge.PM { background: #f0fdf4; }
.sg-time {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
}
.sg-period {
  font-size: 0.65rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.sg-schedule-info { flex: 1; }
.sg-schedule-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
}
.sg-schedule-coach {
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 2px;
}
.btn-join {
  padding: 7px 22px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-join:hover { background: #dbeafe; }
</style>
