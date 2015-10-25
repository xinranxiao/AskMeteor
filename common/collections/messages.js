Messages = new Mongo.Collection('messages');

var MessagesSchema = new SimpleSchema({
  text: { type: String },
  author: { type: Meteor.ObjectID },
  createdAt: { type: Date }
});

Messages.attachSchema(MessagesSchema);