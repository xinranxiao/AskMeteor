/**
 * Created by caleban on 10/11/15.
 */

Template.answers.helpers({
  answersList: function() {
    var answers = Answers.find().fetch();
    var currentState = ServerState.findOne({});

    var list = [];
    for(var j = 0; j < answers.length; j++) {

      // skip current question
      if (answers[j].questionId === currentState.currentQuestionId) {
        continue;
      }

      var textArray = answers[j].text || [];
      var question = Questions.findOne({_id: answers[j].questionId});

      if (question.text === "Vote for a new question.") {
        continue;
      }

      var sum = "";
      for(var i = 0; i < textArray.length; i++) {
          if (textArray[i].match(/^[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
            sum = sum + textArray[i];
          } else {
            sum = sum + " " + textArray[i];
          }
      }
      list.push({
        answerText: sum,
        questionText: question.text
      });
    }
      return list;
  }
});

Template.answers.onRendered( function() {
  this.autorun(function() {
    Meteor.subscribe('answers');
    Meteor.subscribe('questions');
    Meteor.subscribe('serverState');
  });
});
