

class GenericShader{

    constructor(){
        this.shader = null;
        this.type = null;
    }

    //recibe una cadena que contiene el shader program
    setShaderCode(shader){
        this.shader = shader;
    }

    getShaderCode(){
        return this.shader;
    }

    getType(){
        return this.type;
    }


}


class GenericVertexShader extends GenericShader{

    constructor(){
        super();
        this.type = gl.VERTEX_SHADER;
    }

}

class GenericFragmentShader extends GenericShader{

    constructor(){
        super();
        this.type = gl.FRAGMENT_SHADER;
    }

}

