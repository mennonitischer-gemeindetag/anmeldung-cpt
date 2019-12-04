import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner, FormToggle } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from '../helper';

const EssenAnmeldeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ essen, setEssen ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	useEffect( () => {
		Promise.all( [
			apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ),
			apiFetch( { path: 'wp/v2/essen?per_page=100' } ),
		] )
			.then( ( [ anmeldungen, essen ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setEssen( transformWp( essen ) );
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
					<table className={ 'wp-list-table widefat striped essen' }>
						<thead>
							<tr>
								<th className={ 'column-title' }>Titel</th>
								<th className={ 'column-title' }></th>
							</tr>
						</thead>
						<tbody id="the-list">
							{ essen

								.sort( ( a, b ) => a.id > b.id )

								.map( ( workshop ) => {
									const essenAnmeldungen = getAnmeldungen(
										anmeldungen,
										'verpflegung',
										workshop.id
									);

									const { title, id } = workshop;
									return (
										<tr key={ id }>
											<td
												dangerouslySetInnerHTML={ {
													__html: title,
												} }
											/>
											<td>{ essenAnmeldungen }</td>
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
		<EssenAnmeldeStatWidget />,
		document.getElementById( 'essen-stats-widget' )
	);
} );
