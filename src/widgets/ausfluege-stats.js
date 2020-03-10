import { render, useState, useEffect } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';
import apiFetch from '@wordpress/api-fetch';
import { Spinner, FormToggle } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

import { transformAnmeldungen, transformWp, getAnmeldungen } from './helper';

const AusflugAnmeldeStatWidget = () => {
	const [ anmeldungen, setAnmeldungen ] = useState( [] );
	const [ ausfluege, setAusfluege ] = useState( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	const site = useSelect( select => select('core').getSite() );

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
								.sort( ( a, b ) => a.character > b.character && a.nr < b.character )
								.filter( ausflug => 'storniert' != ausflug.status )
								.map( ( ausflug ) => {
									const ausflugAnmeldungen = getAnmeldungen(
										anmeldungen,
										'ausfluege',
										ausflug.id
									);

									const ausflugLimit = ausflug.beschraenkt && ausflug.maxPlaetze;

									const { nr, character, title, id, registrationClosed } = ausflug;

									const anmeldungenAndLimit = `${ !! ausflugLimit &&
                    					ausflugLimit + '/' }${ ausflugAnmeldungen }`;
									return (
										<tr key={ id }>
											<td>
												<span className="nr">{ `${ character }${ nr }` }</span>
											</td>
											<td>
												<a href={ `${site && site.url}/wp-admin/post.php?post=${id}&action=edit` } target="_blank" dangerouslySetInnerHTML={ {
													__html: `${title}${ registrationClosed ? '<span class="ausgebucht">Ausgebucht!</span>' : '' }`,
												} } />
											</td>
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
