var events = [];
var map = {};

$('document').ready(() => {
    displayMap( { lat: -33.860664, lng: 151.208138 } );
    getEvents({ params: { status: 'open', limit: 20 }});
    $('#events').on('click', 'li', () => {
        let eventIndex = $(this).index();
        console.log(eventIndex);
    })
});


function eventsPopulate(events) {
    events.forEach(event => $('#events').append(`<li class="list-group-item"><div><small class="text-muted">${categories(event)}</small></div><div>${title(event)}</div></li>`));
}


function getEvents(params) {
        $.get('/events', params)
        .done((data) => {
            events = data.events.map(event => new Event(event));
            eventsPopulate(events);
        });
}

// Event class and utility functions
class Event {
    constructor(event) {
        this.title = event.title;
        this.categories = event.categories;
        this.geometry = event.geometry.map((geo) => {
            return new Coordinates(geo);
        });
    }
}

class Coordinates {
    constructor(geometry) {
        this.lat = geometry.coordinates[0];
        this.lng = geometry.coordinates[1];
    }
}

function categories(event) {
    let cats = [];
    event.categories.forEach((cat) => {
        cats.push(cat.title);
    });
    return cats.join(', ');
}

function coords(event) {
    let points = [];
    events.geometry.forEach((geo) => {
        points.push(geo.coordinates);
    });
}

function initMap() {
    map = displayMap({ lat: 0, lng: 0 });    
}

function title(event) {
    return event.title;
}

function displayMap(coords) {
        const mapOptions = {
        center: coords,
        zoom: 8
    };
    return new google.maps.Map($("#map"), mapOptions);
}

