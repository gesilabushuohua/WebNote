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
   ssh-keygen -t rsa -C "xxxxxx@qq.com"
   
   在输入了路径后，会提示你输入提交项目时输入的验证密码，不输则表示不用密码

5. 查询公钥
   cat ~/.ssh/id_rsa.pub
   
6.复制公钥到账户设置密钥配置中

## 多账号
1、生成密钥命名区别开
ssh-keygen -t rsa -C "xxxxxx@qq.com" 生成密钥
输入保存 id_rsa_me 自定义命名

2、添加新ssh key
默认SSH只会读取id_rsa，所以为了让SSH识别新的私钥，需要将其添加到SSH agent
ssh-add ~/.ssh/id_rsa_me
如果报错：Could not open a connection to your authentication agent.无法连接到ssh agent
可执行ssh-agent bash命令后再执行ssh-add命
要用 git 工具， powershell 报错

3、查看.ssh文件中是否存在config文件
对config文件进行配置填写
```
Host mingyuan
    HostName gitlab.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/id_rsa_mingyuan
```

4、操作时
git clone gitlab.com/xxx.git 
中 gitlab.com 要替换成配置中的 Host  即 mingyuan/xxx.git

4、测试是否配置成功
ssh -T git@zc
git clone
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
