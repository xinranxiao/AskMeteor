if (Meteor.isClient) {
  /**
   * Override the `currentUser` helper to ignore guest accounts. This way we still have the signIn buttons for the UI.
   */
  if (Package.blaze) {
    Package.blaze.Blaze.Template.registerHelper('currentUser', function () {
      var user = Meteor.user();
      if (user && typeof user.profile !== 'undefined' && typeof user.profile.guest !== 'undefined' && user.profile.guest) {
        return null;
      } else {
        return Meteor.user();
      }
    });
  }

  /**
   * Attaches loginGuest to Meteor. Use this to login a guest account.
   *
   * @param callback
   */
  Meteor.loginAsGuest = function (callback) {
    if (!Meteor.userId()) {
      Meteor.call('createGuest', {}, function (error, result) {
        if (error) {
          return callback && callback(error, null);
        }

        // Do a 'normal' login with the guest email/password.
        Meteor.loginWithPassword(result.email, result.password, function(error) {
          if(error) {
            callback && callback(error, null);
          } else {
            callback && callback(null, result.boardId);
          }
        });
      });
    }
  }
}
