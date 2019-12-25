export default async (req, res, next) => {
  const isAdmin = req.userAdmin;

  if (!isAdmin) {
    return res
      .status(401)
      .json({ error: "You're not authorized to complete this action" });
  }

  return next();
};
