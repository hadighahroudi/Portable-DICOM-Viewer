function setViewportForElement(element) {
    let viewport = cornerstone.getViewport(element);
    viewport.voi.windowWidth = parseFloat(document.getElementById("ww").value);
    viewport.voi.windowCenter = parseFloat(document.getElementById("wc").value);
    cornerstone.setViewport(element, viewport);
}

function invertElement(element) {
    let viewport = cornerstone.getViewport(element);
    viewport.invert = !viewport.invert;
    cornerstone.setViewport(element, viewport);
}

// Add event handler to the ww/wc apply button
document.getElementById("apply").addEventListener("click", function (e) {
    setViewportForElement(element_cc_dcm);
    setViewportForElement(element_mlo_dcm);
});

document.getElementById("invert").addEventListener("click", function (e) {
    invertElement(element_cc_dcm);
    invertElement(element_mlo_dcm);
});

document.getElementById("reset").addEventListener("click", function (e) {
    cornerstone.reset(element_cc_dcm);
    cornerstone.reset(element_mlo_dcm);
    cornerstone.reset(element_cc_map);
    cornerstone.reset(element_mlo_map);
});

// add event handlers to mouse move to adjust window/center
function set_mouse_events_window(element, overlay) {
    overlay.addEventListener("mousedown", function (e) {
        let lastX = e.pageX;
        let lastY = e.pageY;

        function mouseMoveHandler(e) {
            const deltaX = e.pageX - lastX;
            const deltaY = e.pageY - lastY;
            lastX = e.pageX;
            lastY = e.pageY;

            let viewport = cornerstone.getViewport(element);
            viewport.voi.windowWidth += deltaX / viewport.scale;
            viewport.voi.windowCenter += deltaY / viewport.scale;
            cornerstone.setViewport(element, viewport);
        }

        function mouseUpHandler() {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
        }

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    });
}

//set_mouse_events_window(element_cc_dcm, element_cc_map);
//set_mouse_events_window(element_mlo_dcm, element_mlo_map);
