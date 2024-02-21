import { PartialType } from '@nestjs/mapped-types';
import { CreatePushUserDto } from './create-push-user.dto';

export class UpdatePushUserDto extends PartialType(CreatePushUserDto) {}
