export const formatPrice = ( number ) => {
	if ( isNaN( number ) ) {
		return formatPrice( 0 );
	}
	return (
		parseFloat( number ).toFixed( 2 ).toString().replace( '.', ',' ) + ' €'
	);
};
