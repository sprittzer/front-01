<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>
    <FileUpload />

    <div class="filters">
      <CategoryFilter @category-selected="onCategorySelected" />
      <DateRangePicker @date-range-selected="onDateRangeSelected" />
    </div>

    <!-- Основной график прогнозов -->
    <div class="main-chart-container">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">📊</span>
          <span>Фактические и прогнозируемые продажи</span>
        </template>
        <template #content>
          <div v-if="loading">Загрузка...</div>
          <div v-else-if="errorMessage">{{ errorMessage }}</div>
          <Chart v-else type="line" :data="salesChartData" :options="salesChartOptions" class="main-chart" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import FileUpload from '../components/FileUpload.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import axios from 'axios'

// Filters
const selectedCategory = ref('')
const startDate = ref('2024-08-01') // Default start date
const endDate = ref('2024-11-15') // Default end date
const categories = ref([]) // Categories from API

// Chart data and options
const salesChartData = ref({})
const salesChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 12
        },
        color: '#5A5A5A'
      }
    },
    tooltip: {
      backgroundColor: '#2D3748',
      titleFont: {
        family: "'Inter', sans-serif",
        size: 14
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 12
      },
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} тыс. руб.`
        }
      }
    }
  },
  scales: {
    y: {
      title: {
        display: true,
        text: 'Объем продаж, тыс. руб.',
        font: {
          family: "'Inter', sans-serif"
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
})

// API state
const loading = ref(false)
const errorMessage = ref('')

// Filter event handlers
const onCategorySelected = (category) => {
  selectedCategory.value = category
  fetchSalesData()
}

const onDateRangeSelected = (dates) => {
  startDate.value = dates.start
  endDate.value = dates.end
  fetchSalesData()
}

// Fetch data from API
const fetchSalesData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    let url = 'https://quartzcrystal.pythonanywhere.com/forecast/?' // Базовый URL API
    if (selectedCategory.value) {
      url += `category=${selectedCategory.value}&` // Добавляем параметр категории, если выбрана
    }
    url += `start=${startDate.value}&end=${endDate.value}` // Добавляем параметры start и end

    const response = await axios.get(url)
    const apiData = response.data

    // Извлекаем данные из ответа API
    const revenueData = apiData.revenue
    const quantityData = apiData.quantity

    // Преобразуем данные для Chart.js
    const labels = revenueData.map(item => item.date)

    salesChartData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Ожидаемая выручка',
          data: revenueData.map(item => item.expected),
          borderColor: '#29B6F6',
          backgroundColor: 'rgba(41, 182, 246, 0.1)',
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Нижняя граница выручки',
          data: revenueData.map(item => item.lower),
          borderColor: 'rgba(41, 182, 246, 0.5)',
          backgroundColor: 'rgba(41, 182, 246, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Верхняя граница выручки',
          data: revenueData.map(item => item.upper),
          borderColor: 'rgba(41, 182, 246, 0.5)',
          backgroundColor: 'rgba(41, 182, 246, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Ожидаемое количество',
          data: quantityData.map(item => item.expected),
          borderColor: '#7E57C2',
          backgroundColor: 'rgba(126, 87, 194, 0.1)',
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Нижняя граница количества',
          data: quantityData.map(item => item.lower),
          borderColor: 'rgba(126, 87, 194, 0.5)',
          backgroundColor: 'rgba(126, 87, 194, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Верхняя граница количества',
          data: quantityData.map(item => item.upper),
          borderColor: 'rgba(126, 87, 194, 0.5)',
          backgroundColor: 'rgba(126, 87, 194, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        }
      ]
    }
  } catch (error) {
    errorMessage.value = 'Ошибка при получении данных: ' + error.message
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const response = await axios.get('https://quartzcrystal.pythonanywhere.com/categories/')
    categories.value = response.data
  } catch (error) {
    console.error('Ошибка при получении категорий:', error)
    errorMessage.value = 'Ошибка при получении категорий: ' + error.message
  }
}

// Initial data fetch
onMounted(() => {
  fetchSalesData()
  fetchCategories()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard {
  font-family: 'Inter', sans-serif;
  color: #2D3748;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-title {
  font-weight: 600;
  font-size: 1.8rem;
  color: #2D3748;
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.5px;
}

.main-chart-container {
  margin-bottom: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.main-chart {
  height: 400px;
  width: 100%;
}
</style>
