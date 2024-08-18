import { mapStyleLight } from './mapStyles/mapStyleLight.js';
import { mapStyleDark } from './mapStyles/mapStyleDark.js';




let fullIncidentList = [];

let mapStyleChoosed = mapStyleLight;
const noIncidentImgDiv = document.getElementById('no-incident-img');
noIncidentImgDiv.style.display = 'none';
const noIncidentText = document.getElementById('no-incident-text');
const divCheckbox = document.getElementById('checkbox');
const googleMap = document.getElementById('google-map');
const toggleCheckbox = document.getElementById('toggle-checkbox');
const datePicker = document.getElementById('datePicker');

// Llamar a getTodayIncident() al iniciar la pagina
document.addEventListener('DOMContentLoaded', (event) => {
    getTodayIncident();
});



// Manejar la accion del checkbox para mostrar solo incidentes en cursos
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
        getTodayIncident(datePicker.value)
    } else{
        console.log('No es fecha actual' , datePicker.value)
        getIncidentByDate(datePicker.value)
    }
    console.log(`Selected date: ${selectedDate}`);
});
    

    

function isCurrentDate(dateString) {
    const inputDate = new Date(dateString);

    const today = new Date();
    return (
        inputDate.getFullYear() === today.getFullYear() &&
        inputDate.getMonth() === today.getMonth() &&
        inputDate.getDate() === today.getDate()
    );
}

function hiddenGoogleMap(dateString){
    const date = new Date(dateString);

    const formattedDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    googleMap.style.display = 'none'
    noIncidentImgDiv.style.display = 'flex';
    noIncidentText.textContent = `Vaya!! no hay incidencias disponibles para el ${formattedDate}`;
}

function showGoogleMap(){
    googleMap.style.display = 'flex'
    noIncidentImgDiv.style.display = 'none';
}


function hiddenCheckBox(){
    // Asegurar que el check box esta deseleccionado y que no pueda mantenerse seleccionado 
    toggleCheckbox.checked = false;
    divCheckbox.style.visibility  = 'hidden';
}

function showCheckBox(){
    console.log('mostrar check box')
    
    divCheckbox.style.visibility  = 'visible'
}





async function getTodayIncident(date) {
    try {
        const response = await fetch('http://192.168.0.128:8080/getTodayIncident'); 
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

        if(fullIncidentList.length == 0){
            hiddenGoogleMap(date);
            hiddenCheckBox();
        } else {
            showGoogleMap();
            const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');
            
            if (!hasOpenIncidents) {
                hiddenCheckBox();
            } else {
                
                showCheckBox();
            }
            
            console.log('abrir mapa')
            await initMap(fullIncidentList);
        }
        
        
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
        if(fullIncidentList.length == 0){
            hiddenGoogleMap(date);
            hiddenCheckBox();
        } else {
            showGoogleMap();
            const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');
            
            if (!hasOpenIncidents) {
                hiddenCheckBox();
            } else {
                showCheckBox();
            }
            
            console.log('abrir mapa')
            await initMap(fullIncidentList);
        }

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
    console.log('funcion de crear mapa')
    // Define the center of the map
    const centerMap = {
        lat: 41.645268810703485,
        lng: -0.8966871819188688
    };

    // Initialize the InfoWindow for displaying incident details
    const popupInfo = new google.maps.InfoWindow({
        minWidth: 220,
        maxWidth: 240,
        height: 300
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
    const map = new google.maps.Map(googleMap, mapOptions);

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


        const popup = `
            <div class="incident-info">
                <h4>${incident.incidentType}</h4>
                <p>${incident.address}</p>
                <p>Inicio: ${incident.time}</p>
                ${incident.status === 'CLOSED' ? `<p>Duración: ${incident.duration}</p>` : ''}
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
    const icons = {
        DEFAULT: '/zgzEmergencyMap/static/markerIcons/defaultIcon.png',
        FIRE: '/zgzEmergencyMap/static/markerIcons/fireIcon.png',
        TREE: '/zgzEmergencyMap/static/markerIcons/treeIcon.png',
        TRAFFIC: '/zgzEmergencyMap/static/markerIcons/trafficIcon.png', 
        ELEVATOR: '/zgzEmergencyMap/static/markerIcons/elevatorIcon.png',
        CONSTRUCTION: '/zgzEmergencyMap/static/markerIcons/buildIcon.png',
        ANIMALS: '/zgzEmergencyMap/static/markerIcons/animalIcon.png',
        DANGEROUSPRODUCT: '/zgzEmergencyMap/static/markerIcons/dangerProductIcon.png',
        BLOCKED: '/zgzEmergencyMap/static/markerIcons/blockedIcon.png',
        WATERDRAINAGE: '/zgzEmergencyMap/static/markerIcons/waterIcon.png',
    };

    const defaultIcon = icons.DEFAULT;
    
    for (const [key, value] of Object.entries(icons)) {
        if (incident.includes(key)) {
            return value;
        }
    }

    return defaultIcon;
}






    
