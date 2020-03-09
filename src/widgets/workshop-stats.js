import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner, FormToggle } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const WorkshopAnmelddeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ workshops, setWorkshops ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isHidingEmpty, setIsHidingEmpty ] = useState( true );

	useEffect( () => {
		Promise.all( [
			apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ),
			apiFetch( { path: 'wp/v2/workshops?per_page=100' } ),
		] )
			.then( ( [ anmeldungen, workshops ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setWorkshops( transformWp( workshops ) );
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
					<label htmlFor="hide-emppty-workshops" className="hide-empty">
            Leere verbergen
					</label>
					<FormToggle
						id={ 'hide-emppty-workshops' }
						checked={ isHidingEmpty }
						onChange={ () => setIsHidingEmpty( ! isHidingEmpty ) }
					/>
					<table className={ 'wp-list-table widefat striped workshops' }>
						<thead>
							<tr>
								<th className={ 'column-title' }>Nr.</th>
								<th className={ 'column-title' }>Titel</th>
								<th className={ 'column-title' }></th>
							</tr>
						</thead>
						<tbody id="the-list">
							{ workshops
								.filter( ( workshop ) => {
									const workshopAnmeldungen = getAnmeldungen(
										anmeldungen,
										'workshops',
										workshop.id
									);

									return isHidingEmpty ? workshopAnmeldungen : true;
								} )
								.sort( ( a, b ) => a.character > b.character && a.nr < b.character )

								.map( ( workshop ) => {
									const workshopAnmeldungen = getAnmeldungen(
										anmeldungen,
										'workshops',
										workshop.id
									);

									const { nr, character, title, id } = workshop;
									return (
										<tr key={ id }>
											<td>
												<span className="nr">{ `${ character }${ nr }` }</span>
											</td>
											<td
												dangerouslySetInnerHTML={ {
													__html: title,
												} }
											/>
											<td>
												{ workshopAnmeldungen ? (
													<b>{ workshopAnmeldungen }</b>
												) : (
													workshopAnmeldungen
												) }
											</td>
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
		<WorkshopAnmelddeStatWidget />,
		document.getElementById( 'workshops-stats-widget' )
	);
} );
