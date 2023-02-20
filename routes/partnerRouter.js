const express = require("express");
const partnerRouter = express.Router();

partnerRouter
  .route("/")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })

  .get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end("Post operation not supported on /partners");
  })

  .put((req, res) => {
    res.write(`Updating the partners: ${req.params.partnerId} to you`);
  })

  .delete((req, res) => {
    res.end("Deleting all partners");
  });

partnerRouter
  .route("/:partnerId")

  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })

  .get((req, res) => {
    res.end(`Will send details of the partner: ${req.params.partnerId} to you`);
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /partners");
  })

  .put((req, res) => {
    res.write(`Updating the partner: ${req.params.partnerId}\n`);
    res.end(`Will update the partner: ${req.body.name}
    with description: ${req.body.description}`);
  })

  .delete((req, res) => {
    res.end(`Deleting partner: ${req.params.partnerId}`);
  });

module.exports = partnerRouter;
