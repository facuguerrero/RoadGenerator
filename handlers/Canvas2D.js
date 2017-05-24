var canvas2DShader = null;

var curve_up_points = [[0.0, 1.0, 0.0], [0.0, 1.0, 0.0], [0.0, 1.0, 0.0]];
var curve_down_points = [[0.0, -1.0, 0.0], [0.0, -1.0, 0.0], [0.0, -1.0, 0.0]];

var curve_points = [[-0.4, -0.8, 0.0], [0.6, 0.0, 0.0], [-0.2, 0.6, 0.0]];
var curva = null;

class Canvas2D{

    contructor(){
        //
    }
    
    loadCanvas2D(){

        //se carga el canvas igual que el de principal pero con otro id
        canvas2D_gl.clearColor(1.0, 1.0, 1.0, 1.0);
        canvas2D_gl.enable(canvas2D_gl.DEPTH_TEST);
        canvas2D_gl.depthFunc(canvas2D_gl.LEQUAL);

        canvas2D_gl.clear(canvas2D_gl.COLOR_BUFFER_BIT|canvas2D_gl.DEPTH_BUFFER_BIT);
        canvas2D_gl.viewport(0, 0, canvas2D.width, canvas2D.height);

        this.initCanvasShaders();
        this.initCanvasHandlers();
        
    }


// Se cargan los shaders como en los del canvas principal pero teniendo en cuenta que este es 2D
    initCanvasShaders() {
        var fragmentShader = getShader(canvas2D_gl, "canvas2D-shader-vs");
        var vertexShader = getShader(canvas2D_gl, "canvas2D-shader-fs");

        canvas2DShader = canvas2D_gl.createProgram();
        canvas2D_gl.attachShader(canvas2DShader, vertexShader);
        canvas2D_gl.attachShader(canvas2DShader, fragmentShader);
        canvas2D_gl.linkProgram(canvas2DShader);

        if (!canvas2D_gl.getProgramParameter(canvas2DShader, canvas2D_gl.LINK_STATUS)) {
            alert("Error cargando los shaders.  " + canvas2D_gl.getProgramInfoLog(canvas2DShader));
            return null;
        }

        canvas2DShader.aVertexPosition = canvas2D_gl.getAttribLocation(canvas2DShader, "aVertexPosition");
        canvas2D_gl.enableVertexAttribArray(canvas2DShader.aVertexPosition);

        canvas2DShader.uVMatrix = canvas2D_gl.getUniformLocation(canvas2DShader, "uVMatrix");
        canvas2DShader.uPMatrix = canvas2D_gl.getUniformLocation(canvas2DShader, "uPMatrix");


        canvas2D_gl.useProgram(canvas2DShader);

        var PMatrix = mat4.create();
        var VMatrix = mat4.create();

        //al ser 2D se usa camara ortogonal
        mat4.ortho(PMatrix, -1.0, 1.0, -1.0, 1.0, -10, 10);
        mat4.lookAt(VMatrix, [0.0, 0.0, 10], [0.0, 0.0, 0.0], [0.0, 1.0, 0.0]);

        canvas2D_gl.uniformMatrix4fv(canvas2DShader.uPMatrix, false, PMatrix);
        canvas2D_gl.uniformMatrix4fv(canvas2DShader.uVMatrix, false, VMatrix);
    }

// Inicializa los handlers para el canvas 2D
    initCanvasHandlers() {
        canvas2D.onmousedown = this.onMousePressed;
        this.canvasUpdate();
    }

// Funcion comparadora auxiliar que ordena por coordenada y
    comparador(a, b) {
        return (a[1] - b[1]);
    }

// Regenera la curva y vuelve a dibujar
    canvasUpdate() {
        canvas2D_gl.clear(canvas2D_gl.COLOR_BUFFER_BIT|canvas2D_gl.DEPTH_BUFFER_BIT);

        //revisar y agregar toda la parte de la curva
        //curva = new CuadraticBSpline(3);
        //curva.setControlPoints(curve_down_points.concat(curve_points, curve_up_points));
        //curva.setupWebGLBuffers(0.1);
        //curva.grid.draw_2D();

        this.draw_points();
    }

// Vuelve al segmento inicial
    clear_points() {
        curve_points = [];
        canvasUpdate();
    }

    draw_points() {
        var pos_buffer = canvas2D_gl.createBuffer();
        var points = curve_down_points.concat(curve_points, curve_up_points);
        var aux = [];
        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < 3; j++) {
                aux.push(points[i][0]);
                aux.push(points[i][1]);
                aux.push(points[i][2]);
            }
        }
        canvas2D_gl.bindBuffer(canvas2D_gl.ARRAY_BUFFER, pos_buffer);
        canvas2D_gl.bufferData(canvas2D_gl.ARRAY_BUFFER, new Float32Array(aux), canvas2D_gl.STATIC_DRAW);
        pos_buffer.itemSize = 3;
        pos_buffer.numItems = aux.length/3;
        canvas2D_gl.vertexAttribPointer(canvas2DShader.aVertexPosition, 3, canvas2D_gl.FLOAT, false, 0, 0);

        canvas2D_gl.drawArrays(canvas2D_gl.POINTS, 0, pos_buffer.numItems);
    }



/*-------- Funciones de Input para el canvas 2D -----------*/

// El handler de click
    onMousePressed(e) {
        if (e.buttons == 1 && e.shiftKey == false) {	// Click izquierdo
            var x = 2*(e.pageX-canvas2D.offsetLeft)/canvas2D.width - 1.0;
            var y = -2*(e.pageY-canvas2D.offsetTop)/canvas2D.height + 1.0;
            curve_points.push([x, y, 0.0]);
            curve_points.sort(this.comparador);
            this.canvasUpdate();

        } else if (e.buttons == 1 && e.shiftKey == true) {	// Shift-click
            var x = 2*(e.pageX-canvas2D.offsetLeft)/canvas2D.width - 1.0;
            var y = -2*(e.pageY-canvas2D.offsetTop)/canvas2D.height + 1.0;
            if (curve_points.length > 0) {
                var index = this.get_closest_point_index(x, y);
                curve_points.splice(index, 1);
                this.canvasUpdate();
            }
        }
    }

/*-------------- Funciones Auxiliares ----------------*/

// Devuelve los puntos ingresados a la curva
    get_curve_input_points(){
        var tmp = [];
        for (var i = 0; i < curve_points.length; i++) {
            tmp[i] = [0.0, 0.0, 0.0];
            vec3.copy(tmp[i], curve_points[i]);
        }
        return tmp;
    }

// Obtiene el punto más cercano
    get_closest_point_index(x, y) {
        var min = null;
        var index = 0;
        var target = vec3.fromValues(x, y, 0.0);
        for (var i = 0; i < curve_points.length; i++) {
            var act = vec3.dist(curve_points[i], target);
            if (min == null || act < min) {
                min = act;
                index = i;
            }
        }
        return index;
    }

}
