import MainNavigation from '../components/MainNavigation';
import type { LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import { Outlet } from 'remix';
import type { User } from '@prisma/client';
import { auth } from '../utils/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	});
	return json(user);
};

export default function SettingsRoute() {
	const user = useLoaderData<User>();
	return (
		<>
			<Outlet />
			<MainNavigation userId={user.id} />
		</>
	);
}
