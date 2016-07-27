var keystone = require('../../../');
var async = require('async');

module.exports = function (req, res) {
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		let query = getQuery(list, req.user) || list.model;
		query.count(function (err, count) {
			counts[list.key] = count;
			next(err);
		});
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};

function getQuery(list, user) {
	if (!user) return null;
	if (list.schema.methods.getApiFilter) {
		var filter = list.schema.methods.getApiFilter(user);
		return list.model.find(filter);;
	}
	return null;
}
