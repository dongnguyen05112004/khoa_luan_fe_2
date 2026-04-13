<template>
  <div class="kinetic-theme">
    <nav class="navbar navbar-expand-lg bg-white sticky-top py-3">
      <div class="container">
        <a class="navbar-brand fw-bold text-dark fs-4" href="#">The Kinetic Atelier</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mx-auto">
            <li class="nav-item"><a class="nav-link active fw-medium" href="#">Home</a></li>
            <li class="nav-item"><a class="nav-link text-muted" href="#">Plans</a></li>
            <li class="nav-item"><a class="nav-link text-muted" href="#">About</a></li>
          </ul>
          <button class="btn btn-kinetic-green rounded-pill px-4 fw-medium">Login</button>
        </div>
      </div>
    </nav>

    <section class="hero-section position-relative d-flex align-items-center">
      <div class="container position-relative z-1">
        <div class="row">
          <div class="col-lg-6 hero-content">
            <span class="badge badge-purple rounded-pill px-3 py-2 mb-3 fw-semibold text-uppercase tracking-wide">
              Limited Time Exclusive
            </span>
            <h1 class="display-3 fw-bold text-dark lh-sm mb-4">
              Elevate <br> Your <span class="text-kinetic-green">Kinetic</span> <br> Soul
            </h1>
            <p class="text-muted fs-5 mb-5 pe-lg-5 lh-base">
              Experience the future of fitness. Get 30% off your first month with SmartGym AI's intelligent tracking system.
            </p>
            <div class="d-flex gap-3">
              <button class="btn btn-kinetic-green rounded-pill px-4 py-3 fw-semibold">Join the Atelier</button>
              <button class="btn btn-light rounded-pill px-4 py-3 fw-semibold shadow-sm text-dark bg-white">View Offer Details</button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="ai-floating-card shadow-lg bg-white rounded-4 p-3 d-flex align-items-start gap-3">
        <div class="icon-circle bg-purple text-white d-flex align-items-center justify-content-center rounded-circle mt-1">
          <i class="bi bi-cpu"></i>
        </div>
        <div>
          <h6 class="fw-bold mb-1 fs-sm">AI ANALYSIS</h6>
          <p class="text-muted fs-xs mb-2">Optimization Ready</p>
          <p class="small text-dark mb-2 lh-sm" style="font-size: 0.8rem;">
            Your biometric patterns suggest a high-intensity focus today. Optimal recovery window: 4:00 PM.
          </p>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar bg-purple" role="progressbar" style="width: 75%"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light-gray section-padding">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5 mb-5 mb-lg-0">
            <div class="feature-grid">
              <div class="grid-col mt-4">
                <div class="grid-item img-1 shadow-sm rounded-4 mb-3"></div>
                <div class="grid-item bg-kinetic-green text-white shadow-sm rounded-4 p-4 d-flex align-items-end">
                  <h4 class="fw-bold mb-0">Neural<br>Tracking</h4>
                </div>
              </div>
              <div class="grid-col">
                <div class="grid-item bg-purple text-white shadow-sm rounded-4 p-4 mb-3 d-flex align-items-center justify-content-center">
                  <h4 class="fw-bold mb-0 text-center">Personal<br>Synergy</h4>
                </div>
                <div class="grid-item img-2 shadow-sm rounded-4"></div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6 offset-lg-1">
            <h2 class="display-5 fw-bold text-dark lh-sm mb-4">A Sanctuary<br>Designed<br>by Intelligence.</h2>
            <p class="text-muted mb-5 lh-lg">
              SmartGym AI isn't just a facility; it's a living ecosystem. We've replaced the industrial noise of standard gyms with an editorial, AI-driven environment that understands your physiology.
            </p>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                  <i class="bi bi-robot fs-4 text-purple mb-3 d-block"></i>
                  <h6 class="fw-bold text-dark">Adaptive Load</h6>
                  <p class="text-muted small mb-0 mt-2">Real-time resistance adjustment based on muscular fatigue indicators.</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                  <i class="bi bi-activity fs-4 text-kinetic-green mb-3 d-block"></i>
                  <h6 class="fw-bold text-dark">Biometric Flow</h6>
                  <p class="text-muted small mb-0 mt-2">Environment lighting and acoustics that sync with your heart rate variability.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 section-padding bg-light-gray">
      <div class="container text-center">
        <h2 class="display-6 fw-bold text-dark mb-3">Choose Your Tier</h2>
        <p class="text-muted mb-5">Investment in your physical peak requires a plan that matches your ambition.<br>No hidden fees, only pure performance.</p>
        
        <div class="row justify-content-center align-items-center g-4 mt-4">
          <div class="col-lg-3 col-md-6">
            <div class="card pricing-card border-0 bg-light-subtle rounded-4 text-start p-4 h-100">
              <h6 class="text-kinetic-green fw-bold mb-3">Basic</h6>
              <div class="d-flex align-items-baseline mb-4">
                <h2 class="fw-bold mb-0 me-1">500,000</h2>
                <span class="text-muted small">VND/month</span>
              </div>
              <ul class="list-unstyled mb-5 pricing-list">
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> 24/7 Premium Access</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> Daily Performance Reports</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> Locker & Shower Suite</li>
              </ul>
              <button class="btn btn-light rounded-pill w-100 py-2 fw-medium mt-auto text-dark bg-white border">Start Basic</button>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            <div class="card pricing-card pro-card border-0 bg-white rounded-4 text-start p-5 shadow position-relative">
              <span class="position-absolute top-0 start-50 translate-middle badge bg-purple rounded-pill px-3 py-2 text-uppercase tracking-wide" style="font-size: 0.7rem;">
                Most Intelligent
              </span>
              <h6 class="text-kinetic-green fw-bold mb-3 mt-2">Pro</h6>
              <div class="d-flex align-items-baseline mb-4">
                <h2 class="fw-bold mb-0 me-1 display-6">1,200,000</h2>
                <span class="text-muted small">VND/month</span>
              </div>
              <ul class="list-unstyled mb-5 pricing-list">
                <li class="mb-3 text-dark small"><i class="bi bi-check2 text-kinetic-green fw-bold me-2"></i> <b>AI Personal Trainer</b></li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 text-kinetic-green me-2"></i> Real-time Form Correction</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 text-kinetic-green me-2"></i> Nutritional Synthesis AI</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 text-kinetic-green me-2"></i> Priority Equipment Booking</li>
              </ul>
              <button class="btn btn-kinetic-green rounded-pill w-100 py-3 fw-semibold mt-auto shadow-sm">Select Pro</button>
            </div>
          </div>

          <div class="col-lg-3 col-md-6">
            <div class="card pricing-card border-0 bg-light-subtle rounded-4 text-start p-4 h-100">
              <h6 class="text-kinetic-green fw-bold mb-3">Elite</h6>
              <div class="d-flex align-items-baseline mb-4">
                <h2 class="fw-bold mb-0 me-1">2,500,000</h2>
                <span class="text-muted small">VND/month</span>
              </div>
              <ul class="list-unstyled mb-5 pricing-list">
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> All Pro Features</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> 1-on-1 Human Specialist</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> Private Recovery Lounge</li>
                <li class="mb-3 text-muted small"><i class="bi bi-check2 me-2"></i> Bi-Weekly Body Composition</li>
              </ul>
              <button class="btn btn-light rounded-pill w-100 py-2 fw-medium mt-auto text-dark bg-white border">Start Elite</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-light-gray py-4 border-top">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div class="fw-bold text-kinetic-green mb-3 mb-md-0">The Kinetic Atelier</div>
        <ul class="list-inline mb-3 mb-md-0 fs-xs text-muted text-uppercase tracking-wide">
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Privacy</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Terms</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Careers</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Contact</a></li>
        </ul>
        <div class="text-muted fs-xs">© 2024 THE KINETIC ATELIER. ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* --- Core Variables & Typography --- */
.kinetic-theme {
  --kinetic-green: #3B7A49;
  --kinetic-purple: #9b5de5;
  --light-bg: #F4F5F7;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #212529;
}

.text-kinetic-green { color: var(--kinetic-green) !important; }
.bg-kinetic-green { background-color: var(--kinetic-green) !important; }
.btn-kinetic-green {
  background-color: var(--kinetic-green);
  color: white;
  border: none;
}
.btn-kinetic-green:hover {
  background-color: #2c5c37;
  color: white;
}

.text-purple { color: var(--kinetic-purple) !important; }
.bg-purple { background-color: var(--kinetic-purple) !important; }
.badge-purple {
  background-color: rgba(155, 93, 229, 0.1);
  color: var(--kinetic-purple);
}

.bg-light-gray { background-color: var(--light-bg); }
.section-padding { padding-top: 100px; padding-bottom: 100px; }
.tracking-wide { letter-spacing: 0.05em; }
.fs-sm { font-size: 0.875rem; }
.fs-xs { font-size: 0.75rem; }

/* --- Navbar --- */
.nav-link.active {
  color: var(--kinetic-green) !important;
  position: relative;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 80%;
  height: 2px;
  background-color: var(--kinetic-green);
}

/* --- Hero Section --- */
.hero-section {
  min-height: 85vh;
  background-image: linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 40%, rgba(255,255,255,0) 100%), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
}
.hero-content { padding-top: 50px; }

/* Floating Card */
.ai-floating-card {
  position: absolute;
  bottom: 15%;
  right: 15%;
  max-width: 320px;
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9) !important;
  z-index: 10;
}
.icon-circle {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

/* --- Features Section (Masonry-like Grid) --- */
.feature-grid {
  display: flex;
  gap: 20px;
}
.grid-col {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.grid-item {
  height: 220px;
  background-size: cover;
  background-position: center;
}
.img-1 { background-image: url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop'); }
.img-2 { background-image: url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1000&auto=format&fit=crop'); }

/* --- Pricing Section --- */
.pricing-card {
  transition: transform 0.3s ease;
}
.pro-card {
  transform: scale(1.05);
  z-index: 2;
  border-radius: 24px !important;
}
.bg-light-subtle { background-color: #f1f3f5 !important; }

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .hero-section {
    background-image: linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48');
  }
  .ai-floating-card {
    position: relative;
    right: auto;
    bottom: auto;
    margin-top: 30px;
  }
  .pro-card {
    transform: scale(1);
  }
}
</style>