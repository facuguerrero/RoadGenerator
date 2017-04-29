
function Objeto3D() {

    this.matrix = null;
    this.prevModelMatrix = null;
    this.children = [];
    this.shaderProgram = null;
    this.modified = false;
    this.matrix = mat4.create();
    mat4.identity(this.matrix);
    this.prevModelMatrix = mat4.create();
    mat4.identity(this.prevModelMatrix);
    this.drawType = gl.TRIANGLE_STRIP;

        this.posBuffer = null;
        this.indexBuffer = null;
        this.colorBuffer = null;
        this.normalBuffer = null;

        this.webglPosBuffer = null;
        this.webglNormalBuffer = null;
        this.webglColorBuffer = null;
        this.webglIndexBuffer = null;

    this.bufferCreator = null;


    /**********METODOS DEL CONTAINER***********/

    this.translate = function (x, y, z) {
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    this.scale = function (x, y, z) {
        mat4.scale(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    this.rotate = function (angulo, x, y, z) {
        mat4.rotate(this.matrix, this.matrix, angulo, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    this.add = function (child) {
        //recibe un hijo de tipo Objeto3d para agregar a su jerarquia
        this.children.push(child);
    }

    this.remove = function (child) {
        //recibe un hijo
        var index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }

    this.resetMatrix = function () {
        //resetea la matriz como la identidad
        initMatrix();
        this.modified = true;
    }

    this.applyMatrix = function (matrix) {
        //recibe una matriz la cual multiplica por la suya propia
        mat4.multiply(this.matrix, this.matrix, matrix);
        this.modified = true;
    }

    this.setShaderProgram = function (shaderProgram) {
        //recibe el shader a utilizar
        this.shaderProgram = shaderProgram;
        gl.useProgram(shaderProgram);
    }

    this.setupLighting = function (lightPosition, ambientColor, diffuseColor) {
        // Configuración de la luz
        // Se inicializan las variables asociadas con la Iluminación
        this.setupChildrenLighting(lightPosition, ambientColor, diffuseColor);

        gl.uniform1i(this.shaderProgram.useLightingUniform, true);
        //Define direccion
        gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        //Define ambient color
        gl.uniform3fv(this.shaderProgram.ambientColorUniform, ambientColor);
        //Define diffuse color
        gl.uniform3fv(this.shaderProgram.directionalColorUniform, diffuseColor);
    }

    this.setupChildrenLighting = function (lightPosition, ambientColor, diffuseColor) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    }

        /**********METODOS DE MODELADO*************/

//Define al constructor de BufferCreator que devuelve un array del buffer pedido
    this.setBufferCreator = function(bufferCalculator){
        this.bufferCreator = bufferCalculator;
    }

    /**********METODOS DE DIBUJADO**********/
    /*Construye todos los buffers necesitados*/
    this.build = function(){
        this.bufferCreator. calculateBuffers()
        this.posBuffer = this.bufferCreator.getPosBuffer();
        this.normalBuffer =this.bufferCreator.getNormalBuffer();
        this.colorBuffer = this.bufferCreator.getColorBuffer();
        this.indexBuffer = this.bufferCreator.getIndexBuffer();

        this.setUpWebGLBuffers();
    }

    /*Setea los WebGlBuffers para la hora de renderizar*/
    this.setUpWebGLBuffers = function(){
        this.webglPosBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglPosBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.posBuffer), gl.STATIC_DRAW);

        this.webglNormalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglNormalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);

        this.webglColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colorBuffer), gl.STATIC_DRAW);

        this.webglIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.webglIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
}

    /*
     vertices es una lista de listas que contienen las coordenadas
     x e y de cada vertice, ya parametrizado.
     arrayMatTrans es un array de matrices de 4x4 que al multiplicarla con cada
     nivel se aplica la transformacion.
     */
    this.calcularSuperficieBarrido = function(vertices, arrayMatTrans){

        //asumo que tengo el position vertex y el index

        cantidadMatrices = arrayMatTrans.length;
        cantidadVertices = vertices.length;
        var matrizVertices =[];
        for(var i = 0.0; i < cantidadMatrices ; i++){
            var matActual = arrayMatTrans[i];
            var parcial =[];
            for(var j =0.0; j< cantidadVertices; j++){
                //var newVertice = vertices[j] multiply matActual; //cambiar esto por la cuenta real
                posBuffer.push(newVertice[0]);
                posBuffer.push(newVertice[1]);
                //posBuffer.push(pos z en la matriz); //cual es el z?

                parcial.push( j + (i*x));

            }
            matrizVertices.push(parcial);
        }

        unirMalla(matrizVertices, cantidadMatrices, cantidadVertices);
    }

    this.unirMalla = function(matrizVertices, rows, cols){
        var auxiliar = 0;
        /*Las filas van hasta -1 porque en la anteultima fila agrega
         a los vertices de la ultima.*/
        for(var i = 0.0; i < rows-1; i++){
            for(var j = 0.0; j < cols; j++){

                /* Esto se hace para que funcione bien a la ida y
                 vuelta de la malla*/
                if(i % 2 == 0){auxiliar = j;}
                else{auxiliar = rows - j - 1;}

                this.indexBuffer.push(matriz_indices[i][auxiliar] );
                this.indexBuffer.push(matriz_indices[i+1][auxiliar]);

            }
        }
    }


    /**Dibuja al objeto. Recibe la matriz de modelado base, la matriz de la camara
      *y la matriz de proyeccion.
      * @param {mMatrix} mat4 Matriz de modelado del padre.
      * @param {CameraMatrix} mat4 Matriz de camara
      * @param {pMatrix} mat4 Matriz de proyeccion
      * @param {parentMod} bool Indica si el padre fue modificado o no
    */
    this.draw = function(mMatrix, CameraMatrix, pMatrix, parentMod){
        //Se crea una matriz nueva para no modificar la matriz del padre
        var modelMatrix = mat4.create();
        if(this.modified || parentMod){
            mat4.multiply(modelMatrix, mMatrix, this.matrix);
            mat4.multiply(this.prevModelMatrix, modelMatrix, mat4.create());
        } else mat4.multiply(modelMatrix, this.prevModelMatrix, mat4.create());
        //Se hace un llamado al draw de los hijos, uno por uno.
        this._drawChildren(modelMatrix, CameraMatrix, pMatrix, this.modified || parentMod);
        this.modified = false;
        //Matriz de proyeccion y vista
        gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(this.shaderProgram.ViewMatrixUniform, false, CameraMatrix);

        var itemSize = 3;
        //Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglPosBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, itemSize, gl.FLOAT, false, 0, 0);
        //Color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglColorBuffer);
        gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, itemSize, gl.FLOAT, false, 0, 0);
        //Normal
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglNormalBuffer, itemSize, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, itemSize, gl.FLOAT, false, 0, 0);

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
        gl.drawElements(this.drawType, this.indexBuffer.length, gl.UNSIGNED_SHORT, 0);
    }

    /**Dibuja a los hijos
     * @param Idem draw.
     */
    this._drawChildren = function (modelMatrix, CameraMatrix, pMatrix, parentMod) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.draw(modelMatrix, CameraMatrix, pMatrix, parentMod);
        }
    }

  }
