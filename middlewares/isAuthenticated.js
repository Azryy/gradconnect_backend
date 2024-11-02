import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token; // Ensure this is the correct method of getting the token
       

        if (!token) {
            return res.status(401).json({
                message: "User does not exist",
                success: false,
            });
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY);
       

        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }

        req.id = decode.userId; // Set user ID for access
        next();
    } catch (error) {
        console.error("Authentication error:", error); // Log any errors
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
};

export default isAuthenticated;
