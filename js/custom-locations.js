// update your access token here
L.mapbox.accessToken = "pk.eyJ1IjoiaG9vcGxhcHVudGEiLCJhIjoiY2p2MDI0Nzl5MG1jdjQ0cGhiYjBvbXoxNSJ9.P3hC9pWKw6rFFLCB6Q4W6g";

var map = L.mapbox.map('map', 'mapbox.light') // update with your own map id
    .setView([39.50, -98.35], 4);

var listings = document.getElementById('listings');
var locations = L.mapbox.featureLayer().addTo(map);

locations.loadURL('js/bigskinnylocations.geojson'); // load in your own GeoJSON file here

function setActive(el) {
    var siblings = listings.getElementsByTagName('div');
    for (var i = 0; i < siblings.length; i++) {
        siblings[i].className = siblings[i].className
            .replace(/active/, '').replace(/\s\s*$/, '');
    }

    el.className += ' active';
}

locations.on('ready', function () {
    locations.eachLayer(function (locale) {

        // Shorten locale.feature.properties to just `prop` so we're not
        // writing this long form over and over again.

        var prop = locale.feature.properties;

        var listing = listings.appendChild(document.createElement('div'));
        listing.className = 'item';

        var link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title warning';

        switch (prop.BSType) {
            case "Specialty Store":
                link.className += " store";
                break;
            case "Event/Show":
                link.className += " show";
                break;
            case "Khol's":
                link.className += " kohl";
                break;
            case "JCPenney":
                link.className += " jcpenney";
                break;
            default:
                break;
        }

        if (prop.BSType == "Event/Show") {
            link.innerHTML += "Show: " + prop.ShowTitle +"<br/>" +prop.ShowDuration;
        } else {
            link.innerHTML += prop.Title;
        }

        // Each marker on the map.
        var popup = "<h3 class='" +link.className +"'>" + link.innerHTML + "</h3><div class='content'>";

        var details = listing.appendChild(document.createElement('div'));
        if (prop.Location.Address) {
            details.innerHTML = prop.Location.Address;
            popup += prop.Location.Address;
        } else {
            details.innerHTML = prop.Title;
            popup += prop.Title;
        }

        popup += "<br/><br/><a target='_blank' href='" +prop["Google Maps URL"] + "'>Show on Google Maps</a>";

        popup += "</div>";

        link.onclick = function () {
            setActive(listing);

            // When a menu item is clicked, animate the map to center
            // its associated locale and open its popup.
            map.setView(locale.getLatLng(), 16);
            locale.openPopup();
            return false;
        };

        // Marker interaction
        locale.on('click', function (e) {
            // 1. center the map on the selected marker.
            map.panTo(locale.getLatLng());

            // 2. Set active the markers associated listing.
            setActive(listing);
        });

        popup += '</div>';
        locale.bindPopup(popup);
    });
});

locations.on('layeradd', function (e) {
    var marker = e.layer;
    // marker.setIcon(L.icon({
    //     iconUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6362/marker.png', // load your own custom marker image here
    //     iconSize: [56, 56],
    //     iconAnchor: [28, 28],
    //     popupAnchor: [0, -34]
    // }));
});