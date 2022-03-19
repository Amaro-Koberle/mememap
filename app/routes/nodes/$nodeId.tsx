import type { LoaderFunction } from 'remix';
import { json, Link, useLoaderData } from 'remix';
import type { Node } from '@prisma/client';
import type { Link as LinkPost } from '@prisma/client';

import { db } from '~/utils/db.server';

type LoaderData = { node: Node; outLinks: LinkPost[] };

export const loader: LoaderFunction = async ({ params }) => {
	const node = await db.node.findUnique({
		where: { id: params.nodeId },
	});
	if (!node) throw new Error('Node not found');
	const outLinks = await db.link.findMany({
		where: { sourceNodeId: params.nodeId },
	});
	const data: LoaderData = { node, outLinks };
	return json(data);
};

export default function NodeRoute() {
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<p>{data.node.name}</p>
			<p>{data.node.content}</p>
			<p>---------</p>
			<ul>
				{data.outLinks.map((link) => (
					<li key={link.id}>
						<Link to={`/nodes/${link.targetNodeId}`}>{link.name}</Link>
					</li>
				))}
			</ul>
			<p>---------</p>
			<Link to='/links/new'>Link</Link>
		</div>
	);
}
