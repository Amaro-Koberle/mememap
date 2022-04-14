import { Link } from 'remix';
import PostDate from './PostDate';

interface Props {
	nodeListItems: Array<{
		id: string;
		name: string;
		createdAt: Date;
		author: { username: string };
		_count: { inLinks: number; outLinks: number };
	}>;
}

export default function NodeList({ nodeListItems }: Props) {
	return (
		<ul>
			{nodeListItems.map((node) => (
				<li key={node.id}>
					<Link to={node.id}>
						<div className='my-2'>
							<p>{node.name}</p>
							<span className='text-sm text-stone-500'>
								{`@${node.author.username} • `}
								<PostDate createdAt={node.createdAt} />
								{` • In ${node._count.inLinks} | Out ${node._count.outLinks}`}
							</span>
						</div>
						<hr className='border-b border-stone-300' />
					</Link>
				</li>
			))}
		</ul>
	);
}
