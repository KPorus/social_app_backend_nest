import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { ILoginBody, IRegisterBody } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

// console.log(require.resolve('src/app.module'));

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const MouleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = MouleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    // Given
    const user1: IRegisterBody = {
      first_name: 'Test',
      last_name: 'test',
      username: 'test',
      email: 'test201@yahoo.com',
      pass: '1234',
    };
    describe('Sign up', () => {
      it('Should email is empty or not unique', () => {
        return pactum.spec().post('/auth/register').withBody(user1);
      });
      it('Should password is empty', () => {
        return pactum.spec().post('/auth/register').withBody(user1);
      });
      it('Should username is empty or unique', () => {
        return pactum.spec().post('/auth/register').withBody(user1);
      });

      it('should sign up', () => {
        return pactum.spec().post('/auth/register').withBody(user1);
      });
    });

    describe('Sign in', () => {
      it('should sign in', () => {
        // Given
        const user: ILoginBody = {
          email: 'test201@yahoo.com',
          pass: '1234',
        };

        return pactum
          .spec()
          .post('/auth/login')
          .withBody(user)
          .expectStatus(201)
          .inspect();
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should return user', () => {
        return pactum.spec().get('/users/me');
      });
    });
    describe('Edit', () => {});
  });
  describe('Post', () => {
    describe('Add post', () => {});
    describe('Edit post', () => {});
    describe('Delete post', () => {});
  });
});
