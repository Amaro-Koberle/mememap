import MainNavigation from '../components/MainNavigation';

import { Outlet } from 'remix';

export default function SettingsRoute() {
	return (
		<>
			<Outlet />
			<MainNavigation />
		</>
	);
}
