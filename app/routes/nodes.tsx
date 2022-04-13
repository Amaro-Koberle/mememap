import MainNavigation from '../components/MainNavigation';
import { Outlet } from 'remix';

export default function NodesRoute() {
	return (
		<>
			<Outlet />
			<MainNavigation />
		</>
	);
}
