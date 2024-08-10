document.addEventListener('DOMContentLoaded', function() {
    const infoLink = document.getElementById('info-link');
    const testLink = document.getElementById('test-link');
    const infoDiv = document.getElementById('info-div');
    const testDiv = document.getElementById('test-div');
    const footer = document.getElementById('footer');

    function hideAllDivs() {
        infoDiv.style.display = 'none';
        testDiv.style.display = 'none';
        footer.style.position = 'static'; 

        infoLink.querySelector('button').classList.remove('active');
        testLink.querySelector('button').classList.remove('active');
    }

    function showDiv(divToShow, buttonToActivate, makeFooterFixed = false) {
        hideAllDivs();
        divToShow.style.display = 'block';
        buttonToActivate.classList.add('active'); 
        if (makeFooterFixed) {
            footer.style.position = 'fixed';
            footer.style.bottom = '0';
            footer.style.left = '0';
        }
    }

    infoLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        showDiv(infoDiv, infoLink.querySelector('button'));
    });

    testLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        showDiv(testDiv, testLink.querySelector('button'), true);
    });

    showDiv(infoDiv, infoLink.querySelector('button')); 
});
