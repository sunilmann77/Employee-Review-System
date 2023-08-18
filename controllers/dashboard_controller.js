const Review = require('../models/review');
const User = require('../models/user');

// Render admin dashboard
module.exports.adminDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      // Fetch the list of users here, assuming you have a method to do so
      const users = await User.find({}); // Adjust the query as needed

      return res.render('admin-dashboard', {
        title: 'Admin Dashboard',
        users: users, // Pass the users array to the template
      });
    } else {
      return res.redirect('/'); // Redirect to sign-in page or another appropriate route
    }
  } catch (err) {
    console.error(err);
    return res.redirect('back');
  }
};

// Render employee dashboard
module.exports.employeeDashboard = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      // populate the employee with reviews assigned to it and reviews from others
      const employee = await User.findById(req.params.id)
        .populate({
          path: 'reviewsFromOthers',
          populate: {
            path: 'reviewer',
            model: 'User',
          },
        })
        .populate('assignedReviews');

      // extract the reviews assigned to it
      const assignedReviews = employee.assignedReviews;

      // extract feedbacks from other employees
      const reviewsFromOthers = employee.reviewsFromOthers;

      // populate reviews given from others
      const populatedResult = await Review.find().populate({
        path: 'reviewer',
        model: 'User',
      });

      return res.render('employee_dashboard', {
        title: 'Employee dashboard',
        employee,
        assignedReviews,
        reviewsFromOthers,
      });
    } else {
      return res.redirect('/');
    }
  } catch (err) {
    console.log(err);
    return res.redirect('back');
  }
};
