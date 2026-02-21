window.addEventListener("scroll", function() {
    const topBar = document.querySelector(".top-bar");
    const navbar = document.querySelector(".corporate-nav");
    
    // When scrolling past 40px (the height of the top bar)
    if (window.scrollY > 40) {
        if(topBar) topBar.classList.add("hidden");
        if(navbar) navbar.classList.add("docked");
    } else {
        if(topBar) topBar.classList.remove("hidden");
        if(navbar) navbar.classList.remove("docked");
    }
});
