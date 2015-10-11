Auctions = new Mongo.Collection('auctions');

var AuctionsSchema = new SimpleSchema({
  // Question this auction belongs to.
  questionId: { type: Meteor.ObjectID },

  // Bids should be a hash: { 'pony':5, 'yolo': 10, '.': 20 }
  bids: { type: Object, blackbox: true },

  participants: { type: [ Meteor.ObjectID ]},

  createdAt: { type: Date }
});

Auctions.attachSchema(AuctionsSchema);