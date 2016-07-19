import React from 'react';
import _ from 'lodash';

import { plural } from '../../../../utils/string';
import ListTile from './ListTile';

class Lists extends React.Component {
	render () {

		let hasListReadPermissions = {};
		let hasReadPermissionsForSomeLists = false;

		console.log('this.props', this.props);

		this.props.lists.map((list) => {
			hasListReadPermissions[list.key] = this.props.user.roles.filter((n) => {
					return this.props.permissions[list.key].roles.read.indexOf(n) != -1;
			}).length > 0;
			hasReadPermissionsForSomeLists = hasReadPermissionsForSomeLists ? hasReadPermissionsForSomeLists : hasListReadPermissions[list.key];
		});
		if (!hasReadPermissionsForSomeLists) return;

		return (
			<div className="dashboard-group__lists">
				{_.map(this.props.lists, (list, key) => {
					// If an object is passed in the key is the index,
					// if an array is passed in the key is at list.key
					const listKey = list.key || key;
					var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;

					var hasListReadPermissions = this.props.user.roles.filter((n) => {
						return this.props.permissions[list.key].roles.read.indexOf(n) != -1;
					});

					if (hasListReadPermissions.length > 0) {
						var href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
						return (
							<ListTile
								key={list.path}
								path={list.path}
								label={list.label}
								href={href}
								count={plural(this.props.counts[listKey], '* Item', '* Items')}
								spinner={this.props.spinner}
								listkey = {listKey}
								user={this.props.user}
								permissions={this.props.permissions}
							/>
						);
					}
				})}
			</div>
		);
	}
}

Lists.propTypes = {
	counts: React.PropTypes.object.isRequired,
	lists: React.PropTypes.oneOfType([
		React.PropTypes.array,
		React.PropTypes.object,
	]).isRequired,
	spinner: React.PropTypes.node,
};

export default Lists;
