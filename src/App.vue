<template>
  <div class="app-container">
    <nav class="navbar">
      <RouterLink to="/cocktails">Cocktails</RouterLink>
      <RouterLink v-if="!isAuthenticated" to="/login">Se connecter</RouterLink>
      <RouterLink v-else to="/" @click.prevent="logout" class="logout-button">
        Se déconnecter
      </RouterLink>
    </nav>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const isAuthenticated = ref(!!localStorage.getItem("token"));

    // Redirection uniquement après la déconnexion
    const logout = () => {
      localStorage.removeItem("token");
      isAuthenticated.value = false;
      router.push("/login");
    };

    return { isAuthenticated, logout };
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.navbar {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 50px;
  padding: 15px;
  background: rgb(0, 0, 0);
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar a {
  color: rgb(255, 255, 255);
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 8px 12px;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>