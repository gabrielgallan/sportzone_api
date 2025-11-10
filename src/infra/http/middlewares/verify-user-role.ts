import type { UserRole } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(
    roleToVerify: UserRole
) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { role } = request.user

        if (role !== roleToVerify) {
            return reply.status(401).send({ error: 'Unauthorized' })
        }
        
        return
    }
}