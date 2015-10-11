if (Questions.find().count() == 0) {
  // Create a default question
  var questionId = Questions.insert({
    text: "why is a spinning mouse?",
    author: null // This will show the question as anonymous
  });

  Answers.insert({
    questionId: questionId,
    text: [],
    collaborators: []
  });

  // Create the initial server state (specifies the current question)
  ServerState.insert({
    lookingForQuestion: false,
    currentQuestionId: questionId
  });
}