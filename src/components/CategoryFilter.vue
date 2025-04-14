<template>
    <div>
      <label for="category">Категория:</label>
      <select id="category" v-model="selectedCategory" @change="emitCategory">
        <option value="">Все категории</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
  import axios from 'axios' // Или ваш предпочитаемый HTTP-клиент
  
  export default {
    name: 'CategoryFilter',
    data() {
      return {
        categories: [],
        selectedCategory: ''
      }
    },
    mounted() {
      this.fetchCategories()
    },
    methods: {
      async fetchCategories() {
        try {
          const response = await axios.get('/categories/')
          this.categories = response.data
        } catch (error) {
          console.error('Ошибка при получении категорий:', error)
        }
      },
      emitCategory() {
        this.$emit('category-selected', this.selectedCategory)
      }
    }
  }
  </script>
  