Answers = new Mongo.Collection('answers');

var AnswersSchema = new SimpleSchema({
  questionId: { type: Meteor.ObjectID },
  text: { type: [String], defaultValue: [] },
  collaborators: { type: [Meteor.ObjectID], defaultValue: [] }
});

Answers.attachSchema(AnswersSchema);