'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Profile = require('../model/profile');
const httpErrors = require('http-errors'); 
const logger = require('../lib/logger');

const bearerAuthMiddleware = require('../lib/bearer-auth-middleware')

const profileRouter = module.exports = new Router();

profileRouter.post('/profiles', bearerAuthMiddleware, jsonParser, (request, response, next) => {
	if (!request.account) {
		return next(new httpErrors(404, '__ERROR__ Not found.'));
	};
	
	return new Profile({
		...request.body,
		account: request.account._id,
	}).save()
		.then(profile => response.json(profile))
		.catch(next);
});

profileRouter.get('/profiles/:id', bearerAuthMiddleware, (request, response, next) => {
	if(!request.account)
		return next(new httpErrors(404, '__ERROR__ profile not found'));
	return Profile.findById(request.params.id)
		.then(profile => {
			if(!profile) {
				throw new httpErrors(404, '__ERROR__ not found')
				logger.log('info', 'GET - responding with a 404 failure code at /profiles/:id - id not found')
			}
			logger.log('info', 'GET - responding with a 200 success code at /profiles/:id')
			return response.json(profile);
		})
		.catch(next);
});
