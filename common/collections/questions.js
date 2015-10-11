Questions = new Mongo.Collection('questions');

var QuestionsSchema = new SimpleSchema({
  text: { type: String }
});

Questions.attachSchema(QuestionsSchema);