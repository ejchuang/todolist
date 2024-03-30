const http = require('http');//載入內建http模組
const { v4: uuidv4 } = require('uuid');//載入外部NPM套件uuid
const errorHandle = require('./errorHandle');//載入自己寫的模組
const todos = [];
const requestListener = (req,res) =>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',//跨網域
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',//支援請求方法
        'Content-Type': 'application/json'
     };
    
    let body = "";

    req.on('data',chunk=>{
        body+=chunk;
    });
   
    if(req.url =="/todos"&&req.method == "GET"){ //偵測使用者請求首頁與方法
        res.writeHead(200,headers);//寫表頭、回傳文字格式
        res.write(JSON.stringify({
            "status":"success",
            "data":todos //回傳資料
        }));//將JSON物件解析成字串後回傳
        res.end();
    }else if(req.url =="/todos"&&req.method == "POST"){ 
        req.on('end',chunk=>{
            try {
                const title = JSON.parse(body).title;
                if(title != undefined){
                    const todo ={
                        "title":title,
                        "id":uuidv4()
                    }
                    todos.push(todo);
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status":"success",
                        "data":todos
                    }));
                    res.end();
                }else{
                    errorHandle(res);
                }
            } catch (error) {
                errorHandle(res);
            }
        });      
    }else if(req.url =="/todos"&&req.method == "DELETE"){
        todos.length = 0; //刪除全部的方法
        res.writeHead(200,headers);
        res.write(JSON.stringify({
            "status":"success",
            "data":todos, 
        }));
        res.end();
    }else if(req.url.startsWith("/todos/") && req.method == "DELETE"){
        const id = req.url.split('/').pop();//取出id
        const index = todos.findIndex(element => element.id == id);//取得id的index
        if(index !== -1){
            todos.splice(index,1);//刪除指定index的資料
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                "status":"success",
                "data":todos 
            }));
            res.end();
        }else{
            errorHandle(res);
        }
    }else if(req.url.startsWith("/todos/") && req.method == "PATCH"){
        req.on('end',()=>{
            try {
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id == id);//取得id的index
                if(todo !== undefined && index !== -1){
                    todos[index].title = todo;
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status":"success",
                        "data":todos 
                    }));
                    res.end();
                }else{
                    errorHandle(res);
                }
            } catch (error) {
                errorHandle(res);
            }
        })
    }else if(req.method == "OPTIONS"){ //preflight機制
        res.writeHead(200,headers);
        res.end();
    }else{ //請求非首頁路徑
        res.writeHead(404,headers);//設定狀態為404
        res.write(JSON.stringify({
            "status":"false",
            "message":"無此網站路由"//回傳錯誤訊息
        }));
        res.end();
    }
    
}
const server = http.createServer(requestListener);
server.listen(3005);