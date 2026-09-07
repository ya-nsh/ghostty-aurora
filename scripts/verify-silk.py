#!/usr/bin/env python3
"""Render-based checks for text color, light themes, alpha, motion, and build output."""
import importlib.util
from pathlib import Path
import numpy as np
import moderngl

root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('silk_renderer', root/'scripts/render-silk.py')
module=importlib.util.module_from_spec(spec); spec.loader.exec_module(module)

for variant in ['silk','silk-lite']:
    r=module.Renderer(variant,(640,400))
    texture=r.textures[1]
    # Include bright text, saturated ANSI colors, a light theme, and transparent pixels.
    values=[(240,233,222,255),(180,35,35,255),(35,180,35,255),(35,35,180,255),(247,247,247,255),(0,0,0,0)]
    for value in values:
        pixels=np.empty((400,640,4),dtype=np.uint8); pixels[:]=value
        texture.write(pixels.tobytes())
        result=np.asarray(r.still(4))
        assert np.max(np.abs(result.astype(int)-pixels.astype(int)))<=1,(variant,value,'modified protected input')
    pixels[:]=(28,32,33,255); texture.write(pixels.tobytes())
    first=np.asarray(r.still(0)); later=np.asarray(r.still(5))
    assert np.mean(np.abs(first.astype(float)-later.astype(float)))>1,(variant,'no visible motion')
    assert np.max(first[:,:,:3])<120,(variant,'background too bright')
    assert np.all(first[:,:,3]==255),(variant,'alpha changed')
    # Zero intensity must be an identity operation, including dark text.
    source=(root/f'{variant}.glsl').read_text()
    import re
    source=re.sub(r'const float AURORA_INTENSITY = [0-9.]+;', 'const float AURORA_INTENSITY = 0.0;',source)
    p=r.ctx.program(vertex_shader=module.VERT,fragment_shader='#version 330\nuniform sampler2D iChannel0; uniform vec3 iResolution; uniform float iTime; out vec4 color;\n'+source+'\nvoid main(){mainImage(color,vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y));}')
    rng=np.random.default_rng(5); pixels=rng.integers(0,256,(400,640,4),dtype=np.uint8)
    texture.write(pixels.tobytes());texture.use(0); r.fbo.use()
    p['iChannel0'].value=0;p['iResolution'].value=(640,400,1)
    if 'iTime' in p:p['iTime'].value=2
    vao=r.ctx.simple_vertex_array(p,r.buffer,'position');vao.render(moderngl.TRIANGLES)
    got=np.frombuffer(r.fbo.read(components=4),dtype=np.uint8).reshape(400,640,4)[::-1]
    assert np.max(np.abs(got.astype(int)-pixels.astype(int)))<=1,(variant,'zero intensity is not identity')
    print(f'{variant}: protected colors, light theme, alpha, animation, zero-intensity checks passed')
    r.ctx.release()

r=module.Renderer()
for file in sorted(root.glob('*.glsl')):
    source=file.read_text()
    assert not __import__('re').search(r'@[A-Z0-9_]+@',source),file
    p=r.ctx.program(vertex_shader=module.VERT,fragment_shader='#version 330\nuniform sampler2D iChannel0; uniform vec3 iResolution; uniform float iTime; uniform vec4 iDate; out vec4 color;\n'+source+'\nvoid main(){mainImage(color,gl_FragCoord.xy);}')
    p.release()
print('All generated GLSL variants compiled successfully')
