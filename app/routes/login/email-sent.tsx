import { Link } from 'react-router-dom';
import Button from '~/components/Button';
import Header from '~/components/Header';

export default function EmailSentRoute() {
	const email = 'dummy.address@email.com';
	return (
		<div className='h-full relative'>
			<Header backButtonLink='/login' title='Email sent' />
			<div className='flex flex-col items-center'>
				<div className='w-80 flex flex-col items-center'>
					<h1 className='w-60 text-6xl text-center font-serif font-bold mt-40'>
						Seeya in a bit.
					</h1>
					<div className='mt-3 italic text-center text-2xl'>
						<h2>I sent an email to</h2>
						<h2>{email}</h2>
					</div>

					<p className='mt-6'>
						{' '}
						To log in or sign up, check your email and follow the link we sent
						you. The link should open a new tab, so you can close this page.
					</p>
				</div>
				<div className='flex flex-col w-full gap-3 mt-3 absolute bottom-0'>
					<Link to='/'>
						<Button
							buttonDescription='Go to explore nodes'
							buttonName='Home'
							className='w-full'
						/>
					</Link>
					<Link to='/login/'>
						<Button
							buttonStyle='emphasized'
							buttonDescription='send a login link to another address'
							buttonName='Wrong email?'
							className='w-full'
						/>
					</Link>
				</div>
			</div>
		</div>
	);
}
