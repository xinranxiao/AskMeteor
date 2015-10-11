/**
 * Created by caleban on 10/11/15.
 */

Template.answers.helpers({
  answersList: function() {
    var answers = Answers.find().fetch();
    console.log("wtf");
    //console.log(answers);
    var list = [];
    for(var j = 0; j < answers.length; j++){
      var textArray = answers[j].text || [];
      var question = Questions.findOne({_id: answers[j].questionId});
      var sum = "";
      for(var i = 0; i < textArray.length; i++) {
          if (textArray[i].match(/^[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
            sum = sum + textArray[i];
          } else {
            sum = sum + " " + textArray[i];
          }
      }
      if (question.text !== "Vote for a new question."){
        list.push({
          answerText: sum,
          questionText: question.text
        });
      }
    }
      return list;
  }
});

Template.answers.onRendered( function() {
  this.autorun(function() {
    Meteor.subscribe('answers');
    Meteor.subscribe('questions');
  });
});
