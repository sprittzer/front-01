<template>
    <div>
      <label for="start-date">Начальная дата:</label>
      <input type="date" id="start-date" v-model="startDate" @change="emitDates">
  
      <label for="end-date">Конечная дата:</label>
      <input type="date" id="end-date" v-model="endDate" @change="emitDates">
  
      <div>
        <button @click="setPreset('lastMonth')">Последний месяц</button>
        <button @click="setPreset('quarter')">Квартал</button>
        <button @click="setPreset('year')">Год</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DateRangePicker',
    data() {
      return {
        startDate: '',
        endDate: ''
      }
    },
    methods: {
      emitDates() {
        this.$emit('date-range-selected', { start: this.startDate, end: this.endDate })
      },
      setPreset(range) {
        const today = new Date()
        let start, end
  
        switch (range) {
          case 'lastMonth':
            end = new Date(today.getFullYear(), today.getMonth(), 0)
            start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
            break
          case 'quarter':
            end = today
            start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
            break
          case 'year':
            end = today
            start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
            break
        }
  
        this.startDate = start.toISOString().slice(0, 10)
        this.endDate = end.toISOString().slice(0, 10)
        this.emitDates()
      }
    }
  }
  </script>
  