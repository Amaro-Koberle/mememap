import type { LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import NodeList from '~/components/NodeList';
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
			<NodeList nodeListItems={data.nodeListItems} />
		</div>
	);
}
