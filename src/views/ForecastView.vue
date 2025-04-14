<template>
  <div class="forecast-view">
    <h1>Прогноз</h1>
    <div class="date-range">
      <DatePicker v-model="startDate" placeholder="Дата начала" />
      <DatePicker v-model="endDate" placeholder="Дата конца" />
      <Button label="Обновить" @click="fetchForecast" />
    </div>
    <ForecastChart v-if="forecastData" :forecast-data="forecastData" />
    <div v-else-if="loading" class="loading">
      Загрузка данных...
    </div>
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import ForecastChart from '@/components/ForecastChart.vue';
import { forecastService } from '@/api/forecast';

export default {
  name: 'ForecastView',
  components: {
    ForecastChart,
    DatePicker,
    Button
  },
  setup() {
    const toast = useToast();
    const startDate = ref(new Date());
    const endDate = ref(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // +30 дней
    const forecastData = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const formatDate = (date) => {
      return date.toISOString().split('T')[0];
    };

    const fetchForecast = async () => {
      loading.value = true;
      error.value = null;
      try {
        const data = await forecastService.getForecast(
          formatDate(startDate.value),
          formatDate(endDate.value)
        );
        forecastData.value = data;
      } catch (err) {
        error.value = 'Ошибка при загрузке данных прогноза';
        toast.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Не удалось загрузить данные прогноза',
          life: 3000
        });
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchForecast();
    });

    return {
      startDate,
      endDate,
      forecastData,
      loading,
      error,
      fetchForecast
    };
  }
};
</script>

<style scoped>
.forecast-view {
  padding: 20px;
}

.date-range {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
}

.error {
  color: #ef4444;
}
</style> 