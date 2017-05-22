class FigurasPrimitivias{

    constructor(){
        //
    }

    /*crea un cuadrado de dimensiones proporcionales a 1x1
    centrado en el origen de coordenadas
     */
    calcularCuadrado(vertices, arrayVecNOR){

        //COMENTARIO: Faltan completar las normales que no se como se llenan, solo se que el eje z va vacio

        //primer vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(1.0, 0.0, 0.0));
        var vecNorm2 = vec3.fromValues(1.0, 0.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);

        vertices.push(vec3.fromValues(1.0, 0.0, 1.0));
        var vecNorm3 = vec3.fromValues(1.0, 0.0, 1.0);
        vec3.normalize(vecNorm3, vecNorm3);
        arrayVecNOR.push(vecNorm3);

        vertices.push(vec3.fromValues(0.0, 0.0, 1.0));
        var vecNorm4 = vec3.fromValues(0.0, 0.0, 1.0);
        vec3.normalize(vecNorm4, vecNorm4);
        arrayVecNOR.push(vecNorm4);

        //ultimo vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm5 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm5, vecNorm5);
        arrayVecNOR.push(vecNorm5);

    }


    calcularEstructuraEdificio(vertices, arrayVecNOR, escalado){

        var x = escalado[0];
        var z = escalado[2];
        //primer vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(0.0, 0.0, z));
        var vecNorm2 = vec3.fromValues(0.0, 0.0, z);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);

        vertices.push(vec3.fromValues(x, 0.0, z));
        var vecNorm3 = vec3.fromValues(x, 0.0, z);
        vec3.normalize(vecNorm3, vecNorm3);
        arrayVecNOR.push(vecNorm3);

        vertices.push(vec3.fromValues(x, 0.0, 0.0));
        var vecNorm4 = vec3.fromValues(x, 0.0, 0.0);
        vec3.normalize(vecNorm4, vecNorm4);
        arrayVecNOR.push(vecNorm4);

        //ultimo vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm5 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm5, vecNorm5);
        arrayVecNOR.push(vecNorm5);

    }

    calcularTapaEdificio(vertices, arrayVecNOR, x){

        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(x, 0.0, 0.0));
        var vecNorm2 = vec3.fromValues(x, 0.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);


    }


    //crea un circulo centrado en el origen
    calcularCirculo(colms, vertices, arrayVecNOR, radio){

        //longitud maxima de la curva que conforma al circulo
        var len = 1.0;

        for (var j = 0; j < colms; j++) {
            var u = j * len / (colms - 1);
            vertices.push(vec3.fromValues(radio * Math.cos(2 * Math.PI * u), radio * Math.sin(2 * Math.PI * u), 0.0));
            var vecNorm = vec3.fromValues(Math.cos(2 * Math.PI * u), Math.sin(2 * Math.PI * u), 0.0);
            vec3.normalize(vecNorm, vecNorm);
            arrayVecNOR.push(vecNorm);

            //para cuando agreguemos la tangente
            //vec3.fromValues( - Math.sin(2 * Math.PI * u), Math.cos(2 * Math.PI * u), 0.0);


        }

    }

    calcularLinea(vertices, arrayVecNOR){

        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(1.0, 0.0, 0.0));
        var vecNorm2 = vec3.fromValues(1.0, 0.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);

    }

    calcularBaseRuta(vertices, arrayVecNOR){

        //primer vertice
        vertices.push(vec3.fromValues(8.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(1.0, -1.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(8.0, 3.0, 0.0));
        var vecNorm2 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);

        vertices.push(vec3.fromValues(7.0, 3.0, 0.0));
        var vecNorm3 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm3, vecNorm3);
        arrayVecNOR.push(vecNorm3);

        vertices.push(vec3.fromValues(6.0, 1.0, 0.0));
        var vecNorm4 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm4, vecNorm4);
        arrayVecNOR.push(vecNorm4);

        vertices.push(vec3.fromValues(-6.0, 1.0, 0.0));
        var vecNorm5 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm5, vecNorm5);
        arrayVecNOR.push(vecNorm5);

        vertices.push(vec3.fromValues(-7.0, 3.0, 0.0));
        var vecNorm6 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm6, vecNorm6);
        arrayVecNOR.push(vecNorm6);

        vertices.push(vec3.fromValues(-8.0, 3.0, 0.0));
        var vecNorm7 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm7, vecNorm7);
        arrayVecNOR.push(vecNorm7);

        vertices.push(vec3.fromValues(-8.0, 0.2, 0.0));
        var vecNorm8 = vec3.fromValues(-1.0, -1.0, 0.0);
        vec3.normalize(vecNorm8, vecNorm8);
        arrayVecNOR.push(vecNorm8);

        vertices.push(vec3.fromValues(-11.0, 0.2, 0.0));
        var vecNorm9 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm9, vecNorm9);
        arrayVecNOR.push(vecNorm9);

        vertices.push(vec3.fromValues(-11.0, 3.0, 0.0));
        var vecNorm10 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm10, vecNorm10);
        arrayVecNOR.push(vecNorm10);

        vertices.push(vec3.fromValues(-12.0, 3.0, 0.0));
        var vecNorm11 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm11, vecNorm11);
        arrayVecNOR.push(vecNorm11);

        vertices.push(vec3.fromValues(-13.0, 1.0, 0.0));
        var vecNorm12 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm12, vecNorm12);
        arrayVecNOR.push(vecNorm12);

        vertices.push(vec3.fromValues(-25.0, 1.0, 0.0));
        var vecNorm13 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm13, vecNorm13);
        arrayVecNOR.push(vecNorm13);

        vertices.push(vec3.fromValues(-26.0, 3.0, 0.0));
        var vecNorm14 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm14, vecNorm14);
        arrayVecNOR.push(vecNorm14);

        vertices.push(vec3.fromValues(-27.0, 3.0, 0.0));
        var vecNorm15 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm15, vecNorm15);
        arrayVecNOR.push(vecNorm15);

        vertices.push(vec3.fromValues(-27.0, 0.0, 0.0));
        var vecNorm16 = vec3.fromValues(-1.0, -1.0, 0.0);
        vec3.normalize(vecNorm16, vecNorm16);
        arrayVecNOR.push(vecNorm16);

        //ultimo vertice repite el primero vertice
        vertices.push(vec3.fromValues(8.0, 0.0, 0.0));
        var vecNorm17 = vec3.fromValues(1.0, -1.0, 0.0);
        vec3.normalize(vecNorm17, vecNorm17);
        arrayVecNOR.push(vecNorm17);

    }

    calcularAsfaltoRuta(vertices, arrayVecNOR){

        //primer vertice
        vertices.push(vec3.fromValues(7.8, 1.0, 0.0));
        var vecNorm1 = vec3.fromValues(1.0, -1.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(7.8, 2.0, 0.0));
        var vecNorm2 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);

        vertices.push(vec3.fromValues(-7.8, 2.0, 0.0));
        var vecNorm3 = vec3.fromValues(-1.0, 1.0, 0.0);
        vec3.normalize(vecNorm3, vecNorm3);
        arrayVecNOR.push(vecNorm3);

        vertices.push(vec3.fromValues(-7.8, 1.0, 0.0));
        var vecNorm4 = vec3.fromValues(-1.0, -1.0, 0.0);
        vec3.normalize(vecNorm4, vecNorm4);
        arrayVecNOR.push(vecNorm4);

        //ultimo punto que es el primero repetido
        vertices.push(vec3.fromValues(7.8, 1.0, 0.0));
        var vecNorm5 = vec3.fromValues(1.0, -1.0, 0.0);
        vec3.normalize(vecNorm5, vecNorm5);
        arrayVecNOR.push(vecNorm5);

    }

    calcularCalle(vertices, arrayVecNOR, x) {

        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm1 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm1, vecNorm1);
        arrayVecNOR.push(vecNorm1);

        vertices.push(vec3.fromValues(x, 0.0, 0.0));
        var vecNorm2 = vec3.fromValues(x, 0.0, 0.0);
        vec3.normalize(vecNorm2, vecNorm2);
        arrayVecNOR.push(vecNorm2);
    }


}
