class Container3D {
    constructor() {
        this.matrix = null;
        this.children = [];
        this.initMatrix();
    }

    initMatrix() {
        //inicializa la matriz como la identidad
        this.matrix = mat4.create();
        mat4.identity(this.matrix);
    }

    translate(x, y, z) {
        mat4.translate(this.matrix, this.matrix, vec3.fromValues(x, y, z));
    }

    scale(x, y, z) {
        mat4.scale(this.matrix, this.matrix, vec3.fromValues(x, y, z));
    }

    rotate(angulo, x, y, z) {
        mat4.rotate(this.matrix, this.matrix, angulo, vec3.fromValues(x, y, z));
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
    }

    applyMatrix(matrix) {
        //recibe una matriz la cual multiplica por la suya propia
        mat4.multiply(this.matrix, this.matrix, matrix);
    }

}