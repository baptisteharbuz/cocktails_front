<template>
    <div class="cocktail-detail-container">
        <div class="image-container" :style="{ backgroundImage: 'url(' + cocktail.image + ')' }"></div>
        <div class="details-container">
            <h1>{{ cocktail.nom }}</h1>
            <p>{{ cocktail.description }}</p>
            <p><strong>Verre :</strong> {{ cocktail.verre }}</p>
            <p><strong>Garniture :</strong> {{ cocktail.garniture }}</p>
            <p><strong>Alcoolisé :</strong> {{ cocktail.alcoolise ? 'Oui' : 'Non' }}</p>
            <div class="section" v-if="cocktail.ingredients && cocktail.ingredients.length">
                <h2>Ingrédients</h2>
                <ul>
                    <li v-for="ingredient in cocktail.ingredients" :key="ingredient.id">
                        {{ ingredient.nom }} - {{ ingredient.quantite }}
                    </li>
                </ul>
            </div>
            <div class="section" v-if="cocktail.categories && cocktail.categories.length">
                <h2>Catégories</h2>
                <ul>
                    <li v-for="categorie in cocktail.categories" :key="categorie.id">
                        {{ categorie.nom }}
                    </li>
                </ul>
            </div>
            <div class="section" v-if="cocktail.etapes && cocktail.etapes.length">
                <h2>Étapes de préparation</h2>
                <ol>
                    <li v-for="etape in cocktail.etapes" :key="etape.id">
                        {{ etape.etape }}
                    </li>
                </ol>
            </div>
            <button @click="editMode = true" class="edit-btn">Modifier le cocktail</button>
            <cocktail-edit v-if="editMode" :cocktailId="cocktail.id" @close="editMode = false"
                @updated="fetchCocktailDetails" />
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import CocktailEdit from './CocktailEdit.vue';

export default {
    components: { CocktailEdit },
    data() {
        return {
            cocktail: {},
            editMode: false,
        };
    },
    mounted() {
        this.fetchCocktailDetails();
    },
    methods: {
        async fetchCocktailDetails() {
            const id = this.$route.params.id;
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:3000/cocktail/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                this.cocktail = response.data;
            } catch (error) {
                console.error('Erreur lors de la récupération du cocktail :', error);
            }
        },
    },
};
</script>

<style scoped>
.cocktail-detail-container {
    display: flex;
    /* background-color: #218838; */
    width: 100vw;
    min-height: 100vh;
    padding-top: 70px;
}

.image-container {
    width: 50%;
    background-size: cover;
    background-position: center;
}

.details-container {
    margin-bottom: 70px;
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    overflow-y: auto;
    color: rgb(255, 255, 255);
}

.details-container h1 {
    font-size: 2rem;
    margin-bottom: 10px;
}

.details-container p {
    font-size: 1rem;
    margin: 5px 0;
}

.section {
    margin-top: 20px;
}

.section h2 {
    font-size: 1.5rem;
    margin-bottom: 10px;
}

ul,
ol {
    margin-left: 20px;
    text-align: left;
}

.edit-btn {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1rem;
    background: #ff6607;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 700;
    transition: transform 0.3s;
}

.edit-btn:hover {
    transform: scale(1.05);
}
</style>