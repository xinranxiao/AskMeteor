if (Meteor.isServer) {
  Accounts.removeOldGuests = function (before) {
    return Meteor.users.remove({ 'status.lastLogin.date': {$lte: before}, 'profile.guest': true});
  };

  Meteor.methods({
    createGuest: function () {
      var guestName = "guest-#" + Random.id();
      while (Meteor.users.find({ username: guestName }).count() > 0) {
        guestName = "guest-#" + Random.id();
      }
      var email = guestName + "@example.com";

      var guestParams = {
        username: guestName,
        email: email,
        profile: { guest: true },
        password: Meteor.uuid()
      };
      var guestId = Accounts.createUser(guestParams);

      // Do any extra things with guest user.

      return guestParams;
    }
  });
}
