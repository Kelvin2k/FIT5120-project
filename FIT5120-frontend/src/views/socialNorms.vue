<template>
  <div class="social-norms-container">
    <header class="header">
      <div class="logo">Ankang Life</div>
      <nav class="nav">
        <router-link to="/facilities">Find Facility / Event</router-link>
        <router-link to="/learnenglish">Learn English</router-link>
        <router-link to="/socialnorms">Social Norms</router-link>
        <router-link to="/navigatelife">Navigate your Life</router-link>
      </nav>
    </header>
    <main>
      <h1 class="title">Understanding Social Norms in Melbourne</h1>
      <div class="content-row">
        <router-link class="card card-link" :to="'/socialnorms/meetingpeople'">
          <div class="card-image">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
              alt="Meeting New People" />
          </div>
          <div class="card-title">Meeting New People</div>
          <div class="card-desc">
            <b>G'day!</b> Discover how to meet new people in Australia with a smile, a handshake, and a friendly
            greeting.
          </div>
        </router-link>
        <router-link class="card card-link" :to="'/socialnorms/eatingout'">
          <div class="card-image">
            <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80"
              alt="Eating Out" />
          </div>
          <div class="card-title">Eating Out</div>
          <div class="card-desc">
            From menu to manners -- Learn what to expect when eating out in Australia.
          </div>
        </router-link>
      </div>
      <div class="lang-switcher">
        <div class="lang-btn active">EN</div>
        <div class="lang-btn">CN</div>
        <div class="lang-btn">VN</div>
        <div class="lang-btn">ID</div>
      </div>
    </main>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'SocialNorms',
};
</script>

<style scoped>
.social-norms-container {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #222;
  padding: 24px 0 8px 0;
  margin-bottom: 32px;
}

.logo {
  font-family: 'Brush Script MT', cursive;
  font-size: 2.5rem;
  margin-left: 48px;
  font-weight: bold;
}

.nav {
  display: flex;
  gap: 32px;
  margin-right: 48px;
}

.nav a {
  color: #222;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.2s;
}

.nav a.router-link-exact-active {
  color: #a259e6;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 48px;
  font-weight: 500;
}

.content-row {
  display: flex;
  justify-content: center;
  gap: 64px;
  margin-bottom: 48px;
}

.card,
.card-link {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 24px 24px 16px 24px;
  width: 340px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, box-shadow;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.card:hover {
  transform: translateY(-16px) scale(1.03);
  box-shadow: 0 12px 32px rgba(162, 89, 230, 0.18), 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 2;
}

.card-image {
  border: 10px solid #a259e6;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  width: 280px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.card-desc {
  font-size: 1rem;
  text-align: center;
}

.lang-switcher {
  position: absolute;
  right: 48px;
  top: 220px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lang-btn {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #a259e6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
}

.lang-btn.active {
  background: #d1aaff;
  color: #222;
  opacity: 1;
}

@media (max-width: 900px) {
  .content-row {
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .lang-switcher {
    position: static;
    flex-direction: row;
    justify-content: center;
    margin-top: 32px;
  }
}
</style>
