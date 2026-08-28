window.addEventListener("load", function(){
    const loader = document.getElementById("pageLoader");

    if (!loader) {
        return;
    }

    loader.classList.add("loader-hidden");
    document.body.classList.remove("is-loading");
});
