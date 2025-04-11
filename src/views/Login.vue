<template>
  <div class="login-container">
    <Toast />
    <div class="login-card">
      <div class="login-header">
        <h2>Вход в систему</h2>
      </div>

      <div class="login-form">
        <div class="input-field">
          <span class="p-input-icon-left">
            <i class="pi pi-user" />
            <InputText 
              v-model="username" 
              placeholder="Логин"
              class="custom-input"
            />
          </span>
        </div>

        <div class="input-field">
          <span class="p-input-icon-left">
            <i class="pi pi-lock" />
            <Password 
              v-model="password" 
              placeholder="Пароль"
              :feedback="false"
              toggleMask
              inputClass="password-input"
              :inputStyle="{ width: '100%', paddingLeft: '2.5rem' }"
            />
          </span>
        </div>

        <Button 
          @click="handleLogin" 
          label="Войти" 
          class="login-button"
          icon="pi pi-sign-in"
          :loading="isLoading"
        />

        <p v-if="error" class="error-message">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

const username = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const router = useRouter();
const auth = useAuthStore();
const toast = useToast();

const handleLogin = async () => {
  error.value = '';
  isLoading.value = true;
  
  try {
    await auth.loginUser(username.value, password.value);
    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Вы успешно вошли в систему',
      life: 3000
    });
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  } catch (err) {
    error.value = err?.error || 'Ошибка входа';
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.value,
      life: 3000
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h2 {
  color: #2c3e50;
  font-weight: 600;
  margin: 0;
}

.input-field {
  margin-bottom: 1.5rem;
}

:deep(.custom-input) {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

:deep(.custom-input:hover) {
  border-color: #bdbdbd;
}

:deep(.custom-input:focus) {
  outline: none;
  border-color: #3f51b5;
  box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
}

:deep(.p-password) {
  width: 100%;
}

:deep(.password-input) {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

:deep(.p-password-panel) {
  display: none;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background: #3f51b5;
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 1rem;
  transition: background 0.2s;
}

.login-button:hover {
  background: #354497;
}

.login-button:active {
  background: #2c387e;
}

.error-message {
  color: #ef4444;
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.p-input-icon-left {
  position: relative;
  display: block;
}

.p-input-icon-left i {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #757575;
}
</style>