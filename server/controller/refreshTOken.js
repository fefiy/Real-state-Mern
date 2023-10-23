
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require("../model/user")

const refreshToken = asyncHandler(async (req, res) => {
  const email = req.query.email;
  console.log('Refresh token is');
  console.log('Refresh email', email);

  if (email) {
    try {
      const UserExists = await User.findOne({ email: email });

      if (UserExists) {
        console.log('User exists', UserExists);

        const accessToken = jwt.sign(
          {
            user_id: UserExists._id, // Assuming your User model has an "_id" field
            email: UserExists.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '20s' }
        );

        console.log('Refresh access token', accessToken);
        res.json({ accessToken });
      } else {
        console.log('User doesn\'t exist');
        res.status(403).json({ error: 'Forbidden' });
      }
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    console.log('User refresh email doesn\'t exist');
    res.status(403).json({ error: 'Forbidden' });
  }
});

module.exports = refreshToken;


module.exports = {
  refreshToken,
};
