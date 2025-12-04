import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  createUser(dto: CreateUserDto) {
    throw new Error('Method not implemented.');
  }
  findById(id: string) {
    throw new Error('Method not implemented.');
  }
  updateUser(id: string, dto: UpdateUserDto) {
    throw new Error('Method not implemented.');
  }
  deleteUser(id: string) {
    throw new Error('Method not implemented.');
  }
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>
  ) { }

  // CREATE
  async create(dto: CreateUserDto) {
    const exists = await this.userModel.findOne({ email: dto.email });
    if (exists) {
      throw new ConflictException('Email já cadastrado');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);

    const user = await this.userModel.create({
      email: dto.email,
      passwordHash: hash,
      name: dto.name,
      isAdmin: dto.isAdmin ?? false,
    });

    return this.omitPassword(user);
  }

  // FIND ALL
  async findAll() {
    const users = await this.userModel.find().lean();
    return users.map(u => this.omitPassword(u));
  }

  // FIND ONE
  async findOne(id: string) {
    const user = await this.userModel.findById(id).lean();
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.omitPassword(user);
  }

  // UPDATE
  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(dto.password, salt);
    }

    if (dto.email) user.email = dto.email;
    if (dto.name) user.name = dto.name;
    if (dto.isAdmin !== undefined) user.isAdmin = dto.isAdmin;

    await user.save();
    return this.omitPassword(user);
  }

  // DELETE
  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return { message: 'Usuário removido com sucesso' };
  }

  // UTIL: remover passwordHash das respostas
  private omitPassword(user: any) {
    const { passwordHash, ...rest } = user.toObject ? user.toObject() : user;
    return rest;
  }

  // FIND BY EMAIL
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean();
  }

  // CREATE IF NOT EXISTS
  async createIfNotExists(
    email: string,
    plainPassword: string,
    name?: string,
    isAdmin: boolean = false
  ) {
    // verifica se já existe
    const existing = await this.userModel.findOne({ email }).exec();
    if (existing) {
      this.logger.log(`User ${email} already exists`);
      return existing.toObject();
    }

    // cria o hash da senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(plainPassword, salt);

    // cria o usuário
    const created = await new this.userModel({
      email,
      passwordHash,
      name,
      isAdmin,
    }).save();

    this.logger.log(`Created default user: ${email}`);

    return created.toObject();
  }

}
