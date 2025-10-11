<template>
  <div class="modern-sections">
    <BannerBubble :title="$t('socialnorms.title')" :subtitle="$t('socialnorms.subtitle')"
      :bubbleTexts="['Navigate', 'Facilities', 'Transport', 'Learning', 'Culture', 'Social', 'Norms', 'Australia']"
      :customIcon="socialIcon" />

    <div class="cards-wrapper">
      <div class="row w-100 m-0">
        <div v-for="(card, idx) in cards" :key="card.key" class="col-lg-6 col-md-6 col-12 d-flex justify-content-center mb-4">
          <div class="slide-card-with-image w-100" :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'" 
               :data-aos-delay="`${0 + idx * 100}`">
            <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
              <div class="img-hover-wrapper" @click="goTo(card.key)">
                <img :src="card.img" :alt="card.title" class="slide-img-top w-100 h-100" />
                <div class="portfolio__overlay">
                  <div class="overlay-title">{{ card.title }}</div>
                </div>
              </div>
            </div>
            <div class="slide-card text-center">
              <h2 class="slide-title">{{ card.title }}</h2>
              <p class="slide-desc">{{ card.text }}</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <button class="learn-more-btn" @click="goTo(card.key)">
                {{ $t('button_learnmore.label') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import BannerBubble from '@/components/BannerBubble.vue'

// Social/people icon
const socialIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' })
])

const router = useRouter()
const { t } = useI18n()

const cardKeys = ['meetingpeople', 'eatingout']

const cardImages = {
  meetingpeople:
    'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
  eatingout:
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
}

const cards = computed(() =>
  cardKeys.map((key) => ({
    key,
    title: t(`socialnorms.${key}.title`),
    text: t(`socialnorms.${key}.subtitle`),
    img: cardImages[key],
  })),
)

function goTo(key) {
  if (key === 'meetingpeople') {
    router.push('/socialnorms/meetingpeople')
  } else if (key === 'eatingout') {
    router.push('/socialnorms/eatingout')
  }
}
</script>

<style scoped>
.modern-sections {
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  padding: 0 0 40px 0;
  font-family: 'Roboto', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cards-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.slide-card-with-image {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(102, 26, 255, 0.10);
  padding: 32px 36px;
  gap: 32px;
  width: 100%;
  margin: 0;
  transition: box-shadow 0.25s, transform 0.22s, border 0.18s;
  border: 2.5px solid transparent;
  z-index: 1;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.slide-card-with-image::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 20%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 100%);
  transform: skewX(-25deg);
  transition: left 0.75s cubic-bezier(.4, 2, .6, 1);
  z-index: 5;
  pointer-events: none;
}

.slide-card-with-image:hover::before {
  left: 125%;
}

.slide-card-with-image:hover {
  box-shadow: 0 12px 36px 0 rgba(102, 26, 255, 0.22), 0 2px 16px 0 rgba(102, 26, 255, 0.10);
  transform: translateY(-15px) !important;
  border: 2.5px solid #a259e6;
  z-index: 2;
  z-index: 2;
}

.slide-card {
  background: transparent;
  border-radius: 12px;
  box-shadow: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.slide-title {
  color: #661aff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  text-align: center;
}

.slide-desc {
  color: #222;
  font-size: 1.08rem;
  margin-bottom: 8px;
  text-align: center;
}

.slide-image {
  position: relative;
}

.img-hover-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s;
}

.img-hover-wrapper::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 20%;
  height: 100%;
  background: linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0) 100%);
  transform: skewX(-25deg);
  transition: left 0.75s cubic-bezier(.4, 2, .6, 1);
  z-index: 5;
  pointer-events: none;
}

.img-hover-wrapper:hover::before {
  left: 125%;
}

.slide-img-top {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  opacity: 1;
  z-index: 1;
  transition: filter 0.5s, transform 0.5s;
}

.img-hover-wrapper:hover .slide-img-top {
  filter: brightness(0.7);
  transform: scale(1.08);
}

.portfolio__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: all 0.75s;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 24px;
}

.img-hover-wrapper:hover .portfolio__overlay {
  opacity: 1;
}

.overlay-title {
  color: #fff;
  font-weight: bold;
  font-size: 1.3rem;
  margin-bottom: 6px;
}

.section-content {
  flex: 0 0 40%;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: #6b46c1;
  margin-bottom: 16px;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 28px;
}

.learn-more-btn {
  background: #6B46C1;
  color: #fff;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.10);
  transition: all 0.3s cubic-bezier(.4, 2, .6, 1), transform 0.3s cubic-bezier(.4, 2, .6, 1);
  text-decoration: none;
}

.learn-more-btn:hover {
  background: #8A4AF3;
  transform: scale(1.05);
}

@media (max-width: 900px) {

  .service-section,
  .service-section.reverse {
    flex-direction: column !important;
    min-height: 0;
    margin: 32px 0;
    max-width: 98vw;
  }

  .section-img,
  .section-content {
    flex: 1 1 100%;
    width: 100%;
    min-height: 180px;
    padding: 0;
  }

  .section-img {
    padding: 16px 10px;
  }

  .slide-card-with-image {
    padding: 16px 10px;
    gap: 12px;
    margin: 0;
  }

  .slide-card {
    font-size: 1rem;
    align-items: center;
  }

  .slide-title {
    font-size: 1.1rem;
    margin-bottom: 8px;
    text-align: center;
  }

  .slide-desc {
    font-size: 0.85rem;
    margin-bottom: 4px;
    text-align: center;
  }

  .section-content {
    align-items: center;
    text-align: center;
    padding: 24px 12px 32px 12px;
  }

  .section-title {
    font-size: 1.4rem;
  }

  .section-subtitle {
    font-size: 1rem;
  }
}
</style>
