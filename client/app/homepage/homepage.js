var countdown = new ReactiveCountdown(9);

Template.homepage.helpers({
  messages: function() {
    return Messages.find({}).fetch().map(function(message) {
      var user = Meteor.users.findOne({ _id: message.author});
      if (user) {
        if (user.profile && user.profile.name) {
          message.authorName = user.profile.name;
        } else if (user.username) {
          message.authorName = user.username;
        } else {
          message.authorName = 'Anonymous';
        }
      } else {
        message.authorName = 'Anonymous';
      }
      return message;
    });
  },

  currentQuestion: function() {
    var question = Questions.find({}).fetch()[0];
    var serverState = ServerState.findOne({});
    if (serverState) {
      if (serverState.lookingForQuestion) {
        return 'Vote For A Question!';
      }
    }
    return question ? "Current Question: " + question.text : 'Vote For A Question!';
  },

  currentAnswer: function() {
    var answer = Answers.find({}).fetch()[0];
    if (!answer) {
      return "";
    }
    var textArray = answer.text ? answer.text : [];

    var sum = "";
    for (var i = 0; i < textArray.length; i++) {
      if (textArray[i].match(/^[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
        sum = sum + textArray[i];
      } else {
        sum = sum + " " + textArray[i];
      }
    }

    return sum;
  },

  topAnswerBids: function() {
    var bidsArr = [];
    var auction = Auctions.findOne({});
    if (auction) {
      var bidsMap = auction.bids;
      for (var bid in bidsMap){
        if(bidsMap.hasOwnProperty(bid)){
          bidsArr.push({
            phrase: bid,
            count: bidsMap[bid]
          });
        }
      }
    }

    var topbids = bidsArr.sort(function(a, b){
      return b.count - a.count; // a vs b, return positive means a is greater, thus reverse for highest
    }).slice(0,5);

    return topbids;
  },

  barStatus: function() {
    var time = countdown.get() || 0;
    if (time > 4) {
      return "success";
    }

    if (time > 0) {
      return "warning";
    }


    return "error";
  },

  countDownMessage: function() {
    var time = countdown.get() || 0;
    if (0 === time || '0' === time) {
      return "0";
    } else {
      return time + " Seconds";
    }
  },

  progress: function() {
    var time = countdown.get() || 0;
    return time*100/8;
  }
});

Template.homepage.onRendered( function() {
  if (!Meteor.user()) {
    Meteor.loginAsGuest(function (err, boardId) {
      if (err) {
        alert(err);
      }
    });
  }

  this.autorun(function() {
    Meteor.subscribe('currentQuestionAnswerAuction', function() {
      var auction = Auctions.find({});
      auction.observeChanges({
        added: function() {
          countdown.stop();
          countdown.start();
        }
      })
    });
    Meteor.subscribe("messages", function() {
      var messages = Messages.find({});

      messages.observeChanges({
        added: function() {
          var chatText = $("#chat-text");
          setTimeout(function() {
            chatText.scrollTop(chatText[0].scrollHeight);
          }, 100); // much hack
        }
      });
    });
  });
});

Template.homepage.events({
  'submit #message-input': function(event) {
    event.preventDefault();
    var text = event.target.message.value;

    // Sanitize for bids
    Meteor.call('makeBid', text, Questions.findOne({})  ._id, Meteor.userId(), function() {
    });

    event.target.message.value = "";
  }
});

Template.homepage.onRendered( function() {
  if (!Meteor.user()) {
    Meteor.loginAsGuest(function (err, boardId) {
      if (err) {
        alert(err);
      }
    });
  }

  this.autorun(function() {
    Meteor.subscribe('currentQuestionAnswerAuction');
    Meteor.subscribe("messages", function() {
      var messages = Messages.find({});

      messages.observeChanges({
        added: function() {
          var chatText = $("#chat-text");
          setTimeout(function() {
            chatText.scrollTop(chatText[0].scrollHeight);
          }, 100); // much hack
        }
      });
    });
  });
});