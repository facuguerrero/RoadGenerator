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

        var curvaRuta = new CuadraticBSpline(puntos.length, 0.1, true);

        curvaRuta.setControlPoints(puntos);
        curvaRuta.calculateArrays();

        var vecPos = [];
        vecPos = curvaRuta.getVecPos();

        var arrayMatT = [];
        arrayMatT = curvaRuta.getArrayMatT();

        var buffcalc = new BufferCalculator(vecPos.length,9);
        ruta.setBufferCreator(buffcalc);
        ruta.build();

        var mediaRuta1 = this.createMediaRuta(vecPos, arrayMatT);
        mediaRuta1.rotate(-Math.PI / 2, 0.0, 0.0, 1.0);
        mediaRuta1.translate(0.0, 0.0, 9.5);
        ruta.add(mediaRuta1);

        var factorCantFaroles = 5;
        var ajusteFarolesBordes = 5;
        var sentido = 1;
        for(var i = ajusteFarolesBordes; i < vecPos.length-ajusteFarolesBordes; i+= factorCantFaroles){
            //se cargan todas las matrices y vectores
            // var u = i * puntos.length - 2.0  / (puntos.length - 1.0);

            var vec = vecPos[i];

            var farol = this.createFarol();
            farol.translate(vec[1], vec[0], vec[2]);
            farol.translate(0.0, 0.0, -1.0);
            farol.rotate(sentido * Math.PI/ 2, 0.0, 1.0, 0.0);
            ruta.add(farol);

            sentido = sentido * -1;

        }

        // var mediaRuta2 = this.createMediaRuta(vecPos, arrayMatT);
        // mediaRuta2.rotate(-Math.PI / 2, 0.0, 0.0, 1.0);
        // ruta.add(mediaRuta2);

        return ruta;
    }

    createMediaRuta(vecPos, arrayMatT){

        var asfaltoRuta = new Objeto3D();
        var baseRuta = new Objeto3D();
        // asfaltoRuta.calcularSuperficieBarrido("asfalto_ruta", vecPos.length, 5, arrayMatT, vecPos);
        // baseRuta.add(asfaltoRuta);

        baseRuta.calcularSuperficieBarrido("base_ruta", vecPos.length, 17, arrayMatT, vecPos);

        return baseRuta;

    }

    createFarol(){

        var farol = new Objeto3D();

        var altura = 14.0;

        var puntos_farol = [];
        puntos_farol.push(vec3.fromValues(0.0, -7.0, 0.0));
        puntos_farol.push(vec3.fromValues(0.0, 7.0, 0.0));
        puntos_farol.push(vec3.fromValues(0.0, altura, 0.0));
        puntos_farol.push(vec3.fromValues(12.0, altura, 0.0));
        var curvaFarol = new CuadraticBSpline(puntos_farol.length, 0.01, true);

        curvaFarol.setControlPoints(puntos_farol);
        curvaFarol.calculateArrays();

        var vecPos = [];
        vecPos = curvaFarol.getVecPos();

        var arrayMatT = [];
        arrayMatT = curvaFarol.getArrayMatT();

        farol.calcularSuperficieBarrido("circunferencia", vecPos.length, 10, arrayMatT, vecPos);

        var luz = this.createBuilding(3.0, 1.0, 2.0, true);
        luz.translate(6.0, altura - 0.5, -1.0);
        farol.add(luz);

        return farol;

    }

    createBuilding(x,y,z,tapaAbajo = false){
    /*La funcion recibe:
     @ x: Ancho de las elevaciones.
     @ y: Alto del edificio.
     @ z: Profundidad de una elevacion del edificio.
     @ tapaAbajo: bool para definir o no una tapa inferior
     */

      var edificio = new Objeto3D();

      //Creamos los puntos de la curva del edificio
      var puntosEdificio = [];
      puntosEdificio.push( vec3.fromValues(0.0, 0.0, 0.0) );
      puntosEdificio.push( vec3.fromValues(0.0, y, 0.0) );
      puntosEdificio.push( vec3.fromValues(x,0.0,z) );

      var arrayMatT = [];
      var mat = mat3.create();
      var matt = mat3.create();
      mat3.identity(mat);
      mat3.identity(matt);
      arrayMatT.push(mat);
      arrayMatT.push(matt);

      var puntosTapa = [];
      puntosTapa.push( vec3.fromValues(0.0,y,0.0) );
      puntosTapa.push( vec3.fromValues(0.0,y,z) );
      puntosTapa.push( vec3.fromValues(x,0.0,0.0) );
      //Creamos el techo del edificio
      var base = new Objeto3D();
      base.calcularSuperficieBarrido("tapa_edificio",2,2,arrayMatT,puntosTapa);

      edificio.add(base);

      if(tapaAbajo) {

          var puntosTapaAbajo = [];
          puntosTapaAbajo.push(vec3.fromValues(0.0, 0.0, 0.0));
          puntosTapaAbajo.push(vec3.fromValues(0.0, 0.0, z));
          puntosTapaAbajo.push(vec3.fromValues(x, 0.0, 0.0));
          //Creamos el piso del edificio
          var baseAbajo = new Objeto3D();
          baseAbajo.calcularSuperficieBarrido("tapa_edificio", 2, 2, arrayMatT, puntosTapaAbajo);

          edificio.add(baseAbajo);

      }


      edificio.calcularSuperficieBarrido("estructura_edificio", 2, 5, arrayMatT, puntosEdificio);

      return edificio;
    }

    createCalle(x,z){
    /* Funcion que recibe 2 parametros:
    @X es el ancho de la calle.
    @Z es el ancho de la calle.

    Devuelve una calle.
     */
        var calle = new Objeto3D();

        var buffcalc = new BufferCalculator(2,2);
        calle.setBufferCreator(buffcalc);
        calle.build();

        var arrayMatT = [];
        var matt = mat3.create();
        var mattt = mat3.create();
        mat3.identity(matt);
        mat3.identity(mattt);
        arrayMatT.push(matt);
        arrayMatT.push(mattt);

        var linea = new Objeto3D();
        var pos = [];
        pos.push(vec3.fromValues(0.0, 0.0,0.0));
        pos.push(vec3.fromValues(0.0, 0.0, z));
        pos.push(vec3.fromValues(x,0,0));
        linea.calcularSuperficieBarrido("calle", 2, 2, arrayMatT, pos);
        calle.add(linea);

        return calle;

    }

    createEsquina(x){
        /*La esquina es considerada como
        una calle con las mismas dimensiones de
        ancho y largo.
         */
       return this.createCalle(x,x);
    }

    createCar(){

        var auto = new Objeto3D();

        var carroceria = new Objeto3D();
        var puntosBaseAuto = [];


    }

}
