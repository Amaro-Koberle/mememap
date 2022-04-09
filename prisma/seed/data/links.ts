export function getLinks() {
	return [
		{
			id: 'a',
			name: 'Link from First Node to Second Node',
			sourceNodeId: '1',
			targetNodeId: '2',
			authorId: 'a',
		},
		{
			id: 'b',
			name: 'Link from Second Node to Third Node',
			sourceNodeId: '2',
			targetNodeId: '3',
			authorId: 'a',
		},
		{
			id: 'c',
			name: 'Link from Third Node to First Node',
			sourceNodeId: '3',
			targetNodeId: '1',
			authorId: 'a',
		},
	];
}
