document.addEventListener('DOMContentLoaded', () => {
  let canvas = new fabric.Canvas('canvas')

  let $canvas_width_input  = document.getElementById('canvas-width-input')
  let $canvas_height_input = document.getElementById('canvas-height-input')

  // Initialize
  {
    // set canvas size into witdh and height setting
    $canvas_width_input.value  = canvas.getWidth()
    $canvas_height_input.value = canvas.getHeight()
  }
})
