import { useState } from 'react';
import { LoaderFunction, ActionFunction, useActionData } from 'remix';
import { Link, useLoaderData, json, redirect } from 'remix';
import CreateLinkModal from '~/components/modals/CreateLinkModal';
import DeleteNodeModal from '~/components/modals/DeleteNodeModal';
import LinkDetailsModal from '~/components/modals/LinkDetailsModal';
import OutLinkList from '~/components/OutLinkList';
import { MdOutlineEast } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';
import { MdDeleteOutline } from 'react-icons/md';
import { db } from '~/utils/db.server';
import type { Node, User, Link as NodeLink } from '@prisma/client';
import Button from '~/components/Button';
import Header from '~/components/Header';
import Author from '~/components/Author';
import NodeStats from '~/components/NodeStats';

type LoaderData = {
	node: Node;
	inLinks: NodeLink[];
	outLinks: NodeLink[];
	nodeAuthor: User;
};

export const loader: LoaderFunction = async ({ params }) => {
	const node = await db.node.findUnique({
		where: { id: params.nodeId },
	});
	if (!node) throw new Error('Node not found.');
	const outLinks = await db.link.findMany({
		where: { sourceNodeId: params.nodeId },
	});
	if (!outLinks) throw new Error('Outgoing links not found.');
	const inLinks = await db.link.findMany({
		where: { targetNodeId: params.nodeId },
	});
	if (!inLinks) throw new Error('Incoming links not found.');
	const nodeAuthor = await db.user.findUnique({ where: { id: node.authorId } });
	if (!nodeAuthor) throw new Error('Node author not found.');
	const data: LoaderData = { node, inLinks, outLinks, nodeAuthor };
	return json(data);
};

type ActionData = {
	formError?: string;
	link?: NodeLink;
	linkAuthor?: User;
};

const badRequest = (data: ActionData) => json(data.formError, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const { _action } = Object.fromEntries(form);
	if (_action === 'deleteNode') {
		const nodeId = form.get('nodeId');
		if (typeof nodeId !== 'string') {
			return badRequest({
				formError: 'Invalid node id.',
			});
		}
		await db.node.delete({ where: { id: nodeId } });
		return redirect(`/nodes/`);
	}
	if (_action === 'showLinkDetails') {
		const linkId = form.get('linkId');
		if (typeof linkId !== 'string') {
			return badRequest({
				formError: 'Invalid link id.',
			});
		}
		const link = await db.link.findUnique({ where: { id: linkId } });
		if (!link) throw new Error('Link not found');
		const linkAuthor = await db.user.findUnique({
			where: { id: link.authorId },
		});
		if (!linkAuthor) throw new Error('Link author not found');
		const actionData: ActionData = { link, linkAuthor };
		return json(actionData);
	}
	return null;
};

export default function NodeRoute() {
	const data = useLoaderData<LoaderData>();
	const actionData = useActionData<ActionData>();

	const [displayedLink, setLDisplayedLink] = useState<NodeLink | null>(null);
	const [displayedLinkAuthor, setLDisplayedLinkAuthor] = useState<User | null>(
		null
	);
	const [linkDetailsModalIsOpen, setLinkDetailsModalIsOpen] = useState(false);
	const [createLinkModalIsOpen, setCreateLinkModalIsOpen] = useState(false);
	const [deleteNodeModalIsOpen, setDeleteNodeModalIsOpen] = useState(false);

	const summonLinkDetailsModal = () => {
		if (actionData?.link && actionData?.linkAuthor) {
			setLDisplayedLink(actionData.link);
			setLDisplayedLinkAuthor(actionData.linkAuthor);
			setLinkDetailsModalIsOpen(true);
		}
	};

	return (
		<div className='h-full relative'>
			{displayedLink && displayedLinkAuthor ? (
				<LinkDetailsModal
					link={displayedLink}
					linkAuthor={displayedLinkAuthor}
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
					<Author author={data.nodeAuthor} />
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
					<NodeStats
						node={data.node}
						inLinks={data.inLinks}
						outLinks={data.outLinks}
					/>
				</div>
			</div>
		</div>
	);
}
