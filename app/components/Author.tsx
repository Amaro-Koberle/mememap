import { Link } from 'remix';
import type { User } from '@prisma/client';
import ProfilePicture from './ProfilePicture';

interface Props {
	author: User;
}

export default function Author({ author }: Props) {
	return (
		<Link to={`/users/${author.id}`} className='flex items-center gap-2'>
			<ProfilePicture />
			<div className='flex flex-col'>
				<span>{author.name}</span>
				<span className='text-sm text-stone-500'>{`@${author.username}`}</span>
			</div>
		</Link>
	);
}
