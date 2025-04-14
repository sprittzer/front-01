<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>
    <FileUpload />

    <div class="filters">
      <CategoryFilter @category-selected="onCategorySelected" :categories="categories" />
      <DateRangePicker @date-range-selected="onDateRangeSelected" />
    </div>

    <!-- График выручки -->
    <div class="main-chart-container">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">💰</span>
          <span>Прогнозируемая выручка</span>
        </template>
        <template #content>
          <div v-if="loading">Загрузка...</div>
          <div v-else-if="errorMessage">{{ errorMessage }}</div>
          <Chart v-else type="line" :data="revenueChartData" :options="chartOptions" class="main-chart" />
        </template>
      </Card>
    </div>

    <!-- График количества -->
    <div class="main-chart-container">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">📦</span>
          <span>Прогнозируемое количество</span>
        </template>
        <template #content>
          <div v-if="loading">Загрузка...</div>
          <div v-else-if="errorMessage">{{ errorMessage }}</div>
          <Chart v-else type="line" :data="quantityChartData" :options="chartOptions" class="main-chart" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import FileUpload from '../components/FileUpload.vue'
import CategoryFilter from '../components/CategoryFilter.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import axios from 'axios'

// Filters
const selectedCategory = ref('')
const startDate = ref('2024-08-01')
const endDate = ref('2024-11-15')
const categories = ref([])

// Chart data and options
const revenueChartData = ref({})
const quantityChartData = ref({})
const chartOptions = ref({
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
        text: 'Значение',
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
}

const onDateRangeSelected = (dates) => {
  startDate.value = dates.start
  endDate.value = dates.end
}

// Fetch data from API
const fetchSalesData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    let url = 'https://quartzcrystal.pythonanywhere.com/forecast/?'
    if (selectedCategory.value) {
      url += `category=${selectedCategory.value}&`
    }
    url += `start=${startDate.value}&end=${endDate.value}`

    const response = await axios.get(url)
    console.log('API Response:', response) // Печатаем весь ответ в консоль
    const apiData = response.data

    // Charts
    const labels = apiData.revenue.map(item => item.date)

    // Revenue chart
    revenueChartData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Ожидаемая выручка',
          data: apiData.revenue.map(item => item.expected),
          borderColor: '#29B6F6',
          backgroundColor: 'rgba(41, 182, 246, 0.1)',
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Нижняя граница',
          data: apiData.revenue.map(item => item.lower),
          borderColor: 'rgba(41, 182, 246, 0.5)',
          backgroundColor: 'rgba(41, 182, 246, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Верхняя граница',
          data: apiData.revenue.map(item => item.upper),
          borderColor: 'rgba(41, 182, 246, 0.5)',
          backgroundColor: 'rgba(41, 182, 246, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        }
      ]
    }

    // Quantity chart
    quantityChartData.value = {
      labels: labels,
      datasets: [
        {
          label: 'Ожидаемое количество',
          data: apiData.quantity.map(item => item.expected),
          borderColor: '#7E57C2',
          backgroundColor: 'rgba(126, 87, 194, 0.1)',
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Нижняя граница',
          data: apiData.quantity.map(item => item.lower),
          borderColor: 'rgba(126, 87, 194, 0.5)',
          backgroundColor: 'rgba(126, 87, 194, 0.05)',
          borderDash: [5, 5],
          tension: 0.3,
          borderWidth: 2
        },
        {
          label: 'Верхняя граница',
          data: apiData.quantity.map(item => item.upper),
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
    console.log('Categories Response:', response)
    categories.value = response.data
  } catch (error) {
    console.error('Ошибка при получении категорий:', error)
    errorMessage.value = 'Ошибка при получении категорий: ' + error.message
  }
}

// Watchers for filters
watch([selectedCategory, startDate, endDate], () => {
  console.log('Filters changed:', {
    selectedCategory: selectedCategory.value,
    startDate: startDate.value,
    endDate: endDate.value
  })
  fetchSalesData()
})

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
