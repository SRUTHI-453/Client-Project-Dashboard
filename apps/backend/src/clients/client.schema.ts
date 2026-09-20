export const createClientSchema = {
  body: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", minLength: 1 },
      email: { type: "string" },
      phone: { type: "string" },
    },
  },
};

export const clientIdSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};

export const updateClientSchema = {
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string" },
    phone: { type: "string" },
  },
};

export const patchClientSchema = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string" },
    phone: { type: "string" },
  },
};