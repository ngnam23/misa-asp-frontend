import { createRouter, createWebHistory } from 'vue-router'
import EmployeePage from '@/views/employee/Index.vue'
import TheLayout from '@/layouts/TheLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: TheLayout,
      children: [
        {
          path: '/',
          name: 'employee',
          component: EmployeePage,
        },
      ],
    },
  ],
})

export default router
