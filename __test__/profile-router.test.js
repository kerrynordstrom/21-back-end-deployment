'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const accountMockFactory = require('./lib/account-mock-factory');
const profileMockFactory = require('./lib/profile-mock-factory');

const apiURL = `http://localhost:${process.env.PORT}`;

describe('Profile routes', () => {
	beforeAll(server.start);
	afterAll(server.stop);
	afterEach(profileMockFactory.remove);

describe('POST /profiles', () => {
	test('Should respond with a 200 and a profile if there are no errors', () => {
		let accountMock = null; 

		return accountMockFactory.create()
			.then(mock => {
				accountMock = mock;
				return superagent.post(`${apiURL}/profiles`)
					.set('Authorization', `Bearer ${accountMock.token}`)
					.send({
						bio: 'I am a dog person',
						firstName: 'kAry',
						lastName: 'Nordstrom',
					});
			})
			.then(response => {
				expect(response.status).toEqual(200);
				expect(response.body.account).toEqual(accountMock.account._id.toString());
				expect(response.body.firstName).toEqual('kAry');
				expect(response.body.lastName).toEqual('Nordstrom');
				expect(response.body.bio).toEqual('I am a dog person');
			});
		});

	test('Should respond with a 400 error if a header is not set', () => {
		let accountMock = null;  

		return accountMockFactory.create()
			.then(mock => {
				accountMock = mock;
				return superagent.post(`${apiURL}/profiles`)
					.send({
						bio: 'I am dog person',
						firstName: 'kAry',
						lastName: 'Nordstrom',
					});
			})
			.then(Promise.reject)
			.catch(response => {
				expect(response.status).toEqual(400);
			});
		});

	test('Should respond with a 401 error if an incorrect token is passed', () => {
		let accountMock = null;

		return accountMockFactory.create()
			.then(mock => {
				accountMock = mock;
				return superagent.post(`${apiURL}/profiles`)
					.set('Authorization', `Bearer wrongtokenboyo`)
					.send({
						bio: 'I am dog person',
						firstName: 'kAry',	
						lastName: 'Nordstrom',
					});
			})
			.then(Promise.reject)
			.catch(response => {
				expect(response.status).toEqual(401);
			});
	});
	});

	describe('GET /profiles/:id', () => {
		test('Should respond with a 200 and a profile if there are no errors', () => {
			let profileMock = null; 

			return profileMockFactory.create()
				.then(mock => {

					profileMock = mock;
					return superagent.get(`${apiURL}/profiles/${profileMock.profile._id}`)
						.set('Authorization', `Bearer ${profileMock.accountMock.token}`);
				})
				.then(response => {
					expect(response.status).toEqual(200);
					expect(response.body.account).toEqual(profileMock.accountMock.account._id.toString());
					expect(response.body.firstName).toEqual(profileMock.profile.firstName);
					expect(response.body.lastName).toEqual(profileMock.profile.lastName);
					expect(response.body.avatar).toEqual(profileMock.profile.avatar);
				});
		});

		test('Should respond with a 404 error message if an incorrect id is passed.', () => {
			let profileMock = null;

			return profileMockFactory.create()
				.then(mock => {
					profileMock = mock;
					return superagent.get(`${apiURL}/profiles/123456`)
						.set('Authorization', `Bearer ${profileMock.accountMock.token}`);
				})
				.then(Promise.reject)
				.catch(response => {
					expect(response.status).toEqual(404);
				});
		});
		// test('Should respond with a 401 error message if an incorrect token is passed.', () => {
		// 	let profileMock = null;

		// 	return profileMockFactory.create()
		// 		.then(mock => {
		// 			console.log(mock);
		// 			profileMock = mock;
		// 			return superagent.get(`${apiURL}/${profileMock.profile._id}`)
		// 				.set('Authorization', `Bearer wrongtoken`);
		// 		})
		// 		.then(Promise.reject)
		// 		.catch(response => {
		// 			expect(response.status).toEqual(401);
		// 		});
		// });
	});
});