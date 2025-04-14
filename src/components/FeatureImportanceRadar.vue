<template>
    <div class="feature-importance-container">
      <!-- Revenue Section -->
      <div class="section-title">
        <span class="icon">💰</span>
        <h2>Приоритетность признаков выручки</h2>
      </div>
      <div class="card-row">
        <Card class="chart-card">
          <template #title>Приоритетность для SHAP</template>
          <template #content>
            <div class="chart-wrapper">
              <Chart type="radar" :data="revenueShapData" :options="radarOptions" />
              <div class="priority-expression">{{ revenueShapPriority }}</div>
            </div>
          </template>
        </Card>
  
        <Card class="chart-card">
          <template #title>Приоритетность для XGB</template>
          <template #content>
            <div class="chart-wrapper">
              <Chart type="radar" :data="revenueXgbData" :options="radarOptions" />
              <div class="priority-expression">{{ revenueXgbPriority }}</div>
            </div>
          </template>
        </Card>
      </div>
  
      <!-- Quantity Section -->
      <div class="section-title">
        <span class="icon">📦</span>
        <h2>Приоритетность признаков продаж</h2>
      </div>
      <div class="card-row">
        <Card class="chart-card">
          <template #title>Приоритетность для SHAP</template>
          <template #content>
            <div class="chart-wrapper">
              <Chart type="radar" :data="quantityShapData" :options="radarOptions" />
              <div class="priority-expression">{{ quantityShapPriority }}</div>
            </div>
          </template>
        </Card>
  
        <Card class="chart-card">
          <template #title>Приоритетность для XGB</template>
          <template #content>
            <div class="chart-wrapper">
              <Chart type="radar" :data="quantityXgbData" :options="radarOptions" />
              <div class="priority-expression">{{ quantityXgbPriority }}</div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, ref, onMounted } from 'vue'
  import Chart from 'primevue/chart'
  import Card from 'primevue/card'
  import Papa from 'papaparse'
  
  export default defineComponent({
    name: 'FeatureImportanceDashboard',
    components: {
      Chart,
      Card
    },
    setup() {
      const revenueShapData = ref({})
      const revenueXgbData = ref({})
      const quantityShapData = ref({})
      const quantityXgbData = ref({})
  
      const revenueShapPriority = ref('')
      const revenueXgbPriority = ref('')
      const quantityShapPriority = ref('')
      const quantityXgbPriority = ref('')
  
      const radarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { display: true, color: 'rgba(0, 0, 0, 0.1)' },
            suggestedMin: 0,
            suggestedMax: 1,
            ticks: {
              stepSize: 0.2,
              backdropColor: 'transparent'
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${(context.raw * 100).toFixed(1)}%`
            }
          }
        },
        elements: {
          line: { tension: 0.1, borderWidth: 2 },
          point: { radius: 4, hoverRadius: 6 }
        }
      }
  
      const loadData = async () => {
        try {
          const [revenueShapResponse, revenueXgbResponse] = await Promise.all([
            fetch(new URL('../assets/revenue_importance_df_shap_normalized.csv', import.meta.url)),
            fetch(new URL('../assets/revenue_importance_df_xgb_normalized.csv', import.meta.url))
          ])
          const [quantityShapResponse, quantityXgbResponse] = await Promise.all([
            fetch(new URL('../assets/quantity_importance_df_shap_normalized.csv', import.meta.url)),
            fetch(new URL('../assets/quantity_importance_df_xgb_normalized.csv', import.meta.url))
          ])
  
          const [revenueShapCsv, revenueXgbCsv, quantityShapCsv, quantityXgbCsv] = await Promise.all([
            revenueShapResponse.text(),
            revenueXgbResponse.text(),
            quantityShapResponse.text(),
            quantityXgbResponse.text()
          ])
  
          const revenueShapParsed = Papa.parse(revenueShapCsv, { header: true }).data
          const revenueXgbParsed = Papa.parse(revenueXgbCsv, { header: true }).data
          const quantityShapParsed = Papa.parse(quantityShapCsv, { header: true }).data
          const quantityXgbParsed = Papa.parse(quantityXgbCsv, { header: true }).data
  
          prepareChartData(
            revenueShapParsed,
            revenueXgbParsed,
            quantityShapParsed,
            quantityXgbParsed
          )
  
          generatePriorityExpressions(
            revenueShapParsed,
            revenueXgbParsed,
            quantityShapParsed,
            quantityXgbParsed
          )
        } catch (err) {
          console.error('Error loading data:', err)
        }
      }
  
      const prepareChartData = (shapRev, xgbRev, shapQty, xgbQty) => {
        const createChartData = (data, color) => {
          return {
            labels: data.map(item => item.Feature),
            datasets: [{
              data: data.map(item => parseFloat(item.result_value)),
              backgroundColor: `${color}20`,
              borderColor: color,
              pointBackgroundColor: color,
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: color
            }]
          }
        }
  
        revenueShapData.value = createChartData(shapRev, '#4bc0c0')
        revenueXgbData.value = createChartData(xgbRev, '#9966ff')
        quantityShapData.value = createChartData(shapQty, '#36a2eb')
        quantityXgbData.value = createChartData(xgbQty, '#ff9f40')
      }
  
      const generatePriorityExpressions = (shapRev, xgbRev, shapQty, xgbQty) => {
        const createPriority = (data) => {
          return data
            .slice(0, 5)
            .map(item => item.Feature)
            .join(' > ')
        }
  
        revenueShapPriority.value = createPriority(shapRev)
        revenueXgbPriority.value = createPriority(xgbRev)
        quantityShapPriority.value = createPriority(shapQty)
        quantityXgbPriority.value = createPriority(xgbQty)
      }
  
      onMounted(() => {
        loadData()
      })
  
      return {
        revenueShapData,
        revenueXgbData,
        quantityShapData,
        quantityXgbData,
        revenueShapPriority,
        revenueXgbPriority,
        quantityShapPriority,
        quantityXgbPriority,
        radarOptions
      }
    }
  })
  </script>
  
  <style scoped>
  .feature-importance-container {
    padding: 20px;
  }
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 30px 0 15px 0;
    color: #2c3e50;
  }
  
  .section-title h2 {
    margin: 0;
    font-size: 1.4rem;
  }
  
  .section-title .icon {
    font-size: 1.6rem;
  }
  
  .card-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 25px;
    margin-bottom: 40px;
  }
  
  .chart-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    height: 100%;
  }
  
  .chart-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 350px;
  }
  
  .chart-wrapper :deep(.p-chart) {
    flex: 1;
  }
  
  .priority-expression {
    margin-top: 20px;
    padding: 12px 15px;
    background: #f8f9fa;
    border-radius: 8px;
    font-weight: 500;
    border-left: 4px solid;
  }
  
  /* Individual border colors */
  .card-row:nth-child(2) .chart-card:nth-child(1) .priority-expression {
    border-left-color: #4bc0c0;
  }
  .card-row:nth-child(2) .chart-card:nth-child(2) .priority-expression {
    border-left-color: #9966ff;
  }
  .card-row:nth-child(4) .chart-card:nth-child(1) .priority-expression {
    border-left-color: #36a2eb;
  }
  .card-row:nth-child(4) .chart-card:nth-child(2) .priority-expression {
    border-left-color: #ff9f40;
  }
  
  @media (max-width: 900px) {
    .card-row {
      grid-template-columns: 1fr;
    }
    
    .section-title h2 {
      font-size: 1.2rem;
    }
  }
  </style>