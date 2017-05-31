class BufferCalculator{

    constructor(rows, colms){
    /*recibe el tipo de figura como string
    y las dimensiones como columnas y filas*/
    this.rows = rows;
    this.colms = colms;

    this.posBuffer = [];
    this.colorBuffer = [];
    this.normalBuffer = [];
    this.indexBuffer = [];
    this.textureBuffer1 = [];
    this.textureBuffer2 = [];

    //Bool para saber si tiene textura o no!
    this.texture1 = false;
    this.texture2 = false;

    }

    calcIndexBuffer() {

        for(var i = 0; i < (this.rows-1); i++) {
            if (i % 2 == 0) {
                // Hacia la derecha
                for (var k = 0; k < this.colms; k++) {
                    this.indexBuffer.push(i * this.colms + k);
                    this.indexBuffer.push((i+1) * this.colms + k);
                }
            } else {
                // Cambio de lado a la izquierda
                for (var j = this.colms-1; j >= 0; j--) {
                    this.indexBuffer.push(i * this.colms + j);
                    this.indexBuffer.push((i+1) * this.colms + j);
                }
            }
        }
    }

    setBoolTexture1(){
        this.texture1 = true;
    }

    setBoolTexture2(){
        this.texture2 = true;
    }

    setTextures(num){
        if (num == 1){
            this.setBoolTexture1();
        }

        else if (num == 2){
            this.setBoolTexture2();
        }
    }

    getPosBuffer(){
      return this.posBuffer;
    }

    getColorBuffer(){
    return this.colorBuffer;
    }

    getIndexBuffer(){
    return this.indexBuffer;
    }

    getNormalBuffer(){
    return this.normalBuffer;
    }

    getTextureBuffer1(){
    return this.textureBuffer1;
    }

    getTextureBuffer2(){
    return this.textureBuffer2;
    }

    /*
     vertices es una lista de vec3 que contienen las coordenadas
     x e y (con z = 1) de cada vertice, ya parametrizado de una superficie.
     arrayMatTrans es un array de mat3 al multiplicarla con cada
     nivel se aplica la transformacion.
     arrayVecPos es un array de vec3 que al multiplicarlo con cada vertice
     obtenemos el punto hacia donde tenemos que transladar.
     arrayVecNorm es un array de vec3 que contiene las normales de los puntos.
     Se supone que estan normalizados.
     */
    calcularSuperficieBarrido(vertices, arrayMatTrans, arrayVecPos, arrayVecNorm){


        this.calcIndexBuffer();

        for (var i = 0; i < this.rows; i++) {
            var matActual = arrayMatTrans[i];

            var vecTrasActual = vec3.create();
            vec3.copy(vecTrasActual,arrayVecPos[i]);

            for(var j = 0; j < this.colms; j++){
                var verticeFormaActual = vec3.create();
                vec3.copy(verticeFormaActual,vertices[j]);

                var normVer = vec3.create();
                vec3.copy(normVer, arrayVecNorm[j]);

                var binormVer = vec3.fromValues(0.0,0.0,1.0);

                var tanVer = vec3.create();
                vec3.cross(tanVer,binormVer, normVer);

                vec3.transformMat3(verticeFormaActual,verticeFormaActual,matActual);
                vec3.add(verticeFormaActual,vecTrasActual, verticeFormaActual);

                vec3.transformMat3(normVer,normVer,matActual);

                this.posBuffer.push(verticeFormaActual[0]);
                this.posBuffer.push(verticeFormaActual[1]);
                this.posBuffer.push(verticeFormaActual[2]);
                this.normalBuffer.push(normVer[0]);
                this.normalBuffer.push(normVer[1]);
                this.normalBuffer.push(normVer[2]);
                this.colorBuffer.push(1.0/this.rows * i);
                this.colorBuffer.push(0.2);
                this.colorBuffer.push(1.0/this.colms * j);

                if (this.texture1) {
                    // Coordenadas
                    var u = 1.0 - (i / (this.rows - 1));
                    var v = 1.0 - (j / (this.colms - 1));

                    // if (switch_u == 1.0) {
                    //     u = 1.0 - (i % 512.0) / 512.0;
                    // } else {
                    //     u = (i % 512.0) / 512.0;
                    // }
                    this.textureBuffer1.push(u);
                    this.textureBuffer1.push(v);
                    //hay que ver si hay que pasar otros vertices
                }

                if (this.texture2) {
                    this.textureBuffer2.push(verticeFormaActual[0]);
                    this.textureBuffer2.push(verticeFormaActual[1]);
                }
            }
        }
      }

    /*
     vertices es una lista de vec3 que contienen las coordenadas
     x, y, z de cada vertice, de la figura a rotar.
     arrayMatTrans es un array de mat3 al multiplicarla con cada
     nivel se aplica la transformacion.

     arrayVecPos es un array de vec3 que contiene sobre el eje que tenemos que rotar.

     arrayVecNorm es un array de vec3 que contiene las normales de los puntos.
     Se supone que estan normalizados.
     */
        calcularSuperficieRevolucion(vertices, ejeRotacion, arrayVecNorm){

        this.calcIndexBuffer();
        var vector = ejeRotacion[0];
        var vecRot = vec3.fromValues(vector[0], vector[1], vector[2]);

        for (var i = 0.0; i < this.colms; i++) {

            /*Creamos la matriz de rotacion para el paso actual*/
            var matActual = mat4.create();
            mat4.identity(matActual);
            //angulo de rotacion
            mat4.rotate(matActual, matActual, ( (2.0*Math.PI*i) / (this.colms-1) ), vecRot);


            for(var j = 0.0; j < this.rows; j++){
                /*Nos quedamos con el vertice de posicion y normal actual*/
                var auxV = vertices[j];
                var verticeFormaActual = vec3.fromValues(auxV[0], auxV[1], auxV[2]);

                var auxN = arrayVecNorm[j];
                var normalFormaActual = vec3.fromValues(auxN[0], auxN[1], auxN[2]);

                /*Actualizamos la posicion*/
                vec3.transformMat4(verticeFormaActual, verticeFormaActual, matActual);

                /*Actualizamos las normales*/
                vec3.transformMat4(normalFormaActual,normalFormaActual, matActual);
                vec3.normalize(normalFormaActual, normalFormaActual);

                /*Actualizamos los buffers*/
                this.posBuffer.push(verticeFormaActual[0]);
                this.posBuffer.push(verticeFormaActual[1]);
                this.posBuffer.push(verticeFormaActual[2]);
                this.normalBuffer.push(normalFormaActual[0]);
                this.normalBuffer.push(normalFormaActual[1]);
                this.normalBuffer.push(normalFormaActual[2]);
                this.colorBuffer.push(0.62);
                this.colorBuffer.push(0.59);
                this.colorBuffer.push(0.56);

                if (this.texture1) {
                    // Coordenadas
                    var u = 1.0 - (i % 512.0) / 512.0;
                    var v = 1.0 - (j / (this.rows - 1));

                    // if (switch_u == 1.0) {
                    //     u = 1.0 - (i % 512.0) / 512.0;
                    // } else {
                    //     u = (i % 512.0) / 512.0;
                    // }
                    this.textureBuffer1.push(u);
                    this.textureBuffer1.push(v);
                    //hay que ver si hay que pasar otros vertices
                }

                if (this.texture2) {
                    this.textureBuffer2.push(verticeFormaActual[0]);
                    this.textureBuffer2.push(verticeFormaActual[1]);
                }

            }

        }

    }
  }
