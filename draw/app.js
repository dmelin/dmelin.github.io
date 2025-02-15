$(document).ready(function () {
    // Get the canvas and its context
    let activeLayer = 0;

    const canvasContainer = $("#canvas-container");
    const canvases = [];
    const ctxs = [];
    canvasContainer.find("canvas").each(function () {
        // Handle mouse events
        this.addEventListener('mousedown', startDrawing);
        this.addEventListener('mousemove', draw);
        this.addEventListener('mouseup', stopDrawing);
        this.addEventListener('mouseout', stopDrawing);

        canvases.push(this);
        ctxs.push(this.getContext('2d'));
    });

    // Variables to track drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Get UI elements
    const toolSelect = $('#tool-select');
    const colorPicker = $('#color-picker');
    const lineWidthInput = $('#line-width');
    const widthValueDisplay = $('#width-value');
    const clearButton = $('#clear-canvas');

    // Update width value display when slider changes
    lineWidthInput.on('input', function () {
        widthValueDisplay.text($(this).val());
    });

    // Clear canvas button
    clearButton.click(function () {
        ctxs[activeLayer].clearRect(0, 0, canvases[activeLayer].width, canvases[activeLayer].height);
    });

    // Function to start drawing
    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];

        // If fill tool is selected, do the fill operation
        if (toolSelect.val() === 'fill') {
            floodFill(e.offsetX, e.offsetY, colorPicker.val());
        }
    }

    // Function to handle drawing
    function draw(e) {
        if (!isDrawing || toolSelect.val() === 'fill') return;

        ctxs[activeLayer].strokeStyle = colorPicker.val();
        ctxs[activeLayer].lineWidth = lineWidthInput.val();
        ctxs[activeLayer].lineCap = 'round';
        ctxs[activeLayer].lineJoin = 'round';

        // Start a new path and move to the last position
        ctxs[activeLayer].beginPath();
        ctxs[activeLayer].moveTo(lastX, lastY);
        // Draw line to current position
        ctxs[activeLayer].lineTo(e.offsetX, e.offsetY);
        ctxs[activeLayer].stroke();

        // Update last position
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    // Function to stop drawing
    function stopDrawing() {
        isDrawing = false;
    }

    // Flood fill implementation
    function floodFill(startX, startY, fillColor) {
        // Get canvas data
        const imageData = ctxs[activeLayer].getImageData(0, 0, canvases[activeLayer].width, canvases[activeLayer].height);
        const width = imageData.width;
        const height = imageData.height;
        const data = imageData.data;

        // Get the color at the clicked position
        const startPos = (startY * width + startX) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];
        const startA = data[startPos + 3];

        // Convert the new fill color from hex to RGBA
        const fillColorRGB = hexToRgb(fillColor);

        // Don't do anything if the target color is the same as the fill color
        if (colorMatch(startR, startG, startB, startA,
            fillColorRGB.r, fillColorRGB.g, fillColorRGB.b, 255)) {
            return;
        }

        // Array to keep track of visited pixels
        const visited = new Array(width * height).fill(false);

        // Queue for flood fill algorithm
        const queue = [];
        queue.push(startY * width + startX);
        visited[startY * width + startX] = true;

        while (queue.length > 0) {
            const pixelPos = queue.shift();
            const x = pixelPos % width;
            const y = Math.floor(pixelPos / width);

            const dataPos = (y * width + x) * 4;

            // Set the pixel to the fill color
            data[dataPos] = fillColorRGB.r;
            data[dataPos + 1] = fillColorRGB.g;
            data[dataPos + 2] = fillColorRGB.b;
            data[dataPos + 3] = 255;

            // Check the four adjacent pixels
            checkPixel(x + 1, y);  // right
            checkPixel(x - 1, y);  // left
            checkPixel(x, y + 1);  // down
            checkPixel(x, y - 1);  // up
        }

        // Helper function to check if a pixel should be filled
        function checkPixel(x, y) {
            // If out of bounds, return
            if (x < 0 || y < 0 || x >= width || y >= height) {
                return;
            }

            const index = y * width + x;

            // If already visited, return
            if (visited[index]) {
                return;
            }

            const dataPos = index * 4;
            const r = data[dataPos];
            const g = data[dataPos + 1];
            const b = data[dataPos + 2];
            const a = data[dataPos + 3];

            // If color matches the start color, add to queue
            if (colorMatch(r, g, b, a, startR, startG, startB, startA)) {
                visited[index] = true;
                queue.push(index);
            }
        }

        // Put the modified image data back to the canvas
        ctxs[activeLayer].putImageData(imageData, 0, 0);
    }

    // Helper function to check if two colors match (with threshold)
    function colorMatch(r1, g1, b1, a1, r2, g2, b2, a2) {
        // Don't match transparent pixels with non-transparent pixels
        if ((a1 === 0) !== (a2 === 0)) {
            return false;
        }

        // If both pixels are fully transparent, consider them a match
        if (a1 === 0 && a2 === 0) {
            return true;
        }

        // For visible pixels, use a small threshold
        const threshold = 1;
        return Math.abs(r1 - r2) <= threshold &&
            Math.abs(g1 - g2) <= threshold &&
            Math.abs(b1 - b2) <= threshold;
    }

    // Helper function to convert hex color to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');

        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return { r, g, b };
    }

    const layerSelect = $('#layers input');
    layerSelect.change(function () {
        const selectedLayer = $(this).val();
        activeLayer = selectedLayer;
        
        const selectedCanvas = canvases[selectedLayer];

        canvases.forEach(function (canvas) {
            canvas.classList.add('not-focused');
        });

        selectedCanvas.classList.remove('not-focused');
    });
});