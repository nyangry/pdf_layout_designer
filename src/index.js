document.addEventListener('DOMContentLoaded', () => {
  let canvas = new fabric.Canvas('canvas')

  // define app elements
  let elements = {}
  elements.$canvas_load_svg_file              = document.getElementById('canvas-load-svg-file')
  elements.$canvas_load_background_image_file = document.getElementById('canvas-load-background-image-file')
  elements.$canvas_width_input                = document.getElementById('canvas-width-input')
  elements.$canvas_height_input               = document.getElementById('canvas-height-input')

  // Initialize
  {
    // set canvas size into witdh and height setting
    elements.$canvas_width_input.value  = canvas.getWidth()
    elements.$canvas_height_input.value = canvas.getHeight()
  }
})
