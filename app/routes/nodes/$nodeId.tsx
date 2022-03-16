import type { LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import type { Node } from '@prisma/client';

import { db } from '~/utils/db.server';

type LoaderData = { node: Node };

export const loader: LoaderFunction = async ({ params }) => {
	const node = await db.node.findUnique({
		where: { id: params.nodeId },
	});
	if (!node) throw new Error('Node not found');
	const data: LoaderData = { node };
	return json(data);
};

export default function NodeRoute() {
	const data = useLoaderData<LoaderData>();
	return (
		<div>
			<p>{data.node.name}</p>
			<p>{data.node.content}</p>
		</div>
	);
}
