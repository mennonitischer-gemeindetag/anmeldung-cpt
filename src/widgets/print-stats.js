import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const PprintAnmeldeStatWidget = () => {
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

	const printedProrgrammheft = anmeldungen.filter(
		( anmeldung ) => anmeldung.gedrucktes_programmheft
	).length;
	const printedLiederheft = anmeldungen.filter(
		( anmeldung ) => anmeldung.gedrucktes_liederheft
	).length;

	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<table className={ 'wp-list-table widefat striped tickets' }>
						<thead>
							<tr>
								<th className={ 'column-title' }>Titel</th>
								<th className={ 'column-title' }></th>
							</tr>
						</thead>
						<tbody id="the-list">
							<tr>
								<td>Liederheft</td>
								<td>{ printedLiederheft }</td>
							</tr>
							<tr>
								<td>Programmheft</td>
								<td>{ printedProrgrammheft }</td>
							</tr>
						</tbody>
					</table>
				</>
			) }
		</>
	);
};

domReady( () => {
	render(
		<PprintAnmeldeStatWidget />,
		document.getElementById( 'printed-stats-widget' )
	);
} );
