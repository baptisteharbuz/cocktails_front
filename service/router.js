import { createRouter, createWebHistory } from "vue-router";
import usersList from "../src/components/userList.vue";
import home from "../src/components/Home.vue";
import Register from "../src/components/Register.vue";
import Login from "../src/components/Login.vue";
import CocktailDetails from "../src/components/CocktailDetails.vue";
import CocktailForm from "../src/components/CocktailForm.vue";

const routes = [
    { path: "/user", component: usersList, meta: { requiresAuth: true } },
    { path: "/cocktails", component: home, meta: { requiresAuth: true } },
    { path: "/register", component: Register },
    { path: "/login", component: Login },
    { path: "/", component: Login },
    { path: "/cocktail/:id", component: CocktailDetails, meta: { requiresAuth: true } },
    { path: "/cocktail/add", component: CocktailForm, meta: { requiresAuth: true } },
    { path: "/cocktail/edit/:id", component: CocktailForm, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login");
    } else {
        next();
    }
});

export default router;