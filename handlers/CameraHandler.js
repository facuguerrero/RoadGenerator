var VEL_MOV = 1.0;

class CameraHandler{

    constructor(){

        //Matriz de vista
        this.viewMat = null;

        //orbital o libre
        this.mode = null;

        this.freeCam = new FreeCamera();
        this.orbitCam = new OrbitCamera();
        this.mouse = new Mouse();
    }

    /*
     // Configura los handlers para los elementos del html
     setHandlers (){


     // ACORDARSE DE HACER ESTO

     esto mejor hacerlo afuera

     var body = document.getElementById("my_body");
     var canvas = document.getElementById("my_canvas");

     body.handler = this;
     canvas.handler = this;


     }
     */

    setOrbit(){

        this.viewMat = mat4.create();
        mat4.identity(this.viewMat);

        //asumiendo que el body y canvas estan creados y son globales
        body.onkeydown = this.onKeyDownOrbit;
        canvas.onmousemove = this.onMouseMoveOrbit;
        canvas.onmousedown = this.onMousePressedOrbit;
        canvas.onmouseup = this.onMouseUnpressedOrbit;

        this.mode = "orbit";
        this.updateMatrix();

    }

    onKeyDownOrbit (e){
        switch (e.keyCode) {
            //descomentar cuando haya mas de una camara
            /*
             case 49:		// '1'
             this.handler.set_free();
             alert("Camara en modo libre");
             break;
             */
            //Caso en el que + aumenta el zoom
            case 107:

                //this.orbitCam.addOrbitRadius(-params.velocidad_mov/10.0);
                /*LINEA VIEJA. PARAMS ESTA DEFINIDO EN EL HTML, ES COMO UN STRUCT
                 CON VARIOS PARAMETROS DEFINIDOS POR DEFECTO. PARA PROBAR LO TIRO
                 ASI VILLERO PERO DESPUES DE ULTIMA HACEMOS ALGO MAS PROLIJO*/

                this.orbitCam.addRadius(-VEL_MOV);
                if (this.orbitCam.getRadius() < 0.0){
                    this.setRadius(0.0);
                }
                this.updateMatrix();
                break;
            case 109:		// '-'
                this.orbitCam.addRadius(VEL_MOV);
                if (this.orbitCam.getRadius < 0.0){
                    this.setRadius(0.0);
                }
                this.updateMatrix();
                break;
        }
    }

    onMouseMoveOrbit(e){

        //Se tiene que mover si el mouse esta apretado
        if (this.mouse.pressedState()) {

            /*Obtenemos el movimiento en X e Y realizado por el mouse
             restando la posicion anterior(la guardada), con la nueva del mouse*/
            var deltaX = this.mouse.getPosX() - e.clientX;
            var deltaY = this.mouse.getPosY() - e.clientY;

            this.mouse.setPosX(e.clientX);
            this.mouse.setPosY(e.clientY);

            this.orbitCam.addTheta(deltaX * this.mouse.getVel());
            this.orbitCam.addPhi(deltaY * this.mouse.getVel());

            if (this.orbitCam.getPhi() < -Math.PI/2)
                this.orbitCam.addPhi(-Math.PI/2);

            if (this.orbitCam.getPhi() > Math.PI/2)
                this.orbitCam.setPhi(Math.PI/2);

            this.updateMatrix();
        }

    }

    onMousePressedOrbit(e){
        this.mouse.setPosX(e.clientX);
        this.mouse.setPosY(e.clientY);
        this.mouse.pressedOn();
    }

    onMouseUnpressedOrbit(e) {
        this.mouse.pressedOff();
    }

    updateMatrix() {
        /*Funcion que actualiza la matriz.
         Cada vez que se la llama inicializa la matriz en la identidad
         porque las variables se actualizan por posicion y no por corrimiento.*/

        mat4.identity(this.viewMat);
        if (this.mode == "orbit") {
            //Solo trasladamos si agrandamos o achicamos el zoom
            var r = -this.orbitCam.getRadius();
            var vec_1 = vec3.create();
            vec_1 = vec3.fromValues(0.0,0.0,r);
            mat4.translate(this.viewMat, this.viewMat, vec_1);

            var p = this.orbitCam.getPhi();
            var vec_2 = vec3.create();
            vec_2 = vec3.fromValues(1.0, 0.0, 0.0)
            mat4.rotate(this.viewMat, this.viewMat, p , vec_2);

            var t = this.orbitCam.getTheta();
            var vec_3 = vec3.create();
            var vec_3 = vec3.fromValues(0.0, -1.0, 0.0);
            mat4.rotate(this.viewMat, this.viewMat, t, vec_3);
        }

        if(this.mode == "free"){
            //cuando hagamos la otra camara hay que implementar esta parte
        }
    }

}