"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitActivityEvent = emitActivityEvent;
const index_1 = require("./index");
const rooms_1 = require("./rooms");
function emitActivityEvent(payload) {
    const io = (0, index_1.getIO)();
    // Anyone currently viewing this project
    io.to((0, rooms_1.projectRoom)(payload.projectId)).emit("activity:new", payload);
    // The PM's aggregate feed
    io.to((0, rooms_1.pmFeedRoom)(payload.pmId)).emit("activity:new", payload);
    // Admin's global feed
    io.to((0, rooms_1.globalFeedRoom)()).emit("activity:new", payload);
    // The specific developer, if this task is assigned to one
    if (payload.assignedDeveloperId) {
        io.to((0, rooms_1.devFeedRoom)(payload.assignedDeveloperId)).emit("activity:new", payload);
    }
}
