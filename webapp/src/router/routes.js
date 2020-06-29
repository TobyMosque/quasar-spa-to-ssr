
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/main/index.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'people', component: () => import('src/pages/people/index.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
