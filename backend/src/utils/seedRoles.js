import { Role } from "../models/role.model.js";
import { UserRole } from "../models/user-role.model.js";
import { User } from "../models/user.model.js";

const seedRoles = async () => {
  const defaultRoles = ["GOVERNMENT", "NGO", "CITIZEN"];

  for (const roleName of defaultRoles) {
    const exists = await Role.findOne({ roleName });
    if (!exists) {
      await Role.create({ roleName });
      console.log(`✅ Role created: ${roleName}`);
    }
  }
};

const seedGovernmentUsers = async () => {
    try {
        const govtRole = await Role.findOne({ roleName: "GOVERNMENT" });
        if (!govtRole) {
            console.error("❌ GOVT role not found. Please seed roles first.");
            return;
        }

        console.log(govtRole._id);

        const existingGovtUsers = await UserRole.find({ roleId: govtRole._id });
        if (existingGovtUsers.length > 0) {
            console.log("✅ Government users already exist. Skipping seeding.");
            return;
        }

        // Define 2 govt users
        const govtUsersData = [
            { username: "govt1@123", email: "govt1@example.com", password: "123456" },
            { username: "govt2@234", email: "govt2@example.com", password: "123456" },
        ];

        for (const data of govtUsersData) {
            const user = new User({
                username: data.username.toLowerCase(),
                email: data.email,
                password: data.password,
                isEmailVerified: true, // Govt accounts are trusted
                accountType: "default",
            });

            await user.save();

            const userRole = new UserRole({
                userId: user._id,
                roleId: govtRole._id,
            });

            await userRole.save();
        }

        console.log("✅ Seeded 2 government users successfully.");
    } catch (error) {
        console.error("❌ Error seeding government users:", error);
    }
};


export { seedRoles, seedGovernmentUsers };