<template>
  <div class="forecast-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default {
  name: 'ForecastChart',
  props: {
    forecastData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Прогноз выручки и количества'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  computed: {
    chartData() {
      return {
        labels: this.forecastData.revenue.map(item => item.date),
        datasets: [
          {
            label: 'Выручка (ожидаемая)',
            data: this.forecastData.revenue.map(item => item.expected),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            tension: 0.1
          },
          {
            label: 'Выручка (нижняя граница)',
            data: this.forecastData.revenue.map(item => item.lower),
            borderColor: 'rgba(75, 192, 192, 0.5)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderDash: [5, 5],
            tension: 0.1
          },
          {
            label: 'Выручка (верхняя граница)',
            data: this.forecastData.revenue.map(item => item.upper),
            borderColor: 'rgba(75, 192, 192, 0.5)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderDash: [5, 5],
            tension: 0.1
          },
          {
            label: 'Количество (ожидаемое)',
            data: this.forecastData.quantity.map(item => item.expected),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            tension: 0.1
          },
          {
            label: 'Количество (нижняя граница)',
            data: this.forecastData.quantity.map(item => item.lower),
            borderColor: 'rgba(255, 99, 132, 0.5)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [5, 5],
            tension: 0.1
          },
          {
            label: 'Количество (верхняя граница)',
            data: this.forecastData.quantity.map(item => item.upper),
            borderColor: 'rgba(255, 99, 132, 0.5)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderDash: [5, 5],
            tension: 0.1
          }
        ]
      }
    }
  },
  watch: {
    forecastData: {
      handler() {
        this.updateChart()
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    initChart() {
      const ctx = this.$refs.chartCanvas.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'line',
        data: this.chartData,
        options: this.chartOptions
      })
    },
    updateChart() {
      if (this.chart) {
        this.chart.data = this.chartData
        this.chart.update()
      }
    }
  }
}
</script>

<style scoped>
.forecast-chart {
  width: 100%;
  height: 400px;
  margin: 20px 0;
}
</style> 