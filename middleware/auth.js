module.exports = function auth(req, res, next) {
  const isAdmin = req.body.admin;
  if (!isAdmin)
    return res.status(401).send({ message: "Only admin user can get access" });

  next();
};
