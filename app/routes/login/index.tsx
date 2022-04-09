import { Form, Link, useLoaderData, json } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import { MdOutlineForwardToInbox } from 'react-icons/md';
import { MdArrowBackIos } from 'react-icons/md';
import Button from '~/components/Button';
import Input from '~/components/Input';
import { auth } from '~/utils/services/auth.server';
import { sessionStorage } from '~/utils/services/session.server';

export const loader: LoaderFunction = async ({ request }) => {
	await auth.isAuthenticated(request, { successRedirect: '/me' });
	const session = await sessionStorage.getSession(
		request.headers.get('Cookie')
	);
	const error = session.get(auth.sessionErrorKey);
	if (error) return json({ error });
	// This session key `auth:magiclink` is the default one used by the EmailLinkStrategy
	// you can customize it passing a `sessionMagicLinkKey` when creating an
	// instance.
	if (session.has('auth:magiclink')) return json({ magicLinkSent: true });
	return json({ magicLinkSent: false });
};

export const action: ActionFunction = async ({ request }) => {
	// The success redirect is required in this action, this is where the user is
	// going to be redirected after the magic link is sent, note that here the
	// user is not yet authenticated, so you can't send it to a private page.
	await auth.authenticate('email-link', request, {
		successRedirect: '/login/email-sent',
		// If this is not set, any error will be throw and the ErrorBoundary will be
		// rendered.
		failureRedirect: '/login',
	});
};

export default function LoginIndexRoute() {
	const { magicLinkSent } = useLoaderData<{ magicLinkSent: boolean }>();
	const { error } = useLoaderData();
	return (
		<div>
			<header className='flex items-center justify-between text-xl mx-2'>
				<Link to='/nodes/'>
					<MdArrowBackIos />
				</Link>
				<h2>Login or create account</h2>
				<div className='w-4'></div>
			</header>
			<Form className='mt-4' method='post'>
				<Input label='Email' name='email' type='email' />
				<div></div>
				<Button
					className='mt-2 w-full'
					buttonName='Send link to log in'
					buttonDescription="Or to create an account if you don't have one"
					type='submit'
					icon={<MdOutlineForwardToInbox />}
					buttonType='emphasized'
				/>
			</Form>
			{magicLinkSent ? <span>Magic link sent</span> : null}
			{error ? <span>{error.message}</span> : null}
		</div>
	);
}
