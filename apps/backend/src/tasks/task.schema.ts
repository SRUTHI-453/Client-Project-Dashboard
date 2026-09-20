export const createTaskSchema = {
  body: {
    type: "object",
    required: ["projectId", "title"],
    properties: {
      projectId: { type: "string" },
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      assignedDeveloperId: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      dueDate: { type: "string" },
    },
  },
};

export const taskIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};

export const updateTaskSchema = {
  body: {
    type: "object",
    required: ["title"],
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      assignedDeveloperId: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      dueDate: { type: "string" },
    },
  },
};

export const patchTaskSchema = {
  body: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      assignedDeveloperId: { type: "string" },
      status: { type: "string" },
      priority: { type: "string" },
      dueDate: { type: "string" },
    },
  },
};