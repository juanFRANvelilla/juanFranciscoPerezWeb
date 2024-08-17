let fullIncidentList = [];

// Llamar a getTodayIncident() al iniciar la pagina
document.addEventListener('DOMContentLoaded', (event) => {
    getTodayIncident();
});


const divCheckbox = document.getElementById('checkbox')



const toggleCheckbox = document.getElementById('toggle-checkbox');

toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        updateMapWithFilteredIncidents('OPEN');
    } else {
        updateMapWithFilteredIncidents('ALL');
    }
});

function filterIncidentsByStatus(status) {
    if (status === 'ALL') {
        return fullIncidentList; // Devuelve todos los incidentes si el estado es 'ALL'
    }
    return fullIncidentList.filter(incident => incident.status === status);
}

// Función para actualizar el mapa con los incidentes filtrados
async function updateMapWithFilteredIncidents(status) {
    const filteredIncidents = filterIncidentsByStatus(status);
    await initMap(filteredIncidents);
}


const datePicker = document.getElementById('datePicker');

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
}

// Set the date picker value to today's date
const today = new Date();
datePicker.value = getFormattedDate(today);

  // Add an event listener to log the selected date
datePicker.addEventListener('change', function() {
    const selectedDate = datePicker.value;  // Get the value of the input
    if(isCurrentDate(datePicker.value)){
        getTodayIncident()
    } else{
        console.log('No es fecha actual' , datePicker.value)
        getIncidentByDate(datePicker.value)
    }
    console.log(`Selected date: ${selectedDate}`);
});
    

    

function isCurrentDate(dateString) {
    // Create a Date object from the input string
    const inputDate = new Date(dateString);

    // Get the current date
    const today = new Date();

    // Compare the year, month, and day
    return (
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getDate() === today.getDate()
    );
}

async function getTodayIncident() {
    try {
        const response = await fetch('http://192.168.0.128:8080/getTodayIncident');  // Asegúrate de que esta URL es correcta
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Incidentes recibidos:', data);
        fullIncidentList = data.incidentList.map(incident => new Incident(
            incident.id,
            incident.date,
            incident.time,
            incident.status,
            incident.incidentType,
            incident.markerIcon,
            incident.address,
            incident.duration,
            incident.latitude,
            incident.longitude,
            incident.incidentResources
        ));
        const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');

        if (!hasOpenIncidents) {
            console.log('no hay incidentes abiertos')
            // document.getElementById('checkbox').style.display = 'none';
            divCheckbox.style.visibility = 'hidden';
        }
        await initMap(fullIncidentList);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function getIncidentByDate(date) {
    try {
        console.log('Hacer llamada para día', date);
        const formattedDate = encodeURIComponent(date);  
        const url = `http://192.168.0.128:8080/getIncidentByDate?date=${formattedDate}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        console.log('Data received:', data);
        fullIncidentList = data.incidentList.map(incident => new Incident(
            incident.id,
            incident.date,
            incident.time,
            incident.status,
            incident.incidentType,
            incident.markerIcon,
            incident.address,
            incident.duration,
            incident.latitude,
            incident.longitude,
            incident.incidentResources
        ));
        const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');

        if (!hasOpenIncidents) {
            divCheckbox.style.visibility = 'hidden';
        }
        await initMap(fullIncidentList);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}








class Incident {
    constructor(id, date, time, status, incidentType, markerIcon, address, duration, latitude, longitude, incidentResources) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.status = status;
        this.incidentType = incidentType;
        this.markerIcon = markerIcon;
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
        maxWidth: 300,
        height: 400
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

    
    



    const bounds = new google.maps.LatLngBounds();

    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions)

    incidentList.forEach(incident => {
        const iconUrl = selectIcon(incident.markerIcon)
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

function selectIcon(incident) {
    const defaultIcon = 'https://images.vexels.com/media/users/3/143424/isolated/preview/2aa6cd7edd894a7cefa4eaf0f5916ee9-rayo-pequeno.png';
    const fireIcon = '/zgzEmergencyMap/static/markerIcons/fireIcon2.png';
    const treeIcon = '/zgzEmergencyMap/static/markerIcons/treeIcon.png'

    if (incident.includes('FIRE')) {
        return fireIcon;
    } else if(incident.includes('TREE')){
        return treeIcon;
    }
    else {
        return defaultIcon;
    }
}




    
