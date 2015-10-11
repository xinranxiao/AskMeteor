Messages = new Mongo.Collection('messages');

var MessagesSchema = new SimpleSchema({
  text: { type: String },
  author: { type: Meteor.ObjectID }
});

Messages.attachSchema(MessagesSchema);