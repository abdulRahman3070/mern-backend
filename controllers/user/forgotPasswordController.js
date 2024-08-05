const bcrypt = require('bcrypt');
const userModel = require('../../models/userModel');

const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;

        // Validate required fields
        if (!email || !answer || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
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
            message: "Password reset successfully",
            success: true
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({
            message: err.message || "Internal server error",
            success: false
        });
    }
};

module.exports = {
    forgotPasswordController
};