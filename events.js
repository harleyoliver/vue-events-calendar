jQuery( document ).ready( function( $ ) {
	var eventsFilter = new Vue({
		el: '#internal-wrapper',
		data : {
			apiURL : 'https://www.urlgoeshere.com/wp-json/tribe/events/v1/events',
			events : [],
			page : null,
			totalPages : '',
			isLastPage : false,
			searchTerm : '',
			startDate: '',
			noResults : false
		},
		mounted: function() {
			this.page = 1
			this.getEvents()
		},
		methods:{
			getEvents: function() {

				var self = this
				var xhr = new XMLHttpRequest()

				if ( self.searchTerm && self.startDate ) {
					self.events = []
					xhr.open('GET', self.apiURL + '?per_page=5' + '&search=' + self.searchTerm + '&start_date=' + self.startDate + '&page=' + self.page, true )
				} else if ( self.startDate ) {
					self.events = []
					xhr.open('GET', self.apiURL + '?per_page=5' + '&start_date=' + self.startDate + '&page=' + self.page, true )
				} else if ( self.searchTerm ) {
					self.events = []
					xhr.open('GET', self.apiURL + '?per_page=5' + '&search=' + self.searchTerm + '&page=' + self.page, true )
				} else {
					xhr.open('GET', self.apiURL + '?per_page=5' + '&page=' + self.page, true )
				}

				xhr.onload = function () {

					var newEvents = JSON.parse( xhr.responseText )
					self.totalPages = newEvents.total_pages
					newEvents = newEvents.events

					if(!newEvents) {
						
					} else {
						newEvents.forEach( function( element ) {
							self.events.push( element )
						})
					}
										
					if( self.page === self.totalPages ){
						self.isLastPage = true
						return
					} else {
						self.page++
					}
				}
						
				xhr.send()
			},
			theExcerpt: function (eventDescription) {
				return eventDescription.slice(0, 300) + "..."
			},
			resetPageNumber: function() {
				this.page = 1
			},
			getDay: function(dayOfWeek) {
				dayOfWeek = new Date( dayOfWeek )
				dayOfWeek = dayOfWeek.getDay()
				return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][ dayOfWeek ]
			},
		}
	});
	
	/* Datepicker */
	$( '#datepicker' ).datepicker({
		autoclose: true,
		format: 'dd/mm/yyyy',
	});

	$('#datepicker').datepicker()
	.on('changeDate', function(e) {

		var newDate = e.date;
		newDate = new Date( newDate )

		day = newDate.getDate()
		month = newDate.getMonth() + 1
		year = newDate.getFullYear()

		formattedDate = year + '-' + month + '-' + day

		Vue.set(eventsFilter, 'startDate', formattedDate);
	});
	
});