const routes = [
  // --------------------------
  // Authentication
  // --------------------------
  {
    path: "/auth/login/code/github",
    protected: false,
  },
  {
    path: "/auth/login/oidc/google",
    protected: false,
  },
  {
    path: "/auth/callback/github",
    protected: false,
  },
  {
    path: "/auth/callback/google",
    protected: false,
  },

  // --------------------------
  // App
  // --------------------------
  {
    path: "/dashboard",
    protected: true,
  },
];

export default routes;
