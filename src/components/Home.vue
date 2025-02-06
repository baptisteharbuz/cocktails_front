<template>
    <div class="home-container">
        <h1 class="title">Cocktails</h1>
        <!-- Carte d'ajout -->
        <div class="add-cocktail-card" @click="openCreateModal">
            <h2>Ajouter un nouveau cocktail ➕</h2>
        </div>
        <!-- Liste des cocktails -->
        <div class="cocktail-list">
            <div v-for="cocktail in cocktails" :key="cocktail.id" class="cocktail-card"
    :style="cocktail.image ? { 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${cocktail.image}')`
    } : {}">
                <!-- <img :src="cocktail.image" alt="Cocktail" style="width: 100px; height: 100px;"> -->
                <RouterLink :to="`/cocktail/${cocktail.id}`" class="card-link">
                    <h2>{{ cocktail.nom }}</h2>
                    <p>{{ cocktail.description }}</p>
                    <p class="verre">Servi dans : {{ cocktail.verre }}</p>
                    <p class="garniture">Garniture : {{ cocktail.garniture }}</p>
                    <span class="details-link">Voir les détails</span>
                </RouterLink>
            </div>
        </div>
        <!-- Modal de création -->
        <cocktail-create v-if="createMode" @close="closeCreateModal" @created="onCocktailCreated" />
    </div>
</template>

<script>
import axios from 'axios';
import CocktailCreate from './CocktailCreate.vue';

export default {
    components: { CocktailCreate },
    data() {
        return {
            cocktails: [],
            errorMessage: '',
            createMode: false,
        };
    },
    mounted() {
        this.fetchCocktails();
    },

    methods: {
        async fetchCocktails() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/cocktail/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.cocktails = response.data;

            } catch (error) {
                console.error("Erreur lors de la récupération des cocktails :", error);
                this.errorMessage = "Impossible de charger les cocktails.";
            }
        },
        openCreateModal() {
            this.createMode = true;
        },
        closeCreateModal() {
            this.createMode = false;
        },
        onCocktailCreated() {
            this.closeCreateModal();
            this.fetchCocktails();
        },
    }
};
</script>

<style scoped>
.home-container {
    text-align: center;
    padding: 20px;
    color: white;
}

.title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 20px;
}

.add-cocktail-card {
    width: 580px;
    padding: 20px;
    margin: 0 auto 20px auto;
    border-radius: 10px;
    background: #00000094;
    color: white;
    font-weight: 900;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    cursor: pointer;
    border: 1px solid #000000;
    transition: transform 0.3s;
}

.add-cocktail-card:hover {
    transform: scale(1.05);
}

.cocktail-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.cocktail-card {
    width: 280px;
    height: 300px;
    padding: 20px;
    border-radius: 10px;
    background: #00000094;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
    border: 1px solid #000000;
    display: flex;
    align-content: space-around;
    justify-content: center;
}

.cocktail-card:hover {
    transform: scale(1.05);
}

.card-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
}

.cocktail-card h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
    color: #ff5506;
    font-weight: 700;
}

.cocktail-card p {
    font-size: 1rem;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 5px;
}

.details-link {
    font-weight: bold;
    color: #ff5506;
    cursor: pointer;
    text-decoration: none;
    display: block;
    margin-top: 10px;
}

.details-link:hover {
    text-decoration: underline;
}
</style>