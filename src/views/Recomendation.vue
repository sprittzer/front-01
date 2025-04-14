<template>
    <!-- <div class="card"> -->
      <DataTable :value="products" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        responsiveLayout="scroll"
        stripedRows
        filterDisplay="menu"
        :globalFilterFields="['group', 'type', 'category', 'sku']">
        
        <template #header>
          <div class="flex justify-content-between">
            <h2 class="m-0">Рекомендателная система</h2>
            <h4>Введите ID клиента и вам предложат топ товаров для него:</h4>
            <div style="display: flex;">
                <InputNumber v-model="value2" inputId="withoutgrouping" :useGrouping="false" fluid />
                <Button style="margin-left: 5px;">Найти</Button>
            </div>
            
          </div>
        </template>
        
        <Column field="group" header="Group" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span class="font-bold">{{ data.group }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by group" class="p-column-filter" />
          </template>
        </Column>
        
        <Column field="type" header="Type" sortable style="min-width: 16rem">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by type" class="p-column-filter" />
          </template>
        </Column>
        
        <Column field="category" header="Category" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span :class="{'text-gray-500 font-italic': !data.category}">{{ data.category || 'Not specified' }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="filterCallback()" placeholder="Search by category" class="p-column-filter" />
          </template>
        </Column>
        
        <Column field="sku" header="SKU" sortable dataType="numeric" style="min-width: 8rem">
          <template #body="{ data }">
            <span class="font-semibold">{{ data.sku }}</span>
          </template>
          <template #filter="{ filterModel, filterCallback }">
            <InputNumber v-model="filterModel.value" @input="filterCallback()" placeholder="Search by SKU" class="p-column-filter" />
          </template>
        </Column>
      </DataTable>
    <!-- </div> -->
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import DataTable from 'primevue/datatable';
  import Column from 'primevue/column';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Button from 'primevue/button';
  
  // Data to display
  const productsData = ref([]);
  
  // Reactive references
  const products = ref([]);
  const globalFilter = ref('');
  
  // Load data when component is mounted
  onMounted(() => {
    products.value = productsData;
  });
  </script>
  
  <style scoped>
  .card {
    background: var(--surface-card);
    padding: 1.5rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 1px 4px rgba(0, 0, 0, 0.08);
  }
  </style>
  