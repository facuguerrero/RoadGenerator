class ObjetosFactory{

    constructor(){
        //
    }

    //Crea una grilla en el plano xz que permite modelar con mayor facilidad
    createGrid(){

        var grid = new Objeto3D();

        var buffcalc = new BufferCalculator(2,2);
        grid.setBufferCreator(buffcalc);
        grid.build();

        var arrayMatT = [];
        var matt = mat3.create();
        var mattt = mat3.create();
        mat3.identity(matt);
        mat3.identity(mattt);
        arrayMatT.push(matt);
        arrayMatT.push(mattt);

        //barras verticales
        for (var i = -50.0; i <= 50.0; i+= 3) {

            var linea = new Objeto3D();
            var vecPos = [];
            vecPos.push(vec3.fromValues(i, 0.0, -100.0));
            vecPos.push(vec3.fromValues(i, 0.0, 100.0));
            linea.calcularSuperficieBarrido("linea", 2, 2, arrayMatT, vecPos);
            grid.add(linea);

        }

        return grid;

    }

    createRuta(puntos){

        var ruta = new Objeto3D();

        var curva = new CuadraticBSpline(puntos.length);

        curva.setControlPoints(puntos);
        curva.calculateArrays();

        var vecPos = [];
        vecPos = curva.getVecPos();

        var arrayMatTT = [];
        arrayMatTT = curva.getArrayMatT();

        var arrayMatT = [];
        var matt = mat3.create();
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);
        arrayMatT.push(matt);



        var buffcalc = new BufferCalculator(vecPos.length,9);
        ruta.setBufferCreator(buffcalc);
        ruta.build();

        var asfaltoRuta1 = new Objeto3D();
        var baseRuta1 = new Objeto3D();
        asfaltoRuta1.calcularSuperficieBarrido("asfalto_ruta", vecPos.length, 5, arrayMatT, vecPos);
        baseRuta1.add(asfaltoRuta1);

        baseRuta1.calcularSuperficieBarrido("base_ruta", vecPos.length, 9, arrayMatT, vecPos);
        ruta.add(baseRuta1);


        var asfaltoRuta2 = new Objeto3D();
        var baseRuta2 = new Objeto3D();
        asfaltoRuta2.calcularSuperficieBarrido("asfalto_ruta", vecPos.length, 5, arrayMatT, vecPos);
        baseRuta2.add(asfaltoRuta1);

        baseRuta2.calcularSuperficieBarrido("base_ruta", vecPos.length, 9, arrayMatT, vecPos);
        baseRuta2.translate(-20.0, 0.0, 0.0);
        ruta.add(baseRuta2);

        return ruta;
    }

    createBuilding(n,w,h,z){
    /*La funcion recibe:
    @ n: Cantidad de elevaciones del edificio.
    @ w: Numero que indica el ancho de las elevaciones.
    @ h: Numero que indica la cantidad de elevaciones del edificio.
    @ z: Longitud de una elevacion del edificio.
     */

      var edificio = new Objeto3D();
      var curva = new CuadraticBSpline(n);


      //Creamos los puntos de la curva del edificio
      var puntosEdificio = [];
      for(var i=0; i<n; i++){
          puntosEdificio.push(vec3.fromValues(0.0, i, 0.0));
      }

      curva.setControlPoints(puntosEdificio);
      curva.calculateArrays();

      var arrayVecPos = [];
      arrayVecPos = curva.getVecPos();
      var arrayMatT = [];
      arrayMatT = curva.getArrayMatT();

      //var buffcalc = new BufferCalculator(arrayVecPos.length,2);
      //edificio.setBufferCreator(buffcalc);
      //edificio.build();

      var base = new Objeto3D();
      base.calcularSuperficieBarrido("linea",n,2,arrayMatT,arrayVecPos);
      base.translate(1.0, h, 1.0);
      base.rotate(-Math.PI/2, 0.0, 0.0, 1.0);
      edificio.add(base);

      edificio.calcularSuperficieBarrido("cuadrado", n, 5, arrayMatT, arrayVecPos);

      edificio.scale(w,h,z);

      return edificio;
    }


}
