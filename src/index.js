document.addEventListener('DOMContentLoaded', () => {
  const canvas = new fabric.Canvas('js-canvas')

  // define app elements
  const elements = {}
  elements.$layout_area                         = document.getElementById('js-layout-area')
  elements.$canvas_import_svg_file              = document.getElementById('js-canvas-import-svg-file')
  elements.$canvas_import_background_image_file = document.getElementById('js-canvas-import-background-image-file')
  elements.$canvas_export_svg_file              = document.getElementById('js-canvas-export-svg-file')
  elements.$canvas_width                        = document.getElementById('js-canvas-width')
  elements.$canvas_height                       = document.getElementById('js-canvas-height')

  // Initialize
  {
    // set canvas size into witdh and height text
    elements.$canvas_width.innerHTML  = canvas.getWidth()
    elements.$canvas_height.innerHTML = canvas.getHeight()
  }

  // Set Event Listeners
  {
    // import svg file

    // import background file
    elements.$canvas_import_background_image_file.addEventListener('change', (e) => {
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
      // set canvas size into witdh and height text
      {
        const pow = Math.pow(10, 2)

        elements.$canvas_width.innerHTML  = Math.round(canvas.getWidth() * pow) / pow
        elements.$canvas_height.innerHTML = Math.round(canvas.getHeight() * pow) / pow
      }
    })

    // export svg file
    elements.$canvas_export_svg_file.addEventListener('click', (e) => {
      e.currentTarget.href = 'data:image/svg+xml;utf8,' + canvas.toSVG()
    })
  }
})
