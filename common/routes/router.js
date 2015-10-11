/**
 * Configurations
 */
Router.configure({
  layoutTemplate: 'applicationLayout'
});

/**
 * Routes
 */
Router.route('/', {
  name: 'homepage'
});

Router.route('/answers', {
  name: 'answers'
});
