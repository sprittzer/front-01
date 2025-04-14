<template>
  <div class="forecast-chart">
    <Line
      :data="chartData"
      :options="chartOptions"
    />
  </div>
</template>

<script>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
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
  components: {
    Line
  },
  props: {
    forecastData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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