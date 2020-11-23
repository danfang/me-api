exports.handleError = function(err, res) {
  console.log(new Error().stack, err);
  res.status(500).json({ err: err });
  return false;
};
