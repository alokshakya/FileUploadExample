const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.find({user:req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, 
    (req, res, next) => {
    Favorites.find({user:req.user._id})
    .then((favorites) => {
        if (favorites != null) {
            //req.body.author = req.user._id;
            for (var i=0; i< req.body.dishes.length; i++){
                favorites.dishes.push(req.body.dishes[i]._id); 
            }
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);                
            }, (err) => next(err));
        }
        else {
            Favorites.create({user: req.user._id})
            .then((favorites) => {
                for (var i=0; i< req.body.dishes.length; i++){
                    favorites.dishes.push(req.body.dishes[i]._id); 
                }
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);                
                }, (err) => next(err));
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user:req.user._id})
    //Favorites.create({user: req.user._id})
    .then((favorites) => {
        if (favorites != null) {
            favorites.dishes.push(req.params.dishId); 
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);                
            }, (err) => next(err));
        }
        else {
            Favorites.create({user: req.user._id})
            .then((favorites) => {
                favorites.dishes.push(req.params.dishId); 
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);                
                }, (err) => next(err));
            })
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser,  (req, res, next) => {
    Favorites.find({user:req.user._id})
    .then((favorites) => {
        if(favorites==null){
            err = new Error('You have not stored any dish as favorite dish. First Add dish to favorites.\n Then you will be able to perform this operation');
            err.status = 404;
            return next(err);
        }
        else if (favorites != null) {
            if(favorites.dishes.dish(req.params.dishId)!=null){
                favorites.dishes.dish(req.params.dishId).remove(); 
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);                
                }, (err) => next(err));
            }
            else{
                err = new Error('Dish ' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error('You have not stored any dish as favorite dish. First Add dish to favorites.\n Then you will be able to perform this operation');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = favoriteRouter;