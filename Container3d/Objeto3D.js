class Objeto3D extends Container3D{

  constructor(){
    super();

    this.posBuffer = null;
    this.indexBuffer = null;
    this.colorBuffer = null;
    this.normalBuffer = null;

    this.webglPosBuffer = null;
    this.webglNormalBuffer = null;
    this.webglColorBuffer = null;
    this.webglIndexBuffer = null;

    this.bufferCreator = null;
    }


    /**********METODOS DE MODELADO*************/

    //Define al constructor de BufferCreator que devuelve un array del buffer pedido
    setBufferCreator(bufferCalculator){
        this.bufferCreator = bufferCalculator;
    }

    /**********METODOS DE DIBUJADO**********/
    /*Construye todos los buffers necesitados*/
    build(){
        this.bufferCreator.calculateBuffer()
        this.posBuffer = this.bufferCreator.getPosBuffer();
        this.normalBuffer =this.bufferCreator.getNormalBuffer();
        this.colorBuffer = this.bufferCreator.getColorBuffer();
        this.indexBuffer = this.bufferCreator.getIndexBuffer();
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
}

    /*
     vertices es una lista de listas que contienen las coordenadas
     x e y de cada vertice, ya parametrizado.
     arrayMatTrans es un array de matrices de 4x4 que al multiplicarla con cada
     nivel se aplica la transformacion.
     */
    calcularSuperficieBarrido(){

        var vertices = [];
        vertices.push(vec3.fromValues(0.0, 0.7, 0.0));
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        vertices.push(vec3.fromValues(7.0, 7.0, 0.0));

        var arrayMatT = [];
        var matt = mat3.create();
        var mattt = mat3.create();
        var matttt = mat3.create();
        mat3.identity(matt);
        mat3.identity(mattt);
        mat3.identity(matttt);
        arrayMatT.push(matt);
        arrayMatT.push(mattt);
        arrayMatT.push(matttt);

        var arrayVecPos = [];
        arrayVecPos.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecPos.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecPos.push(vec3.fromValues(0.0, 0.0, 0.0));

        var arrayVecNOR = [];
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(7.0, 7.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(7.0, 0.0, 0.0));

        this.bufferCreator.calcularSuperficieBarrido(vertices, arrayMatT, arrayVecPos, arrayVecNOR);
        this.build();

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
        //Matriz de proyeccion y vista
        gl.uniformMatrix4fv(shaderProgramColoredObject.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgramColoredObject.ViewMatrixUniform, false, CameraMatrix);

        //Position
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglPosBuffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexPositionAttribute, this.webglPosBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //Color
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglColorBuffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexColorAttribute, this.webglColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        //Normal
        gl.bindBuffer(gl.ARRAY_BUFFER, this.webglNormalBuffer);
        gl.vertexAttribPointer(shaderProgramColoredObject.vertexNormalAttribute, this.webglNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

        //Matriz de normales. Se define como la traspuesta de la inversa de la matriz de modelado
        gl.uniformMatrix4fv(shaderProgramColoredObject.ModelMatrixUniform, false, modelMatrix);
        var normalMatrix = mat3.create();
        mat3.fromMat4(normalMatrix, modelMatrix);
        mat3.invert(normalMatrix, normalMatrix);
        mat3.transpose(normalMatrix, normalMatrix);
        gl.uniformMatrix3fv(shaderProgramColoredObject.nMatrixUniform, false, normalMatrix);

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
