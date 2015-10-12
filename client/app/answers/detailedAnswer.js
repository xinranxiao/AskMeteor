/**
 * Created by xinranxiao on 10/11/15.
 */

Template.detailedAnswer.helpers({
  questionText: function() {
    return Template.currentData().question.text;
  },
  bids: function() {
    var auctions = Auctions.find({ questionId: Template.currentData().question._id });

    var totalBids = {};
    for (var i = 0; i < auctions.fetch().length; i++) {
      var auction = auctions.fetch()[i];
      var bids = auction.bids;

      // For each bid in each auction, accumulate the total bids.
      for (var bid in bids) {
        if (totalBids[bid]) {
          totalBids[bid] += bids[bid];
        } else {
          totalBids[bid] = bids[bid];
        }
      }
    }

    // We need to map this to an array now.
    var totalBidsArray = [];
    _.each(totalBids, function(val, key) {
      totalBidsArray.push({ name: key, count: val});
    });
    totalBidsArray.sort(function(a, b) {return b.count - a.count});

    return totalBidsArray;
  }
});

Template.detailedAnswer.onRendered( function() {
  this.autorun(function() {
    Meteor.subscribe('auctionStats', Template.currentData().question._id);
  });
});
