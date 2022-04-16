import { Fragment } from '@wordpress/element';
import { URLInput, RichText, InspectorControls } from '@wordpress/editor';

export default ( props ) => {
	const {
		attributes: {
			titel,
			link,
			textColor,
			backgroundColor,
			buttonTextColor,
			buttonBackgroundColor,
			linkText,
		},
		className,
		setAttributes,
	} = props;
	return (
		<Fragment>
			<InspectorControls>
				<p>Test</p>
			</InspectorControls>
			<div className={ className } style={ { backgroundColor } }>
				<RichText
					style={ { color: textColor } }
					tagName="h2"
					value={ titel }
					onChange={ ( value ) => setAttributes( { titel: value } ) }
				/>
				<RichText
					style={ {
						color: buttonTextColor,
						backgroundColor: buttonBackgroundColor,
					} }
					tagName="a"
					className="button"
					value={ linkText }
					onChange={ ( value ) =>
						setAttributes( { linkText: value } )
					}
				/>
				<URLInput
					value={ link }
					onChange={ ( value ) => setAttributes( { link: value } ) }
				/>
			</div>
		</Fragment>
	);
};
