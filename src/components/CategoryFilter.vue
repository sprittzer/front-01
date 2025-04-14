<template>
    <div>
      <label for="category">Категория:</label>
      <Dropdown
        inputId="category"
        v-model="selectedCategory"
        :options="categoriesWithAllOption"
        optionLabel="name"
        optionValue="id"
        placeholder="Выберите категорию"
        @change="emitCategory"
        class="p-inputtext-sm"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import Dropdown from 'primevue/dropdown'
  
  const props = defineProps({
    categories: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['category-selected'])
  
  const selectedCategory = ref(null)
  
  // Добавляем опцию "Все категории" в начало списка
  const categoriesWithAllOption = computed(() => [
    { id: null, name: 'Все категории' },
    ...props.categories
  ])
  
  const emitCategory = (event) => {
    emit('category-selected', event.value)
  }
  </script>
  
  <style scoped>
  /* Опциональные стили */
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  </style>