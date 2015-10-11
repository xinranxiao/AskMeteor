Meteor.methods({
  'makeBid': function(message, currentQuestionId, userId) {
    Messages.insert({
      text: message,
      author: userId
    });
    var auction = Auctions.findOne({ questionId: currentQuestionId }, { sort: { createdAt: -1}, limit: 1});
    if (!auction){
      return;
    }
    var bids = auction.bids;
    if (bids[message]) {
      bids[message] = bids[message] + 1;
    } else {
      bids[message] = 1;
    }

    Auctions.update(auction._id, { $set : { bids: bids}});
  }
});