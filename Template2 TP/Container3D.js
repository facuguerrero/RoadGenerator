class Container3D{
    constructor(){
        this.matrix = null;
        this.prevModelMatrix = null;
        this._setMatrix();

        this.modified = false;

        this.children = [];
        this.shaderProgram = null;
    }
    /*Crear matriz de modelado*/
    _setMatrix(){
        this.matrix = mat4.create();
        mat4.identity(this.matrix);

        this.prevModelMatrix = mat4.create();
        mat4.identity(this.prevModelMatrix);
    }

    /**********METODOS DE MODELADO*********/
    /*Resetea la matriz de modelado*/
    resetMatrix(){
        this._setMatrix();
        this.modified = true;
    }
    /**Translacion en los valores x,y,z indicados
      * @param {x} float Desplazamiento en eje x.
      * @param {y} float Desplazamiento en eje y.
      * @param {z} float Desplazamiento en eje z.
    */
    translate(x, y, z){
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }
    /**Rotacion sobre el eje dado por las coordenadas indicadas, en el angulo dado.
      * @param {angle} float Angulo de rotacion.
      * @param {x} float Componente x del eje de rotacion.
      * @param {y} float Componente y del eje de rotacion.
      * @param {z} float Componente z del eje de rotacion.
    */
    rotate(angle, x, y, z){
        mat4.rotate(this.matrix, this.matrix, angle, vec3.fromValues(x, y, z));
        this.modified = true;
    }
    /**Escala en las proporciones dadas de x, y, z.
      * @param {x} float Escala en x.
      * @param {y} float Escala en y.
      * @param {z} float Escala en z.
    */
    scale(x, y, z){
        mat4.scale(this.matrix, this.matrix, vec3.fromValues(x, y, z));
        this.modified = true;
    }
    /**Multiplica a derecha a la matriz del objeto.
      * @param {matrix} mat4 Matriz de modelado
    */
    applyMatrix(matrix){
        mat4.multiply(this.matrix, this.matrix, matrix);
        this.modified = true;
    }
    /**Redefine a la matriz recibida como la matriz del objeto.
      * @param {matrix} mat4 Matriz de modelado.
    */
    setMatrix(matrix){
        this.matrix = matrix;
        this.modified = true;
    }
    /**Agrega un hijo al contenedor.
      * @param {child} Contenedor3D Puede ser tambien un Objeto3D.
    */
    addChild(child){
        this.children.push(child);
    }
    /**Quita al hijo indicado
      * @param {child} Contenedor3D Puede ser tambien un Objeto3D.
    */
    removeChild(child){
        var index = this.children.indexOf(child);
        this.children.splice(index, 1);
    }
    /**********METODOS DE DIBUJADO*********/
    /**Define el shader program a utilizar por el GLProgram
     * @param {shaderProgram} glShaderProgram
    */
    setShaderProgram(shaderProgram){
        this.shaderProgram = shaderProgram;
        gl.useProgram(shaderProgram);
    }
    /**Configura la iluminacion. ALERT: Debe estar definido el Shader Program
      * @param {lightPosition} vec3 Ubicacion de la luz
      * @param {ambientColor} vec3 Color ambiente
      * @param {diffuseColor} vec3 Color difuso
    */
    setupLighting(lightPosition, ambientColor, diffuseColor){
        this.setupChildrenLighting(lightPosition, ambientColor, diffuseColor);

        gl.uniform1i(this.shaderProgram.useLightingUniform, true);
        //Define direccion
        gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        //Define ambient color
        gl.uniform3fv(this.shaderProgram.ambientColorUniform, ambientColor);
        //Define diffuse color
        gl.uniform3fv(this.shaderProgram.directionalColorUniform, diffuseColor);
    }
    /**Configura la iluminacion de los hijos
     * @param Idem setupLighting
    */
    setupChildrenLighting(lightPosition, ambientColor, diffuseColor){
        for (var i = 0; i < this.children.length; i++){
            var child = this.children[i];
            child.setupLighting(lightPosition, ambientColor, diffuseColor);
        }
    }
    /**Dibuja al objeto. Recibe la matriz de modelado base, la matriz de la camara
      *y la matriz de proyeccion.
      * @param {mMatrix} mat4 Matriz de modelado del padre.
      * @param {CameraMatrix} mat4 Matriz de camara
      * @param {pMatrix} mat4 Matriz de proyeccion
      * @param {parentMod} bool Indica si el padre fue modificado o no
    */
    draw(mMatrix, CameraMatrix, pMatrix, parentMod){
        //Se crea una matriz nueva para no modificar la matriz del padre
        var modelMatrix = mat4.create();
        if(this.modified || parentMod){
            mat4.multiply(modelMatrix, mMatrix, this.matrix);
            mat4.multiply(this.prevModelMatrix, modelMatrix, mat4.create());
        } else mat4.multiply(modelMatrix, this.prevModelMatrix, mat4.create());
        //Se hace un llamado al draw de los hijos, uno por uno.
        this._drawChildren(modelMatrix, CameraMatrix, pMatrix, parentMod || this.modified);
        this.modified = false;
    }
    /**Dibuja a los hijos
      * @param Idem draw.
    */
    _drawChildren(modelMatrix, CameraMatrix, pMatrix, parentMod){
        for (var i = 0; i < this.children.length; i++){
            var child = this.children[i];
            child.draw(modelMatrix, CameraMatrix, pMatrix, parentMod);
        }
    }
}
