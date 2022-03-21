import type { LoaderFunction } from 'remix';
import { json, Link, useLoaderData } from 'remix';

import { db } from '~/utils/db.server';

type LoaderData = {
	nodeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async () => {
	const data: LoaderData = {
		nodeListItems: await db.node.findMany({
			take: 5,
			select: { id: true, name: true },
			orderBy: { createdAt: 'desc' },
		}),
	};
	return json(data);
};

export default function NodesIndexRoute() {
	const data = useLoaderData<LoaderData>();

	return (
		<div>
			<ul>
				{data.nodeListItems.map((node) => (
					<li key={node.id}>
						<Link to={node.id}>
							<p className='my-3'>{node.name}</p>
							<hr className='border-b border-stone-300' />
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
