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

        vertices.push(vec3.fromValues(1.0, 1.0, 0.0));
        var vecNorm3 = vec3.fromValues(1.0, 1.0, 0.0);
        vec3.normalize(vecNorm3, vecNorm3);
        arrayVecNOR.push(vecNorm3);

        vertices.push(vec3.fromValues(0.0, 1.0, 0.0));
        var vecNorm4 = vec3.fromValues(0.0, 1.0, 0.0);
        vec3.normalize(vecNorm4, vecNorm4);
        arrayVecNOR.push(vecNorm4);

        //ultimo vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        var vecNorm5 = vec3.fromValues(0.0, 0.0, 0.0);
        vec3.normalize(vecNorm5, vecNorm5);
        arrayVecNOR.push(vecNorm5);

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


}
