#!/usr/bin/env python3
"""Deterministic offscreen render of the shipped Silk GLSL. No screen capture.
Requires Python 3, moderngl, Pillow, numpy, and ffmpeg. See docs/silk.md.
"""
import argparse
import json
import subprocess
import time
import wave
from pathlib import Path

import moderngl
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'demo' / 'silk'
VERT = '''#version 330
in vec2 position;
void main(){gl_Position=vec4(position,0.,1.);}
'''
FONT = '/System/Library/Fonts/HelveticaNeue.ttc'
MONO = '/System/Library/Fonts/Menlo.ttc'
CREAM = '#eee7de'
MUTED = '#a49ba5'


def font(size, mono=False):
    return ImageFont.truetype(MONO if mono else FONT, size)


def terminal(size=(1600, 960), content=True):
    im = Image.new('RGBA', size, '#1c2021')
    if not content:
        return im
    d = ImageDraw.Draw(im)
    x, y = 75, 72
    rows = [
        ('~/ghostty-aurora  main', '#a39baf'),
        ('❯ bin/ghostty-aurora use silk', '#f0e9de'),
        ('Ghostty Aurora variant set to silk (silk.glsl).', '#bba6cf'),
        ('', CREAM),
        ('// A little atmosphere. A lot of focus.', '#999396'),
        ('const silk = {', '#e9e2d9'),
        ('  palette:   ["champagne", "lilac"],', '#c4accf'),
        ('  motion:    "slow & continuous",', '#d1bca3'),
        ('  rendering: "single pass",', '#b6c6c3'),
        ('  license:   "MIT",', '#c4accf'),
        ('};', '#e9e2d9'),
        ('', CREAM),
        ('❯ ', '#f0e9de'),
    ]
    for line, color in rows:
        d.text((x, y), line, font=font(27, True), fill=color)
        y += 49
    d.rectangle((x, y + 8, x + 15, y + 36), fill='#d3c6bd')
    return im


class Renderer:
    def __init__(self, variant='silk', size=(1600, 960)):
        self.ctx = moderngl.create_standalone_context(require=330)
        self.size = size
        self.buffer = self.ctx.buffer(np.array([-1,-1, 3,-1, -1,3], dtype='f4').tobytes())
        source = (ROOT / f'{variant}.glsl').read_text()
        self.program = self.ctx.program(vertex_shader=VERT, fragment_shader='''#version 330
uniform sampler2D iChannel0;
uniform vec3 iResolution;
uniform float iTime;
out vec4 color;
''' + source + '''\nvoid main(){mainImage(color,vec2(gl_FragCoord.x,iResolution.y-gl_FragCoord.y));}''')
        self.vao = self.ctx.simple_vertex_array(self.program, self.buffer, 'position')
        self.target = self.ctx.texture(size, 4)
        self.fbo = self.ctx.framebuffer([self.target])
        self.textures = []
        for content in (False, True):
            texture = self.ctx.texture(size, 4, terminal(size, content).tobytes())
            texture.filter = (moderngl.LINEAR, moderngl.LINEAR)
            texture.repeat_x = texture.repeat_y = False
            self.textures.append(texture)
        self.program['iResolution'].value = (*size, 1)
        self.program['iChannel0'].value = 0

    def draw(self, t, content=True):
        self.fbo.use()
        self.ctx.viewport = (0, 0, *self.size)
        self.textures[int(content)].use(0)
        self.program['iTime'].value = t
        self.vao.render(moderngl.TRIANGLES)

    def still(self, t, content=True):
        self.draw(t, content)
        return Image.frombytes('RGBA', self.size, self.fbo.read(components=4)).transpose(Image.Transpose.FLIP_TOP_BOTTOM)


def ease(x):
    x = max(0., min(1., x))
    return x*x*x*(x*(x*6-15)+10)


def overlay(scene, size):
    w,h = size
    portrait = h > w
    scale = w / 1920
    # Portrait is laid out independently, with a useful minimum type size.
    s = w / 1080 if portrait else scale
    im = Image.new('RGBA', size)
    d = ImageDraw.Draw(im)
    def txt(x,y,text,sz=24,color=CREAM,mono=False):
        d.text((int(x*s),int(y*s)),text,font=font(int(sz*s),mono),fill=color)
    def line(y):
        d.line((int(76*s),int(y*s),w-int(76*s),int(y*s)), fill='#514751', width=max(1,int(s)))
    if portrait:
        if scene == 0:
            txt(76,104,'GHOSTTY / ATMOSPHERES',21,MUTED,True)
            txt(66,210,'Silk.',184)
            txt(76,454,'A little atmosphere.',43)
            txt(76,511,'A lot of focus.',43)
            line(1175)
            txt(76,1214,'CHAMPAGNE + LILAC',20,MUTED,True)
        elif scene in (1,3):
            txt(76,90,'IN YOUR ELEMENT',20,MUTED,True)
            txt(76,145,'Room to focus.' if scene == 3 else 'Settle into the flow.',55)
            txt(76,1130,'Subtle motion. Readable text.',31)
            txt(76,1200,'SILK / GLSL SHADER PREVIEW',18,MUTED,True)
        elif scene == 2:
            txt(76,110,'A CLOSER LOOK',20,MUTED,True)
            txt(76,186,'Light,',91)
            txt(76,286,'woven into motion.',60)
            txt(76,1184,'Soft folds. Continuous movement.',27)
        else:
            txt(76,138,'MAKE YOURSELF AT HOME',20,MUTED,True)
            txt(66,242,'Silk.',184)
            txt(76,486,'A quieter kind of beautiful.',39)
            txt(76,1050,'FOR GHOSTTY',22,MUTED,True)
            txt(76,1106,'Open source. MIT licensed.',32)
            line(1195)
            txt(76,1230,'github.com/ya-nsh/ghostty-aurora',20,MUTED,True)
    else:
        if scene == 0:
            txt(110,100,'GHOSTTY / ATMOSPHERES',23,MUTED,True)
            txt(94,212,'Silk.',222)
            txt(110,523,'A little atmosphere.',49)
            txt(110,586,'A lot of focus.',49)
            line(936)
            txt(110,969,'01 / SILK',20,MUTED,True)
            txt(1430,969,'CHAMPAGNE + LILAC',20,MUTED,True)
        elif scene in (1,3):
            txt(110,42,'Room to focus.' if scene == 3 else 'Settle into the flow.',43)
            txt(110,1008,'SILK / GLSL SHADER PREVIEW',18,MUTED,True)
            txt(1410,1005,'Subtle motion. Readable text.',22,MUTED)
        elif scene == 2:
            txt(110,108,'A CLOSER LOOK',23,MUTED,True)
            txt(110,190,'Light, woven',87)
            txt(110,288,'into motion.',87)
            txt(110,925,'Soft folds. Continuous movement.',30)
        else:
            txt(110,116,'MAKE YOURSELF AT HOME',23,MUTED,True)
            txt(94,220,'Silk.',212)
            txt(110,524,'A quieter kind of beautiful.',47)
            txt(110,782,'FOR GHOSTTY / OPEN SOURCE / MIT',24,MUTED,True)
            line(929)
            txt(110,963,'github.com/ya-nsh/ghostty-aurora',25,MUTED,True)
    return im


COMPOSITOR = '''#version 330
uniform sampler2D field;
uniform sampler2D overlay;
uniform vec2 outputSize;
uniform vec4 windowRect;
uniform vec2 focus;
uniform float zoom;
uniform float framed;
uniform float overlayAlpha;
uniform float lift;
out vec4 outColor;
float rounded(vec2 p,vec2 halfSize,float r){vec2 q=abs(p)-halfSize+r;return length(max(q,0.))+min(max(q.x,q.y),0.)-r;}
void main(){
 vec2 p=vec2(gl_FragCoord.x,outputSize.y-gl_FragCoord.y);
 vec2 uv=p/outputSize;
 vec3 bg=vec3(.028,.025,.032)+.012*(1.-uv.y);
 vec2 coord=(p-windowRect.xy)/windowRect.zw;
 vec2 sampleUV=(coord-.5)/zoom+focus;
 vec3 silk=texture(field,vec2(sampleUV.x,1.-sampleUV.y)).rgb;
 float d=rounded(p-windowRect.xy-windowRect.zw*.5,windowRect.zw*.5,17.);
 if(framed>.5){
   float shadow=exp(-max(d,0.)*.035)*.5;
   bg*=1.-shadow;
   float mask=1.-smoothstep(-.8,.8,d);
   vec3 terminal=silk;
   if(p.y<windowRect.y+43.){
     terminal=vec3(.10,.105,.115);
     for(int i=0;i<3;i++){
       float circle=1.-smoothstep(5.5,6.5,length(p-(windowRect.xy+vec2(25.+float(i)*21.,22.))));
       vec3 dotColor=i==0?vec3(.88,.40,.39):i==1?vec3(.88,.68,.35):vec3(.39,.67,.47);
       terminal=mix(terminal,dotColor,circle*.8);
     }
   }
   bg=mix(bg,terminal,mask);
   float border=(1.-smoothstep(.0,1.2,abs(d)))*.22;
   bg+=border*vec3(.45,.38,.48);
 }else{
   bg=silk;
   // Editorial gradient belongs to the video, not to the shipped shader.
   bg*=mix(.36,1.,smoothstep(.02,.82,uv.x));
 }
 vec4 label=texture(overlay,uv);
 bg=mix(bg,label.rgb,label.a*overlayAlpha);
 outColor=vec4(bg*lift,1.);
}
'''


def soundtrack(path, duration=27):
    sr=48000
    t=np.arange(int(sr*duration))/sr
    audio=np.zeros((len(t),2),dtype=np.float64)
    # Original synthesized pad: no samples, third-party music, or voice.
    for j,freq in enumerate([130.8128,195.9977,246.9417,293.6648]):
        envelope=np.sin(np.pi*np.clip(t/duration,0,1))**1.4
        envelope*=.8+.2*np.sin(t*.4+j)
        for ch in range(2):
            detune=1+(-1 if ch==0 else 1)*.0012
            tone=np.sin(2*np.pi*freq*detune*t+.15*np.sin(t*.3+j))
            tone+=.14*np.sin(2*np.pi*freq*2*detune*t)
            audio[:,ch]+=tone*envelope*.026
    # Gentle tonal swells at the edits.
    for start in [4.5,10,16,22]:
        env=np.exp(-((t-start)/.50)**2)
        for ch in range(2):
            audio[:,ch]+=.012*env*np.sin(2*np.pi*(660*t+24*np.sin(t*.5+ch)))
    audio=np.clip(audio,-1,1)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((audio*32767).astype('<i2').tobytes())


def film(size=(1920,1080), snapshots=False):
    w,h=size
    portrait=h>w
    r=Renderer(size=(1080,800) if portrait else (1600,960))
    ctx=r.ctx
    out=ctx.texture(size,3)
    fbo=ctx.framebuffer([out])
    program=ctx.program(vertex_shader=VERT,fragment_shader=COMPOSITOR)
    vao=ctx.simple_vertex_array(program,r.buffer,'position')
    overlays=[]
    for i in range(5):
        tex=ctx.texture(size,4,overlay(i,size).tobytes())
        tex.filter=(moderngl.LINEAR,moderngl.LINEAR)
        overlays.append(tex)
    program['field'].value=0; program['overlay'].value=1
    program['outputSize'].value=size
    name='silk-twitter-portrait' if portrait else 'silk-twitter'
    if not snapshots:
        soundtrack(OUT/'silk-original-score.wav')
        command=['ffmpeg','-hide_banner','-loglevel','warning','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{w}x{h}','-framerate','60','-i','-', '-i',str(OUT/'silk-original-score.wav'),'-vf','vflip','-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-profile:v','high','-level:v','4.2','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-af','loudnorm=I=-20:TP=-2:LRA=9','-c:a','aac','-ar','48000','-b:a','192k','-movflags','+faststart','-shortest',str(OUT/f'{name}.mp4')]
        encoder=subprocess.Popen(command,stdin=subprocess.PIPE)
    bounds=[0,4.5,10,16,22,27]
    frames=[90,420,780,1140,1450] if snapshots else range(27*60)
    for frame in frames:
        t=frame/60
        scene=next(i for i in range(5) if bounds[i]<=t<bounds[i+1])
        local=t-bounds[scene]; duration=bounds[scene+1]-bounds[scene]
        progress=ease(local/duration)
        content=scene in (1,3)
        r.draw(t+12,content)
        fbo.use(); ctx.viewport=(0,0,w,h)
        r.target.use(0); overlays[scene].use(1)
        if content:
            if portrait:
                rect=(54,340,w-108,690)
            else:
                rect=(100,134,w-200,826)
            zoom=(1.08-.08*progress) if scene==1 or portrait else (1.24-.24*progress)
            # Anchor the camera at the top-left to keep text inside the window.
            focus=(.5/zoom,.5/zoom)
        else:
            rect=(0,0,w,h)
            zoom=(1.55+.30*progress) if scene==2 else (1.03+.09*progress)
            focus=(.59+.08*progress,.5) if scene==2 else (.5,.5)
        program['windowRect'].value=rect
        program['zoom'].value=zoom
        program['focus'].value=focus
        program['framed'].value=float(content)
        program['overlayAlpha'].value=ease(local/.65)*ease((duration-local)/.45)
        # Brief dip transitions with continuous underlying motion.
        program['lift'].value=(.08+.92*ease(min(local,duration-local)/.32)) if scene else (.82+.18*ease(local/.6))
        vao.render(moderngl.TRIANGLES)
        data=fbo.read(components=3,alignment=1)
        if snapshots:
            Image.frombytes('RGB',size,data).transpose(Image.Transpose.FLIP_TOP_BOTTOM).save(OUT/f'{name}-scene-{scene+1}.png')
        else:
            encoder.stdin.write(data)
            if frame%180==0: print(f'{name}: {frame/60:.0f}s / 27s',flush=True)
    if not snapshots:
        encoder.stdin.close()
        if encoder.wait()!=0: raise RuntimeError('ffmpeg failed')
        print(OUT/f'{name}.mp4',flush=True)


def benchmark():
    result={'note':'Offscreen OpenGL shader draw + GPU synchronization; not native Ghostty FPS.', 'measurements':[]}
    for size in [(1920,1080),(3840,2160)]:
        for variant in ['silk','silk-lite']:
            r=Renderer(variant,size)
            result['gpu']=r.ctx.info['GL_RENDERER']
            for i in range(45): r.draw(i/60)
            r.ctx.finish()
            samples=[]
            for i in range(180):
                start=time.perf_counter(); r.draw(i/60); r.ctx.finish()
                samples.append((time.perf_counter()-start)*1000)
            result['measurements'].append({'variant':variant,'resolution':list(size),'median_ms':round(float(np.median(samples)),3),'p95_ms':round(float(np.percentile(samples,95)),3)})
            r.ctx.release()
    (OUT/'performance.json').write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps(result,indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--stills',action='store_true')
    parser.add_argument('--portrait',action='store_true')
    parser.add_argument('--benchmark',action='store_true')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    if args.benchmark: benchmark()
    else:
        if args.stills:
            r=Renderer(); r.still(12).save(OUT/'silk-terminal.png'); r.still(12,False).save(OUT/'silk-detail.png'); r.ctx.release()
        film((1080,1350) if args.portrait else (1920,1080),args.stills)
