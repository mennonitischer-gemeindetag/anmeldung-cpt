import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const TicketAnmeldeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ tickets, setTickets ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		Promise.all( [
			apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ),
			apiFetch( { path: 'wp/v2/tickets?per_page=100' } ),
		] )
			.then( ( [ anmeldungen, tickets ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setTickets( transformWp( tickets ) );
				setIsLoading( false );
			} )
			.catch( ( error ) => console.error( error ) );
	}, [] );

	return (
		<>
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					<table className={ 'wp-list-table widefat striped tickets' }>
						<thead>
							<tr>
								<th className={ 'column-title' }>Tag</th>
								<th className={ 'column-title' }></th>
							</tr>
						</thead>
						<tbody id="the-list">
							{ tickets

								.sort( ( a, b ) => a.id > b.id )

								.map( ( teilnehmetag ) => {
									const teilnahmetagAnmeldungen = getAnmeldungen(
										anmeldungen,
										'teilnahmetage',
										teilnehmetag.id
									);

									const { title, id } = teilnehmetag;
									return (
										<tr key={ id }>
											<td
												dangerouslySetInnerHTML={ {
													__html: title,
												} }
											/>
											<td>{ teilnahmetagAnmeldungen }</td>
										</tr>
									);
								} ) }
						</tbody>
					</table>
				</>
			) }
		</>
	);
};

domReady( () => {
	render(
		<TicketAnmeldeStatWidget />,
		document.getElementById( 'tickets-stats-widget' )
	);
} );
