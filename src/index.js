document.addEventListener('DOMContentLoaded', () => {
  const canvas = new fabric.Canvas('canvas')

  // define app elements
  const elements = {}
  elements.$layout_area                       = document.getElementById('layout-area')
  elements.$canvas_load_svg_file              = document.getElementById('canvas-load-svg-file')
  elements.$canvas_load_background_image_file = document.getElementById('canvas-load-background-image-file')
  elements.$canvas_width                      = document.getElementById('canvas-width')
  elements.$canvas_height                     = document.getElementById('canvas-height')

  // Initialize
  {
    // set canvas size into witdh and height setting
    elements.$canvas_width.innerHTML  = canvas.getWidth()
    elements.$canvas_height.innerHTML = canvas.getHeight()
  }

  // Set Event Listeners
  {
    // load svg file

    // load background file
    elements.$canvas_load_background_image_file.addEventListener('change', (e) => {
      const files = e.target.files
      const reader = new FileReader()

      reader.readAsDataURL(files[0])
      reader.onload = () => {
        if (!reader.result.startsWith('data:image')) {
          return
        }

        fabric.Image.fromURL(reader.result, (background_image) => {
          const max_width = elements.$layout_area.offsetWidth

          // reset canvas and background background_image
          if (background_image.width > max_width) {
            canvas.setWidth()

            const background_image_aspect_ratio = background_image.width / background_image.height

            background_image.set({
              width: max_width,
              height: max_width / background_image_aspect_ratio
            })
          }

          canvas.setBackgroundImage(background_image, canvas.renderAll.bind(canvas))
          canvas.setWidth(background_image.width)
          canvas.setHeight(background_image.height)
        })
      }
    })

    // on after canvas rendered
    canvas.on('after:render', (e) => {
      elements.$canvas_width.innerHTML  = canvas.getWidth()
      elements.$canvas_height.innerHTML = canvas.getHeight()
    })
  }
})
