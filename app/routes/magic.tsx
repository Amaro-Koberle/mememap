import { LoaderFunction } from 'remix';
import { auth } from '~/utils/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
	await auth.authenticate('email-link', request, {
		// If the user was authenticated, we redirect them to their profile page
		// This redirect is optional, if not defined the user will be returned by
		// the `authenticate` function and you can render something on this page
		// manually redirect the user.
		successRedirect: '/me',
		// If something failed we take them back to the login page
		// This redirect is optional, if not defined any error will be thrown and
		// the ErrorBoundary will be rendered.
		failureRedirect: '/login',
	});
};
