class ObjetosFactory {

    constructor() {
        this.countFaroles = 0;
        this.numB=2.0;
        this.countEdif = 2.0;
        this.tapasEdificios = [];
        this.alturas = [];
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

    createSky(){

        var esfera = new Objeto3D();
        //console.log("esfera");
        var buffcalc = new BufferCalculator(10, 10);
        buffcalc.createEsfera(500);

        esfera.setBufferCreator(buffcalc);
        esfera.build();
        esfera.setType("sky",null);

        return esfera;
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

        var factorCantFaroles = 5;
        var ajusteFarolesBordes = 5;
        var sentido = 1;
        var largo = vecPos.length - ajusteFarolesBordes - 10;
        var factorColumnas = 0.0;

        //DESCOMENTAR ESTO!
        for (var i = ajusteFarolesBordes; i < largo; i += factorCantFaroles) {

            var vec = vecPosFaroles[i];
            var mat = this.getMatriz4x4(arrayMatF[i]);

            var farol = this.createFarol();
            farol.translate(vec[1], vec[0], vec[2]);
            farol.applyMatrix(mat);
            farol.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            if (sentido == -1) {
                farol.rotate(Math.PI, 0.0, 1.0, 0.0);
            }

            if(this.countFaroles < 11) {
                var pos = gl.getUniformLocation(streetShader, farolesPos[this.countFaroles]);
                gl.useProgram(streetShader);
                gl.uniform3fv(pos, farol.getPosition());
                this.countFaroles++;
            }

            ruta.add(farol);
            sentido = sentido * -1;

            if (factorColumnas == 2.0){
                if ((i + factorColumnas) < largo) {

                    var vecC = vecPosFaroles[i + factorColumnas];
                    var matC = this.getMatriz4x4(arrayMatF[i + factorColumnas]);

                    var columna = this.createColumna();
                    columna.translate(vecC[1], vecC[0]-20.0, vecC[2]);
                    columna.applyMatrix(matC);
                    columna.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
                    ruta.add(columna);
                }
                factorColumnas = 0.0;
            }

            factorColumnas++;


        }

        //ajustes de tamanio de la ruta
        ruta.scale(0.32, 0.32, 0.32);
        ruta.translate(-8.0 , 0.0, -8.0);
        return ruta;
    }

    createMediaRuta(vecPos, arrayMatT) {

        var asfaltoRuta = new Objeto3D();
        var baseRuta = new Objeto3D();
        asfaltoRuta.calcularSuperficieBarrido("asfalto_ruta", vecPos.length, 9, arrayMatT, vecPos);
        baseRuta.add(asfaltoRuta);
        baseRuta.calcularSuperficieBarrido("base_ruta", vecPos.length, 17, arrayMatT, vecPos);

        baseRuta.setType("concreto",21.0);
        asfaltoRuta.setType("autopista", 19.0);

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
        farol.setType("poste",22.0);
        var luz = this.createLuzFarol(3.0, 1.0, 2.0, true);
        luz.translate(6.0, altura - 0.5, -1.0);
        farol.add(luz);

        return farol;

    }

    createLuzFarol(x, y, z, tapaAbajo = false) {
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
        base.calcularSuperficieBarrido("tapa_luz", 2, 2, arrayMatT, puntosTapa);
        this.addColor(base,0.0,0.0,1.0);
        //linea provisoria
        //base.setShaderProgram(streetShader);

        edificio.add(base);


        if (tapaAbajo) {

            var puntosTapaAbajo = [];
            puntosTapaAbajo.push(vec3.fromValues(0.0, 0.0, 0.0));
            puntosTapaAbajo.push(vec3.fromValues(0.0, 0.0, z));
            puntosTapaAbajo.push(vec3.fromValues(x, 0.0, 0.0));
            //Creamos el piso del edificio
            var baseAbajo = new Objeto3D();
            baseAbajo.calcularSuperficieBarrido("tapa_luz", 2, 2, arrayMatT, puntosTapaAbajo);
            edificio.add(baseAbajo);
            //Linea provisoria
            baseAbajo.setShaderProgram(streetShader);
        }
        //linea provisoria
        edificio.setShaderProgram(streetShader);

        edificio.calcularSuperficieBarrido("estructura_luz", 2, 5, arrayMatT, puntosEdificio);
        this.addColor(edificio,1.0,0.0,0.0);

        return edificio;
    }

    createBuilding(x, y, z, tapaAbajo = false) {
        /*La funcion recibe:
         @ x: Ancho de las elevaciones.
         @ y: Alto del edificio.
         @ z: Profundidad de una elevacion del edificio.
         @ tapaAbajo: bool para definir o no una tapa inferior
         */

        var edificio = new Objeto3D();
        edificio.setType("edificio",this.numB, y, x);
        edificio.setShaderProgram(buildingShaders);
        edificio.setCountEd(this.countEdif);
        this.sumNumB();

        //Creamos los puntos de la curva del edificio
        var puntosEdificio = [];
        puntosEdificio.push(vec3.fromValues(0.0, 0.0, 0.0));
        puntosEdificio.push(vec3.fromValues(0.0, y, 0.0));
        //puntosEdificio.push(vec3.fromValues(0.0, y, 0.0));
        puntosEdificio.push(vec3.fromValues(x, 0.0, z));

        var arrayMatT = [];
        var mat = mat3.create();
        var matt = mat3.create();
        mat3.identity(mat);
        mat3.identity(matt);
        arrayMatT.push(mat);
        arrayMatT.push(matt);

        var puntosTapa = [];
        puntosTapa.push(vec3.fromValues(0.0, 0.0, 0.0));
        puntosTapa.push(vec3.fromValues(0.0, 0.0, z));
        puntosTapa.push(vec3.fromValues(x, 0.0, 0.0));
        //Creamos el techo del edificio
        var base = new Objeto3D();
        base.calcularSuperficieBarrido("tapa_edificio", 2, 2, arrayMatT, puntosTapa);
        this.addColor(base,0.0,0.0,1.0);
        this.tapasEdificios.push(base);
        this.alturas.push(y);
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

    createCalle(x, z, type = "calle", id = 0.0) {
        /* Funcion que recibe 2 parametros:
         @X es el ancho de la calle.
         @Z es el ancho de la calle.

         Devuelve una calle.
         */
        var calle = new Objeto3D();

        calle.setType(type,id);
        calle.setShaderProgram(streetShader);

        var arrayMatT = [];
        var matt = mat3.create();
        var mattt = mat3.create();
        mat3.identity(matt);
        mat3.identity(mattt);
        arrayMatT.push(matt);
        arrayMatT.push(mattt);

        var pos = [];
        pos.push(vec3.fromValues(0.0, 0.0, 0.0));
        pos.push(vec3.fromValues(0.0, 0.0, z));
        pos.push(vec3.fromValues(x, 0, 0));
        calle.calcularSuperficieBarrido("calle", 2, 2, arrayMatT, pos);

        return calle;

    }

    createEsquina(x) {
        /*La esquina es considerada como
         una calle con las mismas dimensiones de
         ancho y largo.
         */
        return this.createCalle(x, x, "esquina",1.0);
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

        this.addPuertas(carroceria,auto, arrayMat, puntosCarroceria);

        this.addRuedas(puntosCarroceria,arrayMat, auto);

        this.addTecho(puntosCarroceria,arrayMat,carroceria);

        return auto;
    }

    createEscene(x, bool = false) {


        var escene = new Objeto3D();

        var buffcalc = new BufferCalculator(2, 2);
        escene.setBufferCreator(buffcalc);


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
        //linea.setType("calle",1.0);

        escene.add(linea);
        if(bool) {
            var sky = this.createSky();
            sky.translate(x/2, -75.0 ,x/2);
            escene.add(sky);
        }
        escene.build();
        return escene;
    }



    createVereda(control){

        var vereda = new Objeto3D();

        var buffcalc = new BufferCalculator(2, 2);


        var perfil = new Objeto3D();

        var puntosPerfil = [];

        puntosPerfil.push(vec3.fromValues(0.0, 0.0, 0.0));
        puntosPerfil.push(vec3.fromValues(0.0, 0.2, 0.0));
        puntosPerfil.push(vec3.fromValues(control,control,control));
        //Matrices de transformacion
        var arrayMat = [];

        var mat = mat3.create();
        var matt = mat3.create();
        mat3.identity(mat);
        mat3.identity(mat);
        arrayMat.push(mat);
        arrayMat.push(matt);
        perfil.calcularSuperficieBarrido("vereda", 2, 24, arrayMat, puntosPerfil);

        var tex1=[];

        for(var i = 0.0; i<48;i++){

            var u = 0.0;
            var v = i/23;

            if(i>23){
                u = 1.0;
                v = v-1.0;
            }
            tex1.push(u);
            tex1.push(v);
        }

        perfil.bufferCreator.textureBuffer1 = tex1;

        vereda.add(perfil);

        var piso = new Objeto3D();
        if(control){
            perfil.setType("vereda",18.0);
            piso.setType("vereda",18.0);
        }
        else{
            perfil.setType("pasto",20.0);
            piso.setType("pasto",20.0);
        }

        var buf = new BufferCalculator(2,24);
        /*Seteo los buffers */

        //Sabemos que las normales son salientes al plano, entonces son 1 en y.
        var norm = [];
        var pos = [];

        var tex = [0.1,0.0,  0.9,0.0,  0.93,0.005,  0.959,0.019,  0.98,0.041,  0.99,0.069,
            1.0,0.9,  0.99,0.93,  0.98,0.958,  0.958,0.98,  0.93,0.99,  0.9,1.0,
            0.1,1.0,  0.069,0.99,  0.041,0.98,  0.019,0.96,  0.009,0.93,  0.0,0.9,
            0.0,0.1,  0.0098,0.069,  0.019,0.041,  0.041,0.019,  0.069,0.0048,  0.1,0.0];

        //console.log("empieza");
        for( var i = 0; i<24; i++){
            norm.push(0.0);
            norm.push(1.0);
            norm.push(0.0);

            //Pone x6 aca y sacas el trasnportado.
            pos.push(perfil.bufferCreator.posBuffer[i*3]);
            pos.push(perfil.bufferCreator.posBuffer[i*3+1]);
            pos.push(perfil.bufferCreator.posBuffer[i*3+2]);

        }

        buf.normalBuffer =norm;
        buf.posBuffer = pos;
        buf.colorBuffer = perfil.bufferCreator.colorBuffer;

        buf.setBoolTexture1();

        buf.textureBuffer1 = tex;

        piso.setBufferCreator(buf);

        piso.bufferCreator.indexBuffer = [0,7,1, 1,7,2, 2,7,3, 3,7,4, 4,7,5, 5,6,7,
            7,12,8, 8,12,9, 9,12,10, 10,12,11, 11,12,7, 7,12,0,
            0,12,13, 14,13,15, 15,13,16, 16,13,17, 17,13,18, 18,0,13, 13,15,18, 18,0,19,
            19,0,20, 20,0,21, 21,0,22, 22,0,23 ];

        piso.build();
        piso.translate(0.0,0.2,0.0);

        vereda.add(piso);
        vereda.setBufferCreator(buffcalc);
        vereda.build();
        return vereda;

    }

    createManzanaB(x){

        var manzana = this.createEscene(x);
        var anchoVereda = 4.0;
        var centro = this.createEscene(x-anchoVereda);

        var alturas =this.llenarAlturas();

        var vereda = this.createVereda(true);

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

        centro.translate(anchoVereda/2,0.19,anchoVereda/2);
        vereda.add(centro);
        manzana.add(vereda);

        return manzana;
    }

    createManzanaP(x){

        var manzana = this.createEscene(x);
        var anchoVereda = 4.0;


        var vereda = this.createVereda(true);
        var centro = this.createVereda(false);

        centro.translate(anchoVereda/2 +0.5, 0.2,anchoVereda/2 + 0.5);
        centro.scale(0.75,1.0,0.75);

        vereda.add(centro);
        manzana.add(vereda);

        return manzana;
    }

    createColumna(){
        /*Objeto Contenedor*/

        var cantidad = 15;

        var columna = new Objeto3D();
        var buffcalc = new BufferCalculator(2, cantidad);
        columna.setBufferCreator(buffcalc);
        columna.build();

        /*Creo lo que es el cilindro de la columna*/
        var pilar = new Objeto3D();
        pilar.calcularSuperficieRevolucion("columna",2,cantidad);
        //pilar.rotate(-Math.PI/2,1.0,0.0,0.0);
        pilar.setType("concreto",21.0);
        columna.add(pilar);

        /*Creo lo que es la base de la columna*/
        var base = new Objeto3D();
        base.calcularSuperficieRevolucion("base_columna",8,cantidad);
        //base.rotate(-Math.PI/2,1.0,0.0,0.0);
        columna.add(base);

        /*Creo la tapa de la columna*/

        var tapa = new Objeto3D();
        tapa.calcularSuperficieRevolucion("tapa_columna",3,cantidad);
        //tapa.rotate(Math.PI/2,1.0,0.0,0.0);
        columna.add(tapa);


        return columna;
    }


//----------------- Metodos Auxiliares ---------------//

    updateTechos(t, numEdificio){

        var edificio = Math.floor(numEdificio);

        var ed = this.tapasEdificios[edificio];
        var altura = this.alturas[edificio];
        ed.resetMatrix();
        var escalaY= Math.min(1.0,t*0.05);
        ed.translate(0.0, altura * escalaY, 0.0);
    }

    getIdEdficios(){
        return this.numB;
    }

    getMatriz4x4(mat){
        //recibe una matriz de 3x3 y devuelve su correspondiente homogenea en 4x4
        var new_mat = [mat[0], mat[3], mat[6], 0,
            mat[1], mat[4], mat[7], 0,
            mat[2], mat[5], mat[8], 0,
            0, 0, 0, 1];
        return new_mat;
    }

    sumNumB(){
        this.numB += 1.0;
        this.countEdif += 1.0;
        if(this.countEdif >= 14.0){
            this.countEdif=2.0;
        }
    }

    llenarAlturas(){
        var alturas = [];
        var variaciones = [0.7,0.8,0.9];
        for(var i =0.0; i<14;i++){
            var num = Math.random();

            if(num <0.5){
                num = variaciones[i%3];
            }
            alturas.push(num*20);
        }
        return alturas;
    }

    addPuertas(carroceria,auto,arrayMat,puntosCarroceria){
        var puerta1 = new Objeto3D();
        var buf = new BufferCalculator(2,19);
        /*Seteo los buffers */
        var norm1 = [];
        var norm2 = [];

        for (var i =0; i<19;i++){
            norm1.push(-1.0);
            norm1.push(0.0);
            norm1.push(0.0);

            norm2.push(1.0);
            norm2.push(0.0);
            norm2.push(0.0);
        }


        buf.normalBuffer = norm1;
        buf.colorBuffer = carroceria.bufferCreator.colorBuffer;
        buf.posBuffer = carroceria.bufferCreator.posBuffer;
        puerta1.setBufferCreator(buf);

        //console.log(buf.posBuffer);
        puerta1.bufferCreator.indexBuffer = [0,17,1,1,17,2,2,17,3,3,17,4,4,16,17,4,16,5,5,16
            ,6,6,16,7,7,16,8,8,16,9,9,16,10,10,16,11,11,16,12,12,15,16,12,15,13,13,14,15];
        puerta1.build();
        auto.add(puerta1);


        //ACOMODAR LAS NORMALES, ESTAN COMO PARA ADENTRO DEL AUTO
        var puerta2 = new Objeto3D();
        var buf = new BufferCalculator(2,19);
        /*Seteo los buffers */
        buf.normalBuffer = norm2;
        buf.colorBuffer = carroceria.bufferCreator.colorBuffer;
        buf.posBuffer = carroceria.bufferCreator.posBuffer;

        puerta2.setBufferCreator(buf);

        puerta2.bufferCreator.indexBuffer = [0,17,1,1,17,2,2,17,3,3,17,4,4,16,17,4,16,5,5,16
            ,6,6,16,7,7,16,8,8,16,9,9,16,10,10,16,11,11,16,12,12,15,16,12,15,13,13,14,15];
        puerta2.build();

        puerta2.translate(0.0,0.0,4.0);
        auto.add(puerta2);
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

        var norm = [];
        var n = -1.0;
        if (trasladar){
            n=1.0;
        }
        var col = [];
        for(var i=0.0; i<rueda.bufferCreator.normalBuffer.length /3; i++){
            norm.push(0.0);
            norm.push(0.0);
            norm.push(n);

        }
        buf.normalBuffer = norm;
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
        var saliente = 1.0;
        if(!trasladar){
            saliente=-1.0;
        }
        var norm = [];
        var col =[];

        for(var i = 0; i<6;i++){
            norm.push(saliente);
            norm.push(0.0);
            norm.push(0.0);

            col.push(0.0);
            col.push(0.0);
            col.push(1.0);
        }
        buf.normalBuffer = norm;
        buf.colorBuffer = col;
        buf.posBuffer = techo.bufferCreator.posBuffer;
        tapa.setBufferCreator(buf);

        tapa.bufferCreator.indexBuffer = [0,1,2,2,0,3,3,0,4];
        if(trasladar){
            tapa.translate(0.0,0.0,4.0);
        }
        tapa.build();
        techo.add(tapa);
    }

    addColor(objeto,r,g,b){

        var cantVertices = objeto.bufferCreator.posBuffer.length/3;
        var color = []
        for(var i=0; i<cantVertices; i++){
            color.push(r);
            color.push(g);
            color.push(b);
        }

        objeto.bufferCreator.colorBuffer = color;
        //console.log(objeto.bufferCreator.posBuffer);
        //console.log(objeto.bufferCreator.colorBuffer);
    }
}
