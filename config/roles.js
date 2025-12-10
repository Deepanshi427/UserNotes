const P = require("./permissions");

module.exports = {
  admin: [
    P.CREATE_NOTES,
    P.READ_NOTES,
    P.UPDATE_NOTES,
    P.DELETE_NOTES,
    P.ADMIN_OVERRIDE
  ],

  manager: [
    P.READ_NOTES,
    P.UPDATE_NOTES
  ],

  user: [
    P.READ_NOTES,
    P.CREATE_NOTES
  ]
};
