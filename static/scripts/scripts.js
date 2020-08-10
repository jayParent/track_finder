// Set multiple attributes at once on hmtl element
function setAttributes(element, attributes) {
    for (var key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// For Bootstrap tooltip
$(document).ready(function () {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});