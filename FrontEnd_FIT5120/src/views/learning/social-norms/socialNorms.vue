<template>
  <div>
    <!-- Banner -->
    <BannerBubble :title="$t('banner.socialNorms.title')" :subtitle="$t('banner.socialNorms.subtitle')"
      :bubbleTexts="['Navigate', 'Facilities', 'Transport', 'Learning', 'Culture', 'Social', 'Norms', 'Australia']"
      :custom-icon="socialIcon" />

    <!-- Cards Section -->
    <div class="learning-slider-container justify-content-center container">
      <div class="slider-content">
        <div :class="['cards-wrapper', 'grid']">
          <div class="row w-100 m-0">
            <!-- Meeting People Card -->
            <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4">
              <div :class="['slide-card-with-image', 'w-100', 'grid']" data-aos="fade-up" data-aos-delay="0">
                <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
                  <div class="img-hover-wrapper" @click="goTo('meetingpeople')">
                    <img
                      src="https://australianautismalliance.org.au/wp-content/uploads/2025/07/hero-_0000_AdobeStock_429987593.jpg"
                      alt="Meeting People" class="slide-img-top w-100 h-100" />
                  </div>
                </div>
                <div class="slide-card text-center">
                  <h2 class="slide-title">{{ $t('socialnorms.meetingpeople.title') }}</h2>
                  <p class="slide-desc">{{ $t('socialnorms.meetingpeople.subtitle') }}</p>
                </div>
                <div class="d-flex justify-content-center mt-3">
                  <button class="learn-more-btn" @click="goTo('meetingpeople')">Learn More</button>
                </div>
              </div>
            </div>

            <!-- Eating Out Card -->
            <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4">
              <div :class="['slide-card-with-image', 'w-100', 'grid']" data-aos="fade-up" data-aos-delay="50">
                <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
                  <div class="img-hover-wrapper" @click="goTo('eatingout')">
                    <img
                      src="https://sydneyweekender.com.au/wp-content/uploads/2025/01/TASTING-AUSTRALIA-WEBSITE-IMAGE.jpg"
                      alt="Eating Out" class="slide-img-top w-100 h-100" />
                  </div>
                </div>
                <div class="slide-card text-center">
                  <h2 class="slide-title">{{ $t('socialnorms.eatingout.title') }}</h2>
                  <p class="slide-desc">{{ $t('socialnorms.eatingout.subtitle') }}</p>
                </div>
                <div class="d-flex justify-content-center mt-3">
                  <button class="learn-more-btn" @click="goTo('eatingout')">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { h, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BannerBubble from '@/components/BannerBubble.vue';
import AOS from 'aos';

const router = useRouter();
const socialIcon = () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
  h('path', { d: 'M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.996 1.996 0 0 0 18.06 7H16c-.8 0-1.56.31-2.12.88l-3.76 3.76c-.78.78-.78 2.05 0 2.83l2.83 2.83L12 18v4h2v-3l1.46-1.46L17 19v3h3zM12.83 11.83L16 8.66V7h2l1.5 4.5-1.83 1.83-2.84-2.83z' }),
  h('circle', { cx: '7.5', cy: '14', r: '2' }),
  h('path', { d: 'M5.5 20v-2.5c0-1.1.9-2 2-2s2 .9 2 2V20h2v-2.5c0-2.21-1.79-4-4-4s-4 1.79-4 4V20h2z' })
]);

function goTo(key) {
  if (key === 'meetingpeople') {
    router.push('/socialnorms/meetingpeople');
  } else if (key === 'eatingout') {
    router.push('/socialnorms/eatingout');
  }
}

// Ensure AOS is initialized on mount
onMounted(() => {
  AOS.init();
});
</script>

<style scoped>
.learning-slider-container {
  min-height: 80vh;
  background: #74238b00;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Quicksand', 'Arial', sans-serif;
}

.cards-wrapper {
  width: 100%;
}

.slider-content {
  width: 100%;
  min-height: 250px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #222;
  padding-bottom: 24px;
  padding-top: 24px;
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
}

.slide-card-with-image.grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
}

.slide-card-with-image:hover {
  box-shadow: 0 12px 36px 0 rgba(102, 26, 255, 0.22), 0 2px 16px 0 rgba(102, 26, 255, 0.10);
  transform: translateY(-15px) !important;
  border: 2.5px solid #a259e6;
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
  align-items: flex-start;
}

.slide-title {
  color: #661aff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
  text-align: start;
}

.slide-desc {
  color: #222;
  font-size: 1.08rem;
  margin-bottom: 8px;
  text-align: start;
}

.slide-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
  background: #fff;
  border: none;
  transition: transform 0.5s;
  display: block;
}

.img-hover-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
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
  .slider-content {
    font-size: 1.1rem;
    margin: 16px auto 0 auto;
    padding-bottom: 8px;
  }

  .slide-card-with-image {
    padding: 16px 10px;
    gap: 12px;
    margin: 0;
  }

  .slide-card-with-image.grid {
    flex-direction: column !important;
    align-items: center !important;
    justify-content: flex-start !important;
  }

  .slide-card {
    font-size: 1rem;
    align-items: center;
  }

  .slide-image img {
    width: 120px;
    height: 120px;
    border-radius: 10px;
  }
}

@media (max-width: 600px) {
  .slider-content {
    font-size: 0.95rem;
  }

  .slide-card {
    padding: 8px 4px;
    font-size: 0.9rem;
  }

  .slide-title {
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .slide-desc {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .slide-image img {
    width: 80px;
    height: 80px;
    border-radius: 7px;
  }
}
</style>
