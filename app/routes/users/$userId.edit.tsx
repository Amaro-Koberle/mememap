import { useLoaderData, json } from 'remix';
import type { LoaderFunction, ActionFunction } from 'remix';
import MenuItem from '~/components/MenuItem';
import Button from '~/components/Button';
import type { User } from '@prisma/client';
import { auth } from '~/utils/services/auth.server';

import Header from '~/components/Header';
import ProfilePicture from '~/components/ProfilePicture';
import { MdOutlineEdit } from 'react-icons/md';

export const loader: LoaderFunction = async ({ request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	});
	return json(user);
};

export let action: ActionFunction = async ({ request }) => {
	await auth.logout(request, { redirectTo: '/' });
};

export default function EditProfileRoute() {
	const user = useLoaderData<User>();
	return (
		<div className='h-full relative'>
			<Header title='Edit profile' backButtonLink={`/users/${user.id}`} />
			<div className='mt-4 flex justify-center'>
				<div className='w-20 h-20 absolute rounded-full '>
					<div className='w-full h-full rounded-full bg-stone-900 opacity-40'></div>
					<div className='w-8 h-8 absolute rounded-full bottom-0'>
						<Button icon={<MdOutlineEdit />} className='rounded-full' />
						{/* <div className='bg-stone-300 w-full h-full absolute'></div> */}
					</div>
				</div>
				<ProfilePicture size='lg' />
			</div>
			<ul className='mt-4'>
				<MenuItem key='Name' name='name' description={user.name} to='name' />
				<MenuItem key='bio' name='Bio' to='bio' />
			</ul>
		</div>
	);
}
