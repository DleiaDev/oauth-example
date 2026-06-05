const routes = [
  // --------------------------
  // Authentication
  // --------------------------
  {
    path: "/auth/login/github",
    protected: false,
  },
  {
    path: "/auth/login/google",
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
