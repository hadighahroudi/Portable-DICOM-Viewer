const zoomFactor = 0.05;
function set_zoomInOut_eventListeners(element) {
    document.getElementById('zoomIn').addEventListener('click', function (e) {
        const viewport = cornerstone.getViewport(element);
        viewport.scale += zoomFactor;
        cornerstone.setViewport(element, viewport);
    });

    document.getElementById('zoomOut').addEventListener('click', function (e) {
        const viewport = cornerstone.getViewport(element);
        viewport.scale -= zoomFactor;
        cornerstone.setViewport(element, viewport);
    });
}

// add event handlers to pan image or adjust window on mouse move
function set_mouse_events(element, overlay) {
    overlay.addEventListener('mousedown', function (e) {
        let lastX = e.pageX;
        let lastY = e.pageY;

        function mouseMoveHandler(e) {
            const deltaX = e.pageX - lastX;
            const deltaY = e.pageY - lastY;
            lastX = e.pageX;
            lastY = e.pageY;

            if ((mouse_move_image == true && e.ctrlKey == false) || (mouse_move_image == false && e.ctrlKey == true)) {
                const viewport_element = cornerstone.getViewport(element);
                const viewport_overlay = cornerstone.getViewport(overlay);

                viewport_element.translation.x += (deltaX / viewport_element.scale);
                viewport_element.translation.y += (deltaY / viewport_element.scale);

                viewport_overlay.translation.x += (deltaX / viewport_overlay.scale);
                viewport_overlay.translation.y += (deltaY / viewport_overlay.scale);

                cornerstone.setViewport(element, viewport_element);
                cornerstone.setViewport(overlay, viewport_overlay);
            }
            else {
                let viewport = cornerstone.getViewport(element);
                viewport.voi.windowWidth += deltaX / viewport.scale;
                viewport.voi.windowCenter += deltaY / viewport.scale;
                cornerstone.setViewport(element, viewport);
            }
        }

        function mouseUpHandler() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        }

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
}

function set_mouse_wheel_events_zoom(element, overlay) {
    const mouseWheelEvents = ['mousewheel', 'DOMMouseScroll'];
    mouseWheelEvents.forEach(function (eventType) {
        overlay.addEventListener(eventType, function (e) {
            // Firefox e.detail > 0 scroll back, < 0 scroll forward
            // chrome/safari e.wheelDelta < 0 scroll back, > 0 scroll forward
            let viewport_element = cornerstone.getViewport(element);
            let viewport_overlay = cornerstone.getViewport(overlay);
            if (e.wheelDelta < 0 || e.detail > 0) {
                viewport_element.scale -= zoomFactor;
                viewport_overlay.scale -= zoomFactor;
            } else {
                viewport_element.scale += zoomFactor;
                viewport_overlay.scale += zoomFactor;
            }

            cornerstone.setViewport(element, viewport_element);
            cornerstone.setViewport(overlay, viewport_overlay);

            // TODO: Prevent page from scrolling
            return false;
        });
    });
}


set_zoomInOut_eventListeners(element_cc_dcm);
set_zoomInOut_eventListeners(element_mlo_dcm);

//if (map_exists) { // Check if a map element exists or the images is not analysed and the elemet is removed. TODO: implement it for each cc and mlo maps
set_zoomInOut_eventListeners(element_cc_map);
set_zoomInOut_eventListeners(element_mlo_map);

set_mouse_events(element_cc_dcm, element_cc_map);
set_mouse_events(element_mlo_dcm, element_mlo_map);

set_mouse_wheel_events_zoom(element_cc_dcm, element_cc_map);
set_mouse_wheel_events_zoom(element_mlo_dcm, element_mlo_map);
//}
//else {
//    set_mouse_events(element_cc_dcm, element_cc_dcm);
//    set_mouse_events(element_mlo_dcm, element_mlo_dcm);

//    set_mouse_wheel_events_zoom(element_cc_dcm, element_cc_dcm);
//    set_mouse_wheel_events_zoom(element_mlo_dcm, element_mlo_dcm);
//}
