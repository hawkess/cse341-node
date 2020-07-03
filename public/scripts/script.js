function Event(event) {
    this.title = event.title;
    this.category = event.categories[0].title;
    this.geometry = event.geometry;
}

function eventsPopulate(events) {
    var eventsHTML = '';
    events.forEach(event => eventsHTML += `<li class="list-group-item">${event.category} : ${event.title}</li>`);
    return eventsHTML;
}

var events = [];

$('document').ready(() => {
    getEvents({ params: { status: 'open', limit: 20 }});
});

function getEvents(params) {
        $.get('/events', params)
        .done((data) => {
            events = data.events.map(event => new Event(event));
            $('#events').html(eventsPopulate(events));
        });
}
