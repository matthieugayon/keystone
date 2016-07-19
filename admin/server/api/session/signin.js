var utils = require('keystone-utils');
var keystone = require('../../../../');
var session = require('../../../../lib/session');
var acl = require('../../../../lib/acl');

function signin (req, res) {
	if (!keystone.security.csrf.validate(req)) {
		return res.apiError(403, 'invalid csrf');
	}
	if (!req.body.email || !req.body.password) {
		return res.status(401).json({ error: 'email and password required' });
	}
	var User = keystone.list(keystone.get('user model'));
	var emailRegExp = new RegExp('^' + utils.escapeRegExp(req.body.email) + '$', 'i');
	User.model.findOne({ email: emailRegExp }).exec(function (err, user) {
		if (user) {
			keystone.callHook(user, 'pre:signin', function (err) {
				if (err) return res.json({ error: 'pre:signin error', detail: err });
				user._.password.compare(req.body.password, function (err, isMatch) {
					if (isMatch) {
						session.signinWithUser(user, req, res, function () {
							keystone.callHook(user, 'post:signin', function (err) {
								if (err) return res.json({ error: 'post:signin error', detail: err });

								// get permissions
								acl.getListPermissions()
									.then((permissions) => {
										keystone.permissions = permissions;
										res.json({ success: true, user: user });
									})
									.catch((err) => {
										console.log('second post:signin error', err);
										if (err) return res.json({ error: 'post:signin error', detail: err });
									});
							});
						});
					} else if (err) {
						return res.status(500).json({ error: 'bcrypt error', detail: err });
					} else {
						return res.json({ error: 'invalid details' });
					}
				});
			});
		} else if (err) {
			return res.status(500).json({ error: 'database error', detail: err });
		} else {
			return res.json({ error: 'invalid details' });
		}
	});
}

module.exports = signin;
