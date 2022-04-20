import { useLoaderData, Form, json } from 'remix';
import type { LoaderFunction, ActionFunction } from 'remix';
import MenuItem from '~/components/MenuItem';
import Button from '~/components/Button';
import type { User } from '@prisma/client';
import { auth } from '~/utils/services/auth.server';
import { MdOutlineLogout } from 'react-icons/md';
import Header from '~/components/Header';

export const loader: LoaderFunction = async ({ request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	});
	return json({ user });
};

export let action: ActionFunction = async ({ request }) => {
	await auth.logout(request, { redirectTo: '/' });
};

export default function SettingsIndexRoute() {
	const data = useLoaderData<{ user: User }>();
	return (
		<div className='h-full relative'>
			<Header title='Settings' />
			<ul className='mt-4'>
				<MenuItem
					key='email'
					name='Email'
					description={data.user.email}
					to='email'
				/>
				<MenuItem
					key='username'
					name='Username'
					description={`@${data.user.username}`}
					to='username'
				/>
				<MenuItem
					key='deleteAccount'
					name='Delete account'
					to='delete-account'
				/>
			</ul>
			<Form method='post' className='absolute bottom-0 inset-x-0'>
				<Button
					buttonName='Log out'
					className='mt-4 w-full'
					icon={<MdOutlineLogout />}
					type='submit'
					name='logout'
				/>
			</Form>
		</div>
	);
}
