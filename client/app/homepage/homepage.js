var countdown = new ReactiveCountdown(9);

Template.homepage.helpers({
  usersOnline: function() {
    return Counts.get('usersOnline');
  },

  myName: function() {
    return Meteor.user() ? Meteor.user().username : '';
  },

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

  topAnswerBids: function() {
    var bidsArr = [];
    var auction = Auctions.findOne({});
    if (auction) {
      var bids = auction.bids;
      if (bids) {
        bids = JSON.parse(auction.bids);

        for (var bid in bids){
          if(bids.hasOwnProperty(bid)){
            bidsArr.push({
              phrase: bid,
              count: bids[bid]
            });
          }
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
  Session.set('currAnswerLength', 0);
  Session.set('cursorIntervalFunctionIdx', Meteor.setInterval(function(){
    $('#cursor').animate({
      opacity: 0
    }, 'fast', 'swing').animate({
      opacity: 1
    }, 'fast', 'swing');
  }, 750));

  this.autorun(function() {
    Meteor.subscribe('usersOnline');
    Meteor.subscribe('currentQuestionAnswerAuction', function() {
      var auction = Auctions.find({});
      auction.observeChanges({
        added: function() {
          countdown.stop();
          countdown.start();
        }
      });

      var answer = Answers.find({});
      answer.observeChanges({
        added: function(id, fields) {
          var textArray = fields.text;
          var sum = "";
          for (var i = 0; i < textArray.length; i++) {
            if (textArray[i].match(/^[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
              sum = sum + textArray[i];
            } else {
              sum = sum + " " + textArray[i];
            }
          }
          $('#caption').text(sum);

          Session.set('currAnswerLength', sum.length);
          Session.set('currAnswer', sum);
        },
        changed: function(id, newAnswer) {
          newAnswer = newAnswer.text;

          // Assume it's the same answer, unsafe but good enough for now.
          var sum = "";
          for (var i = 0; i < newAnswer.length; i++) {
            if (newAnswer[i].match(/^[.,-\/#!$%\^&\*;:{}=\-_`~()]/)){
              sum = sum + newAnswer[i];
            } else {
              sum = sum + " " + newAnswer[i];
            }
          }

          // Animate the new diff + save the new length.
          var currAnswerLength = Session.get('currAnswerLength');
          if (currAnswerLength <= sum.length) {
            type(sum, currAnswerLength);
          } else {
            erase(sum, currAnswerLength);
          }

          function type(answerText, currLength) {
            $('#caption').text(answerText.substr(0, currLength++));

            if (currLength < (answerText.length + 1)) {
              Meteor.setTimeout(function() {
                type(answerText, currLength);
              }, 120);
            } else {
              Session.set('currAnswerLength', currLength);
              Session.set('currAnswer', answerText);
            }
          }
          function erase(answerText, currLength) {
            var currAnswerText = Session.get('currAnswer');
            $('#caption').text(currAnswerText.substr(0, --currLength));

            if (currLength > answerText.length) {
              Meteor.setTimeout(function() {
                erase(answerText, currLength);
              }, 120);
            } else {
              Session.set('currAnswerLength', currLength);
              Session.set('currAnswer', answerText);
            }
          }
        }
      });
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

Template.homepage.onDestroyed(function() {
  Meteor.clearInterval(Session.get('cursorIntervalFunctionIdx'));
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