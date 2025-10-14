import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import FacilityEvent from '@/views/facilities/FacilityEvent.vue'
import LearnEnglish from '@/views/learning/english/LearnEnglish.vue'
import PassCode from '@/views/auth/PassCode.vue'
import SocialNorms from '@/views/learning/social-norms/socialNorms.vue'
import MeetingPeople from '@/views/learning/social-norms/MeetingPeople.vue'
import EatingOut from '@/views/learning/social-norms/EatingOut.vue'
import SafetyPage from '@/views/navigate-life/safety/SafetyPage.vue'

// Check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true'
}

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/passcode',
      name: 'passcode',
      component: PassCode,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/facilities',
      name: 'facilities',
      component: FacilityEvent,
      meta: { requiresAuth: true },
    },
    {
      path: '/FacilityEvent',
      name: 'facilityevent',
      component: FacilityEvent,
      meta: { requiresAuth: true },
    },
    {
      path: '/learnenglish',
      name: 'learnenglish',
      component: LearnEnglish,
      meta: { requiresAuth: true },
    },
    {
      path: '/flashcards/:category/:language',
      name: 'flashcards',
      component: () => import('../views/learning/english/FlashcardsView.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/socialnorms',
      name: 'socialnorms',
      component: SocialNorms,
      meta: { requiresAuth: true },
    },
    {
      path: '/socialnorms/meetingpeople',
      name: 'meetingpeople',
      component: MeetingPeople,
      meta: { requiresAuth: true },
    },
    {
      path: '/socialnorms/eatingout',
      name: 'eatingout',
      component: EatingOut,
      meta: { requiresAuth: true },
    },
    {
      path: '/navigatelife',
      name: 'navigatelife',
      component: () => import('../views/navigate-life/NavigateYourLife.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/publicTransportation',
      name: 'publictransportation',
      component: () => import('../views/navigate-life/transportation/PublicTransportation.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/grocceriesShopping',
      name: 'grocceriesshopping',
      component: () => import('../views/navigate-life/daily-life/Grocceries Shopping.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/medicalAttention',
      name: 'medicalattention',
      component: () => import('../views/navigate-life/daily-life/MedicalAttention.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/mykicardlearning',
      name: 'mykicardlearning',
      component: () => import('../views/navigate-life/transportation/MykiCardLearning.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/buslearning',
      name: 'buslearning',
      component: () => import('../views/navigate-life/transportation/BusLearning.vue'),
      meta: { requiresAuth: true },
    },
    // hello world
    {
      path: '/trainlearning',
      name: 'trainlearning',
      component: () => import('../views/navigate-life/transportation/TrainLearning.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/tramlearning',
      name: 'tramlearning',
      component: () => import('../views/navigate-life/transportation/TramLearning.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/facility/:id',
      name: 'FacilityDetail',
      component: () => import('../views/facilities/FacilityDetailPage.vue'),
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/safety',
      name: 'safety',
      component: SafetyPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/quiztaking',
      name: 'quiztaking',
      component: () => import('../views/interactive/QuizTaking.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: () => import('../views/interactive/ChatbotView.vue'),
      meta: { requiresAuth: true },
    },
    // 404 Not Found route - must be last
    {
      path: '/:pathMatch(.*)*',
      name: 'notfound',
      component: () => import('../views/NotFound.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/passcode')
  } else if (to.name === 'passcode' && isAuthenticated()) {
    next('/')
  } else {
    next()
  }
})

export default router
