<template>
    <div class="home-container">
        <h1 class="title">Cocktails</h1>

        <!-- Liste des cocktails défilable horizontalement -->
        <div class="cocktail-list" ref="cocktailList">
            <div v-for="cocktail in cocktails" :key="cocktail.id" class="cocktail-card"
                :style="cocktail.image ? { backgroundImage: `url('${cocktail.image}')` } : {}"
                @click="goToCocktail(cocktail.id)">
                <h2>{{ cocktail.nom }}</h2>
                <div class="card-detail">
                    <RouterLink :to="`/cocktail/${cocktail.id}`" class="card-link">
                        <p>{{ cocktail.description }}</p>
                        <p class="garniture">Composé de {{ cocktail.garniture }}</p>
                        <span class="details-link">Voir les détails</span>
                    </RouterLink>
                </div>
            </div>
        </div>

        <!-- Boutons de défilement -->
        <div class="scroll-buttons">
            <button @click="scrollLeft" class="scroll-button">◀</button>
            <button @click="scrollRight" class="scroll-button">▶</button>
        </div>

        <!-- Carte d'ajout -->
        <div class="container-add-cocktail-button">
            <button class="add-cocktail-button" @click="openCreateModal">
                Ajouter un nouveau cocktail +
            </button>
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
            autoScrollInterval: null,
        };
    },
    mounted() {
        this.fetchCocktails();

        this.$nextTick(() => {
            if (this.$refs.cocktailList) {
                this.autoScrollInterval = setInterval(() => {
                    this.scrollRight();
                }, 4000);
            }
        });
    },
    // Pour Vue 2 utilisez beforeDestroy, pour Vue 3 beforeUnmount
    // beforeDestroy() {
    //     if (this.autoScrollInterval) {
    //         clearInterval(this.autoScrollInterval);
    //     }
    // },
    beforeUnmount() {
        if (this.autoScrollInterval) {
            clearInterval(this.autoScrollInterval);
        }
    },
    methods: {
        async fetchCocktails() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/cocktail/all', {
                    headers: { Authorization: `Bearer ${token}` },
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
        goToCocktail(id) {
            this.$router.push(`/cocktail/${id}`);
        },
        onCocktailCreated() {
            this.closeCreateModal();
            this.fetchCocktails();
        },
        scrollLeft() {
            const container = this.$refs.cocktailList;
            if (!container) {
                console.warn("Le conteneur cocktailList est introuvable (scrollLeft)");
                return;
            }
            container.scrollBy({ left: -500, behavior: 'smooth' });
        },
        scrollRight() {
            const container = this.$refs.cocktailList;
            if (!container) {
                console.warn("Le conteneur cocktailList est introuvable (scrollRight)");
                return;
            }

            const currentScroll = container.scrollLeft ?? 0;
            const visibleWidth = container.clientWidth ?? 0;
            const totalWidth = container.scrollWidth ?? 0;
            if (currentScroll + visibleWidth >= totalWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: 500, behavior: 'smooth' });
            }
        },
    },
};
</script>

<style scoped>
.home-container {
    text-align: center;
    color: white;
    width: 100vw;
    min-height: 100vh;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}

.title {
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 20px;
}

.cocktail-list {
    display: flex;
    flex-wrap: nowrap;
    /* Force une seule ligne */
    overflow-x: auto;
    /* Défilement horizontal */
    scroll-behavior: smooth;
    width: 90%;
    padding-bottom: 10px;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.cocktail-list::-webkit-scrollbar {
    display: none;
}

.cocktail-card {
    flex: 0 0 calc(100% / 5);
    height: 700px;
    padding-top: 50px;
    background: #00000094;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s;
    border: 1px solid #000000;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 10px;
}

.cocktail-card:hover {
    transform: scale(1.02);
}

.card-link {
    text-decoration: none;
    color: inherit;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    width: 100%;
}

.card-detail {
    background-color: rgba(0, 0, 0, 0.659);
    display: flex;
    justify-content: center;
    padding: 10px;
    height: 25%;
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
    margin-top: 10px;
}

.details-link:hover {
    text-decoration: underline;
}

.scroll-buttons {
    margin-top: 20px;
    display: flex;
    gap: 20px;
}

.scroll-button {
    background-color: #ff5506;
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 1.2rem;
    border-radius: 5px;
    cursor: pointer;
    transition: transform 0.3s;
}

.scroll-button:hover {
    transform: scale(1.05);
}

.container-add-cocktail-button {
    width: 100vw;
    display: flex;
    justify-content: flex-end;
    padding-right: 5%;
    margin-top: 20px;
}

.add-cocktail-button {
    margin: 2rem;
    width: 280px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    border-radius: 10px;
    background: #ff5506;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border: 1px solid #000000;
    transition: transform 0.3s;
}

.add-cocktail-button:hover {
    transform: scale(1.05);
}
</style>