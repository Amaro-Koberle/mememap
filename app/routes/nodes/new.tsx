export default function NewNodeRoute() {
	return (
		<div>
			<form method='post'>
				<div>
					<label>
						Node name <input type='text' name='name' />
					</label>
				</div>
				<div>
					<label>
						Content <textarea name='content' />
					</label>
				</div>
				<div>
					<button type='submit'>Add</button>
				</div>
			</form>
		</div>
	);
}
