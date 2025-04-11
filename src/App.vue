<!-- App.vue -->
<template>
  <Toast />
  <div class="main-container">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import Sidebar from './components/Sidebar.vue';

const router = useRouter();
const toast = useToast();

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
</style>
