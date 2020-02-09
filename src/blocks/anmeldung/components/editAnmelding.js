import { Spinner, TextControl, PanelBody, PanelRow, SelectControl, CheckboxControl } from '@wordpress/components';

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
        setAttributes,
        isLoading,
        allWorkshops,
        allAusfluege,
        allEssen,
        allTickets,
        allKinderprogramm,
        invoice
    } = props;
    
    const handleTicketChange = (isChecked, ticket) => {

        const { id } = ticket;
        let newTeilnahmetage = teilnahmetage || [];

        
        if ( !isChecked && teilnahmetage.includes( id ) ) {
            newTeilnahmetage = teilnahmetage.filter( tag => tag != id );
        } 
        
        if ( isChecked && !teilnahmetage.includes( id ) )  {
            newTeilnahmetage = [...teilnahmetage, id]
        }
        
        setAttributes( { teilnahmetage: newTeilnahmetage } );
        
        console.log({teilnahmetage, isChecked})
    };

    return (
        <div className={ 'edit-anmeldung' }>
            <PanelBody className={ 'personal-info' } title='Persönliche Infos'>
                <PanelRow>
                    <TextControl  value={vorname} onChange={vorname => setAttributes({ vorname })} label='Vorname' />
                    <TextControl  value={nachname} onChange={nachname => setAttributes({ nachname })} label='Nachname' />
                </PanelRow>
                <PanelRow>
                    <TextControl  value={adresse_straße} onChange={adresse_straße => setAttributes({ adresse_straße })} label='Straße' />
                </PanelRow>
                <PanelRow>
                    <TextControl  value={adresse_plz} onChange={adresse_plz => setAttributes({ adresse_plz })} label='PLZ' />
                    <TextControl  value={adresse_ort} onChange={adresse_ort => setAttributes({ adresse_ort })} label='Ort' />
                </PanelRow>
                <PanelRow>
                    <SelectControl 
                        label='Geschlecht' 
                        options={ [ 
                            {  label: 'Männlich', value:'männlich' }, 
                            {  label: 'Weiblich', value:'weiblich' }, 
                            {  label: 'Divers', value:'divers' } 
                        ]}
                        onSelect={geschlecht => setAttributes({ geschlecht })} 
                    />
                    <TextControl  value={geb_datum} onChange={geb_datum => setAttributes({ geb_datum })} label='Geburtstag' help='Bitte als dd.mm.yyyy angeben. (22.12.1996)' />
                </PanelRow>
                <PanelRow>
                    <TextControl  value={email} onChange={email => setAttributes({ email })} label='Email'  />
                    <TextControl  value={telefon} onChange={telefon => setAttributes({ telefon })} label='Telefon'  />
                </PanelRow>
            </PanelBody>
            <PanelBody className={ 'teilnahmetage' } title='Teilnahmetage' >
				{ isLoading ? <Spinner /> : (
                    allTickets
                        .map( ( ticket ) => (
                            <CheckboxControl
                                key={ ticket.id }
                                label={ ticket.title.rendered }
                                checked={ teilnahmetage.includes( ticket.id ) }
                                onChange={ (isChecked) => handleTicketChange(isChecked, ticket) }
                            />
                        ) )
                )}
            </PanelBody>
							
				{ !! mitarbeit && !! mitarbeit.length && (
					<div className={ 'mitarbeit' }>
						<h2>Mitarbeit</h2>
						<ul>
							{ mitarbeit.map( ( tag ) => (
								<li key={ tag.id }>{ tag }</li>
							) ) }
						</ul>
					</div>
				) }
				{ !! workshops && !! workshops.length && (
					<div className={ 'workshops' }>
						<h2>Workshops</h2>
						{ isLoading ? (
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
				) }
				{ !! ausfluege && !! ausfluege.length && (
					<div className={ 'ausfluege' }>
						<h2>Ausflüge</h2>
						{ isLoading ? (
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
				) }
				{ !! verpflegung && !! verpflegung.length && (
					<div className={ 'verpflegung' }>
						<h2>Verpflegung</h2>
						{ isLoading ? (
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
				) }

				{ !! kinderprogramm && !! kinderprogramm.length && (
					<div className={ 'kinderprogramm' }>
						<h2>Kinderprogramm</h2>
						{ isLoading ? (
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
				) }
			</div>
    )

}