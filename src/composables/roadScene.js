// Topo "vivo": a foto do caminhão vira um travelling.
// O caminhão fica parado; a pista corre ao longo das retas que convergem no ponto de fuga,
// e a sombra e o reflexo dos faróis ficam presos ao caminhão (mapa de luz).
// Tudo em WebGL 1, com quatro texturas geradas a partir da mesma foto:
//   base  = foto com a logo aplicada  |  plate = pista sem o caminhão
//   alpha = recorte do caminhão       |  light = luz presa ao caminhão (1.0 = 64/255)

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uBase;
uniform sampler2D uPlate;
uniform sampler2D uAlpha;
uniform sampler2D uLight;
uniform vec2 uSrc;      // tamanho da foto (px)
uniform vec2 uVP;       // ponto de fuga (px da foto)
uniform vec2 uView;     // tamanho do canvas (px do dispositivo)
uniform vec2 uOrigin;   // px da foto no canto superior esquerdo do canvas
uniform float uScale;   // px do dispositivo por px da foto
uniform float uTime;
uniform float uSpeed;
uniform float uDrift;   // 1 = câmera respira; 0 = parado
uniform vec3 uSkyTop;

float mirror01(float u) { return 1.0 - abs(mod(u, 2.0) - 1.0); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y);
  vec2 cam = uDrift * vec2(
    sin(uTime * 0.21) * 5.0 + sin(uTime * 1.9) * 0.5,
    sin(uTime * 0.17) * 3.0 + sin(uTime * 2.7) * 0.4
  );
  vec2 p = uOrigin + frag / uScale + cam;
  vec2 uv = p / uSrc;
  vec3 base = texture2D(uBase, uv).rgb;
  vec3 col = base;

  if (p.y > uVP.y + 1.0) {
    // contas em milhares de px para não perder precisão
    vec2 P = p * 0.001;
    vec2 V = uVP * 0.001;
    vec2 S = uSrc * 0.001;
    float m = (P.y - V.y) / (P.x - V.x);
    float am = max(abs(m), 1e-4);
    float q = 1.0 / (V.x - P.x);
    float xmin = max(0.0, V.x - (S.y - V.y) / am);
    float qlo = 1.0 / (V.x - xmin);
    float qhi = 1.0 / (V.x - (S.x - 0.001));
    float span = qhi - qlo;
    float travel = fract(uSpeed * am * uTime / span * 0.5) * 2.0;
    float qs = qlo + span * mirror01((q - qlo) / span - travel);
    float xs = V.x - 1.0 / qs;
    float ys = V.y + m * (xs - V.x);
    vec3 plate = texture2D(uPlate, vec2(xs, ys) / S).rgb;
    vec3 light = texture2D(uLight, uv).rgb * (255.0 / 64.0);
    float w = smoothstep(uVP.y + 2.0, uVP.y + 40.0, p.y);
    col = mix(base, plate * light, w);
  }

  float a = texture2D(uAlpha, uv).r;
  col = mix(col, base, a);

  if (p.y < 0.0) {
    vec3 top = texture2D(uBase, vec2(uv.x, 0.001)).rgb;
    col = mix(top, uSkyTop, smoothstep(0.0, 520.0, -p.y));
  }

  float g = hash(frag + fract(uTime * 7.0) * 91.0) - 0.5;
  col += g * 0.03;
  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl, type, src) {
  const s = gl.createShader(type)
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s)
    gl.deleteShader(s)
    throw new Error(log)
  }
  return s
}

function texture(gl, unit, img) {
  const t = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, t)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return t
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{base, plate, alpha, light}} images  imagens já carregadas
 * @param {{src:{w,h}, vp:[x,y], speed:number, skyTop:[r,g,b]}} opts
 */
export function createRoadScene(canvas, images, opts) {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'low-power' })
  if (!gl) throw new Error('webgl indisponível')

  const prog = gl.createProgram()
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog))
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  const u = (n) => gl.getUniformLocation(prog, n)
  const tex = [
    texture(gl, 0, images.base),
    texture(gl, 1, images.plate),
    texture(gl, 2, images.alpha),
    texture(gl, 3, images.light),
  ]
  gl.uniform1i(u('uBase'), 0)
  gl.uniform1i(u('uPlate'), 1)
  gl.uniform1i(u('uAlpha'), 2)
  gl.uniform1i(u('uLight'), 3)
  gl.uniform2f(u('uSrc'), opts.src.w, opts.src.h)
  gl.uniform2f(u('uVP'), opts.vp[0], opts.vp[1])
  gl.uniform1f(u('uSpeed'), opts.speed)
  gl.uniform3f(u('uSkyTop'), ...opts.skyTop)

  const loc = {
    view: u('uView'), origin: u('uOrigin'), scale: u('uScale'), time: u('uTime'), drift: u('uDrift'),
  }

  return {
    gl,
    // framing = { scale, ox, oy } em px do dispositivo / px da foto
    render(time, framing, drift = 1) {
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(loc.view, canvas.width, canvas.height)
      gl.uniform2f(loc.origin, framing.ox, framing.oy)
      gl.uniform1f(loc.scale, framing.scale)
      gl.uniform1f(loc.time, time)
      gl.uniform1f(loc.drift, drift)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    },
    destroy() {
      tex.forEach((t) => gl.deleteTexture(t))
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      const lose = gl.getExtension('WEBGL_lose_context')
      if (lose) lose.loseContext()
    },
  }
}
