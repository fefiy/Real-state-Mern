
const Token = require('../model/token'); // Your Mongoose Token model
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../config/sendEmail');
const crypto = require('crypto');
const User = require("../model/user")

// Create a User
const createUser = asyncHandler(async (req, res) => {
  console.log('Creating a User');
  console.log(req.body);
  const { email, password, name } = req.body;

  // Check if the User already exists
  const UserExists = await User.findOne({ email: email });

  if (!UserExists) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    await newUser.save();

    const TokenValue = crypto.randomBytes(32).toString('hex');
      console.log("newUser", newUser)
    const newToken = new Token({
      userId: newUser._id,
      token: TokenValue,
    });

    await newToken.save();

    const url = `${process.env.BASE_URL}Users/${newUser._id}/verify/${TokenValue}`;

    await sendEmail(newUser.email, 'Verify Email', url);

    return res.status(201).send({
      message: 'An email has been sent to your account. Please verify.',
    });
  } else {
    res.status(201).send({ message: 'User already registered' });
  }
});

// Login
const login = asyncHandler(async (req, res) => {
  console.log('Login called');
  const { email, password } = req.body;

  const UserExists = await User.findOne({ email: email });
 console.log("userExiste", UserExists)
  if (!UserExists) {
    res.status(401).json({ message: "User doesn't exist" });
  } else {
    console.log('User exists', UserExists);
    const match = bcrypt.compareSync(password, UserExists.password);

    if (match) {
      if (!UserExists.verified) {
        let token_email = await Token.findOne({ userId: UserExists._id });
        let TokenValue = token_email ? token_email.token : crypto.randomBytes(32).toString('hex');

        if (!token_email) {
          const newToken = new Token({
            userId: UserExists._id,
            token: TokenValue,
          });
          await newToken.save();
        }

        const url = `${process.env.BASE_URL}Users/${UserExists._id}/verify/${TokenValue}`;
        console.log(url);

        await sendEmail(UserExists.email, 'Verify Email', url);

        return res.status(400).send({
          message: 'An email has been sent to your account. Please verify.',
        });
      } else {
        const { password, ...others } = UserExists._doc;
        const token = jwt.sign(
          {
            suer_id: UserExists._id,
            email: UserExists.email,
          },
          process.env.ACCESS_Token_SECRET,
          { expiresIn: '20s' }
        );

        return res.status(200).send({ user: others, token});
      }
    } else {
      res.status(401).json({ message: 'Wrong Password' });
    }
  }
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  console.log('Verify email');
  try {
    const user = await User.findById(req.params.id);
    console.log(user)
    if (!user) {
      return res.status(400).send({ message: 'Invalid link' });
    }

    const token = await Token.findOne({ userId: user._id, token: req.params.token });
    console.log(user)
    console.log(token)
    if (!token) {
      return res.status(400).send({ message: 'Invalid link' });
    }
    user.verified = true;
    await user.save();

    await token.remove();

    res.status(200).send({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



const bookVisit = asyncHandler(async (req, res) => {
  console.log('Book visit');
  console.log('req.body', req.body);
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.bookedVisits.some((visit) => visit.id === id)) {
      res.status(400).json({ message: 'This residency is already booked by you' });
    } else {
      user.bookedVisits.push({ id, date });
      await user.save();
      res.send('Your visit is booked successfully');
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Get all Bookings of a User
const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const User = await User.findOne({ email }).select('bookedVisits');
    res.status(200).send(User.bookedVisits);
  } catch (err) {
    throw new Error(err.message);
  }
});

// Cancel Booking
const cancelBooking = asyncHandler(async (req, res) => {
  console.log('Cancelling booking');
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await User.findOne({ email }).select('bookedVisits');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: 'Booking not found' });
    } else {
      user.bookedVisits.splice(index, 1);
      await user.save();
      res.send('Booking canceled successfully');
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Add or Remove Residency in Favorites
const toFav = asyncHandler(async (req, res) => {
  console.log('Adding to Favorites');
  const { email } = req.body;
  const id =  req.params.rid;
  console.log ("req params" ,req.params)

  try {
    const user = await User.findOne({ email });
    console.log("user from toFav", user)
    console.log("residenceId from toFav", id)
    if (user.favResidenciesID.includes(id)) {
      user.favResidenciesID = user.favResidenciesID.filter((id) => id !== id);
      await user.save();
      console.log("remove favourites")
      res.send({ message: 'Removed from favorites', user });
    } else {
      console.log("add favourites")
      user.favResidenciesID.push(id);
      await user.save();
      res.send({ message: 'Updated favorites', user });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// Get All Favorites
const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const User = await User.findOne({ email }).select('favResidenciesID');
    res.status(200).send(User.favResidenciesID);
  } catch (err) {
    throw Error(err.message);
  }
});

module.exports = {
  createUser,
  bookVisit,
  getAllBookings,
  cancelBooking,
  getAllFavorites,
  toFav,
  login,
  verifyEmail,
};
