class OrbitCamera{

    constructor(){

        //Constructor de la camara orbital.
        this.center = [0.0, 0.0, 0.0];
        this.radius = 100;
        this.phi = 0.0;
        this.theta = 0.0;
    }

    setRadius(r){
        this.radius = r;
    }
    addRadius(r){
        this.radius+=r;
    }

    /*GETTERS*/
    getRadius(){
        return this.radius;
    }

    getPhi(){
        return this.phi;
    }

    getTheta(){
        return this.theta;
    }

    addTheta(t){
        this.theta += t;
    }

    addPhi(p){
        this.phi += p;
    }
}
