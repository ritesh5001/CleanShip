import { Router } from "express";
import { z } from "zod";
import {
  createUser,
  listSupervisors,
  listUsers,
  updateUser,
} from "../domain/users.js";
import { temporaryPassword } from "../auth/passwords.js";
import { ROLES } from "../auth/roles.js";
import { requireRole, sessionOf } from "../http/session.js";
import { parseBody, parseId } from "../http/validate.js";
import { ApiError } from "../http/errors.js";

export const userRoutes = Router();

/**
 * Supervisors, for the assignment dropdown.
 *
 * Above the admin gate because an admin creating a vessel needs it and so
 * does nothing else — a supervisor never sees this list.
 */
userRoutes.get("/supervisors", requireRole("admin"), async (_req, res) => {
  res.json({ supervisors: await listSupervisors() });
});

userRoutes.use(requireRole("admin"));

userRoutes.get("/", async (req, res) => {
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const filter = ROLES.includes(role as never) ? (role as never) : undefined;
  res.json({ users: await listUsers(filter) });
});

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Enter a name."),
  role: z.enum(["admin", "editor", "supervisor"]),
  /** Omitted means "generate one and show it to me once". */
  password: z.string().min(8, "Use at least 8 characters.").optional(),
  phone: z.string().max(40).nullish(),
});

userRoutes.post("/", async (req, res) => {
  const body = parseBody(createSchema, req.body);
  const password = body.password ?? temporaryPassword();
  const user = await createUser({ ...body, password });
  /* The generated password is returned exactly once, here. It is not stored in
     readable form anywhere, so if it is lost the only path is a reset. */
  res.status(201).json({
    user,
    ...(body.password ? {} : { temporaryPassword: password }),
  });
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["admin", "editor", "supervisor"]).optional(),
  phone: z.string().max(40).nullish(),
  active: z.boolean().optional(),
  password: z.string().min(8).optional(),
});

userRoutes.patch("/:id", async (req, res) => {
  const id = parseId(req.params.id, "user id");
  const body = parseBody(updateSchema, req.body);
  const session = sessionOf(req);

  /* Locking yourself out of the only admin account is a support call nobody
     can answer without database access. */
  if (id === session.sub) {
    if (body.active === false) {
      throw ApiError.badRequest("You cannot deactivate your own account.");
    }
    if (body.role && body.role !== "admin") {
      throw ApiError.badRequest("You cannot remove your own admin role.");
    }
  }

  res.json({ user: await updateUser(id, body) });
});

/** Resets a password and returns the new one once. */
userRoutes.post("/:id/reset-password", async (req, res) => {
  const id = parseId(req.params.id, "user id");
  const password = temporaryPassword();
  const user = await updateUser(id, { password });
  res.json({ user, temporaryPassword: password });
});
