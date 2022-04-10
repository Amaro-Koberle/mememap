import { useState } from 'react';
import type { LoaderFunction } from 'remix';
import { Link, useLoaderData, ActionFunction, json, redirect } from 'remix';
import dayjs from 'dayjs';
import CreateLinkModal from '~/components/modals/CreateLinkModal';
import DeleteNodeModal from '~/components/modals/DeleteNodeModal';
import LinkDetailsModal from '~/components/modals/LinkDetailsModal';
import OutLinkList from '~/components/OutLinkList';
import { MdOutlineEast } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { db } from '~/utils/db.server';
import type { Node } from '@prisma/client';
import type { Link as NodeLink } from '@prisma/client';
import Button from '~/components/Button';
import Header from '~/components/Header';

type LoaderData = { node: Node; outLinks: NodeLink[] };

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

type ActionData = {
	formError?: string;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const nodeId = form.get('nodeId');
	if (typeof nodeId !== 'string') {
		return badRequest({
			formError: `Node deletion failed.`,
		});
	}

	await db.node.delete({ where: { id: nodeId } });
	return redirect(`/nodes/`);
};

export default function NodeRoute() {
	const data = useLoaderData<LoaderData>();

	const [displayedLink, setLDisplayedLink] = useState<NodeLink | null>(null);
	const [linkDetailsModalIsOpen, setLinkDetailsModalIsOpen] = useState(false);
	const [createLinkModalIsOpen, setCreateLinkModalIsOpen] = useState(false);
	const [deleteNodeModalIsOpen, setDeleteNodeModalIsOpen] = useState(false);

	const postDate = dayjs(data.node.createdAt).format('h:m A • MMM D, YYYY');

	const summonLinkDetailsModal = (link: NodeLink): void => {
		setLDisplayedLink(link);
		setLinkDetailsModalIsOpen(true);
	};

	return (
		<div className='h-full relative'>
			{displayedLink ? (
				<LinkDetailsModal
					link={displayedLink}
					isOpen={linkDetailsModalIsOpen}
					setIsOpen={setLinkDetailsModalIsOpen}
				/>
			) : null}
			<CreateLinkModal
				isOpen={createLinkModalIsOpen}
				setIsOpen={setCreateLinkModalIsOpen}
				nodeId={data.node.id}
			/>
			<DeleteNodeModal
				isOpen={deleteNodeModalIsOpen}
				setIsOpen={setDeleteNodeModalIsOpen}
				nodeId={data.node.id}
			/>
			<Header title={data.node.name} backButtonLink='/nodes' />
			<div className='h-full mt-2'>
				<div className='flex justify-between items-center'>
					<div className='flex items-center gap-2'>
						<div className='w-10 h-10 rounded-full border border-stone-900 bg-stone-300 flex justify-center items-center text-5xl'>
							<MdOutlineAccountCircle className='text-stone-400' />
						</div>
						<div className='flex flex-col'>
							<span>User Name</span>
							<span className='text-sm text-stone-500'>@username</span>
						</div>
					</div>
					<div className='flex flex-nowrap gap-1 h-10 items-center'>
						<Button
							icon={<MdOutlineEast />}
							thin={true}
							buttonName='Link'
							onClick={() => {
								setCreateLinkModalIsOpen(true);
							}}
						/>
						<Link to={`/nodes/${data.node.id}/edit`}>
							<Button icon={<MdOutlineEdit />} />
						</Link>
						<Button
							icon={<MdDeleteOutline />}
							onClick={() => {
								setDeleteNodeModalIsOpen(true);
							}}
						/>
					</div>
				</div>
				<p className='mt-4'>{data.node.content}</p>
				<div className='absolute bottom-0 inset-x-0'>
					<OutLinkList
						summonLinkDetailsModal={summonLinkDetailsModal}
						outLinks={data.outLinks}
					/>
					<div className='text-stone-500 text-sm flex justify-between mt-2'>
						<span>{postDate}</span>
						<span>{`In 12 • Out ${data.outLinks.length}`}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
