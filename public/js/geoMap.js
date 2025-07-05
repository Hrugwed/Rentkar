mapboxgl.accessToken = mapToken;

// Create marker element
const el = document.createElement('div');
el.className = 'custom-marker';

// Add translucent radius circle
const radius = document.createElement('div');
radius.className = 'radius-circle';
el.appendChild(radius);

// Add compass logo (FontAwesome, same as navbar)
const logo = document.createElement('span');
logo.className = 'compass-logo';
logo.innerHTML = '<i class="fa-solid fa-compass"></i>';
el.appendChild(logo);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: coordinates,
    zoom: 14
});

const popup = new mapboxgl.Popup({
    offset: 30,
    closeButton: false,
    closeOnClick: false
}).setHTML(`<h6>${listingTitle}</h6><p>${listingLocation}</p>`);

const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
    .setLngLat(coordinates)
    .addTo(map);

// Show popup on mouseenter, hide on mouseleave
el.addEventListener('mouseenter', () => {
    popup.setLngLat(coordinates).addTo(map);
});
el.addEventListener('mouseleave', () => {
    popup.remove();
});