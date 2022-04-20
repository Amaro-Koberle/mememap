import type { LoaderFunction } from 'remix';
import { json, useLoaderData } from 'remix';
import NodeList from '~/components/NodeList';
import { db } from '~/utils/db.server';

type LoaderData = {
	nodeListItems: Array<{
		id: string;
		name: string;
		createdAt: Date;
		author: { username: string };
		_count: { inLinks: number; outLinks: number };
	}>;
};

export const loader: LoaderFunction = async () => {
	const data: LoaderData = {
		nodeListItems: await db.node.findMany({
			take: 50,
			select: {
				id: true,
				name: true,
				createdAt: true,
				author: { select: { username: true } },
				_count: { select: { inLinks: true, outLinks: true } },
			},
			orderBy: { createdAt: 'desc' },
		}),
	};
	return json(data);
};

export default function NodesIndexRoute() {
	const data = useLoaderData<LoaderData>();

	return (
		<div className='h-full relative'>
			<NodeList nodeListItems={data.nodeListItems} />
		</div>
	);
}
