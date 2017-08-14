    var container, stats;
    var camera, scene, renderer, objects, controls, axis, object;
    var clock = new THREE.Clock();
    // init scene
    init();
    render();

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };
    var onError = function (xhr) {
    };

    function init() {
        container = document.createElement('div');
        document.getElementById('canvas').appendChild(container);
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(2, 4, 5);
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.12);
        // Lights
        scene.add(new THREE.AmbientLight(0xcccccc));
        var directionalLight = new THREE.DirectionalLight(0xeeeeee);
        directionalLight.position.x = Math.random() - 0.5;
        directionalLight.position.y = Math.random();
        directionalLight.position.z = Math.random() - 0.5;
        directionalLight.position.normalize();
        scene.add(directionalLight);

        //Axis
        axis = new THREE.AxisHelper(30);
        scene.add(axis);

        
        // Renderer
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        // Stats
        //stats = new Stats();
        //container.appendChild(stats.dom);
        // Controls
        controls = new THREE.TrackballControls(camera);
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
    }
    //
    function onWindowResize(event) {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
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
        
        renderer.render(scene, camera);
    }

    $("#UploadModel").change(function () {
        var data = new FormData();
        var files = $("#UploadModel").get(0).files;
        if (files.length > 0) {
            data.append("Model", files[0]);
        }

        $.ajax({
            // url: "Controller/ActionMethod"
            url: "/Home/UploadFile",
            type: "POST",
            processData: false,
            contentType: false,
            data: data,
            success: function (response) {
                //code after success
                $('#UploadModel + label').text(files[0].name)

                var loader = new THREE.AssimpJSONLoader();
                if(object != null){scene.remove(object)}
                object = loader.parse(response);
                object.scale.multiplyScalar(0.02);
                scene.add(object);
                render();
                animate();
                
            },
            error: function (er) {
                alert(er);
            }

        });
    });