const asyncHandler = require("express-async-handler");
const jwt =  require("jsonwebtoken")
const prisma = require("../config/prismaConfig")

const refreshToken = asyncHandler(async (req, res) => {
    const email = req.query.email;
    console.log("refresh token is ")
    console.log("refresh email", email)
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   console.log(authHeader);
  if (email) {
    // already the token is expired
    // const token = authHeader.split(" ")[1];
    const userExists = await prisma.user.findUnique({
      where: { email: email },
    });
    if (userExists) {
        console.log("userExists", userExists)
        const accessToken = jwt.sign(
            { user_id: userExists.id,
              email :userExists.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "20s" }
          );
          console.log("refresh acess token", accessToken)
      res.json(accessToken);
    } else {
        console.log("user doesn't exist ")
      res.status(403); /// forbiden
    }
    //   i have to know for waht usesr I am going to
  } else {
    console.log("user refrsh email doen't exist")
    res.status(403); /// forbiden
  }
});

module.exports = {
  refreshToken,
};
