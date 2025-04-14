<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>

    <div class="filters-container">
      <div class="filters-wrapper">
        <CategoryFilter @category-selected="onCategorySelected" :categories="categories" />
        <DateRangePicker @date-range-selected="onDateRangeSelected" />
      </div>
    </div>

    <!-- Круговая диаграмма по категориям (только для "Все категории") -->
    <div v-if="!selectedCategory" class="charts-grid">
      <Card class="glass-card">
        <template #title>
          <span>Распределение выручки по категориям</span>
        </template>
        <template #content>
          <div v-if="ratioLoading">Загрузка распределения...</div>
          <div v-else-if="ratioError">{{ ratioError }}</div>
          <Chart v-else type="pie" :data="revenueRatioData" :options="ratioChartOptions" class="ratio-chart" />
        </template>
      </Card>

      <Card class="glass-card">
        <template #title>
          <span>Распределение числа продаж по категориям</span>
        </template>
        <template #content>
          <div v-if="ratioLoading">Загрузка распределения...</div>
          <div v-else-if="ratioError">{{ ratioError }}</div>
          <Chart v-else type="pie" :data="quantityRatioData" :options="ratioChartOptions" class="ratio-chart" />
        </template>
      </Card>
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
          <Chart v-else type="line" :data="revenueChartData" :options="revenueChartOptions" class="main-chart" :key="chartKey" />
        </template>
      </Card>
    </div>

    <!-- График количества -->
    <div class="main-chart-container">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">📊</span>
          <span>Прогнозируемое количество</span>
        </template>
        <template #content>
          <div v-if="loading">Загрузка...</div>
          <div v-else-if="errorMessage">{{ errorMessage }}</div>
          <Chart v-else type="line" :data="quantityChartData" :options="quantityChartOptions" class="main-chart" :key="chartKey + 1" />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import CategoryFilter from '../components/CategoryFilter.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import axios from 'axios'

// Состояния данных
const loading = ref(false)
const errorMessage = ref('')
const categories = ref([])
const chartKey = ref(0)
const ratioLoading = ref(false)
const ratioError = ref('')
const ratioData = ref(null)

// Фильтры
const selectedCategory = ref(null)
const startDate = ref('2024-08-01')
const endDate = ref('2024-11-15')

// Настройки графиков
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { family: "'Inter', sans-serif", size: 12 }, color: '#5A5A5A' }
    },
    tooltip: {
      backgroundColor: '#2D3748',
      titleFont: { family: "'Inter', sans-serif", size: 14 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 }
    }
  },
  scales: {
    y: { 
      title: { display: true, text: 'Значение', font: { family: "'Inter', sans-serif" } },
      grid: { color: 'rgba(0, 0, 0, 0.05)' }
    },
    x: { grid: { color: 'rgba(0, 0, 0, 0.05)' } }
  }
})

const ratioChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%', // Делаем диаграмму более "тонкой"
  plugins: {
    legend: {
      position: 'right',
      labels: { 
        font: { 
          family: "'Inter', sans-serif", 
          size: 12 
        }, 
        color: '#5A5A5A',
        padding: 20,
        usePointStyle: true, // Используем точки вместо прямоугольников
        boxWidth: 10 // Ширина квадратика легенды
      }
    },
    tooltip: {
      backgroundColor: '#2D3748',
      titleFont: { family: "'Inter', sans-serif", size: 14 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      callbacks: {
        label: (context) => {
          const label = context.label || ''
          const value = context.raw || 0
          const total = context.dataset.data.reduce((a, b) => a + b, 0)
          const percentage = Math.round((value / total) * 100)
          return `${label}: ${value.toLocaleString('ru-RU')} (${percentage}%)`
        }
      }
    },
    // Добавляем плагин для отображения процентов внутри диаграммы
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const percentage = Math.round((value / total) * 100);
        return percentage > 5 ? `${percentage}%` : ''; // Показываем только если больше 5%
      },
      color: '#fff',
      font: {
        family: "'Inter', sans-serif",
        size: 12,
        weight: 'bold'
      },
      anchor: 'center',
      align: 'center',
      offset: 0,
      clip: false
    }
  }
}))

const quantityChartOptions = computed(() => ({
  ...chartOptions.value,
  plugins: {
    ...chartOptions.value.plugins,
    tooltip: {
      ...chartOptions.value.plugins.tooltip,
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} шт.`
      }
    }
  }
}))

const revenueChartOptions = computed(() => ({
  ...chartOptions.value,
  scales: {
    ...chartOptions.value.scales,
    y: {
      ...chartOptions.value.scales.y,
      title: {
        display: true,
        text: 'Руб.',
        font: { family: "'Inter', sans-serif" }
      }
    }
  },
  plugins: {
    ...chartOptions.value.plugins,
    tooltip: {
      ...chartOptions.value.plugins.tooltip,
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} руб.`
      }
    }
  }
}))

// Данные для графиков
const revenueChartData = ref({})
const quantityChartData = ref({})

const revenueRatioData = computed(() => {
  if (!ratioData.value?.revenue) return { labels: [], datasets: [] }
  
  const labels = ratioData.value.revenue.map(item => item.name)
  const data = ratioData.value.revenue.map(item => item.ratio)
  const backgroundColors = generateColors(labels.length)
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: backgroundColors,
      borderWidth: 1
    }]
  }
})

const quantityRatioData = computed(() => {
  if (!ratioData.value?.quantity) return { labels: [], datasets: [] }
  
  const labels = ratioData.value.quantity.map(item => item.name)
  const data = ratioData.value.quantity.map(item => item.ratio)
  const backgroundColors = generateColors(labels.length)
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: backgroundColors,
      borderWidth: 1
    }]
  }
})

// URL для API
const apiUrl = computed(() => {
  if (selectedCategory.value) {
    return `https://quartzcrystal.pythonanywhere.com/forecast/${selectedCategory.value}/?start=${startDate.value}&end=${endDate.value}&_=${Date.now()}`
  }
  return `https://quartzcrystal.pythonanywhere.com/forecast/?start=${startDate.value}&end=${endDate.value}&_=${Date.now()}`
})

const ratioApiUrl = computed(() => {
  return `https://quartzcrystal.pythonanywhere.com/ratio/?start=${startDate.value}&end=${endDate.value}&_=${Date.now()}`
})

// Обработчики событий
const onCategorySelected = (category) => {
  selectedCategory.value = category
  console.log('Выбрана категория:', category)
}

const onDateRangeSelected = (dates) => {
  startDate.value = dates.start
  endDate.value = dates.end
  console.log('Выбран диапазон:', dates)
}

// Загрузка данных
const fetchSalesData = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    console.log('Запрос к:', apiUrl.value)
    const { data } = await axios.get(apiUrl.value)
    console.log('Данные ответа:', data)
    
    const labels = data.revenue.map(item => item.date)
    
    revenueChartData.value = {
      labels,
      datasets: [
        createDataset('Ожидаемая выручка', data.revenue, 'expected', '#29B6F6'),
        createDataset('Нижняя граница', data.revenue, 'lower', 'rgba(41, 182, 246, 0.5)', true),
        createDataset('Верхняя граница', data.revenue, 'upper', 'rgba(41, 182, 246, 0.5)', true)
      ]
    }
    
    quantityChartData.value = {
      labels,
      datasets: [
        createDataset('Ожидаемое количество', data.quantity, 'expected', '#7E57C2'),
        createDataset('Нижняя граница', data.quantity, 'lower', 'rgba(126, 87, 194, 0.5)', true),
        createDataset('Верхняя граница', data.quantity, 'upper', 'rgba(126, 87, 194, 0.5)', true)
      ]
    }
    
    chartKey.value++ // Принудительное обновление графиков
    
    // Если выбраны все категории, загружаем распределение
    if (!selectedCategory.value) {
      await fetchRatioData()
    }
    
  } catch (error) {
    errorMessage.value = `Ошибка: ${error.response?.data?.message || error.message}`
    console.error('Ошибка запроса:', error)
  } finally {
    loading.value = false
  }
}

// Загрузка распределения по категориям
const fetchRatioData = async () => {
  ratioLoading.value = true
  ratioError.value = ''
  
  try {
    console.log('Запрос распределения к:', ratioApiUrl.value)
    const { data } = await axios.get(ratioApiUrl.value)
    console.log('Данные распределения:', data)
    ratioData.value = data
    
  } catch (error) {
    ratioError.value = `Ошибка загрузки распределения: ${error.message}`
    console.error('Ошибка загрузки распределения:', error)
  } finally {
    ratioLoading.value = false
  }
}

// Генератор цветов для диаграммы
const generateColors = (count) => {
  const colors = []
  const hueStep = 360 / count
  
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep
    colors.push(`hsl(${hue}, 70%, 60%)`)
  }
  
  return colors
}

const createDataset = (label, data, key, color, dashed = false) => ({
  label,
  data: data.map(item => item[key]),
  borderColor: color,
  backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
  borderDash: dashed ? [5, 5] : undefined,
  tension: 0.3,
  borderWidth: 2
})

// Загрузка категорий
const fetchCategories = async () => {
  try {
    const { data } = await axios.get('https://quartzcrystal.pythonanywhere.com/categories/')
    
    if(Array.isArray(data)) {
      categories.value = data
    } 
    else if(data?.categories) {
      categories.value = data.categories
    }
    else {
      categories.value = Object.keys(data).map(key => ({
        id: key,
        name: data[key]
      }))
    }
    
    console.log('Загруженные категории:', categories.value)
    
  } catch (error) {
    console.error('Ошибка загрузки:', error)
    errorMessage.value = 'Ошибка загрузки категорий'
  }
}

// Watchers
watch([selectedCategory, startDate, endDate], () => {
  fetchSalesData()
})

onMounted(() => {
  fetchSalesData()
  fetchCategories()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard {
  font-family: 'Inter', sans-serif;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-title {
  font-weight: 600;
  font-size: 1.8rem;
  margin-bottom: 2rem;
  text-align: center;
}

.main-chart-container {
  margin-bottom: 2rem;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.main-chart {
  height: 400px;
  width: 100%;
}

.ratio-chart {
  height: 350px;
  width: 100%;
}

.card-title-icon {
  margin-right: 0.75rem;
}

.p-datatable {
  font-size: 0.9rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}

/* Styles for filters */
.filters-container {
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 3px solid rgba(41, 182, 246, 0.7);
  border-right: 3px solid rgba(126, 87, 194, 0.7);
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filters-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
}

.filter-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.filter-title-icon {
  margin-right: 0.75rem;
  color: #5A5A5A;
}

.filters {
  display: flex;
  gap: 20px;
}

.filter-item {
  flex: 1;
}

.filter-item label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}
</style>