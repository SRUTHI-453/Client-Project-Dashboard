"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalFeedRoom = globalFeedRoom;
exports.pmFeedRoom = pmFeedRoom;
exports.projectRoom = projectRoom;
exports.devFeedRoom = devFeedRoom;
function globalFeedRoom() {
    return "global-feed";
}
function pmFeedRoom(pmId) {
    return `pm-${pmId}`;
}
function projectRoom(projectId) {
    return `project-${projectId}`;
}
function devFeedRoom(devId) {
    return `dev-${devId}`;
}
