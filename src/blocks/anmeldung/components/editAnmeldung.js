import { Spinner, TextControl, PanelBody, PanelRow, SelectControl, CheckboxControl, IconButton} from '@wordpress/components';

function HtmlEncode(string) {
  const element = document.createElement("div");
  element.innerHTML = element.textContent = string;
  return element.innerText;
}

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
			betrag,
			gedrucktes_liederheft,
            gedrucktes_programmheft,
            uebernachtung_and_breakfast,
            uebernachtung_zelt_mit,
            uebernachtung,
		},
        setAttributes,
        isLoading,
        allWorkshops,
        allAusfluege,
        allEssen,
        allTickets,
        allKinderprogramm,
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
    };

    const handleMitarbeitChange = ( isChecked, tag ) => {
        let newMitarbeit = mitarbeit || [];

        if ( !isChecked && mitarbeit.includes(tag) ) {
            newMitarbeit = mitarbeit.filter( day => day != tag );
        }
        if ( isChecked && !mitarbeit.includes(tag) ) {
            newMitarbeit = [ ...mitarbeit, tag];
        }

        setAttributes({mitarbeit: newMitarbeit});
    }

    const handleWorkshopChange = ( isChecked, workshop ) => {
        let newWorkshops = workshops || [];
                
        if ( !isChecked && workshops.includes( workshop.id ) ) {
            newWorkshops = workshops.filter( id => id != workshop.id );
        }
        if ( isChecked && !workshops.includes(workshop.id) ) {
            newWorkshops = [ ...workshops, workshop.id];
        }

        setAttributes({workshops: newWorkshops});
    }

    const handleAusfluegeChange = ( isChecked, ausflug ) => {
        let newAusfluege = ausfluege || [];
                
        if ( !isChecked && ausfluege.includes(ausflug.id) ) {
            newAusfluege = ausfluege.filter( id => id != ausflug.id );
        }
        if ( isChecked && !ausfluege.includes(ausflug.id) ) {
            newAusfluege = [ ...ausfluege, ausflug.id];
        }

        setAttributes({ausfluege: newAusfluege});
    }

    const handleVerpflegungChange = ( isChecked, essen ) => {

        let newEssen = verpflegung || [];
                
        if ( !isChecked && verpflegung.includes(essen.id) ) {
            newEssen = verpflegung.filter( id => id != essen.id );
        }
        if ( isChecked && !verpflegung.includes(essen.id) ) {
            newEssen = [ ...verpflegung, essen.id];
        }

        setAttributes({verpflegung: newEssen});
    }

    const handleKinderprogrammChange = ( isChecked, programm ) => {

        let newKinderprogramm = kinderprogramm || [];
                
        if ( !isChecked && kinderprogramm.includes(programm.id) ) {
            newKinderprogramm = kinderprogramm.filter( id => id != programm.id );
        }
        if ( isChecked && !kinderprogramm.includes(programm.id) ) {
            newKinderprogramm = [ ...kinderprogramm, programm.id];
        }

        setAttributes({kinderprogramm: newKinderprogramm});
    }



    return (
        <div className={ 'edit-anmeldung' }>
            <PanelBody title='Persönliche Infos' className={ 'personal-info' } icon="admin-users" >
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
                        value={ geschlecht }
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
            <PanelBody title='Teilnahmetage' className={ 'teilnahmetage' } icon="tickets" >
				{ isLoading ? <Spinner /> : (
                    [...allTickets]
                        .reverse()
                        .map( ( ticket ) => (
                            <CheckboxControl
                                key={ ticket.id }
                                label={ HtmlEncode( ticket.title.rendered ) }
                                checked={ teilnahmetage.includes( ticket.id ) }
                                onChange={ (isChecked) => handleTicketChange(isChecked, ticket) }
                            />
                        ) )
                )}
            </PanelBody>
            <PanelBody title='Mitarbeit' className={ 'mitarbeit' } icon="awards" >
				{ isLoading ? <Spinner /> : (
                    [ 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag' ].map( ( tag, key ) => (
                        <CheckboxControl 
                            key={ key } 
                            label={ tag } 
                            checked={ mitarbeit.includes( tag ) } 
                            onChange={ isChecked => handleMitarbeitChange( isChecked, tag ) } 
                        />
                    ) )
				) }
            </PanelBody>
            <PanelBody title="Workshops" className="workshops" icon="clipboard" >
                { isLoading ? <Spinner /> : (
                    [...allWorkshops]
                        .reverse()
                        .map( ( workshop ) => (
                            <CheckboxControl
                                key={ workshop.id }
                                label={ HtmlEncode( `${ workshop.meta.character }${ workshop.meta.nr } - ${ workshop.title.rendered }` ) }
                                checked={ workshops.includes( workshop.id ) }
                                onChange={ isChecked => handleWorkshopChange( isChecked, workshop) }
                            />
                        ) )
                    ) }
            </PanelBody>
			<PanelBody title="Ausflüge" className="ausfluege" icon="location-alt" >
                { isLoading ? (
                    <Spinner />
                ) : ( 
                    [...allAusfluege]
                        .reverse()
                        .map( ausflug => (
                            <CheckboxControl
                                key={ ausflug.id }
                                label={ HtmlEncode( `${ ausflug.meta.character }${ ausflug.meta.nr } - ${ ausflug.title.rendered }` ) }
                                checked={ ausfluege.includes( ausflug.id ) }
                                onChange={ isChecked => handleAusfluegeChange( isChecked, ausflug ) }
                            />
                        ))  		
				) }
            </PanelBody>
			<PanelBody title="Verpflegung" className="verplegung" icon="carrot">
                { isLoading ? (
                    <Spinner />
                ) : (
                        [...allEssen]
                            .reverse()
                            .map( ( essen, key ) => (
                                <CheckboxControl
                                    key={ key }
                                    label={ HtmlEncode(`${ essen.title.rendered }` ) }
                                    checked={ verpflegung.includes( essen.id ) }
                                    onChange={ isChecked => handleVerpflegungChange( isChecked, essen ) }
                                />
                            ) )
                ) }
            </PanelBody>
            <PanelBody title="Kinderprogramm" className="kinderprogramm" icon="buddicons-activity">
                { isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        { [...allKinderprogramm]
                            .reverse()
                            .map( ( programm, key ) => (
                                <CheckboxControl
                                    key={ key }
                                    label={ HtmlEncode(`${ programm.title.rendered }` ) }
                                    checked={ kinderprogramm.includes( programm.id ) }
                                    onChange={ isChecked => handleKinderprogrammChange( isChecked, programm ) }
                                />
                            ) ) }
                            { kinderprogramm.length ? 
                                <>
                                    <TextControl 
                                        label='Bemerkung'
                                        value={ kinderprogramm_bemerkung }
                                        onChange={ kinderprogramm_bemerkung => setAttributes({kinderprogramm_bemerkung}) }
                                    />
                                    <TextControl 
                                        label='Notfall Nummer'
                                        value={ kinderprogramm_notfall_nummer }
                                        onChange={ kinderprogramm_notfall_nummer => setAttributes({kinderprogramm_notfall_nummer}) }
                                    />
                                </>
                            : null }
                        </>
                ) }
            </PanelBody>
            <PanelBody title="Übernachtung" className="uebernachtung" icon="store">
                <p>Unterkünfte bitte selbständig buchen. Für Jugendliche, Studierende, Azubis und FSJler*innen steht eine Gruppenunterkunft in der Turnhalle des Gymnasium Weierhof zur Verfügung (Lageplan Nr. 7).</p>
                <CheckboxControl 
                    label='Übernachtung mit Frühstück'
                    checked={ uebernachtung_and_breakfast }
                    onChange={ () => setAttributes( { uebernachtung_and_breakfast: !uebernachtung_and_breakfast } ) }
                />
                { uebernachtung_and_breakfast ?
                    <PanelRow>
                        <SelectControl 
                            label='Übernachtungsart'
                            value={ uebernachtung }
                            options={[
                                { label: 'Turnhalle', value: 'Turnhalle' },
                                { label: 'Eigenes Zelt', value: 'Eigenes Zelt' },
                                { label: 'Im Zelt mit:', value: 'Im Zelt mit...' },
                            ]}
                            onSelect={ uebernachtung => setAttributes({uebernachtung}) }
                        />
                        { uebernachtung === 'Im Zelt mit...' ?
                            <TextControl 
                                label='Übernachtung im Zelt mit:'
                                value={uebernachtung_zelt_mit}
                                onChange={ uebernachtung_zelt_mit => setAttributes( { uebernachtung_zelt_mit } ) }
                            /> : null
                        }
                    </PanelRow>
                : null }
            </PanelBody>
            <PanelBody title="Sonstiges" className="sonstiges" icon="admin-generic">
                <CheckboxControl 
                    label="Gedrucktes Liederheft"
                    checked={ gedrucktes_liederheft }
                    onChange={ isChecked => setAttributes( { gedrucktes_liederheft: isChecked } ) }
                />
                <CheckboxControl 
                    label="Gedrucktes Programmheft"
                    checked={ gedrucktes_programmheft }
                    onChange={ isChecked => setAttributes( { gedrucktes_programmheft: isChecked } ) }
                />
            </PanelBody>
            <IconButton 
                isPrimary 
                icon="yes"
                onClick={ () => setAttributes( { isEditing: false } ) } 
            >
                Zur Übersicht
            </IconButton>
        </div>
    )

}