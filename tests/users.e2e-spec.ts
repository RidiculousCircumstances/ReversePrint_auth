/* eslint-disable prettier/prettier */
import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
  const app = await boot;
  application = app;
});

describe('Users e2e', () => {
	it('Register - success', async () => {
		const result = await request(application.app).post('/users/register').send({
			name: 'Имя',
			surname: 'test',
			email: `${Math.random()}@mail.ru`,
			phoneNumber: '+79635276933',
			password: '111111111',
			city: 'Test city',
			street: 'Test street',
			building: '1'
			
		});
		expect(result.statusCode).toBe(200);
	})

	it('Register Other City - success', async () => {
		const result = await request(application.app).post('/users/register').send({
			name: 'Имя',
			surname: 'test',
			email: `${Math.random()}@mail.ru`,
			phoneNumber: '+79635276933',
			password: '111111111',
			city: 'Test city 2',
			street: 'Test street',
			building: '1'

		});
		expect(result.statusCode).toBe(200);
	})

	it('Register Other Street - success', async () => {
		const result = await request(application.app).post('/users/register').send({
			name: 'Имя',
			surname: 'test',
			email: `${Math.random()}@mail.ru`,
			phoneNumber: '+79635276933',
			password: '111111111',
			city: 'Test city 2',
			street: 'Test street 2',
			building: '1'

		});
		expect(result.statusCode).toBe(200);
	})

	it('Register Other Building - success', async () => {
		const result = await request(application.app).post('/users/register').send({
			name: 'Имя',
			surname: 'test',
			email: `${Math.random()}@mail.ru`,
			phoneNumber: '+79635276933',
			password: '111111111',
			city: 'Test city 2',
			street: 'Test street 2',
			building: '2'

		});
		expect(result.statusCode).toBe(200);
	})
})


