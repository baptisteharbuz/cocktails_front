<template>
    <div>
        <h1>{{ isEdit ? 'Modifier' : 'Ajouter' }} un Cocktail</h1>
        <form @submit.prevent="submitForm">
            <input v-model="cocktail.nom" placeholder="Nom" required />
            <textarea v-model="cocktail.description" placeholder="Description" required></textarea>
            <input v-model="cocktail.ingredients" placeholder="Ingrédients (séparés par des virgules)" required />
            <button type="submit">{{ isEdit ? 'Modifier' : 'Ajouter' }}</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cocktail: {
                nom: '',
                description: '',
                ingredients: []
            },
            isEdit: false
        };
    },
    mounted() {
        const cocktailId = this.$route.params.id;
        if (cocktailId) {
            this.isEdit = true;
            this.fetchCocktail(cocktailId);
        }
    },
    methods: {
        async fetchCocktail(id) {
            try {
                const response = await axios.get(`http://localhost:3000/cocktail/${id}`);
                this.cocktail = response.data;
            } catch (error) {
                console.error(error);
            }
        },
        async submitForm() {
            try {
                if (this.isEdit) {
                    await axios.put(`http://localhost:3000/cocktail/${this.cocktail.id}`, this.cocktail);
                } else {
                    await axios.post('http://localhost:3000/cocktail', this.cocktail);
                }
                this.$router.push('/home');
            } catch (error) {
                console.error(error);
            }
        }
    }
};
</script>