class ObjetosFactory {

    constructor() {
        //
    }

    //Crea una grilla en el plano xz que permite modelar con mayor facilidad
    createGrid() {

        var grid = new Objeto3D();

        var buffcalc = new BufferCalculator(2, 2);
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
        for (var i = -50.0; i <= 50.0; i += 3) {

            var linea = new Objeto3D();
            var vecPos = [];
            vecPos.push(vec3.fromValues(i, 0.0, -100.0));
            vecPos.push(vec3.fromValues(i, 0.0, 100.0));
            linea.calcularSuperficieBarrido("linea", 2, 2, arrayMatT, vecPos);
            grid.add(linea);

        }

        return grid;

    }

    createRuta(puntos) {

        var ruta = new Objeto3D();

        var curvaRuta = new CuadraticBSpline(puntos.length, 0.1, true);

        curvaRuta.setControlPoints(puntos);
        curvaRuta.calculateArrays();

        var vecPos = [];
        vecPos = curvaRuta.getVecPos();

        var arrayMatT = [];
        arrayMatT = curvaRuta.getArrayMatT();

        var buffcalc = new BufferCalculator(vecPos.length, 9);
        ruta.setBufferCreator(buffcalc);
        ruta.build();

        var mediaRuta1 = this.createMediaRuta(vecPos, arrayMatT);
        mediaRuta1.rotate(-Math.PI / 2, 0.0, 0.0, 1.0);
        ruta.add(mediaRuta1);

        //creo una nueva curva que se adecue a los faroles
        var puntosFaroles = [];
        for (var j = 0; j < puntos.length; j++) {
            var vecR = puntos[j];
            puntosFaroles.push(vec3.fromValues(vecR[0], vecR[1], (vecR[2] - 0.5)));
        }
        var curvaFaroles = new CuadraticBSpline(puntosFaroles.length, 0.1, true);

        curvaFaroles.setControlPoints(puntosFaroles);
        curvaFaroles.calculateArrays();

        var vecPosFaroles = curvaFaroles.getVecPos();
        var arrayMatF = curvaFaroles.getArrayMatT();

        var factorCantFaroles = 2;
        var ajusteFarolesBordes = 2;
        var sentido = 1;
        for (var i = ajusteFarolesBordes; i < vecPos.length - ajusteFarolesBordes - 10; i += factorCantFaroles) {

            var vec = vecPosFaroles[i];
            var mat = this.getMatriz4x4(arrayMatF[i]);

            var farol = this.createFarol();
            farol.translate(vec[1], vec[0], vec[2]);
            farol.applyMatrix(mat);
            farol.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            if (sentido == -1) {
                farol.rotate(Math.PI, 0.0, 1.0, 0.0);
            }
            ruta.add(farol);
            sentido = sentido * -1;

        }

        ruta.scale(0.3, 0.3, 0.3);
        return ruta;
    }

    createMediaRuta(vecPos, arrayMatT) {

        var asfaltoRuta = new Objeto3D();
        var baseRuta = new Objeto3D();
        asfaltoRuta.calcularSuperficieBarrido("asfalto_ruta", vecPos.length, 9, arrayMatT, vecPos);
        baseRuta.add(asfaltoRuta);

        baseRuta.calcularSuperficieBarrido("base_ruta", vecPos.length, 17, arrayMatT, vecPos);

        return baseRuta;

    }

    createFarol() {

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

    createBuilding(x, y, z, tapaAbajo = false) {
        /*La funcion recibe:
         @ x: Ancho de las elevaciones.
         @ y: Alto del edificio.
         @ z: Profundidad de una elevacion del edificio.
         @ tapaAbajo: bool para definir o no una tapa inferior
         */

        var edificio = new Objeto3D();

        //Creamos los puntos de la curva del edificio
        var puntosEdificio = [];
        puntosEdificio.push(vec3.fromValues(0.0, 0.0, 0.0));
        puntosEdificio.push(vec3.fromValues(0.0, y, 0.0));
        puntosEdificio.push(vec3.fromValues(x, 0.0, z));

        var arrayMatT = [];
        var mat = mat3.create();
        var matt = mat3.create();
        mat3.identity(mat);
        mat3.identity(matt);
        arrayMatT.push(mat);
        arrayMatT.push(matt);

        var puntosTapa = [];
        puntosTapa.push(vec3.fromValues(0.0, y, 0.0));
        puntosTapa.push(vec3.fromValues(0.0, y, z));
        puntosTapa.push(vec3.fromValues(x, 0.0, 0.0));
        //Creamos el techo del edificio
        var base = new Objeto3D();
        base.calcularSuperficieBarrido("tapa_edificio", 2, 2, arrayMatT, puntosTapa);

        edificio.add(base);

        if (tapaAbajo) {

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

    createCalle(x, z) {
        /* Funcion que recibe 2 parametros:
         @X es el ancho de la calle.
         @Z es el ancho de la calle.

         Devuelve una calle.
         */
        var calle = new Objeto3D();

        var buffcalc = new BufferCalculator(2, 2);
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
        pos.push(vec3.fromValues(0.0, 0.0, 0.0));
        pos.push(vec3.fromValues(0.0, 0.0, z));
        pos.push(vec3.fromValues(x, 0, 0));
        linea.calcularSuperficieBarrido("calle", 2, 2, arrayMatT, pos);
        calle.add(linea);

        return calle;

    }

    createEsquina(x) {
        /*La esquina es considerada como
         una calle con las mismas dimensiones de
         ancho y largo.
         */
        return this.createCalle(x, x);
    }

    createCar() {
        /*Variables a modificar para las dimensiones del auto*/

        var auto = new Objeto3D();
        var buffcalc = new BufferCalculator(2, 2);
        auto.setBufferCreator(buffcalc);
        auto.build();


        //Creamos la carroceria del auto
        var carroceria = new Objeto3D();

        //Declaro los puntos de la carroceria del auto
        var puntosCarroceria = [];
        puntosCarroceria.push(vec3.fromValues(0.0, 0.0, 0.0));
        puntosCarroceria.push(vec3.fromValues(0.0, 0.0, 4.0));

        //Matrices de transformacion
        var arrayMat = [];
        var mat = mat3.create();
        var matt = mat3.create();
        mat3.identity(mat);
        mat3.identity(mat);
        arrayMat.push(mat);
        arrayMat.push(matt);

        carroceria.calcularSuperficieBarrido("carroceria", 2, 19, arrayMat, puntosCarroceria);
        auto.add(carroceria);

        //Creamos las ruedas del auto
        var rueda1 = new Objeto3D();

        //Las matrices y los puntos son los mismos que la carroceria solo le agrego los
        //posicionamientos y el radio
        puntosCarroceria.push(vec3.fromValues(2.0, 1.0, 0.8));

        rueda1.calcularSuperficieBarrido("rueda", 2, 11, arrayMat, puntosCarroceria);
        auto.add(rueda1);

        var rueda2 = new Objeto3D();

        //Las matrices y los puntos son los mismos que la carroceria solo le agrego los
        //posicionamientos y el radio
        puntosCarroceria.push(vec3.fromValues(8.0, 1.0, 0.8));
        rueda2.calcularSuperficieBarrido("rueda", 2, 11, arrayMat, puntosCarroceria);
        auto.add(rueda2);

        return auto;
    }

    createEscene(x) {


        var escene = new Objeto3D();

        var buffcalc = new BufferCalculator(2, 2);
        escene.setBufferCreator(buffcalc);
        escene.build();

        var arrayMatT = [];
        var matt = mat3.create();
        var mattt = mat3.create();
        mat3.identity(matt);
        mat3.identity(mattt);
        arrayMatT.push(matt);
        arrayMatT.push(mattt);

        var linea = new Objeto3D();
        var pos = [];
        pos.push(vec3.fromValues(0.0, 0.0, 0.0));
        pos.push(vec3.fromValues(0.0, 0.0, x));
        pos.push(vec3.fromValues(x, 0, 0));

        linea.calcularSuperficieBarrido("escena", 2, 2, arrayMatT, pos);

        escene.add(linea);
        return escene;
    }

    createVereda(puntos){

        var vereda = new Objeto3D();

        var curva = new CuadraticBSpline(puntos.length, 0.1, true);

        curva.setControlPoints(puntos);
        curva.calculateArrays();

        var vecPos = [];
        vecPos = curva.getVecPos();

        var arrayMatT = [];
        arrayMatT = curva.getArrayMatT();

        vereda.calcularSuperficieBarrido("vereda", vecPos.length, 5, arrayMatT, vecPos);
        return vereda;

    }


    createManzanaB(x){

        var manzana = this.createEscene(x);
        var anchoVereda = 4.0;
        var centro =this.createEscene(x-anchoVereda);

        var puntos = [];
        puntos.push(vec3.fromValues(0.0, 4.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 4.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 16.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 16.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 4.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 4.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 16.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 16.0));
        puntos.push(vec3.fromValues(0.0, 18.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 16.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 16.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 4.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 4.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 18.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 16.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 16.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 4.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 4.0));
        puntos.push(vec3.fromValues(0.0, 2.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 4.0, 2.0));
        puntos.push(vec3.fromValues(0.0, 4.0, 2.0));

        var vereda = this.createVereda(puntos);

        var edificio1 = this.createBuilding(2.5, 8.0, 2.5);
        centro.add(edificio1);

        var edificio2 = this.createBuilding(2.0,10,2.5);
        edificio2.translate(2.5,0,0);
        centro.add(edificio2);

        //var edificio2 = this.createBuilding(2.0,10.0,2.5);
        //edificio2.translate(2.6,0,0);
        //manzana.add(edificio2);

        centro.translate(anchoVereda/2,0.05,anchoVereda/2);
        manzana.add(centro);
        manzana.add(vereda);
        return manzana;
    }


//----------------- Metodos Auxiliares ---------------//

    getMatriz4x4(mat){
        //recibe una matriz de 3x3 y devuelve su correspondiente homogenea en 4x4
        var new_mat = [mat[0], mat[3], mat[6], 0,
            mat[1], mat[4], mat[7], 0,
            mat[2], mat[5], mat[8], 0,
            0, 0, 0, 1];
        return new_mat;
    }
}