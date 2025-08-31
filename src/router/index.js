import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Facility_Event from '@/views/Facility_Event.vue'
import LearnEnglish from '@/views/LearnEnglish.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/FindFacility_Event',
      name: '/facility_event',
      component: Facility_Event,
    },
    {
      path: '/learnenglish',
      name: '/learn_english',
      component: LearnEnglish,
    },
  ],
})

export default router
