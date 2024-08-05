const bcrypt = require('bcrypt');
const userModel = require("../../models/userModel");

const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).json({ message: "Email is Required" });
        }
        if (!answer) {
            return res.status(400).json({ message: "Answer is Required" });
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New Password is Required" });
        }

        // Find the user with the provided email and answer
        const user = await userModel.findOne({ email, answer });
        if (!user) {
            return res.status(404).json({ message: "User not found or invalid answer" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Send success response
        return res.status(200).json({
            message: "Password Reset Successfully",
            success: true,
            error: false
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            message: err.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};

module.exports = forgotPasswordController;
