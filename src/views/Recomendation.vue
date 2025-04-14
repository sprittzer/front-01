<template>
    <div class="dashboard">
      <h1 class="dashboard-title">Прогнозирование продаж CUDO</h1>
  
      <div class="filters-container">
        <div class="filters-wrapper">
            <InputNumber v-model="value2" inputId="withoutgrouping" :useGrouping="false" fluid />
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