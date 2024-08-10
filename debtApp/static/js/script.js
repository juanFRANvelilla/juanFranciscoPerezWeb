function showSection(sectionId) {
    var sections = document.querySelectorAll('.section-content');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}
