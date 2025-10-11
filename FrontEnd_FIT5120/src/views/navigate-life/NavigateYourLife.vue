<template>
  <div class="modern-sections">
    <BannerMeteor :title="$t('navigate_your_life.title')"
      :subtitle="$t('navigate_your_life.subtitle', 'Your comprehensive guide to daily life in Australia')"
      :badges="lifeBadges" :mainIcon="mainIcon" />

    <div class="cards-wrapper mt-5">
      <div class="row w-100 m-0">
        <div v-for="(card, idx) in cards" :key="card.key"
          class="col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4">
          <div class="slide-card-with-image w-100" :data-aos="idx % 2 === 0 ? 'fade-right' : 'fade-left'"
            :data-aos-delay="`${0 + idx * 100}`">
            <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
              <div class="img-hover-wrapper" @click="goTo(card.key)">
                <img :src="card.img" :alt="card.title" class="slide-img-top w-100 h-100" />
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
import { computed, onMounted, ref, h } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import BannerMeteor from '@/components/BannerMeteor.vue'

const router = useRouter();
const { t } = useI18n();

const mainIcon = () => h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 512 512',
  width: '48',
  height: '48',
}, [
  h('path', {
    fill: 'none',
    stroke: '#ffffff',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '32',
    d: 'M448 64L64 240.14h200a8 8 0 0 1 8 8V448Z'
  })
]);

// Life navigation badges
const lifeBadges = [
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' })
    ]),
    text: t('badges.transport')
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' })
    ]),
    text: t('badges.shopping_malls')
  },
  {
    icon: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', fill: 'currentColor' }, [
      h('path', { d: 'M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' })
    ]),
    text: t('badges.healthcare')
  }
]

const cardKeys = [
  'publictransportation',
  'grocceriesshopping',
  'medicalattention',
];

const cardImages = {
  publictransportation: 'https://zivazmanov.com/wp-content/uploads/2013/05/Four-Great-Reasons-to-Use-Public-Transportation.jpg',
  grocceriesshopping: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  medicalattention: 'https://www.jonesfirmohio.com/wp-content/uploads/2020/09/shutterstock_457866949-1.jpg',
};

const cards = computed(() =>
  cardKeys.map((key) => ({
    key,
    title: t(`navigate_your_life.cards.${key}.title`),
    text: t(`navigate_your_life.cards.${key}.subtitle`),
    img: cardImages[key],
  }))
);

function goTo(key) {
  if (key === 'publictransportation') {
    router.push('/publicTransportation');
  } else if (key === 'grocceriesshopping') {
    router.push('/grocceriesShopping');
  } else if (key === 'medicalattention') {
    router.push('/medicalAttention');
  }
}

const loaded = ref(false);
onMounted(() => {
  setTimeout(() => (loaded.value = true), 100);
});
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
}
</style>
