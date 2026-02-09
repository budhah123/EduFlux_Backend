import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiSecurity,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AdminAtGuard } from 'src/auth/decorator';
import { PaginationInput } from 'src/common/pagination';
import { CreateUserInput } from 'src/user/dto';
import { UserOutput } from 'src/user/dto/user.output';
import { UserService } from 'src/user/user.service';

@ApiTags('Admin User Management')
@ApiSecurity('JWT-auth')
@Controller('admin/user')
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @AdminAtGuard()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: CreateUserInput,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - No token provided' })
  async createUser(@Body() createUserInput: CreateUserInput) {
    return await this.userService.createUser(createUserInput);
  }

  @Get()
  @AdminAtGuard()
  @ApiOperation({ summary: 'Get list of users' })
  @ApiOkResponse({
    description: 'List of users retrieved successfully',
    type: [UserOutput],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized - No token provided' })
  async getUsers(@Query() paginationInput: PaginationInput) {
    const [users, count] = await this.userService.getUsers(
      undefined,
      undefined,
      paginationInput,
    );
    return {
      data: users,
      meta: {
        total: count,
        page: paginationInput?.page || 1,
        limit: paginationInput?.limit || 10,
      },
    };
  }
}
