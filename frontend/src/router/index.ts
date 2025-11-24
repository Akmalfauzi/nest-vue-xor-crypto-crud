import { createRouter, createWebHistory } from 'vue-router';
import NotesPage from '@/pages/NotesPage.vue';

const routes = [
  {
    path: '/',
    name: 'notes',
    component: NotesPage,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
