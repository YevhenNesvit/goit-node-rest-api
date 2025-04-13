import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";
import User from "./user.js";

const Contact = sequelize.define("Contact", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Встановлюємо зв'язок між User і Contact
Contact.belongsTo(User, { foreignKey: "owner" });
User.hasMany(Contact, { foreignKey: "owner" });

// sequelize.sync({ force: true });

export default Contact;
