export const createProjectSchema = {
  body: {
    type: "object",
    required: ["name", "clientId"],
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      clientId: { type: "string" },
    },
  },
};

export const projectIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};

export const updateProjectSchema = {
  body: {
    type: "object",
    required: ["name", "description", "clientId"],
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      clientId: { type: "string" },
    },
  },
};

export const patchProjectSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1 },
      description: { type: "string" },
      clientId: { type: "string" },
    },
  },
};