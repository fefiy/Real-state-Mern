const jwt = require("jsonwebtoken")

const verifyTokenUser = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    console.log(authHeader);
    if (authHeader) {   
      const token = authHeader.split(" ")[1];
      console.log("token", token)
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedUser) => {
          if (err) {
            console.log(err)
            return res.status(403).json("Token is not valid!");
          }
          req.decodedUser = decodedUser;
          console.log(req.decodedUser) // Attach the decoded user to the request object
          console.log("user_verify_token",decodedUser.user_id) // Attach the decoded user to the request object
          next();
        }
      );
    } else {
      console.log("authentication is missiong ");
      res.status(401).json("Authentication token missing!");
    }
  };
  

  
  
  
  module.exports ={
    verifyTokenUser
  }