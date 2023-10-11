const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {

    const token = req.headers["my_token"];

    console.log(token)

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    } else{
        if(token === "000000"){
            return res.status(403).send("Log in first!");
        }
    }

    try {

        console.log("try/catch")

        const decoded = jwt.verify(token, 'secret');

        req.user_email = decoded;

        console.log("Valid token!")

    } catch (err) {

        return res.status(401).send("Invalid Token");
    
    }

    return next();

};

module.exports = verifyToken;