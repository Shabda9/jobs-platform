import { Module } from '@nestjs/common';
import { EmployerMeController } from './employer-me.controller';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';

@Module({
  controllers: [EmployersController, EmployerMeController],
  providers: [EmployersService],
})
export class EmployersModule {}
