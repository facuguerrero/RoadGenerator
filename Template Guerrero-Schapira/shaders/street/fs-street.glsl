    precision highp float;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;

    //TOMAMOS ID'S CRECIENTES COMENZANDO POR 0.0
    uniform sampler2D street;
    uniform sampler2D cross;
    uniform sampler2D vereda;
    uniform sampler2D pasto;
    uniform sampler2D asfalto;
    uniform sampler2D concreto;
    uniform sampler2D postes;

    varying float vID;

    void main(void) {
        vec4 textureColor;

        if(vID == 0.0){
           textureColor = texture2D(street, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 1.0){
           textureColor = texture2D(cross, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 2.0){
           textureColor = texture2D(vereda, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 3.0){
           //EL PASTO SE REPITE
           /*vec2 auxUV = vTextureCoord;
           auxUV.x = auxUV.x * 4.0;
           auxUV.y = auxUV.y * 4.0;
           y en vez de vec2 pasar aux*/
           textureColor = texture2D(pasto, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 4.0){
           textureColor = texture2D(asfalto, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 5.0){
           textureColor = texture2D(concreto, vec2(vTextureCoord.s, vTextureCoord.t));
        }
        else if(vID == 6.0){
           textureColor = texture2D(postes, vec2(vTextureCoord.s, vTextureCoord.t));
        }

        gl_FragColor = vec4(textureColor.rgb * vLightWeighting, textureColor.a);
    }