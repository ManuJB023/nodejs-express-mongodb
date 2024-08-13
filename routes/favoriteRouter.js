const express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');

const favoriteRouter = express.Router();

// Handling requests for '/favorites' endpoint
favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    // GET request to retrieve user's favorite campsites
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorite.find({ user: req.user._id })
            .populate('user')
            .populate('campsites')
            .then(favorite => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
            .catch(err => next(err));
    })
    // POST request to add campsites to user's favorites
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    req.body.forEach(campsite => {
                        if (!favorite.campsites.includes(campsite._id)) {
                            favorite.campsites.push(campsite._id);
                        }
                    });
                    favorite.save()
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                } else {
                    Favorite.create({ user: req.user._id, campsites: req.body })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    // PUT request not supported
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end("PUT operation not supported on /favorites");
    })
    // DELETE request to delete user's favorite document
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOneAndDelete({ user: req.user._id })
            .then(response => {
                if (response) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(response);
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

// Handling requests for '/favorites/:campsiteId' endpoint
favoriteRouter.route('/:campsiteId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    // GET request not supported
    .get(cors.cors, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end('GET operation not supported on /favorites/:campsiteId');
    })
    // POST request to add campsites to user's favorites
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    if (!favorite.campsites.includes(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                        favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('That campsite is already in the list of favorites!');
                    }
                } else {
                    Favorite.create({ user: req.user._id, campsites: [req.params.campsiteId] })
                        .then(favorite => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch(err => next(err));
                }
            })
            .catch(err => next(err));
    })
    // PUT request not supported
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        res.end("PUT operation not supported on /favorites/:campsiteId");
    })
    // DELETE request to delete user's favorite document
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
            .then(favorite => {
                if (favorite) {
                    const index = favorite.campsites.indexOf(req.params.campsiteId);
                    if (index >= 0) {
                        favorite.campsites.splice(index, 1);
                        favorite.save()
                            .then(favorite => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(favorite);
                            })
                            .catch(err => next(err));
                    } else {
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/plain');
                        res.end('That campsite is not in your list of favorites!');
                    }
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/plain');
                    res.end('You do not have any favorites to delete.');
                }
            })
            .catch(err => next(err));
    });

module.exports = favoriteRouter;
