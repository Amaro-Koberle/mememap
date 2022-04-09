import type { LoaderFunction } from 'remix';
import { useLoaderData, json } from 'remix';
import { auth } from '../utils/services/auth.server';
import type { User } from '@prisma/client';

export let loader: LoaderFunction = async ({ request }) => {
	// If the user is here, it's already authenticated, if not redirect them to
	// the login page.
	let user = await auth.isAuthenticated(request, { failureRedirect: '/login' });
	return json({ user });
};

export default function Me() {
	let { user } = useLoaderData<{ user: User }>();
	return (
		<div>
			<h1>Welcome {user.name}</h1>
			<p>You are logged in as {user.email}</p>
		</div>
	);
}
