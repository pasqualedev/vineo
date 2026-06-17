import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(1).default('Enófilo'),
})

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
