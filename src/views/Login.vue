<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>Вход в систему</h2>
      </div>
      
      <div class="login-form">
        <div class="input-field">
          <span class="p-input-icon-left">
            <i class="pi pi-user" />
            <InputText 
              v-model="login" 
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
              :inputStyle="{width: '100%', paddingLeft: '2.5rem'}"
            />
          </span>
        </div>

        <Button 
          @click="loginUser" 
          label="Войти" 
          class="login-button"
          icon="pi pi-sign-in"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const login = ref('');
const password = ref('');
const router = useRouter();

async function loginUser() {
  if (login.value && password.value) {
    router.push('/dashboard');
  } else {
    alert('Заполните все поля');
  }
}
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

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: #757575;
  font-size: 0.9rem;
}

.login-footer a {
  color: #3f51b5;
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
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