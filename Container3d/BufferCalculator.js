var CILINDRO;
CILINDRO = "cilindro";
var CUBO;
CUBO = "cubo";

class BufferCalculator{
    /*recibe el tipo de figura como string
    y las dimensiones como columnas y filas*/
    constructor(figura, rows, colms){
      this.figura = figura;
      this.rows = rows;
      this.colms = colms;


    this.posBuffer = [];
    this.colorBuffer = [];
    this.normalBuffer = [];
    this.indexBuffer = [];

    this.setBuffers(figura);
    }

    setBuffers(figura){
      if( figura == CILINDRO){
        this.setBuffersCil();
      }

      if( figura == CUBO ){
        this.setBuffersCubo();
      }
      this.setIndexBuffer();
    }

    setBuffersCil(radio){
      this.posBuffer = [];
      this.colorBuffer = [];

      var radioAux = radio;
      var theta = (2*Math.PI)/(this.colms - 1);

      for (var i = 0.0; i < this.rows; i++){
        for (var j = 0.0; j < this.colms; j++){
            if (i == 0.0 || i == (this.rows-1)){
                //Si el i==0, -cos(0)=-1, si i==rows-1, -cos(pi)=1
                var sentido = -Math.cos(Math.PI*i/(this.rows-1));
                //La variable X es 0, el centro
                this.posBuffer.push(Math.cos(theta*j));
                //Altura Y se mantiene igual en el pasaje de coordenadas
                this.posBuffer.push(i-( (this.rows-1) + (sentido*2))/2.0);
                //La variable Z se define como R*Sen(theta)
                this.posBuffer.push(0);
              }
              else {
                // Para cada vertice definimos su posicion
                // como coordenada (x, y, z=0)
                //La variable X se define como R*Cos(theta)
                this.posBuffer.push(radioAux*Math.cos(theta*j));
                //Altura Y se mantiene igual en el pasaje de coordenadas
                this.posBuffer.push(i-(this.rows-1)/2.0);
                //La variable Z se define como R*Sen(theta)
                this.posBuffer.push(radioAux*Math.sin(theta*j));
              }
              // Para cada vertice definimos su color
              this.colorBuffer.push(1.0/this.rows * i);
              this.colorBuffer.push(0.2);
              this.colorBuffer.push(1.0/this.colms * j);
          }
      }
    }

    setBuffersCubo(){
    }

    setIndexBuffer(){
      this.indexBuffer = [];

      for (var i = 0; i < (this.rows - 1); i++){
        //Si las filas son cero o pares se recorre a la derecha y sino a la izquierda
        if ((i % 2) == 0){
          //Recorrido hacia la derecha
          var init = this.cols*i;
          var next = this.cols*(i+1);
          for (var j = 0; j < this.cols; j++){
              this.indexBuffer.push(init + j);
              this.indexBuffer.push(next + j);
          }
        }
        else{
          //Recorrido hacia la izquierda
          var init = this.cols*(i+1) - 1;
          var next = this.cols*(i+2) - 1;
          for (var j = 0; j < this.cols; j++){
              this.indexBuffer.push(init - j);
              this.indexBuffer.push(next - j);
          }
        }
      }
    }


    getPosBuffer(){
      return this.posBuffer;
    }

    getColorBuffer( ){
    return this.colorBuffer;
    }

    getIndexBuffer( ){
    return this.indexBuffer;
    }

    getNomalBuffer( ){
    return this.normalBuffer;
    }

    /*funcion interna para el calculo de buffers a partir
    de su dimension de columnas y filas*/
    calculateBuffer(rows, colms){
    }
}
