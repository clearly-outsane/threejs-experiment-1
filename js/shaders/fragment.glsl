varying float vNoise;

void main(){
    vec3 color1=vec3(.043,.275,.549);
    vec3 color2=vec3(.388,.204,.369);
    vec3 finalColor=2.*mix(color1,color2,.5*(vNoise+1.));
    
    gl_FragColor=vec4(finalColor,1.);
}