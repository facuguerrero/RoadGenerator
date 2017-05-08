class FigurasPrimitivias{

    constructor(){
        //
    }

    /*crea un cuadrado de dimensiones proporcionales a 1x1
    centrado en el origen de coordenadas
     */
    calcularCuadrado(vertices, arrayVecNOR){

        //primer vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

        vertices.push(vec3.fromValues(1.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

        vertices.push(vec3.fromValues(1.0, 1.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

        vertices.push(vec3.fromValues(0.0, 1.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

        //ultimo vertice
        vertices.push(vec3.fromValues(0.0, 0.0, 0.0));
        arrayVecNOR.push(vec3.fromValues(0.0, 0.0, 0.0));

    }


}
