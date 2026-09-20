"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = authorize;
function authorize(...allowedRoles) {
    return async (request, reply) => {
        const user = request.user;
        if (!allowedRoles.includes(user.role)) {
            return reply.status(403).send({
                success: false,
                error: {
                    code: "FORBIDDEN",
                    message: "You do not have permission to perform this action",
                },
            });
        }
    };
}
