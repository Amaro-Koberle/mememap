interface Props extends React.ComponentPropsWithoutRef<'input'> {
	label: string;
	inputType?: 'textarea';
	position?: 'top' | 'bottom';
	actionDataField?: string;
	actionDataFieldError?: string;
}

export default function Input({
	inputType,
	label,
	className,
	position,
	actionDataField,
	actionDataFieldError,
	type,
	name,
}: Props) {
	return (
		<div className={className}>
			<label
				className={`${
					position === 'top'
						? 'rounded-t-xl border'
						: position === 'bottom'
						? 'rounded-b-xl border-x border-b'
						: 'rounded-xl border'
				} border-stone-600 flex flex-col p-2`}>
				<span className='text-sm text-stone-600'>{label}</span>
				{inputType === 'textarea' ? (
					<textarea
						className='bg-stone-200 h-40'
						name={name}
						defaultValue={actionDataField}
						aria-invalid={Boolean(actionDataFieldError) || undefined}
						aria-errormessage={
							actionDataFieldError ? `${name}-error` : undefined
						}
					/>
				) : (
					<input
						className='bg-stone-200'
						type={type}
						name={name}
						defaultValue={actionDataField}
						aria-invalid={Boolean(actionDataFieldError) || undefined}
						aria-errormessage={
							actionDataFieldError ? `${name}-error` : undefined
						}
					/>
				)}
			</label>
			{actionDataFieldError ? (
				<p role='alert' id={`${name}-error`}>
					{actionDataFieldError}
				</p>
			) : null}
		</div>
	);
}
