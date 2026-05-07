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
            <li class="nav-item">
              <a class="nav-link fw-medium" :class="{ active: activeSection === 'home' }" href="#home" @click.prevent="scrollTo('home')">Trang Chủ</a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link fw-medium" :class="{ active: activeSection === 'about', 'text-muted': activeSection !== 'about' }" href="#about" @click.prevent="scrollTo('about')">Giới Thiệu</a>
            </li>
          </ul>
          <div class="d-flex gap-2">
            <button class="btn btn-outline-kinetic-green rounded-pill px-4 fw-medium" @click="goToSignup">Đăng Ký</button>
            <button class="btn btn-kinetic-green rounded-pill px-4 fw-medium" @click="goToLogin">Đăng Nhập</button>
          </div>
        </div>
      </div>
    </nav>

    <section id="home" class="hero-section position-relative d-flex align-items-center">
      <div class="container position-relative z-1">
        <div class="row">
          <div class="col-lg-6 hero-content">
            <span class="badge badge-purple rounded-pill px-3 py-2 mb-3 fw-semibold text-uppercase tracking-wide">
              Ưu Đãi Đặc Quyền
            </span>
            <h1 class="display-3 fw-bold text-dark lh-sm mb-4">
              Nâng Tầm <br> Thể Chất <span class="text-kinetic-green">Cùng Chúng Tôi</span>
            </h1>
            <p class="text-muted fs-5 mb-5 pe-lg-5 lh-base">
              Trải nghiệm môi trường tập luyện hiện đại. Giảm ngay 30% cho tháng đầu tiên tham gia cùng hệ thống thiết bị thông minh.
            </p>
            <div class="d-flex gap-3">
              <button class="btn btn-kinetic-green rounded-pill px-4 py-3 fw-semibold">Tham Gia Ngay</button>
              <button class="btn btn-light rounded-pill px-4 py-3 fw-semibold shadow-sm text-dark bg-white">Xem Chi Tiết</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="py-5 bg-light-gray section-padding">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5 mb-5 mb-lg-0">
            <div class="feature-grid">
              <div class="grid-col mt-4">
                <div class="grid-item img-1 shadow-sm rounded-4 mb-3"></div>
                <div class="grid-item bg-kinetic-green text-white shadow-sm rounded-4 p-4 d-flex align-items-end">
                  <h4 class="fw-bold mb-0">Theo Dõi<br>Thông Minh</h4>
                </div>
              </div>
              <div class="grid-col">
                <div class="grid-item bg-purple text-white shadow-sm rounded-4 p-4 mb-3 d-flex align-items-center justify-content-center">
                  <h4 class="fw-bold mb-0 text-center">Tối Ưu<br>Cá Nhân Hóa</h4>
                </div>
                <div class="grid-item img-2 shadow-sm rounded-4"></div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6 offset-lg-1">
            <h2 class="display-5 fw-bold text-dark lh-sm mb-4">Không Gian<br>Tập Luyện<br>Đẳng Cấp.</h2>
            <p class="text-muted mb-5 lh-lg">
              Kinetic Gym không chỉ là nơi tập luyện; đó là một hệ sinh thái sống động. Chúng tôi thay thế tiếng ồn công nghiệp của các phòng tập thông thường bằng một môi trường hiện đại, thấu hiểu cơ thể bạn.
            </p>
            <div class="row g-4">
              <div class="col-md-6">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                  <i class="bi bi-robot fs-4 text-purple mb-3 d-block"></i>
                  <h6 class="fw-bold text-dark">Điều Chỉnh Thích Ứng</h6>
                  <p class="text-muted small mb-0 mt-2">Thay đổi kháng lực và thiết bị theo thời gian thực dựa trên các chỉ số hoạt động.</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="bg-white p-4 rounded-4 shadow-sm h-100">
                  <i class="bi bi-activity fs-4 text-kinetic-green mb-3 d-block"></i>
                  <h6 class="fw-bold text-dark">Luồng Sinh Trắc</h6>
                  <p class="text-muted small mb-0 mt-2">Ánh sáng và âm thanh môi trường đồng bộ với nhịp độ tập luyện của bạn.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>



    <footer class="bg-light-gray py-4 border-top">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <div class="fw-bold text-kinetic-green mb-3 mb-md-0">Phòng Tập Kinetic</div>
        <ul class="list-inline mb-3 mb-md-0 fs-xs text-muted text-uppercase tracking-wide">
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Bảo Mật</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Điều Khoản</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Tuyển Dụng</a></li>
          <li class="list-inline-item mx-3"><a href="#" class="text-decoration-none text-muted">Liên Hệ</a></li>
        </ul>
        <div class="text-muted fs-xs">© 2024 PHÒNG TẬP KINETIC. BẢO LƯU MỌI QUYỀN.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goToLogin = () => router.push('/dangnhap')
const goToSignup = () => router.push('/dangky')

const activeSection = ref('home')
let rafId = null

const scrollTo = (sectionId) => {
  const el = document.getElementById(sectionId)
  if (el) {
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70
    const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight
    window.scrollTo({ top, behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

const updateActiveSection = () => {
  const sections = ['home', 'about']
  const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70
  let current = 'home'
  for (const id of sections) {
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top - navbarHeight - 60
      if (top <= 0) current = id
    }
  }
  activeSection.value = current
  rafId = null
}

const handleScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(updateActiveSection)
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
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
.btn-outline-kinetic-green {
  background-color: transparent;
  color: var(--kinetic-green);
  border: 2px solid var(--kinetic-green);
}
.btn-outline-kinetic-green:hover {
  background-color: var(--kinetic-green);
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
.nav-link {
  position: relative;
  color: #6c757d;
  transition: color 0.3s ease;
}
.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: var(--kinetic-green);
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 2px;
}
.nav-link.active {
  color: var(--kinetic-green) !important;
}
.nav-link.active::after {
  width: 70%;
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