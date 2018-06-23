import './app.scss';
require("fabric");

document.addEventListener('DOMContentLoaded', () => {
  const canvas = new fabric.Canvas('js-canvas')

  // define app elements
  const elements = {}
  elements.$layout_area                         = document.getElementById('js-layout-area')
  elements.$canvas_import_json_file             = document.getElementById('js-canvas-import-json-file')
  elements.$canvas_export_json_file             = document.getElementById('js-canvas-export-json-file')
  elements.$canvas_import_background_image_file = document.getElementById('js-canvas-import-background-image-file')
  elements.$canvas_export_svg_file              = document.getElementById('js-canvas-export-svg-file')
  elements.$canvas_width                        = document.getElementById('js-canvas-width')
  elements.$canvas_height                       = document.getElementById('js-canvas-height')
  elements.$tabs                                = document.querySelectorAll('.js-tab')
  elements.$tab_contents                        = document.querySelectorAll('.js-tab-content')
  elements.$object_list                             = document.querySelector('.js-object-list')

  // Initialize
  {
    // Indicates whether group selection should be disabled
    canvas.selection = false

    // set canvas size into witdh and height text
    elements.$canvas_width.innerHTML  = canvas.getWidth()
    elements.$canvas_height.innerHTML = canvas.getHeight()
  }

  // Set Event Listeners
  {
    let mouse_down_position = { x: 0, y: 0 }

    // import JSON file
    elements.$canvas_import_json_file.addEventListener('change', (e) => {
      const files  = e.target.files
      const reader = new FileReader()

      // skip when file not selected
      if (files.length === 0) {
        return
      }

      // load as plain JSON text
      reader.readAsText(files[0])

      reader.onload = () => {
        if (!files[0].type.startsWith('application/json')) {
          return
        }

        canvas.loadFromJSON(reader.result, () => {
          const background_image = JSON.parse(reader.result).backgroundImage

          canvas.setWidth(background_image.width)
          canvas.setHeight(background_image.height)
        })
      }
    })

    // export JSON file
    elements.$canvas_export_json_file.addEventListener('click', (e) => {
      e.currentTarget.href = 'data:application/json;utf8,' + JSON.stringify(canvas.toJSON())
    })

    // import background file
    elements.$canvas_import_background_image_file.addEventListener('change', (e) => {
      const files  = e.target.files
      const reader = new FileReader()

      // skip when file not selected
      if (files.length === 0) {
        return
      }

      reader.readAsDataURL(files[0])

      reader.onload = () => {
        if (!files[0].type.startsWith('image')) {
          return
        }

        fabric.Image.fromURL(reader.result, (background_image) => {
          const max_width = elements.$layout_area.offsetWidth;
          let new_canvas_width = background_image.width;
          let new_canvas_height = background_image.height;

          // reset canvas and background background_image
          if (background_image.width > max_width) {
            background_image.scaleToWidth(max_width, 1)

            new_canvas_width = max_width
            new_canvas_height = max_width / (background_image.width / background_image.height)
          }

          canvas.setBackgroundImage(background_image, canvas.renderAll.bind(canvas))
          canvas.setWidth(new_canvas_width)
          canvas.setHeight(new_canvas_height)
        })
      }
    })

    // on after canvas rendered
    canvas.on('after:render', () => {
      // set canvas size into witdh and height text
      {
        const pow = Math.pow(10, 2)

        elements.$canvas_width.innerHTML  = Math.round(canvas.getWidth() * pow) / pow
        elements.$canvas_height.innerHTML = Math.round(canvas.getHeight() * pow) / pow
      }

      reloadObjects()
    })

    // export SVG file
    elements.$canvas_export_svg_file.addEventListener('click', (e) => {
      e.currentTarget.href = 'data:image/svg+xml;utf8,' + canvas.toSVG()
    })

    // on mouse down
    canvas.on('mouse:down', (e) => {
      mouse_down_position = canvas.getPointer(e.e)
    })

    // on mouse up
    canvas.on('mouse:up', (e) => {
      const mouse_up_position = canvas.getPointer(e.e)

      // add Rect
      {
        let rect_width  = mouse_up_position.x - mouse_down_position.x
        let rect_height = mouse_up_position.y - mouse_down_position.y

        if (rect_width === 0 || rect_height === 0) {
          return;
        }

        canvas.add(new fabric.Rect({
          left: mouse_down_position.x,
          top: mouse_down_position.y,
          width: rect_width,
          height: rect_height,
          fill: 'rgba(0, 0, 255, 0.13)'
        }))
      }
    })

    // change tab
    elements.$tabs.forEach(($tab) => {
      $tab.addEventListener('click', (e) => {
        const $self = e.currentTarget;
        const index = [].indexOf.call(elements.$tabs, $self);

        elements.$tabs.forEach(($tab) => {
          $tab.classList.remove('is-active');
        });

        $self.classList.add('is-active');

        elements.$tab_contents.forEach(($tab_content) => {
          $tab_content.classList.remove('is-active');
        });

        elements.$tab_contents[index].classList.add('is-active');
      });
    });

    // select object
    canvas.on('selection:created', (e) => {
      console.log(e)

      selectObjectListTab();

      setActiveObjectOnObjectList(e.target);
    });

    canvas.on('selection:updated', (e) => {
      console.log(e)

      selectObjectListTab();

      setActiveObjectOnObjectList(e.target);
    });
  }

  // select object list tab
  const selectObjectListTab = () => {
    // TODO: fix by better code
    elements.$tabs[1].click()
  };


  // set active object on object list
  const setActiveObjectOnObjectList = (object) => {
    const $target_li = elements.$object_list.querySelector(`li[key="${object.ownMatrixCache.key}"]`);

    elements.$object_list.querySelectorAll('li').forEach(($li) => {
      $li.classList.remove('active-object');
    });

    $target_li.classList.add('active-object');
    console.log($target_li)
  };

  // reload objects
  const reloadObjects = () => {
    // console.log(canvas.getObjects());

    elements.$object_list.querySelectorAll('li').forEach(($li) => {
      $li.remove();
    });

    canvas.getObjects().forEach((object) => {
      let $li = document.createElement('li');
      let $span = document.createElement('span');

      $span.textContent = object.ownMatrixCache.key;
      $li.appendChild($span);

      $li.setAttribute('key', object.ownMatrixCache.key);

      elements.$object_list.appendChild($li);
    });
  };
})
