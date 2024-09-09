document.getElementById('download-cv').addEventListener('click', function() {
    const link = document.createElement('a');
    link.href = 'static/cv/JuanFranciscoPerez CV.pdf'; 
    link.download = 'JuanFranciscoPerez CV.pdf'; 
    link.style.display = 'none'; 
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link); 
});

