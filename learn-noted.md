## 第一步 HTTP 请求总结
* 设计一个HTTP请求的类
* content type 是一个必要的字段，要有默认值
* body 是 KV 格式
* 不同的 content-type 影响 body 的格式

## 第二步 
* 在 Request 的构造器中收集必要的信息
* 设计一个 send 函数，把请求真实发送到服务器
* send 函数应该是异步的，所以返回 Promise

### 第三步
* 设计支持已有的 connection 或者自己新建 connection
* 收到数据传给 parser
* 根据 parser 的状态 resolve Promise

### 第四步
* Response 必须分段构造，所以我们要用一个 ResponseParser 来“装配”
* ResponseParser 分段处理 ResponseText，我们用状态机来分析文本的结构

### 第五步
<!-- TODO: Transfer-Encoding，有不同的值，有时间探究一下 -->
Response 的 body 可能根据 Transfer-Encoding 有不同的结构，因此我们会采用子 Parser 的结构来解决问题
以 TrunkedBodyParser 为例，我们同样用状态机来处理 body 的格式



##### Tips:
查看端口占用: sudo lsof -i tcp:8088
杀进程: sudo kill -9 PID