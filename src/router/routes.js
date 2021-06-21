
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/MainPage.vue') }
    ]
  },

  // {
  //   path: '/',
  //   component: () => import('src/layouts/MainLayout.vue'),
  //   children: [
  //     { path: 'popup', component: () => import('src/pages/MainPage.vue') }
  //   ]
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
