import { RichText } from '@wordpress/editor';

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
	} = props;
	return (
		<div className={ className } style={ { backgroundColor } }>
			<RichText.Content
				tagName="h2"
				value={ titel }
				style={ { color: textColor } }
			/>
			<a
				className="button"
				href={ link }
				style={ {
					color: buttonTextColor,
					backgroundColor: buttonBackgroundColor,
				} }
			>
				{ linkText }
			</a>
		</div>
	);
};
