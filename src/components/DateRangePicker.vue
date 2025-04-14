<template>
    <div class="date-range-picker">
      <div class="date-input">
        <label for="start-date">Начальная дата:</label>
        <Calendar
          inputId="start-date"
          v-model="startDate"
          @update:modelValue="emitDates"
          dateFormat="yy-mm-dd"
          class="p-inputtext-sm"
          placeholder="Выберите дату"
        />
      </div>
  
      <div class="date-input">
        <label for="end-date">Конечная дата:</label>
        <Calendar
          inputId="end-date"
          v-model="endDate"
          @update:modelValue="emitDates"
          dateFormat="yy-mm-dd"
          class="p-inputtext-sm"
          placeholder="Выберите дату"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Calendar from 'primevue/calendar';
  
  const emit = defineEmits(['date-range-selected']);
  
  const startDate = ref(null);
  const endDate = ref(null);
  
  onMounted(() => {
    const initialStartDate = new Date('2024-01-01');
    const initialEndDate = new Date('2025-12-31');
    startDate.value = initialStartDate;
    endDate.value = initialEndDate;
    emitDates();
  });
  
  const emitDates = () => {
    if (startDate.value && endDate.value) {
      const formattedStartDate = formatDate(startDate.value);
      const formattedEndDate = formatDate(endDate.value);
      emit('date-range-selected', { start: formattedStartDate, end: formattedEndDate });
    }
  };
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  </script>
  
  <style scoped>
  /* Основные изменения для горизонтального расположения */
  .date-range-picker {
    display: flex;
    align-items: flex-end; /* Выравниваем элементы по нижнему краю */
    gap: 1.5rem; /* Расстояние между полями */
  }
  
  .date-input {
    display: flex;
    flex-direction: column;
    flex: 1; /* Равномерное распределение пространства */
    min-width: 200px; /* Минимальная ширина полей */
  }
  
  .date-input label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  .p-calendar {
    width: 100%;
  }
  
  .p-inputtext {
    border-radius: 6px;
    border: 1px solid #ddd;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  /* Опциональные стили для адаптивности */
  @media (max-width: 600px) {
    .date-range-picker {
      flex-direction: column;
      gap: 1rem;
    }
    
    .date-input {
      width: 100%;
    }
  }
  </style>
  