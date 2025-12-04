import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // CREATE
    @Post()
    async create(@Body() dto: CreateUserDto) {
        try {
            return await this.usersService.create(dto);
        } catch (err) {
            throw new BadRequestException(err.message);
        }
    }

    // GET ALL (protected)
    @UseGuards(JwtAuthGuard)
    @Get()
    async findAll() {
        return await this.usersService.findAll();
    }

    // GET ONE (protected)
    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    // UPDATE (protected)
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        const updated = await this.usersService.update(id, dto);
        if (!updated) throw new NotFoundException('User not found');
        return updated;
    }

    // DELETE (protected)
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async remove(@Param('id') id: string) {
        const deleted = await this.usersService.remove(id);
        if (!deleted) throw new NotFoundException('User not found');
        return { message: 'User deleted successfully' };
    }
}
