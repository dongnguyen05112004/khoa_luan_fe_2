<template>
  <div class="nhanvien-layout">
    <aside class="sidebar">
      <h2>Nhân Viên</h2>
      <nav>
        <router-link to="/nhanvien">Trang chủ</router-link>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'NhanVienLayout',
}
</script>

<style scoped>
.nhanvien-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  background: #0f4c6e;
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
  color: #bae6fd;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s;
}
.sidebar nav a:hover,
.sidebar nav a.router-link-active {
  background: #075985;
  color: #fff;
}
.content {
  flex: 1;
  padding: 24px;
  background: #f0f9ff;
}
</style>
