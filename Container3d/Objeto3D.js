var CUADRADO;
CUADRADO = "cuadrado";
var CIRCUNFERENCIA;
CIRCUNFERENCIA = "circunferencia";
var LINEA;
LINEA = "linea";
var BASE_RUTA = "base_ruta";
var ASFALTO_RUTA = "asfalto_ruta";
var ESTRUCTURA_EDIFICIO= "estructura_edificio";
var TAPA_EDIFICIO="tapa_edificio";
var CALLE = "calle";
var CARROCERIA="carroceria";
var RUEDA="rueda";
var ESCENA ="escena";
var VEREDA = "vereda";
var TECHO = "techo";
var COLUMNA= "columna";
var BASE_COLUMNA="base_columna";
var TAPA_COLUMNA = "tapa_columna";

var EDIFICIO = "edificio";
var RUTA = "ruta";
var FAROL = "farol";
var AUTO = "auto";
var CALLE = "calle";


class Objeto3D extends Container3D{

  constructor(){
    super();

    this.figuras = null;
    this.figuras = new FigurasPrimitivas();

    this.posBuffer = null;
    this.indexBuffer = null;
    this.colorBuffer = null;
    this.normalBuffer = null;
    this.textureBuffer1 = null;

    this.webglPosBuffer = null;
    this.webglNormalBuffer = null;
    this.webglColorBuffer = null;
    this.webglIndexBuffer = null;
    this.webglTextureBuffer = null;

    this.bufferCreator = null;

    this.objectType = null;
    this.id = null;
    }

    //recibe un objectype que es un string que tiene que ser similar a alguno de los define superiores
    //id no se bien que es
    setType(objectType, id){
        this.objectType = objectType;
        this.id = id;
    }

    /**********METODOS DE MODELADO*************/

    //Define al constructor de BufferCreator que devuelve un array del buffer pedido
    setBufferCreator(bufferCalculator){
        this.bufferCreator = bufferCalculator;
    }

    /**********METODOS DE DIBUJADO**********/
    /*Construye todos los buffers necesitados*/
    build(){
        this.posBuffer = this.bufferCreator.getPosBuffer();
        this.normalBuffer =this.bufferCreator.getNormalBuffer();
        this.colorBuffer = this.bufferCreator.getColorBuffer();
        this.indexBuffer = this.bufferCreator.getIndexBuffer();
        this.textureBuffer1 = this.bufferCreator.getTextureBuffer1();
        this.setUpWebGLBuffers();
    }

    /*Setea los WebGlBuffers para la hora de renderizar*/
    setUpWebGLBuffers(){

        this.webglNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        this.webglNormalBuffer.itemSize = 3;
        this.webglNormalBuffer.numItems = this.normalBuffer.length / 3;

        this.webglColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorBuffer), gl.STATIC_DRAW);
        this.webglColorBuffer.itemSize = 3;
        this.webglColorBuffer.numItems = this.colorBuffer.length / 3;

        this.webglPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.posBuffer), gl.STATIC_DRAW);
        this.webglPosBuffer.itemSize = 3;
        this.webglPosBuffer.numItems = this.posBuffer.length / 3;

        this.webglIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webglIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        this.webglIndexBuffer.itemSize = 1;
        this.webglIndexBuffer.numItems = this.indexBuffer.length;

        if(this.textureBuffer1.length > 0){
            this.webglTextureBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webglTextureBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.textureBuffer1), gl.STATIC_DRAW);
            this.webglTextureBuffer.itemSize = 2;
            this.webglTextureBuffer.numItems = this.textureBuffer1.length;
        }

}

    /*
     arrayMatTrans es un array de matrices de 3x3 que al multiplicarla con cada
     nivel se aplica la transformacion de rotacion o escalado y lo mismo con el array de posicion para
     transformaciones de traslacion.
     IMPORTANTE:la cantidad de rows tiene que ser igual a la longitud del arrayMat y del Array Pos
     */
    calcularSuperficieBarrido(figura, rows, colms, arrayMatT, arrayVecPos, barrer = true){

        //console.log("supBarrido");
        var buffcalc = new BufferCalculator(rows, colms);
        //chequeo tamaños correctos
        if((arrayMatT.length != rows || arrayVecPos.length != rows)) {
            //Se chequea el caso en el que es edificio
            if (arrayVecPos.length != rows + 1) {
                console.log("error de dimension para la superficie con escalado");
            }
        }

        var vertices = [];
        var arrayVecNOR = [];

        if (figura == CUADRADO){
            if(colms != 5){
                console.log("para hacer un cuadrado se necesitan exactamente 5 vertices");
            }
            this.figuras.calcularCuadrado(vertices, arrayVecNOR);
        }

       else if(figura == ESTRUCTURA_EDIFICIO){
            if(colms != 5){
                console.log("para hacer un edificio se necesitan exactamente 5 vertices");
            }
            //Si estamos en el edificio, se le agrega un vector para el escalado.
            //Lo borramos para no romper la superficie.
            var escalado = arrayVecPos.pop();
            this.figuras.calcularEstructuraEdificio(vertices,arrayVecNOR,escalado);
            this.addColor(buffcalc,25, 1.0, 0.0, 0.0);

        }

        else if(figura == TAPA_EDIFICIO){
            if(colms != 2){
                console.log("para hacer una tapa se necesitan exactamente 2 vertices");
            }
            //el ultimo trae la dimension de x
           var escalado = arrayVecPos.pop();
           this.figuras.calcularTapaEdificio(vertices,arrayVecNOR,escalado[0]);
           this.addColor(buffcalc, 4, 1.0,0.0,0.0);

        }

        else if(figura == CIRCUNFERENCIA){
            var radio = 0.35;
            this.figuras.calcularCirculo(colms, vertices, arrayVecNOR, radio);
        }

        else if(figura == LINEA){
            if(colms != 2){
                console.log("para hacer una linea se necesitan exactamente 2 vertices");
            }
            //console.log(colms);
            this.figuras.calcularLinea(vertices, arrayVecNOR);
        }

        else if(figura == BASE_RUTA){
            if(colms != 17){
                console.log("para hacer una base de ruta se necesitan exactamente 9 vertices");
            }
            this.figuras.calcularBaseRuta(vertices, arrayVecNOR);
            this.addColor(buffcalc,1000,0.66,0.64,0.60);
        }

        else if(figura == ASFALTO_RUTA){
            if(colms != 9){
                console.log("para hacer el asfalto de la ruta se necesitan exactamente 5 vertices");
            }
            this.figuras.calcularAsfaltoRuta(vertices, arrayVecNOR);
            this.addColor(buffcalc,5000,0.2 ,0.2 ,0.2);

        }

        else if(figura == CALLE){
            if(colms != 2){
                console.log("para hacer una calle se necesitan exactamente 2 vertices");
            }
            escalado = arrayVecPos.pop();
            this.figuras.calcularCalle(vertices, arrayVecNOR, escalado[0]);
            buffcalc.setTextures(1);
            //this.addColor(buffcalc, 4, 0.3, 0.3, 0.3);

        }

        else if(figura == ESCENA){
            if(colms != 2){
                console.log("para hacer una grilla se necesitan exactamente 2 vertices");
            }
            escalado = arrayVecPos.pop();
            this.figuras.calcularEscena(vertices, arrayVecNOR, escalado[0]);
            this.addColor(buffcalc,4, 0.3, 0.3, 0.3);
        }

        else if(figura == CARROCERIA){
            if(colms != 19){
                console.log("para hacer la carroceria se necesitan 19 vertices");
            }
            this.figuras.calcularCarroceria(vertices, arrayVecNOR);
            this.addColor(buffcalc,39, 0.0, 0.0, 1.0);

        }

        else if(figura == TECHO){
            this.figuras.calcularTecho(vertices,arrayVecNOR);
            this.addColor(buffcalc, 12, 0.0, 0.0, 1.0);

        }

       else if(figura == RUEDA){
            if(colms != 11){
                console.log("para hacer la rueda se necesitan 11 vertices");
            }
            escalado = arrayVecPos.pop();
            this.figuras.createRueda(vertices,arrayVecNOR,escalado);
        }

        else if(figura == VEREDA){
           if(colms != 25){
               console.log("Para hacer una vereda se necesitan 25 puntos");
           }
           var vereda = arrayVecPos.pop();
           this.figuras.calcularVereda(vertices,arrayVecNOR);
           if(vereda[0] == 1) {
               this.addColor(buffcalc, 25, 0.61, 0.48, 0.3);
           }
           else{
               this.addColor(buffcalc, 25,0.0,1.0,0.0);
           }
        }

        else {
            console.log("le pasaste mal la figura");
        }

        if(barrer) {
            this.setBufferCreator(buffcalc);
            this.bufferCreator.calcularSuperficieBarrido(vertices, arrayMatT, arrayVecPos, arrayVecNOR);
            this.build();
        }
        else if(! barrer){
            this.bufferCreator.posBuffer=vertices;
        }
    }

    /*Rows representa la cantidad de niveles de la superficie.
    Colms representa el n que divide el angulo tal que : 2pi/n para la rotacion

     */
    calcularSuperficieRevolucion(figura,rows,colms){

        var arrayVecPos= [];
        var ejeRotacion=[];
        var arrayVecNor=[];

        var buffcalc = new BufferCalculator(rows, colms);

        if(figura == COLUMNA){
            if(rows != 2){
                console.log("Para el pilar de la columna se necesitan solo 2 niveles");
            }
            this.figuras.calcularColumna(arrayVecPos, ejeRotacion, arrayVecNor);
        }

        if(figura == BASE_COLUMNA){
            if(rows != 40){
                console.log("Para la base de la columna se necesitan 2 niveles");
            }
            this.figuras.calcularBaseColumna(rows,arrayVecPos,ejeRotacion,arrayVecNor);
            //this.addColor(buffcalc, 5000,0.0,0.0,0.0);
        }

        if(figura == TAPA_COLUMNA){
            if(rows != 3){
                console.log("Para la tapa de la columna se necesitan 3 niveles");
            }
            this.figuras.calcularTapaColumna(arrayVecPos, ejeRotacion, arrayVecNor);
        }


        buffcalc.calcularSuperficieRevolucion(arrayVecPos, ejeRotacion, arrayVecNor);
        this.setBufferCreator(buffcalc);
        this.build();
    }


    addColor(buf,largo,r,g,b){

        var color = []
        for(var i=0; i<largo; i++){
            color.push(r);
            color.push(g);
            color.push(b);
        }

        buf.colorBuffer = color;
        //console.log(objeto.bufferCreator.posBuffer);
        //console.log(objeto.bufferCreator.colorBuffer);
    }

    /**Dibuja al objeto. Recibe la matriz de modelado base, la matriz de la camara
      *y la matriz de proyeccion.
      * @param {mMatrix} mat4 Matriz de modelado del padre.
      * @param {CameraMatrix} mat4 Matriz de camara
      * @param {pMatrix} mat4 Matriz de proyeccion
      * @param {parentMod} bool Indica si el padre fue modificado o no
    */
    draw(mMatrix, parentMod){
        //Se crea una matriz nueva para no modificar la matriz del padre
        var modelMatrix = mat4.create();
        if(this.modified || parentMod){
            mat4.multiply(modelMatrix, mMatrix, this.matrix);
            mat4.multiply(this.prevModelMatrix, modelMatrix, mat4.create());
        } else mat4.multiply(modelMatrix, this.prevModelMatrix, mat4.create());
        //Se hace un llamado al draw de los hijos, uno por uno.
        this._drawChildren(modelMatrix, CameraMatrix, pMatrix, this.modified || parentMod);
        this.modified = false;
        
        if (this.objectType == CALLE){
            this.setShaderProgram(streetShader);
        }
        else{
            this.setShaderProgram(shaderProgramColoredObject);
        }
        
        //Matriz de proyeccion y vista
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.ViewMatrixUniform, false, CameraMatrix);

        //Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglPosBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.webglPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //Color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglColorBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, this.webglColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //Normal
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglNormalBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, this.webglNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        //Texture
        if(this.webglTextureBuffer){
            gl.bindBuffer(gl.ARRAY_BUFFER, this.webglTextureBuffer);
            gl.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, this.webglTextureBuffer.itemSize, gl.FLOAT, false, 0, 0);
        }

        //a continuacion se setea todo dependiendo del id
        if(this.objectType == CALLE){
            gl.vertexAttrib1f(idStreet, this.id);
        }

        //Matriz de normales. Se define como la traspuesta de la inversa de la matriz de modelado
        gl.uniformMatrix4fv(this.shaderProgram.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);

        //Index
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webglIndexBuffer);
        //Draw
        gl.drawElements(gl.TRIANGLE_STRIP, this.webglIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
      }

    /**Dibuja a los hijos
     * @param Idem draw.
     */
    _drawChildren(modelMatrix, CameraMatrix, pMatrix, parentMod) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.draw(modelMatrix, CameraMatrix, pMatrix, parentMod);
        }
    }

  }
