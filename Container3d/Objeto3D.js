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
    calcularSuperficieBarrido(vertices, arrayMatTrans){

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

        this.unirMalla(matrizVertices, cantidadMatrices, cantidadVertices);
    }

    unirMalla(matrizVertices, rows, cols){
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
    draww(mMatrix, parentMod){
        //Se crea una matriz nueva para no modificar la matriz del padre
        var modelMatrix = mat4.create();
        if(this.modified || parentMod){
            mat4.multiply(modelMatrix, mMatrix, this.matrix);
            mat4.multiply(this.prevModelMatrix, modelMatrix, mat4.create());
        } else mat4.multiply(modelMatrix, this.prevModelMatrix, mat4.create());
        //Se hace un llamado al draw de los hijos, uno por uno.
        //this._drawChildren(modelMatrix, CameraMatrix, pMatrix, this.modified || parentMod);
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
        var tam = this.indexBuffer.length;
        gl.drawElements(gl.TRIANGLES, this.webglIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
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
