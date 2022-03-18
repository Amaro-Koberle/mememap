import type { ActionFunction } from 'remix';
import { useActionData, redirect, json } from 'remix';

import { db } from '~/utils/db.server';

function validateNodeContent(content: string) {
	if (content.length < 10) {
		return `That content is too short`;
	}
}

function validateNodeName(name: string) {
	if (name.length < 3) {
		return `That name is too short`;
	}
}

type ActionData = {
	formError?: string;
	fieldErrors?: {
		name: string | undefined;
		content: string | undefined;
	};
	fields?: {
		name: string;
		content: string;
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name');
	const content = form.get('content');
	if (typeof name !== 'string' || typeof content !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fieldErrors = {
		name: validateNodeName(name),
		content: validateNodeContent(content),
	};

	const fields = { name, content };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	const node = await db.node.create({ data: fields });
	return redirect(`/nodes/${node.id}`);
};

export default function NewNodeRoute() {
	const actionData = useActionData<ActionData>();
	return (
		<div>
			<form method='post'>
				<div>
					<label>
						Node name{' '}
						<input
							type='text'
							name='name'
							defaultValue={actionData?.fields?.name}
							aria-invalid={Boolean(actionData?.fieldErrors?.name) || undefined}
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
					<label>
						Content{' '}
						<textarea
							name='content'
							defaultValue={actionData?.fields?.content}
							aria-invalid={
								Boolean(actionData?.fieldErrors?.content) || undefined
							}
							aria-errormessage={
								actionData?.fieldErrors?.content ? 'content-error' : undefined
							}
						/>
					</label>
					{actionData?.fieldErrors?.content ? (
						<p
							className='form-validation-error'
							role='alert'
							id='content-error'>
							{actionData.fieldErrors.content}
						</p>
					) : null}
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
		</div>
	);
}
