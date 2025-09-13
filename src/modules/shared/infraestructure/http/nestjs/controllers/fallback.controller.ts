import { All, Controller, HttpCode, HttpStatus } from '@nestjs/common';

@Controller('*path')
export class FallbackController {
  @All()
  @HttpCode(HttpStatus.NOT_FOUND)
  handleNotFound(): { message: string } {
    return { message: 'Route not found' };
  }
}
