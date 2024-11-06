import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class SqsQueueOptionsDto {
  @IsNotEmpty()
  @IsString()
  region: string;

  @IsNotEmpty()
  @IsString()
  apiVersion: string;

  @IsNotEmpty()
  @IsUrl()
  prefix: string;

  @IsNotEmpty()
  @IsString()
  queue: string;

  @IsIn(['poll'])
  @IsString()
  listenerType: string;
}

export class RedisQueueOptionsDto {
  @ValidateIf(o => !o.url)
  @IsString()
  host: string;

  @ValidateIf(o => !o.url)
  @IsNotEmpty()
  @IsInt()
  port: number;

  @IsInt()
  database: number;

  @IsString()
  @IsNotEmpty()
  queue: string;

  @ValidateIf(o => !o.host)
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  prefix: string;
}
