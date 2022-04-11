import {Box, Paper} from '@mui/material';
import React from 'react';

interface TProps {
	items: string[]
}

function MusicSearchView(props: TProps) {
	const {items} = props;
	return (
		<Paper variant='outlined' sx={{padding: 1}}>
			{items.map((item, idx) => (
				<Box m={1} key={idx}>
					<Paper variant='outlined' sx={{padding: 1}}>{item}</Paper>
				</Box>
			))}
		</Paper>
	);
}

export default MusicSearchView;
