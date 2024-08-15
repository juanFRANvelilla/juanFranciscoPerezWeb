fetch('http://192.168.0.128:8080/getTodayIncident')  // Asegúrate de que esta URL es correcta
    .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const incidentList = data.incidentList.map(incident => new Incident(
                incident.id,
                incident.date,
                incident.time,
                incident.status,
                incident.incidentType,
                incident.address,
                incident.duration,
                incident.latitude,
                incident.longitude,
                incident.incidentResources
            ));
            initMap(incidentList);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });



class Incident {
    constructor(id, date, time, status, incidentType, address, duration, latitude, longitude, incidentResources) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.status = status;
        this.incidentType = incidentType;
        this.address = address;
        this.duration = duration;
        this.latitude = latitude;
        this.longitude = longitude;
        this.resources = incidentResources.map(resource => resource.resource.name);
    }
}



async function initMap(incidentList) {


    const centerMap = {
        lat: 41.645268810703485, lng:-0.8966871819188688
    }

    const popupInfo = new google.maps.InfoWindow({
        minWidth: 300,
        maxWidth: 300
    })

    const mapOptions = {
        center: centerMap,
        zoom: 12,
        disableDefaultUI: true,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#686868"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "lightness": "-22"
                    },
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#b4b4b4"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "saturation": "-51"
                    },
                    {
                        "lightness": "11"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "saturation": "3"
                    },
                    {
                        "lightness": "-56"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": "-52"
                    },
                    {
                        "color": "#9094a0"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "weight": "6.13"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "weight": "1.24"
                    },
                    {
                        "saturation": "-100"
                    },
                    {
                        "lightness": "-10"
                    },
                    {
                        "gamma": "0.94"
                    },
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#b4b4b4"
                    },
                    {
                        "weight": "5.40"
                    },
                    {
                        "lightness": "7"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#231f1f"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "visibility": "simplified"
                    },
                    {
                        "color": "#595151"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "lightness": "-16"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "on"
                    },
                    {
                        "color": "#d7d7d7"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "color": "#282626"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "saturation": "-41"
                    },
                    {
                        "lightness": "-41"
                    },
                    {
                        "color": "#2a4592"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "weight": "1.10"
                    },
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "lightness": "-16"
                    },
                    {
                        "weight": "0.72"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "lightness": "-37"
                    },
                    {
                        "color": "#2a4592"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "color": "#eeed6a"
                    }
                ]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "visibility": "off"
                    },
                    {
                        "color": "#0a0808"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#b7e4f4"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    }

    const iconUrl = 'https://images.vexels.com/media/users/3/143424/isolated/preview/2aa6cd7edd894a7cefa4eaf0f5916ee9-rayo-pequeno.png'

    const bounds = new google.maps.LatLngBounds();

    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions)

    incidentList.forEach(incident => {
        const marker = new google.maps.Marker({
            position: { lat: incident.latitude, lng: incident.longitude },
            map: map,
            icon: {
                url: iconUrl,  // URL del icono
                scaledSize: new google.maps.Size(32, 32),  // Ajusta el tamaño del icono
                origin: new google.maps.Point(0, 0),  // Origen del icono (0,0) por defecto
                anchor: new google.maps.Point(16, 16)  // Ancla el icono en el centro
            }
        });

        const popup = `
        <div class="feh-content">
            <h2>${incident.incidentType}</h2>
            <h3>${incident.address}</h3>
            <p>Recursos: ${incident.resources.join(', ')}</p>
        </div>`;

        google.maps.event.addListener(marker, 'click', function() {
            popupInfo.setContent(popup);
            popupInfo.open(map, marker);
        });

        bounds.extend(new google.maps.LatLng(incident.latitude, incident.longitude));
        map.fitBounds(bounds);
    });



}




    
