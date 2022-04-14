import type { Node, Link as NodeLink } from '@prisma/client';
import PostDate from './PostDate';

interface Props {
	node: Node;
	inLinks: NodeLink[];
	outLinks: NodeLink[];
}

export default function NodeStats({ node, inLinks, outLinks }: Props) {
	return (
		<div className='text-stone-500 text-sm flex justify-between mt-2'>
			<PostDate createdAt={node.createdAt} />
			<span>{`In ${inLinks.length} • Out ${outLinks.length}`}</span>
		</div>
	);
}
