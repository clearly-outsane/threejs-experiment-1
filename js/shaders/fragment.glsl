varying float vNoise;
varying vec2 vUv;
uniform sampler2D oceanTexture;
uniform float time;

void main(){
    vec3 color1=vec3(.043,.275,.549);
    vec3 color2=vec3(.388,.204,.369);
    vec3 finalColor=2.*mix(color1,color2,.5*(vNoise+1.));
    
    vec2 newUV=vUv;
    newUV=vec2(newUV.x,newUV.y+.01*sin(newUV.x*10.+time));
    
    vec4 oceanView=texture2D(oceanTexture,newUV);
    
    gl_FragColor=vec4(finalColor,1.);
    
}