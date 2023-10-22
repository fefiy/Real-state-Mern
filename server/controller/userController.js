const prisma = require("../config/prismaConfig");
const asyncHandler = require("express-async-handler");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../config/sendEmail");
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
  console.log("creating a user");
  console.log(req.body);
  const { email, password, name } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newuser = {
      email,
      name,
      password: hashedPassword,
    };
    const user = await prisma.user.create({ data: newuser });
    tokenValue = crypto.randomBytes(32).toString("hex");
    await prisma.token.create({
      data: {
        userId: user.id,
        token: tokenValue,
      },
    });
    const url = `${process.env.BASE_URL}users/${user.id}/verify/${tokenValue}`;

    await sendEmail(user.email, "Verify Email", url);

    return res.status(201).send({
      message: "An email has been sent to your account. Please verify.",
    });
  } else res.status(201).send({ message: "User already registered" });
});

const login = asyncHandler(async (req, res) => {
  console.log("login calldedd");
  const { email, password } = req.body;
  const userExists = await prisma.user.findUnique({ where: { email: email } });
  if (!userExists) {
    res.status(401).json({ message: "User Doen't exist" });
  } else {
    console.log("userExist", userExists);
    const match = bcrypt.compareSync(password, userExists.password);
    if (match) {
      if (!userExists.verified) {
        let token = await prisma.token.findFirst({
          where: { userId: userExists.id },
        });

        let tokenValue = token?.token;

        if (!token) {
          tokenValue = crypto.randomBytes(32).toString("hex");
          await prisma.token.create({
            data: {
              userId: userExists.id,
              token: tokenValue,
            },
          });
        }

        const url = `${process.env.BASE_URL}users/${userExists.id}/verify/${tokenValue}`;
        console.log(url);

        await sendEmail(userExists.email, "Verify Email", url);

        return res.status(400).send({
          message: "An email has been sent to your account. Please verify.",
        });
      } else {
        const { password, ...others } = userExists;
        // create acessToken
        const accessToken = jwt.sign(
          { user_id: userExists.id,
            email :userExists.email,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "20s" }
        );
        // user is verified
        return res.status(200).send({ user: others, token: accessToken });
      }
    } else {
      res.status(401).json({ message: "Wrong Password" });
    }
  }
});

const verifyEmail = async (req, res) => {
  console.log("verify email");
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    console.log(user);
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await prisma.token.findFirst({
      where: { userId: user.id, token: req.params.token },
    });
    console.log(req.params.token);
    console.log(token);
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });

    await prisma.token.delete({
      where: { id: token.id },
    });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const bookVisit = asyncHandler(async (req, res) => {
  console.log("book visit");
  console.log("req.body", req.body);
  const { email, date } = req.body;
  const { id } = req.params;

  try {
    const alreadyBooked = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });

    if (alreadyBooked.bookedVisits.some((visit) => visit.id === id)) {
      res
        .status(400)
        .json({ message: "This residency is already booked by you" });
    } else {
      await prisma.user.update({
        where: { email: email },
        data: {
          bookedVisits: { push: { id, date } },
        },
      });
      res.send("your visit is booked successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// funtion to get all bookings of a user
const getAllBookings = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const bookings = await prisma.user.findUnique({
      where: { email },
      select: { bookedVisits: true },
    });
    res.status(200).send(bookings);
  } catch (err) {
    throw new Error(err.message);
  }
});

const cancelBooking = asyncHandler(async (req, res) => {
  console.log("cancelling booking");
  const { email } = req.body;
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { bookedVisits: true },
    });

    const index = user.bookedVisits.findIndex((visit) => visit.id === id);

    if (index === -1) {
      res.status(404).json({ message: "Booking not found" });
    } else {
      user.bookedVisits.splice(index, 1);
      await prisma.user.update({
        where: { email },
        data: {
          bookedVisits: user.bookedVisits,
        },
      });

      res.send("Booking cancelled successfully");
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to add a resd in favourite list of a user
const toFav = asyncHandler(async (req, res) => {
  console.log("tofav");
  const { email } = req.body;
  console.log(req.body);
  const { rid } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user.favResidenciesID.includes(rid)) {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            set: user.favResidenciesID.filter((id) => id !== rid),
          },
        },
      });

      res.send({ message: "Removed from favorites", user: updateUser });
    } else {
      const updateUser = await prisma.user.update({
        where: { email },
        data: {
          favResidenciesID: {
            push: rid,
          },
        },
      });
      res.send({ message: "Updated favorites", user: updateUser });
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

// function to get all favorites
const getAllFavorites = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const favResd = await prisma.user.findUnique({
      where: { email },
      select: { favResidenciesID: true },
    });
    res.status(200).send(favResd);
  } catch (err) {
    throw new Error(err.message);
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
