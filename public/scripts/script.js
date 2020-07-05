let events = [];
let labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let markers = [];
let markerClusterer = {};

$('document').ready(() => {
    getEvents({
        params: {
            status: 'open',
            limit: 10
        }
    });
    getCategories();
    markerClusterer = new MarkerClusterer(map, [], {
        imagePath: 'img/m'
    });
    $('#events').on('click', 'li', function () {
        let eventIndex = $(this).index();
        let latlng = coords(events[eventIndex])[0];
        map.panTo(latlng);
    });
    let d = new Date();
    $('input[type=date]').prop('max', d.toISOString().slice(0, 10));
    $('.filter-form').on('change', function () {
        if ($('#categorySelect').val() !== '')
            filteredRequestCreate();
        else 
            eventRequestCreate();
    });
});

function categorySelectPopulate(categories) {
    categories.forEach(cat => $('#categorySelect').append(`<option value=${cat.id}>${cat.title}</option>`));
}

function clearMarkers() {
    markers.forEach((marker) => {
        marker.setMap(null);
    });
    markers = [];
}

function eventsPopulate(events) {
    $('#events').html('');
    events.forEach(event => $('#events').append(`<li class="list-group-item"><div><small class="text-muted">${categories(event)}</small></div><div><h5>${title(event)}</h5></div></li>`));
}

function getEvents(query) {
    $.post('/events', query)
        .done((data) => {
            console.log(JSON.stringify(data));
            events = data;
            eventsPopulate(events);
            clearMarkers();
            markersPopulate(events);
            markerClusterer.clearMarkers();
            markerClusterer.addMarkers(markers);
        });
}

function getFiltered(category, query) {
    $.post('/categories/' + category, query)
        .done((data) => {
            console.log(JSON.stringify(data));
            events = data;
            eventsPopulate(events);
            clearMarkers();
            markersPopulate(events);
            markerClusterer.clearMarkers();
            markerClusterer.addMarkers(markers);
        });
}

function getCategories() {
    $.post('/categories')
        .done((data) => {
            categorySelectPopulate(data);
        });
}

function eventRequestCreate() {
        let params = {};
        params.status = $('#statusCheck').prop("checked") ? 'closed' : 'open';
        params.limit = $('#limitSelect').val();
        if ($('#startDate').val() !== '')
            params.start = $('#startDate').val();
        if ($('#endDate').val() !== '')
            params.end = $('#endDate').val() || '';
        let query = { params: params };
        getEvents(query);
}

function filteredRequestCreate() {
        let params = {};
        let category = $('#categorySelect').val();
        params.status = $('#statusCheck').prop("checked") ? 'closed' : 'open';
        params.limit = $('#limitSelect').val();
        let query = { params: params };
        getFiltered(category, query);
}

function markersPopulate(events) {
    let markerTuples = [];
    events.forEach((event) => {
        let points = coords(event);
        points.forEach((point) => {
            markerTuples.push({
                title: title(event),
                location: point
            });
        });
    });
    console.log(markerTuples);
    markers = markerTuples.map((tuple, i) => {
        return new google.maps.Marker({
            position: tuple.location,
            label: labels[i % labels.length],
            title: tuple.title
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
