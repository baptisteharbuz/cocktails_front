<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Créer un compte</h2>
            <form @submit.prevent="registerUser">
                <label for="nom">Nom</label>
                <input type="text" id="nom" v-model="nom" required>

                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required>

                <label for="password">Mot de passe</label>
                <input type="password" id="password" v-model="password" required>

                <label for="confirmPassword">Confirmer le mot de passe</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" required>

                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

                <button type="submit">S'inscrire</button>
            </form>

            <p>Déjà un compte ? <RouterLink to="/login">Se connecter</RouterLink>
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            nom: '',
            email: '',
            password: '',
            confirmPassword: '',
            errorMessage: ''
        };
    },
    methods: {
        async registerUser() {
            if (this.password !== this.confirmPassword) {
                this.errorMessage = "Les mots de passe ne correspondent pas.";
                return;
            }

            try {
                const response = await axios.post('http://localhost:3000/user/register', {
                    nom: this.nom,
                    email: this.email,
                    mot_de_passe: this.password
                });

                this.$router.push('/login');
            } catch (error) {
                this.errorMessage = "Erreur lors de l'inscription. Vérifiez vos informations.";
                console.error(error);
            }
        }
    }
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
}

.auth-card {
    background: rgba(0, 0, 0, 0.363);
    border-radius: 16px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10.9px);
    -webkit-backdrop-filter: blur(10.9px);
    border: 1px solid rgba(0, 0, 0, 0.06);
    padding: 20px;
    text-align: center;
    width: 30vw;
    min-width: 400px;
    height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    color: white;
}

h2 {
    margin-bottom: 15px;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    margin-top: 10px;
    font-weight: bold;
}

input {
    padding: 8px;
    margin-bottom: 30px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    margin-top: 15px;
    margin-bottom: 25px;
    padding: 10px;
    border: none;
    background: #ff5e00;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
}

button:hover {
    background: #0056b3;
}

.error {
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
}
</style>