# 使用官方的 Nginx 镜像
FROM nginx:alpine

# 复制 HTML 和 CSS 文件到 Nginx 的 web 目录
COPY ./dist /usr/share/nginx/html/helix


# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]