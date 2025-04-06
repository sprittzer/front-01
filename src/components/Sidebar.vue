<template>
  <div class="sidebar" :class="{ 'sidebar-collapsed': collapsed }">
    <div class="logout-section">
      <div class="logout-button" @click="logout">
        <i class="pi pi-sign-out" />
        <span class="label" :class="{ 'label-hidden': collapsed }">Выйти</span>
      </div>
    </div>
    
    <div class="sidebar-items">
      <div 
        v-for="item in sidebarItems" 
        :key="item.label" 
        class="sidebar-item" 
        :class="{ 'active': $route.path.startsWith(item.route) }"
        @click="router.push(item.route)"
      >
        <i :class="`pi ${item.icon}`" class="item-icon" />
        <span class="label" :class="{ 'label-hidden': collapsed }">
          {{ item.label }}
        </span>
      </div>
    </div>
    
    <div class="sidebar-footer">
      <button class="toggle-button" @click="toggleCollapse">
        <i :class="collapsed ? 'pi pi-arrow-circle-right' : 'pi pi-arrow-circle-left'" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const $route = useRoute();
const collapsed = ref(false);

async function logout() {
  const token = localStorage.getItem('token');
  if (!token) {
    router.push('/login');
    return;
  }

  try {
    await axios.post('https://quartzcrystal.pythonanywhere.com/logout/', null, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    localStorage.removeItem('token');
    router.push('/login');
  } catch (error) {
    console.error('Ошибка при выходе:', error);
    localStorage.removeItem('token'); // даже если сервер не ответил — чистим токен
    router.push('/login');
  }
}
function toggleCollapse() {
  collapsed.value = !collapsed.value;
  console.log('Sidebar collapsed:', collapsed.value); // Для отладки
}

const sidebarItems = [
  { label: 'Дашборд', icon: 'pi-home', route: '/dashboard' },
  { label: 'Настройки', icon: 'pi-cog', route: '/settings' },
];
</script>

<style scoped>
.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 180px;
    background-color: #F3F3EE;
    display: flex;
    flex-direction: column;
    padding: 20px 0;
    z-index: 1000;
    transition: all 0.3s ease;
    background-image: url('noise.jpeg');
    background-size: cover;
}

.sidebar-collapsed {
    width: 70px;
}

/* Секция выхода */
.logout-section {
    padding: 0 15px 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-collapsed .logout-section {
    padding-bottom: 15px;
    border-bottom: none;
}

/* Кнопка выхода */
.logout-button {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    color: #EF4444;
    justify-content: flex-start;
}

.sidebar-collapsed .logout-button {
    justify-content: center;
    padding: 0;
    height: 44px;
    width: 44px;
    margin: 0 auto;
    border-radius: 10px;
}

.logout-button:hover {
    background-color: rgba(239, 68, 68, 0.1);
}

.logout-button i {
    font-size: 20px;
    margin-right: 12px;
}

.sidebar-collapsed .logout-button i {
    margin-right: 0;
}

/* Основные пункты меню */
.sidebar-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 15px;
    overflow-y: auto;
    scrollbar-width: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 10px;
}

.sidebar-collapsed .sidebar-items {
    border-bottom: none;
}

.sidebar-items::-webkit-scrollbar {
    display: none;
}

.sidebar-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    box-sizing: border-box;
    justify-content: flex-start;
    background-color: transparent;
}

.sidebar-collapsed .sidebar-item {
    justify-content: center;
    padding: 0;
    height: 44px;
    width: 44px;
    margin: 0 auto 8px;
    border-radius: 10px;
}

.sidebar-item:hover {
    background-color: rgba(0, 0, 0, 0.06);
}

.sidebar-item.active {
    background-color: rgba(0, 0, 0, 0.1);
}

.item-icon {
    font-size: 20px;
    color: #6B7280;
    min-width: 24px;
    text-align: center;
    transition: all 0.2s;
}

.sidebar-collapsed .item-icon {
    margin: 0;
    font-size: 22px;
}

.label {
    font-size: 15px;
    font-weight: 500;
    color: #4B5563;
    white-space: nowrap;
    transition: all 0.3s;
    margin-left: 12px;
}

.sidebar-collapsed .label {
    display: none;
}

/* Кнопка переключения */
.toggle-button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #6B7280;
    background-color: rgba(231, 231, 231, 0.3);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.toggle-button:hover {
    background-color: rgba(231, 231, 231, 0.5);
    color: #4B5563;
    transform: scale(1.1);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

/* Нижняя кнопка переключения */
.sidebar-footer {
    margin-top: auto;
    padding: 15px;
    display: flex;
    justify-content: center;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-collapsed .sidebar-footer {
    border-top: none;
}

@media (max-width: 768px) {
    .sidebar {
        transform: translateX(-100%);
    }
    
    .sidebar-collapsed {
        transform: translateX(0);
        width: 70px;
    }
}
</style>