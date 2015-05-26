var handleError = function(err, res) {
	res.status(500).json({ err: err });
	return false;
};

exports.handleError = handleError;