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
		for (var i = 0.0; i <= 100.0; i+= 3) {
        
        	var linea = new Objeto3D();
       		var vecPos = [];
        	vecPos.push(vec3.fromValues(i, 0.0, -100.0));
			vecPos.push(vec3.fromValues(i, 0.0, 100.0));
			linea.calcularSuperficieBarrido("linea", 2, 2, arrayMatT, vecPos);
			grid.add(linea);        

        }

        return grid;

	}



}