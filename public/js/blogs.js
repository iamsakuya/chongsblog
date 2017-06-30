/*************************************************************************
		open some links in new window
**************************************************************************/

$(function () {
	$('.open-in-new-window').on('click', function (event) {
		event.preventDefault();
		const url = this.href;
		console.log('opening address  ' + url + '  in new window ...');
		window.open(url);
	});
});


/*************************************************************************
		enable prettify.js
**************************************************************************/

$(function () {
	PR.prettyPrint();
});


/*************************************************************************
		blogs-pagination-go btn function
**************************************************************************/

$(function () {
	$('#blogs-pagination-go').on('click', event => {
		const page_num = parseInt($('#blogs-pagination-page-num').val());
		if (page_num) {
			const url = '/blogs/?page=' + page_num;
			 window.open(url, '_self');
		}
	});
});