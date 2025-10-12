<template>
  <div class="header-w">
    <!-- Top info bar -->
    <div class="top-info-bar d-block">
      <div class="container-fluid">
        <div class="row align-items-center">
          <div class="col-md-8">
            <div class="info-items">
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                </svg>
                <span>{{ $t('header.multilingual') }}</span>
              </div>
              <div class="info-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <span>{{ $t('header.safeSecure') }}</span>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="top-actions">
              <!-- Language Selector -->
              <div class="language-selector">
                <div class="lang-dropdown">
                  <button class="lang-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
                    </svg>
                    <span>{{ $t(currentLangText) }}</span>
                    <svg class="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  <ul class="lang-menu">
                    <li v-for="lang in languages" :key="lang.code">
                      <a href="#" @click.prevent="setLang(lang.code)" :class="{ active: locale === lang.code }">
                        {{ $t(lang.text) }}
                        <span v-if="locale === lang.code" class="check-mark">&#10003;</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light main-navbar">
      <div class="container-fluid">
        <!-- Logo Section -->
        <div class="logo-section">
          <router-link class="navbar-brand" to="/">
            <div class="logo-container">
              <div class="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </div>
              <div class="logo-text">
                <span class="brand-name">{{ $t('nav.brand') }}</span>
                <span class="brand-tagline">Life. Learning. Community.</span>
              </div>
            </div>
          </router-link>
        </div>

        <!-- Mobile Toggle -->
        <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <!-- Navigation Links -->
        <TransitionGroup tag="div" class="collapse navbar-collapse" id="navbarNav" name="nav-slide">
          <ul class="navbar-nav ms-auto navigation-menu" key="nav-list">
            <li class="nav-item dropdown" v-for="(link, index) in navLinks_dropdown" :key="index">
              <div class="nav-link dropdown-hover" :class="{ 'router-link-active': isActiveDropdown(link) }">
                <span @click="navigateDropdown(link.to)">{{ $t(link.text) }}</span>
                <ul v-if="link.children === 'socialNorms' && isDesktop" class="dropdown-menu">
                  <li v-for="(item, idx) in socialNorms" :key="idx">
                    <router-link class="dropdown-item" :to="item.to">{{ $t(item.text) }}</router-link>
                  </li>
                </ul>
                <ul v-if="link.children === 'navigateYourLife' && isDesktop" class="dropdown-menu"
                  data-bs-toggle="dropdown" aria-expanded="false">
                  <li v-for="(item, idx) in navigateYourLife" :key="idx">
                    <router-link class="dropdown-item" :to="item.to">{{ $t(item.text) }}</router-link>
                  </li>
                </ul>
              </div>
            </li>
            <!-- Regular Navigation Items -->
            <li class="nav-item" v-for="(link, index) in navLinks" :key="index">
              <router-link class="nav-link" :to="link.to">
                <span class="nav-text">{{ $t(link.text) }}</span>
              </router-link>
            </li>
          </ul>
        </TransitionGroup>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()

if (!locale.value) locale.value = 'en'

function navigateDropdown(path) {
  router.push(path)
}

function isActiveDropdown(link) {
  const currentPath = route.path

  if (link.children === 'socialNorms') {
    return currentPath.startsWith('/socialnorms') ||
      currentPath === '/MeetingPeople' ||
      currentPath === '/EatingOut'
  }

  if (link.children === 'navigateYourLife') {
    return currentPath.startsWith('/navigatelife') ||
      currentPath === '/publicTransportation' ||
      currentPath === '/grocceriesShopping' ||
      currentPath === '/medicalAttention' ||
      currentPath === '/mykicardlearning' ||
      currentPath === '/buslearning' ||
      currentPath === '/trainlearning' ||
      currentPath === '/tramlearning'
  }

  return false
}

// Detect desktop (>=992px)
const isDesktop = ref(window.innerWidth >= 992)
function handleResize() {
  isDesktop.value = window.innerWidth >= 992
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const currentLangText = computed(() => {
  const found = languages.find(l => l.code === locale.value)
  return found ? found.text : 'nav.lang.en'
})

const navLinks = [
  { to: '/facilities', text: 'nav.facility' },
  { to: '/learnenglish', text: 'nav.english' },
  { to: '/chatbot', text: 'nav.chatbot' },
  { to: '/safety', text: 'nav.safety' }
]
const navLinks_dropdown = [
  { to: '/socialnorms', text: 'nav.social', children: 'socialNorms' },
  { to: '/navigatelife', text: 'nav.navigate', children: 'navigateYourLife' },
]

const socialNorms = [
  {
    text: 'socialnorms.meetingpeople.title',
    to: '/socialnorms/meetingpeople',
  },
  {
    text: 'socialnorms.eatingout.title',
    to: '/socialnorms/eatingout',
  },
]

const navigateYourLife = [
  {
    text: 'navigate_your_life.cards.publictransportation.title',
    to: '/publicTransportation',
  },
  {
    text: 'navigate_your_life.cards.grocceriesshopping.title',
    to: '/grocceriesShopping',
  },
  {
    text: 'navigate_your_life.cards.medicalattention.title',
    to: '/medicalAttention',
  },
]

const languages = [
  { code: 'en', text: 'nav.lang.en' },
  { code: 'zh', text: 'nav.lang.zh' },
  { code: 'vi', text: 'nav.lang.vi' },
  { code: 'id', text: 'nav.lang.id' },
]

function setLang(lang) {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped>
/* Header Wrapper */
.header-w {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Top Info Bar */
.top-info-bar {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A78BFA 100%);
  padding: 8px 0;
  font-size: 0.85rem;
}

.info-items {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.info-item svg {
  width: 16px;
  height: 16px;
  color: #fbbf24;
}

.top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Language Selector */
.language-selector {
  position: relative;
}

.lang-dropdown {
  position: relative;
}

.lang-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.lang-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fbbf24;
}

.lang-button svg {
  width: 16px;
  height: 16px;
}

.lang-button .chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.3s ease;
}

.lang-dropdown:hover .chevron {
  transform: rotate(180deg);
}

.lang-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  min-width: 150px;
  padding: 8px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  list-style: none;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.lang-dropdown:hover .lang-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.lang-menu li {
  margin: 0;
}

.lang-menu a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.lang-menu a:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
  color: #fbbf24 !important;
}

.lang-menu a.active {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  color: white;
}

.check-mark {
  font-weight: bold;
  color: #6B46C1;
}

.lang-menu a.active .check-mark {
  color: white;
}

/* Main Navigation */
.main-navbar {
  background: white;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.logo-icon svg {
  width: 28px;
  height: 28px;
  color: #fbbf24;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 1.75rem;
  font-weight: 800;
  color: #6B46C1;
  line-height: 1;
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.navbar-brand:hover .logo-icon {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(107, 70, 193, 0.3);
}

/* Custom Mobile Toggle */
.custom-toggler {
  border: none;
  padding: 8px;
  background: transparent;
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.custom-toggler:focus {
  box-shadow: none;
}

.custom-toggler span {
  display: block;
  height: 3px;
  width: 24px;
  background: #6B46C1;
  margin: 5px 0;
  border-radius: 2px;
  transition: all 0.3s ease;
  position: relative;
}

.custom-toggler:hover {
  background: rgba(107, 70, 193, 0.1);
}

/* Navigation Menu */

.nav-item {
  position: relative;
}

.nav-link {
  color: #374151 !important;
  font-weight: 600;
  padding: 12px 20px !important;
  border-radius: 10px;
  transition: all 0.3s ease;
  position: relative;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
  color: #fbbf24 !important;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  color: white !important;
  box-shadow: 0 4px 15px rgba(107, 70, 193, 0.4);
}

/* Dropdown Styles */
.dropdown-hover {
  position: relative;
  cursor: pointer;
}

.dropdown-hover span {
  cursor: pointer;
  display: block;
  width: 100%;
}

.dropdown-hover .dropdown-menu {
  display: block;
  opacity: 0;
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 100%;
  min-width: 220px;
  z-index: 999;
  transform: translateY(-10px);
  transition: opacity 0.35s cubic-bezier(.4, 0, .2, 1), transform 0.35s cubic-bezier(.4, 0, .2, 1);
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  list-style: none;
  margin: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.dropdown-hover:hover .dropdown-menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: #374151 !important;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 2px 8px;
}

.dropdown-item:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
  color: #fbbf24 !important;
  transform: translateX(5px);
}

.dropdown-item.router-link-active {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 100%);
  color: white !important;
}

/* Animations */
.nav-slide-enter-active,
.nav-slide-leave-active {
  transition: all 0.3s ease;
}

.nav-slide-enter-from,
.nav-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .top-info-bar {
    padding: 6px 0;
  }

  .info-items {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .info-item {
    font-size: 0.8rem;
  }

  .top-actions {
    justify-content: flex-start;
    margin-top: 0.5rem;
  }

  .main-navbar {
    padding: 0.75rem 0;
  }

  .logo-container {
    gap: 0.75rem;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
  }

  .logo-icon svg {
    width: 22px;
    height: 22px;
  }

  .brand-name {
    font-size: 1.4rem;
  }

  .brand-tagline {
    font-size: 0.7rem;
  }

  .navigation-menu {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .nav-link {
    padding: 15px 20px !important;
  }

  .dropdown-menu {
    position: static;
    opacity: 1;
    visibility: visible;
    transform: none;
    box-shadow: none;
    border: none;
    background: rgba(243, 244, 246, 0.5);
    margin-top: 0.5rem;
  }
}

@media (max-width: 991px) {
  .navbar-collapse {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
}

/* Large screens */
@media (min-width: 1200px) {
  .main-navbar {
    padding: 1.25rem 0;
  }

  .logo-icon {
    width: 55px;
    height: 55px;
  }

  .logo-icon svg {
    width: 32px;
    height: 32px;
  }

  .brand-name {
    font-size: 1.9rem;
  }

  .nav-link {
    padding: 14px 24px !important;
    font-size: 1rem;
  }
}
</style>
