const User = require('../models/user');
const Review = require('../models/review');

// Asign a review
module.exports.assignReview = async (req, res) => {
  const { recipient_email } = req.body;
  try {
    if (req.isAuthenticated()) {
      const reviewer = await User.findById(req.params.id);
      const recipient = await User.findOne({ email: recipient_email });

      // check if review already assigned
      const alreadyAssigned = reviewer.assignedReviews.filter(
        (userId) => userId == recipient.id
      );

      // if found, prevent from assigning duplicate review
      if (alreadyAssigned.length > 0) {
        return res.redirect('back');
      }

      // update reviewer's assignedReviews field by putting reference of recipient
      await reviewer.updateOne({
        $push: { assignedReviews: recipient },
      });
      return res.redirect('back');
    } 
  } catch (err) {
    console.log('error: ', err);
  }
};

// Submit review
module.exports.submitReview = async (req, res) => {
  const { recipient_email, feedback } = req.body;
  try {
    const recipient = await User.findOne({ email: recipient_email });
    const reviewer = await User.findById(req.params.id);

    // create a new review
    const review = await Review.create({
      review: feedback,
      reviewer,
      recipient,
    });

    // remove all extra spaces from the review
    const reviewString = review.review.trim();

    // prevent from submitting empty feedback
    if (reviewString === '') {
      return res.redirect('back');
    }

    // put reference of newly created review to recipents schema
    await recipient.updateOne({
      $push: { reviewsFromOthers: review },
    });

    // remove reference of the recipient from the reviewer's assignedReviews field
    await reviewer.updateOne({
      $pull: { assignedReviews: recipient.id },
    });
    return res.redirect('back');
  } catch (err) {
    console.log('error', err);
  }
};

// Update review
module.exports.updateReview = async (req, res) => {
  try {
    const { feedback } = req.body;
    const reviewToBeUpdated = await Review.findById(req.params.id);

    // if review not found
    if (!reviewToBeUpdated) {
    }

    reviewToBeUpdated.review = feedback; // assigning the feedback string coming from form body to review
    reviewToBeUpdated.save(); // saving the review
    return res.redirect('back');
  } catch (err) {
    console.log(err);
  }
};
