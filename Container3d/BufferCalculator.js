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

    }

    // calculateBuffer(){
    //   if(this.figura == CILINDRO){
    //     this.calcBuffersCil();
    //   }
    //   if(this.figura == ESFERA){
    //     this.calcBufferEsfera();
    //   }
    //   this.calcIndexBuffer();
    // }
    //
    // calcBuffersCil(){
    //
    //
    //   var theta = (2*Math.PI)/(this.colms - 1);
    //
    //   for (var i = 0.0; i < this.rows; i++){
    //     for (var j = 0.0; j < this.colms; j++){
    //         if (i == 0.0 || i == (this.rows-1)){
    //             //Si el i==0, -cos(0)=-1, si i==rows-1, -cos(pi)=1
    //             var sentido = -Math.cos(Math.PI*i/(this.rows-1));
    //             //La variable X es 0, el centro
    //             this.posBuffer.push(Math.cos(theta*j));
    //             //Altura Y se mantiene igual en el pasaje de coordenadas
    //             this.posBuffer.push(i-( (this.rows-1) + (sentido*2))/2.0);
    //             //La variable Z se define como R*Sen(theta)
    //             this.posBuffer.push(0);
    //
    //             this.normalBuffer.push(Math.cos(theta*j) / 2.0);
    //             this.normalBuffer.push(i-( (this.rows-1) + (sentido*2))/2.0);
    //             this.normalBuffer.push(0);
    //           }
    //         else {
    //         // Para cada vertice definimos su posicion
    //         // como coordenada (x, y, z=0)
    //         //La variable X se define como R*Cos(theta)
    //         this.posBuffer.push(this.radio*Math.cos(theta*j));
    //         //Altura Y se mantiene igual en el pasaje de coordenadas
    //         this.posBuffer.push(i-(this.rows-1)/2.0);
    //         //La variable Z se define como R*Sen(theta)
    //         this.posBuffer.push(this.radio*Math.sin(theta*j));
    //
    //         this.normalBuffer.push(this.radio*Math.cos(theta*j) / 2.0);
    //         this.normalBuffer.push(i-(this.rows-1)/2.0);
    //         this.normalBuffer.push(this.radio*Math.sin(theta*j) / 2.0);
    //         }
    //         this.colorBuffer.push(1.0/this.rows * i);
    //         this.colorBuffer.push(0.2);
    //         this.colorBuffer.push(1.0/this.colms * j);
    //     }
    //   }
    // }
    //
    // calcBuffersCubo(){
    // }
    //
    // calcBufferEsfera(){
    //
    //     var _rad = this.radio;
    //     var theta = (2*Math.PI)/(this.colms - 1);
    //     var phi = (Math.PI)/(this.rows - 1);
    //
    //     for (var i = 0.0; i < this.rows; i++){
    //         for (var j = 0.0; j < this.colms; j++){
    //             // Para cada v�rtice definimos su posici�n
    //             // como coordenada (x, y, z=0)
    //             //La variable X se define como R*Cos(theta)*Sin(phi)
    //             this.posBuffer.push(_rad*Math.cos(theta*j)*Math.sin(phi*i));
    //             //La variable Y se define como R*Cos(phi)
    //             this.posBuffer.push(_rad*Math.cos(phi*i));
    //             //La variable Z se define como R*Sen(theta)*Sin(phi)
    //             this.posBuffer.push(_rad*Math.sin(theta*j)*Math.sin(phi*i));
    //
    //             // Para cada v�rtice definimos su color
    //             this.colorBuffer.push(1.0/this.rows * i);
    //             this.colorBuffer.push(0.2);
    //             this.colorBuffer.push(1.0/this.colms * j);
    //
    //             this.normalBuffer.push(_rad*Math.cos(theta*j)*Math.sin(phi*i));
    //             this.normalBuffer.push(_rad*Math.cos(phi*i));
    //             this.normalBuffer.push(_rad*Math.sin(theta*j)*Math.sin(phi*i));
    //         }
    //     }
    // }


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

        var vecRot = vec3.create();
        vec3.copy(vecRot,ejeRotacion);

        for (var i = 0; i < this.colms; i++) {

            /*Creamos la matriz de rotacion para el paso actual*/
            var matActual = mat3.create();
            mat3.identity(matActual);
            //angulo de rotacion
            mat3.rotate(matActual, matActual, ((2*Math.PI*i)/(this.colms-1)), vecRot);


            for(var j = 0; j < this.rows; j++){

                /*Nos quedamos con el vertice de posicion y normal actual*/
                var verticeFormaActual = vec3.create();
                vec3.copy(verticeFormaActual, vertices[j]);

                var normalFormaActual = vec3.create();
                vec3.copy(normalFormaActual, arrayVecNorm[j]);

                /*Actualizamos la posicion*/
                vec3.transformMat3(verticeFormaActual, verticeFormaActual, matActual);

                /*Actualizamos las normales*/
                vec3.transformMat3(normalFormaActual,normalFormaActual, matActual);
                console.log(verticeFormaActual);
                /*Actualizamos los buffers*/
                this.posBuffer.push(verticeFormaActual[0]);
                this.posBuffer.push(verticeFormaActual[1]);
                this.posBuffer.push(verticeFormaActual[2]);
                this.normalBuffer.push(normalFormaActual[0]);
                this.normalBuffer.push(normalFormaActual[1]);
                this.normalBuffer.push(normalFormaActual[2]);
                this.colorBuffer.push(0.0);
                this.colorBuffer.push(0.0);
                this.colorBuffer.push(0.0);
            }
        }
    }
  }
