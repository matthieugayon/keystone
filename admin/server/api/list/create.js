var assign = require('object-assign');
var keystone = require('../../../../');
var async = require('async');

module.exports = function (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}

	var item = new req.list.model();
	var data = assign({}, req.body, req.files);

	if (req.list.schema.methods.contextualizer) {
		req.list.schema.methods.contextualizer(req);
	}

	async.series([
		function(cb) {
			if (req.list.schema.methods.asyncContextualizer) {
				req.list.schema.methods.asyncContextualizer(req, cb);
			} else {
				cb();
			}
		}],
		function(error) {
			req.list.validateInput(item, data, function (err) {
				if (err) return res.status(400).json(err);
				req.list.updateItem(item, data, function (err) {
					if (err) return res.status(500).json(err);
					res.json(req.list.getData(item));
				});
			});
		});
};
