import { useSelect } from '@wordpress/data';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { RichText } from '@wordpress/block-editor';
import { dispatch } from '@wordpress/data';

export default props => {
    const { className } = props;

    const [ content, setContent ] = useState( '' );
    const [ subject, setSubject ] = useState( '' );
    const [ isSending, setIsSending ] = useState( false );
    const currentId = useSelect( select => select( 'core/editor' ).getCurrentPostId() );

    const handleSendEmail = () => {

        setIsSending( true );

        apiFetch( {
            path: `gemeindetag/v1/send-mail/${currentId}?subject=${subject}`,
            method: 'POST',
            body: content,
        } ).then( response => {
            setIsSending( false );
            setContent('');
            setSubject('');
            dispatch( 'core/notices' ).createNotice(
                'success',
                'Die Email wurde versand!',
                { 
                    isDismissible: true,
                    type: 'snackbar',
                }
            );
        } )
    }

    return ( 
        <div className={ className }>
            <div className="email-wrapper" >
                <RichText 
                    tagName="h2" 
                    value={ subject } 
                    onChange={ newValue => setSubject( newValue ) }
                    placeholder="Email Betref"
                    keepPlaceholderOnFocus={true}
                />
                <p>Hallo Vorname,</p>
                <RichText 
                    tagName="p" 
                    value={ content } 
                    onChange={ newValue => setContent( newValue ) }
                    placeholder="Email Nachticht"
                    keepPlaceholderOnFocus={true}
                />
            </div>
            <Button isPrimary={ !isSending } isBusy={ isSending } onClick={ handleSendEmail } >Email Versenden</Button>
            <p className="components-form-token-field__help">* Der Vorname wird automatisch ausgefüllt.</p>
        </div>
    )
}