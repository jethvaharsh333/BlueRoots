import { HTTPSTATUS } from "../config/http.config.js";
import { Role } from "../models/role.model.js";
import { UserRole } from "../models/user-role.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generatePassword } from "../utils/generate-password.js";
import { sendEmail } from "../utils/mail.js";

const createUser = async (req, res) => {
    const { username, email, role } = req.body;

    if (!username || !email || !role) {
        return ApiResponse.failure("All fields are required.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    if (role == "GOVERNMENT") {
        return ApiResponse.failure("Invalid role specified.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const password = generatePassword();

    const userExists = await User.findOne({ email });
    if (userExists) {
        return ApiResponse.failure("User with this email already exists.", HTTPSTATUS.BAD_REQUEST).send(res);
    }

    const user = new User({ username, email, password, role });
    await user.save({ session: req.dbSession });

    const userrole = await Role.findOne({ roleName: role });
    if (!userrole) {
        return ApiResponse.failure("GOVERNMENT role not found. Please seed roles first.", 500).send(res);
    }

    const userRole = new UserRole({
        userId: user._id,
        roleId: userrole._id,
    });
    await userRole.save({ session: req.dbSession });

    const subject = "NGO credentials";
    const message = `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #4CAF50;">Welcome NGO!!</h2>
                    <p style="background-color: #f9f9f9; padding: 10px; border-radius: 5px;">
                        Your credentials. Username: ${username}<br/>
                        Email: ${email}<br/>
                        Password: ${password}<br/>
                    </p>
                </div>`;

    await sendEmail(email, subject, message);

    return ApiResponse.success(user, `User with role ${role} created successfully.`, HTTPSTATUS.CREATED).send(res);
}

export { createUser };