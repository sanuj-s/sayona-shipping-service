function initializeProgressBar() {

    window.addEventListener("scroll", function () {

        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const progress = (scrollTop / scrollHeight) * 100;

        const pb = document.getElementById("progress-bar");
        if (pb) pb.style.width = progress + "%";

    });

}
