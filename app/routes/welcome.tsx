import type { LoaderFunction } from 'remix';
import { Link, useLoaderData, json } from 'remix';
import type { User } from '@prisma/client';
import { auth } from '../utils/services/auth.server';
import Header from '~/components/Header';
import Button from '~/components/Button';

export const loader: LoaderFunction = async ({ request }) => {
	const user = await auth.isAuthenticated(request, {
		failureRedirect: '/login',
	});
	return json(user);
};

export default function Welcome() {
	const user = useLoaderData<User>();
	return (
		<div className='h-full relative'>
			<Header backButtonLink='/login' title='Welcome back' />

			<div className='flex flex-col items-center'>
				<div className='w-80 flex flex-col items-center'>
					<h1 className='w-60 text-6xl text-center font-serif font-bold mt-40'>
						{`Hi, ${user.name}.`}
					</h1>
					<div className='mt-3  italic text-center text-2xl'>
						<h2>You are loged in as</h2>
						<h2>{`@${user.username}`}</h2>
					</div>
				</div>
				<div className='flex flex-col w-full gap-3 mt-3 absolute bottom-0'>
					<Link to='/'>
						<Button
							buttonDescription='Go to explore nodes'
							buttonName='Home'
							className='w-full'
						/>
					</Link>
				</div>
			</div>
		</div>
	);
}
