import useAuthStore from "../stores/auth";

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  authStore.checkAuth();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.user) {
      next({ name: "log-in" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
