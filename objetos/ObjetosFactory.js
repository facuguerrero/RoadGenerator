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

        var curvaRuta = new CuadraticBSpline(puntos.length, 0.1, false);

        curvaRuta.setControlPoints(puntos);
        curvaRuta.calculateArrays();

        var vecPos = [];
        vecPos = curvaRuta.getVecPos();

        var arrayMatT = [];
        arrayMatT = curvaRuta.getArrayMatT();

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
        baseRuta2.translate(-18.0, 0.0, 0.0);
        ruta.add(baseRuta2);

        var farol1 = this.createFarol();
        ruta.add(farol1 );

        return ruta;
    }

    createFarol(){

        var farol = new Objeto3D();

        var puntos_farol = [];
        puntos_farol.push(vec3.fromValues(2.0, -5.0, 0.0));
        puntos_farol.push(vec3.fromValues(2.0, 5.0, 0.0));
        puntos_farol.push(vec3.fromValues(2.0, 11.0, 0.0));
        puntos_farol.push(vec3.fromValues(4.0, 15.0, 0.0));
        puntos_farol.push(vec3.fromValues(6.0, 15.0, 0.0));

        var curvaFarol = new CuadraticBSpline(puntos_farol.length, 0.1, false);

        curvaFarol.setControlPoints(puntos_farol);
        curvaFarol.calculateArrays();

        var vecPos = [];
        vecPos = curvaFarol.getVecPos();

        var arrayMatT = [];
        arrayMatT = curvaFarol.getArrayMatT();

        farol.calcularSuperficieBarrido("circunferencia", vecPos.length, 10, arrayMatT, vecPos);

        return farol;

    }

    createBuilding(x,y,z){
    /*La funcion recibe:
     @ x: Ancho de las elevaciones.
     @ y: Alto del edificio.
     @ z: Profundidad de una elevacion del edificio.
     */

      var edificio = new Objeto3D();

      //Creamos los puntos de la curva del edificio
      var puntosEdificio = [];
      puntosEdificio.push( vec3.fromValues(0.0, 0.0, 0.0) );
      puntosEdificio.push( vec3.fromValues(0.0, y, 0.0) );

      var arrayMatT = [];
      var mat = mat3.create();
      var matt = mat3.create();
      mat3.identity(mat);
      mat3.identity(matt);
      arrayMatT.push(mat);
      arrayMatT.push(matt);

      //var puntosTapa = [];
      //puntosTapa.push( vec3.fromValues(0.0,y,0.0) );
      //puntosTapa.push( vec3.fromValues(0.0,y,z) );
      //Creamos el techo del edificio
      //var base = new Objeto3D();
      //base.calcularSuperficieBarrido("linea",2,2,arrayMatT,puntosTapa);
      //Lo ubico en la parte superior.
      //base.translate(-0.50, h-(h*0.5), 0.0);
      //base.rotate(-Math.PI/2, 0.0, 0.0, 1.0);
      //edificio.add(base);
      edificio.calcularSuperficieBarrido("cuadrado", 2, 5, arrayMatT, puntosEdificio);

      return edificio;
    }


}
