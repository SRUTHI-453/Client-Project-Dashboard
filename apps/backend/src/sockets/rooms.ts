export function globalFeedRoom() {
  return "global-feed";
}

export function pmFeedRoom(pmId: string) {
  return `pm-${pmId}`;
}

export function projectRoom(projectId: string) {
  return `project-${projectId}`;
}

export function devFeedRoom(devId: string) {
  return `dev-${devId}`;
}