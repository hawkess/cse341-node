// Event class and utility functions
class Category {
    constructor(category) {
        this.id = category.id;
        this.title = category.title;
    }
}

class Coordinates {
    constructor(geometry) {
        this.lat = geometry.coordinates[1];
        this.lng = geometry.coordinates[0];
    }
}

class Event {
    constructor(event) {
        this.title = event.title;
        this.categories = event.categories;
        this.geometry = event.geometry.map((geo) => {
            return new Coordinates(geo);
        });
    }
}

module.exports.Category = Category;
module.exports.Coordinates = Coordinates;
module.exports.Event = Event;
