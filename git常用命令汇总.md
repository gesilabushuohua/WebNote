## 配置 git

1. 配置账号

   ```
   git config --global user.name "name"
   ```

2. 配置邮件
   ```
   git config --global user.email "email"
   ```

3. 配置密码缓存

   ```
   # 配置缓存，下次拉去代码不需密码
   git config --global credential.helper store
   # 清除缓存
   git config
   ```

4. 生成密钥
   ssh-keygen -t rsa -C "526861348@qq.com"

5. 查询公钥
   cat ~/.ssh/id_rsa.pub
   
6.复制公钥到账户设置密钥配置中

## 仓库


## 分支

```
# 查看目录所在分支
git branch -a

# 创建分支 xxx
git branch xxx

# 切换到分支 xxx
git checkout xxx

# 创建切换到分支
git checkout master -b xxx
```



## 开发
```
// 从远程仓库 clone 到本地
git clone url

// 检查当前文件修改状态
git status

// 将本地修改文件添加到本地 git 缓存中
git add .

// 推送修改到本地 git 库中
git commit -m ""

// 取回远程某个分支的更新，再与本地指定分支合并
git pull origin branchname
```

## 其他

git  查询命令配置

## 









































{}
