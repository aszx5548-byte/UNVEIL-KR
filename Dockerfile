# UNVEIL 배포 이미지
#
# 왜 이렇게 하나
#   빌드를 컨테이너 안에서 돌립니다. 그래야 "내 컴퓨터에서는 됐는데"가 없어지고,
#   프리렌더링(scripts/prerender.mjs)이 반드시 실행됩니다. 이 단계가 빠지면
#   크롤러에게 빈 페이지가 나갑니다.
#
#   결과물은 nginx 로 서빙합니다. 보안 헤더와 404.html 을 제대로 내보내기 위해서입니다.

# ── 1단계: 빌드 ────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# 의존성을 먼저 받으면, 소스만 바뀌었을 때 이 층을 다시 받지 않습니다.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# vite build → SSR 번들 → 프리렌더링 주입 순서로 돌아갑니다.
RUN npm run build

# 배포해도 되는 결과물인지 확인합니다. 어긋나면 여기서 빌드가 멈춥니다.
RUN node scripts/check-build.mjs

# ── 2단계: 서빙 ────────────────────────────────
FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/security-headers.conf /etc/nginx/security-headers.conf
COPY --from=build /app/dist /usr/share/nginx/html

# 설정이 틀렸으면 배포가 아니라 빌드에서 실패하게 합니다.
RUN nginx -t

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
