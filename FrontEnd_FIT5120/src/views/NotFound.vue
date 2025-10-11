<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <!-- Animated 404 Number -->
      <div class="error-number-section">
        <h1 class="error-number" data-aos="zoom-in" data-aos-duration="1000">
          4<span class="rotating-zero">0</span>4
        </h1>
        <div class="error-subtitle" data-aos="fade-up" data-aos-delay="300">
          {{ t('404.subtitle') }}
        </div>
      </div>

      <!-- Illustration/Icon -->
      <div class="illustration-section" data-aos="fade-up" data-aos-delay="500">
        <div class="lost-icon">
          <i class="fa-solid fa-compass"></i>
        </div>
        <div class="floating-icons">
          <i class="fa-solid fa-map-marker-alt icon-1"></i>
          <i class="fa-solid fa-question icon-2"></i>
          <i class="fa-solid fa-search icon-3"></i>
        </div>
      </div>

      <!-- Message Section -->
      <div class="message-section" data-aos="fade-up" data-aos-delay="700">
        <h2 class="main-message">{{ t('404.main_message') }}</h2>
        <p class="sub-message">{{ t('404.sub_message') }}</p>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" data-aos="fade-up" data-aos-delay="900">
        <button @click="goHome" class="btn-primary">
          <i class="fa-solid fa-home"></i>
          {{ t('404.go_home') }}
        </button>
        <button @click="goBack" class="btn-secondary">
          <i class="fa-solid fa-arrow-left"></i>
          {{ t('404.go_back') }}
        </button>
      </div>

      <!-- Quick Navigation Links -->
      <div class="quick-nav" data-aos="fade-up" data-aos-delay="1100">
        <h3>{{ t('404.quick_nav_title') }}</h3>
        <div class="nav-links">
          <router-link to="/facilities" class="nav-link">
            <i class="fa-solid fa-map-marker-alt"></i>
            {{ t('nav.facility') }}
          </router-link>
          <router-link to="/learnenglish" class="nav-link">
            <i class="fa-solid fa-language"></i>
            {{ t('nav.english') }}
          </router-link>
          <router-link to="/socialnorms" class="nav-link">
            <i class="fa-solid fa-users"></i>
            {{ t('nav.social') }}
          </router-link>
          <router-link to="/navigatelife" class="nav-link">
            <i class="fa-solid fa-compass"></i>
            {{ t('nav.navigate') }}
          </router-link>
          <router-link to="/chatbot" class="nav-link">
            <i class="fa-solid fa-robot"></i>
            {{ t('nav.chatbot') }}
          </router-link>
          <router-link to="/safety" class="nav-link">
            <i class="fa-solid fa-shield-alt"></i>
            {{ t('nav.safety') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Background decorative elements -->
    <div class="bg-decorations">
      <div class="decoration-circle circle-1"></div>
      <div class="decoration-circle circle-2"></div>
      <div class="decoration-circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

function goHome() {
  router.push('/')
}

function goBack() {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  position: relative;
  z-index: 2;
}

/* Error Number Section */
.error-number-section {
  margin-bottom: 3rem;
}

.error-number {
  font-size: clamp(4rem, 15vw, 8rem);
  font-weight: 900;
  color: #fff;
  text-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  margin: 0;
  line-height: 1;
}

.rotating-zero {
  display: inline-block;
  color: #fbbf24;
  animation: rotate 3s ease-in-out infinite;
  transform-origin: center;
}

@keyframes rotate {

  0%,
  100% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(360deg);
  }
}

.error-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* Illustration Section */
.illustration-section {
  position: relative;
  margin: 3rem 0;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lost-icon {
  font-size: 5rem;
  color: #fbbf24;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

.floating-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.floating-icons i {
  position: absolute;
  color: rgba(255, 255, 255, 0.6);
  animation: floatAround 4s ease-in-out infinite;
}

.icon-1 {
  top: 20%;
  left: 20%;
  font-size: 1.5rem;
  animation-delay: 0s;
}

.icon-2 {
  top: 30%;
  right: 25%;
  font-size: 1.2rem;
  animation-delay: 1s;
}

.icon-3 {
  bottom: 25%;
  left: 30%;
  font-size: 1.3rem;
  animation-delay: 2s;
}

@keyframes floatAround {

  0%,
  100% {
    transform: translateY(0px) scale(1);
    opacity: 0.6;
  }

  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 1;
  }
}

/* Message Section */
.message-section {
  margin: 3rem 0;
}

.main-message {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.sub-message {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 3rem 0;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  min-width: 140px;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #1f2937;
  box-shadow: 0 4px 15px rgba(251, 191, 36, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(251, 191, 36, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
}

/* Quick Navigation */
.quick-nav {
  margin-top: 3rem;
}

.quick-nav h3 {
  color: #fff;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fbbf24;
  transform: translateY(-3px);
  border-color: rgba(251, 191, 36, 0.3);
}

.nav-link i {
  font-size: 1.5rem;
}

/* Background Decorations */
.bg-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  animation: drift 20s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: -75px;
  animation-delay: 5s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 10%;
  animation-delay: 10s;
}

@keyframes drift {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  33% {
    transform: translateY(-30px) rotate(120deg);
  }

  66% {
    transform: translateY(30px) rotate(240deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .not-found-container {
    padding: 1rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 250px;
  }

  .nav-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-message {
    font-size: 1.5rem;
  }

  .sub-message {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .error-number {
    font-size: 3rem;
  }

  .nav-link {
    padding: 0.8rem;
    font-size: 0.9rem;
  }

  .nav-link i {
    font-size: 1.3rem;
  }
}
</style>
