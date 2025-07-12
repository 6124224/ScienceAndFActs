document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('overlay');
    
    // Toggle sidebar
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
        sidebarToggle.classList.toggle('open');
    });
    
    // Close sidebar when clicking on overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('open');
        overlay.classList.remove('open');
        sidebarToggle.classList.remove('open');
    });
    
    // Close sidebar when clicking on a link
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            sidebarToggle.classList.remove('open');
        });
    });
});