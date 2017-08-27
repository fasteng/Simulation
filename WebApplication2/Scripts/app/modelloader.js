    var container, stats;
    var camera, scene1, renderer, objects, controls, axis, object, grids;
    var clock = new THREE.Clock();
    var SCALE = .02;

    con();
    var initPromise = new Promise(function (resolve, reject) {
        fontpromise.then(function () {
            init();
            resolve();
        });
    });
    window.addEventListener('loadModel', function (e) {

        initPromise.then(function () {
            loadModel(e.detail);
        });
    });

    function con() {
        scene1 = new THREE.Scene();
        container = document.getElementById('canvas');
        renderer = new THREE.WebGLRenderer();
        camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 2000);
        camera.position.set(2, 4, 5);
        controls = new THREE.TrackballControls(camera);

    }
    // init scene
    
    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };

    /*document.getElementById('layoutPanel').addEventListener('SlideComplete', function () {
        render();
    });*/

    function init() {
        if (!$(container).is(':visible')) {
            setTimeout(init, 500);
            return;
        }

        onWindowResize();

        container.scene = scene1;
        scene1.fog = new THREE.FogExp2(0x000000, 0.12);
        // Lights
        scene1.add(new THREE.AmbientLight(0xcccccc));
        var directionalLight = new THREE.DirectionalLight(0xeeeeee);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random();
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        scene1.add(directionalLight);

        //Axis
        
        axes = buildAxes(6);
        scene1.add(axes);

        grids = new THREE.Object3D();
        gridX = new THREE.GridHelper(20, 50);
        gridY = new THREE.GridHelper(20, 50);
        gridZ = new THREE.GridHelper(20, 50);
        gridY.rotateX(Math.PI / 2);
        gridZ.rotateZ(Math.PI / 2);
        grids.add(gridX);
        //grids.add(gridY);
        //grids.add(gridZ);
        scene1.add(grids);



        // Renderer

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize($(window).width(), $(window).height());
        container.appendChild(renderer.domElement);
        // Stats
        //stats = new Stats();
        //container.appendChild(stats.dom);
        // Controls
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;
        controls.keys = [65, 83, 68];
        controls.addEventListener('change', render);

        window.addEventListener('resize', onWindowResize, false);

        render();
        animate();
    }
    //
    function onWindowResize(event) {
        renderer.setSize($(window).width(), $(window).height());
        camera.aspect = $(window).width() / $(window).height();
        camera.updateProjectionMatrix();
    }
    //
    var t = 0;
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
    }
    //
    function render() {
        for (var i in labels) {
            labels[i].lookAt(camera.position);
        }
        renderer.render(scene1, camera);
    }

    function loadModel (jsoncontent){
        var loader = new THREE.AssimpJSONLoader();
        if (object != null) { scene1.remove(object) }
        object = loader.parse(jsoncontent);
        object.scale.multiplyScalar(SCALE);
        scene1.add(object);
        render();
        animate();
    }

    var uploader = new ss.SimpleUpload({
        button: $('#uploadModel'), // file upload button
        url: '/Home/UploadFile', // server side handler
        name: 'uploadfile', // upload parameter name        
        responseType: 'json',
        allowedExtensions: ['json'],
        hoverClass: 'ui-state-hover',
        focusClass: 'ui-state-focus',
        disabledClass: 'ui-state-disabled',
        dropzone: $('body'),
        onComplete: function (filename, response, btn) {
            if (!response) {
                alert(filename + 'upload failed');
                return false;
            }
            loadModel(JSON.parse(response.model));
            btn.innerText = filename;

            
            // do something with response...
        }
    });        