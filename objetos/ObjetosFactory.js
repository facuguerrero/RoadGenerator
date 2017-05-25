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

        //Creamos la carroceria del auto
        var carroceria = new Objeto3D();

        carroceria.calcularSuperficieBarrido("carroceria", 2, 19, arrayMat, puntosCarroceria);
        auto.add(carroceria);

        this.addPuertas(carroceria,auto, arrayMat, puntosCarroceria, false);
        this.addPuertas(carroceria,auto, arrayMat, puntosCarroceria, true);

        this.addRuedas(puntosCarroceria,arrayMat, auto);

        this.addTecho(puntosCarroceria,arrayMat,carroceria);

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

        var curva = new CuadraticBezier(puntos.length,0.1 ,true);

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
        var centro = this.createEscene(x-anchoVereda);

        var alturas =this.llenarAlturas();

        var puntos = [];
        puntos.push(vec3.fromValues(0.0,0.0,0.0));
        puntos.push(vec3.fromValues(10.0,0.0,0.0));
        puntos.push(vec3.fromValues(20.0,0.0,0.0));
        puntos.push(vec3.fromValues(20.0,0.0,0.0));
        puntos.push(vec3.fromValues(20.0,0.0,10.0));
        puntos.push(vec3.fromValues(20.0,0.0,20.0));
        /*puntos.push(vec3.fromValues(0.0, 4.0, 2.0));
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
        */
        var vereda = this.createVereda(puntos);
        vereda.translate(0.0,0.5,0.0);
        manzana.add(vereda);

        var edificio1 = this.createBuilding(4.0, alturas[0], 5.0);
        centro.add(edificio1);

        var edificio2 = this.createBuilding(5.0,alturas[1],2.5);
        edificio2.translate(4.15,0.0,0.0);
        centro.add(edificio2);

        var edificio3 = this.createBuilding(3.5,alturas[2],2.5);
        edificio3.translate(9.3,0.0,0.0);
        centro.add(edificio3);

        var edificio4 = this.createBuilding(3.05,alturas[3],4.0);
        edificio4.translate(12.95,0.0,0.0);
        centro.add(edificio4);

        var edificio5 = this.createBuilding(2.5,alturas[4],3.5);
        edificio5.translate(0.0,0.0,5.15);
        centro.add(edificio5);

        var edificio6 = this.createBuilding(2.5,alturas[5],4.0);
        edificio6.translate(0.0,0.0,8.8);
        centro.add(edificio6);

        var edificio7 = this.createBuilding(3.5,alturas[6],3.05);
        edificio7.translate(0.0,0.0,12.95);
        centro.add(edificio7);

        var edificio8 = this.createBuilding(3.0,alturas[7],2.5);
        edificio8.translate(3.65,0.0,13.5);
        centro.add(edificio8);

        var edificio9 = this.createBuilding(3.5,alturas[8],2.5);
        edificio9.translate(6.8,0,13.5);
        centro.add(edificio9);

        var edificio10 = this.createBuilding(2.5,alturas[9],2.5);
        edificio10.translate(10.45,0,13.5);
        centro.add(edificio10);

        var edificio11 = this.createBuilding(2.9,alturas[10],2.5);
        edificio11.translate(13.1,0,13.5);
        centro.add(edificio11);

        var edificio12 = this.createBuilding(2.5,alturas[11],3.0);
        edificio12.translate(13.5,0.0,4.1);
        centro.add(edificio12);

        var edificio13 = this.createBuilding(2.5,alturas[12],2.5);
        edificio13.translate(13.5,0.0,7.25);
        centro.add(edificio13);

        var edificio14 = this.createBuilding(2.5,alturas[13],3.5);
        edificio14.translate(13.5,0.0,9.9);
        centro.add(edificio14);

        centro.translate(anchoVereda/2,0.05,anchoVereda/2);
        manzana.add(centro);
        //manzana.add(vereda);
        return manzana;
    }

    createManzanaP(x){

        var manzana = this.createEscene(x);
        var anchoVereda = 4.0;
        var centro = this.createEscene(x-anchoVereda);
        
        
        centro.translate(anchoVereda/2,0.15,anchoVereda/2);
        manzana.add(centro);
        //manzana.add(vereda);
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

    llenarAlturas(){
        var alturas = [];
        var variaciones = [0.3,0.5,0.7];
        for(var i =0.0; i<14;i++){
            var num = Math.random();

            if(num <0.3 || num>0.7){
                num = variaciones[i%3];
            }
            alturas.push(num*20);
        }
        return alturas;
    }

    addPuertas(carroceria,auto, trasladar){
        var puerta1 = new Objeto3D();
        var buf = new BufferCalculator(2,19);
        /*Seteo los buffers */
        buf.normalBuffer = carroceria.bufferCreator.normalBuffer;
        buf.colorBuffer = carroceria.bufferCreator.colorBuffer;
        buf.posBuffer = carroceria.bufferCreator.posBuffer;
        puerta1.setBufferCreator(buf);

        //console.log(buf.posBuffer);
        puerta1.bufferCreator.indexBuffer = [0,17,1,1,17,2,2,17,3,3,17,4,4,16,17,4,16,5,5,16
            ,6,6,16,7,7,16,8,8,16,9,9,16,10,10,16,11,11,16,12,12,15,16,12,15,13,13,14,15];

        if(trasladar){
            //Acomodar las normales.
            puerta1.translate(0.0, 0.0, 4.0);
        }
        puerta1.build();
        auto.add(puerta1);

    }


    addRuedas(puntosCarroceria,arrayMat,auto){
        //Creamos las ruedas del auto
        var rueda1 = new Objeto3D();
        //Las matrices y los puntos son los mismos que la carroceria solo le agrego los
        //posicionamientos y el radio
        puntosCarroceria.push(vec3.fromValues(2.0, 1.0, 0.8));
        rueda1.calcularSuperficieBarrido("rueda", 2, 11, arrayMat, puntosCarroceria);
        auto.add(rueda1);
        this.addTapaRueda(rueda1,arrayMat, puntosCarroceria,2.0,false);
        this.addTapaRueda(rueda1,arrayMat, puntosCarroceria,2.0,true);


        var rueda2 = new Objeto3D();
        //Las matrices y los puntos son los mismos que la carroceria solo le agrego los
        //posicionamientos y el radio
        puntosCarroceria.push(vec3.fromValues(8.0, 1.0, 0.8));
        rueda2.calcularSuperficieBarrido("rueda", 2, 11, arrayMat, puntosCarroceria);
        auto.add(rueda2);
        this.addTapaRueda(rueda2,arrayMat, puntosCarroceria,8.0,false);
        this.addTapaRueda(rueda1,arrayMat, puntosCarroceria,8.0,true);

    }

    addTapaRueda(rueda,arrayMat, puntosCarroceria,x,trasladar){

        var tapa1 = new Objeto3D();

        var buf = new BufferCalculator(2,11);
        /*Seteo los buffers */
        buf.normalBuffer = rueda.bufferCreator.normalBuffer;
        buf.colorBuffer = rueda.bufferCreator.colorBuffer;
        tapa1.setBufferCreator(buf);

        puntosCarroceria.push(vec3.fromValues(x, 1.0, 0.8));
        tapa1.calcularSuperficieBarrido("rueda",2,11,arrayMat,puntosCarroceria);

        tapa1.bufferCreator.indexBuffer = [1,0,2,2,0,3,3,0,4,4,0,5,5,0,6,6,0,7,7,0,8,8,0,9];
        if(trasladar){
            tapa1.translate(0.0,0.0,4.0);
        }
        tapa1.build();
        rueda.add(tapa1);
    }

    addTecho(puntosCarroceria,arrayMat,carroceria){

        var techo = new Objeto3D();
        techo.calcularSuperficieBarrido("techo",2,6,arrayMat,puntosCarroceria);

        this.addTapaTecho(techo, false);
        this.addTapaTecho(techo, true);

        carroceria.add(techo);
    }

    addTapaTecho(techo, trasladar){
        var tapa = new Objeto3D();
        var buf = new BufferCalculator(2,6);
        /*Seteo los buffers */
        buf.normalBuffer = techo.bufferCreator.normalBuffer;
        buf.colorBuffer = techo.bufferCreator.colorBuffer;
        buf.posBuffer = techo.bufferCreator.posBuffer;
        tapa.setBufferCreator(buf);

        tapa.bufferCreator.indexBuffer = [0,1,2,2,0,3,3,0,4];
        if(trasladar){
            tapa.translate(0.0,0.0,4.0);
        }
        tapa.build();
        techo.add(tapa);
    }
}