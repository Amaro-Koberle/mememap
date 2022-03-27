import type { ActionFunction, LoaderFunction } from 'remix';
import {
	useActionData,
	useLoaderData,
	useParams,
	json,
	Link,
	redirect,
} from 'remix';
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
	const params = useParams();
	const actionData = useActionData<ActionData>();
	const data = useLoaderData<LoaderData>();

	return (
		<div>
			{!data.targetNode && data.sourceNode ? (
				<div>
					<p>{`Create a link from '${data.sourceNode.name}'.`}</p>
					<ul>
						{data.nodeListItems.map((node) => (
							<li key={node.id}>
								<Link to={`/links/new/${params.sourceNodeId}/${node.id}`}>
									{node.name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : (
				<form method='post'>
					<div>
						<label>
							Link name
							<input
								type='text'
								name='name'
								defaultValue={actionData?.fields?.name}
								aria-invalid={
									Boolean(actionData?.fieldErrors?.name) || undefined
								}
								aria-errormessage={
									actionData?.fieldErrors?.name ? 'name-error' : undefined
								}
							/>
						</label>
						{actionData?.fieldErrors?.name ? (
							<p className='form-validation-error' role='alert' id='name-error'>
								{actionData.fieldErrors.name}
							</p>
						) : null}
					</div>
					<div>
						<input
							name='sourceNodeId'
							value={data.sourceNode?.id}
							type='hidden'
						/>
						<input
							name='targetNodeId'
							value={data.targetNode?.id}
							type='hidden'
						/>
					</div>
					<div>
						{actionData?.formError ? (
							<p className='form-validation-error' role='alert'>
								{actionData.formError}
							</p>
						) : null}
						<button type='submit'>Add</button>
					</div>
				</form>
			)}
		</div>
	);
}
