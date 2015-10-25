Auctions = new Mongo.Collection('auctions');

var AuctionsSchema = new SimpleSchema({
  // Question this auction belongs to.
  questionId: { type: Meteor.ObjectID },

  // Bids should be a hash stored as a string: { 'pony':5, 'yolo': 10, '.': 20 }
  // It's stored as a string to get around mongodb forbidding `.` and `$` as keys
  bids: { type: String, defaultValue: "" },

  participants: { type: [ Meteor.ObjectID ], defaultValue: [] },

  createdAt: { type: Date }
});

Auctions.attachSchema(AuctionsSchema);