Meteor.startup(function() {
  Bidder.start();

  // Clean up guest accounts.
  SyncedCron.add({
    name: 'clean up guest accounts',
    schedule: function(parser) {
      return parser.text('every 12 hours');
    },
    job: function() {
      // Delete guest accounts more than two days old.
      var before = new Date();
      before.setDate(before.getDate() - 2);
      Accounts.removeOldGuests(before);
    }
  });

  SyncedCron.start();
});