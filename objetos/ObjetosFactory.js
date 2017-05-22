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
        puntos_farol.push(vec3.fromValues(10.0, 15.0, 0.0));
        //puntos_farol.push(vec3.fromValues(6.0, 15.0, 0.0));

        var curvaFarol = new CuadraticBSpline(puntos_farol.length, 1, true);

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
        /*Variables a modificar para las dimensiones del auto*/

        var auto = new Objeto3D();
        var buffcalc = new BufferCalculator(2,2);
        auto.setBufferCreator(buffcalc);
        auto.build();


        //Creamos la carroceria del auto
        var carroceria = new Objeto3D();

        //Declaro los puntos de la carroceria del auto
        var puntosCarroceria =[];
        puntosCarroceria.push( vec3.fromValues(0.0,0.0,0.0) );
        puntosCarroceria.push( vec3.fromValues(0.0,0.0,4.0) );

        //Matrices de transformacion
        var arrayMat = [];
        var mat = mat3.create();
        var matt = mat3.create();
        mat3.identity(mat);
        mat3.identity(matt);
        arrayMat.push(mat);
        arrayMat.push(matt);

        carroceria.calcularSuperficieBarrido("carroceria",2,19,arrayMat, puntosCarroceria);
        auto.add(carroceria);

        //Creamos las ruedas del auto
        var rueda = new Objeto3D();
        //Las matrices y los puntos son los mismos que la carroceria

        //rueda.calcularSuperficieBarrido("rueda",2,2,arrayMat,puntosCarroceria);

        return auto;
    }

}
