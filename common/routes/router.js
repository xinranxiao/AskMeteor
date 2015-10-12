/**
 * Configurations
 */
Router.configure({
  layoutTemplate: 'applicationLayout'
});

Router.onBeforeAction(function () {
  if (!Meteor.user()) {
    Meteor.loginAsGuest(function (err) {
      if (err) {
        alert(err);
      }
    });
  }

  this.next();
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

Router.route('/answers/:questionId', {
  name: 'detailedAnswer',
  waitOn: function() {
    return Meteor.subscribe('questions');
  },
  data: function() {
    return {
      question: Questions.findOne({ _id: this.params.questionId })
    }
  }
});
