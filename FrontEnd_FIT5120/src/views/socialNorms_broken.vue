<template>
  <div>
    <!-- Banner -->
    <div class="banner-wrapper">
      <SocialNormsBanner />
    </div>

    <!-- Cards Section -->
    <div class="cards-wrapper">
      <h1 class="cards-title">Social Norms & Etiquette</h1>

      <div class="row w-100 m-0">
        <!-- Meeting People Card -->
        <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4">
          <div class="slide-card-with-image w-100" data-aos="fade-up" data-aos-delay="0">
            <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
              <div class="img-hover-wrapper">
                <img
                  src="https://australianautismalliance.org.au/wp-content/uploads/2025/07/hero-_0000_AdobeStock_429987593.jpg"
                  alt="Meeting People" class="slide-img-top w-100 h-100" />
              </div>
            </div>
            <div class="slide-card text-center">
              <h2 class="slide-title">Meeting People</h2>
              <p class="slide-desc">Learn proper etiquette for meeting new people in Australia, including greetings,
                introductions, and social customs.</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/MeetingPeople" class="learn-more-btn">Learn More</router-link>
            </div>
          </div>
        </div>

        <!-- Eating Out Card -->
        <div class="col-lg-4 col-md-6 col-12 d-flex justify-content-center mb-4">
          <div class="slide-card-with-image w-100" data-aos="fade-up" data-aos-delay="50">
            <div class="slide-image w-100 mb-3" style="max-height: 250px; height: 200px; min-height: 200px">
              <div class="img-hover-wrapper">
                <img src="https://sydneyweekender.com.au/wp-content/uploads/2025/01/TASTING-AUSTRALIA-WEBSITE-IMAGE.jpg"
                  alt="Eating Out" class="slide-img-top w-100 h-100" />
              </div>
            </div>
            <div class="slide-card text-center">
              <h2 class="slide-title">Eating Out</h2>
              <p class="slide-desc">Discover dining etiquette, restaurant customs, tipping culture, and proper table
                manners in Australian dining settings.</p>
            </div>
            <div class="d-flex justify-content-center mt-3">
              <router-link to="/EatingOut" class="learn-more-btn">Learn More</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocialNormsBanner from '../components/SocialNormsBanner.vue';

export default {
  components: {
    SocialNormsBanner
  }
}
</script>

<style scoped>
.banner-wrapper {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #6b46c1 0%, #8b5cf6 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
}

.cards-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  background: #ffffff;
  font-family: 'Roboto', 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cards-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #6b46c1;
  margin-bottom: 60px;
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

.portfolio {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(107, 70, 193, 0.9), rgba(139, 92, 246, 0.9));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 8px;
}

.slide-card-with-image:hover .portfolio {
  opacity: 1;
}

@media (max-width: 900px) {
  .cards-wrapper {
    padding: 40px 20px;
  }

  .cards-title {
    font-size: 2rem;
    margin-bottom: 40px;
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
}
</style>
    font-size: 1.1rem;
    margin-bottom: 8px;
  }

  .slide-desc {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

    }
}
</style>
