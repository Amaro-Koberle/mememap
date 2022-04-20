import type { LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import MainNavigation from '../components/MainNavigation';
import { Outlet } from 'remix';
import type { User } from '@prisma/client';
import { auth } from '../utils/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	});
	return json(user);
};

export default function NodesRoute() {
	const user = useLoaderData<User>();

	return (
		<>
			<Outlet />
			<MainNavigation userId={user.id} />
		</>
	);
}
