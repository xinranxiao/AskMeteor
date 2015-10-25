// Publish additional user attributes.
//Meteor.publish(null, function() {
//  return Meteor.users.find(this.userId, {fields: { <field>: 1 }});
//});

Meteor.publishComposite('messages', function() {
  return {
    find: function() {
      return Messages.find({}, { sort: { createdAt: -1 }, limit: Constants.MAX_MESSAGES_PUBLISHED});
    },
    children: [
      {
        find: function(message) {
          return Meteor.users.find({ _id: message.author });
        }
      }
    ]
  }
});

Meteor.publish('questions', function() {
  return Questions.find({});
});

Meteor.publish('answers', function() {
  return Answers.find({});
});

Meteor.publish('serverState', function() {
  return ServerState.find({});
});

Meteor.publish('usersOnline', function() {
  Counts.publish(this, 'usersOnline', Meteor.users.find({'status.online': true}));
});

Meteor.publish('auctionStats', function(questionId) {
  return Auctions.find({ questionId: questionId });
});

Meteor.publishComposite('currentQuestionAnswerAuction', function() {
  return {
    find: function() {
      return ServerState.find({});
    },
    children: [
      {
        find: function(serverState) {
          return Questions.find({_id: serverState.currentQuestionId});
        },
        children: [
          {
            find: function(question) {
              return Answers.find({questionId: question._id});
            }
          },
          {
            find: function(question) {
              return Auctions.find({questionId: question._id}, { sort: { createdAt: -1}, limit: 1});
            }
          }
        ]
      },
    ]
  }
});

