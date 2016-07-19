/**
 * The App component is the component that is rendered around all views, and
 * contains common things like navigation, footer, etc.
 */

import React from 'react';

import MobileNavigation from './components/Navigation/Mobile';
import PrimaryNavigation from './components/Navigation/Primary';
import SecondaryNavigation from './components/Navigation/Secondary';
import Footer from './components/Footer';

const App = (props) => {
	const listsByPath = require('../utils/lists').listsByPath;
	// If we're on either a list or an item view
	let currentList, currentSection;
	if (props.params.listId) {
		currentList = listsByPath[props.params.listId];
		// Get the current section we're in for the navigation
		currentSection = Keystone.nav.by.list[currentList.key];
	}
	// Default current section key to dashboard
	const currentSectionKey = (currentSection && currentSection.key) || 'dashboard';

	props.user = Keystone.user;
	props.permissions = Keystone.permissions;

	return (
		<div className="keystone-wrapper">
			<header className="keystone-header">
				<MobileNavigation
					brand={Keystone.brand}
					currentListKey={props.params.listId}
					currentSectionKey={currentSectionKey}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
					user={Keystone.user}
					permissions={Keystone.permissions}
				/>
				<PrimaryNavigation
					currentSectionKey={currentSectionKey}
					brand={Keystone.brand}
					sections={Keystone.nav.sections}
					signoutUrl={Keystone.signoutUrl}
					user={Keystone.user}
					permissions={Keystone.permissions}
				/>
				{/* If a section is open currently, show the secondary nav */}
				{(currentSection) ? (
					<SecondaryNavigation
						currentListKey={props.params.listId}
						lists={currentSection.lists}
						user={Keystone.user}
						permissions={Keystone.permissions}
					/>
				) : null}
			</header>
			<div className="keystone-body">
				{props.children}
			</div>
			<Footer
				appversion={Keystone.appversion}
				backUrl={Keystone.backUrl}
				brand={Keystone.brand}
				User={Keystone.User}
				user={Keystone.user}
				permissions={Keystone.permissions}
				version={Keystone.version}
			/>
		</div>
	);
};

module.exports = App;
