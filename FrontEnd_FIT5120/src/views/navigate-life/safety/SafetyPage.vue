<template>
  <div class="safety-page">

    <!-- BannerBubble -->
    <BannerBubble :title="t('safety.title', 'Safety Information')"
      :subtitle="t('safety.subtitle', 'Stay safe and informed with real-time warnings, crime alerts, and safety tips')"
      :bubbleTexts="['Safe', '000', 'Help', 'Alert', 'Warning', 'Police', 'Fire', 'Ambulance', 'Emergency', 'Danger', 'Caution', 'SOS']"
      :customIcon="safetyIcon" />

    <!-- 主要内容区 -->
    <div class="safety-content container">
      <div class="safety-layout">
        <!-- 左侧导航：初始化时在 Weather 区左侧，滚动后 sticky 悬浮 -->
        <nav class="safety-float-nav" :class="{ 'is-sticky': isSticky }">
          <ul>
            <li :class="{ active: activeSection === 'hazard' }">
              <button @click="scrollTo('hazard')">{{ t('safety.hazard_warnings', 'Weather & Hazard Warnings')
                }}</button>
            </li>
            <li :class="{ active: activeSection === 'crime' }">
              <button @click="scrollTo('crime')">{{ t('safety.crime_hotspots', 'Crime Hotspots') }}</button>
            </li>
            <li :class="{ active: activeSection === 'scam' }">
              <button @click="scrollTo('scam')">{{ t('safety.scam_alerts', 'Scam Alerts') }}</button>
            </li>
            <li :class="{ active: activeSection === 'tips' }">
              <button @click="scrollTo('tips')">{{ t('safety.safety_tips', 'Safety Tips & Emergency Contacts')
                }}</button>
            </li>
          </ul>
        </nav>

        <div class="safety-grid">
          <!-- 天气预警模块 -->
          <section id="hazard" class="safety-module hazard-section" ref="hazardRef">
            <HazardWarnings />
          </section>

          <!-- 犯罪热点模块 -->
          <section id="crime" class="safety-module crime-section" ref="crimeRef">
            <CrimeHotspots />
          </section>

          <!-- 诈骗警报模块 -->
          <section id="scam" class="safety-module scam-section" ref="scamRef">
            <ScamAlerts />
          </section>

          <!-- 安全提示模块 -->
          <section id="tips" class="safety-module tips-section" ref="tipsRef">
            <SafetyTips />
          </section>
        </div>
      </div>

      <!-- 紧急联系按钮 -->
      <div class="emergency-section">
        <button class="emergency-btn" @click="callEmergency">
          🚨 {{ t('safety.emergency_call', 'Call 000 - Emergency') }}
        </button>
        <p class="emergency-note">
          {{ t('safety.emergency_note', 'For immediate emergency assistance') }}
        </p>
      </div>
    </div>
  </div>

</template>

<script setup>
import { h, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'
import HazardWarnings from '@/components/safety/HazardWarnings.vue'
import CrimeHotspots from '@/components/safety/CrimeHotspots.vue'
import ScamAlerts from '@/components/safety/ScamAlerts.vue'
import SafetyTips from '@/components/safety/SafetyTips.vue'

// Safety icon (shield)
const safetyIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z' })
])

const { t } = useI18n()

const callEmergency = () => {
  if (confirm(t('safety.emergency_confirm', 'Do you want to call 000 for emergency assistance?'))) {
    window.location.href = 'tel:000'
  }
}

// 悬浮导航：平滑滚动与高亮
const hazardRef = ref(null)
const crimeRef = ref(null)
const scamRef = ref(null)
const tipsRef = ref(null)
const activeSection = ref('hazard')
const isSticky = ref(false)

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function handleSticky() {
  isSticky.value = window.scrollY > 120
}

onMounted(() => {
  // 初始化与滚动时按“锚点行”计算当前高亮，避免长模块造成高亮滞后
  const updateActiveByScroll = () => {
    const anchor = 180 // 与 sticky/头部高度相匹配的参考线
    const sections = [hazardRef.value, crimeRef.value, scamRef.value, tipsRef.value].filter(Boolean)
    let bestId = 'hazard'
    let bestDist = Number.POSITIVE_INFINITY
    for (const sec of sections) {
      const rect = sec.getBoundingClientRect()
      const inView = rect.top <= anchor && rect.bottom > anchor
      const dist = Math.abs(rect.top - anchor)
      if (inView) {
        bestId = sec.id
        bestDist = -1
        break
      }
      if (bestDist >= 0 && dist < bestDist) {
        bestDist = dist
        bestId = sec.id
      }
    }
    activeSection.value = bestId
  }

  updateActiveByScroll()
  window.addEventListener('scroll', () => {
    updateActiveByScroll()
    handleSticky()
  }, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleSticky)
})
</script>

<style scoped>
.safety-page {
  min-height: 100vh;
  background: #ffffff;
}

.safety-content {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

@media (max-width: 768px) {
  .safety-content {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 576px) {
  .safety-content {
    padding: 1rem 0.75rem;
  }
}

/* 两列布局：左侧为导航，右侧为内容 */
.safety-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: start;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* 关键修复：允许网格子项在容器内收缩，避免溢出导致 100% 失效 */
.safety-layout > * {
  min-width: 0;
}

@media (max-width: 1200px) {
  .safety-layout {
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 991px) {
  .safety-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

.safety-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 100%;
  min-width: 0; /* 关键：作为 grid item 时可收缩 */
}

/* 确保 safety-grid 的直接子项也能收缩，避免内部内容撑破 */
.safety-grid > * {
  min-width: 0;
}

@media (min-width: 992px) {
  .safety-grid {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (min-width: 1400px) {
  .safety-grid {
    width: 85%;
  }
}

/* 让四个模块连贯起来：去除卡片视觉 */
.safety-module {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: visible;
  transition: none;
  width: 100%;
  border: none;
  padding: 2.5rem 0;
  scroll-margin-top: 180px;
  min-width: 0; /* 关键：作为 grid/flex 子项可收缩 */
}

.safety-module:hover {
  transform: none;
  box-shadow: none;
}

@media (max-width: 991px) {
  .safety-module {
    scroll-margin-top: 150px;
  }
}

@media (max-width: 768px) {
  .safety-module {
    scroll-margin-top: 140px;
  }
}

@media (max-width: 576px) {
  .safety-module {
    scroll-margin-top: 130px;
  }
}

.emergency-section {
  text-align: center;
  margin: 2rem auto;
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .emergency-section {
    width: 90%;
  }
}

@media (min-width: 992px) {
  .emergency-section {
    width: 80%;
  }
}

.emergency-btn {
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: white;
  border: none;
  padding: 1.75rem 3.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px rgba(255, 87, 34, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.emergency-btn:hover {
  background: linear-gradient(135deg, #e64a19 0%, #d84315 100%);
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(255, 87, 34, 0.4);
}

.emergency-btn:active {
  transform: translateY(-1px);
}

.emergency-note {
  margin-top: 1rem;
  font-size: 1rem;
  color: #6c757d;
  font-style: italic;
}

/* 老人友好化设计 - Tablet */
@media (max-width: 768px) {
  .safety-grid {
    gap: 1.5rem;
    width: 100%;
    padding: 0;
  }

  .safety-module {
    padding: 1.5rem 0;
    scroll-margin-top: 150px;
  }

  .emergency-btn {
    padding: 1.3rem 2.5rem;
    font-size: 1.3rem;
  }

  .emergency-note {
    font-size: 0.95rem;
  }
}

/* 小屏幕设备优化 - Mobile */
@media (max-width: 576px) {
  .safety-content {
    padding: 0 0.75rem;
  }

  .safety-grid {
    width: 100%;
    gap: 1rem;
  }

  .safety-module {
    padding: 1rem 0;
    scroll-margin-top: 130px;
  }

  .emergency-section {
    padding: 0 0.5rem;
  }

  .emergency-btn {
    padding: 1.1rem 2rem;
    font-size: 1.2rem;
    width: 100%;
    max-width: 100%;
  }

  .emergency-note {
    font-size: 0.9rem;
    margin-top: 0.75rem;
  }
}

/* 极小屏幕优化 */
@media (max-width: 380px) {
  .safety-content {
    padding: 0 0.5rem;
  }

  .emergency-btn {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    border-radius: 40px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .safety-module {
    border: 2px solid #333;
  }

  .emergency-btn {
    border: 3px solid #fff;
  }
}

/* 大字体模式支持 */
@media (prefers-reduced-motion: no-preference) {
  .safety-module {
    animation: none;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 悬浮导航样式 */
.safety-float-nav {
  position: sticky;
  top: 170px;
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  margin-top: 70px;
  transition: all 0.3s ease;
}

.safety-float-nav ul {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0.8rem;
}

.safety-float-nav li button {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.safety-float-nav li button:hover {
  background: rgba(142, 36, 170, 0.1);
  color: #8e24aa;
  transform: translateX(4px);
}

.safety-float-nav li.active button {
  background: #8e24aa;
  color: #fff;
  box-shadow: 0 4px 12px rgba(142, 36, 170, 0.3);
}

.safety-float-nav.is-sticky {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* 移动端：右侧细竖条悬浮导航（四个小竖条，当前项高亮） */
@media (max-width: 991px) {
  .safety-float-nav {
    position: fixed;
    top: 62%;
    right: 10px;
    transform: translateY(-50%);
    width: 12px;
    background: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    margin: 0;
    padding: 0;
    z-index: 1000;
  }

  .safety-float-nav ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .safety-float-nav li button {
    display: block;
    width: 12px;
    height: 40px;
    padding: 0;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.15);
    border: none;
    cursor: pointer;
    transition: background 0.2s ease, transform 0.2s ease;
    /* 隐藏文字，仅保留可点击区域 */
    font-size: 0;
    line-height: 0;
    color: transparent;
    overflow: hidden;
  }

  .safety-float-nav li button:hover {
    background: rgba(0, 0, 0, 0.25);
    transform: translateX(-1px);
  }

  .safety-float-nav li.active button {
    background: #8e24aa;
    box-shadow: 0 0 0 3px rgba(142, 36, 170, 0.15);
  }

  /* 更小屏幕：缩短竖条高度并靠边一些 */
  @media (max-width: 576px) {
    .safety-float-nav {
      right: 8px;
    }
    .safety-float-nav li button {
      height: 32px;
      width: 10px;
    }
  }
}

@media (max-width: 768px) {
  /* 保持右侧竖条样式，不切到横排按钮 */
  .safety-float-nav {
    top: 62%;
    right: 10px;
    transform: translateY(-50%);
  }

  .safety-float-nav ul {
    flex-direction: column;
    padding: 0;
    gap: 10px;
  }

  .safety-float-nav li button {
    width: 10px;
    height: 36px;
    padding: 0;
    font-size: 0;
    line-height: 0;
    color: transparent;
  }
}

/* 深度选择器，弱化子组件内的卡片感，让整体更统一 */
:deep(.module-header) {
  background: transparent !important;
  border-bottom: none !important;
  padding: 0 0 1rem 0 !important;
}

:deep(.module-title) {
  text-align: left !important;
  color: #5a2a82 !important;
  font-size: clamp(1.5rem, 4vw, 2rem) !important;
}

:deep(.module-content) {
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
}

:deep(.current-weather),
:deep(.tips-category),
:deep(.tip-card),
:deep(.safety-rating),
:deep(.resource-link),
:deep(.warning-item) {
  box-shadow: none !important;
}

:deep(.tips-category) {
  background: transparent !important;
  border: none !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

:deep(.crime-map-section .map-legend),
:deep(.weather-stats .stat-item) {
  box-shadow: none !important;
}

/* Responsive adjustments for child components */
@media (max-width: 768px) {
  :deep(.module-header) {
    padding: 0 0 0.75rem 0 !important;
  }

  :deep(.module-title) {
    font-size: 1.5rem !important;
  }

  :deep(.tip-card),
  :deep(.warning-item),
  :deep(.resource-link) {
    padding: 0.75rem !important;
  }
}

@media (max-width: 576px) {
  :deep(.module-header) {
    padding: 0 0 0.5rem 0 !important;
  }

  :deep(.module-title) {
    font-size: 1.3rem !important;
  }

  :deep(.tip-card),
  :deep(.warning-item),
  :deep(.resource-link) {
    padding: 0.5rem !important;
    font-size: 0.9rem !important;
  }
}
</style>
