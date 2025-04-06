<template>
  <div class="settings-stub">
    <div class="stub-container">
      <div class="stub-icon">
        <i class="pi pi-cog" style="font-size: 4rem"></i>
      </div>
      <h2>Раздел настроек в разработке</h2>
      <p class="stub-description">
        Наша команда активно работает над этим разделом.<br>
        Скоро здесь появятся новые возможности для персонализации вашего опыта.
      </p>
      <div class="stub-progress">
        <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
        <p class="progress-text">Идет разработка...</p>
      </div>
      <Button 
        label="Вернуться на главную" 
        icon="pi pi-arrow-left"
        class="stub-button"
        @click="goToDashboard"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ProgressBar from 'primevue/progressbar';
import Button from 'primevue/button';

const router = useRouter();

const goToDashboard = () => {
  router.push('/');
};
</script>

<style scoped>
.settings-stub {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
  padding: 2rem;
  background-color: #f8f9fa;
}

.stub-container {
  max-width: 500px;
  width: 100%;
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.stub-icon {
  color: #6366f1;
  margin-bottom: 1.5rem;
  animation: spin 8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h2 {
  color: #2d3748;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.stub-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.stub-progress {
  margin: 2rem 0;
}

.progress-text {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.stub-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: #6366f1;
  border: none;
  transition: all 0.3s ease;
}

.stub-button:hover {
  background: #4f46e5;
  transform: translateY(-2px);
}

.stub-button:active {
  transform: translateY(0);
}

@media (max-width: 600px) {
  .settings-stub {
    padding: 1rem;
  }
  
  .stub-container {
    padding: 2rem 1.5rem;
  }
  
  h2 {
    font-size: 1.5rem;
  }
}
</style>