class Container3D{

  constructor(){
    this.matrix = null;
    this.prevModelMatrix = null;
    this.children = [];
    this.shaderProgram = null;
    this.modified = false;
    this.objectType = null;
    this.matrix = mat4.create();
    mat4.identity(this.matrix);
    this.prevModelMatrix = mat4.create();
    mat4.identity(this.prevModelMatrix);
    }

    translate(x, y, z) {
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    scale(x, y, z) {
        mat4.scale(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    rotate(angulo, x, y, z) {
        mat4.rotate(this.matrix, this.matrix, angulo, vec3.fromValues(x, y, z));
        this.modified = true;
    }

    add(child) {
        //recibe un hijo de tipo Objeto3d para agregar a su jerarquia
        this.children.push(child);
    }

    remove(child) {
        //recibe un hijo
        var index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }

    resetMatrix() {
        //resetea la matriz como la identidad
        mat4.identity(this.matrix);
        this.modified = true;
    }

    applyMatrix(matrix) {
        //recibe una matriz la cual multiplica por la suya propia
        mat4.multiply(this.matrix, this.matrix, matrix);
        this.modified = true;
    }

    setShaderProgram(shaderProgram) {
        //recibe el shader a utilizar
        this.shaderProgram = shaderProgram;
        gl.useProgram(shaderProgram);
    }

    setupLighting(lightPosition, ambientColor, diffuseColor) {
        // Configuración de la luz
        // Se inicializan las variables asociadas con la Iluminación
        this.setupChildrenLighting(lightPosition, ambientColor, diffuseColor);

        gl.useProgram(this.shaderProgram);

        if(this.objectType == null) {

            gl.uniform1i(this.shaderProgram.useLightingUniform, true);
            //Define direccion
            gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
            //Define ambient color
            gl.uniform3fv(this.shaderProgram.ambientColorUniform, ambientColor);
            //Define diffuse color
            gl.uniform3fv(this.shaderProgram.directionalColorUniform, diffuseColor);
        }
        else{
            // Obtenemos la ubicación de la camara y se la pasamos al shader
            var camera_position = camera.getPosition();
            gl.uniform3f(streetShader.cameraPositionUniform, camera_position[0], camera_position[1], camera_position[2]);

            /** Configuración de la luz **/

            //gl.uniform1i(streetShader.useLightingPuntual, true);

            // Configuramos la iluminación general
            // Auto iluminación
            gl.uniform1f(streetShader.autoIluminationIntensity, 2.0);
            gl.uniform3f(streetShader.autoIluminationColorUniform, 1.0, 1.0, 1.0);

            // Luz ambiental
            gl.uniform1f(streetShader.ambientIluminationIntensity, 2.0);
            //gl.uniform3f(streetShader.ambientColorUniform, 0.2, 0.2, 0.2);

            // Luces puntuales
            gl.uniform1f(streetShader.punctualLightRadio, 20.0);
            gl.uniform1f(streetShader.lightPunctualIntensity, 0.3);							//Intensidad
            gl.uniform3f(streetShader.diffusePunctualColorUniform, 0.8, 1.0, 0.8);			//Difusa (Verdosa)
            gl.uniform3f(streetShader.specularPunctualColorUniform, 0.8, 1.0, 0.8);			//Especular (Verdosa)
            gl.uniform3fv(streetShader.lightingPunctual1PositionUniform, [0.0,10.0,0.0]);	//Punctual 1
        }
    }

    setupChildrenLighting(lightPosition, ambientColor, diffuseColor) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    }

    /**Dibuja a los hijos
     * @param Idem draw.
     */
    _drawChildren(modelMatrix, CameraMatrix, pMatrix, parentMod) {
        for (var i = 0; i < this.children.length; i++) {
            var child = this.children[i];
            child.draw(modelMatrix, CameraMatrix, pMatrix, parentMod);
        }
    }
}
