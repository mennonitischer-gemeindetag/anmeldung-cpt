import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner, FormToggle } from '@wordpress/components';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const AusflugAnmeldeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ ausfluege, setAusfluege ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );
	const [ isHidingEmpty, setIsHidingEmpty ] = useState( true );

	useEffect( () => {
		Promise.all( [
			apiFetch( { path: 'wp/v2/anmeldung?per_page=5000' } ),
			apiFetch( { path: 'wp/v2/ausfluege?per_page=100' } ),
		] )
			.then( ( [ anmeldungen, ausfluege ] ) => {
				setAnmeldungen( transformAnmeldungen( anmeldungen ) );
				setAusfluege( transformWp( ausfluege ) );
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
					<label htmlFor="hide-empty-workshops" className="hide-empty">
            Leere verbergen
					</label>
					<FormToggle
						id={ 'hide-empty-workshops' }
						checked={ isHidingEmpty }
						onChange={ () => setIsHidingEmpty( ! isHidingEmpty ) }
					/>
					<table className={ 'wp-list-table widefat striped ausfluege' }>
						<thead>
							<tr>
								<th className={ 'column-title' }>Nr.</th>
								<th className={ 'column-title' }>Titel</th>
								<th className={ 'column-title' }></th>
							</tr>
						</thead>
						<tbody id="the-list">
							{ ausfluege
								.filter( ( ausflug ) => {
									const ausflugAnmeldungen = getAnmeldungen(
										anmeldungen,
										'ausfluege',
										ausflug.id
									);

									return isHidingEmpty ? ausflugAnmeldungen : true;
								} )
								.sort( ( a, b ) => a.character > b.character && a.nr < b.character )
								.map( ( ausflug ) => {
									const ausflugAnmeldungen = getAnmeldungen(
										anmeldungen,
										'ausfluege',
										ausflug.id
									);

									const ausflugLimit = ausflug.beschraenkt && ausflug.maxPlaetze;

									const { nr, character, title, id } = ausflug;

									const anmeldungenAndLimit = `${ !! ausflugLimit &&
                    					ausflugLimit + '/' }${ ausflugAnmeldungen }`;
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
												{ ausflugAnmeldungen ? (
													<b>{ anmeldungenAndLimit }</b>
												) : (
													anmeldungenAndLimit
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
		<AusflugAnmeldeStatWidget />,
		document.getElementById( 'ausfluege-stats-widget' )
	);
} );
