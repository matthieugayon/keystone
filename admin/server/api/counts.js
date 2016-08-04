var keystone = require('../../../');
var async = require('async');

module.exports = function (req, res) {
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		getQuery(list, req.user, function (filter) {
			//console.log('filter', filter);
			let query = filter ?  list.model.find(filter) : list.model;
			query.count(function (err, count) {
				counts[list.key] = count;
				next(err);
			});
		});
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};

function getQuery(list, user, callback) {
	if (!user) return callback(null);
	if (list.schema.methods.getApiFilter) {
		list.schema.methods.getApiFilter(user, callback);
	} else {
		callback(null);
	}
}
