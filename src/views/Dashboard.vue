<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>

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
          <Chart v-else type="line" :data="revenueChartData" :options="revenueChartOptions" class="main-chart" />
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
          <Chart v-else type="line" :data="quantityChartData" :options="quantityChartOptions" class="main-chart" />
        </template>
      </Card>
    </div>

    <!-- Блоки дополнительной информации -->
    <div class="data-grid">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">🏆</span>
          <span>Топ SKU</span>
        </template>
        <template #content>
          <DataTable :value="topSku" class="p-datatable-sm" stripedRows>
            <Column field="sku" header="SKU"></Column>
            <Column field="quantity" header="Количество">
              <template #body="{data}">
                {{ data.quantity.toLocaleString('ru-RU') }} шт.
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">👥</span>
          <span>Топ клиентов</span>
        </template>
        <template #content>
          <DataTable :value="topClients" class="p-datatable-sm" stripedRows>
            <Column field="client" header="Клиент"></Column>
            <Column field="price" header="Общая сумма">
              <template #body="{data}">
                {{ (data.price * 1000).toLocaleString('ru-RU') }} руб.
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'primevue/chart'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CategoryFilter from '../components/CategoryFilter.vue'
import DateRangePicker from '../components/DateRangePicker.vue'
import axios from 'axios'

// Состояния данных
const loading = ref(false)
const errorMessage = ref('')
const categories = ref([])
const topSku = ref([])
const topClients = ref([])

// Фильтры
const selectedCategory = ref('')
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

const quantityChartOptions = computed(() => ({
  ...chartOptions.value,
  plugins: {
    ...chartOptions.value.plugins,
    tooltip: {
      backgroundColor: '#2D3748',
      titleFont: { family: "'Inter', sans-serif", size: 14 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
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
      backgroundColor: '#2D3748',
      titleFont: { family: "'Inter', sans-serif", size: 14 },
      bodyFont: { family: "'Inter', sans-serif", size: 12 },
      callbacks: {
        label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} руб.`
      }
    }
  }
}))

// Данные для графиков
const revenueChartData = ref({})
const quantityChartData = ref({})

// URL для API
const apiUrl = computed(() => {
  let url = 'https://quartzcrystal.pythonanywhere.com/forecast/?'
  if (selectedCategory.value) url += `category=${selectedCategory.value}&`
  url += `start=${startDate.value}&end=${endDate.value}`
  return url
})

// Обработчики событий
const onCategorySelected = (category) => selectedCategory.value = category
const onDateRangeSelected = (dates) => {
  startDate.value = dates.start
  endDate.value = dates.end
}

// Загрузка данных
const fetchSalesData = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    const { data } = await axios.get(apiUrl.value)
    
    // Обработка данных графиков
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
    
    // Топ данные
    topSku.value = data.top_sku || []
    topClients.value = data.top_client || []
    
  } catch (error) {
    errorMessage.value = `Ошибка: ${error.response?.data?.message || error.message}`
    console.error('Ошибка запроса:', error)
  } finally {
    loading.value = false
  }
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
    const response = await axios.get('https://quartzcrystal.pythonanywhere.com/categories/')
    if (Array.isArray(response.data)) {
            categories.value = response.data;
        } else {
            console.error('Categories data is not an array:', response.data);
            errorMessage.value = 'Failed to load categories: Data is not in the correct format';
        }
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
    errorMessage.value = 'Ошибка загрузки категорий'
  }
}

// Watchers
watch([selectedCategory, startDate, endDate], fetchSalesData)
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

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
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

.card-title-icon {
  margin-right: 0.75rem;
}

.p-datatable {
  font-size: 0.9rem;
}

.p-datatable-sm .p-datatable-tbody > tr > td {
  padding: 0.5rem;
}
</style>
