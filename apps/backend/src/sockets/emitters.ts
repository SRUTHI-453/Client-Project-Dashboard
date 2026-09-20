import { getIO } from "./index";
import { globalFeedRoom, pmFeedRoom, projectRoom, devFeedRoom } from "./rooms";

interface ActivityEventPayload {
  id: string;
  projectId: string;
  pmId: string;
  taskId?: string;
  assignedDeveloperId?: string;
  actorName: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  createdAt: string;
}

export function emitActivityEvent(payload: ActivityEventPayload) {
  const io = getIO();

  // Anyone currently viewing this project
  io.to(projectRoom(payload.projectId)).emit("activity:new", payload);

  // The PM's aggregate feed
  io.to(pmFeedRoom(payload.pmId)).emit("activity:new", payload);

  // Admin's global feed
  io.to(globalFeedRoom()).emit("activity:new", payload);

  // The specific developer, if this task is assigned to one
  if (payload.assignedDeveloperId) {
    io.to(devFeedRoom(payload.assignedDeveloperId)).emit(
      "activity:new",
      payload
    );
  }
}