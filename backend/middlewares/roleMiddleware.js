const jwt = require("jsonwebtoken");

// admin
const adminMiddleware = async (req, res, next) => {
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

// vendor
let vendorMiddleware = async (req, res, next) => {
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

        if (decoded.role !== "vendor" && decoded.role !== "admin") {
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

// user
let userMiddleware = async (req, res, next) => {
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

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "you are not logged in",
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

module.exports = { adminMiddleware , vendorMiddleware , userMiddleware};