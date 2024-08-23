import { mapStyleLight } from './mapStyles/mapStyleLight.js';
import { mapStyleDark } from './mapStyles/mapStyleDark.js';

let fullIncidentList = [];
let filteredIncidents = []

let mapStyleChoosed = mapStyleLight;
const noIncidentImgDiv = document.getElementById('no-incident-img');
noIncidentImgDiv.style.display = 'none';
const noIncidentText = document.getElementById('no-incident-text');
const divCheckbox = document.getElementById('checkbox');
const googleMap = document.getElementById('google-map');
const toggleCheckbox = document.getElementById('toggle-checkbox');
const datePicker = document.getElementById('datePicker');
const lightStyleButton = document.getElementById('light-style');
const darkStyleButton = document.getElementById('dark-style');
const styleSelector = document.getElementById('style-selector');




function handleStyleClick(selectedButton, otherButton, mapStyle) {
    selectedButton.classList.add('selected');
    otherButton.classList.remove('selected');

    mapStyleChoosed = mapStyle;
    if(toggleCheckbox.checked){
        initMap(filteredIncidents);
    } else {
        initMap(fullIncidentList)
    }

}

lightStyleButton.addEventListener('click', () => {
    handleStyleClick(lightStyleButton, darkStyleButton, mapStyleLight);
});

darkStyleButton.addEventListener('click', () => {
    handleStyleClick(darkStyleButton, lightStyleButton, mapStyleDark);
});


// Obtener la fecha actual
const today = new Date();
datePicker.value = getFormattedDate(today);

function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero
    return `${year}-${month}-${day}`;
}


// Llamar a getTodayIncident() al iniciar la pagina
document.addEventListener('DOMContentLoaded', (event) => {
    getTodayIncident(today);
});


// Agregar listener para manejar el cambio de fechas
datePicker.addEventListener('change', function() {
    const selectedDate = datePicker.value;  
    if(isCurrentDate(datePicker.value)){
        getTodayIncident(datePicker.value)
    } else{
        getIncidentByDate(datePicker.value)
    }
});



// Manejar la accion del checkbox para mostrar solo incidentes en cursos
toggleCheckbox.addEventListener('change', function() {
    if (this.checked) {
        initMap(filteredIncidents);
    } else {
        initMap(fullIncidentList);
    }
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
    divCheckbox.style.visibility  = 'visible'
}

function hiddenStyleSelector(){
    styleSelector.style.visibility  = 'hidden';
}

function showStyleSelector(){
    styleSelector.style.visibility  = 'visible'
}





// Filtrar los incidentes que estan 'OPEN' y asignarlo a la variable global
function filterIncidentsByStatus(status = 'OPEN') {
    filteredIncidents = fullIncidentList.filter(incident => incident.status === status);
}


async function getTodayIncident(date) {
    try {
        const response = await fetch('https://zgzemergencymapback.onrender.com/getTodayIncident'); 
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
            hiddenStyleSelector();
            hiddenCheckBox();
        } else {
            showStyleSelector();
            showGoogleMap();
            const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');
            
            if (!hasOpenIncidents) {
                hiddenCheckBox();
            } else {
                // Si tiene incidentes 'OPEN' se muestra el checkbox y se asigna esos incidentes a la variable filteredIncidents
                filterIncidentsByStatus()
                showCheckBox();
            }
            
            console.log('abrir mapa')
            await initMap(fullIncidentList);
        }
        
        
    } catch (error) {
        hiddenGoogleMap(date);
        hiddenCheckBox();
        console.error('There has been a problem with your fetch operation:', error);
    }
}

async function getIncidentByDate(date) {
    try {
        console.log('Hacer llamada para día', date);
        const formattedDate = encodeURIComponent(date);  
        const url = `https://zgzemergencymapback.onrender.com/getIncidentByDate?date=${formattedDate}`;

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
            hiddenStyleSelector();
        } else {
            showStyleSelector();
            showGoogleMap();
            const hasOpenIncidents = fullIncidentList.some(incident => incident.status === 'OPEN');
            
            if (!hasOpenIncidents) {
                hiddenCheckBox();
            } else {
                // Si tiene incidentes 'OPEN' se muestra el checkbox y se asigna esos incidentes a la variable filteredIncidents
                filterIncidentsByStatus()
                showCheckBox();
            }
            
            console.log('abrir mapa')
            await initMap(fullIncidentList);
        }

    } catch (error) {
        hiddenGoogleMap(date);
        hiddenCheckBox();
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
        lat: 41.645268810703485,
        lng: -0.8966871819188688
    };

    const popupInfo = new google.maps.InfoWindow({
        minWidth: 220,
        maxWidth: 240,
        height: 300
    });

    const mapOptions = {
        center: centerMap,
        zoom: 12,
        disableDefaultUI: true,
        styles: mapStyleChoosed
    };

    const bounds = new google.maps.LatLngBounds();

    const map = new google.maps.Map(googleMap, mapOptions);

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
                ${incident.status === 'CLOSED' && incident.duration ? `<p>Duración: ${incident.duration}</p>` : ''}
                ${incident.resources && incident.resources.length > 0 ? `
                <p>Recursos:</p>
                <ul>
                    ${incident.resources.map(resource => `<li>${resource}</li>`).join('')}
                </ul>` : ''}
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
    const iconsLight = {
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

    const iconsDark = {
        DEFAULT: '/zgzEmergencyMap/static/markerIcons/defaultIcon.png',
        FIRE: '/zgzEmergencyMap/static/markerIcons/fireIcon.png',
        TREE: '/zgzEmergencyMap/static/markerIcons/treeIcon.png',
        TRAFFIC: '/zgzEmergencyMap/static/markerIcons/trafficIcon.png', 
        ELEVATOR: '/zgzEmergencyMap/static/markerIcons/elevatorIconDark.png',
        CONSTRUCTION: '/zgzEmergencyMap/static/markerIcons/buildIcon.png',
        ANIMALS: '/zgzEmergencyMap/static/markerIcons/animalIconDark.png',
        DANGEROUSPRODUCT: '/zgzEmergencyMap/static/markerIcons/dangerProductIcon.png',
        BLOCKED: '/zgzEmergencyMap/static/markerIcons/blockedIcon.png',
        WATERDRAINAGE: '/zgzEmergencyMap/static/markerIcons/waterIconDark.png',
    };

    const icons = mapStyleChoosed === mapStyleDark ? iconsDark : iconsLight;

    const defaultIcon = icons.DEFAULT;
    
    for (const [key, value] of Object.entries(icons)) {
        if (incident.includes(key)) {
            return value;
        }
    }

    return defaultIcon;
}

// function selectIcon(incident) {
//     const icons = {
//         DEFAULT: '/zgzEmergencyMap/static/markerIcons/defaultIcon.png',
//         FIRE: '/zgzEmergencyMap/static/markerIcons/fireIcon.png',
//         TREE: '/zgzEmergencyMap/static/markerIcons/treeIcon.png',
//         TRAFFIC: '/zgzEmergencyMap/static/markerIcons/trafficIcon.png', 
//         ELEVATOR: '/zgzEmergencyMap/static/markerIcons/elevatorIcon.png',
//         CONSTRUCTION: '/zgzEmergencyMap/static/markerIcons/buildIcon.png',
//         ANIMALS: '/zgzEmergencyMap/static/markerIcons/animalIcon.png',
//         DANGEROUSPRODUCT: '/zgzEmergencyMap/static/markerIcons/dangerProductIcon.png',
//         BLOCKED: '/zgzEmergencyMap/static/markerIcons/blockedIcon.png',
//         WATERDRAINAGE: '/zgzEmergencyMap/static/markerIcons/waterIcon.png',
//     };

//     const defaultIcon = icons.DEFAULT;
    
//     for (const [key, value] of Object.entries(icons)) {
//         if (incident.includes(key)) {
//             return value;
//         }
//     }

//     return defaultIcon;
// }






    
