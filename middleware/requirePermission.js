const roles = require("../config/roles");

module.exports = function requirePermission(permission){
    return (req ,res , next) =>{
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                message: "Unauthorized: user role missing"
            });
        }
        const role = req.user.role;

        const userPermissions = roles[role] || [];

        if(!userPermissions.includes(permission)){
            return res.status(403).json({
                message:"Access denied : insufficient permission"
            });
        }
        next();
    };
};