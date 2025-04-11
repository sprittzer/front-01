<!-- App.vue -->
<template>
  <Toast />
  <div class="main-container">
    <Sidebar v-if="isAuthenticated" />
    <div class="main-content" :class="{ 'no-sidebar': !isAuthenticated }">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from './stores/auth';
import Toast from 'primevue/toast';
import Sidebar from './components/Sidebar.vue';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  // Проверяем, был ли только что выполнен вход
  const justLoggedIn = sessionStorage.getItem('justLoggedIn');
  if (justLoggedIn) {
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Вы успешно вошли в систему',
      life: 3000
    });
    sessionStorage.removeItem('justLoggedIn');
  }
});
</script>

<style>
/* Глобальные стили */
.main-content.no-sidebar {
  margin-left: 0;
  margin: 10px;
}
</style>
