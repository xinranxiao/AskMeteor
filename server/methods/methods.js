Meteor.methods({
  'makeBid': function(message, currentQuestionId, userId) {
    // Enforce max length for messages (and indirectly bids)
    if (message.length > Constants.MAX_MESSAGE_LENTH) {
      return;
    }

    // Insert the message.
    Messages.insert({
      text: message,
      author: userId,
      createdAt: new Date()
    });

    // Get the current auction.
    var auction = Auctions.findOne({ questionId: currentQuestionId }, { sort: { createdAt: -1}, limit: 1});
    if (!auction){
      return;
    }

    // Each user is only allowed to bid once per auction.
    if (_.contains(auction.participants, userId)) {
      return;
    }

    // Sanitize for valid bid.
    if (message[0] !== '!') {
      return;
    } else {
      message = message.slice(1);
    }

    // Add the bid to the auction.
    var bids = auction.bids ? JSON.parse(auction.bids) : {};
    if (bids[message]) {
      bids[message] = bids[message] + 1;
    } else {
      bids[message] = 1;
    }

    Auctions.update(auction._id, { $set : { bids: JSON.stringify(bids) }, $push : { participants: userId }});
  }
});