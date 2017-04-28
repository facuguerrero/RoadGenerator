class Container3D {
    constructor() {
        this.matrix = null;
        this.children = [];
        this.initMatrix();
        this.shaderProgram = null;
        this.modified = false;
        this.prevModelMatrix= null;
    }

    initMatrix() {
        //inicializa la matriz como la identidad.
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
        initMatrix();
        this.modified = true;
    }

    applyMatrix(matrix) {
        //recibe una matriz la cual multiplica por la suya propia
        mat4.multiply(this.matrix, this.matrix, matrix);
        this.modified = true;
    }

    setShaderProgram(shaderProgram){
        //recibe el shader a utilizar
        this.shaderProgram = shaderProgram;
        gl.useProgram(shaderProgram);
    }

    setupLighting(lightPosition, ambientColor, diffuseColor){
        // Configuración de la luz
        // Se inicializan las variables asociadas con la Iluminación
        this.setupChildrenLighting(lightPosition, ambientColor, diffuseColor);

        gl.uniform1i(this.shaderProgram.useLightingUniform, true);
        //Define direccion
        gl.uniform3fv(this.shaderProgram.lightingDirectionUniform, lightPosition);
        //Define ambient color
        gl.uniform3fv(this.shaderProgram.ambientColorUniform, ambientColor);
        //Define diffuse color
        gl.uniform3fv(this.shaderProgram.directionalColorUniform, diffuseColor);
    }

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
