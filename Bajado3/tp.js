/*
 Controlador estÃ¡tico para el teclado
 */
var Keyboard = {
    _pressed: {},  // teclas apretadas en este momento

    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32,
    N0: 48,
    N1: 49,
    N2: 50,
    N3: 51,
    N4: 52,
    N5: 53,
    N6: 54,
    N7: 55,
    N8: 56,
    N9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,

    isKeyPressed: function(keyCode, singleInput) {
        var pressed = this._pressed[keyCode];
        if(Utils.isDefined(singleInput) && singleInput)
            delete this._pressed[keyCode];
        return pressed;
    },

    //*********************************************

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { Keyboard.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Keyboard.onKeydown(event); }, false);

/*
 Sacada idea de acÃ¡:
 http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/
 *//*
 Controlador estÃ¡tico para el mouse
 */
var Mouse = {
    _x: 0,
    _y: 0,

    _deltaX: 0,
    _deltaY: 0,

    _wheelDelta: 0,

    _pressed: {},  // botones apretadas en este momento

    LEFT: 1,
    MIDDLE: 2,
    RIGHT: 3,

    isButtonPressed: function(button) {
        return Mouse._pressed[button];
    },

    getPosition: function() {
        return [Mouse._x, Mouse._y];
    },

    getX: function() {
        return Mouse._x;
    },

    getY: function() {
        return Mouse._y;
    },

    isMoving: function() {
        return Mouse._deltaX != 0 || Mouse._deltaY != 0;
    },

    getDeltaX: function() {
        var delta = Mouse._deltaX;
        Mouse._deltaX = 0;
        return delta;
    },

    getDeltaY: function() {
        var delta = Mouse._deltaY;
        Mouse._deltaY = 0;
        return delta;
    },

    isWheelMoving: function() {
        return Mouse._wheelDelta != 0;
    },

    getWheelDelta: function() {
        var delta = Mouse._wheelDelta;
        Mouse._wheelDelta = 0;
        return delta;
    },

    //*********************************************

    onmousedown: function(event) {
        Mouse._deltaX = 0;
        Mouse._deltaY = 0;
        event = event || window.event;
        var button = event.which || event.button;
        Mouse._pressed[button] = true;
    },

    onmouseup: function(event) {
        event = event || window.event;
        var button = event.which || event.button;
        delete Mouse._pressed[button];
    },

    onmousemove: function(event) {
        Mouse._deltaX = event.clientX-Mouse._x;
        Mouse._deltaY = event.clientY-Mouse._y;
        Mouse._x = event.clientX;
        Mouse._y = event.clientY;
    },

    onMouseWheel: function(event) {
        Mouse._wheelDelta = 0;
        if (!event) /* For IE. */
            event = window.event;
        if (event.wheelDelta) { /* IE/Opera. */
            Mouse._wheelDelta = event.wheelDelta/120;
        } else if (event.detail) { /** Mozilla case. */
            /** In Mozilla, sign of delta is different than in IE.
             * Also, delta is multiple of 3.
             */
            Mouse._wheelDelta = -event.detail/3;
        }
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
        if (event.preventDefault)
            event.preventDefault();

        event.returnValue = false;
    }
};

document.onmousedown = Mouse.onmousedown;
document.onmouseup = Mouse.onmouseup;
document.onmousemove = Mouse.onmousemove;

// inicializar event listener para rueda del mouse
if (window.addEventListener) // firefox
    window.addEventListener('DOMMouseScroll', Mouse.onMouseWheel, false);
// ie, opera
window.onmousewheel = document.onmousewheel = Mouse.onMouseWheel;/*
 Clase de utilidades con mÃ©todos estÃ¡ticos
 */
function Utils() {}

// MÃ©todos estÃ¡ticos
Utils.degToRad = function( rad ) {
    return rad*(Math.PI/180);
}

Utils.randomBetween = function( a, b ) {
    return a + Math.floor((Math.random() * b) + 1);
}

Utils.isDefined = function( val ) {
    return typeof val != 'undefined' && val != null;
}
/*
 Objeto transformable en el espacio
 */
function Transformable() {
    this._objectMatrix;  // matriz de transformaciones al objeto

    this.constructor();
}

// MÃ©todos
Transformable.prototype = (function() {
    var pr = {};
    var pu = Transformable.prototype;

    pu.constructor = function() {
        this._objectMatrix = mat4.create();
        pu.resetTransformations.call(this);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.translate = function( x, y, z ) {
        var m = mat4.create();
        mat4.translate(m, m, [x, y, z]);
        pu.applyTransformationMatrix.call(this, m, false);
    }

    pu.translateX = function( x ) {
        pu.translate.call(this, x, 0, 0, false);
    }

    pu.translateY = function( y ) {
        pu.translate.call(this, 0, y, 0, false);
    }

    pu.translateZ = function( z ) {
        pu.translate.call(this, 0, 0, z, false);
    }

    pu.rotate = function( rad, axis ) {
        var m = mat4.create();
        mat4.rotate(m, m, rad, axis);
        pu.applyTransformationMatrix.call(this, m, false);
    }

    pu.rotateX = function( rad ) {
        pu.rotate.call(this, rad, [1, 0, 0]);
    }

    pu.rotateY = function( rad ) {
        pu.rotate.call(this, rad, [0, 1, 0]);
    }

    pu.rotateZ = function( rad ) {
        pu.rotate.call(this, rad, [0, 0, 1]);
    }

    pu.setPosition = function( x, y, z ) {
        pu.resetTransformations.call(this);
        pu.translate.call(this, x, y, z);
    }

    pu.scale = function( factor ) {
        var m = mat4.create();
        mat4.scale(m, m, [factor, factor, factor]);
        pu.applyTransformationMatrix.call(this, m, false);
    }

    pu.scaleNonUniform = function( x, y, z ) {
        var m = mat4.create();
        mat4.scale(m, m, [x, y, z]);
        pu.applyTransformationMatrix.call(this, m, false);
    }

    pu.applyTransformationMatrix = function( matrix, reset ) {
        // Por defecto resetea transformaciones anteriores
        if(!Utils.isDefined(reset) || reset == true)
            pu.resetTransformations.call(this);
        // Siempre multiplica a izquierda
        mat4.multiply(this._objectMatrix, this._objectMatrix, matrix);
    }

    pu.resetTransformations = function() {
        mat4.identity(this._objectMatrix);
    }

    pu.getObjectMatrix = function() {
        return this._objectMatrix;
    }

    pu.getPosition = function() {
        // obtiene la posicion a partir de la matriz de transformaciones
        var v = vec3.create();
        var inverse = mat4.create();
        mat4.invert(inverse, this._objectMatrix);
        vec3.transformMat4(v, v, inverse);
        vec3.negate(v, v);
        return v;
    }

    return pu;
})();
/*
 Clase base para las curvas. Se definen a partir de los
 puntos de control y las bases.
 */
function Curve( ctrlPoints, basis ) {
    this._ctrlPoints;  // puntos de control originales

    this._basis;  // bases que definen los pesos de los puntos
    this._numbStretchs;  // cantidad de tramos

    this.constructor(ctrlPoints, basis);
}

// MÃ©todos
Curve.prototype = (function() {
    var pr = {};
    var pu = Curve.prototype;

    pu.constructor = function( ctrlPoints, basis ) {
        this._ctrlPoints = ctrlPoints;
        this._basis = basis;
        this._numbStretchs = ctrlPoints.length - this._basis.length + 1;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setControlPoints = function( newCtrlPoints ) {
        this._ctrlPoints = newCtrlPoints;
    }

    pu.getControlPoints = function() {
        return this._ctrlPoints;
    }

    pu.getPoints = function( definition ) {
        alert("Error: Abstract method not implemented");
        return;
    }

    return pu;
})();/*
 Curva tipo Bezier
 */
function BezierCurve( ctrlPoints, basis ) {
    this._continuousPoints;  // puntos para que los tramos queden continuos

    this.constructor(ctrlPoints, basis);
}

// MÃ©todos
BezierCurve.prototype = (function() {
    var pr = {};
    var pu = Object.create(Curve.prototype);

    pu.constructor = function( ctrlPoints, basis ) {
        Curve.prototype.constructor.call(this, ctrlPoints, this._basis);

        this._continuousPoints = [];
    }

    // MÃ©todos privados
    pr.pointAt = function( u ) {
        var basis = this._basis;
        var ctrlPoints = this._continuousPoints;

        if(ctrlPoints.length == 0)
            ctrlPoints = this._ctrlPoints;

        var stretch = Math.floor(u);
        var startPoint = stretch*(basis.length-1);
        var deltaU = u - stretch;

        var point = [];

        for(var c=0; c<3; c++) {
            point[c] = 0;
            for(var p=0; p<basis.length; p++) {
                point[c] += basis[p](deltaU)*ctrlPoints[startPoint+p][c];
            }
        }

        return point;
    }

    // MÃ©todos pÃºblicos
    pu.setContinuousPoints = function( contPoints ) {
        this._continuousPoints = contPoints;
    }

    pu.getPoints = function( definition ) {
        var points = [];
        var deltaU = 1 / definition;

        for (var u=deltaU; u<=this._numbStretchs-deltaU; u+=deltaU) {
            var point = pr.pointAt.call(this, u);
            points = points.concat([point]);
        }

        points.unshift(this._ctrlPoints[0]);
        points.push(this._ctrlPoints[this._ctrlPoints.length-1]);

        return points;
    }

    return pu;
})();/*
 Curva tipo BSpline
 */
function BSplineCurve( ctrlPoints, basis ) {
    this.constructor(ctrlPoints, basis);
}

// MÃ©todos
BSplineCurve.prototype = (function() {
    var pr = {};
    var pu = Object.create(Curve.prototype);

    pu.constructor = function( ctrlPoints, basis ) {
        Curve.prototype.constructor.call(this, ctrlPoints, this._basis);

    }

    // MÃ©todos privados
    pr.pointAt = function( u, stretch ) {
        var basis = this._basis;
        var ctrlPoints = this._ctrlPoints;

        var startPoint = stretch+basis.length>ctrlPoints.length?stretch-1:stretch;
        var deltaU = u - stretch;

        var point = [];

        for(var c=0; c<3; c++) {
            point[c] = 0;
            for(var p=0; p<basis.length; p++) {
                point[c] += basis[p](deltaU)*ctrlPoints[startPoint+p][c];
            }
        }

        return point;
    }

    // MÃ©todos pÃºblicos
    pu.getPoints = function( definition ) {
        var points = [];
        var deltaU = 1 / definition;
        var stretch = 0;

        for (var u=0; u<=this._numbStretchs+deltaU; u+=deltaU) {
            var point = pr.pointAt.call(this, u, stretch);
            points = points.concat([point]);

            if(Math.floor(u) > stretch)
                stretch++;
        }

        return points;
    }

    return pu;
})();/*
 Curva lineal. Son todas lineas rectas entre los puntos de control
 */
function LinearCurve( ctrlPoints ) {
    this._basis = [];
    this._basis[0] = function( u ) { return (1-u); }
    this._basis[1] = function( u ) { return u; }

    this.constructor(ctrlPoints);
}

// MÃ©todos
LinearCurve.prototype = (function() {
    var pr = {};
    var pu = Object.create(BezierCurve.prototype);

    pu.constructor = function( ctrlPoints ) {
        BezierCurve.prototype.constructor.call(this, ctrlPoints, this._basis);

    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Curva de Bezier cuadrÃ¡tica. Se obtienen puntos de control calculados
 para que curvas con mÃ¡s de 1 tramo (grado+1 < cant. puntos) se
 dibujen en forma continua.
 */
function QuadraticBezier( ctrlPoints ) {
    this._basis = [];
    this._basis[0] = function( u ) { return (1-u)*(1-u); }
    this._basis[1] = function( u ) { return 2*u*(1-u); }
    this._basis[2] = function( u ) { return u*u; }

    this.constructor(ctrlPoints);
}

// MÃ©todos
QuadraticBezier.prototype = (function() {
    var pr = {};
    var pu = Object.create(BezierCurve.prototype);

    pu.constructor = function( ctrlPoints ) {
        BezierCurve.prototype.constructor.call(this, ctrlPoints, this._basis);

        pu.setControlPoints.call(this, ctrlPoints);
    }

    // MÃ©todos privados
    pr.calculateContinuousPoints = function() {
        var numbPoints = this._ctrlPoints.length;
        var continuous = [];

        continuous.push(this._ctrlPoints[0]);

        for(var p=1; p<numbPoints-2; p++) {
            var p1 = vec3.create();
            var p2 = vec3.create();
            var middle = vec3.create();

            vec3.copy(p1, this._ctrlPoints[p]);
            vec3.copy(p2, this._ctrlPoints[p+1]);

            vec3.subtract(middle, p2, p1);
            vec3.scale(middle, middle, 0.5);
            vec3.add(middle, middle, p1);

            continuous.push(p1);
            continuous.push(middle);
        }

        continuous.push(this._ctrlPoints[numbPoints-2]);
        continuous.push(this._ctrlPoints[numbPoints-1]);

        pu.setContinuousPoints.call(this, continuous);
    }

    // MÃ©todos pÃºblicos
    // @Override
    pu.setControlPoints = function( newCtrlPoints ) {
        BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

        if(this._numbStretchs > 1)
            pr.calculateContinuousPoints.call(this);
    }

    return pu;
})();/*
 Curva de Bezier cÃºbica
 */
function CubicBezier( ctrlPoints ) {
    this._basis = [];
    this._basis[0] = function( u ) { return (1-u)*(1-u)*(1-u); }
    this._basis[1] = function( u ) { return 3*(1-u)*(1-u)*u; }
    this._basis[2] = function( u ) { return 3*(1-u)*u*u; }
    this._basis[3] = function( u ) { return u*u*u; }

    this.constructor(ctrlPoints);
}

// MÃ©todos
CubicBezier.prototype = (function() {
    var pr = {};
    var pu = Object.create(BezierCurve.prototype);

    pu.constructor = function( ctrlPoints ) {
        BezierCurve.prototype.constructor.call(this, ctrlPoints, this._basis);

        pu.setControlPoints.call(this, ctrlPoints);
    }

    // MÃ©todos privados
    pr.calculateContinuousPoints = function() {
        // TODO: averiguar como encontrar el punto de union
        // de los tramos de manera que queden C2 continuo
        alert("Error: bezier cÃºbica no soporta mÃ¡s de 4 puntos de control");
    }

    // MÃ©todos pÃºblicos
    // @Override
    pu.setControlPoints = function( newCtrlPoints ) {
        BezierCurve.prototype.setControlPoints.call(this, newCtrlPoints);

        if(this._numbStretchs > 1)
            pr.calculateContinuousPoints.call(this);
    }

    return pu;
})();/*
 Curva de BSpline cuadrÃ¡tica
 */
function QuadraticBSpline( ctrlPoints ) {
    this._basis = [];
    this._basis[0] = function( u ) { return 0.5*(1-u)*(1-u); }
    this._basis[1] = function( u ) { return 0.5 + u*(1-u); }
    this._basis[2] = function( u ) { return 0.5*u*u; }

    this.constructor(ctrlPoints);
}

// MÃ©todos
QuadraticBSpline.prototype = (function() {
    var pr = {};
    var pu = Object.create(BSplineCurve.prototype);

    pu.constructor = function( ctrlPoints ) {
        BSplineCurve.prototype.constructor.call(this, ctrlPoints, this._basis);

    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Curva de BSpline cÃºbica
 */
function CubicBSpline( ctrlPoints ) {
    this._basis = [];
    this._basis[0] = function( u ) { return (1-u)*(1-u)*(1-u)*1/6; }
    this._basis[1] = function( u ) { return (4-6*u*u+3*u*u*u)*1/6; }
    this._basis[2] = function( u ) { return (1+3*u+3*u*u-3*u*u*u)*1/6; }
    this._basis[3] = function( u ) { return u*u*u*1/6; }

    this.constructor(ctrlPoints);
}

// MÃ©todos
CubicBSpline.prototype = (function() {
    var pr = {};
    var pu = Object.create(BSplineCurve.prototype);

    pu.constructor = function( ctrlPoints ) {
        BSplineCurve.prototype.constructor.call(this, ctrlPoints, this._basis);

    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Conjunto de tramos definidos por puntos de varias curvas.
 Se le pueden aplicar transformaciones a todos los puntos.
 */
function Path( definition ) {
    this._curves;  // curvas que forman el camino
    this._definition;  // medida de puntos intermedios generados

    this.constructor(definition);
}

// MÃ©todos
Path.prototype = (function() {
    var pr = {};
    var pu = Object.create(Transformable.prototype);

    pu.constructor = function( definition ) {
        Transformable.prototype.constructor.call(this);

        this._curves = [];
        this._definition = definition;

        if(!Utils.isDefined(definition))
            this._definition = 1;
    }

    // MÃ©todos privados
    pr.transform = function( point ) {
        var vec = vec3.fromValues(point[0], point[1],
            Utils.isDefined(point[2]) && !isNaN(point[2])?point[2]:0);
        vec3.transformMat4(vec, vec, this._objectMatrix);
        return vec;
    }

    // MÃ©todos pÃºblicos
    pu.addStretch = function( curve ) {
        // agrega un nuevo tramo al camino
        this._curves.push(curve);
    }

    pu.getControlPoints = function() {
        var points = [];

        for(var c=0; c<this._curves.length; c++) {
            var curvePoints = this._curves[c].getControlPoints();
            for(var p=0; p<curvePoints.length; p++) {
                points = points.concat(pr.transform.call(this, curvePoints[p]));
            }
        }

        return points;
    }

    pu.getPoints = function() {
        var points = [];

        for(var c=0; c<this._curves.length; c++) {
            var curvePoints = this._curves[c].getPoints(this._definition);
            for(var p=0; p<curvePoints.length; p++) {
                points = points.concat(pr.transform.call(this, curvePoints[p]));
            }
        }

        return points;
    }

    pu.getKernelPoint = function( pts ) {
        var points = pts;

        if(!Utils.isDefined(points))
            points = pu.getControlPoints.call(this);

        var xKernel = 0;
        var yKernel = 0;
        var zKernel = 0;

        for(var p=0; p<points.length; p++) {
            xKernel += points[p][0];
            yKernel += points[p][1];
            zKernel += points[p][2];
        }

        xKernel /= points.length;
        yKernel /= points.length;
        zKernel /= points.length;

        return [xKernel, yKernel, zKernel];
    }

    return pu;
})();
/*
 Encapsula un buffer de Opengl
 */
function Buffer( gl, target ) {
    this._glContext;
    this._data;  // datos que guarda el buffer
    this._glBuffer;  // referencia al buffer
    this._target;  // tipo de buffer
    this._itemSize;  // tamaÃ±o de los items del buffer
    this._numItems;  // cantidad de items en el buffer

    this.constructor(gl, target);
}

// MÃ©todos
Buffer.prototype = (function() {
    var pr = {};
    var pu = Buffer.prototype;

    pu.constructor = function( gl, target ) {
        this._glContext = gl;
        this._glBuffer = gl.createBuffer();
        this._target = target;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.bind = function() {
        this._glContext.bindBuffer(this._target, this._glBuffer);
    }

    pu.setData = function( size, data ) {
        pu.bind.call(this);
        this._glContext.bufferData(this._target, data, this._glContext.STATIC_DRAW);
        this._data = data;
        this._itemSize = size;
        this._numItems = data.length / size;
    }

    pu.getData = function() {
        return this._data;
    }

    return pu;
})();/*
 Buffer para guardar datos sobre atributos
 */
function AttributeBuffer( gl ) {
    this.constructor(gl);
}

// MÃ©todos
AttributeBuffer.prototype = (function() {
    var pr = {};
    var pu = Object.create(Buffer.prototype);

    pu.constructor = function( gl ) {
        Buffer.prototype.constructor.call(this, gl, gl.ARRAY_BUFFER);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.setData = function( size, data ) {
        Buffer.prototype.setData.call(this, size, new Float32Array(data));
    }

    pu.associateAttrPointer = function( vertexAttr ) {
        if(vertexAttr >= 0) {
            var gl = this._glContext;
            Buffer.prototype.bind.call(this);
            gl.vertexAttribPointer(vertexAttr, this._itemSize, gl.FLOAT, false, 0, 0);
        }
    }

    return pu;
})();/*
 Buffer para guardar datos sobre indices y poder pintarlos
 */
function IndexBuffer( gl ) {
    this.constructor(gl);
}

// MÃ©todos
IndexBuffer.prototype = (function() {
    var pr = {};
    var pu = Object.create(Buffer.prototype);

    pu.constructor = function( gl ) {
        Buffer.prototype.constructor.call(this, gl, gl.ELEMENT_ARRAY_BUFFER);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.setData = function( data ) {
        Buffer.prototype.setData.call(this, 1, new Uint16Array(data));
    }

    pu.draw = function( mode ) {
        Buffer.prototype.bind.call(this);
        this._glContext.drawElements(mode, this._numItems, this._glContext.UNSIGNED_SHORT, 0);
    }

    return pu;
})();/*
 Obtiene el src GLSL y compila el shader
 */
function Shader( src, type ) {
    this._type;  // vertex o fragment
    this._src;  // codigo fuente del shader
    this.constructor( src, type );
}

// MÃ©todo estÃ¡tico
Shader.Type = Object.freeze({VERTEX: 0, FRAGMENT: 1});

Shader.obtainSrcFromHtmlElement = function( id ) {
    var shaderScript, currentChild;

    // Obtenemos el elemento <script> que contiene el cÃ³digo fuente del shader.
    shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    // Extraemos el contenido de texto del <script>.
    var src = "";
    currentChild = shaderScript.firstChild;
    while(currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
            src += currentChild.textContent;
        }
        currentChild = currentChild.nextSibling;
    }

    return src;
}

// MÃ©todos
Shader.prototype = (function() {
    var pr = {};
    var pu = Shader.prototype;

    pu.constructor = function( src, type ) {
        this._src = src;
        this._type = type;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.compile = function( gl ) {
        var shader;

        // Creamos un shader WebGL segÃºn el tipo.
        if (this._type == Shader.Type.FRAGMENT) {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (this._type == Shader.Type.VERTEX) {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        // Le decimos a WebGL que vamos a usar el texto como fuente para el shader.
        gl.shaderSource(shader, this._src);

        // Compilamos el shader.
        gl.compileShader(shader);

        // Chequeamos y reportamos si hubo algÃºn error.
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: " +
                gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    return pu;
})();/*
 Programa de shaders compuesto de un vertex y un fragment shader
 */
function ShaderProgram( vertexSrc, fragmentSrc ) {
    this._vertexShader;
    this._fragmentShader;

    this._program;  // referencia al programa linkeado

    this._assocAttributes;  // hashmap con los attributes localizados
    this._assocUniforms;  // hashmap con los uniforms localizados

    this.constructor( vertexSrc, fragmentSrc );
}

// MÃ©todos
ShaderProgram.prototype = (function() {
    var pr = {};
    var pu = ShaderProgram.prototype;

    pu.constructor = function( vertexSrc, fragmentSrc ) {
        pu.setSource.call(this, vertexSrc, fragmentSrc);
    }

    // MÃ©todos privados
    pr.link = function( gl ) {
        // Obtenemos los shaders ya compilados
        var vertexShader = this._vertexShader.compile(gl);
        var fragmentShader = this._fragmentShader.compile(gl);

        // Creamos un programa de shaders de WebGL.
        var shaderProgram = gl.createProgram();

        // Asociamos cada shader compilado al programa.
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // Linkeamos los shaders para generar el programa ejecutable.
        gl.linkProgram(shaderProgram);

        // Chequeamos y reportamos si hubo algÃºn error.
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: " +
                gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        this._program = shaderProgram;
    }

    // MÃ©todos pÃºblicos
    pu.init = function( gl ) {
        this._assocAttributes = [];
        this._assocUniforms = [];

        pr.link.call(this, gl);
    }

    pu.setSource = function( vertexSrc, fragmentSrc ) {
        if(Utils.isDefined(vertexSrc) && Utils.isDefined(fragmentSrc)) {
            this._vertexShader = new Shader(vertexSrc, Shader.Type.VERTEX);
            this._fragmentShader = new Shader(fragmentSrc, Shader.Type.FRAGMENT);
        }
    }

    pu.useThisProgram = function( gl ) {
        gl.useProgram(this._program);
    }

    pu.locateAttribute = function( gl, attr ) {
        var attrIdx = gl.getAttribLocation(this._program, attr);
        if(attrIdx >= 0) {
            gl.enableVertexAttribArray(attrIdx);
            this._assocAttributes[attr] = attrIdx;
        }
    }

    pu.locateUniform = function( gl, unif ) {
        var unifLoc = gl.getUniformLocation(this._program, unif);
        if(Utils.isDefined(unifLoc))
            this._assocUniforms[unif] = unifLoc;
    }

    pu.getAttribute = function( attr ) {
        return this._assocAttributes[attr];
    }

    pu.getUniform = function( unif ) {
        return this._assocUniforms[unif];
    }

    pu.associateAttribute = function( buffer, attr ) {
        var attribute = this._assocAttributes[attr];
        if(Utils.isDefined(attribute))
            buffer.associateAttrPointer(attribute);
    }

    return pu;
})();/*
 ShaderProgram bÃ¡sico con color sin iluminaciÃ³n
 */
function BasicColorSP() {
    this.constructor();
}

// MÃ©todos
BasicColorSP.prototype = (function() {
    var pr = {};
    var pu = Object.create(ShaderProgram.prototype);

    pu.constructor = function() {
        ShaderProgram.prototype.constructor.call(this);

        var vs = Shader.obtainSrcFromHtmlElement("basico-vs");
        var fs = Shader.obtainSrcFromHtmlElement("basico-fs");

        pu.setSource.call(this, vs, fs);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.init = function( gl ) {
        ShaderProgram.prototype.init.call(this, gl);

        pu.locateUniform.call(this, gl, "uPMatrix");
        pu.locateUniform.call(this, gl, "uMVMatrix");

        pu.locateAttribute.call(this, gl, "aVertexPosition");
        pu.locateAttribute.call(this, gl, "aVertexColor");
    }

    return pu;
})();/*
 ShaderProgram con iluminaciÃ³n y color
 */
function LightAndColorSP() {
    this.constructor();
}

// MÃ©todos
LightAndColorSP.prototype = (function() {
    var pr = {};
    var pu = Object.create(ShaderProgram.prototype);

    pu.constructor = function() {
        ShaderProgram.prototype.constructor.call(this);

        var vs = Shader.obtainSrcFromHtmlElement("conIluminacion-vs");
        var fs = Shader.obtainSrcFromHtmlElement("conIluminacion-fs");

        pu.setSource.call(this, vs, fs);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.init = function( gl ) {
        ShaderProgram.prototype.init.call(this, gl);

        pu.locateUniform.call(this, gl, "uPMatrix");
        pu.locateUniform.call(this, gl, "uMVMatrix");

        pu.locateAttribute.call(this, gl, "aVertexPosition");
        pu.locateAttribute.call(this, gl, "aVertexNormal");
        pu.locateAttribute.call(this, gl, "aVertexTangent");
        pu.locateAttribute.call(this, gl, "aVertexColor");

        pu.locateUniform.call(this, gl, "uNMatrix");
        pu.locateUniform.call(this, gl, "uUseLighting");
        pu.locateUniform.call(this, gl, "uAmbientColor");
        pu.locateUniform.call(this, gl, "uDirectionalColor");
        pu.locateUniform.call(this, gl, "uLightPosition");

        pu.locateUniform.call(this, gl, "uCarLightTransformedPosition");
        pu.locateUniform.call(this, gl, "uCarLightTransformedDirection");
        pu.locateUniform.call(this, gl, "uCarLightColor");
        pu.locateUniform.call(this, gl, "uCameraPos");

        pu.locateUniform.call(this, gl, "uShininess");
    }

    return pu;
})();/*
 ShaderProgram con textura
 */
function BasicTextureSP() {
    this.constructor();
}

// MÃ©todos
BasicTextureSP.prototype = (function() {
    var pr = {};
    var pu = Object.create(ShaderProgram.prototype);

    pu.constructor = function() {
        ShaderProgram.prototype.constructor.call(this);

        var vs = Shader.obtainSrcFromHtmlElement("basicoTextura-vs");
        var fs = Shader.obtainSrcFromHtmlElement("basicoTextura-fs");

        pu.setSource.call(this, vs, fs);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.init = function( gl ) {
        ShaderProgram.prototype.init.call(this, gl);

        pu.locateUniform.call(this, gl, "uPMatrix");
        pu.locateUniform.call(this, gl, "uMVMatrix");

        pu.locateAttribute.call(this, gl, "aVertexPosition");
        pu.locateAttribute.call(this, gl, "aTextureCoord");

        pu.locateUniform.call(this, gl, "uSampler");
    }

    return pu;
})();/*
 ShaderProgram con iluminaciÃ³n y textura
 */
function LightAndTextureSP() {
    this.constructor();
}

// MÃ©todos
LightAndTextureSP.prototype = (function() {
    var pr = {};
    var pu = Object.create(ShaderProgram.prototype);

    pu.constructor = function() {
        ShaderProgram.prototype.constructor.call(this);

        var vs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-vs");
        var fs = Shader.obtainSrcFromHtmlElement("conIluminacionYTextura-fs");

        pu.setSource.call(this, vs, fs);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.init = function( gl ) {
        ShaderProgram.prototype.init.call(this, gl);

        pu.locateUniform.call(this, gl, "uPMatrix");
        pu.locateUniform.call(this, gl, "uMVMatrix");
        pu.locateUniform.call(this, gl, "uNMatrix");

        pu.locateAttribute.call(this, gl, "aVertexPosition");
        pu.locateAttribute.call(this, gl, "aVertexNormal");
        pu.locateAttribute.call(this, gl, "aVertexTangent");
        pu.locateAttribute.call(this, gl, "aTextureCoord");

        pu.locateUniform.call(this, gl, "uSampler");
        pu.locateUniform.call(this, gl, "uSamplerLightMap");
        pu.locateUniform.call(this, gl, "uSamplerNormalMap");
        pu.locateUniform.call(this, gl, "uReflectionMap");

        pu.locateUniform.call(this, gl, "uAmbientColor");
        pu.locateUniform.call(this, gl, "uDirectionalColor");
        pu.locateUniform.call(this, gl, "uLightPosition");

        pu.locateUniform.call(this, gl, "uCarLightColor");
        pu.locateUniform.call(this, gl, "uCarLightTransformedPosition");
        pu.locateUniform.call(this, gl, "uCarLightTransformedDirection");

        pu.locateUniform.call(this, gl, "uShininess");
        pu.locateUniform.call(this, gl, "uReflectionFactor");
        pu.locateUniform.call(this, gl, "uUsingLightMap");
        pu.locateUniform.call(this, gl, "uLightMapFactor");
        pu.locateUniform.call(this, gl, "uUsingNormalMap");
        pu.locateUniform.call(this, gl, "uUsingReflectionMap");
    }

    return pu;
})();/*
 GeometrÃ­a base de vÃ©rtices y trÃ­angulos.
 */
function Geometry() {
    this._vertices;
    this._indexes;
    this._triangles;

    this._normals;
    this._tangents;

    this._type;

    this._levels;  // nro de vertices a lo largo
    this._faces;  // nro de vertices a lo ancho

    this.constructor();
}

// MÃ©todos
Geometry.prototype = (function() {
    var pr = {};
    var pu = Geometry.prototype;

    pu.constructor = function() {
        this._vertices = [];
        this._indexes = [];
        this._triangles = [];

        this._normals = [];
        this._tangents = [];

        this._levels = 0;
        this._faces = 0;
    }

    // MÃ©todos privados
    pr.calculateIndexes = function(levels, faces) {
        if (levels == 0 || faces == 0) {
            alert("Error: no se definieron las dimensiones de la geometria");
            return;
        }

        var indexes = [];

        for (var n = 1; n < levels; n++) {
            for (var c = 0; c < faces; c++) {
                var v1, v2;

                if (n % 2) {
                    v1 = (n - 1) * faces + c;
                    v2 = n * faces + c;
                } else {
                    v1 = n * faces - c - 1;
                    v2 = (n + 1) * faces - c - 1;
                }

                indexes = indexes.concat([ v1, v2 ]);

                if (c == faces - 1)
                    indexes = indexes.concat(v2);
            }
        }

        this._indexes = indexes;

        // Genero explicitamente los indices de los triangles strip
        for (var i = 0; i < (this._indexes.length) - 2; i++) {
            var triangle = vec3.fromValues(this._indexes[i],
                this._indexes[i + 1], this._indexes[i + 2]);
            this._triangles.push(triangle);
        }
    }

    pr.calculateNormals = function() {
        // Normales de cada triangulo en el mismo orden que aparecen
        var triangleNormals = [];

        // Normales de cada vertice, se inicializan en 0,0,0
        var vertexNormals = [];

        for (var i = 0 ; i < this._indexes.length ; i++) {
            var zero = vec3.fromValues(0,0,0);
            vertexNormals.push(zero);
        }

        // Calcular normales de cada triangulo
        for (var i = 0; i < this._triangles.length; i++) {

            // Obtengo las coordenadas de cada vertice del triangulo
            var indexV1 = this._triangles[i][0];
            var v1x = this._vertices[indexV1 * 3];
            var v1y = this._vertices[(indexV1 * 3) + 1];
            var v1z = this._vertices[(indexV1 * 3) + 2];
            var v1 = vec3.fromValues(v1x, v1y, v1z);

            var indexV2 = this._triangles[i][1];
            var v2x = this._vertices[indexV2 * 3];
            var v2y = this._vertices[(indexV2 * 3) + 1];
            var v2z = this._vertices[(indexV2 * 3) + 2];
            var v2 = vec3.fromValues(v2x, v2y, v2z);

            var indexV3 = this._triangles[i][2];
            var v3x = this._vertices[indexV3 * 3];
            var v3y = this._vertices[(indexV3 * 3) + 1];
            var v3z = this._vertices[(indexV3 * 3) + 2];
            var v3 = vec3.fromValues(v3x, v3y, v3z);

            var vector1 = vec3.create();
            var vector2 = vec3.create();
            var normal = vec3.create();

            // Calculo la normal
            vec3.subtract(vector1, v2, v1);
            vec3.subtract(vector2, v3, v1);

            if(this._type==1 || this._type==2) {

                if(i%2==0) {
                    // triangulos contra reloj
                    vec3.cross(normal, vector1, vector2);
                }
                else {
                    // triangulos a favor del reloj
                    vec3.cross(normal, vector2, vector1);
                }
            }
            else if (this._type==0) {
                if(i%2==0) {
                    // triangulos contra reloj
                    vec3.cross(normal, vector2, vector1);
                }
                else {
                    // triangulos a favor del reloj
                    vec3.cross(normal, vector1, vector2);
                }
            }

            vec3.normalize(normal, normal);

            triangleNormals.push(normal);

            // Acumulo normales de los vertices correspondientes
            vec3.add(vertexNormals[indexV1], vertexNormals[indexV1], normal);
            vec3.add(vertexNormals[indexV2], vertexNormals[indexV2], normal);
            vec3.add(vertexNormals[indexV3], vertexNormals[indexV3], normal);
        }

        if (this._type == 2) {
            for (var i = 0 ; i < vertexNormals.length ; i++) {
                var normal = vertexNormals[i];

                vec3.normalize(normal, normal);
                if (normal[1]>0) {
                    this._normals.push(0);
                    this._normals.push(1);
                    this._normals.push(0);
                }
                else if (normal[1] == 0) {
                    this._normals.push(normal[0]);
                    this._normals.push(normal[1]);
                    this._normals.push(normal[2]);
                }
                else {
                    this._normals.push(0);
                    this._normals.push(-1);
                    this._normals.push(0);
                }

            }
        }
        else {
            // Normalizar normales de cada vertice
            for (var i = 0 ; i < vertexNormals.length ; i++) {
                var normal = vertexNormals[i];

                vec3.normalize(normal, normal);

                this._normals.push(normal[0]);
                this._normals.push(normal[1]);
                this._normals.push(normal[2]);
            }
        }
    }

    // MÃ©todos pÃºblicos
    pu.setVertices = function( vertices ) {
        this._vertices = vertices;
    }

    pu.setIndexes = function( indexes ) {
        this._indexes = indexes;
    }

    pu.setNormals = function( normals ) {
        this._normals = normals;
    }

    pu.setTangents = function( tangents ) {
        this._tangents = tangents;
    }

    pu.defineDimensions = function( levels, faces ) {
        this._levels = levels;
        this._faces = faces;
    }

    pu.prepareGeometry = function() {
        // Este mÃ©todo serÃ¡ llamado en el momento de la
        // inicializaciÃ³n de la geometrÃ­a
    }

    pu.getVertices = function() {
        return this._vertices;
    }

    pu.getIndexes = function() {
        if (this._indexes.length == 0)
            pr.calculateIndexes.call(this, this._levels, this._faces);

        return this._indexes;
    }

    pu.getNormals = function() {
        if (this._normals.length == 0)
            pr.calculateNormals.call(this);
        return this._normals;
    }

    pu.getTangents = function() {
        if (this._tangents.length == 0) {
            var n = this._normals;

            for (var i=0; i<n.length; i+=3) {
                var normal = vec3.fromValues(n[i],n[i+1],n[i+2]);
                var tangent = vec3.create();

                var c1 = vec3.create();
                var c2 = vec3.create();

                vec3.cross(c1, normal, vec3.fromValues(0.0, 0.0, 1.0));
                vec3.cross(c2, normal, vec3.fromValues(0.0, 1.0, 0.0));

                if(vec3.len(c1) > vec3.len(c2))
                    tangent = vec3.clone(c1);
                else
                    tangent = vec3.clone(c2);

                vec3.normalize(tangent, tangent);
                tangent = [tangent[0], tangent[1], tangent[2]];
                this._tangents = this._tangents.concat(tangent);
            }
        }
        return this._tangents;
    }

    pu.invertNormals = function() {
        // invierte el type para que calcule las normales del otro tipo
        this._type = 1 - this._type;
    }

    return pu;
})();/*
 Superficie de barrido. Se define una figura inicial y un camino
 de barrido. En cada punto del camino imprimirÃ¡ la figura
 correspondiente. Las figuras que se definan luego deberÃ¡n tener
 exactamente la misma cantidad de puntos que la inicial
 */
function SweptSurface( sweptPath, initialShape ) {
    this._sweptPath;  // recorrido donde se ubican las figuras
    this._shapes;  // formas de corte a lo largo del camino

    this._closedShapes;  // une los puntos iniciales y finales
    this._closedEndings;  // agrega triangulos en los extremos
    this._centerInKernel;  // centra el modelo generado en su kernel
    this._type=0;
    this.constructor(sweptPath, initialShape);
}

// MÃ©todos
SweptSurface.prototype = (function() {
    var pr = {};
    var pu = Object.create(Geometry.prototype);

    pu.constructor = function( sweptPath, initialShape ) {
        Geometry.prototype.constructor.call(this);

        this._closedShapes = true;
        this._closedEndings = true;
        this._centerInKernel = true;

        pu.init.call(this, sweptPath, initialShape);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.init = function( sweptPath, initialShape ) {
        if(Utils.isDefined(sweptPath) && Utils.isDefined(initialShape)) {
            this._shapes = new PointCloud();
            this._sweptPath = sweptPath;
            pu.addShape.call(this, initialShape, 0);
        }
    }

    pu.setClosedShapes = function( closed ) {
        this._closedShapes = closed;
    }

    pu.setClosedEndings = function( closed ) {
        this._closedEndings = closed;
    }

    pu.setCenteredInKernel = function( centered ) {
        this._centerInKernel = centered;
    }

    pu.addShape = function( shape, at ) {
        this._shapes.addSection(shape, at);
    }

    // @override
    pu.prepareGeometry = function( gl ) {
        var shapes = this._shapes;
        var cloudPointKernel = shapes.getKernelPoint();

        var path = this._sweptPath.getPoints();
        var pathKernel = this._sweptPath.getKernelPoint();

        var nodes = path.length;
        var faces = shapes.getSectionPoints(0).length;

        if(this._closedEndings)
            nodes+=2;

        if(this._closedShapes)
            faces++;

        var vertices = [];

        for(var n=0; n<nodes; n++) {
            var currPointSpace = mat4.create();
            var up = [0,1,0];
            var isEnding = this._closedEndings && (n==0 || n==nodes-1);
            var currShapePoints;
            var currShapeKernel;

            if(!isEnding) {
                var node = this._closedEndings?n-1:n;
                var totalNodes = nodes-(this._closedEndings?2:0);

                var actual = vec3.create();
                var next = vec3.create();
                var dir = vec3.create();

                vec3.copy(actual, path[node]);

                if(node < totalNodes-1) {
                    vec3.copy(next, path[node+1]);
                    vec3.subtract(dir, next, actual);
                    vec3.normalize(dir, dir);
                }
                else {
                    vec3.subtract(dir, actual, path[node-1]);
                    vec3.normalize(dir, dir);
                    var last = vec3.create();
                    vec3.add(last,dir,actual);
                    next = last;
                }

                if(vec3.distance(up, dir) == 0) {
                    // TODO: ver de arreglar este problema. El siguiente link parece util:
                    // http://stackoverflow.com/questions/20923232/how-to-rotate-a-vector-by-a-given-direction
                    alert("Error: el recorrido definido tiene direcciÃ³n igual al vector Up en algÃºn tramo");
                    return;
                }

                // desplaza la superficie al centro de coordenadas
                vec3.subtract(actual, actual, pathKernel);
                vec3.subtract(next, next, pathKernel);

                mat4.lookAt(currPointSpace, actual, next, up);
                // se usa la inversa cuando no se trata de una cÃ¡mara
                mat4.invert(currPointSpace, currPointSpace);

                currShapePoints = shapes.getSectionPoints(node/totalNodes);
                currShapeKernel = shapes.getSectionKernel(node/totalNodes);
            }

            for(var c=0; c<faces; c++) {
                var vertex = vec3.create();

                if(!isEnding) {
                    var kernel = this._centerInKernel?currShapeKernel:cloudPointKernel;

                    var face = this._closedShapes && c==faces-1?0:c;
                    vec3.subtract(vertex, currShapePoints[face], kernel);
                    vec3.transformMat4(vertex, vertex, currPointSpace);
                }
                else {
                    var idx = n==0?0:path.length-1;
                    vec3.subtract(vertex, path[idx], pathKernel);
                }

                vertex = [vertex[0], vertex[1], vertex[2]];
                //console.log(vertex);
                vertices = vertices.concat(vertex);
            }
        }

        //console.log(vertices.length);

        pu.setVertices.call(this, vertices);
        pu.defineDimensions.call(this, nodes, faces);
    }

    return pu;
})();/*
 Superficie de revoluciÃ³n. Se define una forma inicial de barrido
 sobre el eje y la cantidad de caras. En cada angulo rotado imprimirÃ¡
 el borde correspondiente. Los bordes que se definan luego deberÃ¡n
 tener exactamente la misma cantidad de puntos que el inicial.
 */
function RevolutionSurface( initialSideForm, faces ) {
    this._sideForms;  // formatos de barrido de la revoluciÃ³n

    this._numbFaces;  // cantidad de caras (mÃ­nimo 3)

    this._closedEndings;  // agrega triÃ¡ngulos en los extremos
    this._centerInKernel;  // centra el modelo generado en su kernel
    this._type=1;
    this.constructor(initialSideForm, faces);
}

// MÃ©todos
RevolutionSurface.prototype = (function() {
    var pr = {};
    var pu = Object.create(Geometry.prototype);

    pu.constructor = function( initialSideForm, faces ) {
        Geometry.prototype.constructor.call(this);

        this._closedEndings = true;
        this._centerInKernel = true;

        pu.init.call(this, initialSideForm, faces);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.init = function( initialSideForm, faces ) {
        if(Utils.isDefined(initialSideForm)) {
            this._sideForms = new PointCloud();
            this._numbFaces = faces<3?3:faces;
            pu.addSideForm.call(this, initialSideForm, 0);
        }
    }

    pu.setClosedEndings = function( closed ) {
        this._closedEndings = closed;
    }

    pu.setCenteredInKernel = function( centered ) {
        this._centerInKernel = centered;
    }

    pu.addSideForm = function( sideForm, at ) {
        this._sideForms.addSection(sideForm, at);
    }

    // @override
    pu.prepareGeometry = function() {
        var sideForms = this._sideForms;
        var cloudPointKernel = sideForms.getKernelPoint();

        var faces = this._numbFaces;
        var nodes = sideForms.getSectionPoints(0).length;

        if(this._closedEndings)
            nodes+=2;

        var angle = (2*Math.PI)/faces;

        var vertices = [];

        for(var c=0; c<=faces; c++) {
            // la revolucion se realiza sobre el eje Y
            var currPointSpace = mat4.create();
            mat4.rotate(currPointSpace, currPointSpace, angle*c, [0, 1, 0]);

            var currSideFormPoints = sideForms.getSectionPoints(c/faces);
            var currSideFormKernel = sideForms.getSectionKernel(c/faces);

            for(var n=0; n<nodes; n++) {
                var vertex = vec3.create();
                var isEnding = this._closedEndings && (n==0 || n==nodes-1);
                var kernel = this._centerInKernel?currSideFormKernel:cloudPointKernel;

                if(!isEnding) {
                    var node = this._closedEndings?n-1:n;
                    var ykernel = vec3.fromValues(0, kernel[1], 0);
                    vec3.subtract(vertex, currSideFormPoints[node], ykernel);
                }
                else {
                    var idx = n==0?0:nodes-3;
                    vec3.set(vertex, 0, currSideFormPoints[idx][1] - kernel[1], 0);
                }

                vec3.transformMat4(vertex, vertex, currPointSpace);
                vertex = [vertex[0], vertex[1], vertex[2]];
                //console.log(vertex);
                vertices = vertices.concat(vertex);
            }
        }

        //console.log(vertices.length);

        pu.setVertices.call(this, vertices);
        pu.defineDimensions.call(this, faces+1, nodes);
    }

    return pu;
})();/*
 Nube de puntos compuesta por secciones que se van agregando
 entre el [0.0, 1.0] del total de la nube. Todas las secciones
 deben tener la misma cantidad de puntos.
 */
function PointCloud() {
    this._sections;  // puntos y kernel de todas las secciones

    this.constructor();
}

// MÃ©todos
PointCloud.prototype = (function() {
    var pr = {};
    var pu = PointCloud.prototype;

    pu.constructor = function() {
        this._sections = [];
    }

    // MÃ©todos privados
    pr.newSection = function( path, at ) {
        var strIndex = at.toFixed(2)+"";
        this._sections[strIndex] = [];
        this._sections[strIndex]["points"] = path.getPoints();
        this._sections[strIndex]["kernel"] = path.getKernelPoint();
    }

    pr.getSection = function( sectionAt ) {
        var keys = Object.keys(this._sections);

        var index = 0;
        for(var i=0; i<keys.length-1; i++) {
            var i1 = parseFloat(keys[i]);
            var i2 = parseFloat(keys[i+1]);

            if(i2 <= sectionAt)
                index = i2;
            else {
                index = i1;
                break;
            }
        }

        return this._sections[index.toFixed(2)+""];
    }

    // MÃ©todos pÃºblicos
    pu.addSection = function( path, at ) {
        var initial = pr.getSection.call(this, 0);
        if(Utils.isDefined(initial)) {
            if(path.getPoints().length != initial["points"].length) {
                alert("Error: la secciÃ³n adicional debe tener la misma cantidad de puntos que la inicial");
                return;
            }

            // at: indica a partir de que parte del camino
            // ubicar la seccion (0: inicio, 1: fin)
            at = at > 1 ? 1 : at;
            pr.newSection.call(this, path, at);
        }
        else
            pr.newSection.call(this, path, 0);
    }

    pu.getSectionPoints = function( sectionAt ) {
        return pr.getSection.call(this, sectionAt)["points"];
    }

    pu.getSectionKernel = function( sectionAt ) {
        return pr.getSection.call(this, sectionAt)["kernel"];
    }

    pu.getKernelPoint = function() {
        var keys = Object.keys(this._sections);

        var kernel = vec3.create();
        for(var i=0; i<keys.length-1; i++) {
            vec3.add(kernel, kernel, this._sections[keys[i]]["kernel"]);
        }
        vec3.scale(kernel, kernel, 1/keys.length);

        return kernel;
    }

    return pu;
})();/*
 Colores predefinidos
 */
var Color = Object.freeze({
    RED: [1.0,  0.0,  0.0,  1.0],
    ORANGE: [1.0,  0.6,  0.2,  1.0],
    GREEN: [0.0,  1.0,  0.0,  1.0],
    BLUE: [0.0,  0.0,  1.0,  1.0],
    YELLOW: [1.0,  1.0,  0.0,  1.0],
    PURPLE: [1.0,  0.0,  1.0,  1.0],
    BLACK: [0.0,  0.0,  0.0,  1.0],
    WHITE: [1.0,  1.0,  1.0,  1.0],
    GREY: [0.5,  0.5,  0.5,  1.0],
    LIGHTGREY: [0.7,  0.7,  0.7,  1.0]
});
/*
 Textura extraÃ­da de una imagen
 */
function Texture( imgSrc ) {
    this._glTexture;

    this._imageSrc;  // nombre de la imagen de la que se extrae la textura

    this.constructor(imgSrc);
}

// MÃ©todos
Texture.prototype = (function() {
    var pr = {};
    var pu = Texture.prototype;

    pu.constructor = function( imgSrc ) {
        this._imageSrc = imgSrc;
    }

    // MÃ©todos privados
    pr.handleLoadedTexture = function( gl, texture, repeat ) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        if(!repeat[0])  // u
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        if(!repeat[1])  // v
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.generateMipmap(gl.TEXTURE_2D);

        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // MÃ©todos pÃºblicos
    pu.init = function( gl, repeat ) {
        var glTexture = gl.createTexture();
        glTexture.image = new Image();
        glTexture.image.src = this._imageSrc;
        glTexture.image.onload = function() {
            pr.handleLoadedTexture.call(this, gl, glTexture, repeat);
        }

        this._glTexture = glTexture;
    }

    pu.bind = function( gl, id ) {
        gl.activeTexture(id);
        gl.bindTexture(gl.TEXTURE_2D, this._glTexture);
    }

    return pu;
})();/*
 Textura formada por 6 imÃ¡genes para simular reflexiÃ³n
 */
function CubeMap( imgSrcs ) {
    this._glTexture;

    this._imgSrcs;  // nombres de las 6 imÃ¡genes que forman el cubo

    this.constructor(imgSrcs);
}

// MÃ©todos
CubeMap.prototype = (function() {
    var pr = {};
    var pu = CubeMap.prototype;

    pu.constructor = function( imgSrcs ) {
        this._imgSrcs = imgSrcs;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.init = function( gl ) {
        var glTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, glTexture);

        var ct = 0;
        var img = new Array(6);

        for (var i = 0; i < 6; i++) {
            img[i] = new Image();
            img[i].src = this._imgSrcs[i];
            img[i].onload = function() {
                ct++;
                if (ct == 6) {
                    var targets = [
                        gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
                        gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z
                    ];
                    for (var j = 0; j < 6; j++) {
                        gl.texImage2D(targets[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img[j]);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    }
                    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                }
            }
        }

        this._glTexture = glTexture;
    }

    pu.bind = function( gl, id ) {
        gl.activeTexture(id);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._glTexture);
    }

    return pu;
})();/*
 Material que recubre un modelo. Tiene un shader asociado.
 */
function Material() {
    this._supportsLight;  // flag para saber si el shader soporta iluminacion
    this._shininess;

    this._cubeMap;  // Cubic Reflection Map
    this._usingCubeMap;
    this._reflectionFactor;

    this._vertexMapping;  // mapeo del color o de la textura a los vertices

    this.constructor();
}

// MÃ©todos
Material.prototype = (function() {
    var pr = {};
    var pu = Material.prototype;

    pu.constructor = function() {
        this._supportsLight = true;
        this._shininess = 10.0;

        this._cubeMap = null;
        this._usingCubeMap = false;
        this._reflectionFactor = 1.0;

        this._vertexMapping = [];
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setLightSupport = function( support ) {
        this._supportsLight = support;
    }

    pu.hasLightSupport = function() {
        return this._supportsLight;
    }

    pu.setCubeMap = function ( imgSrcs, refFactor ) {
        this._cubeMap = new CubeMap(imgSrcs);
        this._usingCubeMap = true;
        this._reflectionFactor = refFactor;
    }

    pu.isUsingCubeMap = function() {
        return Utils.isDefined(this._cubeMap);
    }

    pu.getReflectionFactor = function() {
        return this._reflectionFactor;
    }

    pu.getShininess = function() {
        return this._shininess;
    }

    pu.setShininess = function( shininess ) {
        this._shininess = shininess;
    }

    pu.prepareMaterial = function( gl ) {
        // Este mÃ©todo serÃ¡ llamado en el momento de la
        // inicializaciÃ³n del material

        if(pu.isUsingCubeMap.call(this))
            this._cubeMap.init(gl);
    }

    pu.drawMaterial = function( gl ) {
        // Este mÃ©todo serÃ¡ llamado en el momento del
        // dibujado del material

        if(pu.isUsingCubeMap.call(this))
            this._cubeMap.bind(gl, gl.TEXTURE3);
    }

    pu.genetareMappings = function( levels, faces ) {
        alert("Error: Abstract method not implemented");
    }

    pu.getColorMappings = function() {
        alert("Error: Abstract method not implemented");
    }

    pu.getTextureMappings = function() {
        alert("Error: Abstract method not implemented");
    }

    pu.getShaderProgram = function() {
        alert("Error: Abstract method not implemented");
    }

    return pu;
})();/*
 Material con color
 */
function ColoredMaterial( color ) {
    this._color;

    this.constructor(color);
}

// MÃ©todos
ColoredMaterial.prototype = (function() {
    var pr = {};
    var pu = Object.create(Material.prototype);

    pu.constructor = function( color ) {
        Material.prototype.constructor.call(this);

        this._color = color;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setColor = function( color ) {
        this._color = color;
    }

    pu.setColorMappings = function( colors ) {
        this._vertexMapping = colors;
    }

    // @override
    pu.genetareMappings = function( levels, faces ) {
        if(this._vertexMapping.length == 0) {
            for(var c=0; c<levels*faces; c++) {
                this._vertexMapping = this._vertexMapping.concat(this._color);
            }
        }
    }

    // @override
    pu.getColorMappings = function() {
        return this._vertexMapping;
    }

    // @override
    pu.getTextureMappings = function() {
        return new Array();  // devuelve un array vacio
    }

    // @override
    pu.getShaderProgram = function() {
        if(this._supportsLight)
            return new LightAndColorSP();
        else
            return new BasicColorSP();
    }

    return pu;
})();/*
 Material con textura
 */
function TexturedMaterial( imgSrc ) {
    this._texture;
    this._lightMap;
    this._normalMap;  // Bump Map

    this._transforms;  // matriz de transformaciones 2d
    this._mosaic;  // coordenadas <0 y >1 repiten la textura

    this._usingLightMap;
    this._usingNormalMap;

    this._lightMapFactor;

    this.constructor(imgSrc);
}

// MÃ©todos
TexturedMaterial.prototype = (function() {
    var pr = {};
    var pu = Object.create(Material.prototype);

    pu.constructor = function( imgSrc ) {
        Material.prototype.constructor.call(this);

        this._texture = new Texture(imgSrc);
        this._lightMap = null;
        this._normalMap = null;

        this._usingLightMap = false;
        this._usingNormalMap = false;

        this._mosaic = [true, true];
        this._transforms = mat3.create();
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setTexture = function( texture ) {
        this._texture = texture;
    }

    pu.isUsingLightMap = function() {
        return Utils.isDefined(this._lightMap);
    }

    pu.isUsingNormalMap = function() {
        return Utils.isDefined(this._normalMap);
    }

    pu.setLightMap = function ( imgSrc, factor ) {
        this._lightMap = new Texture(imgSrc);
        this._lightMapFactor = factor;
        this._usingLightMap = true;
    }

    pu.setNormalMap = function ( imgSrc ) {
        this._normalMap = new Texture(imgSrc);
        this._usingNormalMap = true;
    }

    pu.setTextureMappings = function( texcoords ) {
        this._vertexMapping = texcoords;
    }

    pu.mosaic = function( u, v ) {
        this._mosaic = [u, v];
    }

    pu.rotate = function( rad ) {
        mat3.rotate(this._transforms, this._transforms, rad);
    }

    pu.translate = function( u, v ) {
        var vec = vec2.fromValues(u, v);
        mat3.translate(this._transforms, this._transforms, vec);
    }

    pu.scale = function( u, v ) {
        var vec = vec2.fromValues(u, v);
        mat3.scale(this._transforms, this._transforms, vec);
    }

    // @override
    pu.prepareMaterial = function( gl ) {
        Material.prototype.prepareMaterial.call(this, gl);

        this._texture.init(gl, this._mosaic);
        if(pu.isUsingLightMap.call(this))
            this._lightMap.init(gl, this._mosaic);
        if(pu.isUsingNormalMap.call(this))
            this._normalMap.init(gl, this._mosaic);
    }

    // @override
    pu.drawMaterial = function( gl ) {
        Material.prototype.drawMaterial.call(this, gl);

        this._texture.bind(gl, gl.TEXTURE0);
        if(pu.isUsingLightMap.call(this))
            this._lightMap.bind(gl, gl.TEXTURE1);
        if(pu.isUsingNormalMap.call(this))
            this._normalMap.bind(gl, gl.TEXTURE2);
    }

    // @override
    pu.genetareMappings = function( levels, faces ) {
        if(this._vertexMapping.length == 0) {
            for(var n=0; n<levels; n++) {
                for(var c=0; c<faces; c++) {
                    var u = n / (levels-1);
                    var v = c / (faces-1);

                    var vec = vec2.fromValues(u, v);
                    vec2.transformMat3(vec, vec, this._transforms);
                    this._vertexMapping = this._vertexMapping.concat([vec[0], vec[1]]);
                }
            }
        }
    }

    // @override
    pu.getColorMappings = function() {
        return new Array();  // devuelve un array vacio
    }

    // @override
    pu.getTextureMappings = function() {
        return this._vertexMapping;
    }

    // @override
    pu.getShaderProgram = function() {
        if(this._supportsLight)
            return new LightAndTextureSP();
        else
            return new BasicTextureSP();
    }

    return pu;
})();/*
 Modelo transformable y renderizable como parte de una escena
 */
function Model() {
    this._parent;  // modelo padre

    this._initialized;  // informa si estÃ¡ listo para renderizarse

    this.constructor();
}

// MÃ©todos
Model.prototype = (function() {
    var pr = {};
    var pu = Object.create(Transformable.prototype);

    pu.constructor = function() {
        Transformable.prototype.constructor.call(this);

        pu.setInitialized.call(this, false);
    }

    // MÃ©todos pÃºblicos
    pu.setInitialized = function( state ) {
        this._initialized = state;

        if(state == false && Utils.isDefined(this._parent))
            this._parent.setInitialized(false);
    }

    pu.isInitialized = function() {
        return this._initialized;
    }

    // MÃ©todos abstractos
    pu.prepareToRender = function( gl ) {
        alert("Error: Abstract method not implemented");
    }

    pu.setRenderMatrixes = function( mMatrix, vMatrix, pMatrix ) {
        alert("Error: Abstract method not implemented");
    }

    pu.setLights = function( gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) {
        alert("Error: Abstract method not implemented");
    }

    pu.draw = function( gl ) {
        alert("Error: Abstract method not implemented");
    }

    pu.callUpdate = function( obj ) {
        obj.update.call(this);
    }

    pu.update = function() {
        // se llama en cada ciclo
    }

    return pu;
})();
/*
 Modelo compuesto de otros modelos hijos
 */
function ComplexModel() {
    this._children;  // modelos hijos

    this.constructor();
}

// MÃ©todos
ComplexModel.prototype = (function() {
    var pr = {};
    var pu = Object.create(Model.prototype);  // extiende Model

    pu.constructor = function() {
        Model.prototype.constructor.call(this);

        this._children = [];
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.prepareToRender = function( gl ) {
        for(var i=0; i<this._children.length; i++) {
            this._children[i].prepareToRender(gl);
        }
        pu.setInitialized.call(this, true);
    }

    // @override
    pu.setRenderMatrixes = function( mMatrix, vMatrix, pMatrix ) {
        for(var i=0; i<this._children.length; i++) {
            this._children[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
        }
    }

    // @override
    pu.setLights = function( gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos) {
        for(var i=0; i<this._children.length; i++) {
            this._children[i].setLights(gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection, cameraPos);
        }
    }

    // @override
    pu.draw = function( gl ) {
        for(var i=0; i<this._children.length; i++) {
            this._children[i].draw(gl);
        }
    }

    // @override
    pu.callUpdate = function( obj ) {
        Model.prototype.callUpdate.call(this, obj);

        for(var i=0; i<this._children.length; i++) {
            this._children[i].callUpdate(this._children[i]);
        }
    }

    pu.addChild = function( child ) {
        child._parent = this;
        this._children.push(child);
    }

    return pu;
})();
/*
 Modelo simple con buffers y shaders asociados. Es un Ãºnico poliedro.
 EstÃ¡ definido por una geometrÃ­a y un material que lo recubre.
 */
function PrimitiveModel( geometry, material , auto) {
    this._shaderProgram;

    this._renderMatrixes;  // Model, View y Projection
    this._renderModeId;  // modo de renderizado del index buffer

    this._geometry;
    this._material;

    this._vertexBuffer;
    this._indexBuffer;
    this._normalBuffer;
    this._tangentBuffer;
    this._colorBuffer;
    this._textureBuffer;

    this.constructor( geometry, material );
}

PrimitiveModel.RenderMode = Object.freeze({TRIANGLE_STRIP: 0,
    TRIANGLE_FAN: 1, LINES: 2, LINE_STRIP: 3});

// MÃ©todos
PrimitiveModel.prototype = (function() {
    var pr = {};
    var pu = Object.create(Model.prototype);  // extiende Model

    pu.constructor = function( geometry, material ) {
        Model.prototype.constructor.call(this);
        pu.init.call(this, geometry, material);
    }

    // MÃ©todos privados
    pr.initBuffers = function( gl ) {
        this._vertexBuffer = new AttributeBuffer(gl);
        this._vertexBuffer.setData(3, this._geometry.getVertices());

        this._indexBuffer = new IndexBuffer(gl);
        this._indexBuffer.setData(this._geometry.getIndexes());

        this._normalBuffer = new AttributeBuffer(gl);
        this._normalBuffer.setData(3, this._geometry.getNormals());

        this._tangentBuffer = new AttributeBuffer(gl);
        this._tangentBuffer.setData(3, this._geometry.getTangents());

        this._colorBuffer = new AttributeBuffer(gl);
        this._colorBuffer.setData(4, this._material.getColorMappings());

        this._textureBuffer = new AttributeBuffer(gl);
        this._textureBuffer.setData(2, this._material.getTextureMappings());
    }

    pr.getGlRenderMode = function( gl ) {
        switch(this._renderModeId) {
            case PrimitiveModel.RenderMode.TRIANGLE_STRIP:
                return gl.TRIANGLE_STRIP;
            case PrimitiveModel.RenderMode.TRIANGLE_FAN:
                return gl.TRIANGLE_FAN;
            case PrimitiveModel.RenderMode.LINES:
                return gl.LINES;
            case PrimitiveModel.RenderMode.LINE_STRIP:
                return gl.LINE_STRIP;
            default:
                return gl.TRIANGLE_STRIP;
        }
    }

    // MÃ©todos pÃºblicos
    pu.setRenderMode = function( rm ) {
        this._renderModeId = rm;
    }

    pu.init = function( geometry, material ) {
        if(Utils.isDefined(geometry) && Utils.isDefined(material)) {
            this._renderMatrixes = [];
            this._geometry = geometry;
            this._material = material;
            this._dir = vec3.create();
            this._geometry.prepareGeometry();

            // genera los atributos de color o textura segÃºn el caso
            var levels = this._geometry._levels;
            var faces = this._geometry._faces;
            this._material.genetareMappings(levels, faces);

            // obtiene el shader program a utilizar
            this._shaderProgram = this._material.getShaderProgram();
        }
    }

    // @override
    pu.prepareToRender = function( gl ) {
        this._shaderProgram.init(gl);
        this._material.prepareMaterial(gl);
        pr.initBuffers.call(this, gl);
        pu.setInitialized.call(this, true);
    }

    // @override
    pu.setRenderMatrixes = function( mMatrix, vMatrix, pMatrix ) {
        this._renderMatrixes["Model"] = mat4.clone(mMatrix);
        this._renderMatrixes["View"] = mat4.clone(vMatrix);
        this._renderMatrixes["Projection"] = mat4.clone(pMatrix);
    }

    // @override
    pu.setLights = function( gl, amb, dir, pos, carLightColor, transformedCarLight, transformedCarLightDirection ) {
        this._shaderProgram.useThisProgram(gl);

        var useLight = this._material.hasLightSupport();
        gl.uniform1i(this._shaderProgram.getUniform("uUseLighting"), useLight);
        gl.uniform1f(this._shaderProgram.getUniform("uShininess"), this._material.getShininess());
        gl.uniform3f(this._shaderProgram.getUniform("uAmbientColor"), amb, amb, amb);
        gl.uniform3f(this._shaderProgram.getUniform("uDirectionalColor"), dir, dir, dir);
        gl.uniform3fv(this._shaderProgram.getUniform("uLightPosition"), pos);

        gl.uniform3f(this._shaderProgram.getUniform("uCarLightColor"), carLightColor, carLightColor, carLightColor);
        gl.uniform3fv(this._shaderProgram.getUniform("uCarLightTransformedPosition"), transformedCarLight);
        gl.uniform3fv(this._shaderProgram.getUniform("uCarLightTransformedDirection"), transformedCarLightDirection);

        gl.uniform1i(this._shaderProgram.getUniform("uUsingLightMap"), this._material._usingLightMap);
        gl.uniform1f(this._shaderProgram.getUniform("uLightMapFactor"), this._material._lightMapFactor);

        gl.uniform1i(this._shaderProgram.getUniform("uUsingNormalMap"), this._material._usingNormalMap);

        gl.uniform1f(this._shaderProgram.getUniform("uReflectionFactor"), this._material.getReflectionFactor());
        gl.uniform1i(this._shaderProgram.getUniform("uUsingReflectionMap"), this._material._usingCubeMap);
    }

    // @override
    pu.draw = function( gl ) {
        var matrixes = this._renderMatrixes;

        // Obtiene las matrices de una rama del Arbol de la Escena
        var sceneTwig = [this._objectMatrix];
        var parent = this._parent;
        while(Utils.isDefined(parent)) {
            sceneTwig.push(parent._objectMatrix);
            parent = parent._parent;
        }

        // Obtiene la matriz Model-View
        var mvMatrix = mat4.create();
        mat4.multiply(mvMatrix, matrixes["View"], matrixes["Model"]);

        // Multiplica las matrices en el orden correcto
        for(var i=sceneTwig.length-1; i>=0; i--)
            mat4.multiply(mvMatrix, mvMatrix, sceneTwig[i]);

        // Setea el programa de shaders dinÃ¡micamente para cada modelo
        var program = this._shaderProgram;
        program.useThisProgram(gl);

        // asocio la pMatrix con la del shader
        gl.uniformMatrix4fv(program.getUniform("uPMatrix"), 0, matrixes["Projection"]);

        // asocio la mvMatrix con la del shader
        gl.uniformMatrix4fv(program.getUniform("uMVMatrix"), 0, mvMatrix);

        // asocio la nMatrix con la del shader
        var nMatrix = mat3.create();
        mat3.normalFromMat4(nMatrix, mvMatrix);
        gl.uniformMatrix3fv(program.getUniform("uNMatrix"), 0, nMatrix);

        // Asociamos un atributo del shader con cada uno de los buffers que creamos
        program.associateAttribute(this._vertexBuffer, "aVertexPosition");
        program.associateAttribute(this._normalBuffer, "aVertexNormal");
        program.associateAttribute(this._tangentBuffer, "aVertexTangent");
        program.associateAttribute(this._colorBuffer, "aVertexColor");
        program.associateAttribute(this._textureBuffer, "aTextureCoord");
        program.associateAttribute(this._shininessBuffer, "aShininess");

        // hago un bind de la textura antes de dibujarla
        this._material.drawMaterial(gl);
        gl.uniform1i(program.getUniform("uSampler"), 0);
        gl.uniform1i(program.getUniform("uSamplerLightMap"), 1);
        gl.uniform1i(program.getUniform("uSamplerNormalMap"), 2);
        gl.uniform1i(program.getUniform("uReflectionMap"), 3);

        // Dibujamos el modelo
        this._indexBuffer.draw(pr.getGlRenderMode.call(this, gl));
    }

    return pu;
})();/*
 Camara abstracta de base para otras camaras
 */
function Camera() {
    this._up;  // vector hacia arriba
    this._target;  // punto donde mira

    this.constructor();
}

// MÃ©todos
Camera.prototype = (function() {
    var pr = {};
    var pu = Object.create(Transformable.prototype);

    pu.constructor = function() {
        Transformable.prototype.constructor.call(this);

        pu.setUp.call(this, 0, -1, 0);

        // mira al centro de la escena por default
        pu.setTarget.call(this, 0, 0, 0);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setUp = function( x, y, z ) {
        // TODO: ver como solucionar el problema cuando coinciden
        // el vector Up con la direcciÃ³n entre Eye y Target
        this._up = vec3.fromValues(x, y, z);
    }

    pu.setTarget = function( x, y, z ) {
        this._target = vec3.fromValues(x, y, z);
    }

    pu.getViewMatrix = function() {
        var eye = pu.getPosition.call(this);
        var lookat = mat4.create();
        mat4.lookAt(lookat, eye, this._target, this._up);
        return lookat;
    }

    pu.getAlignedWithCamera = function( vector ) {
        // alinea un vector segÃºn el Up de la camara
        var lookat = pu.getViewMatrix.call(this);
        var aligned = vec3.create();
        vec3.transformMat4(aligned, vector, lookat);
        return aligned;
    }

    pu.getProjectionMatrix = function() {
        alert("Error: Abstract method not implemented");
    }

    return pu;
})();
/*
 Camara para enfocar la escena en perspectiva
 */
function PerspectiveCamera( w, h ) {
    this._pMatrix;

    this.constructor(w, h);
}

// MÃ©todos
PerspectiveCamera.prototype = (function() {
    var pr = {};
    var pu = Object.create(Camera.prototype);

    pu.constructor = function( w, h ) {
        Camera.prototype.constructor.call(this);

        this._pMatrix = mat4.create();

        // matriz de perspectiva por default
        pu.setPerspective.call(this, 30, w/h, 0.1, 1600.0);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setPerspective = function( fov, aspect, near, far ) {
        // Preparamos una matriz de perspectiva
        mat4.identity(this._pMatrix);
        mat4.perspective(this._pMatrix, fov, aspect, near, far);
    }

    // @override
    pu.getProjectionMatrix = function() {
        return this._pMatrix;
    }

    return pu;
})();/*
 Contiene e inicializa modelos para luego dibujarlos
 */
function Scene() {
    this._models;  // modelos en la escena
    this._auto;

    //TODO: poner esto en una clase tipo Light cuando se tenga un
    // shader capaz de agregar mÃ¡s de una fuente de luz
    this._hasLight;  // si es false usa iluminacion por defecto
    this._ambientIntensity;
    this._directionalIntensity;
    this._lightPosition;

    this._carLightColor;
    this._carLightPosition;
    this._carLightDirection;

    this.constructor();
}

// MÃ©todos
Scene.prototype = (function() {
    var pr = {};
    var pu = Object.create(Transformable.prototype);  // extiende Transformable

    pu.constructor = function() {
        Transformable.prototype.constructor.call(this);

        this._models = [];

        this._hasLight = false;
    }

    // MÃ©todos privados
    pr.prepareModels = function( gl ) {
        var models = this._models;
        for(var i=0; i<models.length; i++) {
            if(!models[i].isInitialized())
                models[i].prepareToRender(gl);
        }
    }

    // MÃ©todos pÃºblicos
    pu.setLightSources = function( amb, dir, pos, carLightColor, carLightPosition, carLightDirection ) {
        this._hasLight = true;

        this._ambientIntensity = amb;
        this._directionalIntensity = dir;
        this._lightPosition = vec3.fromValues(pos[0], pos[1], pos[2]);

        this._carLightColor = carLightColor;
        this._carLightPosition = vec3.fromValues(carLightPosition[0], carLightPosition[1], carLightPosition[2]);
        this._carLightDirection = vec3.fromValues(carLightDirection[0], carLightDirection[1], carLightDirection[2]);
    }

    pu.add = function( model ) {
        // Agrega un modelo a la escena
        this._models.push(model);
    }

    pu.draw = function( gl, camera ) {
        // Prepara los modelos para dibujarlos
        pr.prepareModels.call(this, gl);

        var models = this._models;
        var mMatrix = this._objectMatrix;
        var vMatrix = camera.getViewMatrix();
        var pMatrix = camera.getProjectionMatrix();
        var carMatrix = this._auto.getObjectMatrix();

        var pos = camera.getAlignedWithCamera(this._lightPosition);
        vec3.transformMat4(pos, pos, mMatrix);

        var transformedCarLight = vec3.create();
        vec3.transformMat4(transformedCarLight, this._carLightPosition, carMatrix);
        transformedCarLight = camera.getAlignedWithCamera(transformedCarLight);
        vec3.transformMat4(transformedCarLight, transformedCarLight, mMatrix);

        var transformedCarLightDirection = vec3.create();

        // direction = pos2 - this._carLightPosition
        // pos2 = direction + this._carLightPostion
        var pos2 = vec3.create();
        vec3.add(pos2, this._carLightPosition, this._carLightDirection);
        vec3.transformMat4(pos2, pos2, carMatrix);
        pos2 = camera.getAlignedWithCamera(pos2);
        vec3.transformMat4(pos2, pos2, mMatrix);

        vec3.subtract(transformedCarLightDirection, pos2, transformedCarLight);
        vec3.normalize(transformedCarLightDirection, transformedCarLightDirection);

        if(this._hasLight) {
            var ambient = this._ambientIntensity;
            var directional = this._directionalIntensity
        }

        for(var i=0; i<models.length; i++) {
            if(this._hasLight)
                models[i].setLights(gl, ambient, directional, pos, this._carLightColor, transformedCarLight, transformedCarLightDirection);
            models[i].setRenderMatrixes(mMatrix, vMatrix, pMatrix);
            models[i].draw(gl);
        }
    }

    pu.update = function() {
        var models = this._models;

        for(var i=0; i<models.length; i++) {
            models[i].callUpdate(models[i]);
        }
    }

    pu.setAuto = function( auto ) {
        this._auto = auto;
    }

    return pu;
})();/*
 Encapsula todo el tratamiento del contexto gl y el canvas
 */
function Renderer( w, h ) {
    this._canvas;
    this._gl;

    this.constructor(w, h);
}

// MÃ©todos
Renderer.prototype = (function() {
    var pr = {};
    var pu = Renderer.prototype;

    pu.constructor = function( w, h ) {
        pr.initCanvas.call(this, w, h);
        pr.initWebGL.call(this);
    }

    // MÃ©todos privados
    pr.initCanvas = function( w, h ) {
        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.style.backgroundColor= "black";

        this._canvas = canvas;
    }

    pr.initWebGL = function() {
        var gl = null;
        var ops = { preserveDrawingBuffer: true };

        try {
            // Intentamos primero con el contexto estandar. Si falla, probamos
            // con el experimental.
            gl = this._canvas.getContext("webgl", ops) ||
                this._canvas.getContext("experimental-webgl", ops);
        } catch(e) {}

        // Si no tenemos un contexto, abortamos.
        if (!gl) {
            alert("Unable to initialize WebGL. Your browser may not support it.");
            gl = null;
        }

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this._canvas.width, this._canvas.height);

        this._gl = gl;
    }

    // MÃ©todos pÃºblicos
    pu.getCanvasElement = function() {
        return this._canvas;
    }

    pu.getWidth = function() {
        return this._canvas.width;
    }

    pu.getHeight = function() {
        return this._canvas.height;
    }

    pu.setClearColor = function( r, g, b, alpha ) {
        // color de fondo para la escena
        this._gl.clearColor(r, g, b, alpha);
    }

    pu.clear = function() {
        // Se limpia la pantalla
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }

    pu.render = function( scene, camera ) {
        scene.draw(this._gl, camera);
    }

    return pu;
})();/*
 Ejes coordenados
 */
function Axis() {
    this.constructor();
}

// MÃ©todos
Axis.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var vertices = [0,0,0, 1,0,0, 0,0,0, 0,1,0, 0,0,0, 0,0,1];
        var indexes = [0,1,2,3,4,5];
        var colors = [];

        colors = colors.concat(Color.RED);
        colors = colors.concat(Color.RED);
        colors = colors.concat(Color.GREEN);
        colors = colors.concat(Color.GREEN);
        colors = colors.concat(Color.BLUE);
        colors = colors.concat(Color.BLUE);

        pu.setRenderMode.call(this, PrimitiveModel.RenderMode.LINES);

        var geometry = new Geometry();
        geometry.setVertices(vertices);
        geometry.setIndexes(indexes);

        var material = new ColoredMaterial();
        material.setColorMappings(colors);
        material.setLightSupport(false);

        pu.init.call(this, geometry, material);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Dibuja los vectores normales a los vÃ©rtices de una geometrÃ­a
 */
function NormalsGrapher( model ) {
    this._model;

    this.constructor(model);
}

// MÃ©todos
NormalsGrapher.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( model ) {
        PrimitiveModel.prototype.constructor.call(this);

        this._model = model;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.prepareToRender = function( gl ) {
        var model = this._model;

        pu.applyTransformationMatrix.call(this, model.getObjectMatrix(), true);
        var modelV = model._geometry.getVertices();
        var modelN = model._geometry.getNormals();

        var vertices = [];
        var indexes = [];
        var colors = [];

        for(var i=0; i<modelV.length; i+=3) {
            vertices.push(modelV[i]);
            vertices.push(modelV[i+1]);
            vertices.push(modelV[i+2]);

            var n = vec3.fromValues(modelN[i],modelN[i+1],modelN[i+2]);
            var v = vec3.fromValues(modelV[i],modelV[i+1],modelV[i+2]);

            vec3.scale(n,n,0.5);
            vec3.add(n,n,v);

            vertices.push(n[0]);
            vertices.push(n[1]);
            vertices.push(n[2]);
        }

        for(var i=0; i<vertices.length/3; i++) {
            indexes.push(i);
            colors = colors.concat(Color.RED);
        }

        pu.setRenderMode.call(this, PrimitiveModel.RenderMode.LINES);

        var geometry = new Geometry();
        geometry.setVertices(vertices);
        geometry.setIndexes(indexes);

        var material = new ColoredMaterial();
        material.setColorMappings(colors);
        material.setLightSupport(false);

        pu.init.call(this, geometry, material);
        PrimitiveModel.prototype.prepareToRender.call(this, gl);
    }

    return pu;
})();/*
 Poligono 2D plano, convexo (Star-shaped polygon) y centrado en el origen.
 Recibe una figura (shape) y un color. Es un poliedro de 1 cara.
 */
function Polygon( shape, color ) {
    this._points;
    this._kernel;
    this._fill;  // si es false solo dibuja el contorno
    this._closed;
    this._color;

    this.constructor(shape, color);
}

// MÃ©todos
Polygon.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( shape, color ) {
        PrimitiveModel.prototype.constructor.call(this);

        this._fill = true;
        this._closed = true;

        pu.init.call(this, shape, color);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.setColor = function( color ) {
        if(this._color != color) {
            this._color = color;
            pu.setInitialized.call(this, false);
        }
    }

    pu.init = function( shape, color ) {
        if(Utils.isDefined(shape)) {
            this._points = shape.getPoints();
            this._kernel = shape.getKernelPoint();
            this._color = color;
            pu.setInitialized.call(this, false);
        }
    }

    pu.fillPolygon = function( fill ) {
        this._fill = fill;
        pu.setInitialized.call(this, false);
    }

    pu.closedPolygon = function( closed ) {
        this._closed = closed;
        pu.setInitialized.call(this, false);
    }

    // @override
    pu.prepareToRender = function( gl ) {
        var points = this._points;
        var kernel = this._kernel;

        var z = 0;
        var normDir = [0, 0, 1];
        var vertices = [0, 0, z];
        var normals = normDir;
        var colors = this._color;
        var indexes = [];

        if(this._fill)
            indexes = indexes.concat(0);

        for(var p=0; p<points.length; p++) {
            // se le resta xKernel y yKernel para centrarlo en el origen
            var x = points[p][0] - kernel[0];
            var y = points[p][1] - kernel[1];

            vertices = vertices.concat([x, y, z]);
            normals = normals.concat(normDir);
            indexes = indexes.concat(p+1);
            colors = colors.concat(this._color);
        }

        if(this._closed)  // une el primer y Ãºltimo punto
            indexes = indexes.concat(1);

        var renderMode = PrimitiveModel.RenderMode.LINE_STRIP;
        if(this._fill)
            renderMode = PrimitiveModel.RenderMode.TRIANGLE_FAN;

        pu.setRenderMode.call(this, renderMode);

        var geometry = new Geometry();
        geometry.setVertices(vertices);
        geometry.setNormals(normals);
        geometry.setIndexes(indexes);

        var material = new ColoredMaterial(this._color);
        material.setColorMappings(colors);

        PrimitiveModel.prototype.init.call(this, geometry, material);
        PrimitiveModel.prototype.prepareToRender.call(this, gl);
    }

    return pu;
})();

/*
 TODO: ver de implementar algÃºn algoritmo de estos:
 http://en.wikipedia.org/wiki/Star-shaped_polygon
 http://en.wikipedia.org/wiki/Polygon_triangulation
 http://stackoverflow.com/questions/471962/how-do-determine-if-a-polygon-is-complex-convex-nonconvex
 *//*
 Rectangulo plano con un material aplicado
 */
function Sprite( width, height, material ) {
    this.constructor(width, height, material);
}

// MÃ©todos
Sprite.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( width, height, material ) {
        PrimitiveModel.prototype.constructor.call(this);

        var w = width;
        var h = height;
        var vertices = [-w/2,-h/2,0, -w/2,h/2,0, w/2,-h/2,0, w/2,h/2,0];
        var indexes = [0, 1, 2, 3];
        var normals = [0,0,1, 0,0,1, 0,0,1, 0,0,1];
        var tangents = [1,0,0, 1,0,0, 1,0,0, 1,0,0];

        var geometry = new Geometry();
        geometry.setVertices(vertices);
        geometry.setIndexes(indexes);
        geometry.setNormals(normals);
        geometry.setTangents(tangents);
        geometry.defineDimensions(2, 2);

        pu.init.call(this, geometry, material);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Estrella
 */
function Star() {
    this.constructor();
}

// MÃ©todos
Star.prototype = (function() {
    var pr = {};
    var pu = Object.create(Path.prototype);

    pu.constructor = function() {
        Path.prototype.constructor.call(this, 1);

        var star = new LinearCurve([
            [0,2], [0.5,1], [2,1], [1,0], [1.5,-1.5],
            [0,-0.5], [-1.5,-1.5], [-1,0], [-2,1], [-0.5,1]
        ]);

        pu.addStretch.call(this, star);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 CÃ­rculo
 */
function Circle( radius ) {
    this.constructor(radius);
}

// MÃ©todos
Circle.prototype = (function() {
    var pr = {};
    var pu = Object.create(Path.prototype);

    pu.constructor = function( radius ) {
        Path.prototype.constructor.call(this, 10);

        var r = radius;
        var c = 0.55191502*r;
        var curve1 = new CubicBezier([[0,r], [c,r], [r,c], [r,0]]);
        var curve2 = new CubicBezier([[r,0], [r,-c], [c,-r], [0,-r]]);
        var curve3 = new CubicBezier([[0,-r], [-c,-r], [-r,-c], [-r,0]]);
        var curve4 = new CubicBezier([[-r,0], [-r,c], [-c,r], [0,r]]);

        pu.addStretch.call(this, curve1);
        pu.addStretch.call(this, curve2);
        pu.addStretch.call(this, curve3);
        pu.addStretch.call(this, curve4);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 RectÃ¡ngulo
 */
function Rectangle( width, height ) {
    this.constructor(width, height);
}

// MÃ©todos
Rectangle.prototype = (function() {
    var pr = {};
    var pu = Object.create(Path.prototype);

    pu.constructor = function( width, height ) {
        Path.prototype.constructor.call(this, 1);

        var rectangle = new LinearCurve([
            [0,0], [0,height], [width,height], [width,0]
        ]);

        pu.addStretch.call(this, rectangle);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Esfera
 */
function Sphere( radius, faces, material ) {
    this.constructor(radius, faces, material);
}

// MÃ©todos
Sphere.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( radius, faces, material ) {
        PrimitiveModel.prototype.constructor.call(this);

        var r = radius*0.5;
        var c = 0.55191502*r;

        var side = new Path(10);
        side.addStretch(new CubicBezier([[0,r], [c,r], [r,c], [r,0]]));
        side.addStretch(new CubicBezier([[r,0], [r,-c], [c,-r], [0,-r]]));

        var geometry = new RevolutionSurface(side, faces);
        geometry.setClosedEndings(false);

        pu.init.call(this, geometry, material);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Prisma
 */
function Prism( radius1, radius2, height, faces, material ) {
    this.constructor(radius1, radius2, height, faces, material);
}

// MÃ©todos
Prism.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( radius1, radius2, height, faces, material ) {
        PrimitiveModel.prototype.constructor.call(this);

        var side = new Path(2);
        side.addStretch(new LinearCurve([[radius1,0], [radius2,height]]));

        this._geometry = new RevolutionSurface(side, faces);
        this._material = material;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    // @override
    pu.prepareToRender = function( gl ) {
        pu.init.call(this, this._geometry, this._material);
        PrimitiveModel.prototype.prepareToRender.call(this, gl);
    }

    return pu;
})();/*
 Caja
 */
function Box( width, height, depth, material ) {
    this.constructor(width, height, depth, material);
}

// MÃ©todos
Box.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( width, height, depth, material ) {
        PrimitiveModel.prototype.constructor.call(this);

        var path = new Path(1);
        path.addStretch(new LinearCurve([[0,0], [depth,0]]));

        var rectangle = new Rectangle(width, height);
        var geometry = new SweptSurface(path, rectangle);

        pu.init.call(this, geometry, material);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();// Constantes

var ConstantesEje = {
    CILINDRO_CARAS : 8,
    CILINDRO_NIVELES : 10,
    CILINDRO_ALTURA : 5.0,
    CILINDRO_RADIO : 0.2,
};

var ConstantesRueda = {
    CILINDRO_CARAS : 12,
    CILINDRO_NIVELES : 4,
    CILINDRO_ALTURA : 1.0,
    CILINDRO_RADIO : 2.0
};

var ConstantesTanque = {
    POSICION_X_TREN_TRASERO : -7.0,
    POSICION_X_TREN_DELANTERO : 4.0,
    POSICION_Y_TRENES : 0.0,
    POSICION_Z_TRENES : 2.0,// igual al radio de la rueda

    POSICION_X_CHASIS : 0.0,
    POSICION_Y_CHASIS : 0.0,
    POSICION_Z_CHASIS : 0.4,
    ANCHO_CHASIS : 10.0,
    ALTO_CHASIS : 2.0,
    PROFUNDIDAD_CHASIS : 6.0,

    LARGO_EJES : 12.0,

    RADIO_RUEDA : 2.0, // TODO igual que radio del cilindro, ver
    PROFUNDIDAD_RUEDA : 1,
    SEGMENTOS_RUEDA : 16,
    SEPARACION_RUEDA_CHASIS : 0,
    ANGULO_INICIAL_VOLANTE : 0,
    VELOCIDAD_INICIAL_MOTOR : 0,
    ALTURA_PISO : -10,
    GRAVEDAD : -200,
    ALTURA_INICIAL : -8.5,
    EULER_ORDER : "YZX",
    LARGO_SOPORTE_CANIONES : 1.6,
    LARGO_SOPORTE_SEMITORRETA: 2,

    RADIO_MENOR_TORRETA : 1.0,
    RADIO_MAYOR_TORRETA : 3.2,
    ALTURA_CILINDRO_INFERIOR_TORRETA: 2,
    ALTURA_CILINDRO_SUPERIOR_TORRETA: 4,
}

var ConstantesGenerales = {
    WIDTH : 800,
    HEIGHT : 600,
}
function Auto() {
    this._chasis;
    this._trenDelantero;
    this._trenTrasero;
    this._torreta;
    this._tickDisparo;
    this._ultimoCanionDisparado;
    this._guardadoPendiente;

    this.constructor();
}

// MÃ©todos
Auto.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._target = vec3.fromValues(-4,0,0);
        this._pos=vec3.fromValues(-10,0,0);
        this._up=vec3.fromValues(0,0,-1);

        this._tickDisparo = -1;
        this._guardadoPendiente = false;
        this._ultimoCanionDisparado = 0;

        // Chasis
        this._chasis = new Chasis();
        this._chasis.translate(ConstantesTanque.POSICION_X_CHASIS, ConstantesTanque.POSICION_Y_CHASIS, ConstantesTanque.POSICION_Z_CHASIS);
        this._chasis.rotateY(Utils.degToRad(90));

        // Tren trasero
        this._trenTrasero = new Tren();
        this._trenTrasero.translate(ConstantesTanque.POSICION_X_TREN_TRASERO, ConstantesTanque.POSICION_Y_TRENES, -ConstantesTanque.ALTO_CHASIS/2);

        //Tren delantero
        this._trenDelantero = new Tren();
        this._trenDelantero.translate(ConstantesTanque.POSICION_X_TREN_DELANTERO, ConstantesTanque.POSICION_Y_TRENES, -ConstantesTanque.ALTO_CHASIS/2);

        //torreta
        this._torreta = new Torreta();
        this._torreta.translate(-2.6, 0, ConstantesTanque.ALTO_CHASIS+1.6);

        pu.addChild.call(this, this._torreta);
        pu.addChild.call(this, this._chasis);
        pu.addChild.call(this, this._trenDelantero);
        pu.addChild.call(this, this._trenTrasero);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    // @override
    pu.update = function() {
        var positionChasis = this._chasis.getCuerpoRigido().position;
        this.setPosition(positionChasis.x, positionChasis.y, positionChasis.z);


        var rotacionChasis=new CANNON.Vec3();
        this._chasis.getCuerpoRigido().quaternion.toEuler(rotacionChasis);

        this.rotateY(rotacionChasis.y);

        this.rotateZ(rotacionChasis.z);
        this.rotateX(rotacionChasis.x);

    }

    pu.getChasis = function() {
        return this._chasis;
    }

    pu.getTrenDelantero = function() {
        return this._trenDelantero;
    }

    pu.getTrenTrasero = function() {
        return this._trenTrasero;
    }

    pu.getCanionActual = function() {
        if(this._ultimoCanionDisparado==0) {
            return this._torreta._soporteMovilTorreta._semiTorretaDerecha._canionSuperior;
        } else if (this._ultimoCanionDisparado==1) {
            return this._torreta._soporteMovilTorreta._semiTorretaIzquierda._canionSuperior;
        } else if (this._ultimoCanionDisparado==2) {
            return this._torreta._soporteMovilTorreta._semiTorretaDerecha._canionInferior;
        } else if (this._ultimoCanionDisparado==3) {
            return this._torreta._soporteMovilTorreta._semiTorretaIzquierda._canionInferior;
        }
    }

    pu.dispararCaniones = function(tick) {
        if(!this._guardadoPendiente) {
            this._tickDisparo = tick;
            this.getCanionActual().disparar();
            this._guardadoPendiente = true;
            this._ultimoCanionDisparado = ((this._ultimoCanionDisparado+1)%4);
        }

    }

    pu.guardarCaniones = function(tick) {
        if(this._guardadoPendiente) {
            if ( (tick-this._tickDisparo)>0.04 ) {
                this._tickDisparo=-1;
                var aux = this._ultimoCanionDisparado;
                this._ultimoCanionDisparado=(this._ultimoCanionDisparado+3)%4;
                this.getCanionActual().guardar();
                this._guardadoPendiente = false;
                this._ultimoCanionDisparado=aux;
            }
        }
    }

    pu.girarTorretaHorizontal = function(angulo) {
        this._torreta.girarHorizontal(angulo);
    }

    pu.girarTorretaVertical = function(angulo) {
        this._torreta.girarVertical(angulo);
    }

    return pu;
})();
function Canion() {
    this._cubo;
    this._cilindro;

    this.constructor();
}

// MÃ©todos
Canion.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende Model

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._cubo = new Box(1,4, 1.2, new ColoredMaterial(Color.GREY));
        this._cubo.rotateZ(Utils.degToRad(-90));

        this._cilindro = new Prism(0.3, 0.3, 2, 16, new ColoredMaterial(Color.GREY));
        this._cilindro.translate(2.2, 0, 0);
        this._cilindro.rotateZ(Utils.degToRad(-90));
        this._cilindro._geometry._type = 2;

        pu.addChild.call(this, this._cubo);
        pu.addChild.call(this, this._cilindro)
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    pu.disparar = function() {
        this._cilindro.translate(0,-1,0);
    }

    pu.guardar = function() {
        this._cilindro.translate(0,1,0);
    }

    return pu;
})();
function SemiTorreta() {
    this._canionInferior;
    this._canionSuperior;
    this._cuboUnion;
    this._cilindroUnion;

    this.constructor();
}

// Mï¿½todos
SemiTorreta.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._canionInferior = new Canion();
        this._canionInferior.translate(0,0,-ConstantesTanque.LARGO_SOPORTE_CANIONES/2);
        this._canionSuperior = new Canion();
        this._canionSuperior.translate(0,0,ConstantesTanque.LARGO_SOPORTE_CANIONES/2);

        this._cuboUnion = new Box(ConstantesTanque.LARGO_SOPORTE_CANIONES,0.4,0.8, new ColoredMaterial(Color.GREY));

        this._cilindroUnion = new Prism(0.2,0.2, ConstantesTanque.LARGO_SOPORTE_SEMITORRETA, 16, new ColoredMaterial(Color.GREY));
        this._cilindroUnion.translate(0,ConstantesTanque.LARGO_SOPORTE_SEMITORRETA/2,0);


        pu.addChild.call(this,  this._canionInferior);
        pu.addChild.call(this,  this._canionSuperior);
        pu.addChild.call(this,  this._cuboUnion);
        pu.addChild.call(this,  this._cilindroUnion);

    }


    return pu;
})();
function SoporteMovilTorreta() {
    this._semiTorretaIzquierda;
    this._semiTorretaDerecha;
    this._cilindroSuperior;

    this.constructor();
}

// Mï¿½todos
SoporteMovilTorreta.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._cilindroSuperior = new Prism(ConstantesTanque.RADIO_MENOR_TORRETA,ConstantesTanque.RADIO_MENOR_TORRETA,ConstantesTanque.ALTURA_CILINDRO_SUPERIOR_TORRETA,16,new ColoredMaterial(Color.WHITE));
        this._cilindroSuperior.rotateX(Utils.degToRad(90));
        this._cilindroSuperior._geometry._type = 2;

        this._semiTorretaIzquierda = new SemiTorreta();
        this._semiTorretaIzquierda.translate(0, -ConstantesTanque.LARGO_SOPORTE_SEMITORRETA,ConstantesTanque.ALTURA_CILINDRO_SUPERIOR_TORRETA/4);

        this._semiTorretaDerecha = new SemiTorreta();
        this._semiTorretaDerecha.translate(0, ConstantesTanque.LARGO_SOPORTE_SEMITORRETA,ConstantesTanque.ALTURA_CILINDRO_SUPERIOR_TORRETA/4);
        this._semiTorretaDerecha.rotateX(Utils.degToRad(180));

        pu.addChild.call(this, this._cilindroSuperior);
        pu.addChild.call(this,  this._semiTorretaIzquierda);
        pu.addChild.call(this,  this._semiTorretaDerecha);

    }


    return pu;
})();
function Torreta() {
    this._cilindroInferior;
    this._soporteMovilTorreta;

    this.constructor();
}

// Mï¿½todos
Torreta.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende ComplexModel

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._cilindroInferior = new Prism(ConstantesTanque.RADIO_MAYOR_TORRETA,ConstantesTanque.RADIO_MENOR_TORRETA,ConstantesTanque.ALTURA_CILINDRO_INFERIOR_TORRETA,16,new ColoredMaterial(Color.WHITE));
        this._cilindroInferior.rotateX(Utils.degToRad(90));
        this._cilindroInferior._geometry.setClosedEndings(false);

        this._soporteMovilTorreta = new SoporteMovilTorreta();
        this._soporteMovilTorreta.translate(0,0,ConstantesTanque.ALTURA_CILINDRO_INFERIOR_TORRETA*0.7);

        pu.addChild.call(this, this._cilindroInferior);
        pu.addChild.call(this,  this._soporteMovilTorreta);

    }

    // Mï¿½todos privados

    // Mï¿½todos pï¿½blicos


    pu.girarVertical = function(angulo) {
        this._soporteMovilTorreta._semiTorretaIzquierda.rotateY(angulo);
        this._soporteMovilTorreta._semiTorretaDerecha.rotateY(-angulo);
    }

    pu.girarHorizontal = function(angulo) {
        this._soporteMovilTorreta.rotateZ(angulo);

    }
    return pu;
})();
function Chasis() {
    this._box;
    this._cuerpoRigido;
    this._cabina;
    this._chasisMaterial;

    this.constructor();
}

// MÃ©todos
Chasis.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);
        var mass = 10;

        var w = ConstantesTanque.PROFUNDIDAD_CHASIS;
        var h = ConstantesTanque.ALTO_CHASIS;
        var d = ConstantesTanque.ANCHO_CHASIS;

        var points1 = [
            [0, 0], [w-1, 0], [w-0.5, -h*2/5], [w-0.5, -h*4/5], [w-0.8, -h],
            [w/2+1, -h], [w/2+1, -h], [w/2-2, -h], [w/2-2, -h],
            [0-0.2, -h], [0-0.5, -h*4/5], [0-0.5, -h*2/5]
        ];

        var points2 = [
            [0, 0], [w-1, 0], [w-0.5, -h*2/5], [w-0.5, -h*4/5], [w-0.8, -h],
            [w/2+1, -h], [w/2+1, -h-0.5], [w/2-2, -h-0.5], [w/2-2, -h],
            [0-0.2, -h], [0-0.5, -h*4/5], [0-0.5, -h*2/5]
        ];

        var recorrido = new Path(6);
        recorrido.addStretch(new LinearCurve([[0, 0], [d, 0]]));
        var curve = new LinearCurve(points1);
        var octagono = new Path(1);
        octagono.addStretch(curve);

        octagono.scale(0.4);
        var barrido = new SweptSurface(recorrido, octagono);
        //barrido.setClosedShapes(false);
        //barrido.setClosedEndings(false);
        //barrido.setCenteredInKernel(false);

        octagono.resetTransformations();
        octagono.scaleNonUniform(0.6, 0.8, 1);
        barrido.addShape(octagono, 0.13);

        octagono.resetTransformations();
        octagono.scaleNonUniform(0.8, 1, 1);
        barrido.addShape(octagono, 0.16);

        curve.setControlPoints(points2);
        barrido.addShape(octagono, 0.25);

        octagono.resetTransformations();
        curve.setControlPoints(points1);
        octagono.scale(0.6);
        barrido.addShape(octagono, 0.85);

        var material = new TexturedMaterial("images/metal.jpg");
        material.setShininess(60.0);
        material.scale(3,1);
        material.translate(0,-0.4);
        var urls = [
            "images/cubemap/front.png", "images/cubemap/back.png",
            "images/cubemap/bottom.png", "images/cubemap/top.png",
            "images/cubemap/left.png", "images/cubemap/right.png"
        ];
        material.setCubeMap(urls, 2.0);

        this._box = new PrimitiveModel(barrido, material);
        this._box.rotateX(Utils.degToRad(-90));
        this._box.rotateZ(Utils.degToRad(90));
        this._box.scale(1.8);

        octagono.resetTransformations();
        barrido = new SweptSurface(recorrido, octagono);
        octagono.scaleNonUniform(1,-2,1);
        barrido.addShape(octagono, 0.5);

        this._cabina = new PrimitiveModel(barrido, new ColoredMaterial(Color.BLUE));
        this._cabina.translate(0,0,6);
        this._cabina.scale(0.7,0.7,1);
        this._cabina.rotateY(Utils.degToRad(90));
        this._cabina.rotateX(Utils.degToRad(90));
        this._cabina.rotateZ(Utils.degToRad(90));
        this._cabina.rotateZ(Utils.degToRad(15));

        this._chasisMaterial = new CANNON.Material("chasisMaterial");
        var chasisShape = new CANNON.Box(new CANNON.Vec3(ConstantesTanque.ANCHO_CHASIS/2,ConstantesTanque.PROFUNDIDAD_CHASIS/2, ConstantesTanque.ALTO_CHASIS/2));
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,chasisShape,this._chasisMaterial);
        this._cuerpoRigido.useQuaternion = true;

        pu.addChild.call(this, this._box);
        //pu.addChild.call(this, this._cabina);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    pu.getMaterial = function() {
        return this._chasisMaterial;
    }

    return pu;
})();
function Eje() {
    this.constructor();
}

// MÃ©todos
Eje.prototype = (function() {
    var pr = {};
    var pu = Object.create(Prism.prototype);

    pu.constructor = function() {
        Prism.prototype.constructor.call(this, ConstantesEje.CILINDRO_RADIO, ConstantesEje.CILINDRO_RADIO, ConstantesTanque.LARGO_EJES, ConstantesEje.CILINDRO_CARAS, new ColoredMaterial(Color.ORANGE));

    }

    pu.update = function() {

        // Para que quede en la posicion correcta
        // this.rotateX(Utils.degToRad(90));
        //    this.rotateZ(Utils.degToRad(90));
        //this.translate()
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();
function Rueda() {
    this._cuerpoRigido;
    this._wheelMaterial;

    this.constructor();
}

// MÃ©todos
Rueda.prototype = (function() {
    var pr = {};
    var pu = Object.create(Prism.prototype);  // extiende Model

    pu.constructor = function() {
        var material = new ColoredMaterial(Color.BLACK);

        Prism.prototype.constructor.call(this,ConstantesRueda.CILINDRO_RADIO, ConstantesRueda.CILINDRO_RADIO, ConstantesRueda.CILINDRO_ALTURA, ConstantesRueda.CILINDRO_CARAS, material);

        // Inicializar cuerpo rigido
        var mass = 10;
        this._wheelMaterial = new CANNON.Material("wheelMaterial");
        // TODO ver si es el radio correcto
        var wheelShape = new CANNON.Sphere(ConstantesRueda.CILINDRO_RADIO);

        this._cuerpoRigido = new CANNON.RigidBody(mass, wheelShape, this._wheelMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // @override
    pu.update = function() {

        var position = this._cuerpoRigido.position;
        //console.log(position);

        this.setPosition(position.x, position.y, position.z);
        var rotation=new CANNON.Vec3();
        this._cuerpoRigido.quaternion.toEuler(rotation);
        this.rotateY(rotation.y)
        this.rotateZ(rotation.z);
        this.rotateX(rotation.x);
        //	this.rotateX(Utils.degToRad(90));

    }

    // MÃ©todos pÃºblicos
    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    pu.getMaterial = function() {
        return this._wheelMaterial;
    }

    return pu;
})();
function Tren() {
    //  this._rueda_izquierda;
    //  this._rueda_derecha;
    this._eje;

    this.constructor();
}

// MÃ©todos
Tren.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);  // extiende Model

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        this._eje = new Eje();
        /*
         // Rueda izquierda
         this._rueda_izquierda = new Rueda();
         this._rueda_izquierda.translate(0.0, 0.0, ConstantesTanque.LARGO_EJES*-0.5);

         // Rueda derecha
         this._rueda_derecha = new Rueda();
         this._rueda_derecha.translate(0.0, 0.0, ConstantesTanque.LARGO_EJES*0.5);

         pu.addChild.call(this, this._rueda_izquierda);
         pu.addChild.call(this, this._rueda_derecha);*/
        pu.addChild.call(this, this._eje);
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    /*    pu.doblar = function( angulo ) {
     this._rueda_izquierda.rotateY(angulo);
     this._rueda_derecha.rotateY(angulo);
     }

     pu.getRuedaIzquierda = function() {
     return this._rueda_izquierda;
     }

     pu.getRuedaDerecha = function() {
     return this._rueda_derecha;
     }*/

    return pu;
})();function CamaraSeguimiento(objetoASeguir, eye, target, up) {

    this.camara;
    this.objetoASeguir;
    this.targetInicial;
    this.eyeInicial;
    this.rotateY;
    this.rotateZ;
    this.constructor(objetoASeguir, eye, target, up);
}

//MÃ©todos
CamaraSeguimiento.prototype = (function() {
    var pr = {};
    var pu = CamaraSeguimiento.prototype;

    pu.constructor = function(objetoASeguir, eye, target, up ) {
        this.objetoASeguir = objetoASeguir;
        this.targetInicial = target;
        this.eyeInicial = eye;
        this.rotateY=0;
        this.rotateZ=0;
        this.camara = new PerspectiveCamera(ConstantesGenerales.WIDTH, ConstantesGenerales.HEIGHT);
        this.camara.setUp(up[0], up[1], up[2]);
        this.camara.setPosition(eye[0], eye[1], eye[2]);
        this.camara.setTarget(target[0], target[1], target[2]);

    }

    // MÃ©todos privados

    pr.transformarEye = function(matriz) {
        var newEye = vec3.create();
        vec3.transformMat4(newEye, this.eyeInicial, matriz);
        return newEye;
    }

    pr.transformarTarget = function(matriz) {
        var newTarget = vec3.create();
        vec3.transformMat4(newTarget, this.targetInicial, matriz);
        return newTarget;
    }

    pr.doRotate = function() {
        this.camara.rotateZ(Utils.degToRad(this.rotateY/this.factorRotacion));
        this.camara.rotateY(Utils.degToRad(this.rotateZ/this.factorRotacion));
    }

    // MÃ©todos pÃºblicos



    pu.rotate = function(rotateY,rotateZ) {
        this.rotateY = rotateY;
        this.rotateZ = rotateZ;
    }

    pu.update = function() {
        var matrizTransformacion = this.objetoASeguir._objectMatrix;
        var newEye = pr.transformarEye.call(this,matrizTransformacion);
        var newTarget = pr.transformarTarget.call(this,matrizTransformacion);
        this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
        this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
        //	 this.doRotate();  TODO que permita rotar
        this.rotateY=0;
        this.rotateZ=0;
    }

    pu.getPerspectiveCamera = function() {
        return this.camara;
    }


    return pu;
})();
function CamaraOrbital(eye, target, up) {

    this.camara;
    this.factorRotacion;
    this.factorZoom;
    this.constructor(eye, target, up);
}

//MÃ©todos
CamaraOrbital.prototype = (function() {
    var pr = {};
    var pu = CamaraOrbital.prototype;

    pu.constructor = function(eye, target, up ) {
        this.camara = new PerspectiveCamera(ConstantesGenerales.WIDTH, ConstantesGenerales.HEIGHT);
        this.camara.setUp(up[0], up[1], up[2]);
        this.camara.setPosition(eye[0], eye[1], eye[2]);
        this.camara.setTarget(target[0], target[1], target[2]);

        this.factorRotacion = 5;
        this.factorZoom = 1.2;

    }

    // MÃ©todos privados


    // MÃ©todos pÃºblicos
    pu.signo = function(n) {
        var res = 0;

        if(n>0) {
            res = 1;
        } else if(n<0) {
            res = -1;
        }

        return res;
    }

    pu.zoomIn = function() {
        this.camara.scale(this.factorZoom);
    }

    pu.zoomOut = function() {
        this.camara.scale(1/this.factorZoom);
    }

    pu.rotate = function(rotateY,rotateZ) {
        this.camara.rotateZ(Utils.degToRad(rotateY/this.factorRotacion));
        this.camara.rotateY(Utils.degToRad(rotateZ/this.factorRotacion));
    }

    pu.getPerspectiveCamera = function() {
        return this.camara;
    }


    return pu;
})();
function CamaraPrimeraPersona(eye, target, up) {

    this.camara;
    this.targetInicial;
    this.eyeInicial;
    this.objetoFicticio;
    this.constructor(eye, target, up);
}

//MÃ©todos
CamaraPrimeraPersona.prototype = (function() {
    var pr = {};
    var pu = CamaraPrimeraPersona.prototype;

    pu.constructor = function(eye, target, up ) {
        this.targetInicial = target;
        this.eyeInicial = eye;
        this.camara = new PerspectiveCamera(ConstantesGenerales.WIDTH, ConstantesGenerales.HEIGHT);
        this.camara.setUp(up[0], up[1], up[2]);
        this.camara.setPosition(eye[0], eye[1], eye[2]);
        this.camara.setTarget(target[0], target[1], target[2]);
        this.objetoFicticio = new Transformable();
        this.objetoFicticio.setPosition(eye[0], eye[1], eye[2]);

    }

    // MÃ©todos privados

    pr.transformarEye = function(matriz) {
        var newEye = vec3.create();
        vec3.transformMat4(newEye, this.eyeInicial, matriz);
        return newEye;
    }

    pr.transformarTarget = function(matriz) {
        var newTarget = vec3.create();
        vec3.transformMat4(newTarget, this.targetInicial, matriz);
        return newTarget;
    }

    pr.update = function() {
        var matrizTransformacion = this.objetoFicticio._objectMatrix;
        var newEye = pr.transformarEye.call(this,matrizTransformacion);
        var newTarget = pr.transformarTarget.call(this,matrizTransformacion);
        this.camara.setPosition(newEye[0], newEye[1], newEye[2]);
        this.camara.setTarget(newTarget[0], newTarget[1], newTarget[2]);
    }

    // MÃ©todos pÃºblicos

    pu.rotate = function(rotateY,rotateZ) {
        this.objetoFicticio.rotateZ(-Utils.degToRad(rotateY/5));
        this.objetoFicticio.rotateY(Utils.degToRad(rotateZ/5));
        pr.update.call(this);
    }

    pu.trasladarDerecha = function (n) {
        this.objetoFicticio.translate(0,-n,0);
        pr.update.call(this);
    }

    pu.trasladarIzquierda = function(n) {
        this.objetoFicticio.translate(0,n,0);
        pr.update.call(this);
    }

    pu.trasladarAdelante = function (n) {
        this.objetoFicticio.translate(n,0,0);
        pr.update.call(this);
    }

    pu.trasladarAtras = function (n) {
        this.objetoFicticio.translate(-n,0,0);
        pr.update.call(this);
    }

    pu.getPerspectiveCamera = function() {
        return this.camara;
    }


    return pu;
})();
/*
 Loma
 */
function Loma() {
    this._cuerpoRigido;

    this.constructor();
}

// MÃ©todos
Loma.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        var material = new ColoredMaterial(Color.GREY);

        var side = new Prism(30, 15, 4, 32, material);
        side._geometry.setCenteredInKernel(false);
        side._geometry.setClosedEndings(false);

        var top = new Polygon(new Circle(15), Color.GREY);
        top.translateY(4);
        top.rotateX(Utils.degToRad(-90));

        pu.addChild.call(this, side);
        pu.addChild.call(this, top);

        var mass = 0;
        var lomaShape = new CANNON.Cylinder(15,30,4,32);

        var groundMaterial = new CANNON.Material("groundMaterial");
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,lomaShape, groundMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    return pu;
})();/*
 Domo
 */
function Domo() {
    this.constructor();
    this._cuerpoRigido;
    this._metalMaterial;
}

// MÃ©todos
Domo.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var radius = 44;
        var height = 40;

        var side = new Path(10);
        side.addStretch(new CubicBezier([
            [radius,0], [radius,height/2], [radius/2,height], [0,height]
        ]));

        var geometry = new RevolutionSurface(side, 40);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        var material = new TexturedMaterial("images/domo.jpg");
        material.setLightMap("images/domo-ilum.jpg", 6.0);
        pu.init.call(this, geometry, material);

        var mass = 0;
        var domoShape = new CANNON.Sphere(radius);
        this._metalMaterial = new CANNON.Material("metalMaterial");
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,domoShape, this._metalMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    pu.getMaterial = function() {
        return this._metalMaterial;
    }

    return pu;
})();/*
 Manguera
 */
function Manguera( path ) {
    this.constructor(path);
}

// MÃ©todos
Manguera.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function( path ) {
        PrimitiveModel.prototype.constructor.call(this);

        var circulo = new Circle(1.5);

        var recorrido = new Path(8);
        recorrido.addStretch(new CubicBSpline(path));

        var geometry = new SweptSurface(recorrido, circulo);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);

        pu.init.call(this, geometry, new ColoredMaterial(Color.ORANGE));
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 MÃ³dulo habitable
 */
function ModuloHabitable() {
    this._cuerpoRigido;

    this.constructor();
}

// MÃ©todos
ModuloHabitable.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var w = 3;
        var h = 2;
        var d = 4;

        var recorrido = new Path(10);
        recorrido.addStretch(new LinearCurve([[0,0], [d,0]]));

        var modulo = new Path(6);
        modulo.addStretch(new LinearCurve([
            [-w/2,-0.5+h/2], [-w/2,-0.3+h/2], [-w/2+0.2,-0.3+h/2],
            [-w/2+0.2,0.3+h/2], [-w/2,0.3+h/2], [-w/2,0.5+h/2]
        ]));
        modulo.addStretch(new QuadraticBezier([
            [-w/2,0.5+h/2], [-w/2,h], [-w/3,h]
        ]));
        modulo.addStretch(new LinearCurve([
            [-w/3,h], [w/3,h]
        ]));
        modulo.addStretch(new QuadraticBezier([
            [w/3,h], [w/2,h], [w/2,0.5+h/2]
        ]));
        modulo.addStretch(new LinearCurve([
            [w/2,0.5+h/2], [w/2,0.3+h/2], [w/2-0.2,0.3+h/2],
            [w/2-0.2,-0.3+h/2], [w/2,-0.3+h/2], [w/2,-0.5+h/2]
        ]));
        modulo.addStretch(new QuadraticBezier([
            [w/2,-0.5+h/2], [w/2,0], [w/3,0]
        ]));
        modulo.addStretch(new LinearCurve([
            [w/3,0], [-w/3,0]
        ]));
        modulo.addStretch(new QuadraticBezier([
            [-w/3,0], [-w/2,0], [-w/2,-0.5+h/2]
        ]));

        modulo.scale(0.5);

        var geometry = new SweptSurface(recorrido, modulo);
        geometry.setClosedShapes(false);
        geometry.setClosedEndings(false);

        modulo.resetTransformations();
        modulo.scale(0.7);
        geometry.addShape(modulo, 0.15);

        modulo.resetTransformations();
        modulo.scale(0.5);
        geometry.addShape(modulo, 0.75);

        var material = new TexturedMaterial("images/modulo.jpg");
        material.setLightMap("images/modulo-ilum.jpg", 8.0);
        material.scale(-1, 2);
        material.translate(0.19, -0.015);

        pu.init.call(this, geometry, material);

        var mass = 0;
        var moduloShape = new CANNON.Box(new CANNON.Vec3(d*8,w*3,h*3)); // TODO dimensiones

        var metalMaterial = new CANNON.Material("metalMaterial");
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,moduloShape, this._metalMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    return pu;
})();/*
 Silo
 */
function Silo() {
    this.constructor();
}

// MÃ©todos
Silo.prototype = (function() {
    var pr = {};
    var pu = Object.create(ComplexModel.prototype);

    pu.constructor = function() {
        ComplexModel.prototype.constructor.call(this);

        var material = new TexturedMaterial("images/chapas.jpg");
        material.setNormalMap("images/chapas-normalmap.jpg");
        material.scale(4, 4);

        var side = new Prism(1, 1, 2, 32, material);
        side._geometry.setCenteredInKernel(false);
        side._geometry.setClosedEndings(false);

        var top = new Polygon(new Circle(1), Color.GREY);
        top.translateY(2);
        top.rotateX(Utils.degToRad(-90));

        pu.addChild.call(this, side);
        pu.addChild.call(this, top);

        var mass = 0;
        var siloShape = new CANNON.Cylinder(20,20,32,20);

        var metalMaterial = new CANNON.Material("metalMaterial");
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,siloShape, this._metalMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    return pu;
})();/*
 Torre de control
 */
function TorreDeControl() {
    this.constructor();
}

// MÃ©todos
TorreDeControl.prototype = (function() {
    var pr = {};
    var pu = Object.create(PrimitiveModel.prototype);

    pu.constructor = function() {
        PrimitiveModel.prototype.constructor.call(this);

        var torre = new Path(10);
        torre.addStretch(new LinearCurve([
            [2,0], [2,2], [1,3], [1,5]
        ]));
        torre.addStretch(new QuadraticBezier([
            [1,5], [3.2,5], [3.6,5.7], [3,6], [3,6.5], [3.6,6.8],
            [3.2,7.4], [2.7,7.8], [1,8.2], [0,8.2]
        ]));

        var geometry = new RevolutionSurface(torre, 30);
        geometry.setClosedEndings(false);
        geometry.setCenteredInKernel(false);

        var material = new TexturedMaterial("images/torre.jpg");
        material.setLightMap("images/torre-ilum.jpg", 7.0);
        material.mosaic(true, false);
        material.scale(2, 1.4);

        pu.init.call(this, geometry, material);

        var mass = 0;
        var torreShape = new CANNON.Cylinder(29,29,30,16);

        var metalMaterial = new CANNON.Material("metalMaterial");
        this._cuerpoRigido = new CANNON.RigidBody(mass*10,torreShape, this._metalMaterial);
        this._cuerpoRigido.useQuaternion = true;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos
    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }
    return pu;
})();
function Piso() {
    this._cuerpoRigido;
    this._groundMaterial;

    this.constructor();
}

// MÃ©todos
Piso.prototype = (function() {
    var pr = {};
    var pu = Object.create(Sprite.prototype);

    pu.constructor = function() {
        var pisoSize = 1000;

        var material = new TexturedMaterial("images/superficie.jpg");
        material.setNormalMap("images/superficie-normalmap.jpg");

        Sprite.prototype.constructor.call(this, pisoSize, pisoSize, material);

        pu.translateZ.call(this, -10);

        // TODO creo que acÃ¡ es en y = -10
        // Plano del Suelo, ubicado en z = -10
        this._groundMaterial = new CANNON.Material("groundMaterial");
        var groundShape = new CANNON.Plane();
        // masa 0 implica que el cuerpo tiene masa infinita
        this._cuerpoRigido = new CANNON.RigidBody(0, groundShape, this._groundMaterial);
        this._cuerpoRigido.useQuaternion = true;
        this._cuerpoRigido.position.z = ConstantesTanque.ALTURA_PISO;
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    pu.getCuerpoRigido = function() {
        return this._cuerpoRigido;
    }

    pu.getMaterial = function() {
        return this._groundMaterial;
    }

    return pu;
})();/*
 Tierra
 */
function Tierra() {
    this.constructor();
}

// MÃ©todos
Tierra.prototype = (function() {
    var pr = {};
    var pu = Object.create(Prism.prototype);

    pu.constructor = function() {
        var material = new TexturedMaterial("images/tierra.jpg");
        material.setShininess(0.4);

        Sphere.prototype.constructor.call(this, 100, 20, material);
        this._geometry.invertNormals();
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();/*
 Fondo
 */
function Fondo() {
    this.constructor();
}

// MÃ©todos
Fondo.prototype = (function() {
    var pr = {};
    var pu = Object.create(Prism.prototype);

    pu.constructor = function() {
        var material = new TexturedMaterial("images/background.jpg");
        material.setLightSupport(false);
        material.scale(0.5, 0.5);
        material.translate(2.3, 0.4);

        Prism.prototype.constructor.call(this, 900, 900, 1200, 24, material);
        this._geometry.setClosedEndings(false);

        pu.rotateX.call(this, Utils.degToRad(90));
        pu.rotateY.call(this, Utils.degToRad(270+45));
    }

    // MÃ©todos privados

    // MÃ©todos pÃºblicos

    return pu;
})();function Simulador(cuerposRigidos) {

    this.cuerposRigidos;
    this.world;
    this.constructor(cuerposRigidos);
    this.velocidadMotor;
    this.anguloVolante;

    this.chasisRb;
    this.ruedaIzqDelRb;
    this.ruedaDerDelRb;
    this.ruedaIzqTraRb;
    this.ruedaDerTraRb;

    this.constraints;
}

//Constantes
var anchoChasis = ConstantesTanque.ANCHO_CHASIS;
var altoChasis = ConstantesTanque.ALTO_CHASIS;
var profundidadChasis = ConstantesTanque.PROFUNDIDAD_CHASIS;
var radioRueda = ConstantesRueda.CILINDRO_RADIO;

var profundidadRueda = ConstantesRueda.CILINDRO_ALTURA;
var segmentosRueda = ConstantesRueda.CILINDRO_RADIO.CILINDRO_CARAS;

var distanciaRuedaAlChasis=6.0;



// MÃ©todos
Simulador.prototype = (function() {
    var pr = {};
    var pu = Simulador.prototype;

    // MÃ©todos privados

    pr.updateConstraintsAuto = function(){

        var zero = new CANNON.Vec3();

        for(var i=0; i<this.constraints.length; i++)
            this.world.removeConstraint(this.constraints[i]);

        // Girar las ruedas
        var leftAxis = new CANNON.Vec3(0,1,0);
        var rightAxis = new CANNON.Vec3(0,-1,0);

        var angVolanteEnRadianes=Math.max(-45,Math.min(45,this.anguloVolante))*Math.PI/180;

        leftFrontAxis =  new CANNON.Vec3(Math.sin(angVolanteEnRadianes),Math.cos(angVolanteEnRadianes),0);
        rightFrontAxis = new CANNON.Vec3(Math.sin(angVolanteEnRadianes),Math.cos(angVolanteEnRadianes),0);

        leftFrontAxis.normalize();
        rightFrontAxis.normalize();

        // Tren delantero
        var frontLeftHinge=new CANNON.HingeConstraint(this.chasisRb,
            new CANNON.Vec3( ConstantesTanque.POSICION_X_TREN_DELANTERO, distanciaRuedaAlChasis, -altoChasis/2), leftFrontAxis,
            this.ruedaIzqDelRb, zero, leftAxis);
        var frontRightHinge=new CANNON.HingeConstraint(this.chasisRb,
            new CANNON.Vec3( ConstantesTanque.POSICION_X_TREN_DELANTERO,-distanciaRuedaAlChasis, -altoChasis/2), rightFrontAxis,
            this.ruedaDerDelRb, zero, rightAxis);
        // Tren trasero
        var backLeftHinge=new CANNON.HingeConstraint(this.chasisRb,
            new CANNON.Vec3(ConstantesTanque.POSICION_X_TREN_TRASERO, distanciaRuedaAlChasis, -altoChasis/2), leftAxis,
            this.ruedaIzqTraRb, zero, leftAxis);
        var backRightHinge=new CANNON.HingeConstraint(this.chasisRb,
            new CANNON.Vec3(ConstantesTanque.POSICION_X_TREN_TRASERO,-distanciaRuedaAlChasis, -altoChasis/2), rightAxis,
            this.ruedaDerTraRb, zero, rightAxis);

        backLeftHinge.enableMotor();
        backRightHinge.enableMotor();

        var traccionRuedaIzq=this.velocidadMotor;
        var traccionRuedaDer=this.velocidadMotor;


        if (angVolanteEnRadianes>0) {
            traccionRuedaDer=Math.cos(angVolanteEnRadianes)*traccionRuedaDer*0.8;
        } else if (angVolanteEnRadianes<0) {
            traccionRuedaIzq=Math.cos(angVolanteEnRadianes)*traccionRuedaIzq*0.8;
        }

        backLeftHinge.motorTargetVelocity = -traccionRuedaIzq;
        backRightHinge.motorTargetVelocity =  traccionRuedaDer;

        this.constraints=[frontLeftHinge,frontRightHinge,backLeftHinge,backRightHinge];

        for(var i=0; i<this.constraints.length; i++)
            this.world.addConstraint(this.constraints[i]);
    }

    pu.constructor = function(cuerposRigidos) {
        this.cuerposRigidos = cuerposRigidos;
        this.world = new CANNON.World();
        this.world.gravity.set(0,0,ConstantesTanque.GRAVEDAD);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        this.world.solver.iterations = 10;

        var mass=1;
        var friccion=1.0 // Coeficiente de rosamiento
        var restitucion=0.1 //0.0 coche plastico 1.0 coche elastico

        // Atributos del movimiento del tanque
        this.anguloVolante = ConstantesTanque.ANGULO_INICIAL_VOLANTE;
        this.velocidadMotor = ConstantesTanque.VELOCIDAD_INICIAL_MOTOR;

        // Cuerpos rigidos que componen el tanque
        this.chasisRb = cuerposRigidos[1].getCuerpoRigido();
        this.ruedaIzqDelRb = cuerposRigidos[10].getCuerpoRigido();
        this.ruedaDerDelRb = cuerposRigidos[11].getCuerpoRigido();
        this.ruedaIzqTraRb = cuerposRigidos[12].getCuerpoRigido();
        this.ruedaDerTraRb = cuerposRigidos[13].getCuerpoRigido();

        this.constraints = [];
        var mass=1;
        var alturaInicial = ConstantesTanque.ALTURA_INICIAL;

        // Inicializar cuerpos rigidos

        var piso = cuerposRigidos[0];

        var wheelMaterial = ruedaIzquierdaDelantera.getMaterial();
        var wheelGroundContactMaterial = new CANNON.ContactMaterial(piso.getMaterial(), wheelMaterial, friccion, restitucion);
        this.world.addContactMaterial(wheelGroundContactMaterial);


        var domo = cuerposRigidos[2];
        var chasisMaterial = cuerposRigidos[1].getMaterial();
        var metalMaterial = domo.getMaterial();
        var chasisMetalContactMaterial = new CANNON.ContactMaterial(chasisMaterial, metalMaterial, 1, 1);
        this.world.addContactMaterial(chasisMetalContactMaterial);

        // Setea la posicion en la que aparece el cuerpo rigido chasis
        this.chasisRb.position.set( 0, 0 , alturaInicial );


        // Setear la posicion en la que aparecen los cuerpos rigidos de las ruedas
        this.ruedaIzqDelRb.position.set(  ConstantesTanque.POSICION_X_TREN_DELANTERO,  distanciaRuedaAlChasis, alturaInicial);
        this.ruedaDerDelRb.position.set(  ConstantesTanque.POSICION_X_TREN_DELANTERO, -distanciaRuedaAlChasis, alturaInicial);
        this.ruedaIzqTraRb.position.set(  ConstantesTanque.POSICION_X_TREN_TRASERO,  distanciaRuedaAlChasis, alturaInicial);
        this.ruedaDerTraRb.position.set(   ConstantesTanque.POSICION_X_TREN_TRASERO, -distanciaRuedaAlChasis, alturaInicial);

        // Posicion del domo
        domo.translate(100, -136, -10);
        var positionDomo = domo.getPosition();
        domo.getCuerpoRigido().position.set(positionDomo[0], positionDomo[1], -10);


        // Posicion habitable 1
        var hab1 = cuerposRigidos[3];
        hab1.translate(38, -136, 0);
        var positionHab1 = hab1.getPosition();
        hab1.getCuerpoRigido().position.set(positionHab1[0], positionHab1[1], -10);


        // Posicion habitable 2
        var hab2 = cuerposRigidos[4];
        hab2.translate(-10, -136, 0);
        var positionHab2 = hab2.getPosition();
        hab2.getCuerpoRigido().position.set(positionHab2[0], positionHab2[1], -10);


        // Posicion habitable 3
        var hab3 = cuerposRigidos[5];
        hab3.translate(-58, -136, 0);
        var positionHab3 = hab3.getPosition();
        hab3.getCuerpoRigido().position.set(positionHab3[0], positionHab3[1], -10);


        // Posicion torre de control
        var torre = cuerposRigidos[6];
        torre.translate(-104, -136, -10);
        var positionTorre = torre.getPosition();
        torre.getCuerpoRigido().position.set(positionTorre[0], positionTorre[1], -10);


        // Posicion silo1
        silo1 = cuerposRigidos[7];
        silo1.translate(-104, 0, -10);
        var positionSilo1 = silo1.getPosition();
        silo1.getCuerpoRigido().position.set(positionSilo1[0], positionSilo1[1], -10);


        // Posicion silo2
        silo2 = cuerposRigidos[8];
        silo2.translate(-54, 0, -10);
        var positionSilo2 = silo2.getPosition();
        silo2.getCuerpoRigido().position.set(positionSilo2[0], positionSilo2[1], -10);


        // Posicion silo3
        silo3 = cuerposRigidos[9];
        silo3.translate(-154, 0, -10);
        var positionSilo3 = silo3.getPosition();
        silo3.getCuerpoRigido().position.set(positionSilo3[0], positionSilo3[1], -10);

        // Posicion loma
        loma = cuerposRigidos[14];
        loma.translate(40, 60, -10);
        var positionLoma = loma.getPosition();
        loma.getCuerpoRigido().position.set(positionLoma[0], positionLoma[1], -8);

        // Agregar los cuerpos rigidos al mundo
        for(var i=0; i<this.cuerposRigidos.length; i++)
            this.world.add((this.cuerposRigidos[i]).getCuerpoRigido());

        // Actualiza restricciones
        pr.updateConstraintsAuto.call(this);

    }

    // MÃ©todos pÃºblicos

    pu.incrementarVelocidad = function (incremento){
        if(this.velocidadMotor > 0 && incremento < 0 ||
            this.velocidadMotor < 0 && incremento > 0)
            incremento*=2;
        this.velocidadMotor+=incremento;
        pr.updateConstraintsAuto.call(this);
    }

    pu.frenarAuto = function (decremento){
        if(Math.abs(this.velocidadMotor) < decremento)
            this.velocidadMotor = 0;

        if(this.velocidadMotor > 0)
            this.velocidadMotor -= decremento;
        else if(this.velocidadMotor < 0)
            this.velocidadMotor += decremento;

        pr.updateConstraintsAuto.call(this);
    }

    pu.incrementarAnguloVolante = function(incremento){
        if(this.anguloVolante > 0 && incremento < 0 ||
            this.anguloVolante < 0 && incremento > 0)
            incremento*=2;
        this.anguloVolante=Math.max(-45,Math.min(45,this.anguloVolante+incremento))
        pr.updateConstraintsAuto.call(this);
    }

    pu.enderezarDireccion = function (decremento){
        if(Math.abs(this.anguloVolante) < decremento)
            this.anguloVolante = 0;

        if(this.anguloVolante > 0)
            this.anguloVolante -= decremento;
        else if(this.anguloVolante < 0)
            this.anguloVolante += decremento;

        pr.updateConstraintsAuto.call(this);
    }

    pu.update=function() {
        var timeStep=1/60;
        this.world.step(timeStep);
    }

    return pu;
})();
var renderer, camara, escena, piso, auto, simulador;
var ruedaIzquierdaDelantera, ruedaDerechaDelantera;
var ruedaIzquierdaTrasera, ruedaDerechaTrasera;
var camaraOrbital, camaraSeguimiento, camaraPrimeraPersona;
var tick = 1;
var ambientColor, directionalColor, spotlightColor, directionalPosition;
var spotlightPosition, spotlightDirection;

function init() {
    var up = vec3.fromValues(0,0,-1);

    var w = ConstantesGenerales.WIDTH;
    var h = ConstantesGenerales.HEIGHT;

    renderer = new Renderer(w, h);

    // ubico el canvas del renderer en el body
    var bodyCenter = document.body.getElementsByTagName("center")[0];
    bodyCenter.appendChild(renderer.getCanvasElement());

    // base
    piso = new Piso();
    fondo = new Fondo();
    fondo.translateY(200);

    var tierra = new Tierra();
    tierra.translate(400, -100, 300);
    tierra.rotateZ(Utils.degToRad(-90));

    domo = new Domo();

    hab1 = new ModuloHabitable();
    hab2 = new ModuloHabitable();
    hab3 = new ModuloHabitable();

    torre = new TorreDeControl();

    silo1 = new Silo();
    silo2 = new Silo();
    silo3 = new Silo();

    mang1P = [[0,0,0], [0,0,0], [0,0,0], [10,0,50], [-30,0,70],
        [0,0,120], [0,0,120], [0,0,120]
    ];
    mang1 = new Manguera(mang1P);
    mang1.translate(-104, -60, -8);
    mang1.rotateX(Utils.degToRad(90));

    mang2P = [[0,0,0], [0,0,0], [0,0,0], [0,0,50], [-20,0,70],
        [-40,0,120], [-40,0,120], [-40,0,120]
    ];
    mang2 = new Manguera(mang2P);
    mang2.translate(-66, -60, -8);
    mang2.rotateX(Utils.degToRad(90));

    mang3P = [[0,0,0], [0,0,0], [0,0,0], [20,0,10], [-10,0,40],
        [40,0,120], [40,0,120], [40,0,120]
    ];
    mang3 = new Manguera(mang3P);
    mang3.translate(-144, -60, -8);
    mang3.rotateX(Utils.degToRad(90));

    // auto
    auto = new Auto();
    ruedaIzquierdaDelantera = new Rueda();
    ruedaDerechaDelantera = new Rueda();
    ruedaIzquierdaTrasera = new Rueda();
    ruedaDerechaTrasera = new Rueda();

    loma = new Loma();

    escena = new Scene();

    // habilita la iluminacion
    ambientColor = 0.1;
    directionalColor = 0.4;
    spotlightColor = 1.0;

    directionalPosition = [-600, 200, 400];
    spotlightPosition =  [10.0, 0.0, 0.0];
    spotlightDirection = [1.0, 0.0, -0.7]; // TODO deberia ser -1,0,0

    escena.setAuto(auto);
    escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);

    //var nGrapher = new NormalsGrapher(domo);

    // agrego los modelos que renderizo
    escena.add(piso);
    escena.add(fondo);
    escena.add(tierra);
    escena.add(domo);
    escena.add(hab1);
    escena.add(hab2);
    escena.add(hab3);
    escena.add(torre);
    escena.add(silo1);
    escena.add(silo2);
    escena.add(silo3);
    escena.add(mang1);
    escena.add(mang2);
    escena.add(mang3);
    escena.add(loma);

    escena.add(auto);
    escena.add(ruedaIzquierdaDelantera);
    escena.add(ruedaDerechaDelantera);
    escena.add(ruedaIzquierdaTrasera);
    escena.add(ruedaDerechaTrasera);
    //  escena.add(nGrapher);


    var cuerposRigidos = [piso, auto.getChasis(), domo, hab1, hab2,
        hab3, torre, silo1, silo2, silo3,
        ruedaIzquierdaDelantera, ruedaDerechaDelantera,
        ruedaIzquierdaTrasera, ruedaDerechaTrasera, loma];

    simulador = new Simulador(cuerposRigidos);

    domo.rotateX(Utils.degToRad(90));

    hab1.scale(12);
    hab1.rotateX(Utils.degToRad(90));

    hab2.scale(12);
    hab2.rotateX(Utils.degToRad(90));

    hab3.scale(12);
    hab3.rotateX(Utils.degToRad(90));

    torre.scale(12);
    torre.rotateX(Utils.degToRad(90));

    silo1.scale(16);
    silo1.rotateX(Utils.degToRad(90));

    silo2.scale(16);
    silo2.rotateX(Utils.degToRad(90));

    silo3.scale(16);
    silo3.rotateX(Utils.degToRad(90));

    loma.rotateX(Utils.degToRad(90));

    var eyeSeguimiento = vec3.fromValues(-20, 0, 3);
    var targetSeguimiento = vec3.fromValues(-4, 0, 0);
    camaraSeguimiento = new CamaraSeguimiento(auto, eyeSeguimiento, targetSeguimiento, up);

    var eyeOrbital = vec3.fromValues(0,100,20);
    var targetOrbital= vec3.fromValues(0,0,-10)
    camaraOrbital = new CamaraOrbital(eyeOrbital, targetOrbital, up);
    camara = camaraOrbital;

    var eyePP = vec3.fromValues(0,0,6);
    var targetPP= vec3.fromValues(3,0,6);
    camaraPrimeraPersona = new CamaraPrimeraPersona(eyePP, targetPP, up);
}

function listenToKeyboard( tick ) {
    // TODO: dado que Keyboard es estÃ¡tico serÃ­a bueno poner el
    // comportamiento de a cada objeto en los metodos update()
    // correspondientes y no en esta funcion

    // camaras
    if(Keyboard.isKeyPressed(Keyboard.N1))
        camara = camaraOrbital;
    else if(Keyboard.isKeyPressed(Keyboard.N2))
        camara = camaraSeguimiento;
    else if(Keyboard.isKeyPressed(Keyboard.N3))
        camara = camaraPrimeraPersona;
    var camaraVel = 1;

    if(Keyboard.isKeyPressed(Keyboard.U))
        camaraPrimeraPersona.trasladarAdelante(camaraVel);
    else if(Keyboard.isKeyPressed(Keyboard.J))
        camaraPrimeraPersona.trasladarAtras(camaraVel);

    if(Keyboard.isKeyPressed(Keyboard.K))
        camaraPrimeraPersona.trasladarDerecha(camaraVel);
    else if(Keyboard.isKeyPressed(Keyboard.H))
        camaraPrimeraPersona.trasladarIzquierda(camaraVel);

    // auto
    var aceleracion = 0.2;
    var giro = 0.5;

    if(Keyboard.isKeyPressed(Keyboard.W))
        simulador.incrementarVelocidad(aceleracion);
    else if(Keyboard.isKeyPressed(Keyboard.S))
        simulador.incrementarVelocidad(-aceleracion);
    else
        simulador.frenarAuto(aceleracion);

    if(Keyboard.isKeyPressed(Keyboard.D))
        simulador.incrementarAnguloVolante(giro);
    else if(Keyboard.isKeyPressed(Keyboard.A))
        simulador.incrementarAnguloVolante(-giro);
    else
        simulador.enderezarDireccion(giro);

    var torretaVel = 0.01;

    if(Keyboard.isKeyPressed(Keyboard.V))
        auto.girarTorretaHorizontal(-torretaVel);
    else if(Keyboard.isKeyPressed(Keyboard.N))
        auto.girarTorretaHorizontal(torretaVel);

    if(Keyboard.isKeyPressed(Keyboard.G))
        auto.girarTorretaVertical(-torretaVel);
    else if(Keyboard.isKeyPressed(Keyboard.B))
        auto.girarTorretaVertical(torretaVel);

    if(Keyboard.isKeyPressed(Keyboard.SPACE))
        auto.dispararCaniones(tick);

    // luz
    if(Keyboard.isKeyPressed(Keyboard.Z, true)) {
        spotlightColor = spotlightColor>0?0.0:1.0;
        escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);
    }

    if(Keyboard.isKeyPressed(Keyboard.P)) {
        spotlightColor+=0.05;
        if(spotlightColor>1.0)
            spotlightColor=1.0;
        escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);
    }

    if(Keyboard.isKeyPressed(Keyboard.O)) {
        spotlightColor-=0.05;
        if(spotlightColor<0)
            spotlightColor=0;
        escena.setLightSources(ambientColor, directionalColor, directionalPosition, spotlightColor, spotlightPosition, spotlightDirection);
    }
}

function listenToMouse() {
    if(Mouse.isButtonPressed(Mouse.LEFT)) {
        var speed = 10;

        var deltaX = Mouse.getDeltaX();
        var deltaY = Mouse.getDeltaY();

        camara.rotate(deltaX*speed, deltaY*speed);
    }

    if(camara==camaraOrbital && Mouse.isWheelMoving()) {
        if (Mouse.getWheelDelta() < 0)
            camara.zoomOut();
        else
            camara.zoomIn();
    }
}

function main() {

    init();

    // loop principal
    var render = function() {
        requestAnimationFrame(render);

        renderer.clear();

        listenToKeyboard(tick);
        listenToMouse();

        simulador.update();
        camaraSeguimiento.update();

        escena.update();  // actualiza todos los modelos
        renderer.render(escena, camara.getPerspectiveCamera());
        auto.guardarCaniones(tick);
        tick += 0.01;
    }

    render();  // comienza el loop principal
}