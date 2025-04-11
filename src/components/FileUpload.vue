<template>
  <div class="file-uploader">
    <div class="upload-card">
      <h3>Загрузка файла</h3>
      
      <div class="upload-form">
        <div class="input-field">
          <label for="fileType">Тип файла</label>
          <Dropdown
            v-model="selectedFileType"
            :options="fileTypes"
            optionLabel="name"
            optionValue="value"
            placeholder="Выберите тип файла"
            class="w-full"
          />
        </div>

        <div class="input-field">
          <label for="file">Файл</label>
          <PrimeFileUpload
            mode="basic"
            :multiple="false"
            :auto="true"
            :customUpload="true"
            @uploader="onUpload"
            accept=".csv,.xlsx,.xls"
            :maxFileSize="10000000"
            chooseLabel="Выберите файл"
            class="w-full"
          />
        </div>

        <div v-if="uploadStatus" class="status-message" :class="{ 'success': uploadStatus.success, 'error': !uploadStatus.success }">
          {{ uploadStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dropdown from 'primevue/dropdown';
import FileUpload as PrimeFileUpload from 'primevue/fileupload';
import axios from 'axios';

const toast = useToast();
const selectedFileType = ref(null);
const uploadStatus = ref(null);

const fileTypes = [
  { name: 'Продажи', value: 'sales' },
  { name: 'Отказы', value: 'denials' },
  { name: 'Группы', value: 'groups' },
  { name: 'Локации', value: 'locations' }
];

const onUpload = async (event) => {
  if (!selectedFileType.value) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Выберите тип файла',
      life: 3000
    });
    return;
  }

  const formData = new FormData();
  formData.append('file', event.files[0]);
  formData.append('file_type', selectedFileType.value);

  try {
    const response = await axios.post('https://quartzcrystal.pythonanywhere.com/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Token ${localStorage.getItem('token')}`
      }
    });

    uploadStatus.value = {
      success: true,
      message: 'Файл успешно загружен'
    };

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Файл успешно загружен',
      life: 3000
    });

    // Очищаем форму
    selectedFileType.value = null;
    event.clear();

  } catch (error) {
    uploadStatus.value = {
      success: false,
      message: error.response?.data?.detail || 'Ошибка при загрузке файла'
    };

    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.detail || 'Ошибка при загрузке файла',
      life: 3000
    });
  }
};
</script>

<style scoped>
.file-uploader {
  padding: 20px;
}

.upload-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  margin: 0 auto;
}

.upload-card h3 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-weight: 600;
}

.input-field {
  margin-bottom: 20px;
}

.input-field label {
  display: block;
  margin-bottom: 8px;
  color: #4B5563;
  font-weight: 500;
}

.status-message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.status-message.success {
  background-color: #ECFDF5;
  color: #065F46;
}

.status-message.error {
  background-color: #FEF2F2;
  color: #B91C1C;
}

:deep(.p-fileupload) {
  width: 100%;
}

:deep(.p-fileupload-buttonbar) {
  background: none;
  border: none;
  padding: 0;
}

:deep(.p-button) {
  width: 100%;
  justify-content: center;
}

:deep(.p-dropdown) {
  width: 100%;
}
</style> 