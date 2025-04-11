<template>
  <div class="dashboard">
    <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>
    <FileUpload />
    
    <!-- Основной график прогнозов -->
    <div class="main-chart-container">
      <Card class="glass-card">
        <template #title>
          <span class="card-title-icon">📊</span>
          <span>Фактические и прогнозируемые продажи</span>
        </template>
        <template #content>
          <Chart type="line" :data="salesChartData" :options="salesChartOptions" class="main-chart" />
        </template>
      </Card>
    </div>

    <!-- Блоки статистики -->
    <div class="metrics-grid">
      <Card class="metric-card accuracy-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">🎯</span>
            <span>Точность прогноза</span>
          </div>
        </template>
        <template #content>
          <div class="metric-value">{{ forecastAccuracy }}%</div>
          <div class="metric-change" :class="accuracyChange >= 0 ? 'positive' : 'negative'">
            <i :class="accuracyChange >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ accuracyChange >= 0 ? '+' : '' }}{{ accuracyChange }}% за месяц
          </div>
        </template>
      </Card>
      
      <Card class="metric-card predictions-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">💰</span>
            <span>Прогнозируемый объем</span>
          </div>
        </template>
        <template #content>
          <div class="metric-value">{{ formattedForecastVolume }}</div>
          <div class="metric-subtext">на следующие 6 месяцев</div>
          <div class="sparkline">
            <div v-for="(val, idx) in forecastTrend" :key="idx" 
                 class="sparkline-bar" :style="{height: `${val}%`}"></div>
          </div>
        </template>
      </Card>
      
      <Card class="metric-card performance-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">⚠️</span>
            <span>Недогрузы</span>
          </div>
        </template>
        <template #content>
          <div class="metric-value">{{ underloads }}<span class="unit">ед.</span></div>
          <div class="metric-subtext">потери: {{ underloadsLoss }} млн руб.</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{width: `${underloadsPercentage}%`}"></div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Первая строка графиков -->
    <div class="secondary-charts">
      <Card class="chart-card seasonality-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">🌦️</span>
            <span>Сезонность продаж</span>
          </div>
        </template>
        <template #content>
          <Chart type="bar" :data="seasonalityData" :options="barOptions" class="secondary-chart" />
        </template>
      </Card>
      
      <Card class="chart-card categories-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">🗂️</span>
            <span>Доля категорий</span>
          </div>
        </template>
        <template #content>
          <Chart type="pie" :data="categoriesData" :options="pieOptions" class="secondary-chart" />
          <div class="chart-legend">
            <div v-for="(label, index) in categoriesData.labels" :key="index" class="legend-item">
              <span class="legend-color" :style="{backgroundColor: categoriesData.datasets[0].backgroundColor[index]}"></span>
              <span class="legend-label">{{ label }} ({{ categoriesData.datasets[0].data[index] }}%)</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Вторая строка графиков -->
    <div class="secondary-charts">
      <Card class="chart-card regions-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">🗺️</span>
            <span>Продажи по регионам</span>
          </div>
        </template>
        <template #content>
          <Chart type="line" :data="regionsData" :options="regionsOptions" class="secondary-chart" />
        </template>
      </Card>
      
      <Card class="chart-card factors-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">📌</span>
            <span>Влияние факторов</span>
          </div>
        </template>
        <template #content>
          <Chart type="radar" :data="factorsData" :options="radarOptions" class="secondary-chart" />
        </template>
      </Card>
    </div>

    <!-- Блок с кластерами -->
    <div class="clusters-section">
      <Card class="chart-card clusters-card">
        <template #title>
          <div class="card-title-with-icon">
            <span class="icon">🔍</span>
            <span>Кластеризация регионов</span>
          </div>
        </template>
        <template #content>
          <Chart type="scatter" :data="clustersData" :options="scatterOptions" class="secondary-chart" />
          <div class="clusters-legend">
            <div v-for="(cluster, index) in clusters" :key="index" class="cluster-item">
              <span class="cluster-marker" :style="{backgroundColor: clusterColors[index]}"></span>
              <span class="cluster-label">{{ cluster.label }} ({{ cluster.count }} регионов)</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Chart from 'primevue/chart';
import Card from 'primevue/card';
import FileUpload from '../components/FileUpload.vue';

// Основной график продаж
const salesChartData = ref({
  labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  datasets: [
    {
      label: 'Фактические продажи',
      data: [1250, 1320, 1180, 1450, 1520, 1680, 1750, 1620, 1580, 1470, 1390, 1560],
      borderColor: '#7E57C2',
      backgroundColor: 'rgba(126, 87, 194, 0.1)',
      tension: 0.3,
      borderWidth: 2
    },
    {
      label: 'Прогнозируемые продажи',
      data: [null, null, null, null, null, null, 1720, 1650, 1600, 1500, 1420, 1630],
      borderColor: '#29B6F6',
      backgroundColor: 'rgba(41, 182, 246, 0.1)',
      borderDash: [5, 5],
      tension: 0.3,
      borderWidth: 2
    }
  ]
});

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
        label: function(context) {
          return `${context.dataset.label}: ${context.raw.toLocaleString('ru-RU')} тыс. руб.`;
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
});

// Статистические показатели
const forecastAccuracy = ref(87.5);
const accuracyChange = ref(2.3);
const forecastVolume = ref(9250000);
const underloads = ref(342);
const underloadsLoss = ref(12.7);
const underloadsPercentage = ref(15);

const formattedForecastVolume = computed(() => {
  return new Intl.NumberFormat('ru-RU').format(forecastVolume.value) + ' руб.';
});

const forecastTrend = ref(Array.from({length: 6}, (_, i) => 30 + i * 12));

// График сезонности
const seasonalityData = ref({
  labels: ['Зимняя химия', 'Строительная', 'Автомобильная', 'Бытовая'],
  datasets: [
    {
      label: 'Коэффициент сезонности',
      data: [2.8, 1.2, 1.5, 0.9],
      backgroundColor: ['#7E57C2', '#29B6F6', '#66BB6A', '#FF7043'],
      borderColor: ['#7E57C2', '#29B6F6', '#66BB6A', '#FF7043'],
      borderWidth: 1
    }
  ]
});

// Доля категорий
const categoriesData = ref({
  labels: ['Автохимия', 'Строительная химия', 'Бытовая химия', 'Спецхимия'],
  datasets: [
    {
      data: [45, 30, 15, 10],
      backgroundColor: ['#7E57C2', '#29B6F6', '#66BB6A', '#FF7043'],
      borderWidth: 0
    }
  ]
});

const barOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
});

const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  cutout: '70%'
});

// Продажи по регионам
const regionsData = ref({
  labels: ['ЦФО', 'СЗФО', 'ЮФО', 'ПФО', 'УФО', 'СФО', 'ДВФО'],
  datasets: [
    {
      label: 'Продажи, тыс. руб.',
      data: [4200, 2800, 3100, 2500, 1800, 2200, 1500],
      borderColor: '#FF7043',
      backgroundColor: 'rgba(255, 112, 67, 0.2)',
      tension: 0.3,
      borderWidth: 2
    }
  ]
});

const regionsOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
});

// Влияние факторов
const factorsData = ref({
  labels: ['Курс рубля', 'Сезонность', 'Логистика', 'Сырье', 'Конкуренция', 'Маркетинг'],
  datasets: [
    {
      label: 'Влияние на продажи',
      data: [65, 85, 45, 55, 40, 60],
      backgroundColor: 'rgba(126, 87, 194, 0.2)',
      borderColor: '#7E57C2',
      pointBackgroundColor: '#7E57C2',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#7E57C2',
      borderWidth: 2
    }
  ]
});

const radarOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: {
        display: true
      },
      suggestedMin: 0,
      suggestedMax: 100
    }
  },
  elements: {
    line: {
      tension: 0.1
    }
  }
});

// Кластеризация регионов
const clusters = ref([
  { label: 'Высокий спрос', count: 12 },
  { label: 'Средний спрос', count: 25 },
  { label: 'Низкий спрос', count: 18 },
  { label: 'Сезонный спрос', count: 8 }
]);

const clusterColors = ['#7E57C2', '#29B6F6', '#66BB6A', '#FF7043'];

const clustersData = ref({
  datasets: clusters.value.map((cluster, index) => ({
    label: cluster.label,
    data: Array.from({length: cluster.count}, () => ({
      x: Math.random() * 80 + (index * 20),
      y: Math.random() * 80 + (index * 15),
      r: Math.random() * 10 + 5
    })),
    backgroundColor: clusterColors[index],
    borderColor: clusterColors[index]
  }))
});

const scatterOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Объем продаж'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Рост продаж'
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
});
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 2rem;
}

.metric-card {
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.accuracy-card {
  background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
  border-left: 4px solid #7E57C2;
}

.predictions-card {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-left: 4px solid #2196F3;
}

.performance-card {
  background: linear-gradient(135deg, #FFEBEE 0%, #FFCDD2 100%);
  border-left: 4px solid #F44336;
}

.card-title-with-icon {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #2D3748;
}

.icon {
  font-size: 1.2rem;
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  color: #2D3748;
  letter-spacing: -1px;
}

.unit {
  font-size: 1.2rem;
  font-weight: 400;
  margin-left: 2px;
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  font-weight: 500;
}

.metric-subtext {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.5rem;
}

.positive {
  color: #4CAF50;
}

.negative {
  color: #F44336;
}

.sparkline {
  display: flex;
  align-items: flex-end;
  height: 40px;
  gap: 3px;
  margin-top: 10px;
}

.sparkline-bar {
  background: #2196F3;
  width: 6px;
  border-radius: 3px;
  opacity: 0.7;
  transition: height 0.3s ease;
}

.progress-bar {
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  margin-top: 15px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #F44336, #E57373);
  border-radius: 3px;
}

.secondary-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 1px solid #EDF2F7;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.seasonality-card {
  border-top: 4px solid #FF7043;
}

.categories-card {
  border-top: 4px solid #7E57C2;
  display: flex;
  flex-direction: column;
}

.regions-card {
  border-top: 4px solid #29B6F6;
}

.factors-card {
  border-top: 4px solid #66BB6A;
  display: flex;
  flex-direction: column;
}

.secondary-chart {
  height: 250px;
  width: 100%;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}

.legend-label {
  color: #4A5568;
}

.clusters-section {
  margin-top: 20px;
}

.clusters-card {
  border-top: 4px solid #29B6F6;
}

.clusters-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}

.cluster-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.cluster-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.cluster-label {
  font-size: 0.8rem;
  color: #4A5568;
}

@media (max-width: 992px) {
  .metrics-grid,
  .secondary-charts {
    grid-template-columns: 1fr;
  }
}
</style>