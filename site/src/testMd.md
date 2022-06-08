# HTTP

### URL和URI

> ###### URL(统一资源定位符)是指访问网页的地址如``www.baidu.com``是URI的子集

> URI(统一资源标识符)是指标识的某一处互联网资源，习惯上将URI叫做URL如:``http://www.xzxx.com/xxx/xxx.text``

绝对URI的格式:

``http://(协议名)user:pass(登录信息)@www.example.com(服务器地址):80(服务器端口号)/dist/index.html(文件路径)?name=zzy(查询字段)``

如: ``mongodb://kczssd:*****@47.112.141.xxx:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false``

#### URI编码

URI 只能使用`ASCII`, ASCII 之外的字符是不支持显示的，而且还有一部分符号是界定符，如果不加以处理就会导致解析出错。

因此，URI 引入了`编码`机制，将所有**非 ASCII 码字符**（中文）和**界定符**转为十六进制字节值，然后在前面加个`%`。

如，空格被转义成了`%20`。

### HTTP报文

---

> 请求报文是由**请求方法**(GET、PUT...)、**请求URI**、**协议版本**、可选的请**求首部字段**和**内容实体**构成。
>
> 响应报文由**协议版本**、**状态码**、**解释短语**、**首部字段**、**实体主体**构成。

1. 组成(请求报文，响应报文)
   1. 报文首部
      * 请求行----方法、URI、HTTP版本
      * 状态行----状态码、原因短语、HTTP版本
      * 首部字段----通用首部、请求首部、响应首部、实体首部
        * key-value不带空格_、不区分大小写
      * Cookie
   2. 空行
   3. 报文主体

> 请求报文

```http
POST /login HTTP/1.1
Host: 47.112.141.xxx:8848
Proxy-Connection: keep-alive
Content-Length: 56
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56
Content-Type: application/json
Accept: */*
Origin: http://47.112.141.200:8848
Referer: http://47.112.141.200:8848/
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6

{"name":"郑志宇","code":"41714831","remember":true}
```

---

> 响应报文

```http
HTTP/1.1 200 OK
Content-Length: 33
Connection: keep-alive
Content-Type: application/json; charset=utf-8
Date: Wed, 12 May 2021 14:40:59 GMT
Keep-Alive: timeout=4
Proxy-Connection: keep-alive
Cookie: koa.sess=eyJpc0xvZ2luIjp0cnVlLCJfZXhwaXJlIjoxNjIwOTE2ODU5MTY4LCJfbWF4QWdlIjo4NjQwMDAwMH0=; path=/; expires=Thu, 13 May 2021 14:40:59 GMT; httponly

{"status":10000,"info":"success"}
```

#### 请求方法

`http/1.1`规定了以下请求方法(注意，都是大写):

- GET: 通常用来获取资源
- HEAD: 获取资源的元信息
- POST: 提交数据，即上传数据
- PUT: 修改数据
- DELETE: 删除资源(几乎用不到)
- CONNECT: 建立连接隧道，用于代理服务器
- OPTIONS: 列出可对资源实行的请求方法，用来跨域请求
- TRACE: 追踪请求-响应的传输路径

GET和POST差异：

1. GET请求会被浏览器主动缓存，存在history中，POST不会
2. GET只能进行URL编码，只接收ASCII字符，POST没有限制
3. GET参数放在URL中，POST放请求体，相对安全一点
4. *GET会通过TCP把报文一次发送出去，POST会分两个TCP数据包，先发header若服务器响应100，再发送body部分（部分浏览器有差异）*

### HTTP状态码

> 服务端描述返回的请求结果

| 状态码 |                         意义                         |
| :----: | :--------------------------------------------------: |
|  1xx   |              协议中间状态，等待后续操作              |
|  101   |              服务器同意变更HTTP至WebSocket              |
|  2××   |               **请求被服务端正常响应**               |
|  204   |       正常处理，但返回的报文中不包含实体的主体       |
|  206   |                   成功处理范围请求                   |
|  3××   | **浏览器需要执行某些特殊操作以正确处理请求(重定向)** |
|  301   |      永久性重定向，请求的资源已被分配了新的URI       |
|  302   |      临时性重定向，请求的资源临时被分配新的URI       |
|  303   |          与302类似，但明确采用GET来获取资源          |
|  304   |       资源已找到，但不符合条件，不包含响应主体       |
|  307   |                  302禁止POST变为GET                  |
|  4××   |              **客户端是发生错误的所在**              |
|  400   |                请求报文中存在语法错误                |
|  401   |             发送的请求需要有通过HTTP认证             |
|  403   |              请求资源的访问被服务端拒绝              |
|  404   |                服务器无法找到请求资源                |
|  5××   |                **服务端本身发生错误**                |
|  500   |                服务端在执行时发生错误                |
|  503   |               服务器超负荷，或停机维护               |

### HTTP的特点

优点：

1. 传输资源灵活，文本，文件等都可以传输，语义自由以key-value表示
2. 基于TCP/IP可靠传输
3. 传输有来有回

缺点：

1. 无状态
   + 在需要长连接的场景中，无法保存大量上下文信息，会造成传输大量重复资源，造成格外网络开销
2. 明文传输，大家都可以看到HTTP报文信息，提供了方便但也存在安全隐患
3. 对头堵塞
   + HTTP开启长连接时，公用一个TCP链接，同一时刻只能处理一个请求，若请求过长会造成其他请求堵塞

### 各种字段

#### Accept系列字段

#### 数据格式

> 用来相互标识数据格式

在HTTP中针对报文主体的数据类型，我们使用``Content-Type``字段在发送端来体现，接收端想要收到特定类型的数据，也可以用``Accept``字段

取值:

+ text： text/html, text/plain, text/css 等
+ image: image/gif, image/jpeg, image/png 等
+ audio/video: audio/mpeg, video/mp4 等
+ application: application/json, application/javascript, application/pdf, application/octet-stream

#### 编码压缩


> HTTP在传输数据时，可以通过编码提升传输速度。编码后的报文主体称为**实体主体**，发送端用``Content-Encoding``，接收方使用``Aceept-Encoding``

取值：

* gzip 目前最流行的压缩格式
* compress
* deflate
* identity(不进行编码)
* br

#### 语言支持

> 指定支持的语言，发送方用``Content-Language``，接收方用``Accept-Language``

取值：

+ zh-CH,zh,en等等

#### 字符集

> 指定使用的字符集，发送方附加到``Content-Type中``，接收方``Accept-Charset``

取值：

+ charset=utf-8

### 数据长度

#### 1. 定长数据

> 对于定长数据我们会带上``Content-Length``，长度<正常长度会截取数据，>无法正常发出显示

```javascript
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  if(req.url === '/') {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', 10);
    res.write("helloworld");
  }
})

server.listen(8081, () => {
  console.log("成功启动");
})
```

#### 2. 不定长包体

> 分块传输编码，发送端``Transfer-Encoding:chunked``，会忽略Content-Length，基于长连接持续推送动态内容

```javascript
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  if(req.url === '/') {
    res.setHeader('Content-Type', 'text/html; charset=utf8');
    res.setHeader('Content-Length', 10);
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write("<p>来啦</p>");
    setTimeout(() => {
      res.write("第一次传输<br/>");
    }, 1000);
    setTimeout(() => {
      res.write("第二次传输");
      res.end()
    }, 2000);
  }
})

server.listen(8009, () => {
  console.log("成功启动");
})
```

报文：

```http
HTTP/1.1 200 OK
Transfer-Encoding: chunked
Connection: keep-alive
Content-Type: text/html; charset=utf8
Date: Fri, 14 May 2021 06:42:32 GMT
Keep-Alive: timeout=4
Proxy-Connection: keep-alive

d
<p>来啦</p>
14
第一次传输<br/>
f
第二次传输
0
```

会使用16进制的数来表明长度

### 范围请求

> 使用``Range``字段来指定资源的byte范围，对于多重范围，标明首部字段``Content-Type:multipart/byteranges``，服务器要支持范围请求，必须带上``Accept-Ranges:none``

##### Range

> 按照bytes=x-y的格式来标明范围，越界416，正确206

如：

+ Range:bytes=0-9

+ Range:bytes=0-8,15-234  

对于多段数据：

+ Content-Type: multipart/byteranges;boundary=00000010101

  + boundary是响应体中的分隔符

    + ```http
      --00000010101
      Content-Type: text/plain
      Content-Range: bytes 0-9/96
      
      i am xxxxx
      --00000010101
      Content-Type: text/plain
      Content-Range: bytes 20-29/96
      
      eex jspy e
      --00000010101--
      ```

### 表单提交

在 http 中，有两种主要的表单提交的方式，体现在两种不同的`Content-Type`取值:

- application/x-www-form-urlencoded
- multipart/form-data

由于表单提交一般是`POST`请求，很少考虑`GET`，因此这里我们将默认提交的数据放在请求体中。

#### application/x-www-form-urlencoded

对于`application/x-www-form-urlencoded`格式的表单内容，有以下特点:

- 其中的数据会被编码成以`&`分隔的键值对
- 字符以**URL编码方式**编码。

如：

```http
// 转换过程: {a: 1, b: 2} -> a=1&b=2 -> 如下(最终形式)
"a%3D1%26b%3D2"
```

#### multipart/form-data

对于`multipart/form-data`而言:

- 请求头中的`Content-Type`字段会包含`boundary`，且`boundary`的值有浏览器默认指定。例: `Content-Type: multipart/form-data;boundary=----WebkitFormBoundaryRRJKeWfHPGrS4LKe`。
- 数据会分为多个部分，每两个部分之间通过分隔符来分隔，每部分表述均有 HTTP 头部描述子包体，如`Content-Type`，在最后的分隔符会加上`--`表示结束。

相应的`请求体`是下面这样:

```http
Content-Disposition: form-data;name="data1";
Content-Type: text/plain
data1
----WebkitFormBoundaryRRJKeWfHPGrS4LKe
Content-Disposition: form-data;name="data2";
Content-Type: text/plain
data2
----WebkitFormBoundaryRRJKeWfHPGrS4LKe--
```

``multipart/form-data``适合文件上传，省去了URL编码带来的时间空间损耗

### HTTP1.1解决对头堵塞

> 前情提要：HTTP请求一发一收，串行队列，会造成阻塞

1. 并发连接，一个域名允许分配多个长连接，相当于增加串行队列数，如Chrome中是6个
2. 域名分片，一台服务器可以搭建多个Web站点，但DNS进行域名解析后会指向同一个ip地址。因为这样，可以分配多个二级域名，虽然指向同一服务器，但支持的长连接多了。

### Cookie、Session、Token、JWT*

> 针对HTTP无状态的解决方法，用来保存一些状态。本质上是在浏览器中存一个小文件，同一域名下发送请求都会**自带Cookie**，服务器可以通过``Set-Cookie``来进行设置

形如：

+ Cookie:a=xxx;b=xxx
+ Set-Cookie:a=xxx

#### Cookie属性

---

##### 1. 有效期

通过**Expires**和**Max-Age**来设置

+ Expires是指过期时期
+ Max-Age是浏览器接收报文后间隔多长时间（秒）

过期Cookie将会自动删除，即不再携带Cookie字段发送

##### 2. 作用域

通过**domain**和**path**来设置，如果发送请求时发现路径或域名不匹配，则不会带上Cookie。对于路劲而言，``/``表示允许域名下任何路径访问Cookie

+ domain：子域名共享cookie数据如.baidu.com，主要用来支持一次登录后在子域名网站同步登录不用重新登录
+ path：有权访问Cookie的路径

##### 3. 安全

+ **Secure**只能支持HTTPS携带Cookie上传
+ **HttpOnly**只能通过HTTP来传输，JS访问不到，无法修改，预防*XSS攻击*
+ **SameSite**三个值，预防*CSRF攻击*
  + Strict只能在当前域名下携带Cookie
  + Lax只能在get提交的表单或a标签发送的get请求下可携带Cookie
  + None默认模式都会带上Cookie

#### 缺点

1. 大小很小，体积上限只有4kb
2. 都会带上Cookie会造成一定的资源浪费，设置作用域可一定程度避免
3. 安全性不是很好，有被截获篡改的风险

#### Session

> 是一种记录服务器和客户端会话状态的机制，本质基于Cookie
>
> **session存储在服务端，sessionId存放在cookie中**

![[session.webp]]

+ 比Cookie安全，客户端只保存sessionId
+ session失效时间一般较短，客户端关闭失效
+ 存储的数据类型多，大小比Cookie大

#### TOKEN

> 资源凭证，无状态实现

一般的token是由用户id，time，sign等组成的字符串进行加密。

![[token.jpg]]

+ 每一次都要携带放在HTTP的头部
+ 用解析时间换取session存储空间
+ TOKEN指认证授权可转让，共享。是针对一个用户和一个APP，如微信授权登录详情见微信开发者文档

#### JWT

> **目前最流行**的跨域认证解决方案，是一种**认证授权机制**，基于json的开放标准。
>
> JWT 的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息，以便于从资源服务器获取资源。比如用在用户登录上。

![[jwt.jpg]]

- JWT 认证流程：
  - 用户输入用户名/密码登录，服务端认证成功后，会返回给客户端一个 JWT
  - 客户端将 token 保存到本地（通常使用 localstorage，也可以使用 cookie）
- 当用户希望访问一个受保护的路由或者资源的时候，需要请求头的 Authorization 字段中使用Bearer 模式添加 JWT，其内容看起来是下面这样
  - ``Authorization: Bearer <token>``
- 服务端的保护路由将会检查请求头 Authorization 中的 JWT 信息，如果合法，则允许用户的行为
- 因为 JWT 是自包含的（内部包含了一些会话信息），因此减少了需要查询数据库的需要
- 因为 JWT 并不使用 Cookie 的，所以你可以使用任何域名提供你的 API 服务而不需要担心跨域资源共享问题（CORS）
- 因为用户的状态不再存储在服务端的内存中，所以这是一种无状态的认证机制

##### TOKEN和JWT区别

+ Token：服务端验证客户端发送过来的 Token 时，还需要查询数据库获取用户信息，然后验证 Token 是否有效。

+ JWT： 将 Token 和 Payload 加密后存储于客户端，服务端只需要使用密钥解密进行校验（校验也是 JWT 自己实现的）即可，不需要查询或者减少查询数据库，因为 JWT 自包含了用户信息和加密的数据。

### HTTP代理

> 代理服务器的引入，相当于在**客户端**和**服务端**之间增加了一个**中间人**的角色，它
>
> 作为客户端的服务器，服务器的客户端

作用：**利用缓存技术减少网络带宽流量，对特定网站的访问控制等等**

1. *负载均衡。客户端的请求只会先到达代理服务器，后面到底有多少源服务器，IP 都是多少，客户端是不知道的。因此，这个代理服务器可以拿到这个请求之后，可以通过特定的算法分发给不同的源服务器，让各台源服务器的负载尽量平均。*
2. **保障安全**。利用**心跳**机制监控后台的服务器，一旦发现故障机就将其踢出集群。并且对于上下行的数据进行过滤，对非法 IP 限流，这些都是代理服务器的工作。
3. **缓存代理**。将内容**缓存**到代理服务器，使得客户端可以直接从代理服务器获得而不用到源服务器那里。

#### 字段

+ 通过``Via``字段来记录代理服务器

  如：``客户端-> 代理服务器1 -> 代理服务器2 -> 源服务器``

  请求头：``Via: proxy_server1, proxy_server2``

  响应头：``Via: proxy_server2, proxy_server1``

+ X-Real-IP,X-Forwarded-Host,X-Forwarded-Proto，分别记录**客户端**的*IP、域名、协议名*

+ X-Forwarded-For上一次转发的*IP*

  + 会带来http报文修改，在https中原始报文不允许修改，使用**代理协议**进行解决（有兴趣自己查）
  
    

#### HTTP代理缓存

> 若客户端缓存失效，每次资源将会想服务端进行获取，这对于源服务器来说开销大，通过**缓存代理**的机制。让`代理服务器`接管一部分的服务端HTTP缓存，客户端缓存过期后**就近**到代理缓存中获取，代理缓存过期了才请求源服务器，这样流量巨大的时候能明显降低源服务器的压力。

服务端：

+ 在服务器端通过``Cache-Control``来进行缓存控制，private禁止代理缓存，public允许代理缓存。

+ #### s-maxage

  `s`是`share`的意思，限定了缓存在代理服务器中可以存放多久，和限制客户端缓存时间的`max-age`并不冲突。

如``Cache-Control: public, max-age=1000, s-maxage=2000``

客户端：

+ max-stale min-fresh控制代理服务器缓存可拿范围，前者过期后，后者过期前
+ only-if-cached只接收代理缓存

PS：数据转发还存在网关和隧道两种方式

### HTTP+加密+认证+完整性保护=HTTPS

---

> 通常HTTP直接和TCP通信，当使用SSL(会话层)时，则会先和SSL/TLS通信再由SSL/TLS和TCP通信

1. **HTTP的缺点**
   1. 通信使用明文，内容可能被窃听
   2. 不验证通信方的身份，可能被伪装
   3. 无法证明报文的完整性，可能已遭篡改(**中间人攻击**)
2. **HTTPS的缺点**
   1. 网络负载慢2倍以上，通信量增加
   2. 消耗CPU及内存资源，负载增强

#### 两种加密方式

1. **通信加密**

   ​	HTTP通过和TLS的组合使用，加密HTTP的通信内容。使用SSL建立安全通信线路后就可以在这条线上进行通信了。

2. **内容加密**

   ​	把HTTP报文里所含有的内容进行加密处理。前提是要求客户端和服务端都含有加密和解密机制。

##### 加密方法

1. **对称(共享)密钥加密**

   ​	加密解密使用相同密钥，但发送密钥本身就存在安全隐患。

2. **公开密钥加密**

   ​	采用一对非对称密钥，一个**私有密钥**，一个**公开密钥**。发送密文的一方使用对方的公开密钥进行加密，对方收到后使用自己的私有密钥进行解密，这样不用发送私有密钥。

3. **混合加密机制(HTTPS)**

   ​	公开密钥速度比共享密钥慢。使用公开密钥来交换在稍后使用的密钥，确保安全后使用共享密钥的方式进行通信。

---

#### HTTPS在传输的过程中会涉及到三个密钥：

服务器端的**公钥和私钥**，用来进行**非对称加密**

客户端生成的**随机密钥**，用来进行**对称加密**

一个HTTPS请求实际上包含了两次HTTP传输，可以细分为8步。

1. 客户端向服务器发起HTTPS请求，连接到服务器的443端
2. 服务器端有一个密钥对，即公钥和私钥，是用来进行非对称加密使用的，服务器端保存着私钥，不能将其泄露，公钥可以发送给任何人。
3. 服务器将自己的**公钥**发送给客户端。
4. 客户端收到服务器端的证书(*公钥在证书中*)之后，**会对证书进行检查（下文）**，验证其合法性，如果发现发现证书有问题，那么HTTPS传输就无法继续。如果公钥合格，那么客户端会生成一个随机值，这个随机值就是用于进行**对称加密的密钥**，我们将该密钥称之为client key，即客户端密钥，这样在概念上和服务器端的密钥容易进行区分。然后用服务器的**公钥对客户端密钥进行非对称加密**，这样客户端密钥就变成密文了，至此，HTTPS中的第一次HTTP请求结束。

5. 客户端会发起HTTPS中的第二个HTTP请求，将加密之后的客户端密钥发送给服务器。

6. 服务器接收到客户端发来的密文之后，会用**自己的私钥**对其进行非对称解密，解密之后的明文就是客户端密钥，然后用**客户端密钥对数据进行对称加密**，这样数据就变成了密文。

7. 然后服务器将加密后的密文发送给客户端。

8. 客户端收到服务器发送来的密文，用客户端密钥对其进行对称解密，得到服务器发送的数据。这样HTTPS中的第二个HTTP请求结束，整个HTTPS传输完成。

#### TLS证书确认通信双方

> 证书又值得信任的第三方机构颁发，用以证明服务器和客户端是**实际存在**的。

1. 服务器把自己的公开密钥登录至数字证书认证机构
2. 数字**证书认证机构用自己的私有密钥**向服务器的公开密码数字签名并颁发公钥证书
3. 客户端拿到服务器的公钥证书后，**使用数字证书认证机构的公开密钥**，向数字证书认证机构验证公钥证书上的数字签名，以确认服务器的公开密钥的真实性
   1. 数字证书认证机构的公开密钥已事先植入到浏览器里了

> 使用自签名证书，无法确认连接安全性或网站的安全证书存在问题。

#### 用户身份的认证

---

1. *BASIC认证/DIGEST认证*

   ​	*通过质询/响应的方式进行认证(401)，DIGEST比BASIC更安全点。用的很少这两种存在便利性和安全性问题。*

2. **TLS客户端认证**

   ​	将客户端证书分发给客户端安装以证明身份，安全系数很高。一般会结合表单认证

3. **表单认证(普遍采用)**

   ​	客户端向服务端发送登录信息，按登录信息验证。

