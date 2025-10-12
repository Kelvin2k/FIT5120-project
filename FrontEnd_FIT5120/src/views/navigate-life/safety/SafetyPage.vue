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
              <button @click="scrollTo('hazard')">{{ t('safety.hazard_warnings', 'Weather & Hazard Warnings') }}</button>
            </li>
            <li :class="{ active: activeSection === 'crime' }">
              <button @click="scrollTo('crime')">{{ t('safety.crime_hotspots', 'Crime Hotspots') }}</button>
            </li>
            <li :class="{ active: activeSection === 'scam' }">
              <button @click="scrollTo('scam')">{{ t('safety.scam_alerts', 'Scam Alerts') }}</button>
            </li>
            <li :class="{ active: activeSection === 'tips' }">
              <button @click="scrollTo('tips')">{{ t('safety.safety_tips', 'Safety Tips & Emergency Contacts') }}</button>
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
  margin: 0 auto;
  padding: 0 1rem;
}

/* 两列布局：左侧为导航，右侧为内容 */
.safety-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  align-items: start;
  gap: 1rem;
}
@media (max-width: 991px) {
  .safety-layout {
    grid-template-columns: 1fr;
  }
}

.safety-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0; /* 取消模块间隙使其连贯 */
  margin-bottom: 2rem;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
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
  padding: 2rem 0; /* 给模块留出自然留白 */
  scroll-margin-top: 80px; /* 便于锚点滚动后不被导航遮挡 */
}

.safety-module:hover {
  transform: none;
  box-shadow: none;
}

.emergency-section {
  text-align: center;
  margin: 2rem 0;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
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

/* 老人友好化设计 */
@media (max-width: 768px) {
  .safety-grid {
    gap: 1rem;
    width: 90%;
    padding: 0;
  }

  .safety-header {
    padding: 1.5rem 0;
    margin-bottom: 1rem;
  }

  .safety-title {
    font-size: 2rem;
  }

  .safety-subtitle {
    font-size: 1.1rem;
  }

  .emergency-section {
    width: 90%;
    margin: 1.5rem auto;
  }

  .emergency-btn {
    padding: 1.2rem 2rem;
    font-size: 1.3rem;
  }
}

/* 小屏幕设备优化 */
@media (max-width: 480px) {
  .safety-content {
    padding: 0 0.5rem;
  }

  .safety-grid {
    width: 95%;
    gap: 0.8rem;
  }

  .emergency-section {
    width: 95%;
    margin: 1rem auto;
  }

  .safety-title {
    font-size: 1.8rem;
  }

  .safety-subtitle {
    font-size: 1rem;
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
  top: 170px; /* 更早开始吸顶，避免被头部遮挡 */
  z-index: 100;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  margin-top: 70px;
}
.safety-float-nav ul {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0.6rem;
}
.safety-float-nav li button {
  background: transparent;
  border: none;
  padding: 0.55rem 0.8rem;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
  width: 100%;
  text-align: left;
}
.safety-float-nav li.active button {
  background: #8e24aa;
  color: #fff;
}
.safety-float-nav.is-sticky { box-shadow: 0 10px 30px rgba(0,0,0,0.08); }

/* 移动端回退为顶部横向条（导航在内容上方） */
@media (max-width: 991px) {
  .safety-float-nav {
    position: sticky;
    top: 0;
    width: 100%;
    border-radius: 0;
    border: 0;
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  }
  .safety-float-nav ul {
    flex-direction: row;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    overflow-x: auto;
  }
  .safety-float-nav li button {
    width: auto;
    white-space: nowrap;
    border-radius: 999px;
  }
  .safety-content {
    padding-left: 0;
  }
}

/* 深度选择器，弱化子组件内的卡片感，让整体更统一 */
:deep(.module-header) {
  background: transparent !important;
  border-bottom: none !important;
  padding: 0 0 0.5rem 0 !important;
}
:deep(.module-title) {
  text-align: left !important;
  color: #5a2a82 !important;
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
</style>
