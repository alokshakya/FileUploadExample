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
    Favorites.findOne({user:req.user._id})
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
    Favorites.findOne({user:req.user._id})
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
            console.log('creating document for user not exists before ');
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
    Favorites.remove({user:req.user._id})
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
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
    Favorites.findOne({user:req.user._id})
    //Favorites.create({user: req.user._id})
    .then((favorites) => {
        console.log('favorites/dishId Post ',favorites);
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
            console.log('creating new schema')
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
    Favorites.findOne({user:req.user._id})
    .then((favorites) => {
        if (favorites != null) {
            console.log('inside delete/dishId favourites!=null '+ favorites);
            console.log('inside delete/dishId favourites!=null =>  favorites.dishes '+ favorites.dishes);
            var index=-1;
            for( var i=0; i<favorites.dishes.length; i++){
                if(favorites.dishes[i]== req.params.dishId){
                    index=i;
                    i=favorites.dishes.length;
                }
            }
            if(index!=-1){
                favorites.dishes.remove(req.params.dishId); 
                favorites.save()
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);                
                }, (err) => next(err));
            }
            else{
                err = new Error('Dish Id ' + req.params.dishId + ' not found');
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