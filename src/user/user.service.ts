import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
@Injectable()
export class UserService {
  // private logger = new Logger();

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  async register(user: RegisterUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.email = user.email;
    newUser.passwordHash = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (err) {
      return '注册失败';
    }
  }

  private generateAccessToken(userId: number, username: string, role: string): string {
    return this.jwtService.sign(
      {
        userId,
        username,
        role,
      },
      {
        expiresIn:
          this.configService.get('jwt_access_token_expires_time') || '30m',
      },
    );
  }

  private generateRefreshToken(userId: number): string {
    return this.jwtService.sign(
      {
        userId,
      },
      {
        expiresIn:
          this.configService.get('jwt_refresh_token_expres_time') || '7d',
      },
    );
  }

  async login(loginUser: LoginUserDto) {
    const user = await this.userRepository.findOneBy({
      username: loginUser.username,
    });

    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (user.passwordHash !== md5(loginUser.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: user.id,
      username: user.username,
      email: user.email,
      createTime: user.createTime,
      updateTime: user.updateTime,
      role: user.role,
    };

    // 生成 access token
    vo.accessToken = this.generateAccessToken(
      vo.userInfo.id,
      vo.userInfo.username,
      vo.userInfo.role
    );

    // 生成 refresh token
    vo.refreshToken = this.generateRefreshToken(vo.userInfo.id);

    return vo;
  }

  async refresh(refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.findUserById(data.userId);
      const access_token = this.generateAccessToken(
        user.id,
        user.username,
        user.role
      );
      const refresh_token = this.generateRefreshToken(user.id);
      return {
        access_token,
        refresh_token,
      };

    } catch (err) {
      throw new HttpException('token 已失效，请重新登录', HttpStatus.BAD_REQUEST);
    }
  }



  async findUserById(userId: number) {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createTime: user.createTime,
      updateTime: user.updateTime,
      role: user.role
    };
  }
}
