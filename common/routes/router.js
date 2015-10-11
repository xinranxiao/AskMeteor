/**
 * Configurations
 */
Router.configure({
  layoutTemplate: 'applicationLayout'
});

Router.onBeforeAction(function () {
  var router = this;

  if (!Meteor.user()) {
    Meteor.loginAsGuest(function (err) {
      if (err) {
        alert(err);
      } else {
        router.next();
      }
    });
  } else {
    router.next();
  }
});

/**
 * Routes
 */
Router.route('/', {
  name: 'homepage',
});

Router.route('/answers', {
  name: 'answers'
});
