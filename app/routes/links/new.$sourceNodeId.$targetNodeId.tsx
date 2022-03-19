import type { ActionFunction } from 'remix';
import { useActionData, json } from 'remix';

//import { db } from '~/utils/db.server';

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
	};
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
	const form = await request.formData();
	const name = form.get('name');
	if (typeof name !== 'string') {
		return badRequest({
			formError: `Form not submitted correctly.`,
		});
	}

	const fieldErrors = {
		name: validateNodeName(name),
	};

	const fields = { name };
	if (Object.values(fieldErrors).some(Boolean)) {
		return badRequest({ fieldErrors, fields });
	}

	// TODO: Create link and redirect to last node in the user's history
};

export default function NewLinkRoute() {
	const actionData = useActionData<ActionData>();
	return (
		<div>
			<form method='post'>
				<div>
					<label>
						Link name{' '}
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
