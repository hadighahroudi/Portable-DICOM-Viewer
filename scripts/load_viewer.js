// script.js
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWebImageLoader.external.cornerstone = cornerstone;

const element_cc_dcm = document.getElementById("dicomImage1");
const element_cc_map = document.getElementById("mapImage1");
const element_mlo_dcm = document.getElementById("dicomImage2");
const element_mlo_map = document.getElementById("mapImage2");

/*
1) Open your terminal and type
npm install -g http-server
2) Go to the root folder that you want to serve you files and type:
http-server ./
3) Read the output of the terminal, something kinda http://localhost:8080 will appear.
Everything on there will be allowed to be got. Example:
background: url('http://localhost:8080/waw.png');

OR better way is

Run the index.html with Live Server and use the provided address.
*/

// This is the main function responsible for loading all layers
// This method will wait for all images to be loaded (`loadImages`)
// before adding the layers
function loadLayers(element, layers) {
    loadImages(layers).then(function (images) {
        images.forEach(function (image, index) {
            const layer = layers[index];
            const layerId = cornerstone.addLayer(element, image, layer.options);

            cornerstone.updateImage(element);
            console.log('Layer ' + index + ': ' + layerId);
        });
    });
}


// This method loads the image of each layer and resolve the
// promise only after getting all of them loaded
function loadImages(layers) {
    const promises = [];

    layers.forEach(function (layer) {
        const loadPromise = cornerstone.loadAndCacheImage(layer.imageId);
        promises.push(loadPromise);
    });

    return Promise.all(promises);
}

function loadImagesAndMaps(cc_dcm_path, mlo_dcm_path, cc_map_path, mlo_map_path) {
    const element1 = document.getElementById("dicomImage1");
    const element2 = document.getElementById("dicomImage2");

    element1.style.height =
        Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        ).toString() + "px";
    element2.style.height =
        Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
        ).toString() + "px";


    const cc_layers = [
        {
            imageId: "wadouri:" + cc_dcm_path,
            options: {
                name: 'CC mammogram',
            }
        },
        {
            imageId: cc_map_path,
            options: {
                name: 'CC map',
                opacity: 0.6
            }
        }
    ];

    const mlo_layers = [{
        imageId: "wadouri:" + mlo_dcm_path,
        options: {
            name: 'MLO mammogram'
        }
    }, {
        imageId: mlo_map_path,
        options: {
            name: 'MLO map',
            opacity: 0.6
        }
    }
    ];

    cornerstone.enable(element1);
    cornerstone.enable(element2);

    loadLayers(element1, cc_layers);
    loadLayers(element2, mlo_layers);
}


function loadAndEnableElements(cc_dcm_path, mlo_dcm_path, cc_map_path, mlo_map_path) {
    //var imageContainers = document.getElementsByClassName("image-container");
    //for (let i = 0; i < imageContainers.length; i++) {
    //    imageContainers[i].style.height = Math.max(
    //        document.documentElement.clientHeight || 0,
    //        window.innerHeight || 0
    //    ).toString() + "px";
    //}

    // Function to load and display a DICOM image in a specified element
    function loadAndDisplayImage(element, uri) {
        cornerstone
            .loadImage(uri)
            .then(function (image) {
                cornerstone.displayImage(element, image);
            })
            .catch(function (error) {
                console.error("Error loading image:", error);
                // TODO : Handle mouse events in the case of no map. HINT: undefined elements have no viewport.
            });
    }

    // Image IDs for DICOM images (assuming local paths or DICOMweb URLs)
    // Use `wadouri:` prefix for URLs, like `wadouri:http://example.com/path/to/dicom.dcm`
    // Enable the elements for Cornerstone
    cornerstone.enable(element_cc_dcm);
    cornerstone.enable(element_cc_map);
    cornerstone.enable(element_mlo_dcm);
    cornerstone.enable(element_mlo_map);

    // Load and display the images

    loadAndDisplayImage(element_cc_dcm, "wadouri:" + cc_dcm_path);
    loadAndDisplayImage(element_mlo_dcm, "wadouri:" + mlo_dcm_path);
    loadAndDisplayImage(element_cc_map, cc_map_path);
    loadAndDisplayImage(element_mlo_map, mlo_map_path);

}

// Initialize cornerstone elements
//document.addEventListener("DOMContentLoaded", function () {
//    loadAndEnableElements();
//});

// Tab switching functionality
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        document.querySelector(".tab.active").classList.remove("active");
        tab.classList.add("active");
    });
});


var mouse_move_image = false;
$("#mouse_checkbox").on("change", function () {
    if (this.checked) {
        mouse_move_image = true;
    }
    else {
        mouse_move_image = false;
    }
});

$("#heatmap_checkbox").on("change", function () {
    if (this.checked) {
        $("#mapImage1").css("opacity", 0.2);
        $("#mapImage2").css("opacity", 0.2);
    }
    else {
        $("#mapImage1").css("opacity", 0); // I'll lose the mouse events if hide the element
        $("#mapImage2").css("opacity", 0);
    }
});

// // Load a DICOM viewer (e.g., using CornerstoneJS)
// function loadDicomImage(imageId) {
//   const element = document.getElementById("dicomImage");
//   // This would involve Cornerstone.js if you're displaying actual DICOM images.
//   // Cornerstone.loadImage(imageId).then((image) => {
//   //     Cornerstone.displayImage(element, image);
//   // });
// }

// // Placeholder for DICOM loading (needs a DICOM library for real functionality)
// loadDicomImage("path/to/dicom/file.dcm");
