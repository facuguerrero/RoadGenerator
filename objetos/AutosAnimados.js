class AutosAnimados {

    constructor(ruta, puntos, factory) {
        this.ruta = ruta;
        this.puntos = puntos;
        this.factory = factory;
        this.autos1 = [];
        this.autos2 = [];
        this.autos3 = [];
        this.autos4 = [];

        this.createAutos();

    }

    createAutos() {

        //creo dos nuevas curvas que se adecuen a los autos
        var puntosAutos1 = [];
        var puntosAutos2 = [];
        var puntosAutos3 = [];
        var puntosAutos4 = [];
        for (var j = 0; j < this.puntos.length; j++) {
            var vecR = this.puntos[j];
            puntosAutos1.push([vecR[0] + 1.9, vecR[1], (vecR[2] - 10.0)]);
            puntosAutos2.push([vecR[0] + 1.9, vecR[1], (vecR[2] - 15.0)]);
            puntosAutos3.push([vecR[0] + 1.9, vecR[1], (vecR[2] + 10.0)]);
            puntosAutos4.push([vecR[0] + 1.9, vecR[1], (vecR[2] + 15.0)]);
        }
        var curvaAutos1 = new CuadraticBSpline(puntosAutos1.length, 0.1, true);
        var curvaAutos2 = new CuadraticBSpline(puntosAutos2.length, 0.1, true);
        var curvaAutos3 = new CuadraticBSpline(puntosAutos3.length, 0.1, true);
        var curvaAutos4 = new CuadraticBSpline(puntosAutos4.length, 0.1, true);

        curvaAutos1.setControlPoints(puntosAutos1);
        curvaAutos1.calculateArrays();

        curvaAutos2.setControlPoints(puntosAutos2);
        curvaAutos2.calculateArrays();

        curvaAutos3.setControlPoints(puntosAutos3);
        curvaAutos3.calculateArrays();

        curvaAutos4.setControlPoints(puntosAutos4);
        curvaAutos4.calculateArrays();

        var vecPosAutos1 = curvaAutos1.getVecPos();
        var arrayMatA1 = curvaAutos1.getArrayMatT();

        var vecPosAutos2 = curvaAutos2.getVecPos();
        var arrayMatA2 = curvaAutos2.getArrayMatT();

        var vecPosAutos3 = curvaAutos3.getVecPos();
        var arrayMatA3 = curvaAutos3.getArrayMatT();

        var vecPosAutos4 = curvaAutos4.getVecPos();
        var arrayMatA4 = curvaAutos4.getArrayMatT();

        var random = Math.random() * 5;
        var factorCantAutos = 5.0;
        var ajusteAutosBordes = 5.0;
        var distanciaEntreAutos = 2;
        for (var k = ajusteAutosBordes; k < vecPosAutos1.length - ajusteAutosBordes - random - 10.0; k += factorCantAutos + random) {

            var i = Math.floor(k);

            //auto 1
            var vec1 = vecPosAutos1[i];
            var mat1 = this.factory.getMatriz4x4(arrayMatA1[i]);

            var auto1 = this.factory.createCar();
            auto1.translate(vec1[1], vec1[0], vec1[2]);
            auto1.applyMatrix(mat1);
            auto1.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            auto1.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
            auto1.scale(0.5, 0.5, 0.5);
            this.ruta.add(auto1);

            //auto 2
            var vec2 = vecPosAutos2[i + 1 + Math.floor(random)];
            var mat2 = this.factory.getMatriz4x4(arrayMatA2[i + 1 + Math.floor(random)]);

            var auto2 = this.factory.createCar();
            auto2.translate(vec2[1], vec2[0], vec2[2]);
            auto2.applyMatrix(mat2);
            auto2.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            auto2.rotate(Math.PI / 2, 0.0, 1.0, 0.0);
            auto2.scale(0.5, 0.5, 0.5);
            this.ruta.add(auto2);

            //auto3
            var vec3 = vecPosAutos3[i];
            var mat3 = this.factory.getMatriz4x4(arrayMatA3[i + 1 + Math.floor(random)]);

            var auto3 = this.factory.createCar();
            auto3.translate(vec3[1], vec3[0], vec3[2]);
            auto3.applyMatrix(mat3);
            auto3.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            auto3.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
            auto3.scale(0.5, 0.5, 0.5);
            this.ruta.add(auto3);

            //auto 4
            var vec4 = vecPosAutos4[i + 1 + Math.floor(random)];
            var mat4 = this.factory.getMatriz4x4(arrayMatA4[i + 1 + Math.floor(random)]);

            var auto4 = this.factory.createCar();
            auto4.translate(vec4[1], vec4[0], vec4[2]);
            auto4.applyMatrix(mat4);
            auto4.rotate(Math.PI / 2, 0.0, 0.0, 1.0);
            auto4.rotate(-Math.PI / 2, 0.0, 1.0, 0.0);
            auto4.scale(0.5, 0.5, 0.5);
            this.ruta.add(auto4);

            random = Math.random() * 5;

        }

    }

}