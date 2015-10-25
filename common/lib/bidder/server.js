if (Meteor.isServer) {
  Bidder = {}

  /**
   * Starts the bidder.
   * 1) Looks for the current question (define current?)
   * 2) Looks for the corresponding answer, and the most recent auction
   *    - if there is no answer yet, create one.
   *    - if there is no auction yet, create one.
   * 3) Start cron task to run auctions for the question
   *    - For each tick, get the most recent auction for the request and append the winning word to the question's answer.
   *    - If the winning word is <done>, then pick new question.
   */
  Bidder.start = function() {
    SyncedCron.add({
      name: 'clean up empty auctions',
      schedule: function(parser) {
        return parser.text('every 45 minutes');
      },
      job: function() {
        // Delete empty auctions more than 15 minutes old.
        var before = new Date();
        before.setMinutes(before.getMinutes() - 15);
        Auctions.remove({ bids: {}, createdAt: { $lte: before} });
      }
    });

    SyncedCron.add({
      name: 'run auction',
      schedule: function(parser) {
        return parser.recur().every(10).second(); // TODO @xx hardcoded every 20 seconds.
      },
      job: function() {
        var serverState = ServerState.findOne();
        var currentQuestionId = Questions.findOne(serverState.currentQuestionId)._id;
        var currentAuction = Auctions.findOne({ questionId: currentQuestionId }, { sort: { createdAt: -1}});
        if (!currentAuction) {
          currentAuction = Auctions.findOne(Auctions.insert({
            questionId: currentQuestionId,
            createdAt: new Date()
          }));
        }

        // Empty bid just continue
        if (_.isEmpty(currentAuction.bids)) {
          // Create a new auction.
          Auctions.insert({
            questionId: currentQuestionId,
            createdAt: new Date()
          });
          return;
        }

        // Get the winning word
        var bids = JSON.parse(currentAuction.bids);
        var winningBid = Object.keys(bids).sort(function(a,b){return bids[b]-bids[a]})[0];

        // Check if we're at an end condition
        if (serverState.lookingForQuestion) {
          // Create the new question.
          currentQuestionId = Questions.insert({
            text: winningBid
          });

          // Set this question as the new current question.
          ServerState.update({}, { $set: { currentQuestionId: currentQuestionId, lookingForQuestion: false }});

          // Create corresponding answer
          Answers.insert({
            questionId: currentQuestionId
          });
        } else if (winningBid === "<done>") { // TODO @xx hardcoded
          // This means we just answered a question. Now we need to choose a new question.
          currentQuestionId = Questions.insert({
            text: "Vote for a new question."
          });
          ServerState.update({}, { $set: { currentQuestionId: currentQuestionId, lookingForQuestion: true }});

          // Create corresponding answer
          Answers.insert({
            questionId: currentQuestionId
          });
        } else {
          // Append this to the corresponding answer
          // Check if we're doing a delete
          if (winningBid === "<delete>") {
            // Removes the latest addition.
            Answers.update(
              { questionId: currentQuestionId},
              { $pop: { text: 1 }}
            );
          } else {
            Answers.update(
              { questionId: currentQuestionId},
              { $push: { text: winningBid }}
            );
          }
        }

        // Create a new auction.
        Auctions.insert({
          questionId: currentQuestionId,
          createdAt: new Date()
        });
      }
    });

    SyncedCron.start();
  };

}
