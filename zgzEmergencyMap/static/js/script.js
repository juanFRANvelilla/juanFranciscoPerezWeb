import { mapStyleLight } from './mapStyles/mapStyleLight.js';
import { mapStyleDark } from './mapStyles/mapStyleDark.js';

let mapStyleChoosed = mapStyleLight;


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
        return fullIncidentList; 
    }
    // mapStyleChoosed = mapStyleDark;
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
    // Define the center of the map
    const centerMap = {
        lat: 41.645268810703485,
        lng: -0.8966871819188688
    };

    // Initialize the InfoWindow for displaying incident details
    const popupInfo = new google.maps.InfoWindow({
        minWidth: 220,
        maxWidth: 240,
        height: 400
    });

    // Set the map options
    const mapOptions = {
        center: centerMap,
        zoom: 12,
        disableDefaultUI: true,
        styles: mapStyleChoosed
    };

    // Create a LatLngBounds object to manage map bounds
    const bounds = new google.maps.LatLngBounds();

    // Create the map instance
    const map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

    // Add markers for each incident
    incidentList.forEach(incident => {
        const iconUrl = selectIcon(incident.markerIcon);
        const marker = new google.maps.Marker({
            position: { lat: incident.latitude, lng: incident.longitude },
            map: map,
            icon: {
                url: iconUrl,
                scaledSize: new google.maps.Size(32, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(16, 16)
            }
        });

        // const popup = `
        //     <div class="incident-info">
        //         <h2>${incident.incidentType}</h2>
        //         <h4>${incident.address}</h4>
        //         <p>Recursos: ${incident.resources.join(', ')}</p>
        //     </div>
        // `;

        const popup = `
            <div class="incident-info">
                <h2>${incident.incidentType}</h2>
                <h4>${incident.address}</h4>
                <p>Recursos:</p>
                <ul>
                    ${incident.resources.map(resource => `<li>${resource}</li>`).join('')}
                </ul>
            </div>
        `;


        google.maps.event.addListener(marker, 'click', function() {
            popupInfo.setContent(popup);
            popupInfo.open(map, marker);
        });

        // Extend the bounds to include the new marker
        bounds.extend(new google.maps.LatLng(incident.latitude, incident.longitude));
    });

    // Fit the map bounds to include all markers
    map.fitBounds(bounds);

    // Set a maximum zoom level once the map has finished loading
    google.maps.event.addListenerOnce(map, 'idle', function() {
        const MAX_ZOOM = 12.8;
        if (map.getZoom() > MAX_ZOOM) {
            map.setZoom(MAX_ZOOM);
        }
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




    
