import express from "express";
export const adminMiddleware = (req, res, next) => {
  if (res.locals.user.rol && res.locals.user.rol === "ADMIN") {
    next();
  } else {
    res.status(403).send("No tienes acceso a este recurso");
  }
};
