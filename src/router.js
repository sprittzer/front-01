import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Settings from './views/Settings.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/login', 
      name: 'Login', 
      component: Login, 
      meta: { requiresAuth: false } 
    },
    { 
      path: '/dashboard', 
      name: 'Dashboard', 
      component: Dashboard, 
      meta: { requiresAuth: true } 
    },
    { 
      path: '/settings', 
      name: 'Settings', 
      component: Settings, 
      meta: { requiresAuth: true } 
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // Сохраняем текущий путь для редиректа после входа
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.name === 'Login' && authStore.isLoggedIn) {
    // Если пользователь уже авторизован, перенаправляем на dashboard
    next('/dashboard');
  } else {
    next();
  }
});

export default router;