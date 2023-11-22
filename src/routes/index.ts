import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../pages/Home.vue"
import For from "../pages/For.vue"

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/for',
            component: For
        }
    ]
})

export {
    router
}