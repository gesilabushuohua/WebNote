# Mac MongoDB 安装指北

## MongoDB homebrew 安装

使用 Mac homebrew 安装 mongodb:
```shell
brew tap mongodb/brew
brew install mongodb-community@4.4
```
@ 符号之后的 4.4 是最新版本号

安装信息：

. 配置文件: /usr/local/etc/mongod.conf

. 日志文件路径: /usr/local/var/log/mongodb

. 数据存放路径: /usr/local/var/mongodb

如果没有上述文件，进入目录安装

Mongodb 命令
```shell
# 开启服务
brew services start mongodb-community@4.4

# 停止服务
brew services stop mongodb-community@4.4
```

## MongoDB Compass 安装

链接，点击下载完成即可 
https://www.mongodb.com/try/download/compass
