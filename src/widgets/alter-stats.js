import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';
import Chart from 'react-google-charts';

import { transformAnmeldungen, emptyAges } from './helper';

const AgeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		Promise.all( [ apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ) ] )
			.then( ( [ anmeldungen ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setIsLoading( false );
			} )
			.catch( ( error ) => console.error( error ) );
	}, [] );

	const byAge = anmeldungen.reduce( ( ages, { age } ) => {
		if ( ages[ age ] ) {
			ages[ age ]++;
		} else {
			ages[ age ] = 1;
		}
		return ages;
	}, {} );

	const data = Object.keys( byAge ).map( ( key ) => {
		return [ key, byAge[ key ] ];
	} );

	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<h3>Altersverteilung:</h3>
					<Chart
						height={ '250px' }
						width={ '350px' }
						chartType="ScatterChart"
						loader={ <Spinner /> }
						data={ [ [ 'Anzahl', 'Alter' ], ...data ] }
						options={ {
							hAxis: { title: 'Alter', maxValue: 100 },
							legend: 'none',
						} }
					/>
				</>
			) }
		</>
	);
};

domReady( () => {
	render(
		<AgeStatWidget />,
		document.getElementById( 'age-stats-widget' )
	);
} );
