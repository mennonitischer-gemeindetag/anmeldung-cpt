import { Spinner } from '@wordpress/components';
import { base64ToArrayBuffer } from '../../../widgets/helper';

export default (props) => {

    const {
		attributes: {
			vorname,
			nachname,
			geschlecht,
			adresse_ort,
			adresse_plz,
			adresse_straße,
			geb_datum,
			telefon,
			email,
			teilnahmetage,
			mitarbeit,
			kinderprogramm,
			kinderprogramm_bemerkung,
			kinderprogramm_notfall_nummer,
			workshops,
			ausfluege,
			verpflegung,
			status,
			betrag,
			gedrucktes_liederheft,
			gedrucktes_programmheft,
			daten_fuer_mitfahrgelegenheit_teilen,
	  		zahlungsbestaetigung_versand,
	  		rechnung_versand,
		},
        className,
        isLoading,
        allWorkshops,
        allAusfluege,
		allEssen,
		allTickets,
        allKinderprogramm,
        invoice
	} = props;

    return (
        <div className={ 'show-anmeldung' }>
				<div className={ 'personal-info' }>
					<h2>Persönliche Infos:</h2>
					<p>
						{ `${ vorname } ${ nachname }` }
						<br />
						{ `${ adresse_straße }` }
						<br />
						{ `${ adresse_plz } ${ adresse_ort }` }
					</p>
					<p>
						{ !! geschlecht && (
							<>
								{ `Geschlecht: ${ geschlecht }` }
								<br />
							</>
						) }
						{ `Geburtstag: ${ geb_datum }` }
						<br />
						{ !! telefon && (
							<>
								{ `Telefon: ${ telefon }` }
								<br />
							</>
						) }
            Email: <a href={ `mailto:${ email }` }>{ email }</a>
					</p>
				</div>
				{ !! teilnahmetage && !! teilnahmetage.length ? (
					<div className={ 'teilnahmetage' }>
						<h2>Teilnahmetage</h2>
						{ ! Array.isArray( allTickets ) ? (
							<Spinner />
						) : (
							<ul>
								{ allTickets
									.filter( ( ticket ) => teilnahmetage.includes( ticket.id ) )
									.reverse()
									.map( ( ticket ) => (
										<li
											key={ ticket.id }
											dangerouslySetInnerHTML={ {
												__html: `${ ticket.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				): null }
				{  ! Array.isArray( mitarbeit ) && mitarbeit.length ? (
					<div className={ 'mitarbeit' }>
						<h2>Mitarbeit</h2>
						<ul>
							{ mitarbeit.map( ( tag ) => (
								<li key={ tag.id }>{ tag }</li>
							) ) }
						</ul>
					</div>
				) : null }
				{  Array.isArray( workshops ) && workshops.length ? (
					<div className={ 'workshops' }>
						<h2>Workshops</h2>
						{  ! Array.isArray( allWorkshops ) ? (
							<Spinner />
						) : (
							<ul>
								{ allWorkshops
									.filter( ( workshop ) => workshops.includes( workshop.id ) )
									.reverse()
									.map( ( workshop ) => (
										<li
											key={ workshop.id }
											dangerouslySetInnerHTML={ {
												__html: `${ workshop.meta.character }${ workshop.meta.nr } - ${ workshop.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				): null }
				{  Array.isArray( ausfluege ) && ausfluege.length ? (
					<div className={ 'ausfluege' }>
						<h2>Ausflüge</h2>
						{ ! Array.isArray( allAusfluege ) ? (
							<Spinner />
						) : (
							<ul>
								{ allAusfluege
									.filter( ( ausflug ) => ausfluege.includes( ausflug.id ) )
									.reverse()
									.map( ( ausflug ) => (
										<li
											key={ ausflug.id }
											dangerouslySetInnerHTML={ {
												__html: `${ ausflug.meta.character }${ ausflug.meta.nr } - ${ ausflug.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				):null }
				{ Array.isArray( verpflegung ) && verpflegung.length ? (
					<div className={ 'verpflegung' }>
						<h2>Verpflegung</h2>
						{ ! Array.isArray( allEssen ) ? (
							<Spinner />
						) : (
							<ul>
								{ allEssen
									.filter( ( essem ) => verpflegung.includes( essem.id ) )
									.reverse()
									.map( ( essem ) => (
										<li
											dangerouslySetInnerHTML={ {
												__html: `${ essem.title.rendered }`,
											} }
										/>
									) ) }
							</ul>
						) }
					</div>
				) : null }

				{  Array.isArray( kinderprogramm ) && kinderprogramm.length ? (
					<div className={ 'kinderprogramm' }>
						<h2>Kinderprogramm</h2>
						{ ! Array.isArray( allKinderprogramm ) ? (
							<Spinner />
						) : (
							<>
								<ul>
									{ allKinderprogramm
										.filter( ( programm ) => kinderprogramm.includes( programm.id ) )
										.reverse()
										.map( ( programm ) => (
											<li
												dangerouslySetInnerHTML={ {
													__html: `${ programm.title.rendered }`,
												} }
											/>
										) ) }
								</ul>
								{ !! kinderprogramm_bemerkung && (
									<>
										<h3>Bemerkung:</h3>
										<p>{ kinderprogramm_bemerkung }</p>
									</>
								) }
								{ !! kinderprogramm_notfall_nummer && (
									<>
										<h3>Notfall Nummer:</h3>
										<p>{ kinderprogramm_notfall_nummer }</p>
									</>
								) }
							</>
						) }
					</div>
				): null }
				{ isLoading ? (
					<Spinner />
				) : (
					<>
						<h2>Rechnung</h2>
						<object
							height={ '850px' }
							width={ '100%' }
							style={ { border: '5px solid #7B7B7B' } }
							data={ URL.createObjectURL(
								new Blob( [ base64ToArrayBuffer( invoice ) ], {
									type: 'application/pdf',
								} )
							) }
						>
              Rechnungs PDF
						</object>
					</>
				) }
			</div>
    )

}