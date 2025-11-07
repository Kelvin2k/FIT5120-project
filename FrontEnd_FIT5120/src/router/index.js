import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import FacilityEvent from '@/views/facilities/FacilityEvent.vue'
import LearnEnglish from '@/views/learning/english/LearnEnglish.vue'
import SocialNorms from '@/views/learning/social-norms/socialNorms.vue'
import MeetingPeople from '@/views/learning/social-norms/MeetingPeople.vue'
import EatingOut from '@/views/learning/social-norms/EatingOut.vue'
import SafetyPage from '@/views/navigate-life/safety/SafetyPage.vue'

const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/facilities',
      name: 'facilities',
      component: FacilityEvent,
    },
    {
      path: '/FacilityEvent',
      name: 'facilityevent',
      component: FacilityEvent,
    },
    {
      path: '/learnenglish',
      name: 'learnenglish',
      component: LearnEnglish,
    },
    {
      path: '/flashcards/:category/:language',
      name: 'flashcards',
      component: () => import('../views/learning/english/FlashcardsView.vue'),
      props: true,
    },
    {
      path: '/socialnorms',
      name: 'socialnorms',
      component: SocialNorms,
    },
    {
      path: '/socialnorms/meetingpeople',
      name: 'meetingpeople',
      component: MeetingPeople,
    },
    {
      path: '/socialnorms/eatingout',
      name: 'eatingout',
      component: EatingOut,
    },
    {
      path: '/navigatelife',
      name: 'navigatelife',
      component: () => import('../views/navigate-life/NavigateYourLife.vue'),
    },
    {
      path: '/publicTransportation',
      name: 'publictransportation',
      component: () => import('../views/navigate-life/transportation/PublicTransportation.vue'),
    },
    {
      path: '/grocceriesShopping',
      name: 'grocceriesshopping',
      component: () => import('../views/navigate-life/daily-life/Grocceries Shopping.vue'),
    },
    {
      path: '/medicalAttention',
      name: 'medicalattention',
      component: () => import('../views/navigate-life/daily-life/MedicalAttention.vue'),
    },
    {
      path: '/mykicardlearning',
      name: 'mykicardlearning',
      component: () => import('../views/navigate-life/transportation/MykiCardLearning.vue'),
    },
    {
      path: '/buslearning',
      name: 'buslearning',
      component: () => import('../views/navigate-life/transportation/BusLearning.vue'),
    },
    // hello world
    {
      path: '/trainlearning',
      name: 'trainlearning',
      component: () => import('../views/navigate-life/transportation/TrainLearning.vue'),
    },
    {
      path: '/tramlearning',
      name: 'tramlearning',
      component: () => import('../views/navigate-life/transportation/TramLearning.vue'),
    },
    {
      path: '/facility/:id',
      name: 'FacilityDetail',
      component: () => import('../views/facilities/FacilityDetailPage.vue'),
      props: true,
    },
    {
      path: '/safety',
      name: 'safety',
      component: SafetyPage,
    },
    {
      path: '/quiztaking',
      name: 'quiztaking',
      component: () => import('../views/interactive/QuizTaking.vue'),
    },
    {
      path: '/chatbot',
      name: 'chatbot',
      component: () => import('../views/interactive/ChatbotView.vue'),
    },
    // 404 Not Found route - must be last
    {
      path: '/notfound',
      name: 'notfound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {
    next('/notfound')
  } else {
    next()
  }
})

export default router
