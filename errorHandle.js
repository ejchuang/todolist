function errorHandle(res){
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',//跨網域
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',//支援請求方法
        'Content-Type': 'application/json'
     };
     res.writeHead(400,headers);//400錯誤
     res.write(JSON.stringify({
         "status":"false",
         "messsage":"欄位未填寫正確，或無此todo id"
     }));
     res.end();
}

module.exports = errorHandle;