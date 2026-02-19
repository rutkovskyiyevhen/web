import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Roles } from "../enums/role.enum";

interface PayloadToken {
    userId: number;
    email: string;
    role: Roles;
}

export const UserField = createParamDecorator(
    (userField: keyof PayloadToken, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: PayloadToken | undefined = request.user;
        return user ? user[userField] : null;
    }
);