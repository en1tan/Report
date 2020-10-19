exports.globalErrors = async (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl}`);
    // err.status = 'fail';
    // err.statusCode = 404;
    // next(err)
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl}`,
  });
};
