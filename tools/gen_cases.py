"""EJDER Studio: generate phone-case models in the same format as the existing ones.

For every model: 3D mesh (assets/atelier/<id>.js), studio blank (assets/blanks/<id>.webp),
catalogue photo (assets/<id>.webp), tint mask (assets/tints/<id>.png) and the print / camera-safe
areas for case-models.js. Geometry follows the conventions of the existing meshes: the case
height is 2 x 1.088 units, the studio photo is 480 x 332 with the case 298 px tall from y = 15.
Camera layouts are measured in mm from the top-left corner of the back (viewed from behind).
"""
import json, math, base64, sys, io, zlib
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage
import mapbox_earcut as earcut

ROOT = '/home/user/Vonsaweb-'
HH = 1.088                 # half height of every case mesh
PX = 298 / (2 * HH)        # studio photo pixels per mesh unit
TOP = 15                   # studio photo y of the case top
WALL_MM = 0.6              # case shell beyond the device on each side

def rr(cx, cy, hw, hh, r, seg=10):
    """Rounded rectangle (y up), counter-clockwise, with outward normals."""
    r = max(0.0, min(r, hw, hh))
    pts, nrm = [], []
    for k, (ox, oy, a0) in enumerate([(hw - r, hh - r, 0), (-hw + r, hh - r, 90), (-hw + r, -hh + r, 180), (hw - r, -hh + r, 270)]):
        for i in range(seg + 1):
            a = math.radians(a0 + 90 * i / seg)
            pts.append((cx + ox + r * math.cos(a), cy + oy + r * math.sin(a)))
            nrm.append((math.cos(a), math.sin(a)))
    return pts, nrm

def circle(cx, cy, rad, seg=40):
    pts = [(cx + rad * math.cos(2 * math.pi * i / seg), cy + rad * math.sin(2 * math.pi * i / seg)) for i in range(seg)]
    nrm = [(math.cos(2 * math.pi * i / seg), math.sin(2 * math.pi * i / seg)) for i in range(seg)]
    return pts, nrm

class Part:
    def __init__(self, mat, ink=False):
        self.mat, self.ink, self.v, self.i = mat, ink, [], []
    def vert(self, x, y, z, nx, ny, nz):
        self.v.append((x, y, z, nx, ny, nz) + ((0.0, 0.0) if self.ink else ()))
        return len(self.v) - 1
    def strip(self, ring_a, ring_b):
        """ring_a/b: lists of (x, y, z, nx, ny, nz) with equal length; closed loop."""
        a = [self.vert(*p) for p in ring_a]; b = [self.vert(*p) for p in ring_b]; n = len(a)
        for k in range(n):
            j = (k + 1) % n
            self.i += [a[k], b[k], b[j], a[k], b[j], a[j]]
    def face(self, outer, holes, z, nz):
        rings = [outer] + holes
        flat = np.array([p for ring in rings for p in ring], dtype=np.float64)
        ends = np.cumsum([len(r) for r in rings]).astype(np.uint32)
        tri = earcut.triangulate_float64(flat, ends)
        base = len(self.v)
        for x, y in flat:
            self.vert(x, y, z, 0.0, 0.0, nz)
        self.i += [base + int(t) for t in tri]
    def disc(self, cx, cy, rad, z, seg=32):
        c = self.vert(cx, cy, z, 0, 0, 1)
        ring = [self.vert(cx + rad * math.cos(2 * math.pi * k / seg), cy + rad * math.sin(2 * math.pi * k / seg), z, 0, 0, 1) for k in range(seg)]
        for k in range(seg):
            self.i += [c, ring[k], ring[(k + 1) % seg]]
    def box(self, x0, x1, y0, y1, z0, z1):
        for (n, quad) in [((1, 0, 0), [(x1, y0, z0), (x1, y1, z0), (x1, y1, z1), (x1, y0, z1)]),
                          ((-1, 0, 0), [(x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0)]),
                          ((0, 1, 0), [(x0, y1, z0), (x0, y1, z1), (x1, y1, z1), (x1, y1, z0)]),
                          ((0, -1, 0), [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)]),
                          ((0, 0, 1), [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)]),
                          ((0, 0, -1), [(x0, y0, z0), (x0, y1, z0), (x1, y1, z0), (x1, y0, z0)])]:
            ids = [self.vert(*p, *n) for p in quad]
            self.i += [ids[0], ids[1], ids[2], ids[0], ids[2], ids[3]]
    def encode(self):
        v = np.array(self.v, dtype=np.float64)
        q = np.clip(np.round(v * 4096), -32768, 32767).astype('<i2')
        idx = np.array(self.i, dtype='<u2')
        assert len(self.v) < 65536
        return {"m": self.mat, "g": "fixed", "ink": self.ink, "cloth": False,
                "v": base64.b64encode(q.tobytes()).decode(), "i": base64.b64encode(idx.tobytes()).decode()}

def geometry(m):
    W, H, D = m['dims']
    mpu = (H + 2 * WALL_MM) / (2 * HH)           # mm per mesh unit
    hw = HH * (W + 2 * WALL_MM) / (H + 2 * WALL_MM)
    t = (D + 2.6) / 2 / mpu                       # half depth incl. shell
    R = (m['corner'] + WALL_MM) / mpu
    def ux(x): return -hw + (x + WALL_MM) / mpu
    def uy(y): return HH - (y + WALL_MM) / mpu
    def us(s): return s / mpu
    holes = []
    for h in m['holes']:
        if h[0] == 'rr':
            _, x, y, w, hh_, r = h
            holes.append(rr(ux(x + w / 2), uy(y + hh_ / 2), us(w / 2), us(hh_ / 2), us(r), seg=10))
        else:
            _, cx, cy, d = h
            holes.append(circle(ux(cx), uy(cy), us(d / 2)))
    lenses = [(ux(cx), uy(cy), us(d / 2)) for cx, cy, d in m['lenses']]
    dots = [(kind, ux(cx), uy(cy), us(d / 2)) for kind, cx, cy, d in m.get('dots', [])]
    return dict(W=W, H=H, D=D, mpu=mpu, hw=hw, t=t, R=R, holes=holes, lenses=lenses, dots=dots, ux=ux, uy=uy, us=us)

def mesh(m):
    g = geometry(m); hw, t, R = g['hw'], g['t'], g['R']
    bev, lipw, liph, floor = 0.007, 0.014, 0.016, t - 0.026
    parts = []
    holes = [p for p, _ in g['holes']]
    # 1. printable back with the camera openings
    back = Part('body', ink=True)
    outer_in, _ = rr(0, 0, hw - bev, HH - bev, R - bev)
    back.face(outer_in, holes, t, 1.0)
    parts.append(back)
    # 2. outer walls with a soft bevel on both edges
    walls = Part('body')
    o_in, n_in = rr(0, 0, hw - bev, HH - bev, R - bev)
    o, n = rr(0, 0, hw, HH, R)
    r0 = [(x, y, t, nx * .6, ny * .6, .8) for (x, y), (nx, ny) in zip(o_in, n_in)]
    r1 = [(x, y, t - bev, nx, ny, 0) for (x, y), (nx, ny) in zip(o, n)]
    r2 = [(x, y, -t + bev, nx, ny, 0) for (x, y), (nx, ny) in zip(o, n)]
    r3 = [(x, y, -t, nx * .6, ny * .6, -.8) for (x, y), (nx, ny) in zip(o_in, n_in)]
    walls.strip(r0, r1); walls.strip(r1, r2); walls.strip(r2, r3)
    parts.append(walls)
    # 3. front lip around the screen opening
    rim = Part('body')
    scr, scr_n = rr(0, 0, hw - 0.05, HH - 0.05, max(0.01, R - 0.035))
    rim.face(o_in, [scr], -t, -1.0)
    parts.append(rim)
    # 4. inner walls and floor seen through the screen opening
    inner = Part('inner')
    inner.strip([(x, y, -t, -nx, -ny, 0) for (x, y), (nx, ny) in zip(scr, scr_n)], [(x, y, floor, -nx, -ny, 0) for (x, y), (nx, ny) in zip(scr, scr_n)])
    parts.append(inner)
    fl = Part('inner')
    fl.face(scr, holes, floor, -1.0)
    parts.append(fl)
    # 5. camera openings: hole walls and the raised protective lip
    for pts, nrm in g['holes']:
        hw_ = Part('inner')
        hw_.strip([(x, y, t + liph, -nx, -ny, 0) for (x, y), (nx, ny) in zip(pts, nrm)], [(x, y, floor, -nx, -ny, 0) for (x, y), (nx, ny) in zip(pts, nrm)])
        parts.append(hw_)
        lip = Part('body')
        outer_l = [(x + nx * lipw, y + ny * lipw) for (x, y), (nx, ny) in zip(pts, nrm)]
        lip.face(outer_l, [pts], t + liph, 1.0)
        lip.strip([(x, y, t + liph, nx * .5, ny * .5, .85) for (x, y), (nx, ny) in zip(outer_l, nrm)], [(x, y, t, nx, ny, 0) for (x, y), (nx, ny) in zip(outer_l, nrm)])
        parts.append(lip)
        # phone camera plateau visible inside the opening
        plate = Part('camera')
        shrink = [(x - nx * .002, y - ny * .002) for (x, y), (nx, ny) in zip(pts, nrm)]
        plate.face(shrink, [], t + 0.004, 1.0)
        parts.append(plate)
    # 6. lenses: housing, glass and highlight
    for cx, cy, rad in g['lenses']:
        ring = Part('camera'); z0, z1 = t + 0.004, t + 0.013
        c, cn = circle(cx, cy, rad * 1.18, 36)
        ring.strip([(x, y, z1, nx * .4, ny * .4, .9) for (x, y), (nx, ny) in zip(c, cn)], [(x, y, z0, nx, ny, 0) for (x, y), (nx, ny) in zip(c, cn)])
        ring.disc(cx, cy, rad * 1.18, z1, 36)
        parts.append(ring)
        lens = Part('lens'); lens.disc(cx, cy, rad * .86, z1 + 0.001, 36); parts.append(lens)
        glint = Part('glint'); glint.disc(cx - rad * .3, cy + rad * .3, rad * .16, z1 + 0.002, 16); parts.append(glint)
    for kind, cx, cy, rad in g['dots']:
        p = Part('flash' if kind == 'flash' else 'camera'); p.disc(cx, cy, rad, t + 0.006, 24); parts.append(p)
    # 7. button covers on the sides
    btn = Part('body')
    for side, y0, y1 in m['buttons']:
        x0, x1 = (hw - 0.002, hw + 0.016) if side == 'r' else (-hw - 0.016, -hw + 0.002)
        btn.box(x0, x1, g['uy'](y1), g['uy'](y0), -t * .55, t * .25)
    parts.append(btn)
    data = {"color": "#efe4d4", "parts": [p.encode() for p in parts], "dimensions": m['dims']}
    return 'EJDERMeshes["%s"]=%s;' % (m['id'], json.dumps(data, separators=(',', ':')))

# ---------------------------------------------------------------- studio images
S = 2                                   # blanks are stored at 960 x 664
SS = 4                                  # supersampling for anti-aliased masks
def to_px(g, x, y): return (S * (240 + x * PX), S * (TOP + (HH - y) * PX))

def poly_mask(size, polys, scale=SS):
    im = Image.new('L', (size[0] * scale, size[1] * scale), 0); d = ImageDraw.Draw(im)
    for p in polys:
        d.polygon([(x * scale, y * scale) for x, y in p], fill=255)
    return np.asarray(im.resize(size, Image.LANCZOS), dtype=np.float32) / 255

def background():
    """Stage of the existing studio photos with the S24 case painted out."""
    b = np.asarray(Image.open(ROOT + '/assets/blanks/case-s24.webp').convert('RGB'), dtype=np.float32).copy()
    x0, x1 = 300, 660
    for y in range(b.shape[0]):
        a, c = b[y, x0 - 1], b[y, x1 + 1]
        t = np.linspace(0, 1, x1 - x0 + 1)[:, None]
        b[y, x0:x1 + 1] = a * (1 - t) + c * t
    blur = ndimage.gaussian_filter(b, sigma=(4, 4, 0))
    region = np.zeros(b.shape[:2], np.float32); region[:, x0 - 8:x1 + 9] = 1
    region = ndimage.gaussian_filter(region, 6)[..., None]
    b = b * (1 - region) + blur * region
    # restore the warm floor glow below the product
    yy, xx = np.mgrid[0:b.shape[0], 0:b.shape[1]]
    glow = np.exp(-(((xx - 480) / 230) ** 2 + ((yy - 640) / 34) ** 2))[..., None]
    b = b * (1 - .55 * glow) + np.array([128, 78, 66], np.float32) * .55 * glow
    return b

def blank_and_mask(m, bg):
    g = geometry(m); hw, R = g['hw'], g['R']
    w, h = 960, 664
    outer, _ = rr(0, 0, hw, HH, R, seg=24)
    body = poly_mask((w, h), [[to_px(g, x, y) for x, y in outer]])
    hole_px = [[to_px(g, x, y) for x, y in pts] for pts, _ in g['holes']]
    holes = poly_mask((w, h), hole_px)
    lip_px = [[to_px(g, x + nx * .014, y + ny * .014) for (x, y), (nx, ny) in zip(pts, nrm)] for pts, nrm in g['holes']]
    lips = np.clip(poly_mask((w, h), lip_px) - holes, 0, 1)
    rng = np.random.default_rng(zlib.crc32(m["id"].encode()))
    # material lighting (1.0 = base colour)
    inside = ndimage.distance_transform_edt(body > .5).astype(np.float32)
    gy, gx = np.gradient(ndimage.gaussian_filter(inside, 1.2))
    norm = np.hypot(gx, gy) + 1e-6; nx, ny = -gx / norm, -gy / norm          # outward edge normal
    E = 11.0; edge = np.clip(1 - inside / E, 0, 1)
    light = (-.62 * nx - .78 * ny)                                           # light from top-left
    yy, xx = np.mgrid[0:h, 0:w]
    shade = 1 + .018 * (1 - yy / h) - .012 * (xx - 480) / 160
    shade += .13 * edge ** 1.6 * light - .10 * edge ** 3
    noise = ndimage.gaussian_filter(rng.normal(0, 1, (h, w)).astype(np.float32), .9) * .022
    shade += noise
    shade *= .86 + .14 * np.clip(inside / 2.2, 0, 1)
    # raised camera lips: bevel highlight and a soft shadow towards bottom-right
    hd = ndimage.distance_transform_edt(holes < .5).astype(np.float32)
    hgy, hgx = np.gradient(ndimage.gaussian_filter(hd, 1.0)); hn = np.hypot(hgx, hgy) + 1e-6
    lipzone = np.clip(1 - hd / (S * .014 * PX * 1.0), 0, 1) * (holes < .5)
    shade += .10 * lipzone * (-.62 * (-hgx / hn) - .78 * (-hgy / hn)) * -1
    sh = ndimage.gaussian_filter(np.roll(np.roll(holes, 5, 0), 4, 1), 4)
    shade -= .07 * sh * (holes < .5) * (1 - lipzone)
    base = np.array([217, 209, 200], np.float32)
    case_rgb = np.clip(base * shade[..., None], 0, 255)
    # phone camera seen through the openings
    cam = np.zeros((h, w, 3), np.float32) + np.array([38, 40, 47], np.float32)
    cam *= (1.05 - .25 * (yy - yy.min()) / h)[..., None]
    for cx, cy, rad in g['lenses']:
        px_, py_ = to_px(g, cx, cy); rp = rad * PX * S
        d = np.hypot(xx - px_, yy - py_)
        housing = np.clip((rp * 1.18 - d) + .5, 0, 1)
        ringc = np.array([58, 61, 70], np.float32) * (1.1 - .35 * np.clip((yy - py_ + rp) / (2.4 * rp), 0, 1))[..., None]
        cam = cam * (1 - housing[..., None]) + ringc * housing[..., None]
        glass = np.clip((rp * .86 - d) + .5, 0, 1)
        g2 = np.clip(d / (rp * .86), 0, 1)
        glassc = np.stack([10 + 18 * g2, 16 + 22 * g2, 34 + 36 * g2], -1)
        cam = cam * (1 - glass[..., None]) + glassc * glass[..., None]
        inner = np.clip((rp * .38 - d) + .5, 0, 1)[..., None]
        cam = cam * (1 - inner * .6) + np.array([6, 8, 16], np.float32) * inner * .6
        gl = np.exp(-(((xx - (px_ - rp * .32)) ** 2 + (yy - (py_ - rp * .32)) ** 2) / (2 * (rp * .14) ** 2)))[..., None]
        cam = cam + (np.array([235, 240, 255], np.float32) - cam) * gl * .8
    for kind, cx, cy, rad in g['dots']:
        px_, py_ = to_px(g, cx, cy); rp = rad * PX * S
        d = np.hypot(xx - px_, yy - py_); a = np.clip((rp - d) + .5, 0, 1)[..., None]
        col = np.array([232, 223, 199], np.float32) if kind == 'flash' else np.array([18, 18, 22], np.float32)
        if kind == 'flash':
            col = col * (1 - .25 * np.clip(d / rp, 0, 1))[..., None]
        cam = cam * (1 - a) + col * a
    hole_shadow = ndimage.gaussian_filter((holes > .5).astype(np.float32), 2)
    cam *= (1 - .35 * np.clip(1 - ndimage.distance_transform_edt(holes > .5) / (S * 3), 0, 1))[..., None]
    # compose: stage, drop shadow, case, camera
    out = bg.copy()
    shadow = ndimage.gaussian_filter(np.roll(body, 10, 0), 9)[..., None]
    out = out * (1 - .55 * shadow)
    a = body[..., None]
    out = out * (1 - a) + case_rgb * a
    hm = (holes * body)[..., None]
    out = out * (1 - hm) + cam * hm
    blank = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB')
    # tint mask at 480 x 332: grey = lighting (128 = chosen colour), clear over openings and lips
    tone = np.clip(128 * shade, 0, 255)
    alpha = np.clip(body - holes - lips, 0, 1) * 255
    mask = np.dstack([tone, tone, tone, alpha]).astype(np.uint8)
    mask = Image.fromarray(mask, 'RGBA').resize((480, 332), Image.LANCZOS)
    return blank, mask

def areas(m):
    g = geometry(m); hw = g['hw']
    wc = 2 * hw * PX; x0 = 240 - wc / 2
    full = [round(x0 - 3, 1), 15.0, round(wc + 6, 1), 298.0]
    lowest = max(TOP + (HH - min(y for x, y in pts)) * PX for pts, _ in g['holes'])
    top = round(lowest + 26)
    prn = [round(x0 + 16), top, round(wc - 32), 294 - top]
    return prn, full

def main(spec_path, only=None):
    models = json.load(open(spec_path))
    bg = background()
    out = []
    for m in models:
        if only and m['id'] not in only:
            continue
        open(f"{ROOT}/assets/atelier/{m['id']}.js", 'w').write(mesh(m))
        blank, mask = blank_and_mask(m, bg)
        blank.save(f"{ROOT}/assets/blanks/{m['id']}.webp", 'WEBP', quality=84, method=6)
        blank.save(f"{ROOT}/assets/{m['id']}.webp", 'WEBP', quality=84, method=6)
        mask.save(f"{ROOT}/assets/tints/{m['id']}.png", optimize=True)
        prn, full = areas(m)
        out.append({"id": m['id'], "print": prn, "fullPrint": full, "deviceMm": [m['dims'][0], m['dims'][1], m['dims'][2]]})
        print(m['id'], prn, full, file=sys.stderr)
    json.dump(out, open(spec_path.replace('.json', '-areas.json'), 'w'), indent=1)

if __name__ == '__main__':
    main(sys.argv[1], set(sys.argv[2:]) or None)
