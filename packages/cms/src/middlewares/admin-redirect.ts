module.exports = (_config: Object, { strapi }) => {
  const redirects = ['/', '/index.html'].map((path) => ({
    method: 'GET',
    path,
    handler: (ctx: {redirect: Function}) => ctx.redirect('/admin'),
    config: { auth: false },
  }));

  strapi.server.routes(redirects);
};
