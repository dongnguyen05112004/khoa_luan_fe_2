<template>
  <div class="khachhang-layout">
    <aside class="sidebar">
      <h2>Khách Hàng</h2>
      <nav>
        <router-link to="/chisosuckhoe">Chỉ số sức khỏe</router-link>
        <router-link to="/histori">Lịch sử</router-link>
        <router-link to="/tientrinhtapluyen">Tiến trình tập luyện</router-link>
        <router-link to="/hosocanhan">Hồ sơ cá nhân</router-link>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'KhachHangLayout',
}
</script>

<style scoped>
.khachhang-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  background: #14532d;
  color: #fff;
  padding: 24px 16px;
}
.sidebar h2 {
  margin-bottom: 24px;
  font-size: 1.2rem;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar nav a {
  color: #bbf7d0;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background: #166534;
  color: #fff;
}
.content {
  flex: 1;
  padding: 24px;
  background: #f0fdf4;
}
</style>
