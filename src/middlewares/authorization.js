import jwt from "jsonwebtoken";
export const authenticateJwt = (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decodedJwt = jwt.verify(token, process.env.TOKEN_KEY);
    res.locals.user = decodedJwt;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized");
  }
};
