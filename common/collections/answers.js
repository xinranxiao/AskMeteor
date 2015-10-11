Answers = new Mongo.Collection('answers');

var AnswersSchema = new SimpleSchema({
  questionId: { type: Meteor.ObjectID },
  text: { type: [String] },
  collaborators: { type: [Meteor.ObjectID] }
});

Answers.attachSchema(AnswersSchema);