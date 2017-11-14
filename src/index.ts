import * as request from 'request'
import * as jdistsUtil from 'jdists-util'
import * as jsyaml from 'js-yaml'

interface IRequestAttrs extends jdistsUtil.IAttrs {
  /**
   * 访问地址
   */
  url: string
  /**
   * 头部信息
   */
  headers?: string
  /**
   * 方法名
   */
  method?: 'GET' | 'POST'
}

/**
 * request HTTP 请求
 *
 * @param content POST 内容
 * @param attrs 属性
 * @param attrs.url 访问地址
 * @param attrs.headers 头部信息
 * @param attrs.method 方法名
 * @param scope 作用域
 * @param scope.execImport 导入数据
 * @return 返回请求过程
 * @example processor():base
  ```js
  let attrs = {
    url: 'https://www.baidu.com/',
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor(null, attrs, scope).then(function (content) {
    console.log(content.indexOf('百度一下，你就知道') >= 0)
    // > true
  }).catch(function (err) {
    console.error(err)
    throw err
  })
  ```
 * @example processor():post
  ```js
  let attrs = {
    url: 'http://localhost:18081/',
    headers: `
      token: 123
    `
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor('x: 1', attrs, scope).then(function (content) {
    let obj = JSON.parse(content)
    console.log(obj.header.token)
    // > 123
    console.log(obj.method)
    // > POST
    // * done
  }).catch(function (err) {
    console.error(err)
    throw err
  })
  ```
 * @example processor():error
  ```js
  let attrs = {
    url: 'http://127.0.0.1:29999/!e!r!r',
    method: 'GET',
  }
  let scope = {
    execImport: function (importion) {
      return importion
    },
  }

  processor(null, attrs, scope).then(function (content) {
    throw 'case err'
  }).catch(function (err) {
    console.log(!!err)
    // > true
  })
  ```
 * @example processor():content is null
  ```js
  let attrs = {}
  let scope = {}
  processor(null, attrs, scope)
  // * throw
  ```
 */
export = (function (content: string, attrs: IRequestAttrs, scope: jdistsUtil.IScope): Promise<string> {
  if (!attrs.url) {
    throw 'Attribute "url" is undefined.'
  }

  return new Promise<string>((resolve, reject) => {
    let options: any = {
      url: scope.execImport(attrs.url),
    }
    if (attrs.headers) {
      options.headers = jsyaml.safeLoad(scope.execImport(attrs.headers))
    }
    if (attrs.method) {
      options.method = attrs.method
    } else {
      if (content) {
        options.method = 'POST'
      }
    }
    if (/^post$/i.test(options.method)) {
      options.form = jsyaml.safeLoad(content)
    }
    request(options, (err, req, body: string) => {
      if (err) {
        reject(err)
        return
      }
      resolve(body)
    })
  })
}) as jdistsUtil.IProcessor