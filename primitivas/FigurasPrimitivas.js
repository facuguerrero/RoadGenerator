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
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

        vertices.push(vec3.fromValues(1.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(1.0, 0.0, 0.0));

        vertices.push(vec3.fromValues(1.0, 1.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(1.0, 1.0, 0.0));

        vertices.push(vec3.fromValues(0.0, 1.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 1.0, 0.0));

        //ultimo vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

    }

    //crea un circulo centrado en el origen
    calcularCirculo(colms, vertices, arrayVecNOR, radio){

        //longitud maxima de la curva que conforma al circulo
        var len = 1.0;

        for (var j = 0; j < colms; j++) {

            var u = j * len / (colms - 1);
            vertices.push(vec3.fromValues(radio * Math.cos(2 * Math.PI * u), radio * Math.sin(2 * Math.PI * u), 0.0));
            arrayVecNOR.push(vec3.fromValues(Math.cos(2 * Math.PI * u), Math.sin(2 * Math.PI * u), 0.0));

            //para cuando agreguemos la tangente
            //vec3.fromValues( - Math.sin(2 * Math.PI * u), Math.cos(2 * Math.PI * u), 0.0);


        }

    }


}
