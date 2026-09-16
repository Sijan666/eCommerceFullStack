const jwt = require("jsonwebtoken");

let adminMiddleware = async (req, res, next) => {
    try {
        let authorizationToken = req.headers.authorization;

        if (!authorizationToken) {
            return res.status(401).json({
                success: false,
                message: "token is missing",
            });
        }

        let token = authorizationToken.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);

        if (decoded.role !== "admin") {
            return res.status(401).json({
                success: false,
                message: "you are not authorized",
            });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "invalid or expired token",
        });
    }
};

module.exports = { adminMiddleware };