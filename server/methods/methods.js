Meteor.methods({
  'makeBid': function(message, currentQuestionId, userId) {
    // Enforce max length
    if (message.length > 90) {
      return;
    }

    Messages.insert({
      text: message,
      author: userId
    });
    var auction = Auctions.findOne({ questionId: currentQuestionId }, { sort: { createdAt: -1}, limit: 1});
    if (!auction){
      return;
    }

    // Each user is only allowed to bid once per auction.
    if (_.contains(auction.participants, userId)) {
      return;
    }

    message = message.replace(/\./g, "。");

    // Sanitize for valid bid.
    if (message[0] !== '!') {
      return;
    } else {
      message = message.slice(1);
    }

    if (message[0] === '$') {
      message = message.slice(1);
    }

    var bids = auction.bids;
    if (bids[message]) {
      bids[message] = bids[message] + 1;
    } else {
      bids[message] = 1;
    }

    Auctions.update(auction._id, { $set : { bids: bids}, $push : { participants: userId }});
  }
});