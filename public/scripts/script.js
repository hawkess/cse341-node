let events = [];
let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let locations = [];
let markers = [];

$('document').ready(() => {
    getEvents({
        params: {
            status: 'open',
            limit: 20
        }
    });
    getCategories();
    $('#events').on('click', 'li', function () {
        let eventIndex = $(this).index();
        let latlng = coords(events[eventIndex])[0];
        console.log(latlng);
        map.panTo(latlng);
    });
    let d = new Date();
    $('input[type=date]').prop('max', d.toISOString().slice(0, 10));
    $('input[type=date]').prop('value', d.toISOString().slice(0, 10));    
    $('#filterForm').on('change', 'select input', function() {
        let params = {};
        params.status = $('#statusCheck').prop("checked") ? 'closed' : 'open';
        params.limit = $('#limitSelect').val();
        if ($('#categorySelect').val()) {
            params.category = $('#categorySelect').val();
        }
        getEvents(params);
    });
});

function categorySelectPopulate(categories) {
    categories.forEach(cat => $('#categorySelect').append(`<option value=${cat.id}>${cat.title}</option>`));
}

function eventsPopulate(events) {
    events.forEach(event => $('#events').append(`<li class="list-group-item"><div><small class="text-muted">${categories(event)}</small></div><div><h5>${title(event)}</h5></div></li>`));
}

function getEvents(params) {
    $.get('/events', params)
        .done((data) => {
            events = data;
            eventsPopulate(events);
        });
}

function getCategories() {
    $.get('/categories')
        .done((data) => {
            categorySelectPopulate(data);
        });
}

function markersPopulate(events) {
    events.forEach((event) => {
        locations = locations.concat(coords(event));
    });
    markers = locations.map((location, i) => {
        return new google.maps.Marker({
            position: location,
            label: labels[i % labels.length]
        });
    });
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
    event.geometry.forEach((coords) => {
        points.push(coords);
    });
    return points;
}

function title(event) {
    return event.title;
}
