ServerState = new Mongo.Collection('serverstate');

var ServerStateSchema = new SimpleSchema({
  lookingForQuestion: { type: Boolean },
  currentQuestionId: { type: Meteor.ObjectID }
});

ServerState.attachSchema(ServerStateSchema);