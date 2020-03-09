import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';
import Chart from 'react-google-charts';

import { transformAnmeldungen, isStatus, Status } from './helper';

const AnmeldeStatWidget = () => {
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

	const adults = anmeldungen.filter(
		( anmeldung ) => anmeldung.age >= 18 || isNaN( anmeldung.age )
	);
	const teens = anmeldungen.filter(
		( anmeldung ) => anmeldung.age >= 13 && anmeldung.age < 18
	);
	const kids = anmeldungen.filter( ( anmeldung ) => anmeldung.age < 13 );

	const pending = anmeldungen.filter( isStatus( Status.pending ) );
	const payed = anmeldungen.filter( isStatus( Status.payed ) );

	const adultsPending = adults.filter( isStatus( Status.pending ) );
	const teensPending = teens.filter( isStatus( Status.pending ) );
	const kidsPending = kids.filter( isStatus( Status.pending ) );

	const adultsPayed = adults.filter( isStatus( Status.payed ) );
	const teensPayed = teens.filter( isStatus( Status.payed ) );
	const kidsPayed = kids.filter( isStatus( Status.payed ) );

	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<h3>Gesamt: { anmeldungen.length }</h3>
					<p>Warten auf Zahlung: { pending.length }</p>
					<p>Bezahlt: { payed.length }</p>
					<br />
					<h3>Altersverteilung:</h3>
					<Chart
						width={ '350px' }
						height={ '250px' }
						chartType="Bar"
						loader={ <Spinner /> }
						data={ [
							[ '', 'Bezahlt', 'Warten auf Zahlung' ],
							[ 'Kind', kidsPayed.length, kidsPending.length ],
							[ 'Teen', teensPayed.length, teensPending.length ],
							[ 'Erwachsen', adultsPayed.length, adultsPending.length ],
						] }
					/>
				</>
			) }
		</>
	);
};

domReady( () => {
	render(
		<AnmeldeStatWidget />,
		document.getElementById( 'anmeldungen-stats-widget' )
	);
} );
