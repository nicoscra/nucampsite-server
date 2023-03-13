const express = require("express");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const Campsite = require("../models/campsite");
const { Error } = require("mongoose");
const favoriteRouter = express.Router();

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate("user")
      .populate("campsites")
      .then((favorites) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorites);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          console.log(favorite.campsites);
          req.body.forEach((campsite) => {
            if (!favorite.campsites.includes(campsite._id)) {
              favorite.campsites.push(campsite._id);
            }
            favorite.save().then((favorite) => {
              res.statuscode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
          });
        } else {
          Favorite.create({ user: req.user._id, campsites: req.body }).then(
            (favorite) => {
              res.statuscode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
              favorite.save().then((favorite) => {
                res.statuscode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              });
            }
          );
        }
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /favorites");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOneAndDelete()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

favoriteRouter
  .route("/:campsiteId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(
    cors.cors,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("GET operation not supported on /favorites");
    }
  )
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findById(req.params.favorites)
        .then((favorite) => {
          if (favorite && !favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite.save().then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
          } else if (favorite) {
            err = new Error("Campsite already exists in this favorite!");
            err.status = 400;
            return next(err);
          } else {
            err = new Error(`Favorite ${req.params.favorites} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /favorites/${req.params.favorites}/${req.params.campsiteId}`
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Favorite.findOne(req.params.favorites)
        .then((favorite) => {
          if (favorite && favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites = favorite.campsites.filter(
              (campsite) => campsite._id.toString() !== req.params.campsiteId
            );
            favorite.save().then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            });
          } else if (
            favorite &&
            !favorite.campsites.includes(req.params.campsiteId)
          ) {
            err = new Error("Campsite not found in this favorite!");
            err.status = 404;
            return next(err);
          } else {
            err = new Error(`Favorite ${req.params.favorites} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

module.exports = favoriteRouter;
