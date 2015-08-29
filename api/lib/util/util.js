exports.handleError = function(err, res) {
	console.log(new Error().stack);
	res.status(500).json({ err: err });
	return false;
};
