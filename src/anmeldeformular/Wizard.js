import { Form } from 'react-final-form';
import { Component, createRef, Children } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

const scrollToRef = ( ref ) => {
	window.scrollTo( 0, ref.current.offsetTop + 300 );
};

export default class Wizard extends Component {
	static Page( { children } ) {
		return children;
	}

	constructor( props ) {
		super( props );
		this.state = {
			page: 0,
			values: props.initialValues || {},
		};
		this.next = this.next.bind( this );
		this.previous = this.previous.bind( this );
		this.validate = this.validate.bind( this );
		this.handleSubmit = this.handleSubmit.bind( this );
		this.currentActivePage = createRef();
	}

	next( values ) {
		scrollToRef( this.currentActivePage );
		return this.setState( ( state ) => ( {
			page: Math.min( state.page + 1, this.props.children.length - 1 ),
			values,
		} ) );
	}

	previous() {
		scrollToRef( this.currentActivePage );
		return this.setState( ( state ) => ( {
			page: Math.max( state.page - 1, 0 ),
		} ) );
	}

	/**
	 * NOTE: Both validate and handleSubmit switching are implemented
	 * here because 🏁 Redux Final Form does not accept changes to those
	 * functions once the form has been defined.
	 */

	validate( values ) {
		const activePage = Children.toArray( this.props.children )[
			this.state.page
		];
		return activePage.props.validate
			? activePage.props.validate( values )
			: {};
	}

	handleSubmit( values ) {
		const { children, onSubmit } = this.props;
		const { page } = this.state;
		const isLastPage = page === Children.count( children ) - 1;
		if ( isLastPage ) {
			return onSubmit( values );
		}
		this.next( values );
	}

	render() {
		const { children } = this.props;
		const { page, values } = this.state;
		const activePage = Children.toArray( children )[ page ];
		const isLastPage = page === Children.count( children ) - 1;
		return (
			<Form
				initialValues={ values }
				validate={ this.validate }
				onSubmit={ this.handleSubmit }
			>
				{ ( { handleSubmit, submitting } ) => (
					<form onSubmit={ handleSubmit }>
						{ submitting && <Spinner /> }
						<div ref={ this.currentActivePage }>{ activePage }</div>
						<div className="buttons">
							{ page > 0 && (
								<button type="button" onClick={ this.previous }>
									« Zurück
								</button>
							) }
							{ ! isLastPage && (
								<button type="submit">Weiter »</button>
							) }
							{ isLastPage && (
								<button type="submit" disabled={ submitting }>
									Absenden
								</button>
							) }
						</div>
					</form>
				) }
			</Form>
		);
	}
}
