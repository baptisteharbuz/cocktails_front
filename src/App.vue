<template>
  <div class="app-container">
    <nav class="navbar">
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
    </nav>
    <div class="content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-container {
    display: flex;
    align-items: center;
    /* justify-content: center; */
    height: 100vw;
    width: 100vw;
}

.navbar {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 15px;
    background: rgba(0, 0, 0, 0.318);
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

.content {
    /* margin-top: 70px; */
    width: 90%;
    max-width: 1200px;
    text-align: center;
}
</style>