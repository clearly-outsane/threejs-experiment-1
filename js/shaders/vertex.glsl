uniform float time;

void main(){
    vec3 pos=position;
    float PI=3.14159252;
    pos.z+=.1*sin((pos.x+time)*2.*PI);
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}