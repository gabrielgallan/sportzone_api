import "@fastify/jwt"
import type { UserRole } from "@prisma/client"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: string
      role: UserRole
    }
  }
}