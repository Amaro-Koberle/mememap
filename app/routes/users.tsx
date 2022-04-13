import MainNavigation from '../components/MainNavigation';

import { Outlet } from 'remix';

export default function UsersRoute() {
	return (
		<>
			<Outlet />
			<MainNavigation />
		</>
	);
}
