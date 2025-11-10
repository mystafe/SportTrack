import { z } from 'zod';
import { ACTIVITY_DEFINITIONS, ActivityKey } from './activityConfig';

const activityKeyEnum = z.enum(Object.keys(ACTIVITY_DEFINITIONS) as [
  ActivityKey,
  ...ActivityKey[]
]);

export const createActivitySchema = z.object({
  activityKey: activityKeyEnum,
  amount: z.coerce.number().int().positive(),
  performedAt: z.string().datetime().optional(),
  note: z
    .string()
    .max(500)
    .optional()
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

