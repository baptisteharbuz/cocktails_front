<template>
    <div class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
            <h2>Modifier le cocktail</h2>
            <form @submit.prevent="submitForm">
                <!-- Champs principaux -->
                <label for="nom">Nom</label>
                <input type="text" id="nom" v-model="cocktail.nom" required />

                <label for="description">Description</label>
                <textarea id="description" v-model="cocktail.description" required></textarea>

                <label for="verre">Verre</label>
                <input type="text" id="verre" v-model="cocktail.verre" />

                <label for="garniture">Garniture</label>
                <input type="text" id="garniture" v-model="cocktail.garniture" />

                <!-- Champ Alcoolisé -->
                <label for="alcoolise">Alcoolisé</label>
                <select id="alcoolise" v-model="cocktail.alcoolise">
                    <option :value="true">Oui</option>
                    <option :value="false">Non</option>
                </select>

                <!-- Champ Image -->
                <label for="image">URL de l'image</label>
                <input type="text" id="image" v-model="cocktail.image" placeholder="Lien de l'image" />
                <div class="image-preview" v-if="cocktail.image">
                    <img :src="cocktail.image" alt="Aperçu de l'image" />
                </div>

                <!-- Section Ingrédients -->
                <div class="ingredients-section">
                    <h3>Ingrédients</h3>
                    <div v-for="(ing, index) in cocktail.ingredients" :key="index" class="ingredient-row">
                        <select v-model="ing.ingredient_id">
                            <option v-for="option in availableIngredients" :key="option.id" :value="option.id">
                                {{ option.nom }}
                            </option>
                            <option value="new">Nouveau</option>
                        </select>
                        <input v-if="ing.ingredient_id === 'new'" type="text" v-model="ing.newIngredientName"
                            placeholder="Nom du nouvel ingrédient" />
                        <input type="text" v-model="ing.quantite" placeholder="Quantité" />
                        <button type="button" @click="removeIngredient(index)">Supprimer</button>
                    </div>
                    <button type="button" @click="addIngredient">Ajouter un ingrédient</button>
                </div>

                <!-- Section Catégories -->
                <div class="categories-section">
                    <h3>Catégories</h3>
                    <div v-for="(cat, index) in cocktail.categories" :key="index" class="category-row">
                        <select v-model="cocktail.categories[index]">
                            <option v-for="option in availableCategories" :key="option.id" :value="option.id">
                                {{ option.nom }}
                            </option>
                            <option value="new">Nouveau</option>
                        </select>
                        <input v-if="cocktail.categories[index] === 'new'" type="text" v-model="newCategories[index]"
                            placeholder="Nom de la nouvelle catégorie" />
                        <button type="button" @click="removeCategory(index)">Supprimer</button>
                    </div>
                    <button type="button" @click="addCategory">Ajouter une catégorie</button>
                </div>

                <div class="btn-group">
                    <button type="submit">Enregistrer</button>
                    <button type="button" @click="closeModal">Annuler</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: {
        cocktailId: {
            type: [String, Number],
            required: true,
        },
    },
    data() {
        return {
            cocktail: {
                nom: '',
                description: '',
                verre: '',
                garniture: '',
                alcoolise: false,
                image: '',
                ingredients: [],
                categories: [],
            },
            availableIngredients: [],
            availableCategories: [],
            newCategories: [],
        };
    },
    mounted() {
        this.fetchCocktail();
        this.fetchAvailableIngredients();
        this.fetchAvailableCategories();
    },
    methods: {
        fetchCocktail() {
            const token = localStorage.getItem('token');
            axios
                .get(`http://localhost:3000/cocktail/${this.cocktailId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    const data = response.data;
                    data.categories = data.categories.map((cat) => cat.id);
                    data.ingredients = data.ingredients.map((ing) => ({
                        ...ing,
                        ingredient_id: ing.id,
                    }));
                    data.alcoolise = data.alcoolise == 1 || data.alcoolise === true;
                    this.cocktail = data;
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération du cocktail:", error);
                });
        },
        fetchAvailableIngredients() {
            const token = localStorage.getItem('token');
            axios
                .get(`http://localhost:3000/ingredients`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    this.availableIngredients = response.data;
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des ingrédients:", error);
                    this.availableIngredients = [];
                });
        },
        fetchAvailableCategories() {
            const token = localStorage.getItem('token');
            axios
                .get(`http://localhost:3000/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    this.availableCategories = response.data;
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des catégories:", error);
                    this.availableCategories = [];
                });
        },
        addIngredient() {
            const defaultIngredient =
                this.availableIngredients.length > 0
                    ? this.availableIngredients[0].id
                    : "";
            this.cocktail.ingredients.push({
                ingredient_id: defaultIngredient,
                quantite: "",
                newIngredientName: "",
            });
        },
        removeIngredient(index) {
            this.cocktail.ingredients.splice(index, 1);
        },
        addCategory() {
            const defaultCategory =
                this.availableCategories.length > 0
                    ? this.availableCategories[0].id
                    : "";
            this.cocktail.categories.push(defaultCategory);
            this.newCategories.push("");
        },
        removeCategory(index) {
            this.cocktail.categories.splice(index, 1);
            this.newCategories.splice(index, 1);
        },
        async submitForm() {
            const token = localStorage.getItem("token");
            try {
                const ingredientPromises = this.cocktail.ingredients.map((ing) => {
                    if (ing.ingredient_id === "new") {
                        return axios
                            .post(
                                `http://localhost:3000/ingredients`,
                                { nom: ing.newIngredientName },
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            .then((response) => {
                                ing.ingredient_id = response.data.id;
                            });
                    } else {
                        return Promise.resolve();
                    }
                });
                const categoryPromises = this.cocktail.categories.map((cat, index) => {
                    if (cat === "new") {
                        return axios
                            .post(
                                `http://localhost:3000/categories`,
                                { nom: this.newCategories[index] },
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            .then((response) => {
                                this.cocktail.categories[index] = response.data.id;
                            });
                    } else {
                        return Promise.resolve();
                    }
                });
                await Promise.all([...ingredientPromises, ...categoryPromises]);
                await axios.put(
                    `http://localhost:3000/cocktail/${this.cocktailId}`,
                    this.cocktail,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Cocktail mis à jour avec succès !");
                this.$emit("updated");
                this.closeModal();
            } catch (error) {
                console.error("Erreur lors de la mise à jour du cocktail:", error);
                alert("Erreur lors de la mise à jour du cocktail.");
            }
        },
        closeModal() {
            this.$emit("close");
        },
    },
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h2 {
    margin-bottom: 15px;
}

.modal-content form {
    display: flex;
    flex-direction: column;
}

.modal-content label {
    margin-top: 10px;
    font-weight: bold;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.image-preview {
    margin-top: 10px;
    text-align: center;
}

.image-preview img {
    max-width: 100%;
    max-height: 200px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.ingredients-section,
.categories-section {
    margin-top: 20px;
}

.ingredient-row,
.category-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.ingredient-row select,
.category-row select {
    flex: 1;
}

.ingredient-row input {
    flex: 1;
    margin-left: 10px;
}

.ingredient-row button,
.category-row button {
    margin-left: 10px;
}

.btn-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 15px;
}

.modal-content button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.modal-content button[type="submit"] {
    background: #007BFF;
    color: white;
}

.modal-content button[type="button"] {
    background: #ccc;
    color: #333;
}
</style>