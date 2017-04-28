<html>

<head lang="en">
	<meta charset="UTF-8">
	<title>TP de Sistemas Gráficos (66.71) - "El puente"</title>

	<style>
		body{ background-color: #00E676; }
		canvas{ background-color: #C51162; }
		textarea{ background-color: black; foreground-color: white;}
	</style>


	<script type="text/javascript" src="gl-matrix.js"></script>
	<script type="text/javascript" src="dat.gui.js"></script>
	<script type="text/javascript" src="scene.js"></script>
	<script type="text/javascript" src="input_handler.js"></script>
	<script type="text/javascript" src="curve_input.js"></script>
	<script type="text/javascript" src="shader_handler.js"></script>

	<script type="text/javascript" src="primitives/grid.js"></script>
	<script type="text/javascript" src="primitives/surfaces.js"></script>
	<script type="text/javascript" src="primitives/bspline.js"></script>
	<script type="text/javascript" src="primitives/terna.js"></script>
	<script type="text/javascript" src="primitives/circumference.js"></script>
	<script type="text/javascript" src="primitives/copa.js"></script>

	<script type="text/javascript" src="objects/tower_base.js"></script>
	<script type="text/javascript" src="objects/skybox.js"></script>
	<script type="text/javascript" src="objects/water.js"></script>
	<script type="text/javascript" src="objects/tensor.js"></script>
	<script type="text/javascript" src="objects/terrain.js"></script>
	<script type="text/javascript" src="objects/tower.js"></script>
	<script type="text/javascript" src="objects/bridge_base.js"></script>
	<script type="text/javascript" src="objects/arbol.js"></script>
	<script type="text/javascript" src="objects/bridge_side.js"></script>
	<script type="text/javascript" src="objects/bridge.js"></script>


	<!-- Shader de vértices para las curvas 2D -->
	<script id="curve-shader-vs" type="x-shader/x-vertex">
		attribute vec3 aVertexPosition;
		uniform mat4 uVMatrix;
		uniform mat4 uPMatrix;
		void main(void) {
			gl_Position = uPMatrix * uVMatrix * vec4(aVertexPosition, 1.0);
			gl_PointSize = 5.0;
		}
	</script>

	<!-- Shader de fragmentos para las curvas 2D -->
	<script id="curve-shader-fs" type="x-shader/x-fragment">
		void main(void) {
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		}
	</script>


	<!-- El script posta -->
	<script>

	var canvas = null;
	var gl = null;

	var glShaders = {};

	var glTextures = {};


	 // SHADERS FUNCTION
	function getShader(gl, id) {
		var shaderScript, src, currentChild, shader;

		// Obtenemos el elemento <script> que contiene el código fuente del shader.
		shaderScript = document.getElementById(id);
		if (!shaderScript) {
			return null;
		}

		// Extraemos el contenido de texto del <script>.
		src = "";
		currentChild = shaderScript.firstChild;
		while(currentChild) {
			if (currentChild.nodeType == currentChild.TEXT_NODE) {
				src += currentChild.textContent;
			}
			currentChild = currentChild.nextSibling;
		}

		// Creamos un shader WebGL según el atributo type del <script>.
		if (shaderScript.type == "x-shader/x-fragment") {
			shader = gl.createShader(gl.FRAGMENT_SHADER);
		} else if (shaderScript.type == "x-shader/x-vertex") {
			shader = gl.createShader(gl.VERTEX_SHADER);
		} else {
			return null;
		}

		// Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
		gl.shaderSource(shader, src);

		// Compilamos el shader.
		gl.compileShader(shader);

		// Chequeamos y reportamos si hubo algún error.
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert("Error compilando los shaders: " +
			gl.getShaderInfoLog(shader));
			return null;
		}

		return shader;
	}

	// Carga el canvas y obtiene el rendering context
	function initWebGL() {
		canvas = document.getElementById("my_canvas");
		try {
			gl = canvas.getContext("webgl");
		} catch (e) {
			console.log("Error cargando WebGL");
		}
	}

	// Configuración del canvas
	function setupWebGL() {
		gl.clearColor(0.44, 0.83, 1.0, 1.0);

		// Habilitando y configurando cómo tratar el buffer de profundidad
		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);

		gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

		// Configurando el viewport
		gl.viewport(0, 0, canvas.width, canvas.height);

	}


	function handleLoadedCubeMap(image, cubeMap) {

		gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap);
		gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + image.side, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		imageCount++;
		if (imageCount == 6) {
			imageCount = 0;
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		}
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	var imageCount = 0;

	function loadCubeMap(paths) {
		var cubeMap = gl.createTexture();
		imageCount = 0;
		for (var i = 0; i <= 5; i++) {
			var image = new Image();
			image.side = i;
			image.onload = function() {
				handleLoadedCubeMap(this, cubeMap);
			}
			image.src = paths[i];
		}

		return cubeMap;
	}

	function handleLoadedTexture(image, texture, clamp_edges) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
		if (clamp_edges) {
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		}
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}


	function loadTexture(path, clamp_edges) {
		var texture = gl.createTexture();
		var image = new Image();
		image.onload = function() {
			handleLoadedTexture(image, texture, clamp_edges);
		}
		image.src = path;

		return texture;
	}



	function initTextures() {

		// Cargo todas las texturas que voy a usar

		// CubeMap para el skybox/reflexiones
		var paths = ["textures/siege_ft.jpg",
			"textures/siege_bk.jpg",
			"textures/siege_up.jpg",
			"textures/siege_dn.jpg",
			"textures/siege_rt.jpg",
			"textures/siege_lf.jpg"];
		glTextures["skyboxCM"] = loadCubeMap(paths);

		glTextures["sky_ft"] = loadTexture("textures/siege_ft.jpg", true);
		glTextures["sky_bk"] = loadTexture("textures/siege_bk.jpg", true);
		glTextures["sky_up"] = loadTexture("textures/siege_up.jpg", true);
		glTextures["sky_dn"] = loadTexture("textures/siege_dn.jpg", true);
		glTextures["sky_rt"] = loadTexture("textures/siege_rt.jpg", true);
		glTextures["sky_lf"] = loadTexture("textures/siege_lf.jpg", true);

		// Para el agua
		glTextures["water_norm"] = loadTexture("textures/water_norm.jpg");

		// Para las torres
		glTextures["tower"] = loadTexture("textures/viga.jpg");
		glTextures["tower_norm"] = loadTexture("textures/viga_norm.jpg");

		// Para los tensores y los cables
		glTextures["tensor"] = loadTexture("textures/tensor.jpg");
		glTextures["tensor_norm"] = loadTexture("textures/uniform.jpg");

		glTextures["cable"] = loadTexture("textures/tensor.jpg");
		glTextures["cable_norm"] = loadTexture("textures/uniform.jpg");

		// Para la calle
		glTextures["road"] = loadTexture("textures/camino.jpg");
		glTextures["road_norm"] = loadTexture("textures/uniform.jpg");
		glTextures["street"] = loadTexture("textures/vereda.jpg");
		glTextures["street_norm"] = loadTexture("textures/vereda_norm.jpg");

		// Para el terreno
		glTextures["sand"] = loadTexture("textures/sand.jpg");
		glTextures["sand_norm"] = loadTexture("textures/sand_norm.jpg");
		glTextures["grass1"] = loadTexture("textures/grass01.jpg");
		glTextures["grass1_norm"] = loadTexture("textures/grass01_norm.jpg");
		glTextures["stone"] = loadTexture("textures/stone2.jpg");
		glTextures["stone_norm"] = loadTexture("textures/stone2_norm.jpg");
		glTextures["grass2"] = loadTexture("textures/pine.jpg");
		glTextures["grass2_norm"] = loadTexture("textures/pine_norm.jpg");
		glTextures["blend_map"] = loadTexture("textures/stone2_norm.jpg");

		// Para el arbol
		glTextures["leaves"] = loadTexture("textures/hojas.jpg");
		glTextures["leaves_norm"] = loadTexture("textures/uniform.jpg");
		glTextures["bark"] = loadTexture("textures/bark.jpg");
		glTextures["bark_norm"] = loadTexture("textures/bark_norm.jpg");

		// Auxiliares & debug
		glTextures["orange"] = loadTexture("textures/orange.jpg");
		glTextures["uniform"] = loadTexture("textures/uniform.jpg");
		glTextures["grid1"] = loadTexture("textures/uv_grid1.jpg");
		glTextures["grid2"] = loadTexture("textures/uv_grid2.jpg");
	}


	function initShaders() {
		// Creo el programa con los shaders para objetos coloreados
		var fragmentShader = getShader(gl, "shader-fs");
		var vertexShader = getShader(gl, "shader-vs");
		var waterShader = getShader(gl, "water-vs");

	}




	////////
	var time = 0;
	var pMatrix = mat4.create();
	var my_scene = null;
	var handler = null;
	function drawScene() {
		// Esto garantiza que se llame continuamente al drawScene
		requestAnimationFrame(drawScene);

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// Preparamos una matriz de perspectiva. (FOV, aspectRatio, z_front y z_back).
		mat4.perspective(pMatrix, 45, 1280.0/768.0, 0.1, 2000.0);

		var shader = glShaders["water"];
		gl.useProgram(shader);
		gl.uniform1f(shader.uTime, time);

		for (var elem in glShaders) {
			glShaderGeneric = glShaders[elem];
			gl.useProgram(glShaderGeneric);
			gl.uniformMatrix4fv(glShaderGeneric.uPMatrix, false, pMatrix);
		}

		my_scene.draw(time, handler.get_view_matrix(), handler.get_camera_pos());
		time += 0.02;
	}

	function loadHandler() {
		handler = new InputHandler();
		handler.setup_handlers();
	}

	function loadScene() {
		time = 0.0;
		curve_update();

		my_scene = new Scene();
		my_scene.init();
	}

	function loadShaders() {
		var handler = new ShaderHandler();
		handler.load();
	}

	var params = {
		// Terreno
		ter_ancho:400,
		ter_alto:16,
		rio_ancho:200,
		agua_alto:6,
		puente_pos:0.5,
		velocidad_mov:10.0,

		// Torres
		ancho_corte:0.2,
		prof_corte:0.7,
		reduccion:0.8,
		tower_reflect:true,

		// Puente
		puente_ph2:2,
		puente_ph3:20,
		puente_num_torres:3,
		puente_largo:150,
		puente_cur:0.8,
		puente_sep:2.5,
		puente_ancho:9.0,
		puente_nivel:true,


		line_strip:false,
		normals:true,
		specular:true,
		reflect:true,
		textures:true,
		reiniciar:loadScene,
		reset_curve:clear_points
	};

	function setupGUI() {

		var gui = new dat.GUI();

		var group_terrain = gui.addFolder('Terreno');
		group_terrain.add(params, 'ter_ancho', 200.0, 500.0).name('Tam. mapa').step(10);
		group_terrain.add(params, 'ter_alto', 2.0, 20.0).name('Elev. terreno').step(1);
		group_terrain.add(params, 'rio_ancho', 10.0, 200.0).name('Ancho rio').step(1);
		group_terrain.add(params, 'agua_alto', 1.0, 12.0).name('Nivel del agua').step(1);
		group_terrain.add(params, 'puente_pos', 0.1, 0.9).name('Pos. del puente').step(0.1);

		var group_puente = gui.addFolder('Puente');
		group_puente.add(params, 'puente_ph2', 0.0, 8.0).name('Elev. calle').step(0.1);
		group_puente.add(params, 'puente_ph3', 10.0, 50.0).name('Alt. torres').step(1.0);
		group_puente.add(params, 'puente_num_torres', 2.0, 6.0).name('Cant. torres').step(1.0);
		group_puente.add(params, 'puente_largo', 50.0, 500.0).name('Largo puente').step(10.0);
		group_puente.add(params, 'puente_cur', 0.2, 0.8).name('Curv. calle').step(0.05);
		group_puente.add(params, 'puente_sep', 1.0, 3.0).name('Dist. entre tirantes').step(0.2);
		group_puente.add(params, 'puente_ancho', 8.0, 10.0).name('Ancho puente').step(0.5);
		group_puente.add(params, 'puente_nivel').name('Nivelar altura máxima?');

		var group_torre = group_puente.addFolder('Torre');
		group_torre.add(params, 'ancho_corte', 0.1, 0.9).name('Ancho corte').step(0.05);
		group_torre.add(params, 'prof_corte', 0.1, 1.0).name('Prof. corte').step(0.05);
		group_torre.add(params, 'reduccion', 0.5, 1.0).name('Reduccion').step(0.05);

		var group_general = gui.addFolder('General');
		group_general.add(params, 'velocidad_mov', 0.1, 10.0).name('Veloc. de mov.').step(0.1);
		group_general.add(params, 'line_strip').name('LINE_STRIP?');
		group_general.add(params, 'normals').name('Normales?');
		group_general.add(params, 'textures').name('Texturas?');
		group_general.add(params, 'specular').name('Especular?');
		group_general.add(params, 'reflect').name('Reflexiones?');
		group_general.add(params, 'reiniciar').name("Reiniciar");
		group_general.add(params, 'reset_curve').name("Limpiar curva");

	}

	function main() {
		initWebGL();
		init_curve_canvas();
		if (gl && curve_gl) {
			setupWebGL();
			initShaders();
			initTextures();
			loadShaders();
			setupGUI();
			loadHandler();
			loadScene();
			requestAnimationFrame(drawScene);

		} else {
			console.log("Parece que no hay soporte WebGL");
			alert("Error: no hay soporte WebGL.");
		}
	}

	</script>

</head>

<!-- El cuerpo con el canvas definido -->
<body onload="main()" id="my_body">
	<center>
		<h1> TP Sistemas Gráficos (66.71) - "El puente"</h1>

		<div align="right">
			<canvas id="my_canvas" width="1060" height="650"></canvas>
			<canvas id="curve_canvas" width="200" height="200"></canvas>
		</div>
	</center>
	<h1> Controles </h1>
	Cámara y movimiento
	<ul>
		<li> W - Mover hacia adelante </li>
		<li> S - Mover hacia atrás</li>
		<li> A - Mover a la izquierda</li>
		<li> S - Mover a la derecha</li>
		<li> Q - Mover hacia arriba</li>
		<li> E - Mover hacia abajo</li>
		<li> 1 - Cámara en modo libre</li>
		<li> 2 - Cámara en modo órbita</li>
		<li> Mouse - Controlar órbita/dirección de la cámara</li>
	</ul>
	Opciones de terreno
	<ul>
		<li> Usar el panel lateral para parametrizar el terreno y luego usar Reiniciar para regenerar el nuevo mundo</li>
		<li> El panel blanco deja configurar la forma de la curva del río </li>
		<li> Click - Genera un punto de control para la curva</li>
		<li> Shift-Click - Elimina el punto de control más cercano al cursor</li>
		<li> Usar la opción Limpiar para eliminar todos los puntos de control</li>
	</ul>

</body>


</html>
