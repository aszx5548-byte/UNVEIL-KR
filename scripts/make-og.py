# -*- coding: utf-8 -*-
"""링크 미리보기(OG) 이미지를 1200x630 으로 다시 맞춥니다.

왜 필요한가
  카카오톡·페이스북 등의 링크 카드는 가로:세로 = 1.91:1 을 씁니다.
  정사각형 원본을 그대로 올리면 위아래가 잘려 프레임과 여백이 망가집니다.

무엇을 하는가
  원본에서 글자 덩어리(UNVEIL + 구분선 + 한글 문구)만 떼어내,
  같은 색의 새 1200x630 바탕에 프레임을 다시 그려 얹습니다.
  디자인은 그대로 두고 비율만 바꾸는 방식입니다.

  PNG 원본은 1.2~1.4MB 라 링크 카드용으로 무겁습니다. JPEG 으로 내보냅니다.

다시 만들려면
  python scripts/make-og.py
"""
import os
from PIL import Image, ImageDraw

SRC = 'public/images'
OUT = 'public/images'

# 원본 → 내보낼 이름. 한글 파일명은 주소에 들어가면 인코딩이 지저분해져
# 영문으로 바꿉니다.
JOBS = [
    ('무료사주음양오행.png', 'og-saju.jpg'),
    ('무료별자리원석.png', 'og-zodiac.jpg'),
    ('월별탄생석안내.png', 'og-birthstone.jpg'),
]

W, H = 1200, 630
FRAME_INSET = 26      # 바깥에서 프레임까지
FRAME_RADIUS = 26
FRAME_WIDTH = 3
TEXT_MAX_W = 0.70     # 글자 덩어리가 차지할 최대 가로 비율
TEXT_MAX_H = 0.56     # 최대 세로 비율


def is_gold(p):
    r, g, b = p[:3]
    return r > 110 and g > 80 and r - b > 45


def text_bbox(im, inset):
    """프레임 안쪽에서 글자만의 바운딩 박스를 찾습니다.
    프레임 선을 포함하지 않도록 안쪽으로 충분히 들어가서 훑습니다."""
    w, h = im.size
    pad = inset + max(6, int(min(w, h) * 0.02))
    px = im.load()
    minx, miny, maxx, maxy = w, h, 0, 0
    step = 2
    for y in range(pad, h - pad, step):
        for x in range(pad, w - pad, step):
            if is_gold(px[x, y]):
                if x < minx: minx = x
                if y < miny: miny = y
                if x > maxx: maxx = x
                if y > maxy: maxy = y
    if maxx <= minx:
        raise SystemExit('글자를 찾지 못했습니다')
    return minx, miny, maxx, maxy


def frame_inset_of(im):
    """프레임 선이 바깥에서 몇 px 안쪽인지 찾습니다."""
    w, h = im.size
    px = im.load()
    y = h // 2
    for x in range(0, w // 3):
        if is_gold(px[x, y]):
            return x
    return int(w * 0.03)


def gradient(top, bottom):
    """원본의 위·아래 배경색으로 세로 그라데이션을 만듭니다."""
    g = Image.new('RGB', (1, H))
    d = g.load()
    for y in range(H):
        t = y / (H - 1)
        d[0, y] = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
    return g.resize((W, H), Image.BICUBIC)


for src_name, out_name in JOBS:
    src = os.path.join(SRC, src_name)
    if not os.path.exists(src):
        print('  건너뜀 (없음): %s' % src_name)
        continue

    im = Image.open(src).convert('RGB')
    ow, oh = im.size
    px = im.load()

    inset = frame_inset_of(im)
    bx0, by0, bx1, by1 = text_bbox(im, inset)

    # 배경색과 프레임색을 원본에서 뽑습니다.
    top_bg = px[ow // 2, inset + 12]
    bot_bg = px[ow // 2, oh - inset - 12]
    gold = px[inset + FRAME_WIDTH // 2, oh // 2]

    # 글자 덩어리를 여유 없이 잘라냅니다.
    block = im.crop((bx0, by0, bx1 + 1, by1 + 1))

    # 새 바탕
    canvas = gradient(top_bg, bot_bg)

    # 글자 덩어리를 새 규격에 맞춰 축소
    scale = min(W * TEXT_MAX_W / block.width, H * TEXT_MAX_H / block.height)
    nb = block.resize((max(1, round(block.width * scale)),
                       max(1, round(block.height * scale))), Image.LANCZOS)

    # 글자만 남기고 배경은 완전히 투명하게 만듭니다.
    #
    # 조각의 배경색과 비교하는 방식은 미세한 색 차이 때문에 글자 둘레에
    # 옅은 사각형 자국이 남습니다. 바탕이 아주 어둡고(luma 약 16)
    # 글자는 밝은 금색(luma 약 160)이라, 밝기로 가르면 깨끗하게 분리됩니다.
    # 가장자리는 중간값이 되어 안티에일리어싱도 그대로 살아납니다.
    LO, HI = 24.0, 120.0
    mask = Image.new('L', nb.size)
    mp = mask.load()
    np_ = nb.load()
    for y in range(nb.height):
        for x in range(nb.width):
            r, g, b = np_[x, y]
            luma = 0.299 * r + 0.587 * g + 0.114 * b
            a = (luma - LO) / (HI - LO)
            mp[x, y] = 0 if a <= 0 else (255 if a >= 1 else int(a * 255))

    ox = (W - nb.width) // 2
    oy = (H - nb.height) // 2
    canvas.paste(nb, (ox, oy), mask)

    # 프레임 다시 그리기
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle(
        [FRAME_INSET, FRAME_INSET, W - FRAME_INSET - 1, H - FRAME_INSET - 1],
        radius=FRAME_RADIUS, outline=gold, width=FRAME_WIDTH,
    )

    dst = os.path.join(OUT, out_name)
    canvas.save(dst, 'JPEG', quality=90, optimize=True, progressive=True)
    print('  %-22s -> %-20s %dx%d  %d KB (원본 %d KB)'
          % (src_name, out_name, W, H,
             os.path.getsize(dst) // 1024, os.path.getsize(src) // 1024))
