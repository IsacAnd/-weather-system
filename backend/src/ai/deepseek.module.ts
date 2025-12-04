import { Module } from '@nestjs/common';
import { DeepSeekService } from './deepseek.service';
import { DeepSeekController } from './deepseek.controller';

@Module({
    controllers: [DeepSeekController],
    providers: [DeepSeekService],
    exports: [DeepSeekService],
})
export class DeepSeekModule { }
