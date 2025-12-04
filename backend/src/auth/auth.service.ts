import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwt: JwtService
    ) { }

    async validateUser(email: string, plainPassword: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Credenciais inválidas');

        const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
        if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

        return user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);

        const payload = { sub: user._id, email: user.email, isAdmin: user.isAdmin };

        return {
            access_token: this.jwt.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                isAdmin: user.isAdmin,
            },
        };
    }
}
