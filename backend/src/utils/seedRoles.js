import { Role } from "../models/role.model.js";

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

export { seedRoles };