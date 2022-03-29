import type { LoaderFunction, ActionFunction } from 'remix';
import { useLoaderData, useActionData, redirect, json, Link } from 'remix';
import NewLinkForm from '~/components/NewLinkForm';

import { MdArrowBackIos } from 'react-icons/md';

import type { Node } from '@prisma/client';
import { db } from '~/utils/db.server';

function validateNodeName(name: string) {
	if (name.length < 3) {
		return `That name is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
	};
	fields?: {
		name: string;
		sourceNodeId: string;
		targetNodeId: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name');
	const sourceNodeId = form.get('sourceNodeId');
	const targetNodeId = form.get('targetNodeId');
	if (
		typeof name !== 'string' ||
		typeof sourceNodeId !== 'string' ||
		typeof targetNodeId !== 'string'
	) {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}
	const fieldErrors = {
		name: validateNodeName(name),
	};

	const fields = { sourceNodeId, targetNodeId, name };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	await db.link.create({ data: fields });
	return redirect(`/nodes/${sourceNodeId}`);
};

type LoaderData = {
	sourceNode: Node | null;
	targetNode: Node | null;
	nodeListItems: Array<{ id: string; name: string }>;
};

export const loader: LoaderFunction = async ({ params }) => {
	const sourceNode = await db.node.findUnique({
		where: { id: params.sourceNodeId },
	});
	const targetNode = await db.node.findUnique({
		where: { id: params.targetNodeId },
	});
	const nodeListItems = await db.node.findMany({
		take: 5,
		select: { id: true, name: true },
		orderBy: { createdAt: 'desc' },
	});
	const data: LoaderData = { sourceNode, targetNode, nodeListItems };
	return json(data);
};

export default function NewLinkRoute() {
	const data = useLoaderData<LoaderData>();
	const actionData = useActionData<ActionData>();

	return (
		<div>
			{!data.targetNode && data.sourceNode ? (
				<div>
					<div>
						<Link to={`/nodes/${data.sourceNode?.id}`} className='text-xl'>
							<MdArrowBackIos />
						</Link>
						<p className='text-center text-sm text-stone-600'>{`Select target for a link from '${data.sourceNode.name}'.`}</p>
					</div>
					<ul>
						{data.nodeListItems.map((node) => (
							<li key={node.id}>
								<Link
									to={`/links/new/outgoing/${data.sourceNode?.id}/${node.id}`}>
									<p className='my-3'>{node.name}</p>
									<hr className='border-b border-stone-300' />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : data.targetNode && !data.sourceNode ? (
				<div>
					<div>
						<Link to={`/nodes/${data.targetNode.id}`} className='text-xl'>
							<MdArrowBackIos />
						</Link>
						<p className='text-center text-sm text-stone-600'>{`Select source for a link to '${data.targetNode.name}'.`}</p>
					</div>
					<ul>
						{data.nodeListItems.map((node) => (
							<li key={node.id}>
								<Link
									to={`/links/new/incoming/${node.id}/${data.targetNode?.id}`}>
									<p className='my-3'>{node.name}</p>
									<hr className='border-b border-stone-300' />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : (
				<NewLinkForm
					sourceNode={data.sourceNode}
					targetNode={data.targetNode}
					actionData={actionData}
				/>
			)}
		</div>
	);
}
