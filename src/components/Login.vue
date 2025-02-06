<template>
    <div class="auth-container">
        <div class="auth-card">
            <h2>Se connecter</h2>
            <form @submit.prevent="loginUser">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="email" required>

                <label for="password">Mot de passe</label>
                <input type="password" id="password" v-model="password" required>

                <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

                <button type="submit">Connexion</button>
            </form>

            <p>Pas encore de compte ? <RouterLink to="/register">S'inscrire</RouterLink>
            </p>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: ''
        };
    },
    methods: {
        async loginUser() {
            try {
                const response = await axios.post('http://localhost:3000/user/login', {
                    email: this.email,
                    mot_de_passe: this.password
                });

                const token = response.data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    this.$router.push('/home');
                } else {
                    this.errorMessage = "Échec de la connexion.";
                }
            } catch (error) {
                this.errorMessage = "Email ou mot de passe incorrect.";
            }
        }
    }
};
</script>

<style scoped>
/* Réutilisation du même style que Register.vue */
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.auth-card {
    background: rgb(0, 0, 0);
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 350px;
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
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

button {
    margin-top: 15px;
    padding: 10px;
    border: none;
    background: #007BFF;
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