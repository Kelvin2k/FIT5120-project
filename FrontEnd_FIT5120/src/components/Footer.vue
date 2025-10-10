<template>
  <footer class="footer">
    <div class="container">
      <!-- Main Footer Content -->
      <div class="row gy-4">
        <!-- About Section -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-section">
            <div class="footer-logo">
              <h4 class="footer-title">Ankang Life</h4>
              <p class="footer-subtitle">Supporting Older Adults in Australia</p>
            </div>
            <p class="footer-desc">
              Empowering older adults with essential knowledge and skills for a confident, independent life in
              Australia.
            </p>
          </div>
        </div>

        <!-- Learning Features -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-section">
            <h5 class="section-title">Learning Features</h5>
            <ul class="footer-links">
              <li><router-link to="/LearnEnglish">English Learning</router-link></li>
              <li><router-link to="/flashcards">Interactive Flashcards</router-link></li>
              <li><router-link to="/socialNorms">Social Etiquette</router-link></li>
              <li><router-link to="/quiztaking">Knowledge Quizzes</router-link></li>
            </ul>
          </div>
        </div>

        <!-- Life Navigation -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-section">
            <h5 class="section-title">Life Navigation</h5>
            <ul class="footer-links">
              <li><router-link to="/NavigateYourLife">Daily Life Guide</router-link></li>
              <li><router-link to="/PublicTransportation">Transport Guide</router-link></li>
              <li><router-link to="/FacilityEvent">Local Facilities</router-link></li>
              <li><router-link to="/chatbot">AI Assistant</router-link></li>
            </ul>
          </div>
        </div>

        <!-- Safety & Support -->
        <div class="col-lg-3 col-md-6">
          <div class="footer-section">
            <h5 class="section-title">Safety & Support</h5>
            <ul class="footer-links">
              <li><router-link to="/safety">Safety Information</router-link></li>
              <li><router-link to="/emergency">Emergency Resources</router-link></li>
              <li><router-link to="/health">Health Services</router-link></li>
              <li><router-link to="/about">About Our Mission</router-link></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="copyright-text mb-0">
              &copy; 2025 Ankang Life. All rights reserved.
            </p>
          </div>
          <div class="col-md-6">
            <div class="footer-features">
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
                <span>24/7 Available</span>
              </div>
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span>Free Resources</span>
              </div>
              <div class="feature-item">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 6L12 10.5 6.5 8 12 5.5 17.5 8zM12 19c-3.31 0-6-2.69-6-6v-2.5l6 2.5 6-2.5V13c0 3.31-2.69 6-6 6z" />
                </svg>
                <span>Safe & Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #6B46C1 0%, #8B5CF6 50%, #A78BFA 100%);
  margin-top: auto;
  padding: 3rem 0 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-section {
  height: 100%;
}

.footer-logo {
  margin-bottom: 1rem;
}

.footer-title {
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0;
}

.footer-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 0;
}

.section-title {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #fbbf24;
  display: inline-block;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: inline-block;
  position: relative;
}

.footer-links a:hover {
  color: #fbbf24;
  transform: translateX(5px);
}

.footer-links a::before {
  content: '>';
  position: absolute;
  left: -15px;
  opacity: 0;
  transition: opacity 0.3s ease;
  font-weight: bold;
}

.footer-links a:hover::before {
  opacity: 1;
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  font-weight: 400;
}

.footer-features {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  font-weight: 500;
}

.feature-item svg {
  width: 16px;
  height: 16px;
  color: #fbbf24;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1rem 0;
  }

  .footer-features {
    justify-content: center;
    margin-top: 1rem;
    gap: 1rem;
  }

  .footer-bottom {
    text-align: center;
  }

  .section-title {
    font-size: 1rem;
  }

  .footer-links a {
    font-size: 0.85rem;
  }

  .feature-item {
    font-size: 0.8rem;
  }

  .feature-item svg {
    width: 14px;
    height: 14px;
  }

  .footer .row {
    justify-content: center !important;
    text-align: center;
  }

  .footer-section {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

/* Tablet Responsive */
@media (min-width: 769px) and (max-width: 991px) {
  .footer-features {
    justify-content: center;
    margin-top: 1rem;
  }

  .footer .row {
    justify-content: center !important;
    text-align: center;
  }

  .footer-section {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

/* Large screen adjustments */
@media (min-width: 1200px) {
  .footer {
    padding: 4rem 0 1.5rem 0;
  }

  .footer-title {
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .footer-links a {
    font-size: 1rem;
  }
}

/* Hover animations for sections */
.footer-section:hover .section-title {
  color: #fbbf24;
  transition: color 0.3s ease;
}

/* Smooth scroll behavior for router links */
.footer-links a {
  scroll-behavior: smooth;
}
</style>
