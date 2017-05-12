var VEL_MOV = 1.0;

class CameraHandler{

    constructor(){

        //maneja una matriz de vista global CameraMatrix

        //orbital o libre
        this.mode = null;

        freeCam = new FreeCamera();
        orbitCam = new OrbitCamera();
        mouse = new Mouse();
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

        //asumiendo que el body y canvas estan creados y son globales
        body.onkeydown = this.onKeyDownOrbit;
        canvas.onmousemove = this.onMouseMoveOrbit;
        canvas.onmousedown = this.onMousePressedOrbit;
        canvas.onmouseup = this.onMouseUnpressedOrbit;

        this.mode = "orbit";
        this.updateMatrix();

    }

    setHandler(){
    var body = document.getElementById("my_body");
    var canvas = document.getElementById("my_canvas");

    body.handler = this;
    canvas.handler = this;

    this.setOrbit();
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

                orbitCam.addRadius(-VEL_MOV);
                if (orbitCam.getRadius() < 0.0){
                    orbitCam.setRadius(0.0);
                }
                this.handler.updateMatrix();
                break;
            case 109:		// '-'
                orbitCam.addRadius(VEL_MOV);
                if (orbitCam.getRadius < 0.0){
                    orbitCam.setRadius(0.0);
                }
                this.handler.updateMatrix();
                break;
        }
    }

    onMouseMoveOrbit(e){
        //Se tiene que mover si el mouse esta apretado
        if (mouse.pressedState()) {

            /*Obtenemos el movimiento en X e Y realizado por el mouse
             restando la posicion anterior(la guardada), con la nueva del mouse*/
            var deltaX = mouse.getPosX() - e.clientX;
            var deltaY = mouse.getPosY() - e.clientY;

            mouse.setPosX(e.clientX);
            mouse.setPosY(e.clientY);

            orbitCam.addTheta(deltaX * mouse.getVel());
            orbitCam.addPhi(deltaY * mouse.getVel());

            if (orbitCam.getPhi() < -Math.PI/2)
                orbitCam.addPhi(-Math.PI/2);

            if (orbitCam.getPhi() > Math.PI/2)
                orbitCam.setPhi(Math.PI/2);

            this.handler.updateMatrix();
        }

    }

    onMousePressedOrbit(e){
        mouse.setPosX(e.clientX);
        mouse.setPosY(e.clientY);
        mouse.pressedOn();
    }

    onMouseUnpressedOrbit(e) {
        mouse.pressedOff();
    }

    updateMatrix() {
        /*Funcion que actualiza la matriz.
         Cada vez que se la llama inicializa la matriz en la identidad
         porque las variables se actualizan por posicion y no por corrimiento.*/

        mat4.identity(CameraMatrix);
        if (this.mode == "orbit") {
            //Solo trasladamos si agrandamos o achicamos el zoom
            var r = -orbitCam.getRadius();
            var vec_1 = vec3.create();
            vec_1 = vec3.fromValues(0.0,0.0,r);
            mat4.translate(CameraMatrix, CameraMatrix, vec_1);

            var p = orbitCam.getPhi();
            var vec_2 = vec3.create();
            vec_2 = vec3.fromValues(1.0, 0.0, 0.0);
            mat4.rotate(CameraMatrix, CameraMatrix, p , vec_2);

            var t = orbitCam.getTheta();
            var vec_3 = vec3.create();
            var vec_3 = vec3.fromValues(0.0, -1.0, 0.0);
            mat4.rotate(CameraMatrix, CameraMatrix, t, vec_3);
        }

        if(this.mode == "free"){
            //cuando hagamos la otra camara hay que implementar esta parte
        }
    }

}