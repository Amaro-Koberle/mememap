import { Link } from 'remix';

interface Props {
	nodeListItems: Array<{ id: string; name: string }>;
}

export default function NodeList({ nodeListItems }: Props) {
	return (
		<ul>
			{nodeListItems.map((node) => (
				<li key={node.id}>
					<Link to={node.id}>
						<p className='my-3'>{node.name}</p>
						<hr className='border-b border-stone-300' />
					</Link>
				</li>
			))}
		</ul>
	);
}
