import { Link } from 'remix';

import { MdOutlineMoreVert } from 'react-icons/md';
import { MdNavigateNext } from 'react-icons/md';
import { MdNavigateBefore } from 'react-icons/md';

import type { Link as LinkPost } from '@prisma/client';
import { useState } from 'react';

interface Props {
	outLinks: LinkPost[];
	summonLinkDetailsModal: (link: LinkPost) => void;
}

export default function OutLinkList({
	outLinks,
	summonLinkDetailsModal,
}: Props) {
	const [currentSlide, setCurrentSlide] = useState(1);
	//determine array length
	//define number of links per slide
	//determine slide count using array length modulo links per slide number
	//keep track of current slide with state
	//trunkate array, removing all but the links on the current slide
	//draw link list using trunkated array
	//increment/decrease slide count with buttons

	const linksPerSlide = 3;
	const numberOfOutLinks = outLinks.length;
	const numberOfSlides = Math.ceil(numberOfOutLinks / linksPerSlide);
	const indexOfLastLinkOnSlide = currentSlide * linksPerSlide;
	const indexOfFirstLinkOnSlide = indexOfLastLinkOnSlide - linksPerSlide;
	const linksOnCurrentSlide = outLinks.slice(
		indexOfFirstLinkOnSlide,
		indexOfLastLinkOnSlide
	);
	console.log(linksOnCurrentSlide);

	return (
		<div className='m-4 fixed bottom-10 left-0 right-0'>
			<div className='flex justify-between text-xl'>
				<button
					onClick={() => {
						setCurrentSlide(currentSlide - 1);
					}}
					disabled={currentSlide <= 1}>
					<MdNavigateBefore />
				</button>
				<span className='text-sm text-stone-500'>{`${currentSlide}/${numberOfSlides}`}</span>
				<button
					onClick={() => {
						setCurrentSlide(currentSlide + 1);
					}}
					disabled={currentSlide >= numberOfSlides}>
					<MdNavigateNext />
				</button>
			</div>
			<ul className='mb-2'>
				{linksOnCurrentSlide.map((link) => (
					<li key={link.id}>
						<div className='rounded-xl bg-stone-300 mt-2 w-full flex items-center'>
							<Link to={`/nodes/${link.targetNodeId}`} className='p-3 w-full'>
								<span>{link.name}</span>
							</Link>
							<button
								className='flex items-center space-x-3 pr-3'
								onClick={() => {
									summonLinkDetailsModal(link);
								}}>
								<hr className='border-l h-8 border-stone-400' />
								<MdOutlineMoreVert className='text-xl' />
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className='text-stone-500 text-sm flex justify-between'>
				<span>Jan 12</span>
				<span>In 12 • Out 9</span>
			</div>
		</div>
	);
}
