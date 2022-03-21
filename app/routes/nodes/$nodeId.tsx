import type { LoaderFunction } from 'remix';
import { json, Link, useLoaderData } from 'remix';
import type { Node } from '@prisma/client';
import type { Link as LinkPost } from '@prisma/client';

import { MdArrowBackIos } from 'react-icons/md';
import { MdOutlineArrowRightAlt } from 'react-icons/md';
import { MdMoreVert } from 'react-icons/md';

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
		<div className='mx-2'>
			<header className='flex items-center justify-between text-xl '>
				<Link to='/nodes' className=''>
					<MdArrowBackIos />
				</Link>
				<h2>{data.node.name}</h2>
				<div className='w-4'></div>
			</header>
			<main className='mt-4'>
				<div className='text-sm flex justify-between items-center'>
					<div className='flex gap-2'>
						<div className='w-10 h-10 rounded-full bg-stone-300'></div>
						<div className='flex flex-col'>
							<span>@username</span>
							<span className='text-stone-500'>Jan 12 • In 12 | Out 9</span>
						</div>
					</div>
					<div className='flex flex-nowrap gap-1'>
						<Link to={`/links/new/${data.node.id}/targetNodeId`}>
							<button className='rounded-xl bg-stone-300 py-2 px-4 flex flex-nowrap'>
								<MdOutlineArrowRightAlt className='text-xl' />
								<p>Link</p>
							</button>
						</Link>

						<button className='rounded-xl bg-stone-300 p-2 text-xl'>
							<MdMoreVert />
						</button>
					</div>
				</div>
				<p className='mt-4 mx-2'>{data.node.content}</p>
				<ul className='mt-4'>
					{data.outLinks.map((link) => (
						<li key={link.id}>
							<Link to={`/nodes/${link.targetNodeId}`}>
								<button className='rounded-xl bg-stone-300 py-3 mt-2 w-full'>
									{link.name}
								</button>
							</Link>
						</li>
					))}
				</ul>
			</main>
		</div>
	);
}
