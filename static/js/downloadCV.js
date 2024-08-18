document.getElementById('download-cv-spanish').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'static/cv/JuanFranciscoPerez CV.pdf'; 
    link.download = 'JuanFranciscoPerez CV.pdf'; 
    link.style.display = 'none'; 
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
});





document.getElementById('download-cv-english').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'static/cv/JuanFranciscoPerez Resume.pdf'; 
    link.download = 'JuanFranciscoPerez Resume.pdf'; 
    link.style.display = 'none'; 
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
});