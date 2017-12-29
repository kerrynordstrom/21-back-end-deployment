'use strict';

require('./lib/setup')

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const soundMockFactory = require('./lib/sound-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('/sounds', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(soundMockFactory.remove);

	describe('POST routes', () => {
	test('POST /sounds should return a 200 status code if there are no errors', () => {
		let tempAccountMock = null;

		return accountMockFactory.create()
			.then(accountMock => {
				tempAccountMock = accountMock;

				return superagent.post(`${apiURL}/sounds`)
					.set('Authorization', `Bearer ${accountMock.token}`)
					.field('title', 'TGIF')
					.attach('sound', `${__dirname}/asset/thank-god-its-friday.wav`)
					.then(response => {
						expect(response.status).toEqual(200);
						expect(response.body.title).toEqual('TGIF');
						expect(response.body._id).toBeTruthy();
						expect(response.body.url).toBeTruthy();
					});
			});
	});
		test('POST /sounds should return a 400 failure status code if there is a bad request', () => {
			let tempAccountMock = null;

			return accountMockFactory.create()
				.then(accountMock => {
					tempAccountMock = accountMock;

					return superagent.post(`${apiURL}/sounds`)
						.set('Authorization', `Bearer ${accountMock.token}`)
						.attach('sound', `${__dirname}/asset/thank-god-its-friday.wav`)
						.then(Promise.reject)
						.catch(response => {
							expect(response.status).toEqual(400);
						});
				});
		});
		test('POST /sounds should return a 401 failure status code if an incorrect token is sent', () => {
			let tempAccountMock = null;

			return accountMockFactory.create()
				.then(accountMock => {
					tempAccountMock = accountMock;

					return superagent.post(`${apiURL}/sounds`)
						.set('Authorization', `Bearer badtokenboi`)
						.attach('sound', `${__dirname}/asset/thank-god-its-friday.wav`)
						.then(Promise.reject)
						.catch(response => {
							expect(response.status).toEqual(401);
						});
				});
		});
	});

	describe('GET routes', () => {
	test('GET /sounds should return a 200 status code if there are no errors', () => {
		let soundMock = null;

		return soundMockFactory.create()
			.then(mock => {
				soundMock = mock;
				return superagent.get(`${apiURL}/sounds/${soundMock.sound._id}`)
					.set('Authorization', `Bearer ${soundMock.accountMock.token}`);
			})
					.then(response => {
						expect(response.status).toEqual(200);
						expect(response.body.account).toEqual(soundMock.accountMock.account._id.toString());
						expect(response.body.account).toEqual(soundMock.sound.account.toString());
						expect(response.body.title).toEqual(soundMock.sound.title.toString());
						expect(response.body.url).toEqual(soundMock.sound.url.toString());
					});
			});

	test('Should respond with a 404 error message if an incorrect id is passed.', () => {
		let soundMock = null;

		return soundMockFactory.create()
			.then(mock => {
				soundMock = mock;
				return superagent.get(`${apiURL}/sounds/123456`)
					.set('Authorization', `Bearer ${soundMock.accountMock.token}`);
			})
			.then(Promise.reject)
			.catch(response => {
				expect(response.status).toEqual(404);
			});
	});

	test('Should respond with a 400 error message if bad or missing token.', () => {
		let soundMock = null;

		return soundMockFactory.create()
			.then(mock => {
				soundMock = mock;
				return superagent.get(`${apiURL}/sounds/${soundMock.sound._id}`)
					.set('Authorization', `Bearer badtokenyo`);
			})
			.then(Promise.reject)
			.catch(response => {
				expect(response.status).toEqual(401);
			});
	});
	});

	describe('DELETE routes', () => {
		test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
			let soundMock = null;

			return soundMockFactory.create()
				.then(mock => {
					soundMock = mock;
					console.log(soundMock.sound._id);
					console.log(soundMock.sound.url);
					return superagent.delete(`${apiURL}/sounds/${soundMock.sound._id}`)
					.set('Authorization', `Bearer ${soundMock.accountMock.token}`)
				})
				.then(response => {
					expect(response.status).toEqual(204);
				});
		});
		test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
			let soundMock = null;

			return soundMockFactory.create()
				.then(mock => {
					soundMock = mock;
					return superagent.delete(`${apiURL}/sounds/badID`)
						.set('Authorization', `Bearer ${soundMock.accountMock.token}`)
				})
				.then(Promise.reject)
				.catch(response => {
					expect(response.status).toEqual(404);
				});
		});
		test('DELETE - should respond with no body and a 204 status code if there is no error', () => {
			let soundMock = null;

			return soundMockFactory.create()
				.then(mock => {
					soundMock = mock;
					console.log(soundMock.sound._id);
					console.log(soundMock.sound.url);
					return superagent.delete(`${apiURL}/sounds/${soundMock.sound._id}`)
						.set('Authorization', `Bearer badtokenyah`)
				})
				.then(Promise.reject)
				.catch(response => {
					expect(response.status).toEqual(401);
				});
		});
	});
});
