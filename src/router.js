import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth';
import Dashboard from './views/Dashboard.vue';
import Login from './views/Login.vue';
import Settings from './views/Settings.vue';
import ForecastView from './views/ForecastView.vue';
import Recomendation from './views/Recomendation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    { 
      path: '/',
      redirect: (to) => {
        const authStore = useAuthStore();
        return authStore.isAuthenticated ? '/dashboard' : '/login';
      }
    },
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
      path: '/forecast',
      name: 'forecast',
      component: ForecastView
    },
    {
      path: '/recsys',
      name: 'recomendation',
      component: Recomendation
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Сохраняем текущий путь для редиректа после входа
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    // Если пользователь уже авторизован, перенаправляем на dashboard
    next('/dashboard');
  } else {
    next();
  }
});

export default router;