    attribute vec3 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;
    attribute float aID;

    uniform mat4 uViewMatrix;
    uniform mat4 uModelMatrix;
    uniform mat4 uPMatrix;
    uniform mat3 uNMatrix;

    uniform vec3 uAmbientColor;
    uniform vec3 uLightPosition;
    uniform vec3 uDirectionalColor;

    uniform bool uUseLighting;

    varying vec2 vTextureCoord;
    varying vec3 vLightWeighting;
    varying float vID;

    void main(void) {

		// Transformamos al v�rtice al espacio de la c�mara
		vec4 pos_camera_view = uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);

		// Transformamos al v�rtice al espacio de la proyecci�n
        gl_Position = uPMatrix * pos_camera_view;

        //se pasa el id
        vID = aID;

		// Coordenada de textura sin modifiaciones
        vTextureCoord = aTextureCoord;

		////////////////////////////////////////////
		// Calculos de la iluminaci�n
		vec3 light_dir =  uLightPosition - vec3( pos_camera_view );
		normalize(light_dir);
        if (!uUseLighting)
		{
            vLightWeighting = vec3(1.0, 1.0, 1.0);
        }
		else
		{
            vec3 transformedNormal = normalize(uNMatrix * aVertexNormal);
            float directionalLightWeighting = max(dot(transformedNormal, light_dir), 0.0);
            vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
        }
		////////////////////////////////////////////
    }