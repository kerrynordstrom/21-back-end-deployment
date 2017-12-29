'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}/signup`;

describe('AUTH Router', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(accountMockFactory.remove);

	test('POST creating an account should response with a 200 if there are no errors', () => {
		return superagent.post(apiURL)
			.send({
				username: 'kAry',
				email: 'kAry@kerry.com',
				password: 'kAryNation',
			})
			.then (response => {
				expect(response.status).toEqual(200);
				expect(response.body.token).toBeTruthy();
			});
		});

	test('POST creating an account should response with a 400 if there is missing information from the request', () => {
		return superagent.post(apiURL)
			.send({username: 'not enough info',
						password: 'yup'
					})
			.then(Promise.reject)
			.catch(response => {
				expect(response.status).toEqual(400);
			});
		});

	test('POST creating an account should response with a 409 status code if there is a duplicate key', () => {
		let accountObj = null;
		return accountMockFactory.create()
			.then(account => {
				accountObj = account;
				return superagent.post(apiURL)
					.send({
						username: accountObj.request.username,
						email: accountObj.request.email,
						password: accountObj.request.password,
							})	
					.then(Promise.reject)
					.catch(response => {
						expect(response.status).toEqual(409);
			});
		});
	});
});
